/**
 * Storage Module
 * 
 * Provides a typed, namespaced storage API with expiration support.
 * Wraps localStorage with additional features.
 */

import type { StorageOptions } from './types'

interface StorageEntry {
  value: any
  expiresAt?: number
}

const DEFAULT_PREFIX = 'lemonhub'

/**
 * Storage manager
 */
export class StorageManager {
  private prefix: string

  constructor(prefix = DEFAULT_PREFIX) {
    this.prefix = prefix
  }

  /**
   * Get a value from storage
   * @param key - Storage key
   * @param options - Storage options
   * @returns Stored value or null
   */
  get<T = any>(key: string, options?: StorageOptions): T | null {
    const fullKey = this.buildKey(key, options?.namespace)
    const raw = this.getItem(fullKey)

    if (!raw) return null

    try {
      const entry: StorageEntry = JSON.parse(raw)

      // Check expiration
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.removeItem(fullKey)
        return null
      }

      return entry.value as T
    } catch {
      // Not JSON, return as-is
      return raw as unknown as T
    }
  }

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   * @param options - Storage options
   */
  set(key: string, value: any, options?: StorageOptions): void {
    const fullKey = this.buildKey(key, options?.namespace)
    const entry: StorageEntry = {
      value,
      expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
    }

    this.setItem(fullKey, JSON.stringify(entry))
  }

  /**
   * Remove a value from storage
   * @param key - Storage key
   * @param options - Storage options
   */
  remove(key: string, options?: StorageOptions): void {
    const fullKey = this.buildKey(key, options?.namespace)
    this.removeItem(fullKey)
  }

  /**
   * Check if a key exists
   * @param key - Storage key
   * @param options - Storage options
   */
  has(key: string, options?: StorageOptions): boolean {
    const fullKey = this.buildKey(key, options?.namespace)
    return this.getItem(fullKey) !== null
  }

  /**
   * Clear all storage, optionally filtered by namespace
   * @param namespace - Optional namespace to clear
   */
  clear(namespace?: string): void {
    if (namespace) {
      const prefix = `${this.prefix}:${namespace}:`
      const keys = this.getAllKeys().filter(k => k.startsWith(prefix))
      keys.forEach(k => this.removeItem(k))
    } else {
      const keys = this.getAllKeys().filter(k => k.startsWith(this.prefix))
      keys.forEach(k => this.removeItem(k))
    }
  }

  /**
   * Get all keys, optionally filtered by namespace
   */
  keys(namespace?: string): string[] {
    const prefix = namespace ? `${this.prefix}:${namespace}:` : this.prefix
    return this.getAllKeys()
      .filter(k => k.startsWith(prefix))
      .map(k => k.replace(prefix, ''))
  }

  /**
   * Get storage size, optionally filtered by namespace
   */
  size(namespace?: string): number {
    return this.keys(namespace).length
  }

  private buildKey(key: string, namespace?: string): string {
    if (namespace) {
      return `${this.prefix}:${namespace}:${key}`
    }
    return `${this.prefix}:${key}`
  }

  private getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  private setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      console.warn('[Storage] Failed to save item')
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore
    }
  }

  private getAllKeys(): string[] {
    const keys: string[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) keys.push(key)
      }
    } catch {
      // Ignore
    }
    return keys
  }
}
