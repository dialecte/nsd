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

import { NSD_DIALECTE_CONFIG } from '@/config'
import { NSD_EXTENSION_MODULES } from '@/extensions'

import type { Config } from '@/config/dialecte.config'

type NsdModules = typeof NSD_EXTENSION_MODULES

export const XMLNS_NSD_NAMESPACE = `xmlns="${NSD_DIALECTE_CONFIG.namespaces.default.uri}"`
export const ALL_XMLNS_NAMESPACES = `${XMLNS_NSD_NAMESPACE} ${XMLNS_DEV_NAMESPACE} ${XMLNS_XSI_NAMESPACE}`
export { CUSTOM_RECORD_ID_ATTRIBUTE, CUSTOM_RECORD_ID_ATTRIBUTE_NAME }

const NSD_EXTENSIONS = { base: NSD_EXTENSION_MODULES }

export const runNsdTestCases = createTestRunner<Config, NsdModules>({
	dialecteConfig: NSD_DIALECTE_CONFIG,
	extensions: NSD_EXTENSIONS,
})

export async function createNsdTestProject(params: { sourceXml: string; targetXml?: string }) {
	const { sourceXml, targetXml } = params

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
