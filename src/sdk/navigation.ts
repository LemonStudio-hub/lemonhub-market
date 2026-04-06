/**
 * Navigation Module
 * 
 * Provides navigation utilities for routing within LemonHub.
 * Wraps vue-router with a simpler, SDK-friendly API.
 */

import type { Route, NavigateOptions } from './types'
import type { EventBus } from './eventBus'
import type { Router } from 'vue-router'
import { EventName } from './types'

/**
 * Navigation manager
 */
export class NavigationManager {
  private router: Router | null = null
  private eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  /**
   * Initialize with vue-router instance
   * @param router - Vue Router instance
   * @internal
   */
  init(router: Router): void {
    this.router = router
  }

  /**
   * Navigate to a route
   * @param path - Route path
   * @param options - Navigation options
   * @returns Promise that resolves when navigation is complete
   */
  async navigate(path: string, options?: NavigateOptions): Promise<void> {
    if (!this.router) {
      console.warn('[Navigation] Router not initialized')
      return
    }

    await this.router[options?.replace ? 'replace' : 'push'](path)

    if (options?.scrollToTop !== false && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    this.eventBus.emit(EventName.NAVIGATED, { path })
  }

  /**
   * Navigate to a named route
   * @param name - Route name
   * @param params - Route parameters
   * @param options - Navigation options
   * @returns Promise that resolves when navigation is complete
   */
  async navigateTo(name: string, params?: Record<string, string>, options?: NavigateOptions): Promise<void> {
    if (!this.router) {
      console.warn('[Navigation] Router not initialized')
      return
    }

    await this.router[options?.replace ? 'replace' : 'push']({
      name,
      params,
    })

    if (options?.scrollToTop !== false && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    this.eventBus.emit(EventName.NAVIGATED, { name, params })
  }

  /**
   * Go back in history
   */
  back(): void {
    if (!this.router) {
      console.warn('[Navigation] Router not initialized')
      return
    }
    this.router.back()
  }

  /**
   * Go forward in history
   */
  forward(): void {
    if (!this.router) {
      console.warn('[Navigation] Router not initialized')
      return
    }
    this.router.forward()
  }

  /**
   * Get current route
   * @returns Current route info or null
   */
  getCurrentRoute(): Route | null {
    if (!this.router) return null

    const route = this.router.currentRoute.value
    return {
      path: route.path,
      name: (route.name as string) ?? '',
    }
  }

  /**
   * Get all registered routes
   * @returns Array of registered routes
   */
  getRoutes(): Route[] {
    if (!this.router) return []

    return this.router.getRoutes().map(r => ({
      path: r.path,
      name: (r.name as string) ?? '',
    }))
  }

  /**
   * Get current path
   */
  getCurrentPath(): string {
    if (!this.router) return ''
    return this.router.currentRoute.value.path
  }
}
