---
description: Types reference for @dialecte/nsd - pre-bound generics from @dialecte/core.
---

# Types

`@dialecte/nsd` exports an `Nsd` namespace that re-exports every `@dialecte/core` generic pre-applied to the NSD config. Import it once; use across your entire codebase without repeating the config type argument.

```ts
import type { Nsd } from '@dialecte/nsd/v2017A'

function processLNClass(record: Nsd.TrackedRecord<'LNClass'>) { ... }
```

## Type table

| Type                                     | Core equivalent                                             | Description                                                                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Nsd.Project<Custom>`                    | `Core.Project<Config, Extensions & Custom>`                 | Project instance returned by `createNsdProject().open()`. `Custom` is the extension modules passed to `createNsdProject`.                                  |
| `Nsd.Document`                           | `Core.Document<Config, Extensions>`                         | Per-file accessor returned by `project.openDocument()`.                                                                                                    |
| `Nsd.ExtendedDocument<Custom>`           | `Core.ExtendedDocument<Config, Extensions & Custom>`        | Document carrying the custom extension modules.                                                                                                            |
| `Nsd.Query`                              | `Core.Query<Config> & Core.QueryExtensions<Extensions>`     | Read-only accessor. Passed as first arg to query extensions.                                                                                               |
| `Nsd.Transaction`                        | `Core.Transaction<Config> & Core.AllExtensions<Extensions>` | Staged mutation accessor. Also extends `Query` - all read methods are available.                                                                           |
| `Nsd.TransactionHooks`                   | `Core.TransactionHooks<Config>`                             | Hook definitions for before/after transaction lifecycle events.                                                                                            |
| `Nsd.Context`                            | `Core.Context<Config>`                                      | Raw DB handle, used when writing low-level hooks or standalone utilities.                                                                                  |
| `Nsd.ElementsOf`                         | `Core.ElementsOf<Config>`                                   | String union of all 45 element tag names (`'NS' \| 'LNClass' \| 'DataObject' \| ...`).                                                                     |
| `Nsd.SingletonElementsOf`                | `Core.SingletonElementsOf<Config>`                          | Subset of `ElementsOf` for elements that may only appear once per document.                                                                                |
| `Nsd.Ref<E>`                             | `Core.Ref<Config, E>`                                       | Lightweight stable reference to a record.                                                                                                                  |
| `Nsd.TrackedRecord<E>`                   | `Core.TrackedRecord<Config, E>`                             | A persisted record as returned by query methods.                                                                                                           |
| `Nsd.RawRecord<E>`                       | `Core.RawRecord<Config, E>`                                 | Record shape without DB tracking - used in hooks and before-persist operations.                                                                            |
| `Nsd.TreeRecord<E>`                      | `Core.TreeRecord<Config, E>`                                | Record with its full subtree inlined. Produced by `query.getTree()`.                                                                                       |
| `Nsd.AttributesValueObjectOf<E, Parent>` | `Core.AttributesValueObjectOf<Config, E, Parent>`           | Plain object of attribute name to value for element `E` - as declared under `Parent` when one is named. A union on `'xsi:type'` where `E` may name a type. |
| `Nsd.FullAttributeObjectOf<E>`           | `Core.FullAttributeObjectOf<Config, E>`                     | Full attribute object including optional fields for element `E`.                                                                                           |
| `Nsd.AttributesOf<E, Parent>`            | `Core.AttributesOf<Config, E, Parent>`                      | Union of valid attribute name strings for element `E` - as declared under `Parent` when one is named.                                                      |
| `Nsd.ChildrenOf<E>`                      | `Core.ChildrenOf<Config, E>`                                | Union of element tag names that may appear as direct children of `E`.                                                                                      |
| `Nsd.ParentsOf<E>`                       | `Core.ParentsOf<Config, E>`                                 | Union of element tag names that may be a direct parent of `E`.                                                                                             |
| `Nsd.DescendantsOf<E>`                   | `Core.DescendantsOf<Config, E>`                             | All element tag names transitively reachable as descendants of `E`.                                                                                        |
| `Nsd.AncestorsOf<E>`                     | `Core.AncestorsOf<Config, E>`                               | All element tag names that can appear as ancestors of `E`.                                                                                                 |
| `Nsd.RootElementOf`                      | `Core.RootElementOf<Config>`                                | The root element tag name - `'NS'` for NSD files, `'NSDoc'` for NSDoc files.                                                                               |
| `Nsd.ParentRelationship<E>`              | `Core.ParentRelationship<Config, E>`                        | Typed parent relationship descriptor for element `E`.                                                                                                      |
| `Nsd.ChildRelationship<E>`               | `Core.ChildRelationship<Config, E>`                         | Typed child relationship descriptor for element `E`.                                                                                                       |
| `Nsd.Attribute<E>`                       | `Core.Attribute<Config, E>`                                 | A single attribute name-value pair for element `E`.                                                                                                        |
| `Nsd.QualifiedAttribute<E>`              | `Core.QualifiedAttribute<Config, E>`                        | Attribute with namespace qualification for element `E`.                                                                                                    |
| `Nsd.Operation`                          | `Core.Operation<Config>`                                    | A single staged DB operation (insert, update, delete).                                                                                                     |
| `Nsd.CloneMapping`                       | `Core.CloneMapping<Config>`                                 | Mapping of original record IDs to cloned record IDs, produced by `tx.clone()`.                                                                             |

`Parent` is optional: without it, `AttributesValueObjectOf` and `AttributesOf` give the tag-level type.

## Elements that take a type with `xsi:type`

An element the schema lets take another type with `xsi:type` has a union attribute type, one member per type: `Attributes<Tag>_<type>` for each type it may name, `Attributes<Tag>_Own` for the element's own attributes. Each member carries the attributes its type declares, so an attribute only one type declares exists on that member alone. `Nsd.AttributesValueObjectOf<'ConstructedAttribute'>` is that union.

`ConstructedAttribute` may take `tServiceConstructedAttribute`, which adds `typeKindParameterized`:

```ts
// AttributesConstructedAttribute_Own
{ 'xsi:type'?: 'tConstructedAttribute'; name: string; titleID: string; ...; typeKindParameterized?: undefined }
// AttributesConstructedAttribute_tServiceConstructedAttribute
{ 'xsi:type': 'tServiceConstructedAttribute'; name: string; titleID: string; ...; typeKindParameterized?: string }
```

Write with the type - the member then allows its attributes:

```ts
await tx.addChild(constructedAttributes, {
	tagName: 'ConstructedAttribute',
	attributes: {
		'xsi:type': 'tServiceConstructedAttribute',
		name: 'ServiceType',
		titleID: 'ServiceType.title',
		typeKindParameterized: 'true',
	},
})
```

A filter may leave the type out and match across types, or name it to narrow:

```ts
// every ConstructedAttribute named ServiceType, whatever its type
await doc.query.findByAttributes({
	tagName: 'ConstructedAttribute',
	attributes: { name: 'ServiceType' },
})

// only the ones typed tServiceConstructedAttribute
await doc.query.findByAttributes({
	tagName: 'ConstructedAttribute',
	attributes: { 'xsi:type': 'tServiceConstructedAttribute', name: 'ServiceType' },
})
```

`ServiceTypeRealization` takes the same type the same way.

## Attributes as declared under a parent

A tag the schema declares several ways has one attribute type per declaration. `AttributesOf` and `AttributesValueObjectOf` take the parent as second parameter to pick the declaration under it:

```ts
type DataObjectInLNClass = Nsd.AttributesOf<'DataObject', 'LNClass'>
```

In the NSD definition every tag has the same attributes under each of its parents, so the parent form and the tag form agree.

## How types stay in sync with core

Each alias is defined in `src/v2017A/config/hydrated.types.ts` as:

```ts
export namespace Nsd {
	export type Query = Core.Query<Config> & Core.QueryExtensions<NsdExtensions>
	export type TrackedRecord<E extends ElementsOf> = Core.TrackedRecord<Config, E>
	// ...
}
```

The `Config` type is derived from `NSD_DIALECTE_CONFIG`, which `@dialecte/create` generates from the IEC 61850 NSD XSD - so the types update automatically whenever the definition is regenerated.
