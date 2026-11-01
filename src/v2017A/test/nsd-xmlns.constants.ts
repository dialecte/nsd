import { XMLNS_XSI_NAMESPACE } from '@dialecte/core/helpers'
import { XMLNS_DEV_NAMESPACE } from '@dialecte/core/test'

import { NSD_DIALECTE_CONFIG } from '@/v2017A/config'

/** The NSD default namespace, as an attribute of a fixture's root. */
export const XMLNS_NSD_NAMESPACE = `xmlns="${NSD_DIALECTE_CONFIG.namespaces.default.uri}"`
/** Every namespace a fixture's root declares: NSD, the test record ids and xsi. */
export const ALL_XMLNS_NAMESPACES = `${XMLNS_NSD_NAMESPACE} ${XMLNS_DEV_NAMESPACE} ${XMLNS_XSI_NAMESPACE}`
