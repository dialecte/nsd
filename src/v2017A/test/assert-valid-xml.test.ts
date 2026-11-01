import { describe, expect, it } from 'vitest'

import { ALL_XMLNS_NAMESPACES, assertValidNsdXml } from '@/v2017A/test'

/** Valid structure, but `id` (required on `NS`) is left out. */
const NS_WITHOUT_ID = `<NS ${ALL_XMLNS_NAMESPACES} version="2017"/>`
/** `Changes` is never closed. */
const MALFORMED_NS = `<NS ${ALL_XMLNS_NAMESPACES} id="Malformed" version="2017"><Changes></NS>`

describe('assertValidNsdXml', () => {
	it('a fixture missing a required attribute, requireComplete: false -> passes', () => {
		expect(() =>
			assertValidNsdXml({ xml: NS_WITHOUT_ID, label: 'fixture', requireComplete: false }),
		).not.toThrow()
	})

	type ThrowingCase = { xml: string; expected: RegExp }
	const throwingCases: Record<string, ThrowingCase> = {
		'a fixture missing a required attribute, requireComplete left out -> throws naming the label and the attribute':
			{
				xml: NS_WITHOUT_ID,
				expected: /^fixture: not valid Nsd:[\s\S]*<NS> is missing required attribute 'id'/,
			},
		'malformed text -> throws "<label>: malformed XML - "': {
			xml: MALFORMED_NS,
			expected: /^fixture: malformed XML - \d+:\d+ \S/,
		},
	}

	for (const [name, { xml, expected }] of Object.entries(throwingCases)) {
		it(name, () => {
			expect(() => assertValidNsdXml({ xml, label: 'fixture' })).toThrow(expected)
		})
	}
})
