// SQLite storage, as an app opts into it
import '@dialecte/core/sqlite'
import { NSD_DIALECTE_CONFIG } from './config'

import { createProjectFactory } from '@dialecte/core'
import { describe, expect, it, onTestFinished, vi } from 'vitest'

import { NSD_DIALECTE } from '@/v2017A'

import type { Nsd } from './config'

/** One case starts the engine worker, installs its file, imports, closes and opens again: seconds, not milliseconds. */
const ENGINE_CASE_TIMEOUT_MS = 60_000

vi.setConfig({ testTimeout: ENGINE_CASE_TIMEOUT_MS })

/** A test-only engine worker serving the NSD declaration, as the dev server serves it. */
const ENGINE_URL = new URL('./test/fixtures/nsd-engine.worker.ts', import.meta.url).href
/** Projects of the NSD declaration, run by that engine worker. */
const createDeclaredNsdProject = createProjectFactory({
	dialecte: NSD_DIALECTE,
	engineUrl: ENGINE_URL,
})

const NSD_NAMESPACE = `xmlns="${NSD_DIALECTE_CONFIG.namespaces.default.uri}"`

/** What a document reads back once its project is opened again. */
type ReadBack = { configKey: string | undefined; rootTagName: string; childCount: number }

function fileOf(params: { xml: string; name: string }): File {
	return new File([params.xml], params.name, { type: 'text/xml' })
}

/**
 * The file imported into a new project of the declaration on sqlite storage, the project closed and opened again, the document
 * read back from the engine; the project destroyed when the case ends, whichever step it reached.
 */
async function importAndReadBack(params: {
	file: File
	configKey?: string
	childTagName: 'Doc' | 'Changes'
}): Promise<ReadBack> {
	const { file, configKey, childTagName } = params
	const name = `nsd-sqlite-${crypto.randomUUID()}`
	const first = await createDeclaredNsdProject({ storage: { type: 'sqlite' } }).open(name)
	// the project the case holds open; none between the close and the reopen
	const held: { project: Nsd.Project | undefined } = { project: first }
	onTestFinished(function destroyProject() {
		if (held.project) return held.project.destroy()
		return createDeclaredNsdProject.destroyProject({ name })
	})
	const { documentId } = await first.importFile(file, configKey ? { configKey } : undefined)
	await first.close()
	held.project = undefined
	const again = await createDeclaredNsdProject({ storage: { type: 'sqlite' } }).open(name)
	held.project = again
	const document = again.openDocument(documentId)
	const root = await document.query.getRoot()
	const children = await document.query.getRecordsByTagName(childTagName)
	const record = await again.getDocument(documentId)
	return { configKey: record?.configKey, rootTagName: root.tagName, childCount: children.length }
}

describe('NSD_DIALECTE in an engine worker, a project on sqlite storage', () => {
	type TestCase = {
		file: File
		configKey?: string
		childTagName: 'Doc' | 'Changes'
		expected: ReadBack
	}
	const testCases: Record<string, TestCase> = {
		'an NSDoc file imported under configKey nsdoc -> stored under the nsdoc config, read back after reopening':
			{
				file: fileOf({
					xml: `<NSDoc ${NSD_NAMESPACE} id="Fixture" lang="en" version="2017"><Doc id="doc-1">First</Doc><Doc id="doc-2">Second</Doc></NSDoc>`,
					name: 'fixture.nsdoc',
				}),
				configKey: 'nsdoc',
				childTagName: 'Doc',
				expected: { configKey: 'nsdoc', rootTagName: 'NSDoc', childCount: 2 },
			},
		'an NS file imported under no config -> stored under nsd, the default config, read back after reopening':
			{
				file: fileOf({
					xml: `<NS ${NSD_NAMESPACE} id="Fixture" version="2017"><Changes version="2017"/></NS>`,
					name: 'fixture.nsd',
				}),
				childTagName: 'Changes',
				expected: { configKey: 'nsd', rootTagName: 'NS', childCount: 1 },
			},
	}

	for (const [name, { file, configKey, childTagName, expected }] of Object.entries(testCases)) {
		it(name, async () => {
			await expect(importAndReadBack({ file, configKey, childTagName })).resolves.toEqual(expected)
		})
	}
})
