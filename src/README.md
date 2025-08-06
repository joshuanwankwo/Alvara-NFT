# Source Code Structure

This directory contains the source code for the Alvara NFT Platform, organized following Next.js 14+ conventions.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers
├── components/            # React components
│   ├── layout/           # Layout components (Header)
│   ├── ui/               # UI components (FAQ, Notification, GlobalNotification)
│   ├── features/         # Feature components (AvatarMinter)
│   ├── modals/           # Modal components
│   └── index.ts          # Main component exports
├── lib/                  # Utility libraries
│   └── utils.ts          # Common utility functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Common interfaces and types
├── hooks/                # Custom React hooks
├── services/             # API services
└── contexts/             # React contexts
```

## Component Organization

### Layout Components (`/components/layout/`)
- **Header.tsx** - Main navigation header

### UI Components (`/components/ui/`)
- **FAQ.tsx** - FAQ section component
- **Notification.tsx** - Notification component
- **GlobalNotification.tsx** - Global notification system

### Feature Components (`/components/features/`)
- **AvatarMinter.tsx** - Avatar minting functionality

## Import Conventions

Use the main index files for clean imports:

```typescript
// Import from specific category
import { Header } from '@/components/layout'
import { FAQ } from '@/components/ui'
import { AvatarMinter } from '@/components/features'

// Or import from main components index
import { Header, FAQ, AvatarMinter } from '@/components'
```

## Utilities

Common utilities are available in `/lib/utils.ts`:
- `cn()` - Class name utility for Tailwind CSS

## Types

Common TypeScript interfaces are defined in `/types/index.ts`:
- `NFTData` - NFT metadata interface
- `MintingState` - Minting process state
- `UserData` - User wallet data 