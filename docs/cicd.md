# CI/CD — Marketplace

Hosted on Vercel. Wildcard `*.benwer.es` stays on GoDaddy → Vercel.

OpenAPI types come from committed [`src/services/api/schema.d.ts`](../src/services/api/schema.d.ts)
(fallback in `scripts/generate-api.mjs` when the live API is unreachable).

| Branch | Deploy |
| --- | --- |
| PR | Preview |
| `staging` | Staging host |
| `main` | Production |

Promote / rollback: `vercel promote` / `vercel rollback`. See workspace `docs/cicd.md`.
