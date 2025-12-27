# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2025-12-27)

### Features

- add --version/-v flag with standard-version support ([0394eb5](https://github.com/fetchdesigns/pwncheck/commit/0394eb524a77e580729c4f3299d4fb91d70df74f))
- add CSV export and secure password handling ([169e34a](https://github.com/fetchdesigns/pwncheck/commit/169e34a8994b2d548bce63b4a60f2bb862d98b6e))
- add Have I Been Pwned password checker ([631150d](https://github.com/fetchdesigns/pwncheck/commit/631150d5027fb11eddb4c87127d8457bfad8573f))
- add husky hooks, eslint, prettier, commitlint, and gitleaks ([58cdc4d](https://github.com/fetchdesigns/pwncheck/commit/58cdc4dc158f7d48b47947eebf39a16a8d613ecb))
- add line number tracking and rename README ([92d39bf](https://github.com/fetchdesigns/pwncheck/commit/92d39bfff9bfce784ac921ff7a70c669d5fab27d))
- **pwned-password:** add progress bar ([a299174](https://github.com/fetchdesigns/pwncheck/commit/a299174005952305f734937444921f79b007f604))

### Bug Fixes

- add graceful error handling for missing input file ([04e0c8f](https://github.com/fetchdesigns/pwncheck/commit/04e0c8f7f5c7b7e9f507ee293aed0f13357efcd9))

### Code Refactoring

- rename to pwncheck ([f071831](https://github.com/fetchdesigns/pwncheck/commit/f071831f5074d5d8dd5f75018d95cede8c9ebd71))

## 1.0.0 (2025-12-27)

Initial release of pwncheck - a CLI tool to check passwords against the Have I Been Pwned API.

### Features

- Password checking using Have I Been Pwned API with k-anonymity
- CSV export with optional password inclusion
- Progress bar with intelligent rate limiting
- Line number tracking for easy identification
- `--version` flag with automated version management
- Full development tooling (ESLint, Prettier, Husky, commitlint, gitleaks)
- Comprehensive unit tests with Node.js test runner
- Exact dependency version pinning for reproducibility
