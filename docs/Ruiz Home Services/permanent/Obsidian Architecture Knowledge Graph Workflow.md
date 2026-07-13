# Obsidian Architecture Knowledge Graph Workflow

The Obsidian architecture knowledge graph workflow turns raw project notes and verified code observations into permanent, linked architecture nodes. The vault lives under `docs/Ruiz Home Services` with `inbox`, `permanent`, `reference`, and `Cheatsheets` folders. At the start of this scan, `permanent` and `reference` were empty, while `inbox` held starter vault notes, a link test, and one useful product workflow note about homeowners, apartment renters, handymen, alerts, acceptance, and scheduling. Starter notes are not architecture, but they do prove intended vault behavior: use Obsidian links such as `[[Gio's Obsidian Cheat Sheet v1.0]]` to associate related nodes, and delete placeholder notes when the vault is ready. Permanent architecture notes should be atomic: one component, workflow, or decision boundary per file. For this repository, a node should distinguish implemented systems from planned systems, because the current codebase contains real auth, role, RLS, logging, and route-shell foundations while marketplace workflows and Square payments remain blocked. The data flow for vault maintenance is inbox to analysis, code evidence to synthesized concept, synthesized concept to cross-linked permanent note, then garbage collection of mapped inbox files. A note should link to upstream and downstream nodes so future scans can traverse the system graph instead of rediscovering context. Failure states include orphan notes, overbroad notes, notes that present planned features as implemented, and stale notes that contradict `AGENTS.md`, migrations, or source code. The permanent folder should now be treated as maintained documentation, not scratch space. Future inbox processing should preserve raw notes until the permanent replacement has a verified word count and at least one meaningful connection.

***
**System Dependencies & Connections:**
- [[Next.js App Router Scaffold Boundary]]
- [[Marketplace Service Lifecycle Decision Gates]]
- [[Structured JSON Logging Boundary]]

Word Count: 258
