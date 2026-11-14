# IranMart Catalog API

This directory contains the Cloudflare Worker API used by the GitHub Pages frontend.

## Routes
- `GET /health`: health and database readiness.
- `GET /sources`: all 40 registered sources and their connection states.
- `GET /search?q=...`: search only verified offers already stored in D1.
- `POST /admin/import`: protected ingestion endpoint for data obtained through an authorized API or seller feed. Requires `Authorization: Bearer <ADMIN_TOKEN>`.

The Worker does not scrape websites, bypass login/CAPTCHA, or invent offers. A source remains disconnected until an authorized connector/feed is configured and verified.

## Deployment
Deploy with the separate `wrangler.catalog.jsonc` config. Bind the D1 database as `DB`, set the `ADMIN_TOKEN` secret, then run the SQL migration in `migrations/0001_catalog.sql`.
