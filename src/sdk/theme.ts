/**
 * Theme Module
 * 
 * Manages theme state, switching between light/dark modes,
 * and provides theme color configuration.
 */

import type { ThemeMode, ThemeColors, ThemeChangeData } from './types'
import type { EventBus } from './eventBus'
import { EventName } from './types'

const STORAGE_KEY = 'lemonhub-theme'

const lightColors: ThemeColors = {
  primary: '#6366f1',
  secondary: '#0ea5e9',
  accent: '#f59e0b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}

const darkColors: ThemeColors = {
  primary: '#818cf8',
  secondary: '#38bdf8',
  accent: '#fbbf24',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  border: '#334155',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}

/**
 * Theme manager
 */
export class ThemeManager {
  private mode: ThemeMode
  private eventBus: EventBus
  private colors: ThemeColors
  private isBrowser: boolean

  constructor(eventBus: EventBus, defaultMode: ThemeMode = 'light') {
    this.eventBus = eventBus
    this.isBrowser = typeof window !== 'undefined'
    this.mode = this.loadSavedTheme() ?? defaultMode
    this.colors = this.getColorsForMode(this.mode)
    if (this.isBrowser) {
      this.applyTheme()
    }
  }

  /**
   * Get current theme mode
   */
  getMode(): ThemeMode {
    return this.mode
  }

  /**
   * Check if current theme is dark
   */
  isDark(): boolean {
    if (this.mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return this.mode === 'dark'
  }

  /**
   * Set theme mode
   * @param mode - Theme mode
   */
  setMode(mode: ThemeMode): void {
    this.mode = mode
    this.colors = this.getColorsForMode(mode)
    this.applyTheme()
    this.saveTheme()
    this.notifyChange()
  }

  /**
   * Toggle between light and dark
   */
  toggle(): void {
    const current = this.isDark()
    this.mode = current ? 'light' : 'dark'
    this.colors = this.getColorsForMode(this.mode)
    this.applyTheme()
    this.saveTheme()
    this.notifyChange()
  }

  /**
   * Get current theme colors
   */
  getColors(): ThemeColors {
    return { ...this.colors }
  }

  /**
   * Set custom theme colors
   * @param colors - Custom colors
   */
  setColors(colors: Partial<ThemeColors>): void {
    this.colors = { ...this.colors, ...colors }
    this.applyCustomColors()
    this.notifyChange()
  }

  /**
   * Reset to default colors
   */
  resetColors(): void {
    this.colors = this.getColorsForMode(this.mode)
    this.applyTheme()
    this.notifyChange()
  }

  /**
   * Listen for system theme changes (when mode is 'auto')
   */
  watchSystemTheme(): void {
    if (!this.isBrowser) return
    if (this.mode !== 'auto') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      this.colors = this.getColorsForMode(this.mode)
      this.applyTheme()
      this.notifyChange()
    })
  }

  private getColorsForMode(mode: ThemeMode): ThemeColors {
    if (mode === 'auto' && this.isBrowser) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? darkColors : lightColors
    }
    return mode === 'dark' ? darkColors : lightColors
  }

  private applyTheme(): void {
    if (!this.isBrowser) return
    const isDark = this.isDark()
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }

  private applyCustomColors(): void {
    if (!this.isBrowser) return
    const root = document.documentElement.style
    root.setProperty('--color-primary', this.colors.primary)
    root.setProperty('--color-secondary', this.colors.secondary)
    root.setProperty('--color-accent', this.colors.accent)
    root.setProperty('--color-background', this.colors.background)
    root.setProperty('--color-surface', this.colors.surface)
    root.setProperty('--color-text', this.colors.text)
    root.setProperty('--color-text-secondary', this.colors.textSecondary)
    root.setProperty('--color-border', this.colors.border)
    root.setProperty('--color-success', this.colors.success)
    root.setProperty('--color-warning', this.colors.warning)
    root.setProperty('--color-error', this.colors.error)
  }

  private saveTheme(): void {
    try {
      localStorage.setItem(STORAGE_KEY, this.mode)
    } catch {
      // Storage not available
    }
  }

  private loadSavedTheme(): ThemeMode | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved as ThemeMode | null
    } catch {
      return null
    }
  }

  private notifyChange(): void {
    const data: ThemeChangeData = {
      mode: this.mode,
      colors: this.colors,
      isDark: this.isDark(),
    }
    this.eventBus.emit(EventName.THEME_CHANGED, data)
  }
}
