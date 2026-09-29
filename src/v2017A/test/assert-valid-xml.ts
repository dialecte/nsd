import { createXmlSchemaAssertions } from '@dialecte/core/test'

import { NSD_DIALECTE_CONFIG } from '@/v2017A/config'

/**
 * Structural validation of test fixtures against the schema, bound to this package's generated
 * definition and namespaces. The engine is `createXmlSchemaAssertions` from `@dialecte/core/test`.
 *
 * It asserts that every element's namespace matches its parent context, that every element is an
 * allowed child of its parent, and that every attribute is known to its element. Elements unknown to
 * the schema are skipped, and so is any element in a namespace the package does not declare.
 */
const { assertValidXml, assertValidXmlTestCases } = createXmlSchemaAssertions({
	definition: NSD_DIALECTE_CONFIG.definition,
	namespaces: NSD_DIALECTE_CONFIG.namespaces,
	schemaName: 'Nsd',
})

export const assertValidNsdXml = assertValidXml
export const assertValidNsdTestCases = assertValidXmlTestCases
