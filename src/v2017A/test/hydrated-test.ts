import { CUSTOM_RECORD_ID_ATTRIBUTE, CUSTOM_RECORD_ID_ATTRIBUTE_NAME } from '@dialecte/core/helpers'
import { createTestHelpers } from '@dialecte/core/test'

import { NSD_DIALECTE } from '@/v2017A/declaration.constants'

import type { NsdTest } from './hydrated-test.types'

export { ALL_XMLNS_NAMESPACES, XMLNS_NSD_NAMESPACE } from './nsd-xmlns.constants'
export { CUSTOM_RECORD_ID_ATTRIBUTE, CUSTOM_RECORD_ID_ATTRIBUTE_NAME }

const nsdTestHelpers: NsdTest.Helpers = createTestHelpers({
	dialecte: NSD_DIALECTE,
	schemaName: 'Nsd',
})

/**
 * Run table-driven NSD cases. `withExport` and `withoutExport` import each case into a real NSD project under the call's
 * `configKey` (`nsd` by default, `nsdoc` for NSDoc fixtures), and check every case's XML before the suite runs, against
 * the call's `dialecteConfig` when it passes one, else the config under that key: a mistyped tag, a wrong namespace or an
 * unknown attribute fails loudly, every invalid case reported at once. `generic` runs plain cases: no project, no XML.
 *
 * @intent test an NSD extension or hook with table-driven cases, assert on exported NSD XML, test NSDoc documents
 */
export const runNsdTestCases: NsdTest.Helpers['runTestCases'] = nsdTestHelpers.runTestCases

/**
 * Open a real NSD project with the source (and target) fixture imported and opened. `configKey` names the config they
 * are imported under and checked against (`nsd` by default, `nsdoc` for an NSDoc fixture); required attributes may be
 * left out.
 *
 * @intent open an NSD test project, test several steps on an NSD document, import an NSDoc fixture in a test
 */
export const createNsdTestProject: NsdTest.Helpers['createTestProject'] =
	nsdTestHelpers.createTestProject

/**
 * Make a typed in-memory NSD record, without a store, bound to the default config.
 *
 * @intent make an NSD record in a unit test, test a pure function on NSD records
 */
export const createNsdTestRecord: NsdTest.Helpers['createTestRecord'] =
	nsdTestHelpers.createTestRecord

/**
 * Assert that XPath queries each find an element in XML text, with the NSD namespaces.
 *
 * @intent assert elements are present in NSD XML, check exported NSD XML with XPath
 */
export const assertExpectedElementQueries: NsdTest.Helpers['assertExpectedElementQueries'] =
	nsdTestHelpers.assertExpectedElementQueries

/**
 * Assert that XPath queries each find nothing in XML text, with the NSD namespaces.
 *
 * @intent assert elements are absent from NSD XML, check exported NSD XML with XPath
 */
export const assertUnexpectedElementQueries: NsdTest.Helpers['assertUnexpectedElementQueries'] =
	nsdTestHelpers.assertUnexpectedElementQueries

/**
 * Check XML against the NSD schema: namespaces, allowed children, known attributes and, unless `requireComplete: false`,
 * required attributes. Throws what is invalid.
 *
 * @intent validate an NSD fixture against the schema, check NSD XML structure in a test
 */
export const assertValidNsdXml: NsdTest.Helpers['assertValidXml'] = nsdTestHelpers.assertValidXml
