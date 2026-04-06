/**
 * LemonHub SDK Type Definitions
 * 
 * This module contains all public types and interfaces for the LemonHub SDK.
 * These types are used across all SDK modules to ensure type safety.
 */

/* ============================================
   App Types
   ============================================ */

/** Application category enumeration */
export type AppCategory = 
  | 'productivity'
  | 'development'
  | 'design'
  | 'communication'
  | 'utilities'
  | 'entertainment'
  | 'education'
  | 'security'

/** Application status */
export type AppStatus = 'available' | 'installed' | 'updating' | 'disabled'

/** Core application metadata */
export interface AppInfo {
  /** Unique application identifier */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Icon URL or identifier */
  icon: string
  /** Application category */
  category: AppCategory
  /** Current status */
  status: AppStatus
  /** Semantic version */
  version: string
  /** Author or publisher */
  author: string
  /** Rating (0-5) */
  rating: number
  /** Total downloads */
  downloads: number
  /** Search tags */
  tags: string[]
  /** Last update date */
  lastUpdated: string
}

/** Application registration options */
export interface AppOptions {
  /** Callback when app is installed */
  onInstall?: (app: AppInfo) => void
  /** Callback when app is uninstalled */
  onUninstall?: (app: AppInfo) => void
  /** Callback when app is launched */
  onLaunch?: (app: AppInfo) => void
  /** Callback when app is updated */
  onUpdate?: (app: AppInfo) => void
}

/* ============================================
   Theme Types
   ============================================ */

/** Theme mode */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** Theme color configuration */
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
}

/** Theme change event data */
export interface ThemeChangeData {
  mode: ThemeMode
  colors: ThemeColors
  isDark: boolean
}

/* ============================================
   Navigation Types
   ============================================ */

/** Navigation route */
export interface Route {
  /** Route path */
  path: string
  /** Route name */
  name: string
}

/** Navigation options */
export interface NavigateOptions {
  /** Replace current history entry */
  replace?: boolean
  /** Scroll to top after navigation */
  scrollToTop?: boolean
}

/* ============================================
   Event Types
   ============================================ */

/** SDK event names */
export enum EventName {
  /** App registered */
  APP_REGISTERED = 'app:registered',
  /** App unregistered */
  APP_UNREGISTERED = 'app:unregistered',
  /** App installed */
  APP_INSTALLED = 'app:installed',
  /** App uninstalled */
  APP_UNINSTALLED = 'app:uninstalled',
  /** App launched */
  APP_LAUNCHED = 'app:launched',
  /** Theme changed */
  THEME_CHANGED = 'theme:changed',
  /** Navigation occurred */
  NAVIGATED = 'navigation:navigated',
  /** Error occurred */
  ERROR = 'error',
  /** SDK initialized */
  READY = 'ready',
}

/** Event handler function */
export type EventHandler<T = any> = (data: T) => void

/** Event subscription handle */
export interface Subscription {
  /** Unsubscribe from the event */
  unsubscribe: () => void
}

/* ============================================
   Notification Types
   ============================================ */

/** Notification type */
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

/** Notification options */
export interface NotificationOptions {
  /** Notification type */
  type?: NotificationType
  /** Duration in ms (0 = no auto-dismiss) */
  duration?: number
  /** Show close button */
  closable?: boolean
  /** Custom action label */
  actionLabel?: string
  /** Custom action callback */
  onAction?: () => void
}

/** Notification data for showing */
export interface NotificationData {
  /** Unique notification ID */
  id?: string
  /** Title */
  title: string
  /** Message */
  message: string
  /** Additional options */
  options?: NotificationOptions
}

/* ============================================
   Storage Types
   ============================================ */

/** Storage namespace */
export type StorageNamespace = 'app' | 'user' | 'system' | string

/** Storage options */
export interface StorageOptions {
  /** Namespace for the storage */
  namespace?: StorageNamespace
  /** Expiration time in ms */
  expiresIn?: number
}

/* ============================================
   SDK Configuration
   ============================================ */

/** SDK initialization options */
export interface SDKOptions {
  /** Enable debug logging */
  debug?: boolean
  /** Default theme mode */
  defaultTheme?: ThemeMode
  /** Storage prefix */
  storagePrefix?: string
  /** Custom event bus (for advanced usage) */
  customEventBus?: boolean
}

/** SDK status */
export interface SDKStatus {
  /** Whether SDK is initialized */
  initialized: boolean
  /** SDK version */
  version: string
  /** Registered app count */
  appCount: number
  /** Current theme mode */
  theme: ThemeMode
}
