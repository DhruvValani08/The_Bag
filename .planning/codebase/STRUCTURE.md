# Directory & File Structure

```
New folder/
├── implementation_plan.md               # High-level feature implementation blueprint
├── .planning/
│   └── codebase/                        # Generated codebase map
├── supabase/
│   └── migrations/
│       └── 20230821_create_links.sql    # Supabase SQL schema & RLS policies
└── frontend/
    ├── .env                             # Active environment variables
    ├── .env.example                     # Environment template
    ├── package.json                     # Dependencies & scripts
    ├── vite.config.ts                   # Vite bundler configuration
    └── src/
        ├── main.tsx                     # React root entry point
        ├── App.tsx                      # App provider wrapper & router setup
        ├── index.css                    # Entry stylesheet (imports design.css)
        ├── lib/
        │   └── supabase.ts              # Supabase client instance
        ├── context/
        │   ├── AuthContext.tsx          # Auth provider & state hook
        │   └── BagContext.tsx           # Links data context & state logic
        ├── components/
        │   ├── QuickAddForm.tsx         # Quick link entry component
        │   ├── LinkCard.tsx             # Interactive link card component
        │   ├── EditLinkModal.tsx        # Link update modal dialog
        │   └── DeleteConfirmModal.tsx   # Confirmation dialog for item removal
        ├── pages/
        │   ├── SignIn.tsx               # User authentication sign-in view
        │   ├── SignUp.tsx               # User account creation view
        │   └── Bag.tsx                  # Main app dashboard view
        └── styles/
            └── design.css               # Canvas/leather design system CSS
```
