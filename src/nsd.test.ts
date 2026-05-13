import { createNsdProject } from './dialecte'

import { describe, it, expect } from 'vitest'

describe('createNsdProject', () => {
	it('returns a project instance', () => {
		const project = createNsdProject()
		expect(project).toBeDefined()
	})
})
