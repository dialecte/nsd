import { assertValidNsdTestCases, assertValidNsdXml } from './assert-valid-xml'

import { CUSTOM_RECORD_ID_ATTRIBUTE, CUSTOM_RECORD_ID_ATTRIBUTE_NAME } from '@dialecte/core/helpers'
import {
	createTestProject,
	createTestRecordFactory,
	createXmlAssertions,
	createTestRunner,
} from '@dialecte/core/test'

import { NSD_DIALECTE_CONFIG } from '@/v2017A/config'
import { NSD_EXTENSION_MODULES } from '@/v2017A/extensions'

import type { NsdTest } from './hydrated-test.types'
import type { Config } from '@/v2017A/config/dialecte.config'

export { ALL_XMLNS_NAMESPACES, XMLNS_NSD_NAMESPACE } from './nsd-xmlns.constants'
export { CUSTOM_RECORD_ID_ATTRIBUTE, CUSTOM_RECORD_ID_ATTRIBUTE_NAME }
export { assertValidNsdXml } from './assert-valid-xml'

const NSD_EXTENSIONS = { base: NSD_EXTENSION_MODULES }

const rawRunNsdTestCases = createTestRunner<Config, NsdTest.Modules>({
	dialecteConfig: NSD_DIALECTE_CONFIG,
	extensions: NSD_EXTENSIONS,
})

/**
 * `createTestRunner`, wrapped so the XML of every case is checked against the schema before the
 * suite runs: a mistyped tag, a wrong namespace or an unknown attribute fails loudly, every invalid
 * case reported at once, instead of the suite quietly testing something else.
 */
export const runNsdTestCases: typeof rawRunNsdTestCases = {
	...rawRunNsdTestCases,
	withExport(params) {
		assertValidNsdTestCases({ testCases: params.testCases })
		rawRunNsdTestCases.withExport(params)
	},
	withoutExport(params) {
		assertValidNsdTestCases({ testCases: params.testCases })
		rawRunNsdTestCases.withoutExport(params)
	},
}

export async function createNsdTestProject(params: { sourceXml: string; targetXml?: string }) {
	const { sourceXml, targetXml } = params
	// a fixture may leave out required attributes; its structure must still be the schema's
	assertValidNsdXml({ xml: sourceXml, label: 'sourceXml', requireComplete: false })
	if (targetXml) assertValidNsdXml({ xml: targetXml, label: 'targetXml', requireComplete: false })

	return createTestProject<Config, NsdTest.Modules>({
		sourceXml,
		targetXml,
		dialecteConfig: NSD_DIALECTE_CONFIG,
		extensions: NSD_EXTENSIONS,
	})
}

export const createNsdTestRecord: ReturnType<typeof createTestRecordFactory<Config>> =
	createTestRecordFactory<Config>(NSD_DIALECTE_CONFIG)
export const { assertExpectedElementQueries, assertUnexpectedElementQueries } = createXmlAssertions(
	{
		namespaces: NSD_DIALECTE_CONFIG.namespaces,
	},
)
