# The Bag – Implementation Plan

## Goal Description

Build a personal link‑saving web application called **The Bag** using React (Vite) and Supabase (Postgres + Auth). The app will allow users to sign up, save links with optional notes, categories, and tags, pin links, edit/delete them, and search/filter/sort their collection. The UI will follow a distinctive “bag” visual metaphor with premium, responsive design.

## User Review Required

> [!IMPORTANT]
> Please review the following decisions before we begin implementation:
> - **Login method**: Email/password only for v1, or add Google OAuth now?
> - **Category model**: Free‑text field (v1) or a managed categories table?
> - **Delete confirmation UX**: Native `confirm()` dialog or a styled modal component?
> - **Hosting provider**: Vercel vs. Netlify (affects deployment scripts).
> - **Responsive behavior**: Mobile‑only web app vs. installable PWA?

## Open Questions

> [!WARNING]
> - Should we prioritize building a custom styled delete‑confirm modal now to keep visual consistency, or is the native `confirm()` acceptable for the MVP?
> - Is Google OAuth a stretch goal, or should we include it now to reduce friction for future use?
> - Do you want the category field to be a free‑text input now, or start with a separate `categories` table for easier future management?
> - Which hosting platform (Vercel or Netlify) do you plan to use for the final deployment?

## Proposed Changes

---
### Project Setup

#### [NEW] **Project scaffold**
- `frontend/` – Vite + React project initialized with `npm create vite@latest . -- --template react-ts`.
- Add `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Install dependencies: `@supabase/supabase-js`, `react-router-dom`, `classnames`, `date-fns`, `uuid`.

---
### Supabase Backend

#### [NEW] **Supabase migration script** (`supabase/migrations/20230821_create_links.sql`)
```sql
create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  url text not null,
  note text,
  category text,
  tags text[] default '{}',
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to update `updated_at`
create function public.update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;
create trigger trg_update_timestamp before update on public.links
for each row execute function public.update_timestamp();

-- Enable Row Level Security and policies
alter table public.links enable row level security;
create policy select_links on public.links for select using (user_id = auth.uid());
create policy insert_links on public.links for insert with check (user_id = auth.uid());
create policy update_links on public.links for update using (user_id = auth.uid());
create policy delete_links on public.links for delete using (user_id = auth.uid());
```

---
### Authentication Screens

#### [NEW] **AuthContext** (`src/context/AuthContext.tsx`)
- Wrap app with Supabase client, expose `user`, `signUp`, `signIn`, `signOut`.
- Persist session via `supabase.auth.getSession()` on app load.

#### [NEW] **SignUp & SignIn pages** (`src/pages/SignUp.tsx`, `src/pages/SignIn.tsx`)
- Forms with email/password fields.
- Show friendly validation/errors (e.g., email already registered, wrong password).
- On success, redirect to `/bag`.

---
### Bag Home View

#### [NEW] **BagProvider** (`src/context/BagContext.tsx`)
- Handles fetching links for the current user, inserting, updating, deleting.
- Exposes `links`, `fetchLinks`, `addLink`, `updateLink`, `deleteLink`, `pinLink`, etc.

#### [NEW] **QuickAddForm** (`src/components/QuickAddForm.tsx`)
- Inputs: URL (required), Note, Category, Tags (comma‑separated).
- Normalizes URL (adds `https://` if missing) and validates format client‑side.
- Parses tags into a lowercase deduped array.
- Calls `addLink` on submit; shows loading indicator and disables button.

#### [NEW] **BagView** (`src/pages/Bag.tsx`)
- Header with `QuickAddForm`.
- Controls row: Search input, Category dropdown, Tag chips, Sort selector.
- “Front pocket” section rendering pinned links.
- Main grid rendering unpinned links.
- Empty states for no links and for filtered‑zero results.

#### [NEW] **LinkCard** (`src/components/LinkCard.tsx`)
- Shows domain title, note preview, category pill, tag pills, pin/unpin button, edit button, delete button, timestamp.
- Hover animation: slight lift & straightening (CSS transform).
- Clickable body opens URL in new tab.

#### [NEW] **EditLinkModal** (`src/components/EditLinkModal.tsx`)
- Modal pre‑filled with current link data; allows editing URL, note, category, tags.
- Re‑validates URL on save.

#### [NEW] **DeleteConfirm** (`src/components/DeleteConfirm.tsx`)
- For now a simple wrapper around `window.confirm()`. (If you choose a styled modal, replace this component.)

---
### Search, Filter & Sort Logic

#### [MODIFY] **BagProvider**
- Add client‑side functions to filter by keyword (URL, note, category, tags), filter by category, filter by tags, and sort (pinned‑first / newest‑first / oldest‑first).
- Debounce search input (300 ms) to avoid excessive renders.

---
### Styling & Visual Design

#### [NEW] **Design Tokens** (`src/styles/design.css`)
- Palette: canvas‑khaki, olive‑green header, parchment cards, brass primary, rust pinned accent.
- Typography: import Google Font “Special Elite” for headings, “Inter” for body.
- CSS variables for spacing, border‑radius, shadows.

#### [NEW] **Bag.css** (`src/components/Bag.css`)
- Layout grid, stitched divider for front pocket, card‐tag styles, hover lift animation.
- Responsive breakpoints: single‑column on ≤600 px.

---
### Testing & Verification

#### Automated Tests (Vitest + React Testing Library)
- Auth flow unit tests (sign‑up, sign‑in, session persistence).
- `addLink` validation tests (URL normalization, tag parsing).
- `BagProvider` filtering & sorting logic tests.
- Snapshot tests for `LinkCard` visual structure.

#### Manual Verification Checklist
- Verify RLS: create two test accounts, ensure each can only see its own rows.
- Confirm link CRUD (create, edit, pin/unpin, delete) works end‑to‑end.
- Test responsive layout on mobile width.
- Check keyboard navigation and focus outlines for accessibility.
- Validate loading states and error handling for auth and CRUD operations.

---
### Deployment

#### [NEW] **Vite Build CI** (`package.json` scripts)
- `build` script for production bundle.
- Instructions for deploying the `dist/` folder to Vercel or Netlify (both support static SPA hosting).
- Environment variable handling for Supabase URL and anon key.

## Verification Plan

### Automated Tests
- Run `npm test` after each feature branch merges.
- CI pipeline will fail on any test regression.

### Manual Verification
- Deploy a preview build on Vercel/Netlify.
- Perform the checklist above with two real Supabase accounts.
- Confirm visual design matches the prototype (colors, fonts, card animation).
- Verify that saving a link takes <10 seconds (measure via browser devtools).

---
**Next Steps**
1. Confirm the open questions and user‑review items.
2. Once approved, begin scaffolding the Vite + React project and create the Supabase migration.
3. Iteratively implement auth, quick‑add, and bag view per the plan.

*Please let me know any adjustments or approvals, and I’ll start execution.*
