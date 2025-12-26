# Have I Been Pwned Password Checker

A Node.js script that checks passwords against the Have I Been Pwned API with intelligent caching to prevent duplicate API calls.

## Features

- **k-Anonymity**: Only sends the first 5 characters of the SHA-1 hash to the API (never sends actual passwords)
- **Smart Caching**: Caches API responses to avoid duplicate calls for passwords with the same hash prefix
- **Multiple Formats**: Supports plain text files (one password per line) or CSV files
- **Rate Limiting**: Includes delays between API calls to be respectful to the service
- **Progress Tracking**: Shows real-time progress and cache efficiency statistics

## Usage

```bash
# Make the script executable (optional)
chmod +x pwncheck.js

# Run with a text file
node pwncheck.js examples/passwords.txt

# Run with a CSV file
node pwncheck.js examples/passwords.csv

# Export results to CSV (line number + pwned count)
node pwncheck.js examples/passwords.txt --export-csv

# Export results to CSV including passwords (sensitive)
node pwncheck.js examples/passwords.txt --export-csv --include-passwords --export-file results.csv
```

## Installation as CLI Command

To run `pwncheck.js` from anywhere in your terminal, add it to your PATH. The examples below assume the project is in the `~/pwncheck` directory. Adjust the path to match your setup.

**macOS (Zsh):**

```bash
# Add to PATH
echo 'export PATH="$HOME/pwncheck:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Now you can run from anywhere
pwncheck.js passwords.txt
```

**WSL / Linux (Bash):**

```bash
# Add to PATH
echo 'export PATH="$HOME/pwncheck:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Now you can run from anywhere
pwncheck.js passwords.txt
```

## Input File Formats

### Plain Text

```
password123
mySecureP@ssw0rd!
qwerty
```

### CSV

1. **Passwords must be in the first column** — other columns (username, email, etc.) are ignored
2. **Remove any header row** — the script processes all rows, so a header like `password,username` would be checked as a password

```csv
password123,user1,user1@example.com
"mySecureP@ssw0rd!",user2,user2@example.com
"password,with,commas",user3,user3@example.com
qwerty,user4,user4@example.com
```

## Example Output

```
Parsing passwords...
Found 6 password(s) to check

Progress: 6/6 (100.0%)

--- Results ---

(Line numbers correspond to your input file)

Line 1: ✗ PWNED (2,031,380 times)
Line 2: ✓ Safe
Line 3: ✗ PWNED (21,969,901 times)
Line 4: ✗ PWNED (1,138,064 times)
Line 5: ✗ PWNED (4,709,969 times)
Line 6: ✗ PWNED (6,298,374 times)

--- Summary ---
Total passwords checked: 6
Safe passwords: 1
Pwned passwords: 5

API calls made: 6
Results from cache: 0
Cache efficiency: 0.0%
```

### Exporting Results to CSV

By default, passwords are not displayed in the console for security. You can export results to a CSV file instead:

```bash
# Basic CSV export (line_number, pwned_count)
node pwncheck.js examples/passwords.txt --export-csv

# CSV export including passwords (adds a password column)
node pwncheck.js examples/passwords.txt --export-csv --include-passwords --export-file results.csv
```

When `--export-csv` is used without an explicit output path, a file named like
`pwned-password-results-<timestamp>.csv` will be created in the current directory.

Columns in the CSV:

- `line_number` – line in your input file
- `pwned_count` – number of times the password was seen in breaches (blank if an error occurred)
- `password` – column is only added when `--include-passwords` is used and is populated **only for pwned entries** (blank for safe/error rows)

> ⚠️ If you use `--include-passwords`, the export file will contain raw compromised passwords.
> Treat this file as highly sensitive and store/delete it accordingly.

## How It Works

1. Reads passwords from input file
2. Calculates SHA-1 hash of each password
3. Sends only the first 5 characters of the hash to the API
4. API returns all hash suffixes matching that prefix
5. Script checks locally if the full hash matches any results
6. Results are cached to avoid duplicate API calls for similar passwords

## Privacy & Security

- Passwords are never sent over the network
- Uses k-anonymity model (only 5-char hash prefix is sent)
- API cannot determine which specific password you're checking
- All password hashing is done locally

## API Information

This script uses the [Have I Been Pwned Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords) which is free to use.
