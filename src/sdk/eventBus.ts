/**
 * Event System Module
 * 
 * Provides a type-safe event bus for SDK communication.
 * Supports subscribing, unsubscribing, and emitting events.
 */

import type { EventHandler, Subscription } from './types'

interface EventEntry {
  handler: EventHandler
  once: boolean
}

/**
 * Event bus for SDK communication
 */
export class EventBus {
  private listeners: Map<string, EventEntry[]> = new Map()
  private debug: boolean

  constructor(debug = false) {
    this.debug = debug
  }

  /**
   * Subscribe to an event
   * @param event - Event name
   * @param handler - Event handler callback
   * @returns Subscription object for unsubscribing
   */
  on(event: string, handler: EventHandler): Subscription {
    return this.subscribe(event, handler, false)
  }

  /**
   * Subscribe to an event once
   * @param event - Event name
   * @param handler - Event handler callback
   * @returns Subscription object for unsubscribing
   */
  once(event: string, handler: EventHandler): Subscription {
    return this.subscribe(event, handler, true)
  }

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param handler - Event handler to remove
   */
  off(event: string, handler?: EventHandler): void {
    if (!handler) {
      this.listeners.delete(event)
      this.log(`[EventBus] Removed all handlers for: ${event}`)
      return
    }

    const entries = this.listeners.get(event)
    if (entries) {
      const filtered = entries.filter(e => e.handler !== handler)
      if (filtered.length === 0) {
        this.listeners.delete(event)
      } else {
        this.listeners.set(event, filtered)
      }
      this.log(`[EventBus] Removed handler for: ${event}`)
    }
  }

  /**
   * Emit an event with data
   * @param event - Event name
   * @param data - Event data
   */
  emit(event: string, data?: any): void {
    const entries = this.listeners.get(event)
    if (!entries) return

    this.log(`[EventBus] Emit: ${event}`, data)

    // Filter out "once" handlers and keep persistent ones
    const persistent: EventEntry[] = []
    
    for (const entry of entries) {
      entry.handler(data)
      if (!entry.once) {
        persistent.push(entry)
      }
    }

    if (persistent.length === 0) {
      this.listeners.delete(event)
    } else {
      this.listeners.set(event, persistent)
    }
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.listeners.clear()
    this.log('[EventBus] Cleared all listeners')
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.length ?? 0
  }

  private subscribe(event: string, handler: EventHandler, once: boolean): Subscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }

    const entries = this.listeners.get(event)!
    entries.push({ handler, once })

    this.log(`[EventBus] Subscribed to: ${event}${once ? ' (once)' : ''}`)

    return {
      unsubscribe: () => this.off(event, handler),
    }
  }

  private log(...args: any[]): void {
    if (this.debug) {
      console.log(...args)
    }
  }
}
