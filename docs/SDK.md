# LemonHub SDK

The LemonHub SDK provides a unified, type-safe API for building applications on the LemonHub platform. It includes modules for app registration, theming, navigation, events, notifications, and storage.

---

## Quick Start

### Initialize the SDK

```typescript
import { LemonHub } from '@/sdk'

// Create and initialize
const sdk = LemonHub.create({ debug: true })
await sdk.init(router) // optionally pass vue-router
```

### Access from Vue Components

```vue
<script setup lang="ts">
import { inject } from 'vue'
import type { LemonHub } from '@/sdk'

const sdk = inject<LemonHub>('sdk')!

// Use any SDK feature
sdk.apps.register({ ... })
sdk.theme.toggle()
sdk.navigate('/library')
</script>
```

### Access from Browser Console (Dev Mode)

```js
window.LemonHub.getInstance().apps.getAll()
```

---

## API Reference

### `LemonHub` - Core SDK

| Method | Description |
|--------|-------------|
| `LemonHub.create(options?)` | Create a new SDK instance (singleton) |
| `sdk.init(router?)` | Initialize the SDK |
| `sdk.getStatus()` | Get SDK status (initialized, version, appCount, theme) |
| `sdk.destroy()` | Destroy the SDK instance |

#### SDK Options

```typescript
interface SDKOptions {
  debug?: boolean           // Enable debug logging
  defaultTheme?: ThemeMode  // 'light' | 'dark' | 'auto'
  storagePrefix?: string    // Storage key prefix
}
```

---

### `sdk.apps` - App Registry

Manage applications on the platform.

| Method | Description |
|--------|-------------|
| `apps.register(app, options?)` | Register a new application |
| `apps.unregister(id)` | Unregister an application |
| `apps.get(id)` | Get app by ID |
| `apps.getAll()` | Get all registered apps |
| `apps.getByCategory(cat)` | Filter by category |
| `apps.search(query)` | Search apps by name, description, tags |
| `apps.filterAndSearch(query, category)` | Combined filter |
| `apps.updateStatus(id, status)` | Update app status |
| `apps.launch(id)` | Launch an app (triggers callbacks) |
| `apps.count` | Get registered app count |
| `apps.has(id)` | Check if app is registered |

#### AppInfo

```typescript
interface AppInfo {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: 'available' | 'installed' | 'updating' | 'disabled'
  version: string
  author: string
  rating: number        // 0-5
  downloads: number
  tags: string[]
  lastUpdated: string   // ISO date
}
```

#### AppOptions (Lifecycle Callbacks)

```typescript
interface AppOptions {
  onInstall?: (app: AppInfo) => void
  onUninstall?: (app: AppInfo) => void
  onLaunch?: (app: AppInfo) => void
  onUpdate?: (app: AppInfo) => void
}
```

#### Example: Register an App

```typescript
sdk.apps.register({
  id: 'my-app',
  name: 'My Application',
  description: 'A great app',
  icon: 'my-icon',
  category: 'productivity',
  status: 'available',
  version: '1.0.0',
  author: 'Me',
  rating: 4.5,
  downloads: 0,
  tags: ['demo', 'example'],
  lastUpdated: '2026-04-06',
}, {
  onInstall: (app) => console.log(`${app.name} installed!`),
  onLaunch: (app) => sdk.navigate(`/apps/${app.id}`),
})
```

---

### `sdk.theme` - Theme Manager

Control the application theme.

| Method | Description |
|--------|-------------|
| `theme.getMode()` | Get current theme mode |
| `theme.isDark()` | Check if dark mode is active |
| `theme.setMode(mode)` | Set theme mode |
| `theme.toggle()` | Toggle between light and dark |
| `theme.getColors()` | Get current theme colors |
| `theme.setColors(colors)` | Override theme colors |
| `theme.resetColors()` | Reset to default colors |
| `theme.watchSystemTheme()` | Listen for system theme changes |

#### Example

```typescript
// Toggle theme
sdk.theme.toggle()

// Set specific mode
sdk.theme.setMode('dark')

// Custom colors
sdk.theme.setColors({
  primary: '#ff6b6b',
  secondary: '#4ecdc4',
})

// React to changes
sdk.onThemeChanged((data) => {
  console.log(`Theme is now ${data.mode} (dark: ${data.isDark})`)
})
```

---

### `sdk.navigation` - Navigation

Route management wrapper around vue-router.

| Method | Description |
|--------|-------------|
| `navigation.navigate(path, options?)` | Navigate to a path |
| `navigation.navigateTo(name, params?, options?)` | Navigate to named route |
| `navigation.back()` | Go back in history |
| `navigation.forward()` | Go forward in history |
| `navigation.getCurrentRoute()` | Get current route info |
| `navigation.getRoutes()` | Get all registered routes |
| `navigation.getCurrentPath()` | Get current path string |

#### Navigate Options

```typescript
interface NavigateOptions {
  replace?: boolean     // Replace history entry
  scrollToTop?: boolean // Scroll to top after nav
}
```

#### Example

```typescript
// Navigate to path
await sdk.navigation.navigate('/library')

// Navigate to named route
await sdk.navigation.navigateTo('app-detail', { id: 'my-app' })

// React to navigation
sdk.onNavigated(({ path }) => console.log(`Navigated to: ${path}`))
```

---

### `sdk.events` - Event System

Type-safe event bus for SDK communication.

| Method | Description |
|--------|-------------|
| `events.on(event, handler)` | Subscribe to an event |
| `events.once(event, handler)` | Subscribe once |
| `events.off(event, handler?)` | Unsubscribe |
| `events.emit(event, data?)` | Emit an event |
| `events.clear()` | Remove all listeners |
| `events.listenerCount(event)` | Get listener count |

