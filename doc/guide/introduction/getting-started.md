# Getting Started

## Installation

::: code-group

```sh [npm]
$ npm i @dialecte/nsd
```

```sh [pnpm]
$ pnpm add @dialecte/nsd
```

:::

## Step 1 - Create a project

`createNsdProject` returns a [`Project`](https://dialecte.github.io/core/api/project) pre-configured with the NSD config and extensions. Call `.open(name)` to initialize storage and hydrate state.

```ts
import { createNsdProject } from '@dialecte/nsd/v2017A'

const project = await createNsdProject({ storage: { type: 'local' } }).open('my-project')
```

## Step 2 - Import an NSD file

`project.importFile` parses one NSD file and stores it as a document in the project; it returns the imported document, or throws what failed (`PARSE_ERROR` for a malformed file). To import several files at once, `project.import(files)` answers one entry per file, `imported` or `failed`.

Supports `.nsd` and `.nsdoc`.

```ts
// Browser File object - e.g. from an <input type="file">
const { documentId } = await project.importFile(nsdFile)
```

## Step 3 - Open a document

Once a file is imported, get a per-file `Document` for queries and mutations:

```ts
const doc = project.openDocument(documentId)
```

## Step 4 - Query the tree

Use `doc.query` to read records:

```ts
const root = await doc.query.getRoot()

// Find all LNClass elements
const { LNClass: lnClasses } = await doc.query.findDescendants(root)

for (const lnClass of lnClasses) {
	const { name } = await doc.query.getAttributes(lnClass)
	console.log(lnClass.id, name)
}
```

## Step 5 - Mutate the tree

Mutations happen inside a `transaction`. All operations are staged and committed atomically:

```ts
await doc.transaction(async (tx) => {
	await tx.update(ref, { attributes: { name: 'MyUpdatedLNClass' } })
})
```

## Step 6 - Export

`project.export` writes a document back to an NSD XML file. Pass `download: true` to save it as well (the save dialog where the browser has one, a download otherwise).

```ts
const { file, filename } = await project.export({ documentId })
```
