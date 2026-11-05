import { describe, expect, it } from 'vitest'

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

/**
 * The NSDoc cases registered under configKey nsdoc, each asserting the config its document is stored under; a
 * runner that refuses the key throws while the file is collected, so the refusal is kept for a case to assert.
 */
function registerNsdocCases(): { registered: true } | { refused: string } {
	const testCases: NsdTest.TestCases = {
		'an NSDoc fixture -> its source document is stored under the nsdoc config': {
			sourceXml: `<NSDoc ${ALL_XMLNS_NAMESPACES} id="Fixture" lang="en" version="2017"><Doc id="doc-1">First</Doc></NSDoc>`,
		},
	}
	try {
		runNsdTestCases.withoutExport({
			testCases,
			configKey: 'nsdoc',
			act: async ({ project, source }) => {
				await expect(project.getDocument(source.documentId)).resolves.toMatchObject({
					configKey: 'nsdoc',
				})
			},
		})
		return { registered: true }
	} catch (thrown) {
		return { refused: String(thrown) }
	}
}

describe('runNsdTestCases.withoutExport under configKey nsdoc', () => {
	const registration = registerNsdocCases()

	it('the nsdoc key -> taken: its cases are registered', () => {
		expect(registration).toEqual({ registered: true })
	})
})

/**
 * One invalid case registered under a config key (the default one when none): a runner checks each case against the
 * schema of that config while the file is collected, and the refusal is kept for a case to assert.
 */
function registerInvalidCase(params: {
	sourceXml: string
	configKey?: string
}): { registered: true } | { refused: string } {
	const { sourceXml, configKey } = params
	try {
		runNsdTestCases.withoutExport({
			testCases: { 'an invalid fixture -> never runs': { sourceXml } },
			configKey,
			act: async () => {},
		})
		return { registered: true }
	} catch (thrown) {
		return { refused: String(thrown) }
	}
}

describe('runNsdTestCases, each case checked against the schema of the config it is imported under', () => {
	type InvalidCase = { sourceXml: string; configKey?: string; refusal: RegExp }
	const invalidCases: Record<string, InvalidCase> = {
		'under configKey nsdoc, an NSDoc case with a child NSDoc does not allow -> refused while collected':
			{
				sourceXml: `<NSDoc ${ALL_XMLNS_NAMESPACES} id="Fixture" lang="en" version="2017"><Changes version="2017"/></NSDoc>`,
				configKey: 'nsdoc',
				refusal: /not valid Nsd[\s\S]*<Changes> is not a valid child of <NSDoc>/,
			},
		'under the default config, an NS case with a child NS does not allow -> refused while collected':
			{
				sourceXml: `<NS ${ALL_XMLNS_NAMESPACES} id="Misplaced" version="2017"><Abbreviation name="a"/></NS>`,
				refusal: /not valid Nsd[\s\S]*<Abbreviation> is not a valid child of <NS>/,
			},
	}
	const registrations = Object.entries(invalidCases).map(
		([name, { sourceXml, configKey, refusal }]) => ({
			name,
			refusal,
			registration: registerInvalidCase({ sourceXml, configKey }),
		}),
	)

	for (const { name, refusal, registration } of registrations) {
		it(name, () => {
			expect(registration).toEqual({ refused: expect.stringMatching(refusal) })
		})
	}
})
