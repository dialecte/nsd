---
description: Test helpers for @dialecte/nsd — createNsdTestProject, runNsdTestCases, XML assertions, and namespace constants.
---

# Test Helpers

`@dialecte/nsd` ships a test entry point with NSD-specific utilities. Import from `@dialecte/nsd/test`:

```ts
import {
	runNsdTestCases,
	createNsdTestProject,
	createNsdTestRecord,
	assertExpectedElementQueries,
	assertUnexpectedElementQueries,
	ALL_XMLNS_NAMESPACES,
	CUSTOM_RECORD_ID_ATTRIBUTE,
} from '@dialecte/nsd/test'
```

All helpers are wired to the NSD config internally — no config argument needed.

## runNsdTestCases

Table-driven async runner backed by a real in-memory database. Pre-bound to the NSD dialecte config.

Two methods enforce the right contract at call-site.

| Method                          | Use when                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `runNsdTestCases.withExport`    | `act` performs transactions, assertions on exported XML (`Promise<NsdTest.ActResult>`) |
| `runNsdTestCases.withoutExport` | `act` asserts directly on query results (`Promise<void>`)                              |
| `runNsdTestCases.generic`       | Sync pure-function tests — no XML, no DB                                               |

### Scenario 1 - query assertions only (act returns void)

Use when `act` asserts directly on query results via `expect`. No XML export needed.

```ts
import { describe, expect } from 'vitest'
import {
	runNsdTestCases,
	ALL_XMLNS_NAMESPACES,
	CUSTOM_RECORD_ID_ATTRIBUTE,
} from '@dialecte/nsd/test'
import type { NsdTest } from '@dialecte/nsd/test'

type TestCase = NsdTest.BaseTestCase & {
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
import { describe } from 'vitest'
import { runNsdTestCases, ALL_XMLNS_NAMESPACES } from '@dialecte/nsd/test'
import type { NsdTest } from '@dialecte/nsd/test'

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

Lower-level helper for tests that need manual control over intermediate assertions, multi-step verification, or transactions outside `runNsdTestCases`. Spins up a real in-memory `Project` with the source (and optionally target) file imported, and returns pre-opened documents.

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
} from '@dialecte/nsd/test'

const { project, source } = await createNsdTestProject({
	sourceXml: `
		<NS ${ALL_XMLNS_NAMESPACES}>
			<LNClasses>
				<LNClass name="XCBR" ${CUSTOM_RECORD_ID_ATTRIBUTE}="lnclass-1"/>
			</LNClasses>
		</NS>
	`,
})

try {
	const root = await source.document.query.getRoot()
	const { LNClass: lnClasses } = await source.document.query.findDescendants(root)
	expect(lnClasses).toHaveLength(1)
} finally {
	await project.destroy()
}
```

Use `runNsdTestCases` when the test fits the standard source → act → assert shape. Use `createNsdTestProject` directly when:

- Asserting intermediate states between transactions
- Multiple exports at different stages

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

`assertExpectedElementQueries` and `assertUnexpectedElementQueries` run XPath assertions against an `XMLDocument`. Both use the NSD namespace map.

Use directly when calling `createNsdTestProject` and exporting manually via `project.export(documentId)`.

```ts
assertExpectedElementQueries({
	xmlDocument,
	queries: ['//default:LNClasses/default:LNClass[@name="XCBR"]'],
})
assertUnexpectedElementQueries({ xmlDocument, queries: ['//default:LNClass[@name="deleted"]'] })
```

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

| Constant                     | Value                                                        |
| ---------------------------- | ------------------------------------------------------------ |
| `XMLNS_NSD_NAMESPACE`        | `xmlns="http://www.iec.ch/61850/2016/NSD"`                   |
| `ALL_XMLNS_NAMESPACES`       | NSD namespace + dev namespace + xsi namespace combined       |
| `CUSTOM_RECORD_ID_ATTRIBUTE` | `dev:db-id="..."` — attribute string for use in XML fixtures |

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

## NsdTest type namespace

All types are bound to the NSD dialecte config via the `NsdTest` namespace:

| Type                        | Description                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `NsdTest.BaseTestCase`      | `{ only?: boolean }` - minimal base for non-XML tests (e.g. `runNsdTestCases.generic`)               |
| `NsdTest.BaseXmlTestCase`   | `BaseTestCase & { sourceXml, targetXml?, expectedQueries?, unexpectedQueries? }` - XML tests         |
| `NsdTest.TestCases<T>`      | `Record<string, T>` - key is the test description. Defaults to `BaseXmlTestCase`                     |
| `NsdTest.TestDocument`      | `{ documentId: string, document: Nsd.Document }` - pre-opened document inside the test project       |
| `NsdTest.TestProjectResult` | `{ project, source: TestDocument, target?: TestDocument }` - returned by `createNsdTestProject`      |
| `NsdTest.TestRecord`        | Typed in-memory record shape — returned by `createNsdTestRecord`                                     |
| `NsdTest.ActParams<T>`      | `{ project, source, target?, testCase }` - passed to `act`                                           |
| `NsdTest.ActResult`         | `{ assertOn?: 'source' \| 'target', withDatabaseIds?: boolean }` - returned by `act` in `withExport` |
| `NsdTest.TestRunner`        | Runner type bound to NSD config                                                                      |

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
