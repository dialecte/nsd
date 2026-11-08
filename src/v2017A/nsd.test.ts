import { createNsdProject } from './dialecte'

import { describe, it, expect, onTestFinished } from 'vitest'

import * as versionEntry from '@/v2017A'

const NSD_NAMESPACE = `xmlns="${versionEntry.NSD_DIALECTE_CONFIG.namespaces.default.uri}"`
const NS_FILE = new File([`<NS ${NSD_NAMESPACE} id="Fixture" version="2017"/>`], 'fixture.nsd')
const NSDOC_FILE = new File(
	[
		`<NSDoc ${NSD_NAMESPACE} id="Fixture" lang="en" version="2017"><Doc id="doc-1">First</Doc></NSDoc>`,
	],
	'fixture.nsdoc',
)

/**
 * How many documents an NSD project of that name holds on in-memory storage, read by opening it: the realm keeps a closed
 * project's in-memory state, by dialecte and name, until it is destroyed.
 */
async function countInMemoryDocuments(name: string): Promise<number> {
	const project = await createNsdProject({ storage: { type: 'inMemory' } }).open(name)
	try {
		return (await project.getDocuments()).length
	} finally {
		await project.close()
	}
}

/**
 * The documents of an in-memory NSD project of a fresh name, before and after `createNsdProject.destroyProject` named it:
 * the project holds one document, closed before the destroy.
 */
async function readDestroyProject(): Promise<{ before: number; after: number }> {
	const name = `nsd-factory-destroy-${crypto.randomUUID()}`
	const project = await createNsdProject({ storage: { type: 'inMemory' } }).open(name)
	await project.importFile(NS_FILE)
	await project.close()
	const before = await countInMemoryDocuments(name)
	await createNsdProject.destroyProject({ name, storage: { type: 'inMemory' } })
	const after = await countInMemoryDocuments(name)
	await createNsdProject.destroyProject({ name, storage: { type: 'inMemory' } })
	return { before, after }
}

describe('createNsdProject', () => {
	it('returns a project instance', () => {
		const project = createNsdProject()
		expect(project).toBeDefined()
	})

	it("a project -> carries the declaration's id, the dialecte its store names it under", () => {
		expect(createNsdProject().dialecteId).toBe('nsd/v2017A')
	})

	it('the factory -> carries the NSD declaration it makes its projects from', () => {
		expect(createNsdProject.dialecte).toBe(versionEntry.NSD_DIALECTE)
	})

	it('destroyProject -> deletes the NSD project of that name on the storage named, without opening it', async () => {
		await expect(readDestroyProject()).resolves.toEqual({ before: 1, after: 0 })
	})

	it('the main entry -> still exports the factory, beside the declaration', () => {
		expect({
			factory: versionEntry.createNsdProject === createNsdProject,
			declaration: 'NSD_DIALECTE' in versionEntry,
		}).toEqual({ factory: true, declaration: true })
	})

	describe('the configs a project holds, read from the declaration', () => {
		type TestCase = { file: File; configKey?: string; expected: () => unknown }
		const testCases: Record<string, TestCase> = {
			"an NS file under no configKey -> the declaration's nsd config, its default": {
				file: NS_FILE,
				expected: () => versionEntry.NSD_DIALECTE.configs.nsd,
			},
			"an NSDoc file under configKey nsdoc -> the declaration's nsdoc config": {
				file: NSDOC_FILE,
				configKey: 'nsdoc',
				expected: () => versionEntry.NSD_DIALECTE.configs.nsdoc,
			},
		}

		for (const [name, { file, configKey, expected }] of Object.entries(testCases)) {
			it(name, async () => {
				// the factory's own storage option: a test store never reaches a project the factory makes
				const project = await createNsdProject({ storage: { type: 'inMemory' } }).open(
					`nsd-${crypto.randomUUID()}`,
				)
				onTestFinished(function destroyProject() {
					return project.destroy()
				})
				const { documentId } = await project.importFile(file, configKey ? { configKey } : undefined)
				expect(project.getDocumentConfig(documentId)).toBe(expected())
			})
		}
	})

	it("a consumer's extensions -> reachable on a document, beside the dialecte's", async () => {
		const project = await createNsdProject({
			storage: { type: 'inMemory' },
			extensions: {
				counting: {
					query: {
						countDocs: async (query: {
							getRecordsByTagName: (tagName: 'Doc') => Promise<unknown[]>
						}) => (await query.getRecordsByTagName('Doc')).length,
					},
				},
			},
		}).open(`nsd-${crypto.randomUUID()}`)
		onTestFinished(function destroyProject() {
			return project.destroy()
		})
		const { documentId } = await project.importFile(NSDOC_FILE, { configKey: 'nsdoc' })
		await expect(project.openDocument(documentId).query.counting.countDocs()).resolves.toBe(1)
	})
})
