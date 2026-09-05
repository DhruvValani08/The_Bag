# System Architecture

## Architectural Pattern
- **Client-Side React SPA**: React Router handles routing (`/signin`, `/signup`, `/`).
- **Context API State Management**:
  - `AuthContext`: Tracks user session, loading state, and exposes authentication methods.
  - `BagContext`: Manages state for link items, loading states, real-time sync with Supabase, and CRUD operations.
- **Database Security**: Row Level Security (RLS) policies enforce user-level data isolation directly within PostgreSQL (`supabase/migrations/20230821_create_links.sql`).

## Data Flow
1. **User Auth**: `SignIn` / `SignUp` → `AuthContext` → Supabase Auth.
2. **Link CRUD**: UI (`Bag`, `QuickAddForm`, `EditLinkModal`) → `BagContext` → Supabase PostgREST client → `public.links` DB Table.
