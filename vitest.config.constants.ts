import type { DeclaredTestFile } from './vitest.config.types'

/**
 * The test files that need a browser API: the `browser` project runs them, the `node` project leaves them out. Every
 * other test file runs in node, on the in-memory store.
 */
export const BROWSER_ONLY_TEST_FILES: readonly DeclaredTestFile[] = [
	{
		path: 'src/v2017A/declaration.engine.test.ts',
		why: "a project on `sqlite` storage: an engine worker of the declaration and the origin's private file system",
	},
]

/**
 * The test files that read the package from disk or start node: the `browser-all` project leaves them out. Empty: no
 * test of this package needs node.
 */
export const NODE_ONLY_TEST_FILES: readonly DeclaredTestFile[] = []
