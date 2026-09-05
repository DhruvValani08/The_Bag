# Code Conventions & Style Guide

## Naming Conventions
- **Components**: PascalCase (`QuickAddForm.tsx`, `LinkCard.tsx`).
- **Contexts**: PascalCase with Context suffix (`AuthContext.tsx`, `BagContext.tsx`).
- **Styles**: Custom CSS variables defined in `:root` with semantic prefixing (`--canvas-bg`, `--olive-green`, `--brass`).

## Code Patterns
- **TypeScript Strictness**: Interfaces declared for component props and state payload models (`LinkItem`, `AuthContextType`).
- **UI Design System**: Vanilla CSS tokens in `design.css` using custom typography (`Special Elite`, `Outfit`) and physical aesthetic motifs (parchment, brass, canvas).
- **Icons**: Lucide React icons standard across components.
