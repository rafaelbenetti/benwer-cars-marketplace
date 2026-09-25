# Agent token efficiency

How to work in this workspace without burning a 140k-token context on every new
conversation. Applies to **all** repos under `C:\Users\Benetti\workspace`.

Read this before starting any task. It is short on purpose — a doc about saving
tokens that itself costs tokens is a bad doc.

> **Maintenance:** the canonical copy lives at
> `C:\Users\Benetti\workspace\docs\agent-token-efficiency.md`. Each repo keeps an
> identical copy under its own `docs/` so links survive a solo clone. Edit the
> canonical file, then copy it to every repo and commit. Do not edit one repo's
> copy in isolation.

---

## The core problem

Most of the context in a long session is **not** your reasoning. It is:

1. Whole files read when a 20-line window would do.
2. Full test/coverage output pasted into the transcript.
3. Re-reading the same file after every edit.
4. Re-deriving facts the previous turn already established.
5. Docs re-summarised in chat instead of just followed.

Each of these is avoidable. The rules below target them directly.

---

## 1. Never `Read` a whole file by default

**Do:** search first, then read a window.

```
Grep  pattern="function buildReservationTimelineEvents" -A 20
Read  path=... offset=100 limit=40
```

**Don't:** `Read` a 900-line module to find one function.

Rules of thumb:

- Files under ~150 lines: reading whole is fine.
- Files over ~300 lines: grep for the symbol, then read `offset`/`limit` around it.
- Need a type? Grep the interface name — it is usually in `src/types/*.ts`, not
  in the implementation.
- Never read `node_modules`, lockfiles, `coverage/`, `.expo/`, or generated
  clients (`src/services/api/generated/**`).

## 2. Keep tool output small at the source

Large output is not free even when it is "saved to a file" — it still lands in
the transcript unless you filter it.

**Do:**

```powershell
npx vitest run src/lib/foo.test.ts 2>&1 | Select-String "Tests |AssertionError"
npm run typecheck 2>&1 | Select-String "error TS"
```

**Don't:**

```powershell
npx vitest run --coverage          # full report, every file
npm run typecheck                  # 100+ lines of success noise
git diff                           # unbounded
```

Rules:

- Always filter test/lint/typecheck output to failures plus the summary line.
- Use `Select-Object -Last N` for build logs, not `Select-Object -First N`
  (the failure is at the end).
- `git diff --stat` before `git diff`; `git diff -- <path>` when you do need it.
- Never dump a whole coverage table. Ask for one file:

  ```powershell
  npx vitest run src/lib/foo.test.ts --coverage --coverage.include=src/lib/foo.ts
  ```

## 3. The coverage trap (this workspace's biggest offender)

Do **not** run `npm run test:coverage` to find gaps. It produces a table for
every file, every time, and you will run it a dozen times.

**Instead, in this order:**

1. Run it **once** with a machine-readable reporter and write a scratch script
   that prints only the gaps:

   ```powershell
   npx vitest run --coverage --coverage.reporter=json
   ```

2. Use a throwaway script to list uncovered lines per file, then **delete the
   script before committing** (`scripts/` is tracked; do not leave scratch there).

3. Work file-by-file with `--coverage.include=<one file>` so the report is one
   line.

4. Only run the full `test:coverage` at the very end, once, to confirm thresholds.

**Do not** iterate on the full suite to check one file. It is 30-100x the tokens.

## 4. Batch independent tool calls

If you need to inspect five files, issue five `Read`/`Grep` calls in **one**
message. Sequential round-trips re-send the whole conversation each time.

Same for shell: chain with `&&` when dependent, parallel calls when not.

## 5. Delegate exploration to a subagent

When the question is "where is X handled?" or "how does Y work?", use the
`explore` subagent instead of searching yourself. It burns its own context and
returns a summary, keeping the main thread small.

Use `explore` with thoroughness `quick` by default; `medium` only when the first
pass genuinely missed things.

Do not use a subagent for a single obvious grep — that is pure overhead.

## 6. Persist findings, do not re-derive them

Long tasks (like a coverage ratchet) need a scratchpad. Write findings to a file
in the **agent store**, not the repo:

```
C:\Users\Benetti\AppData\Local\Cursor\AgentStores\cursor_agent_stores\<agent-id>\files
```