#### Built-in Events

| Event | Data | Description |
|-------|------|-------------|
| `app:registered` | `AppInfo` | App was registered |
| `app:unregistered` | `AppInfo` | App was unregistered |
| `app:installed` | `AppInfo` | App status changed to installed |
| `app:uninstalled` | `AppInfo` | App status changed from installed |
| `app:launched` | `AppInfo` | App was launched |
| `theme:changed` | `ThemeChangeData` | Theme changed |
| `navigation:navigated` | `{ path }` | Navigation occurred |
| `error` | `Error` | An error occurred |
| `ready` | `SDKStatus` | SDK initialized |

#### Example

```typescript
// Subscribe
const sub = sdk.onAppInstalled((app) => {
  sdk.notify.success(`${app.name} installed successfully!`)
})

// Unsubscribe
sub.unsubscribe()

// Custom events
sdk.emit('my-custom-event', { data: 'value' })
sdk.on('my-custom-event', (data) => console.log(data))
```

---

### `sdk.notify` - Notifications

Show toast notifications.

| Method | Description |
|--------|-------------|
| `notify.show(data)` | Show a notification |
| `notify.info(message, title?)` | Show info notification |
| `notify.success(message, title?)` | Show success notification |
| `notify.warning(message, title?)` | Show warning notification |
| `notify.error(message, title?)` | Show error notification |
| `notify.dismiss(id)` | Dismiss a notification |
| `notify.dismissAll()` | Dismiss all notifications |
| `notify.count` | Get active count |
| `notify.getAll()` | Get all active notifications |

#### Notification Data

```typescript
interface NotificationData {
  id?: string
  title: string
  message: string
  options?: {
    type?: 'info' | 'success' | 'warning' | 'error'
    duration?: number    // ms, 0 = no auto-dismiss
    closable?: boolean
    actionLabel?: string
    onAction?: () => void
  }
}
```

#### Example

```typescript
// Simple
sdk.notify.success('Saved!')

// With options
sdk.notify.show({
  title: 'Update Available',
  message: 'A new version is ready to install.',
  options: {
    type: 'info',
    duration: 0,
    actionLabel: 'Install',
    onAction: () => sdk.notify.info('Installing...'),
  },
})
```

---

### `sdk.storage` - Storage

Namespaced, typed storage with expiration.

| Method | Description |
|--------|-------------|
| `storage.get<T>(key, options?)` | Get a value |
| `storage.set(key, value, options?)` | Set a value |
| `storage.remove(key, options?)` | Remove a value |
| `storage.has(key, options?)` | Check if key exists |
| `storage.clear(namespace?)` | Clear storage |
| `storage.keys(namespace?)` | Get all keys |
| `storage.size(namespace?)` | Get entry count |

#### Storage Options

```typescript
interface StorageOptions {
  namespace?: string    // Storage namespace
  expiresIn?: number    // TTL in milliseconds
}
```

#### Example

```typescript
// Store with expiration (1 hour)
sdk.storage.set('session-token', 'abc123', {
  namespace: 'user',
  expiresIn: 60 * 60 * 1000,
})

// Retrieve
const token = sdk.storage.get<string>('session-token', { namespace: 'user' })

// Check and remove
if (sdk.storage.has('temp-data')) {
  sdk.storage.remove('temp-data')
}
```

---

## Advanced Usage

### Registering External Apps

```typescript
import { LemonHub } from '@/sdk'

const sdk = LemonHub.getInstance()

sdk.apps.register({
  id: 'external-app',
  name: 'External App',
  description: 'Loaded dynamically',
  icon: 'external',
  category: 'utilities',
  status: 'available',
  version: '1.0.0',
  author: 'External Dev',
  rating: 4.0,
  downloads: 100,
  tags: ['external'],
  lastUpdated: '2026-04-06',
}, {
  onLaunch: (app) => {
    sdk.navigation.navigate(`/external/${app.id}`)
  },
})
```

### Reacting to Events

```typescript
// Watch all app registrations
sdk.onAppRegistered((app) => {
  sdk.notify.info(`${app.name} is now available`)
})

// Watch theme changes
sdk.onThemeChanged(({ mode, isDark }) => {
  console.log(`Theme: ${mode}, Dark: ${isDark}`)
})

// Watch navigation
sdk.onNavigated(({ path }) => {
  sdk.storage.set('last-path', path)
})
```

### Complete Plugin Example

```typescript
// my-plugin.ts
import { LemonHub } from '@/sdk'

export function setupMyPlugin() {
  const sdk = LemonHub.getInstance()

  // Register the plugin's app
  sdk.apps.register({
    id: 'my-plugin',
    name: 'My Plugin',
    description: 'A LemonHub plugin',
    icon: 'plugin',
    category: 'utilities',
    status: 'installed',
    version: '1.0.0',
    author: 'Plugin Author',
    rating: 5.0,
    downloads: 0,
    tags: ['plugin'],
    lastUpdated: '2026-04-06',
  })

  // Set up event listeners
  sdk.onAppInstalled((app) => {
    sdk.storage.set(`installed-${app.id}`, Date.now())
  })

  // Show ready notification
  sdk.notify.success('My Plugin loaded!', 'Plugin')
}
```

---

## Architecture

```
LemonHub SDK
├── Core (index.ts)      - Main SDK class, singleton management
├── EventBus (eventBus.ts) - Event pub/sub system
├── AppRegistry (appRegistry.ts) - App lifecycle management
├── Theme (theme.ts)      - Theme switching & colors
├── Navigation (navigation.ts) - Router wrapper
├── Notification (notification.ts) - Toast system
├── Storage (storage.ts)  - Namespaced storage
└── Types (types.ts)      - All type definitions
```
