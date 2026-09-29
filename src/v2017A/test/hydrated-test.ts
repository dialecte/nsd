import { assertValidNsdTestCases, assertValidNsdXml } from './assert-valid-xml'

import {
	CUSTOM_RECORD_ID_ATTRIBUTE,
	CUSTOM_RECORD_ID_ATTRIBUTE_NAME,
	XMLNS_XSI_NAMESPACE,
} from '@dialecte/core/helpers'
import {
	createTestProject,
	createTestRecordFactory,
	createXmlAssertions,
	createTestRunner,
	XMLNS_DEV_NAMESPACE,
} from '@dialecte/core/test'

import { NSD_DIALECTE_CONFIG } from '@/v2017A/config'
import { NSD_EXTENSION_MODULES } from '@/v2017A/extensions'

import type { Config } from '@/v2017A/config/dialecte.config'

type NsdModules = typeof NSD_EXTENSION_MODULES

export const XMLNS_NSD_NAMESPACE = `xmlns="${NSD_DIALECTE_CONFIG.namespaces.default.uri}"`
export const ALL_XMLNS_NAMESPACES = `${XMLNS_NSD_NAMESPACE} ${XMLNS_DEV_NAMESPACE} ${XMLNS_XSI_NAMESPACE}`
export { CUSTOM_RECORD_ID_ATTRIBUTE, CUSTOM_RECORD_ID_ATTRIBUTE_NAME }
export { assertValidNsdXml } from './assert-valid-xml'

const NSD_EXTENSIONS = { base: NSD_EXTENSION_MODULES }

const rawRunNsdTestCases = createTestRunner<Config, NsdModules>({
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
	assertValidNsdXml(sourceXml, 'sourceXml', { requireComplete: false })
	if (targetXml) assertValidNsdXml(targetXml, 'targetXml', { requireComplete: false })

	return createTestProject<Config, NsdModules>({
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
