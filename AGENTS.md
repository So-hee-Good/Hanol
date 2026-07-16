<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single self-contained Next.js 16 full-stack app (no external DB/cache/queue). Commands are in `package.json` and `README.md` (`npm run dev` on port 3000, plus `lint`/`test`/`build`).

Non-obvious notes:
- Persistence is a local JSON file at `.data/store.json`, auto-seeded on first request from `src/lib/seed.ts`. It is gitignored and created at runtime — no migrations or env vars needed. Delete `.data/` to reset to seed data.
- Mutations use Next.js Server Actions (`src/app/actions.ts`); there is no separate API/backend to run.
