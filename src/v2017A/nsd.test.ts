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

describe('createNsdProject', () => {
	it('returns a project instance', () => {
		const project = createNsdProject()
		expect(project).toBeDefined()
	})

	it("a project -> carries the declaration's id, the dialecte its store names it under", () => {
		expect(createNsdProject().dialecteId).toBe('nsd/v2017A')
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
