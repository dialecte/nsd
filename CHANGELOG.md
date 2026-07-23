# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2026-07-23

### Changed

- Bump `@dialecte/core` to `0.4.7`

## [0.1.7] - 2026-07-22

- Bump `@dialecte/core` to `0.4.6` - ExtendedDocument

## [0.1.6] - 2026-07-21

### Changed

- Bump `@dialecte/core` to `0.4.5`

## [0.1.5] - 2026-07-09

### Changed

- Bump `@dialecte/core` to `0.4.2`
- Update to typescript 7

## [0.1.4] - 2026-07-07

### Changed

- Bump `@dialecte/core` to `0.4.0`

## [0.1.3] - 2026-07-06

- Bump `@dialecte/core` to `0.3.0` - hooks on the Project instance + standardization at every record entry point. No dialecte changes needed (nsd wires no config hooks).

## [0.1.2] - 2026-06-29

- Bump `@dialecte/core` to `0.2.22` - fix withAllExtensions

## [0.1.1] - 2026-06-29

- Bump `@dialecte/core` to `0.2.21` - add `snapshots`

## [0.1.0] - 2026-06-26

### Changed

- **BREAKING:** versioned layout — source moved to `src/v2017A/`; the package now exports `./v2017A` (and `./v2017A/test`) only. Consumers must import `@dialecte/nsd/v2017A`.
- Build externalizes `@dialecte/core` + `dexie` (no longer bundled).

### Added

- Type-performance CI gates (`type-bench:check` + `type-narrowing`) via `@dialecte/cli`, with benchmarks under `benchmarks/types/v2017A/`.

## [0.0.5] - 2026-06-11

### Fixed

- Test utils namespace

## [0.0.4] - 2026-06-10

### Added

- Bump `@dialecte/core` to `0.2.19` - add `xmlns` key name

## [0.0.3] - 2026-06-10

### Added

- missing `xsi` namespace
- dialecte test utils

## [0.0.2] - 2026-06-09

### Fixed

- Added missing elements to the definition, after updating the generation script

## [0.0.1] - 2026-05-13

### Added

- Dialecte initialization
