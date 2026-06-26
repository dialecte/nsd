# Nsd public-type readability audit

Every public method (resolved param + return — the form an editor shows when you hover a call)
and every namespace type is rendered with NoTruncation, then measured. Methods are discovered
dynamically (Query/Transaction/Document/Project incl. extension groups), so this covers core's
classes AND the dialect's extensions. Rows sorted worst-first.

**Columns** — `len`: characters in the render (proxy for hover size; bigger = noisier).
`members`: element-union members surfaced. `causes`: matched root cause(s) (legend below).

**Root-cause legend**

- **C1 module-noise** — `import("…/extensions/…")` refs inflate the render. Fix: name containers / annotate returns.
- **C2/C4 element-union** — the full element-name union appears. Largely inherent to a config-driven DSL.
- **C3 wide-input-union** — a wide multi-member input union, each member expanded.
- **C5 record-seam** — a record renders as `RawRecord<…> & { status }` instead of one clean object.
- **C6 recursive** — self-referential `TreeRecord`/`TreeSelect`.

## Methods — resolved param/return (105 methods discovered)

| Member                                      | len     | members | causes                          |
| ------------------------------------------- | ------- | ------- | ------------------------------- |
| q.findDescendants(…) → return               | 309,912 | 0       | C1 module-noise                 |
| tx.findDescendants(…) → return              | 309,912 | 0       | C1 module-noise                 |
| doc.query.findDescendants(…) → return       | 309,912 | 0       | C1 module-noise                 |
| q.findByAttributes(…) param                 | 169,233 | 1       | C1 module-noise                 |
| tx.findByAttributes(…) param                | 169,233 | 1       | C1 module-noise                 |
| doc.query.findByAttributes(…) param         | 169,233 | 1       | C1 module-noise                 |
| q.getRecords(…) → return                    | 154,970 | 0       | C1 module-noise                 |
| tx.getRecords(…) → return                   | 154,970 | 0       | C1 module-noise                 |
| doc.query.getRecords(…) → return            | 154,970 | 0       | C1 module-noise                 |
| q.getRecords(…) param                       | 154,968 | 0       | C1 module-noise                 |
| tx.getRecords(…) param                      | 154,968 | 0       | C1 module-noise                 |
| doc.query.getRecords(…) param               | 154,968 | 0       | C1 module-noise                 |
| q.getRecord(…) → return                     | 154,966 | 0       | C1 module-noise                 |
| tx.getRecord(…) → return                    | 154,966 | 0       | C1 module-noise                 |
| doc.query.getRecord(…) → return             | 154,966 | 0       | C1 module-noise                 |
| q.getRecord(…) param                        | 154,964 | 0       | C1 module-noise                 |
| q.getChild(…) param                         | 154,964 | 0       | C1 module-noise                 |
| q.getChildren(…) param                      | 154,964 | 0       | C1 module-noise                 |
| q.findDescendants(…) param                  | 154,964 | 0       | C1 module-noise                 |
| q.findAncestors(…) param                    | 154,964 | 0       | C1 module-noise                 |
| q.getTree(…) param                          | 154,964 | 0       | C1 module-noise                 |
| q.getAttribute(…) param                     | 154,964 | 0       | C1 module-noise                 |
| q.getAttributes(…) param                    | 154,964 | 0       | C1 module-noise                 |
| tx.addChild(…) param                        | 154,964 | 0       | C1 module-noise                 |
| tx.ensureChild(…) param                     | 154,964 | 0       | C1 module-noise                 |
| tx.update(…) param                          | 154,964 | 0       | C1 module-noise                 |
| tx.delete(…) param                          | 154,964 | 0       | C1 module-noise                 |
| tx.deepClone(…) param                       | 154,964 | 0       | C1 module-noise                 |
| tx.getRecord(…) param                       | 154,964 | 0       | C1 module-noise                 |
| tx.getChild(…) param                        | 154,964 | 0       | C1 module-noise                 |
| tx.getChildren(…) param                     | 154,964 | 0       | C1 module-noise                 |
| tx.findDescendants(…) param                 | 154,964 | 0       | C1 module-noise                 |
| tx.findAncestors(…) param                   | 154,964 | 0       | C1 module-noise                 |
| tx.getTree(…) param                         | 154,964 | 0       | C1 module-noise                 |
| tx.getAttribute(…) param                    | 154,964 | 0       | C1 module-noise                 |
| tx.getAttributes(…) param                   | 154,964 | 0       | C1 module-noise                 |
| doc.query.getRecord(…) param                | 154,964 | 0       | C1 module-noise                 |
| doc.query.getChild(…) param                 | 154,964 | 0       | C1 module-noise                 |
| doc.query.getChildren(…) param              | 154,964 | 0       | C1 module-noise                 |
| doc.query.findDescendants(…) param          | 154,964 | 0       | C1 module-noise                 |
| doc.query.findAncestors(…) param            | 154,964 | 0       | C1 module-noise                 |
| doc.query.getTree(…) param                  | 154,964 | 0       | C1 module-noise                 |
| doc.query.getAttribute(…) param             | 154,964 | 0       | C1 module-noise                 |
| doc.query.getAttributes(…) param            | 154,964 | 0       | C1 module-noise                 |
| q.getTree(…) → return                       | 154,963 | 0       | C1 module-noise, C6 recursive   |
| tx.getTree(…) → return                      | 154,963 | 0       | C1 module-noise, C6 recursive   |
| doc.query.getTree(…) → return               | 154,963 | 0       | C1 module-noise, C6 recursive   |
| q.findAncestors(…) → return                 | 154,956 | 0       | C1 module-noise                 |
| q.findByAttributes(…) → return              | 154,956 | 0       | C1 module-noise                 |
| tx.findAncestors(…) → return                | 154,956 | 0       | C1 module-noise                 |
| tx.findByAttributes(…) → return             | 154,956 | 0       | C1 module-noise                 |
| doc.query.findAncestors(…) → return         | 154,956 | 0       | C1 module-noise                 |
| doc.query.findByAttributes(…) → return      | 154,956 | 0       | C1 module-noise                 |
| tx.update(…) → return                       | 154,950 | 0       | C1 module-noise                 |
| tx.deepClone(…) → return                    | 154,897 | 0       | C1 module-noise                 |
| tx.addChild(…) → return                     | 154,895 | 0       | C1 module-noise                 |
| tx.ensureChild(…) → return                  | 154,895 | 0       | C1 module-noise                 |
| tx.delete(…) → return                       | 154,664 | 0       | C1 module-noise                 |
| doc.transaction(…) param                    | 154,275 | 0       | C1 module-noise                 |
| doc.prepare(…) param                        | 154,272 | 0       | C1 module-noise                 |
| project.openDocument(…) → return            | 154,252 | 0       | C1 module-noise                 |
| project.queryAll(…) param                   | 154,225 | 0       | C1 module-noise                 |
| project.queryFirst(…) param                 | 154,223 | 0       | C1 module-noise                 |
| q.getRoot(…) → return                       | 154,213 | 0       | C1 module-noise, C5 record-seam |
| tx.getRoot(…) → return                      | 154,213 | 0       | C1 module-noise, C5 record-seam |
| doc.query.getRoot(…) → return               | 154,213 | 0       | C1 module-noise, C5 record-seam |
| tx.getStagedOperations(…) → return          | 154,160 | 0       | C1 module-noise                 |
| doc.prepare(…) → return                     | 154,159 | 0       | C1 module-noise                 |
| q.getRecordsByTagName(…) param              | 799     | 0       | —                               |
| tx.getRecordsByTagName(…) param             | 799     | 0       | —                               |
| doc.query.getRecordsByTagName(…) param      | 799     | 0       | —                               |
| tx.any.deepClone(…) → return                | 233     | 2       | C1 module-noise                 |
| tx.any.ensureChild(…) → return              | 81      | 0       | C1 module-noise                 |
| project.getBlob(…) → return                 | 76      | 0       | C1 module-noise                 |
| q.any.findByAttributes(…) param             | 72      | 1       | —                               |
| tx.any.findByAttributes(…) param            | 72      | 1       | —                               |
| project.initEmptyDocument(…) param          | 61      | 0       | C1 module-noise                 |
| q.any.findDescendants(…) → return           | 59      | 0       | C1 module-noise                 |
| tx.any.findDescendants(…) → return          | 59      | 0       | C1 module-noise                 |
| q.any.getRecords(…) → return                | 57      | 0       | C1 module-noise                 |
| tx.any.getRecords(…) → return               | 57      | 0       | C1 module-noise                 |
| q.any.getRecord(…) → return                 | 53      | 0       | C1 module-noise                 |
| q.any.getChild(…) → return                  | 53      | 0       | C1 module-noise                 |
| tx.any.getRecord(…) → return                | 53      | 0       | C1 module-noise                 |
| tx.any.getChild(…) → return                 | 53      | 0       | C1 module-noise                 |
| project.export(…) → return                  | 52      | 0       | —                               |
| q.any.getAttribute(…) param                 | 51      | 0       | C1 module-noise                 |
| q.any.getAttributes(…) param                | 51      | 0       | C1 module-noise                 |
| q.any.getTree(…) param                      | 51      | 0       | C1 module-noise                 |
| q.any.findDescendants(…) param              | 51      | 0       | C1 module-noise                 |
| q.any.findAncestors(…) param                | 51      | 0       | C1 module-noise                 |
| tx.any.getAttribute(…) param                | 51      | 0       | C1 module-noise                 |
| tx.any.getAttributes(…) param               | 51      | 0       | C1 module-noise                 |
| tx.any.getTree(…) param                     | 51      | 0       | C1 module-noise                 |
| tx.any.findDescendants(…) param             | 51      | 0       | C1 module-noise                 |
| tx.any.findAncestors(…) param               | 51      | 0       | C1 module-noise                 |
| project.import(…) → return                  | 51      | 0       | —                               |
| project.getDocument(…) → return             | 51      | 0       | C1 module-noise                 |
| q.any.getTree(…) → return                   | 50      | 0       | C1 module-noise                 |
| tx.any.getTree(…) → return                  | 50      | 0       | C1 module-noise                 |
| q.any.getAttribute(…) → return              | 49      | 0       | C1 module-noise                 |
| tx.any.getAttribute(…) → return             | 49      | 0       | C1 module-noise                 |
| q.any.getChildren(…) → return               | 43      | 0       | C1 module-noise                 |
| q.any.getRecordsByTagName(…) → return       | 43      | 0       | C1 module-noise                 |
| q.any.findAncestors(…) → return             | 43      | 0       | C1 module-noise                 |
| q.any.findByAttributes(…) → return          | 43      | 0       | C1 module-noise                 |
| tx.any.getChildren(…) → return              | 43      | 0       | C1 module-noise                 |
| tx.any.getRecordsByTagName(…) → return      | 43      | 0       | C1 module-noise                 |
| tx.any.findAncestors(…) → return            | 43      | 0       | C1 module-noise                 |
| tx.any.findByAttributes(…) → return         | 43      | 0       | C1 module-noise                 |
| project.getDocuments(…) → return            | 41      | 0       | C1 module-noise                 |
| project.exportBlob(…) → return              | 41      | 0       | C1 module-noise                 |
| q.any.getChild(…) param                     | 39      | 0       | C1 module-noise                 |
| q.any.getChildren(…) param                  | 39      | 0       | C1 module-noise                 |
| q.any.getAttributes(…) → return             | 39      | 0       | C1 module-noise                 |
| tx.any.addChild(…) param                    | 39      | 0       | C1 module-noise                 |
| tx.any.ensureChild(…) param                 | 39      | 0       | C1 module-noise                 |
| tx.any.update(…) param                      | 39      | 0       | C1 module-noise                 |
| tx.any.delete(…) param                      | 39      | 0       | C1 module-noise                 |
| tx.any.deepClone(…) param                   | 39      | 0       | C1 module-noise                 |
| tx.any.getChild(…) param                    | 39      | 0       | C1 module-noise                 |
| tx.any.getChildren(…) param                 | 39      | 0       | C1 module-noise                 |
| tx.any.getAttributes(…) → return            | 39      | 0       | C1 module-noise                 |
| tx.any.addChild(…) → return                 | 37      | 0       | C1 module-noise                 |
| tx.any.update(…) → return                   | 37      | 0       | C1 module-noise                 |
| tx.any.delete(…) → return                   | 37      | 0       | C1 module-noise                 |
| project.getBlobsByDocument(…) → return      | 37      | 0       | C1 module-noise                 |
| project.getBlobsByRecord(…) → return        | 37      | 0       | C1 module-noise                 |
| project.getStandaloneBlobs(…) → return      | 37      | 0       | C1 module-noise                 |
| Nsd.Project (container)                     | 33      | -       | —                               |
| q.any.getRecords(…) param                   | 33      | 0       | C1 module-noise                 |
| tx.any.getRecords(…) param                  | 33      | 0       | C1 module-noise                 |
| project.open(…) → return                    | 33      | 0       | —                               |
| q.any.getRecord(…) param                    | 31      | 0       | C1 module-noise                 |
| tx.any.getRecord(…) param                   | 31      | 0       | C1 module-noise                 |
| Nsd.Transaction (container)                 | 15      | -       | —                               |
| Nsd.Document (container)                    | 12      | -       | —                               |
| Nsd.Query (container)                       | 9       | -       | —                               |
| q.getFilename(…) param                      | 9       | 0       | —                               |
| q.getRoot(…) param                          | 9       | 0       | —                               |
| q.getAttribute(…) → return                  | 9       | 0       | —                               |
| tx.getStagedOperations(…) param             | 9       | 0       | —                               |
| tx.clearStagedOperations(…) param           | 9       | 0       | —                               |
| tx.clearRecordCache(…) param                | 9       | 0       | —                               |
| tx.clearCumulativeCloneMappings(…) param    | 9       | 0       | —                               |
| tx.commit(…) param                          | 9       | 0       | —                               |
| tx.getFilename(…) param                     | 9       | 0       | —                               |
| tx.getRoot(…) param                         | 9       | 0       | —                               |
| tx.getAttribute(…) → return                 | 9       | 0       | —                               |
| doc.query.getFilename(…) param              | 9       | 0       | —                               |
| doc.query.getRoot(…) param                  | 9       | 0       | —                               |
| doc.query.getAttribute(…) → return          | 9       | 0       | —                               |
| doc.close(…) param                          | 9       | 0       | —                               |
| doc.destroy(…) param                        | 9       | 0       | —                               |
| project.close(…) param                      | 9       | 0       | —                               |
| project.destroy(…) param                    | 9       | 0       | —                               |
| project.getDocuments(…) param               | 9       | 0       | —                               |
| project.getStandaloneBlobs(…) param         | 9       | 0       | —                               |
| project.queryAll(…) → return                | 9       | 0       | —                               |
| project.getDatabaseInstance(…) param        | 9       | 0       | —                               |
| q.getAttributes(…) → return                 | 7       | 0       | —                               |
| tx.getAttributes(…) → return                | 7       | 0       | —                               |
| doc.query.getAttributes(…) → return         | 7       | 0       | —                               |
| doc.transaction(…) → return                 | 7       | 0       | —                               |
| project.queryFirst(…) → return              | 7       | 0       | —                               |
| project.getDatabaseInstance(…) → return     | 7       | 0       | —                               |
| q.any.getRecordsByTagName(…) param          | 6       | 0       | —                               |
| q.getFilename(…) → return                   | 6       | 0       | —                               |
| tx.any.getRecordsByTagName(…) param         | 6       | 0       | —                               |
| tx.getFilename(…) → return                  | 6       | 0       | —                               |
| doc.query.getFilename(…) → return           | 6       | 0       | —                               |
| project.open(…) param                       | 6       | 0       | —                               |
| project.initEmptyDocument(…) → return       | 6       | 0       | —                               |
| project.removeDocument(…) param             | 6       | 0       | —                               |
| project.import(…) param                     | 6       | 0       | —                               |
| project.export(…) param                     | 6       | 0       | —                               |
| project.getDocument(…) param                | 6       | 0       | —                               |
| project.openDocument(…) param               | 6       | 0       | —                               |
| project.getDocumentConfig(…) param          | 6       | 0       | —                               |
| project.undo(…) param                       | 6       | 0       | —                               |
| project.redo(…) param                       | 6       | 0       | —                               |
| project.addBlob(…) param                    | 6       | 0       | —                               |
| project.addBlob(…) → return                 | 6       | 0       | —                               |
| project.getBlob(…) param                    | 6       | 0       | —                               |
| project.exportBlob(…) param                 | 6       | 0       | —                               |
| project.getBlobsByDocument(…) param         | 6       | 0       | —                               |
| project.getBlobsByRecord(…) param           | 6       | 0       | —                               |
| project.attachBlob(…) param                 | 6       | 0       | —                               |
| project.detachBlob(…) param                 | 6       | 0       | —                               |
| project.removeBlob(…) param                 | 6       | 0       | —                               |
| project.getDocumentConfig(…) → return       | 5       | 0       | —                               |
| tx.clearStagedOperations(…) → return        | 4       | 0       | —                               |
| tx.clearRecordCache(…) → return             | 4       | 0       | —                               |
| tx.clearCumulativeCloneMappings(…) → return | 4       | 0       | —                               |
| tx.commit(…) → return                       | 4       | 0       | —                               |
| doc.close(…) → return                       | 4       | 0       | —                               |
| doc.destroy(…) → return                     | 4       | 0       | —                               |
| project.close(…) → return                   | 4       | 0       | —                               |
| project.destroy(…) → return                 | 4       | 0       | —                               |
| project.removeDocument(…) → return          | 4       | 0       | —                               |
| project.undo(…) → return                    | 4       | 0       | —                               |
| project.redo(…) → return                    | 4       | 0       | —                               |
| project.attachBlob(…) → return              | 4       | 0       | —                               |
| project.detachBlob(…) → return              | 4       | 0       | —                               |
| project.removeBlob(…) → return              | 4       | 0       | —                               |
| q.getChild(…) → return                      | 3       | 0       | —                               |
| q.getChildren(…) → return                   | 3       | 0       | —                               |
| q.getRecordsByTagName(…) → return           | 3       | 0       | —                               |
| tx.getChild(…) → return                     | 3       | 0       | —                               |
| tx.getChildren(…) → return                  | 3       | 0       | —                               |
| tx.getRecordsByTagName(…) → return          | 3       | 0       | —                               |
| doc.query.getChild(…) → return              | 3       | 0       | —                               |
| doc.query.getChildren(…) → return           | 3       | 0       | —                               |
| doc.query.getRecordsByTagName(…) → return   | 3       | 0       | —                               |

