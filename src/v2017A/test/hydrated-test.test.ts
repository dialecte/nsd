import { describe, expect, it } from 'vitest'

import { ALL_XMLNS_NAMESPACES, createNsdTestProject } from '@/v2017A/test'

/** Valid structure, but `id` (required on `NS`) is left out. */
const NS_WITHOUT_ID = `<NS ${ALL_XMLNS_NAMESPACES} version="2017"/>`
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
