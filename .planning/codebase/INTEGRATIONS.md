# External Integrations

## Supabase BaaS
- **Client Initialization**: `frontend/src/lib/supabase.ts`
- **Environment Variables**:
  - `VITE_SUPABASE_URL`: Supabase project endpoint
  - `VITE_SUPABASE_ANON_KEY`: Public anonymous API key
- **Authentication**: Managed via Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.signOut`).
- **Data Persistence**: `links` table managed with Row Level Security (RLS) policies linking records to `auth.uid()`.
