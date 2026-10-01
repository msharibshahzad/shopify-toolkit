# Shopify Toolkit

A free, privacy-conscious workspace for Shopify merchants. Generate product copy, validate catalog CSVs, and calculate margins from one responsive interface.

## Stack
- Next.js App Router + TypeScript
- React
- CSS (custom design system; no UI framework dependency)

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Current functionality
- Searchable tool directory and category filters
- Product title and description drafting (client-side template-based MVP; connect a server-side AI provider before production AI claims)
- Meta title and description length helper
- Browser-only CSV preview and basic validation
- Profit and margin calculator
- Responsive navigation and tool cards

## Production notes
- No secrets or API keys belong in client code or Git.
- CSV processing is performed in the browser in this MVP.
- Validate all Shopify CSV transformations against current Shopify import requirements before relying on them for production catalogs.
- Add rate limiting, abuse controls, privacy policy, terms, and analytics consent as appropriate before launch.
