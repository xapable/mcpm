# MCPM Web Registry

The web platform at mcpm.dev — discover, publish, and manage MCP tools.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS + shadcn/ui
- PostgreSQL + pgvector (Neon)
- NextAuth.js (GitHub OAuth)
- Vercel (deployment)

## Getting Started

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

## Routes

```
/                        → Home (search + trending tools)
/package/[name]          → Package detail page
/publish                 → Submit new package (auth required)
/dashboard               → User's packages + analytics
/api/packages            → REST API for search
/api/packages/[name]     → Package metadata
/api/auth/[...nextauth]  → Auth (GitHub OAuth)
```

## Database Schema

```sql
users         → id, github_id, username, avatar, created_at
packages      → id, name, description, user_id, repo_url, downloads, created_at
versions      → id, package_id, version, readme, created_at
installations → id, package_id, version, timestamp
stars         → user_id, package_id, created_at
```