## Namespace type aliases (concrete `LNode` + wide `ElementsOf`)

| Member                                  | len | members | causes |
| --------------------------------------- | --- | ------- | ------ |
| Nsd.ElementsOf                          | 799 | 0       | —      |
| Nsd.ChildrenOf<ElementsOf>              | 744 | 0       | —      |
| Nsd.DescendantsOf<ElementsOf>           | 744 | 0       | —      |
| Nsd.AncestorsOf<ElementsOf>             | 513 | 0       | —      |
| Nsd.ParentsOf<ElementsOf>               | 513 | 0       | —      |
| Nsd.Ref                                 | 56  | 1       | —      |
| Nsd.AttributesValueObjectOf<ElementsOf> | 27  | 0       | —      |
| Nsd.SingletonElementsOf                 | 23  | 0       | —      |
| Nsd.ParentRelationship<ElementsOf>      | 22  | 0       | —      |
| Nsd.QualifiedAttribute<ElementsOf>      | 22  | 0       | —      |
| Nsd.ChildRelationship<ElementsOf>       | 21  | 0       | —      |
| Nsd.ParentRelationship                  | 21  | 0       | —      |
| Nsd.QualifiedAttribute                  | 21  | 0       | —      |
| Nsd.ChildRelationship                   | 20  | 0       | —      |
| Nsd.TransactionHooks                    | 20  | 0       | —      |
| Nsd.TrackedRecord<ElementsOf>           | 17  | 0       | —      |
| Nsd.CloneMapping                        | 16  | 0       | —      |
| Nsd.TrackedRecord                       | 16  | 0       | —      |
| Nsd.Transaction                         | 15  | 0       | —      |
| Nsd.TreeRecord<ElementsOf>              | 14  | 0       | —      |
| Nsd.Attribute<ElementsOf>               | 13  | 0       | —      |
| Nsd.Operation                           | 13  | 0       | —      |
| Nsd.RawRecord<ElementsOf>               | 13  | 0       | —      |
| Nsd.TreeRecord                          | 13  | 0       | —      |
| Nsd.Attribute                           | 12  | 0       | —      |
| Nsd.Document                            | 12  | 0       | —      |
| Nsd.RawRecord                           | 12  | 0       | —      |
| Nsd.Context                             | 11  | 0       | —      |
| Nsd.Project                             | 10  | 0       | —      |
| Nsd.Query                               | 9   | 0       | —      |
| Nsd.AncestorsOf                         | 7   | 0       | —      |
| Nsd.AttributesValueObjectOf             | 7   | 0       | —      |
| Nsd.ChildrenOf                          | 7   | 0       | —      |
| Nsd.DescendantsOf                       | 7   | 0       | —      |
| Nsd.ParentsOf                           | 7   | 0       | —      |
| Nsd.Ref<ElementsOf>                     | 7   | 0       | —      |
| Nsd.AttributesOf                        | 5   | 0       | —      |
| Nsd.AttributesOf<ElementsOf>            | 5   | 0       | —      |
| Nsd.FullAttributeObjectOf               | 5   | 0       | —      |
| Nsd.FullAttributeObjectOf<ElementsOf>   | 5   | 0       | —      |
| Nsd.RootElementOf                       | 4   | 0       | —      |

**Summary:** 105 methods, 26 namespace types, 126/255 rows flagged. Total 11,047,139 chars.
