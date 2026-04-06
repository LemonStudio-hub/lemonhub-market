/** Application category enumeration */
export enum AppCategory {
  PRODUCTIVITY = 'productivity',
  DEVELOPMENT = 'development',
  DESIGN = 'design',
  COMMUNICATION = 'communication',
  UTILITIES = 'utilities',
}

/** Application status */
export enum AppStatus {
  AVAILABLE = 'available',
  INSTALLED = 'installed',
  UPDATING = 'updating',
}

/** Core application metadata interface */
export interface AppMetadata {
  id: string
  name: string
  description: string
  icon: string
  category: AppCategory
  status: AppStatus
  version: string
  author: string
  rating: number
  downloads: number
  tags: string[]
  lastUpdated: string
}

/** Navigation item interface */
export interface NavItem {
  id: string
  label: string
  icon: string
  route: string
  badge?: number
}

/** Theme configuration */
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  shadow: string
  success: string
  warning: string
  error: string
}

/** Layout configuration */
export interface LayoutConfig {
  sidebarWidth: number
  headerHeight: number
  gridColumns: {
    mobile: number
    tablet: number
    desktop: number
    wide: number
  }
}
