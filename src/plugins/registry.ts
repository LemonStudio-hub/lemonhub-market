import type { AppMetadata } from '@/types'
import { AppCategory } from '@/types'

/**
 * Plugin Registry
 * 
 * This is the core plugin system for registering applications.
 * Applications can be registered dynamically using the registerApp function.
 * The registry supports hot-reloading and dynamic loading.
 */

class AppRegistry {
  private apps: Map<string, AppMetadata> = new Map()
  private listeners: Set<() => void> = new Set()

  /**
   * Register a new application
   */
  register(app: AppMetadata): void {
    this.apps.set(app.id, app)
    this.notifyListeners()
  }

  /**
   * Unregister an application
   */
  unregister(appId: string): void {
    this.apps.delete(appId)
    this.notifyListeners()
  }

  /**
   * Get a specific application
   */
  get(appId: string): AppMetadata | undefined {
    return this.apps.get(appId)
  }

  /**
   * Get all registered applications
   */
  getAll(): AppMetadata[] {
    return Array.from(this.apps.values())
  }

  /**
   * Filter applications by category
   */
  getByCategory(category: AppCategory): AppMetadata[] {
    return this.getAll().filter(app => app.category === category)
  }

  /**
   * Search applications by query
   */
  search(query: string): AppMetadata[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery) ||
      app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Filter and search applications
   */
  filterAndSearch(query: string, category: AppCategory | 'all'): AppMetadata[] {
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
   * Subscribe to registry changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }
}

// Singleton instance
export const registry = new AppRegistry()

/**
 * Helper function to register applications
 */
export function registerApp(app: AppMetadata): void {
  registry.register(app)
}
