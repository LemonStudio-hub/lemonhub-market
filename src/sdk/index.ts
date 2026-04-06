/**
 * LemonHub SDK
 * 
 * Main entry point for the LemonHub SDK.
 * Provides a unified API for app registration, theming, navigation,
 * events, notifications, and storage.
 * 
 * @example
 * ```ts
 * import { LemonHub } from '@lemonhub/sdk'
 * 
 * const sdk = LemonHub.create({ debug: true })
 * await sdk.init()
 * 
 * sdk.apps.register({ id: 'my-app', name: 'My App', ... })
 * sdk.theme.setMode('dark')
 * sdk.navigation.navigate('/library')
 * sdk.notify.success('App registered!')
 * ```
 * 
 * @packageDocumentation
 */

import type {
  SDKOptions,
  SDKStatus,
  ThemeMode,
  AppInfo,
  Subscription,
  // Re-export all public types
  AppCategory,
  AppStatus,
  AppOptions,
  ThemeColors,
  ThemeChangeData,
  Route,
  NavigateOptions,
  EventHandler,
  NotificationType,
  NotificationOptions,
  NotificationData,
  StorageNamespace,
  StorageOptions,
} from './types'
import { EventName } from './types'
import type { EventBus as _EventBusClass } from './eventBus'
import type { AppRegistry as _AppRegistryClass } from './appRegistry'
import type { ThemeManager as _ThemeManagerClass } from './theme'
import type { NavigationManager as _NavigationManagerClass } from './navigation'
import type { NotificationManager as _NotificationManagerClass } from './notification'
import type { StorageManager as _StorageManagerClass } from './storage'
import { EventBus } from './eventBus'
import { AppRegistry } from './appRegistry'
import { ThemeManager } from './theme'
import { NavigationManager } from './navigation'
import { NotificationManager } from './notification'
import { StorageManager } from './storage'

// Import vue-router type for init
import type { Router } from 'vue-router'

// Package version - injected at build time
const VERSION = '0.1.0'

/* ============================================
   Public Type Re-exports
   ============================================ */

export type {
  AppInfo,
  AppOptions,
  AppCategory,
  AppStatus,
  ThemeMode,
  ThemeColors,
  ThemeChangeData,
  Route,
  NavigateOptions,
  EventHandler,
  Subscription,
  NotificationType,
  NotificationOptions,
  NotificationData,
  StorageNamespace,
  StorageOptions,
  SDKOptions,
  SDKStatus,
}

// Re-export the EventName enum value
export { EventName }

/* ============================================
   Manager Class Type Re-exports
   ============================================ */

export type {
  _EventBusClass as EventBus,
  _AppRegistryClass as AppRegistry,
  _ThemeManagerClass as ThemeManager,
  _NavigationManagerClass as NavigationManager,
  _NotificationManagerClass as NotificationManager,
  _StorageManagerClass as StorageManager,
}

/* ============================================
   LemonHub SDK Core Class
   ============================================ */

/**
 * LemonHub SDK
 * 
 * The main SDK class. Initialize with `LemonHub.create()` and call `init()` to start.
 * 
 * @example
 * ```ts
 * import { LemonHub } from '@lemonhub/sdk'
 * 
 * const sdk = LemonHub.create({ debug: true })
 * await sdk.init()
 * 
 * sdk.apps.register({ id: 'my-app', name: 'My App', ... })
 * sdk.theme.setMode('dark')
 * sdk.navigation.navigate('/library')
 * sdk.notify.success('App registered!')
 * ```
 */
export class LemonHub {
  private static instance: LemonHub | null = null

  /** Event bus */
  readonly events: EventBus

  /** App registry */
  readonly apps: AppRegistry

  /** Theme manager */
  readonly theme: ThemeManager

  /** Navigation manager */
  readonly navigation: NavigationManager

  /** Notification manager */
  readonly notify: NotificationManager

  /** Storage manager */
  readonly storage: StorageManager

  /** SDK options */
  private options: SDKOptions

  /** Whether SDK is initialized */
  private _initialized = false

  private constructor(options: SDKOptions = {}) {
    this.options = {
      debug: false,
      defaultTheme: 'light',
      storagePrefix: 'lemonhub',
      ...options,
    }

    this.events = new EventBus(this.options.debug)
    this.apps = new AppRegistry(this.events)
    this.theme = new ThemeManager(this.events, this.options.defaultTheme)
    this.navigation = new NavigationManager(this.events)
    this.notify = new NotificationManager(this.events)
    this.storage = new StorageManager(this.options.storagePrefix)
  }

