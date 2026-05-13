import {
	DEFINITION,
	ELEMENT_NAMES,
	ATTRIBUTES,
	CHILDREN,
	PARENTS,
	DESCENDANTS,
	ANCESTORS,
	ROOT_ELEMENT,
	SINGLETON_ELEMENTS,
} from '../definition'

import type { IOConfig, AnyDialecteConfig, DatabaseConfig } from '@dialecte/core'

// NSD-specific IO configuration
export const NSD_IO_CONFIG = {
	supportedFileExtensions: ['.nsd', '.nsdoc'],
} as const satisfies IOConfig

// NSD database configuration
export const NSD_DATABASE_CONFIG = {
	recordSchema: {
		primaryKey: 'id',
		indexes: ['tagName', 'parent.id', 'parent.tagName'],
		compoundIndexes: [['id', 'tagName']],
		arrayIndexes: ['children.id', 'children.tagName'],
	},
} as const satisfies DatabaseConfig

export const NSD_NAMESPACES = {
	default: { uri: 'http://www.iec.ch/61850/2016/NSD', prefix: '' },
} as const

const SHARED_CONFIG = {
	singletonElements: SINGLETON_ELEMENTS,
	elements: ELEMENT_NAMES,
	namespaces: NSD_NAMESPACES,
	attributes: ATTRIBUTES,
	children: CHILDREN,
	parents: PARENTS,
	descendants: DESCENDANTS,
	ancestors: ANCESTORS,
	database: NSD_DATABASE_CONFIG,
	io: NSD_IO_CONFIG,
	definition: DEFINITION,
} as const

export const NSD_DIALECTE_CONFIG = {
	...SHARED_CONFIG,
	rootElementName: ROOT_ELEMENT,
} as const satisfies AnyDialecteConfig

export const NSDOC_DIALECTE_CONFIG = {
	...SHARED_CONFIG,
	rootElementName: 'NSDoc' as const,
} as const satisfies AnyDialecteConfig

export type Config = Readonly<typeof NSD_DIALECTE_CONFIG>
