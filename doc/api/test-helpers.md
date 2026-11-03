---
description: Test helpers for @dialecte/nsd — createNsdTestProject, runNsdTestCases, fixture validation, XML assertions, and namespace constants.
---

# Test Helpers

`@dialecte/nsd` ships a test entry point with NSD-specific utilities. Import from `@dialecte/nsd/v2017A/test`:

```ts
import {
	runNsdTestCases,
	createNsdTestProject,
	createNsdTestRecord,
	assertValidNsdXml,
	assertExpectedElementQueries,
	assertUnexpectedElementQueries,
	XMLNS_NSD_NAMESPACE,
	ALL_XMLNS_NAMESPACES,
	CUSTOM_RECORD_ID_ATTRIBUTE,
	CUSTOM_RECORD_ID_ATTRIBUTE_NAME,
} from '@dialecte/nsd/v2017A/test'
```

All helpers are wired to the NSD config internally — no config argument needed. Every fixture is checked against the schema before it runs — see [Fixture validation](#fixture-validation).

## runNsdTestCases

Table-driven async runner backed by a real project, on the store the runner chose (see [Test tiers of this package](#test-tiers-of-this-package)). Pre-bound to the NSD dialecte config.

Two methods enforce the right contract at call-site.

| Method                          | Use when                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `runNsdTestCases.withExport`    | `act` performs transactions, assertions on exported XML (`Promise<NsdTest.ActResult>`) |
| `runNsdTestCases.withoutExport` | `act` asserts directly on query results (`Promise<void>`)                              |
| `runNsdTestCases.generic`       | Sync pure-function tests — no XML, no DB                                               |

### Scenario 1 - query assertions only (act returns void)

Use when `act` asserts directly on query results via `expect`. No XML export needed.

```ts
import {
	runNsdTestCases,
	ALL_XMLNS_NAMESPACES,
	CUSTOM_RECORD_ID_ATTRIBUTE,
} from '@dialecte/nsd/v2017A/test'
import { describe, expect } from 'vitest'

import type { NsdTest } from '@dialecte/nsd/v2017A/test'

type TestCase = NsdTest.BaseXmlTestCase & {
	expectedCount: number
}

const testCases: NsdTest.TestCases<TestCase> = {
	'no LNClass elements → empty array': {
		sourceXml: `<NS ${ALL_XMLNS_NAMESPACES} ${CUSTOM_RECORD_ID_ATTRIBUTE}="ns-1"/>`,
		expectedCount: 0,
	},
	'two LNClass elements → count 2': {
		sourceXml: `
			<NS ${ALL_XMLNS_NAMESPACES}>
				<LNClasses ${CUSTOM_RECORD_ID_ATTRIBUTE}="lnclasses-1">
					<LNClass name="XCBR" ${CUSTOM_RECORD_ID_ATTRIBUTE}="lnclass-1"/>
					<LNClass name="XSWI" ${CUSTOM_RECORD_ID_ATTRIBUTE}="lnclass-2"/>
				</LNClasses>
			</NS>
		`,
		expectedCount: 2,
	},
}

async function act({ source, testCase }: NsdTest.ActParams<TestCase>): Promise<void> {
	const root = await source.document.query.getRoot()
	const { LNClass: lnClasses } = await source.document.query.findDescendants(root)
	expect(lnClasses).toHaveLength(testCase.expectedCount)
}

describe('getLNClasses', () => {
	runNsdTestCases.withoutExport({ testCases, act })
})
```

### Scenario 2 - XML export assertions (act returns ActResult)

Use when `act` performs transactions and assertions must run on the exported XML via XPath. `act` returns an optional `ActResult` to choose which document to assert on (defaults to `source`) and toggle `withDatabaseIds`.

```ts
import { runNsdTestCases, ALL_XMLNS_NAMESPACES } from '@dialecte/nsd/v2017A/test'
import { describe } from 'vitest'

import type { NsdTest } from '@dialecte/nsd/v2017A/test'

type TestCase = NsdTest.BaseXmlTestCase & {
	lnClassName: string
}

const testCases: NsdTest.TestCases<TestCase> = {
	'adds LNClass under LNClasses → LNClass present in export': {
		sourceXml: `
			<NS ${ALL_XMLNS_NAMESPACES}>
				<LNClasses/>
			</NS>
		`,
		lnClassName: 'XCBR',
		expectedQueries: ['//default:LNClasses/default:LNClass[@name="XCBR"]'],
	},
}

async function act({ source, testCase }: NsdTest.ActParams<TestCase>): Promise<NsdTest.ActResult> {
	await source.document.transaction(async (tx) => {
		// perform mutations
	})
	return { assertOn: 'source' }
}

describe('addLNClass', () => {
	runNsdTestCases.withExport({ testCases, act })
})
```

After `act` returns, `runNsdTestCases.withExport` exports the chosen document and runs XPath assertions from `expectedQueries` / `unexpectedQueries`.

Use `runNsdTestCases.withoutExport` when no export is needed — `act` returns `Promise<void>`, XPath assertions are skipped.

---

## createNsdTestProject

Lower-level helper for tests that need manual control over intermediate assertions, multi-step verification, or transactions outside `runNsdTestCases`. Spins up a real `Project`, on the store the runner chose, with the source (and optionally target) file imported, and returns pre-opened documents.

Call it inside a running test (its body or a `beforeEach`). The test owns the project until it finishes; then the project is destroyed, so you need not destroy it yourself. A project opened outside a running test (in `beforeAll`, to keep it across tests) stays the caller's: destroy it in `afterAll`.

```ts
async function createNsdTestProject(params: {
	sourceXml: string
	targetXml?: string
}): Promise<NsdTest.TestProjectResult>
```

The returned `TestProjectResult` shape:

```ts
{
	project: Nsd.Project
	source: { documentId: string; document: Nsd.Document }
	target?: { documentId: string; document: Nsd.Document }
}
```

```ts
import {
	createNsdTestProject,
	ALL_XMLNS_NAMESPACES,
	CUSTOM_RECORD_ID_ATTRIBUTE,
} from '@dialecte/nsd/v2017A/test'

const { source } = await createNsdTestProject({
	sourceXml: `
		<NS ${ALL_XMLNS_NAMESPACES}>
			<LNClasses>
				<LNClass name="XCBR" ${CUSTOM_RECORD_ID_ATTRIBUTE}="lnclass-1"/>
			</LNClasses>
		</NS>
	`,
})

const root = await source.document.query.getRoot()
const { LNClass: lnClasses } = await source.document.query.findDescendants(root)
expect(lnClasses).toHaveLength(1)
```

Use `runNsdTestCases` when the test fits the standard source → act → assert shape. Use `createNsdTestProject` directly when:

- Asserting intermediate states between transactions
- Multiple exports at different stages

---

## Fixture validation

`runNsdTestCases.withExport`, `runNsdTestCases.withoutExport` and `createNsdTestProject` check every fixture (`sourceXml`, `targetXml`) against the NSD schema before anything runs. A mistyped tag, a wrong namespace or an unknown attribute fails loudly — the runners report every invalid case at once — instead of the suite quietly testing something else.

The check is structural:

- every element's namespace matches its parent context
- every element is an allowed child of its parent
- every attribute is one its element declares, in whatever namespace the package declares, or one the element's attribute wildcard allows

`xmlns` declarations, `xsi:*` attributes and `dev:db-id` are always allowed. Elements unknown to the schema, and elements in a namespace the package does not declare, are skipped.

Required attributes are not required there: the runners and `createNsdTestProject` pass `requireComplete: false`, so a minimal fixture may leave them out (`<NS>` without `id` and `version`, `<LNClass name="XCBR"/>` without `titleID`).

### assertValidNsdXml

The same check, for your own fixtures. Throws when the XML is not valid NSD.

```ts
import { assertValidNsdXml } from '@dialecte/nsd/v2017A/test'

assertValidNsdXml({ xml }) // required attributes checked
assertValidNsdXml({ xml, label: 'targetXml', requireComplete: false })
```

It takes one object, `assertValidNsdXml({ xml, label?, requireComplete? })`:

| Property          | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `xml`             | The document to check, as XML text                                          |
| `label`           | Names the document in the error message. Optional.                          |
| `requireComplete` | Also require every schema-required attribute to be present. Default `true`. |

The XML is read with libxml2, the same in node and in a browser. Text that is not well-formed fails as `<label>: malformed XML - <line>:<column> <reason>`.

---

## createNsdTestRecord

Factory for typed in-memory records without a database. Useful for unit-testing pure functions that operate on `RawRecord` or `TrackedRecord`.

```ts
const record = createNsdTestRecord({
	record: { tagName: 'LNClass', attributes: { name: 'XCBR' } },
})
```

---

## XML assertions

`assertExpectedElementQueries` and `assertUnexpectedElementQueries` run XPath assertions against XML text, `{ xml, queries }`, parsed once per call with libxml2 (the same in node and in a browser). Both use the NSD namespace map.

Use directly when calling `createNsdTestProject` and exporting yourself: `project.export({ documentId })` answers `{ file, filename }`, and `await file.text()` is the XML.

```ts
const { file } = await project.export({ documentId: source.documentId })
const xml = await file.text()
assertExpectedElementQueries({
	xml,
	queries: ['//default:LNClasses/default:LNClass[@name="XCBR"]'],
})
assertUnexpectedElementQueries({ xml, queries: ['//default:LNClass[@name="deleted"]'] })
```

A failure says why in labelled lines: the steps of the query that matched, the step that failed, where the last match sits and what the failing step finds there without its predicates. Text that is not well-formed fails as `queried XML: malformed XML - <line>:<column> <reason>`.

---

## Stable record IDs with dev:db-id

`createNsdTestProject` always imports with `useCustomRecordsIds: true`. Any `dev:db-id` attribute in the XML becomes the actual database record ID — no lookups needed in `act`.

```xml
<LNClasses dev:db-id="lnclasses-1">
	<LNClass name="XCBR" dev:db-id="lnclass-1"/>
</LNClasses>
```

```ts
// Reference by stable ID directly
await tx.addChild(
	{ tagName: 'LNClasses', id: 'lnclasses-1' },
	{ tagName: 'LNClass', attributes: { name: 'XSWI' } },
)
```

Because `runNsdTestCases` exports with `withDatabaseIds: true`, XPath can assert by ID:

```ts
expectedQueries: ['//default:LNClasses[@dev:db-id="lnclasses-1"]/default:LNClass[@name="XSWI"]']
```

### Deterministic UUIDs for new elements

During `act`, `crypto.randomUUID` is replaced with a counter mock — IDs for newly created elements are `"0"`, `"1"`, `"2"`, ... in creation order. Setup always uses real UUIDs to avoid collisions between parallel tests.

---

## Namespace constants

| Constant                          | Value                                                        |
| --------------------------------- | ------------------------------------------------------------ |
| `XMLNS_NSD_NAMESPACE`             | `xmlns="http://www.iec.ch/61850/2016/NSD"`                   |
| `ALL_XMLNS_NAMESPACES`            | NSD namespace + dev namespace + xsi namespace combined       |
| `CUSTOM_RECORD_ID_ATTRIBUTE`      | `dev:db-id="..."` — attribute string for use in XML fixtures |
| `CUSTOM_RECORD_ID_ATTRIBUTE_NAME` | `db-id` — the attribute's local name                         |

```ts
const xml = `<NS ${ALL_XMLNS_NAMESPACES}><LNClass name="XCBR" ${CUSTOM_RECORD_ID_ATTRIBUTE}="lnclass-1"/></NS>`
```

XPath queries against NSD documents must use the `default:` prefix for all element names (NSD uses a default namespace). Attributes don't need a prefix unless qualified (e.g. `dev:db-id`).

```ts
// ✗ fails silently — no prefix
expectedQueries: ['//LNClass[@name="XCBR"]']

// ✓ correct
expectedQueries: ['//default:LNClass[@name="XCBR"]']
```

---

## Test tiers of this package

The helpers need no browser API: they read XML with libxml2 and documents through the store. This package runs its tests in two tiers (`vitest.config.ts`):

| Command                                | Project       | Runs                                                                                        | When                     |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------- | ------------------------ |
| `npx vitest run --project node <path>` | `node`        | every unit test file but the browser-only list, in node, on the in-memory store             | each step                |
| `npm run test:node`                    | `node`        | the same, whole                                                                             | each step, the fast gate |
| `npm run test:browser`                 | `browser`     | the browser-only list (`BROWSER_ONLY_TEST_FILES` in `vitest.config.constants.ts`), Chromium | the full gate            |
| `npm test`                             | both          | `test:node`, then `test:browser`                                                            | the commit hook          |
| `npm run test:browser:all`             | `browser-all` | every unit test file but the node-only list, in Chromium, on the local store                | before a merge (CI)      |

The `node` project's setup (`src/v2017A/test/in-memory-storage.setup.ts`) calls core's `useTestStorage({ type: 'inMemory' })`: the runner chooses the store, a test never names it. The browser-only list is empty today; a file added to it says why (`{ path, why }`), naming the browser API it needs. A test that passes in one tier and fails in the other is a store or assertion bug to fix, never a file moved to the browser list.

### Running the helpers in node, in your package

`runNsdTestCases` and `createNsdTestProject` open their projects on the store the runner chose. To run your NSD tests in node, give your node test project a setup file with the same line:

```ts
// in-memory-storage.setup.ts, in setupFiles of your node vitest project
import { useTestStorage } from '@dialecte/core/test'

useTestStorage({ type: 'inMemory' })
```

---

## NsdTest type namespace

All types are bound to the NSD dialecte config via the `NsdTest` namespace:

| Type                        | Description                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `NsdTest.BaseTestCase`      | `{ only?: boolean }` - minimal base for non-XML tests (e.g. `runNsdTestCases.generic`)                                          |
| `NsdTest.BaseXmlTestCase`   | `BaseTestCase & { sourceXml, targetXml?, expectedQueries?, unexpectedQueries? }` - XML tests                                    |
| `NsdTest.TestCases<T>`      | `Record<string, T>` - key is the test description. Defaults to `BaseXmlTestCase`                                                |
| `NsdTest.TestDocument`      | `{ documentId: string, document: Nsd.Document }` - pre-opened document inside the test project                                  |
| `NsdTest.TestProjectResult` | `{ project, source: TestDocument, target?: TestDocument }` - returned by `createNsdTestProject`                                 |
| `NsdTest.TestRecord`        | Typed in-memory record shape — returned by `createNsdTestRecord`                                                                |
| `NsdTest.ActParams<T>`      | `{ project, source, target?, testCase }` - passed to `act`                                                                      |
| `NsdTest.ActResult`         | `{ assertOn?: 'source' \| 'target', withDatabaseIds?: boolean }` - returned by `act` in `withExport`                            |
| `NsdTest.TestRunner`        | Runner type bound to NSD config                                                                                                 |
| `NsdTest.Modules`           | The extension modules every NSD test project is opened with (none today: `{}`); the second type argument of the core test types |

`TestCases<T>` accepts any type extending `BaseTestCase` - use `BaseTestCase` for non-XML generic tests, `BaseXmlTestCase` for XML round-trip tests:

```ts
// Non-XML test case (generic runner)
type MyCase = NsdTest.BaseTestCase & { input: number; expected: number }
const cases: NsdTest.TestCases<MyCase> = { ... }
runNsdTestCases.generic(cases, (testCase) => { ... })

// XML test case (withExport / withoutExport)
type MyXmlCase = NsdTest.BaseXmlTestCase & { lnClassName: string }
const cases: NsdTest.TestCases<MyXmlCase> = { ... }
runNsdTestCases.withExport({ testCases: cases, act })
```
