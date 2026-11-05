import { version } from '../../package.json'
import { NSD_DIALECTE_CONFIG, NSDOC_DIALECTE_CONFIG } from './config'
import { NSD_EXTENSION_MODULES } from './extensions'

import { describe, expect, it } from 'vitest'

import { NSD_DIALECTE } from '@/v2017A'

describe('NSD_DIALECTE', () => {
	type TestCase = { read: () => unknown; expected: unknown }
	const testCases: Record<string, TestCase> = {
		'id -> nsd/v2017A, the dialecte its projects are stored under': {
			read: () => NSD_DIALECTE.id,
			expected: 'nsd/v2017A',
		},
		"version -> the package's version, the one a view and its engine must share": {
			read: () => NSD_DIALECTE.version,
			expected: version,
		},
		'configs -> nsd and nsdoc, each the package config of that file kind': {
			read: () => ({
				keys: Object.keys(NSD_DIALECTE.configs).sort(),
				nsd: Object.is(NSD_DIALECTE.configs.nsd, NSD_DIALECTE_CONFIG),
				nsdoc: Object.is(NSD_DIALECTE.configs.nsdoc, NSDOC_DIALECTE_CONFIG),
			}),
			expected: { keys: ['nsd', 'nsdoc'], nsd: true, nsdoc: true },
		},
		'default config key -> nsd: a file imported under no config is an NSD file': {
			read: () => NSD_DIALECTE.defaultConfigKey,
			expected: 'nsd',
		},
		"extensions -> the package's extension modules": {
			read: () => NSD_DIALECTE.extensions === NSD_EXTENSION_MODULES,
			expected: true,
		},
	}

	for (const [name, { read, expected }] of Object.entries(testCases)) {
		it(name, () => {
			expect(read()).toEqual(expected)
		})
	}
})
