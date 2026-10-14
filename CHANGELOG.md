# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-10-14

### Changed

- **Breaking (types): an element that may take another type with `xsi:type` is a union on `'xsi:type'`**, one named member per type (`AttributesConstructedAttribute_tServiceConstructedAttribute`; `_Own` for the element's own attributes). An attribute only one type declares is typed on that member: write it with the type, `addChild(parent, { tagName: 'ConstructedAttribute', attributes: { 'xsi:type': 'tServiceConstructedAttribute', name, titleID, typeKindParameterized } })`. A filter may leave the type out and match across types, or name it to narrow. Generated with `@dialecte/create` 0.1; a test checks the config's namespaces agree with the definition.
- Requires `@dialecte/core` 0.6.1: `assertValidNsdXml`, `runNsdTestCases` and `createNsdTestProject` check the attributes of every namespace and allow what an element's attribute wildcard allows - a fixture carrying an attribute its element does not declare now fails.

## [0.3.0] - 2026-10-14

### Changed

- **Breaking - built on `@dialecte/core` 0.6 and the definition `@dialecte/create` 0.1 writes.** `DEFINITION` has the new shape: a tag declared several ways lists its declarations, a value's facets sit in its datatype, identity constraints sit on the declaration that declares them, and `TYPES` holds the types an element may take with `xsi:type`. `NSD_DIALECTE_CONFIG` carries `types`. Code that reads `DEFINITION` directly must follow; code that goes through `query.getDefinition` gets the declaration that applies.
- **Breaking:** an element's attribute type (`AttributesOf`) lists its declaration's attributes only; `xsi:type` is an optional key, only where the element may name a type.

## [0.2.1] - 2026-09-29

### Added

- `runNsdTestCases` and `createNsdTestProject` check every fixture against the NSD schema before running; `assertValidNsdXml` is exported for your own checks.

## [0.2.0] - 2026-09-29

### Added

- The definition describes types and structure: `type` on attributes and text, `contentModel`, `nillable`, `anyNamespace`, text `default` / `fixed`.

### Changed

- Requires `@dialecte/core` 0.5.1.
- Regenerating the definition needs `--root NS`: the schema lets four elements start a document.

### Fixed

- `DataAttribute`, `SubDataObject` and `ServiceParameter` are identified by their `name`, as the schema says.

## [0.1.9] - 2026-07-27

- Bump `@dialecte/core` to `0.4.9`

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
