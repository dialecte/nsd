import { describe } from 'vitest'

import { ALL_XMLNS_NAMESPACES, runNsdTestCases } from '@/v2017A/test'

import type { NsdTest } from '@/v2017A/test'

describe('runNsdTestCases.withExport', () => {
	const testCases: NsdTest.TestCases = {
		'an act that adds Changes -> asserted on the exported XML': {
			sourceXml: `<NS ${ALL_XMLNS_NAMESPACES} id="Exported" version="2017"/>`,
			expectedQueries: ['//default:NS/default:Changes[@version="2017"]'],
		},
	}

	runNsdTestCases.withExport({
		testCases,
		act: async ({ source }) => {
			const root = await source.query.getRoot()
			await source.transaction(async (tx) => {
				await tx.addChild(root, { tagName: 'Changes', attributes: { version: '2017' } })
			})
		},
	})
})
