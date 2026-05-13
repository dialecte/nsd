import { Nsd } from './config'
import { NSD_DIALECTE_CONFIG, NSDOC_DIALECTE_CONFIG } from './config/dialecte.config'
import { NSD_EXTENSION_MODULES } from './extensions'

import { Project } from '@dialecte/core'

import type { StorageParam, ExtensionModules } from '@dialecte/core'

/**
 * Create an NSD project with pre-configured config and extensions.
 * Call .open(name) to initialize the store and hydrate state.
 */
export function createNsdProject<
	CustomModules extends ExtensionModules = Record<never, never>,
>(params?: { storage?: StorageParam; extensions?: CustomModules }): Nsd.Project<CustomModules> {
	const { storage = { type: 'local' }, extensions } = params ?? {}

	return new Project({
		configs: { nsd: NSD_DIALECTE_CONFIG, nsdoc: NSDOC_DIALECTE_CONFIG },
		defaultConfigKey: 'nsd',
		storage,
		extensions: {
			base: NSD_EXTENSION_MODULES,
			custom: extensions,
		},
	}) as Nsd.Project<CustomModules>
}
