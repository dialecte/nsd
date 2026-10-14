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
} from '@dialecte/nsd/v2017A/test'
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
import { describe } from 'vitest'
import { runNsdTestCases, ALL_XMLNS_NAMESPACES } from '@dialecte/nsd/v2017A/test'
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
} from '@dialecte/nsd/v2017A/test'

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

assertValidNsdXml(xml)
assertValidNsdXml(xml, 'targetXml', { requireComplete: false })
```

| Parameter                 | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| `xml`                     | The document to check                                                       |
| `label`                   | Names the document in the error message. Optional.                          |
| `options.requireComplete` | Also require every schema-required attribute to be present. Default `true`. |

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
