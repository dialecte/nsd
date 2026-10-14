# What is NSD Dialecte?

`@dialecte/nsd` is a **Dialecte implementation** for [IEC 61850](https://webstore.iec.ch/publication/6028) NSD — the Network Substation Description format used in IEC 61850 engineering tools. It turns the NSD XML format into a fully-typed DSL backed by IndexedDB, with a Document/Query/Transaction API.

If you haven't read it yet, [What is Dialecte?](https://dialecte.github.io/core/guide/introduction/what-is-dialecte) explains the general model. This page focuses on what `@dialecte/nsd` adds on top.

## What NSD is

NSD (Network Substation Description) is the XML format defined by IEC 61850 for describing logical nodes, data objects, and service models. It provides the normative type model that SCL files reference. Files use the `.nsd` extension (or `.nsdoc` for documentation variants) and are governed by the IEC 61850 NSD XSD schema.

NSD files are the engineering-time type catalog for IEC 61850 systems — capturing element definitions, data attribute types, and service constraints used by substation automation tools.

## What the dialecte provides

`@dialecte/nsd` packages three NSD-specific layers on top of `@dialecte/core`:

### 1. Generated definition

The NSD definition is generated from the **IEC 61850 NSD XSD** by `@dialecte/create`. Every element, attribute, parent-child constraint and namespace declared in the standard is captured in a typed config object:

- a tag the schema declares several ways lists its declarations
- a value's facets (`enumeration`, `minLength`, ...) sit in its datatype
- the content model and the identity fields sit on the declaration that declares them
- `TYPES` holds the types an element may take with `xsi:type`; the config carries it as `NSD_DIALECTE_CONFIG.types`

Read an element's definition through `query.getDefinition(ref)`: it returns the declaration that applies under the element's parent, and what the type it names with `xsi:type` lets it hold. Code that reads `DEFINITION` directly must handle the declarations itself.

`DataAttribute`, `SubDataObject` and `ServiceParameter` are identified by their `name`, as the schema says.

Two configs are provided:

- `NSD_DIALECTE_CONFIG` — for `.nsd` files (root element: `NS`)
- `NSDOC_DIALECTE_CONFIG` — for `.nsdoc` files (root element: `NSDoc`)

```ts
import { createNsdProject } from '@dialecte/nsd/v2017A'
```

::: tip Regenerating the definition
The schema lets four elements start a document. Regenerate with `@dialecte/create` and `--root NS`.
:::

### 2. Domain extensions

No extensions are bundled yet. Custom extensions can be added via the `extensions` parameter:

```ts
const project = await createNsdProject({
	extensions: { myFeature },
}).open('my-project')
```

### 3. IO

`project.import` accepts `.nsd` and `.nsdoc` files and streams them into IndexedDB. `project.export` serializes back to NSD XML.

Supported file extensions: `.nsd`, `.nsdoc`
