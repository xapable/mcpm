# Pending — Pre-Launch Checklist

Items that cannot be completed in development. Requires real infrastructure.

---

## 🔴 Before Launch (Required)

### 1. Domain & DNS
- [y] Buy `mcpm.dev` (Namecheap / Cloudflare Registrar)
- [y] Point DNS to Vercel

### 2. Database
- [y] Create Neon PostgreSQL database
- [y] Copy connection string to `.env.local`
- [ ] Run `npx drizzle-kit push`

### 3. GitHub OAuth App
- [ ] Create OAuth app at https://github.com/settings/developers
- [ ] Callback URL: `https://mcpm.dev/api/auth/callback/github`
- [ ] Copy Client ID + Secret to `.env.local`

### 4. Environment Variables (`.env.local`)
```
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_SECRET=           # openssl rand -base64 32
DATABASE_URL=postgresql://...
```

### 5. Email Provider (for notifications)
- [ ] Sign up for Resend (resend.com)
- [ ] Add `RESEND_API_KEY` to env
- [ ] Uncomment production code in `lib/email.ts`

### 6. Deploy
- [ ] Push to GitHub
- [ ] Import to Vercel → deploy
- [ ] Set all env vars in Vercel dashboard

---

## 🟡 Post-Launch (Week 1-2)

### Homepage — switch to real DB data
- [ ] Replace mock `featured` array in `app/page.tsx` with `getHomeData()` from `lib/data.ts`
- [ ] Replace mock `stats` with real DB queries

### Package page — switch to real DB data
- [ ] Replace mock `pkg` object in `app/package/[name]/page.tsx` with `getPackageData()`

### Dashboard — switch to real DB data
- [ ] Replace client component with server component using `getUserPackages()`

### CLI — install tracking
- [ ] `mcpm add <name>` should call `POST /api/packages/:name/download` to increment counter

### Search page
- [ ] Create `app/search/page.tsx` for `/search?q=...` results page

### Weekly digest
- [ ] Cron job (Vercel Cron) to send weekly top packages email to opted-in users

---

## 🟢 Future (Month 1-3)

### Product
- [ ] Package security scanning (npm audit equivalent for MCP tools)
- [ ] Verified publisher badges
- [ ] Semantic search (pgvector) — search by capability, not just name
- [ ] AI-powered tool recommendations ("If you use X, try Y")
- [ ] Webhook on new version published

### Monetization
- [ ] Pro tier: private packages, analytics, priority support ($20/mo)
- [ ] Enterprise: on-prem registry, SSO, audit logs (custom pricing)
- [ ] Marketplace: 15% take on premium tool sales

### Infrastructure
- [ ] Rate limiting on API routes
- [ ] CDN for package README assets
- [ ] Automated DB backups
- [ ] Uptime monitoring (Vercel Analytics / Sentry)

### Community
- [ ] Discord server
- [ ] "Package of the week" blog/newsletter
- [ ] Contributor guidelines + CLA

---

## 📊 Metrics to Track

| Metric | Tool |
|---|---|
| Page views | Vercel Analytics |
| Package installs | DB counter |
| User signups | NextAuth + DB |
| CLI usage | Token auth events |
| Search queries | API logs |

---

## ⚠️ Known Gaps

1. **CLI token expiry:** Tokens are in-memory (Map). Restarting the server loses all tokens. Move to DB.
2. **No install events table:** Downloads only increment counter, no per-install event log.
3. **No package ownership transfer:** Only original publisher can update.
4. **No unpublish:** Once published, cannot be removed. (Like npm's left-pad issue — needs policy.)
5. **No README rendering:** Currently raw text. Need markdown → HTML renderer.
