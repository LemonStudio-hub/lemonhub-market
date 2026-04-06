/**
 * App Registry Module
 * 
 * Manages application registration, querying, and lifecycle.
 * Provides methods to register, unregister, and search applications.
 */

import type { AppInfo, AppOptions, AppCategory } from './types'
import type { EventBus } from './eventBus'
import { EventName } from './types'

/**
 * Application registry manager
 */
export class AppRegistry {
  private apps: Map<string, AppInfo> = new Map()
  private options: Map<string, AppOptions> = new Map()
  private eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  /**
   * Register a new application
   * @param app - Application metadata
   * @param options - Optional lifecycle callbacks
   * @returns true if registration succeeded
   */
  register(app: AppInfo, options?: AppOptions): boolean {
    if (this.apps.has(app.id)) {
      console.warn(`[AppRegistry] App "${app.id}" already registered`)
      return false
    }

    this.apps.set(app.id, { ...app })
    if (options) {
      this.options.set(app.id, options)
    }

    this.eventBus.emit(EventName.APP_REGISTERED, app)
    return true
  }

  /**
   * Unregister an application
   * @param appId - Application ID
   * @returns true if unregistration succeeded
   */
  unregister(appId: string): boolean {
    const app = this.apps.get(appId)
    if (!app) {
      console.warn(`[AppRegistry] App "${appId}" not found`)
      return false
    }

    this.apps.delete(appId)
    this.options.delete(appId)

    this.eventBus.emit(EventName.APP_UNREGISTERED, app)
    return true
  }

  /**
   * Get application by ID
   * @param appId - Application ID
   * @returns Application info or undefined
   */
  get(appId: string): AppInfo | undefined {
    return this.apps.get(appId)
  }

  /**
   * Get all registered applications
   * @returns Array of all registered apps
   */
  getAll(): AppInfo[] {
    return Array.from(this.apps.values())
  }

  /**
   * Get apps by category
   * @param category - Category to filter by
   * @returns Array of apps in the category
   */
  getByCategory(category: AppCategory): AppInfo[] {
    return this.getAll().filter(app => app.category === category)
  }

  /**
   * Search applications by query
   * @param query - Search query
   * @returns Matching applications
   */
  search(query: string): AppInfo[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(app =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery) ||
      app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Filter and search applications
   * @param query - Search query
   * @param category - Category filter (or 'all')
   * @returns Filtered and matching applications
   */
  filterAndSearch(query: string, category: string | 'all'): AppInfo[] {
    let apps = this.getAll()

    if (category !== 'all') {
      apps = apps.filter(app => app.category === category)
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      apps = apps.filter(app =>
        app.name.toLowerCase().includes(lowerQuery) ||
        app.description.toLowerCase().includes(lowerQuery) ||
        app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    return apps
  }

  /**
   * Update application status
   * @param appId - Application ID
   * @param status - New status
   * @returns true if update succeeded
   */
  updateStatus(appId: string, status: AppInfo['status']): boolean {
    const app = this.apps.get(appId)
    if (!app) return false

    const oldStatus = app.status
    app.status = status

    if (oldStatus !== 'installed' && status === 'installed') {
      this.eventBus.emit(EventName.APP_INSTALLED, app)
      const opts = this.options.get(appId)
      opts?.onInstall?.(app)
    }

    if (oldStatus === 'installed' && status === 'available') {
      this.eventBus.emit(EventName.APP_UNINSTALLED, app)
      const opts = this.options.get(appId)
      opts?.onUninstall?.(app)
    }

    return true
  }

  /**
   * Launch an application
   * @param appId - Application ID
   * @returns true if launch succeeded
   */
  launch(appId: string): boolean {
    const app = this.apps.get(appId)
    if (!app) return false

    this.eventBus.emit(EventName.APP_LAUNCHED, app)
    const opts = this.options.get(appId)
    opts?.onLaunch?.(app)

    return true
  }

  /**
   * Get registered app count
   */
  get count(): number {
    return this.apps.size
  }

  /**
   * Check if an app is registered
   */
  has(appId: string): boolean {
    return this.apps.has(appId)
  }
}
