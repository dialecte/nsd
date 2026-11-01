import { describe, expect, it } from 'vitest'

import {
	ALL_XMLNS_NAMESPACES,
	assertExpectedElementQueries,
	assertUnexpectedElementQueries,
} from '@/v2017A/test'

const NS_WITH_CHANGES = `<NS ${ALL_XMLNS_NAMESPACES} id="WithChanges" version="2017"><Changes version="2017"/></NS>`

describe('the query assertions on XML text', () => {
	const changesQuery = '//default:NS/default:Changes[@version="2017"]'

	it('assertExpectedElementQueries, an NSD default-namespace XPath on XML holding the element -> passes', () => {
		expect(() =>
			assertExpectedElementQueries({ xml: NS_WITH_CHANGES, queries: [changesQuery] }),
		).not.toThrow()
	})

	it('assertUnexpectedElementQueries, an NSD default-namespace XPath on XML holding the element -> throws', () => {
		expect(() =>
			assertUnexpectedElementQueries({ xml: NS_WITH_CHANGES, queries: [changesQuery] }),
		).toThrow(/Unexpected element found/)
	})
})
