import { describe, expect, it } from 'vitest'

import * as testEntry from '@/v2017A/test'
import { ALL_XMLNS_NAMESPACES, createNsdTestProject } from '@/v2017A/test'

/** Valid structure, but `id` (required on `NS`) is left out. */
const NS_WITHOUT_ID = `<NS ${ALL_XMLNS_NAMESPACES} version="2017"/>`
/** An NSDoc file: the documentation strings of an NSD file, its own root. */
const NSDOC = `<NSDoc ${ALL_XMLNS_NAMESPACES} id="Fixture" lang="en" version="2017"><Doc id="doc-1">First</Doc></NSDoc>`
/** `Abbreviation` belongs under `Abbreviations`, never directly under `NS`. */
const NS_WITH_MISPLACED_CHILD = `<NS ${ALL_XMLNS_NAMESPACES} id="Misplaced" version="2017"><Abbreviation name="a"/></NS>`

describe('createNsdTestProject', () => {
	it('a valid fixture that leaves out a required attribute -> resolves with the project and the opened source document', async () => {
		await expect(createNsdTestProject({ sourceXml: NS_WITHOUT_ID })).resolves.toMatchObject({
			project: expect.anything(),
			source: { documentId: expect.any(String), document: expect.anything() },
		})
	})

	it('a valid fixture that leaves out a required attribute -> its root is readable through the source document query', async () => {
		await expect(
			createNsdTestProject({ sourceXml: NS_WITHOUT_ID }).then(({ source }) =>
				source.document.query.getRoot(),
			),
		).resolves.toMatchObject({ tagName: 'NS' })
	})

	it('a sourceXml and a targetXml that both leave out a required attribute -> resolves with the opened source and target documents', async () => {
		await expect(
			createNsdTestProject({ sourceXml: NS_WITHOUT_ID, targetXml: NS_WITHOUT_ID }),
		).resolves.toMatchObject({
			source: { documentId: expect.any(String), document: expect.anything() },
			target: { documentId: expect.any(String), document: expect.anything() },
		})
	})

	type InvalidFixtureCase = { sourceXml: string; targetXml?: string; label: string }
	const invalidFixtureCases: Record<string, InvalidFixtureCase> = {
		'a sourceXml with a child its parent does not allow -> rejects naming sourceXml': {
			sourceXml: NS_WITH_MISPLACED_CHILD,
			label: 'sourceXml',
		},
		'a targetXml with a child its parent does not allow -> rejects naming targetXml': {
			sourceXml: NS_WITHOUT_ID,
			targetXml: NS_WITH_MISPLACED_CHILD,
			label: 'targetXml',
		},
	}

	for (const [name, { sourceXml, targetXml, label }] of Object.entries(invalidFixtureCases)) {
		it(name, async () => {
			await expect(createNsdTestProject({ sourceXml, targetXml })).rejects.toThrow(
				new RegExp(`^${label}: not valid Nsd:[\\s\\S]*<Abbreviation> is not a valid child of <NS>`),
			)
		})
	}
})

describe('createNsdTestProject, the config a fixture is imported under', () => {
	type ConfigCase = { sourceXml: string; configKey?: 'nsd' | 'nsdoc'; expected: string }
	const configCases: Record<string, ConfigCase> = {
		'an NSDoc fixture under configKey nsdoc -> its source document is stored under the nsdoc config':
			{
				sourceXml: NSDOC,
				configKey: 'nsdoc',
				expected: 'nsdoc',
			},
		'an NS fixture under no configKey -> its source document is stored under nsd, the default config':
			{
				sourceXml: NS_WITHOUT_ID,
				expected: 'nsd',
			},
	}

	for (const [name, { sourceXml, configKey, expected }] of Object.entries(configCases)) {
		it(name, async () => {
			await expect(
				createNsdTestProject({ sourceXml, configKey }).then(({ project, source }) =>
					project.getDocument(source.documentId),
				),
			).resolves.toMatchObject({ configKey: expected })
		})
	}
})

describe('createNsdTestProject, a fixture whose root is not the root of its config', () => {
	it('an NS fixture under configKey nsdoc -> rejects: an NSDoc document has the root NSDoc', async () => {
		await expect(
			createNsdTestProject({ sourceXml: NS_WITHOUT_ID, configKey: 'nsdoc' }),
		).rejects.toThrow(/root element <NSDoc>, got <NS>/)
	})
})

describe('the test entry', () => {
	it('exports -> the same helpers and constants, whatever builds them', () => {
		expect(Object.keys(testEntry).sort()).toEqual([
			'ALL_XMLNS_NAMESPACES',
			'CUSTOM_RECORD_ID_ATTRIBUTE',
			'CUSTOM_RECORD_ID_ATTRIBUTE_NAME',
			'XMLNS_NSD_NAMESPACE',
			'assertExpectedElementQueries',
			'assertUnexpectedElementQueries',
			'assertValidNsdXml',
			'createNsdTestProject',
			'createNsdTestRecord',
			'runNsdTestCases',
		])
	})
})
