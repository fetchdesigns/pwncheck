import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  sha1,
  parseInputFile,
  escapeCsv,
  delay,
  renderProgressBar,
  hashCache,
  HASH_PREFIX_LENGTH,
} from '../pwncheck.js';

describe('sha1', () => {
  it('should return uppercase SHA-1 hash', () => {
    // Known hash for "password"
    const result = sha1('password');
    assert.strictEqual(result, '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8');
  });

  it('should return 40 character hash', () => {
    const result = sha1('test');
    assert.strictEqual(result.length, 40);
  });

  it('should return consistent results', () => {
    const hash1 = sha1('mypassword');
    const hash2 = sha1('mypassword');
    assert.strictEqual(hash1, hash2);
  });

  it('should produce different hashes for different inputs', () => {
    const hash1 = sha1('password1');
    const hash2 = sha1('password2');
    assert.notStrictEqual(hash1, hash2);
  });
});

describe('parseInputFile', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pwncheck-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('plain text files', () => {
    it('should parse one password per line', () => {
      const filePath = path.join(tempDir, 'passwords.txt');
      fs.writeFileSync(filePath, 'password1\npassword2\npassword3');

      const result = parseInputFile(filePath);

      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].password, 'password1');
      assert.strictEqual(result[1].password, 'password2');
      assert.strictEqual(result[2].password, 'password3');
    });

    it('should track original line numbers', () => {
      const filePath = path.join(tempDir, 'passwords.txt');
      fs.writeFileSync(filePath, 'first\nsecond\nthird');

      const result = parseInputFile(filePath);

      assert.strictEqual(result[0].originalLineNumber, 1);
      assert.strictEqual(result[1].originalLineNumber, 2);
      assert.strictEqual(result[2].originalLineNumber, 3);
    });

    it('should skip blank lines', () => {
      const filePath = path.join(tempDir, 'passwords.txt');
      fs.writeFileSync(filePath, 'password1\n\npassword2\n\n\npassword3');

      const result = parseInputFile(filePath);

      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].originalLineNumber, 1);
      assert.strictEqual(result[1].originalLineNumber, 3);
      assert.strictEqual(result[2].originalLineNumber, 6);
    });

    it('should trim whitespace', () => {
      const filePath = path.join(tempDir, 'passwords.txt');
      fs.writeFileSync(filePath, '  password1  \n\tpassword2\t');

      const result = parseInputFile(filePath);

      assert.strictEqual(result[0].password, 'password1');
      assert.strictEqual(result[1].password, 'password2');
    });
  });

  describe('CSV files', () => {
    it('should extract first column as password', () => {
      const filePath = path.join(tempDir, 'passwords.csv');
      fs.writeFileSync(filePath, 'password1,user1,email1\npassword2,user2,email2');

      const result = parseInputFile(filePath);

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].password, 'password1');
      assert.strictEqual(result[1].password, 'password2');
    });

    it('should handle quoted fields', () => {
      const filePath = path.join(tempDir, 'passwords.csv');
      fs.writeFileSync(filePath, '"quoted password",user1,email1');

      const result = parseInputFile(filePath);

      assert.strictEqual(result[0].password, 'quoted password');
    });

    it('should handle quoted fields with commas', () => {
      const filePath = path.join(tempDir, 'passwords.csv');
      fs.writeFileSync(filePath, '"password,with,commas",user1,email1');

      const result = parseInputFile(filePath);

      assert.strictEqual(result[0].password, 'password,with,commas');
    });

    it('should handle escaped quotes in quoted fields', () => {
      const filePath = path.join(tempDir, 'passwords.csv');
      fs.writeFileSync(filePath, '"pass""word",user1,email1');

      const result = parseInputFile(filePath);

      assert.strictEqual(result[0].password, 'pass"word');
    });

    it('should handle unquoted fields', () => {
      const filePath = path.join(tempDir, 'passwords.csv');
      fs.writeFileSync(filePath, 'simplepassword,user1,email1');

      const result = parseInputFile(filePath);

      assert.strictEqual(result[0].password, 'simplepassword');
    });
  });
});

describe('escapeCsv', () => {
  it('should return empty string for null', () => {
    assert.strictEqual(escapeCsv(null), '');
  });

  it('should return empty string for undefined', () => {
    assert.strictEqual(escapeCsv(undefined), '');
  });

  it('should pass through simple strings', () => {
    assert.strictEqual(escapeCsv('hello'), 'hello');
  });

  it('should quote strings with commas', () => {
    assert.strictEqual(escapeCsv('hello,world'), '"hello,world"');
  });

  it('should quote strings with quotes and escape them', () => {
    assert.strictEqual(escapeCsv('say "hello"'), '"say ""hello"""');
  });

  it('should quote strings with newlines', () => {
    assert.strictEqual(escapeCsv('line1\nline2'), '"line1\nline2"');
  });

  it('should convert numbers to strings', () => {
    assert.strictEqual(escapeCsv(123), '123');
  });
});

describe('delay', () => {
  it('should delay for approximately the specified time', async () => {
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;

    assert.ok(elapsed >= 45, `Expected at least 45ms, got ${elapsed}ms`);
    assert.ok(elapsed < 100, `Expected less than 100ms, got ${elapsed}ms`);
  });
});

describe('renderProgressBar', () => {
  it('should return correct percentage', () => {
    const result = renderProgressBar(50, 100);
    assert.strictEqual(result.percent, '50.0');
  });

  it('should handle 0 total', () => {
    const result = renderProgressBar(0, 0);
    assert.strictEqual(result.percent, '0.0');
  });

  it('should not exceed 100%', () => {
    const result = renderProgressBar(150, 100);
    assert.strictEqual(result.percent, '100.0');
  });

  it('should return found count', () => {
    const result = renderProgressBar(10, 100, 5);
    assert.strictEqual(result.found, 5);
  });

  it('should return a bar string', () => {
    const result = renderProgressBar(50, 100);
    assert.ok(typeof result.bar === 'string');
    assert.ok(result.bar.length > 0);
  });
});

describe('HASH_PREFIX_LENGTH', () => {
  it('should be 5 for k-anonymity', () => {
    assert.strictEqual(HASH_PREFIX_LENGTH, 5);
  });
});

describe('hashCache', () => {
  beforeEach(() => {
    hashCache.clear();
  });

  it('should be a Map', () => {
    assert.ok(hashCache instanceof Map);
  });

  it('should start empty', () => {
    assert.strictEqual(hashCache.size, 0);
  });
});
