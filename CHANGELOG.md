# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-11-04

### Changed

- **The repository's tooling runs on `@dialecte/cli` 0.3.1** (nothing changes for a consumer): the package declares the contributor profile, so the docs build and the type bench run in `dialecte contrib` instead of the gate; the tests run with the runner's defaults; the commit hook checks types, lint and format (`npm run check`), runs the tests through `dialecte gate --hook` (answered by a green `gate --full` of the committed tree), then builds.

## [0.5.0] - 2026-11-02

### Changed

- **Breaking:** requires `@dialecte/core` 0.8.0.
- **Breaking: the `Project` that `createNsdProject` returns exports with one object, as `@dialecte/core` 0.8.0 does.** `project.export({ documentId, indent?, withDatabaseIds?, xmlDocument?, download? })` returns `{ file, filename }`, `file` the XML as a `Blob` (`await file.text()` reads it), and with `xmlDocument: true` also `xmlDocument`, the DOM parsed in the page (in a browser only); it was `project.export(documentId, { withDatabaseIds, withDownload })` returning `{ xmlDocument, filename }`. `project.exportBlob({ blobId, download? })` takes one object too and still returns `{ entry, data, filename }`; it was `project.exportBlob(blobId, { withDownload })`.
- **Breaking: the `Project` that `createNsdProject` returns imports as `@dialecte/core` 0.7.0 does** (this package goes from core 0.6.1 to 0.8.0). `project.import(files)` returns one entry per file (`{ status: 'imported', fileName, documentId, recordCount, diagnostics }` or `{ status: 'failed', fileName, error }`) and no longer rejects for one file; `project.importFile(file)` imports one file and returns it, or throws what failed (`PARSE_ERROR` for a malformed file); `project.close()` returns a promise. A caller that read `(await project.import([file]))[0].documentId` calls `project.importFile(file)`.
- **Breaking (`@dialecte/nsd/v2017A/test`): `assertValidNsdXml` takes one object**, `assertValidNsdXml({ xml, label?, requireComplete? })` (was `assertValidNsdXml(xml, label?, { requireComplete? })`). Text that is not well-formed fails as `<label>: malformed XML - <line>:<column> <reason>`.
- **Breaking (`@dialecte/nsd/v2017A/test`): `assertExpectedElementQueries` and `assertUnexpectedElementQueries` take XML text only**, `{ xml, queries }` (was `{ xmlDocument, queries }`). A caller holding a project exports the document with `project.export({ documentId })` and passes `await file.text()`. All the XML assertions read XML with libxml2, the same in node and in a browser.
- **Breaking (`@dialecte/nsd/v2017A/test`): a project `createNsdTestProject` opens inside a running test is destroyed when that test ends.** Open it in `beforeAll` to keep it across tests; it is then the caller's to destroy.
- **The test helpers need no browser; this package's tests run in node by default.** `createNsdTestProject` and `runNsdTestCases` open their projects on the store the test runner chose. A consumer runs its NSD tests in node by giving its node test project a setup file that calls core's `useTestStorage({ type: 'inMemory' })`. Here, `npm test` runs every unit test in node on the in-memory store (the `node` project), then the browser-only list in Chromium (`browser`, empty today); `npm run test:browser:all` runs the whole suite in Chromium (`browser-all`), as a pull request does. The tiers are on the test helpers page (Test tiers of this package).

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
