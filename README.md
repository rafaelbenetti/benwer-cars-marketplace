This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment (Vercel / production)

`NEXT_PUBLIC_API_URL` and `API_ORIGIN` must be the **API origin only** — no
`/v1` path prefix. Generated client paths already start with `/v1/public/...`.

| Env | Wrong | Right |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://cars-api.benwer.es/v1` | `https://cars-api.benwer.es` |
| `API_ORIGIN` | `https://cars-api.benwer.es/v1` | `https://cars-api.benwer.es` |

A `/v1` suffix is concatenated onto `/v1/public/...` and the browser calls
`/v1/v1/public/companies/...` (HTTP 404). That used to trip mock fallback
(stock Corolla/SUV photos and mock ids like `v-med-1`).

The client strips a trailing `/v1`, collapses `/v1/v1`, and in production uses
the same-origin `/api` BFF when `NEXT_PUBLIC_API_URL` points at the API host.
Set origin-only values in Vercel anyway (`API_ORIGIN=https://cars-api.benwer.es`).

See `.env.example` and `docs/architecture.md`.
