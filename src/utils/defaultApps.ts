import type { LemonHub } from '@/sdk'
import { registerMarketApps } from '@/apps/registry'

/**
 * Initialize and register all default apps via SDK
 */
export function initializeDefaultApps(sdk: LemonHub): void {
  registerMarketApps(sdk)
}

export { registerMarketApps }
