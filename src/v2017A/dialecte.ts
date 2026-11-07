import { Nsd } from './config'
import { NSD_DIALECTE } from './declaration.constants'

import { Project } from '@dialecte/core'

import type { StorageParam, ExtensionModules } from '@dialecte/core'

/**
 * Create an NSD project from the declaration: both configs, its extensions under the caller's.
 * Call .open(name) to initialize the store and hydrate state.
 */
export function createNsdProject<
	CustomModules extends ExtensionModules = Record<never, never>,
>(params?: { storage?: StorageParam; extensions?: CustomModules }): Nsd.Project<CustomModules> {
	const { storage = { type: 'local' }, extensions } = params ?? {}

	// the same project under its `Nsd` name: a direct cast would compare the two instantiations member by member, the
	// largest type cost of importing this package
	return new Project({
		configs: NSD_DIALECTE.configs,
		defaultConfigKey: NSD_DIALECTE.defaultConfigKey,
		storage,
		extensions: {
			base: NSD_DIALECTE.extensions,
			custom: extensions,
		},
		hooks: NSD_DIALECTE.createHooks(),
		dialecteId: NSD_DIALECTE.id,
		dialecteVersion: NSD_DIALECTE.version,
	}) as unknown as Nsd.Project<CustomModules>
}
