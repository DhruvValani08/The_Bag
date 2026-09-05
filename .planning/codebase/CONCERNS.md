# Technical Debt & Known Concerns

## Current Concerns
1. **Environment Configuration**: `frontend/.env` currently contains placeholder values (`placeholder-project-id.supabase.co`, `placeholder-anon-key`). Real Supabase API key must be inserted.
2. **Metadata Fetching**: URL metadata (title, favicon) is currently parsed client-side or defaulted to domain names rather than being enriched via a dedicated serverless metadata scraper endpoint.
3. **Automated Unit Tests**: Jest / Vitest test suites have not yet been configured.