or the user store when it should outlive one agent:

```
C:\Users\Benetti\AppData\Local\Cursor\AgentStores\cursor_agent_stores\u306335953\files
```

Example scratchpad: a list of files, their current coverage, and what remains.
Read it instead of re-running the analysis.

**Never** leave scratch files in a repo's `scripts/` or root. Delete them before
committing.

## 7. Local GPU offloading is a token optimisation, not just a speed one

Anything self-contained that the local model can draft costs **zero** cloud
tokens. Re-read the workspace-root `AGENTS.md` (local GPU offloading section) and
actually use it for:

- Boilerplate, DTOs, simple components.
- Regex, SQL, shell one-liners.
- Summarising or explaining a file you pass with `-Files`.
- Draft commit messages / PR descriptions from a diff.
- First drafts of small pure functions and types.

Verify the output, then move on. Do not ask the cloud model to "just write it"
because it feels faster.

## 8. Testing: work in units, not monoliths

This is where the 140k contexts come from.

**Unit tests (Vitest / Go):**

- Write and run **one suite at a time**: `npx vitest run <one-file>`.
- Do not run the full suite to check a new test.
- Do not re-read the source file after every assertion — read it once, write the
  suite, then fix from the failure output only.
- When fixing typecheck errors across many test files, fix them in **one pass**
  from a single captured error list, not file-by-file with a typecheck per file.

  ```powershell
  npm run typecheck 2>&1 | Select-String "error TS" | Out-File scratch.txt
  ```

  Fix all, delete `scratch.txt`, then typecheck once.

**E2E (Maestro / Playwright):**

- Do not run an E2E suite to validate a unit-level change. It proves nothing new
  and costs minutes plus huge logs.
- Run E2E **once**, at the end, against the specific flow you touched.
- Never run `test:e2e` without a `--grep`/tag filter when the suite has more than
  a couple of specs.
- Maestro: run the single flow file, not the directory.

## 9. Commits and PRs

- Commit early and per unit of work. A small diff is a small `git diff`, a small
  review, and a small transcript.
- Write the PR body from `git diff --stat` plus the commit messages — not by
  re-reading every changed file.
- Do not paste PR bodies or commit messages back into chat. They are in the PR.

## 10. Docs

- Follow `docs/`; do not quote it back. If you need to cite a rule, cite the path
  and the rule in one line.
- Never paste a doc section into a response "for context".
- When a doc conflicts with code, the doc wins — fix the code, and mention the
  doc path once.

## 11. Response style

- Summaries are for the human's benefit: outcomes, blockers, next step. Not a
  replay of every tool call.
- Do not restate what a subagent just reported.
- Do not re-print a file you just wrote. Say what changed and where.
- Prefer a short bulleted result over a long narrative.

---

## Quick checklist

Before a new conversation starts work:

- [ ] Scope known? Repo, files, and the single command that proves success.
- [ ] Searched before reading? No whole-file reads for large files.
- [ ] Output filtered? Test/lint/typecheck piped through a pattern match.
- [ ] Coverage scoped to one file, not the whole repo?
- [ ] Self-contained work delegated to the local model?
- [ ] Scratch files in the agent store, not the repo?
- [ ] Independent tool calls batched into one message?

If every box is ticked, a typical task should fit well under 30k tokens instead
of 140k.

---

## Anti-patterns (do not do these)

| Anti-pattern | Cost | Instead |
| --- | --- | --- |
| `Read` a 900-line file | ~15k tokens | Grep the symbol, read a window |
| `npm run test:coverage` per iteration | ~10k tokens each | `--coverage.include=<file>` |
| Full `npm run typecheck` after each fix | ~5k tokens each | Capture once, fix all, run once |
| Dumping raw `git diff` | Unbounded | `--stat`, then `-- <path>` |
| Re-reading a file after editing it | Doubles file cost | Trust the edit; read only on failure |
| Running E2E to validate a unit change | Minutes + huge logs | Run the unit test |
| Re-summarising docs in chat | Thousands | Follow them, cite the path |
| Leaving scratch scripts in `scripts/` | Noise + review cost | Agent store, delete before commit |
| Sequential single tool calls | Re-sends context each turn | Batch in one message |
