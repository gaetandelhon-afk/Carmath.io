# CarMath.io – Starter

Custom Next.js (App Router) + TypeScript + Tailwind + minimal i18n & currency detection + Car Payment Calculator.

## Prerequisites
- Node.js 18+
- PNPM (recommended) or NPM/Yarn
- GitHub account
- Vercel account

## Setup (local)

```bash
pnpm install
pnpm dev
# open http://localhost:3000/en
```

## Deploy to Vercel
1. Create a **new GitHub repository** (e.g., `carmath`), **empty**.
2. On your machine:
```bash
git init
git remote add origin https://github.com/YOUR_USER/carmath.git
git add .
git commit -m "init: CarMath starter"
git push -u origin main
```
3. In **Vercel** → **Add New Project** → import this GitHub repo → Deploy.
4. In **Vercel → Settings → Domains** add `carmath.io`.
5. Copy DNS records from Vercel → add them in Namecheap → Advanced DNS.
6. Wait for propagation, then visit https://carmath.io

## Notes
- The middleware auto-redirects to a locale path (`/en`, `/fr`, `/de`). It tries to infer locale from cookies or `Accept-Language`. On Vercel, it can also use edge `request.geo.country` for currency.
- Extend `lib/currency.ts` with more countries/currencies.
- The calculator math is in `lib/finance.ts`. UI in `components/CarPaymentCalculator.tsx`.

## Next Steps
- Add proper `next-intl` usage for messages (currently minimal demo strings).
- Add SEO metadata, FAQ schema, sitemap per locale.
- Add more calculators & localized content.
