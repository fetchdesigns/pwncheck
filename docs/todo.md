# TODO

Ideas for future improvement.

## High Priority

- [ ] Add real unit tests (currently "test" script just runs lint/format)

## Features

- [ ] Add `--help` flag to document all CLI options
- [ ] Add `--version` flag with automated version management (use standard-version like version-monitor)
- [ ] Add `--skip-header` flag for CSV files with header rows
- [ ] Add `--column` flag to specify which column contains passwords
- [ ] Add `--quiet` mode for scripting/piping

## Security / DevOps

- [ ] Add Dependabot or Renovate config for automated dependency updates
- [ ] Pin exact dependency versions for reproducible builds
- [ ] Add npm audit to CI pipeline (currently only runs on pre-push locally)
