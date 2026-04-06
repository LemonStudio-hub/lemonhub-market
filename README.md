# LemonHub Market

[![license](https://img.shields.io/github/license/LemonStudio-hub/lemonhub-market.svg)](https://github.com/LemonStudio-hub/lemonhub-market/blob/main/LICENSE)
[![vue](https://img.shields.io/badge/vue-3.5-42b883.svg)](https://vuejs.org)
[![typescript](https://img.shields.io/badge/typescript-5.0+-3178c6.svg)](https://www.typescriptlang.org)

A beautiful, modular application center interface built with Vue 3, Vite, and TypeScript. Features responsive design, dark mode support, and a plugin-based architecture powered by [@lemonhub/sdk](https://www.npmjs.com/package/@lemonhub/sdk).

## Features

- **Responsive Design** - Mobile-first layout with breakpoints for tablet, desktop, and wide screens
- **Dark Mode** - Full light/dark theme toggle with system preference detection
- **Modular Architecture** - Organized into components, stores, composables, types, styles, views, plugins, utils
- **Plugin System** - Powered by [@lemonhub/sdk](https://www.npmjs.com/package/@lemonhub/sdk) for dynamic app registration
- **State Management** - Pinia stores for theme, layout, and search
- **Routing** - Vue Router with typed routes and page transitions
- **TypeScript** - Full type safety across the entire codebase
- **Animations** - Smooth CSS animations and transitions

## Tech Stack

- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **SDK**: [@lemonhub/sdk](https://www.npmjs.com/package/@lemonhub/sdk)

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── cards/        # App display cards
│   ├── common/       # Reusable UI components (icons, filters)
│   └── layout/       # AppHeader, AppSidebar
├── composables/      # Vue composition functions
├── stores/           # Pinia stores (theme, layout, search)
├── views/            # Page views (Home, Library, Settings)
├── plugins/          # Plugin registry (legacy, superseded by SDK)
├── sdk/              # SDK source (published as @lemonhub/sdk)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── styles/           # CSS (variables, animations, responsive)
├── assets/           # Static assets
├── router.ts         # Vue Router configuration
├── App.vue           # Root component
└── main.ts           # Application entry point
```

## SDK Integration

This project uses [@lemonhub/sdk](https://www.npmjs.com/package/@lemonhub/sdk) for application management:

```typescript
import { LemonHub } from '@lemonhub/sdk'

const sdk = LemonHub.create({ debug: true })
await sdk.init(router)

// Register apps
sdk.apps.register({
  id: 'my-app',
  name: 'My App',
  description: 'A great app',
  // ...
})

// Use features
sdk.theme.toggle()
sdk.navigation.navigate('/library')
sdk.notify.success('Hello!')
```

## Configuration

### Vite Config

See `vite.config.ts` for the app build and `vite.sdk.config.ts` for the SDK library build.

### TypeScript

- `tsconfig.json` - App configuration
- `tsconfig.sdk.json` - SDK library build configuration

## License

[MIT](https://github.com/LemonStudio-hub/lemonhub-market/blob/main/LICENSE)
