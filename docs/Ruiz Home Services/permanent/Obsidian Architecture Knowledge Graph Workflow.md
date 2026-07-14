# Obsidian Architecture Knowledge Graph Workflow

The Obsidian architecture knowledge graph workflow keeps repository knowledge aligned with observable implementation instead of roadmap intent. The vault lives under `docs/Ruiz Home Services` and currently uses `inbox` for raw notes, `permanent` for durable architecture nodes and maps, and `reference` for planning constraints or vendor-facing context. Permanent notes should explain implemented components, workflows, or boundaries that can be verified through source files, scripts, migrations, configuration, or maintained documentation. Reference notes may preserve unimplemented Square, marketplace, compliance, or product-policy material, but they must not present that material as runtime behavior. The workflow is: inventory existing notes, resolve aliases and wikilinks, compare claims against the codebase, update existing nodes before creating duplicates, and validate every materially rewritten architecture node with an exact body word count. The [[Ruiz Home Services Architecture Map]] is the navigation layer for implemented architecture, while focused nodes such as [[Next.js App Router Scaffold Boundary]] and [[Structured JSON Logging Boundary]] carry the durable technical explanations. Garbage collection is allowed only after raw inbox content has been transferred into validated permanent or reference notes. Failure states include unresolved links, notes that describe planned workflows as implemented, duplicate nodes for the same boundary, stale word counts, and graph edges that imply dependencies not supported by the repository. A scan should clearly report when a reference note informs future architecture without being a dependency of live code. Future scans should treat the vault as maintained documentation and should update links in the same change as any note move, rename, merge, or deletion.

***
**System Dependencies and Connections:**
- [[Ruiz Home Services Architecture Map]]
- [[Next.js App Router Scaffold Boundary]]
- [[Structured JSON Logging Boundary]]

Word Count: 250