  /**
   * Create a new SDK instance (singleton factory)
   * @param options - SDK configuration options
   * @returns SDK instance
   */
  static create(options?: SDKOptions): LemonHub {
    if (this.instance) {
      console.warn('[LemonHub] SDK already created, returning existing instance')
      return this.instance
    }

    this.instance = new LemonHub(options)
    return this.instance
  }

  /**
   * Get the SDK instance (singleton accessor)
   * @throws If SDK has not been created yet
   */
  static getInstance(): LemonHub {
    if (!this.instance) {
      throw new Error('[LemonHub] SDK not initialized. Call LemonHub.create() first.')
    }
    return this.instance
  }

  /**
   * Check if an SDK instance exists
   */
  static hasInstance(): boolean {
    return this.instance !== null
  }

  /**
   * Reset the SDK instance (useful for testing)
   */
  static reset(): void {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
    }
  }

  /**
   * Initialize the SDK
   * @param router - Optional Vue Router instance for navigation support
   */
  async init(router?: Router): Promise<void> {
    if (this._initialized) {
      console.warn('[LemonHub] SDK already initialized')
      return
    }

    // Initialize navigation with router if provided
    if (router) {
      this.navigation.init(router)
    }

    // Watch system theme changes
    this.theme.watchSystemTheme()

    this._initialized = true

    // Emit ready event
    this.events.emit(EventName.READY, this.getStatus())

    if (this.options.debug) {
      console.log('[LemonHub] SDK initialized')
    }
  }

  /**
   * Get SDK status
   */
  getStatus(): SDKStatus {
    return {
      initialized: this._initialized,
      version: VERSION,
      appCount: this.apps.count,
      theme: this.theme.getMode(),
    }
  }

  /**
   * Check if SDK is initialized
   */
  get initialized(): boolean {
    return this._initialized
  }

  /**
   * Get SDK version
   */
  get version(): string {
    return VERSION
  }

  /* ============================================
     Convenience Event Subscriptions
     ============================================ */

  /**
   * Subscribe to app registered events
   */
  onAppRegistered(handler: (app: AppInfo) => void): Subscription {
    return this.events.on(EventName.APP_REGISTERED, handler)
  }

  /**
   * Subscribe to app unregistered events
   */
  onAppUnregistered(handler: (app: AppInfo) => void): Subscription {
    return this.events.on(EventName.APP_UNREGISTERED, handler)
  }

  /**
   * Subscribe to app installed events
   */
  onAppInstalled(handler: (app: AppInfo) => void): Subscription {
    return this.events.on(EventName.APP_INSTALLED, handler)
  }

  /**
   * Subscribe to app uninstalled events
   */
  onAppUninstalled(handler: (app: AppInfo) => void): Subscription {
    return this.events.on(EventName.APP_UNINSTALLED, handler)
  }

  /**
   * Subscribe to app launched events
   */
  onAppLaunched(handler: (app: AppInfo) => void): Subscription {
    return this.events.on(EventName.APP_LAUNCHED, handler)
  }

  /**
   * Subscribe to theme change events
   */
  onThemeChanged(handler: (data: ThemeChangeData) => void): Subscription {
    return this.events.on(EventName.THEME_CHANGED, handler)
  }

  /**
   * Subscribe to navigation events
   */
  onNavigated(handler: (data: { path?: string; name?: string; params?: Record<string, string> }) => void): Subscription {
    return this.events.on(EventName.NAVIGATED, handler)
  }

  /**
   * Subscribe to error events
   */
  onError(handler: (error: Error) => void): Subscription {
    return this.events.on(EventName.ERROR, handler)
  }

  /**
   * Emit a custom event
   */
  emit(event: string, data?: unknown): void {
    this.events.emit(event, data)
  }

  /**
   * Subscribe to a custom event
   */
  on(event: string, handler: (data: unknown) => void): Subscription {
    return this.events.on(event, handler)
  }

  /**
   * Unsubscribe from a custom event
   */
  off(event: string, handler?: (data: unknown) => void): void {
    this.events.off(event, handler)
  }

  /**
   * Destroy the SDK instance and clean up resources
   */
  destroy(): void {
    this.events.clear()
    this._initialized = false
  }
}
