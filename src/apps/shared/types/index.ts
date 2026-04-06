/** Shared types for all apps in the market */

/** Base app configuration */
export interface AppConfig {
  id: string
  name: string
  version: string
  icon: string
  description: string
}

/** Common theme colors shared across all apps */
export interface AppTheme {
  primary: string
  primaryLight: string
  primaryDark: string
  surface: string
  surfaceHover: string
  background: string
  text: string
  textSecondary: string
  border: string
  accent: string
  success: string
  warning: string
  error: string
}

/** Common CSS variable names */
export const CSS_VARS = {
  primary: '--app-primary',
  primaryLight: '--app-primary-light',
  primaryDark: '--app-primary-dark',
  surface: '--app-surface',
  surfaceHover: '--app-surface-hover',
  background: '--app-background',
  text: '--app-text',
  textSecondary: '--app-text-secondary',
  border: '--app-border',
  accent: '--app-accent',
  success: '--app-success',
  warning: '--app-warning',
  error: '--app-error',
  radius: '--app-radius',
  shadow: '--app-shadow',
} as const
