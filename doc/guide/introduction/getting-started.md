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
import { createNsdProject } from '@dialecte/nsd'

const project = await createNsdProject({ storage: { type: 'local' } }).open('my-project')
```

## Step 2 - Import an NSD file

`project.import` parses one or more NSD files and stores each one as a document in the project.

Supports `.nsd` and `.nsdoc`.

```ts
// Browser File object - e.g. from an <input type="file">
const [{ documentId }] = await project.import([nsdFile])
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

Export back to NSD XML:

```ts
const [blob] = await project.export([documentId])
```
