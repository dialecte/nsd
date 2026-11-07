import { version } from '../../package.json'
import { NSD_DIALECTE_CONFIG, NSDOC_DIALECTE_CONFIG } from './config/dialecte.config'
import { NSD_EXTENSION_MODULES } from './extensions'

import { defineDialecte } from '@dialecte/core'

import type { Config } from './config/dialecte.config'
import type { DialecteDeclaration } from '@dialecte/core'

/**
 * The NSD dialecte, declared once: its id, the package's version, both configs (`nsd` the default, `nsdoc` for an
 * NSDoc file) and its extensions. The project factory and the test helpers are built from it.
 *
 * A declaration has one config type, and the two configs differ only by their root element, so the NSDoc config
 * goes under the NSD config's type, as the `Nsd` types read every document of a project: the type of
 * `configs.nsdoc.rootElementName` says `'NS'`, its value is `'NSDoc'`. Code that needs the root reads the value as a
 * `string`.
 *
 * @intent get the NSD dialecte's declaration, derive projects or test helpers from the NSD dialecte, serve NSD and NSDoc documents from a project engine, know the configs of the NSD dialecte
 */
export const NSD_DIALECTE: DialecteDeclaration<
	Config,
	typeof NSD_EXTENSION_MODULES,
	'nsd' | 'nsdoc'
> = defineDialecte({
	id: 'nsd/v2017A',
	version,
	configs: {
		nsd: NSD_DIALECTE_CONFIG,
		nsdoc: NSDOC_DIALECTE_CONFIG as unknown as Config,
	},
	defaultConfigKey: 'nsd',
	extensions: NSD_EXTENSION_MODULES,
})
