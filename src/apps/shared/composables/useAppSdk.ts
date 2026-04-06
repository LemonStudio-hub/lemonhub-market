import { LemonHub } from '@/sdk'
import type { AppInfo } from '@/sdk'

/**
 * Register an app via the SDK
 */
export function registerApp(app: AppInfo): void {
  const sdk = LemonHub.getInstance()
  sdk.apps.register(app)
}

/**
 * Navigate to an app detail page
 */
export function openApp(appId: string): void {
  const sdk = LemonHub.getInstance()
  sdk.apps.launch(appId)
}

/**
 * Get SDK notification helper
 */
export function notify() {
  const sdk = LemonHub.getInstance()
  return sdk.notify
}

/**
 * Get SDK storage helper
 */
export function storage() {
  const sdk = LemonHub.getInstance()
  return sdk.storage
}

/**
 * Subscribe to app events
 */
export function onAppEvent(
  event: 'installed' | 'uninstalled' | 'launched',
  handler: (data: unknown) => void
) {
  const sdk = LemonHub.getInstance()
  const eventName = `app:${event}` as const
  return sdk.on(eventName, handler)
}
