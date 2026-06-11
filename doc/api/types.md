---
description: Types reference for @dialecte/nsd - pre-bound generics from @dialecte/core.
---

# Types

`@dialecte/nsd` exports an `Nsd` namespace that re-exports every `@dialecte/core` generic pre-applied to the NSD config. Import it once; use across your entire codebase without repeating the config type argument.

```ts
import type { Nsd } from '@dialecte/nsd'

function processLNClass(record: Nsd.TrackedRecord<'LNClass'>) { ... }
```

## Type table

| Type                             | Core equivalent                           | Description                                                                              |
| -------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `Nsd.Project`                    | `Core.Project<Config, Extensions>`        | Project instance returned by `createNsdProject().open()`.                                |
| `Nsd.Document`                   | `Core.Document<Config, Extensions>`       | Per-file accessor returned by `project.openDocument()`.                                  |
| `Nsd.Query`                      | `Core.Query<Config>`                      | Read-only accessor. Passed as first arg to query extensions.                             |
| `Nsd.Transaction`                | `Core.Transaction<Config>`                | Staged mutation accessor. Also extends `Query` - all read methods are available.         |
| `Nsd.TransactionHooks`           | `Core.TransactionHooks<Config>`           | Hook definitions for before/after transaction lifecycle events.                          |
| `Nsd.Context`                    | `Core.Context<Config>`                    | Raw DB handle, used when writing low-level hooks or standalone utilities.                |
| `Nsd.ElementsOf`                 | `Core.ElementsOf<Config>`                 | String union of all 151+ element tag names (`'NS' \| 'LNClass' \| 'DataObject' \| ...`). |
| `Nsd.SingletonElementsOf`        | `Core.SingletonElementsOf<Config>`        | Subset of `ElementsOf` for elements that may only appear once per document.              |
| `Nsd.Ref<E>`                     | `Core.Ref<Config, E>`                     | Lightweight stable reference to a record.                                                |
| `Nsd.TrackedRecord<E>`           | `Core.TrackedRecord<Config, E>`           | A persisted record as returned by query methods.                                         |
| `Nsd.RawRecord<E>`               | `Core.RawRecord<Config, E>`               | Record shape without DB tracking - used in hooks and before-persist operations.          |
| `Nsd.TreeRecord<E>`              | `Core.TreeRecord<Config, E>`              | Record with its full subtree inlined. Produced by `query.getTree()`.                     |
| `Nsd.AttributesValueObjectOf<E>` | `Core.AttributesValueObjectOf<Config, E>` | Plain object of attribute name to value for element `E`.                                 |
| `Nsd.FullAttributeObjectOf<E>`   | `Core.FullAttributeObjectOf<Config, E>`   | Full attribute object including optional fields for element `E`.                         |
| `Nsd.AttributesOf<E>`            | `Core.AttributesOf<Config, E>`            | Union of valid attribute name strings for element `E`.                                   |
| `Nsd.ChildrenOf<E>`              | `Core.ChildrenOf<Config, E>`              | Union of element tag names that may appear as direct children of `E`.                    |
| `Nsd.ParentsOf<E>`               | `Core.ParentsOf<Config, E>`               | Union of element tag names that may be a direct parent of `E`.                           |
| `Nsd.DescendantsOf<E>`           | `Core.DescendantsOf<Config, E>`           | All element tag names transitively reachable as descendants of `E`.                      |
| `Nsd.AncestorsOf<E>`             | `Core.AncestorsOf<Config, E>`             | All element tag names that can appear as ancestors of `E`.                               |
| `Nsd.RootElementOf`              | `Core.RootElementOf<Config>`              | The root element tag name - `'NS'` for NSD files, `'NSDoc'` for NSDo files.              |
| `Nsd.ParentRelationship<E>`      | `Core.ParentRelationship<Config, E>`      | Typed parent relationship descriptor for element `E`.                                    |
| `Nsd.ChildRelationship<E>`       | `Core.ChildRelationship<Config, E>`       | Typed child relationship descriptor for element `E`.                                     |
| `Nsd.Attribute<E>`               | `Core.Attribute<Config, E>`               | A single attribute name-value pair for element `E`.                                      |
| `Nsd.QualifiedAttribute<E>`      | `Core.QualifiedAttribute<Config, E>`      | Attribute with namespace qualification for element `E`.                                  |
| `Nsd.Operation`                  | `Core.Operation<Config>`                  | A single staged DB operation (insert, update, delete).                                   |
| `Nsd.CloneMapping`               | `Core.CloneMapping<Config>`               | Mapping of original record IDs to cloned record IDs, produced by `tx.clone()`.           |

## How types stay in sync with core

Each alias is defined in `src/config/hydrated.types.ts` as:

```ts
export namespace Nsd {
	export type Query = Core.Query<Config>
	export type TrackedRecord<E extends ElementsOf> = Core.TrackedRecord<Config, E>
	// ...
}
```

The `Config` type is derived from `NSD_DIALECTE_CONFIG` which is generated from the IEC 61850 NSD XSD - so the types update automatically whenever the definition is regenerated.
