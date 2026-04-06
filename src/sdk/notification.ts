/**
 * Notification Module
 * 
 * Provides a simple notification/toast system.
 * Supports different types, auto-dismiss, and callbacks.
 */

import type { NotificationData, NotificationType } from './types'
import type { EventBus } from './eventBus'

interface Notification extends NotificationData {
  id: string
  type: NotificationType
  duration: number
  closable: boolean
  visible: boolean
  timer?: ReturnType<typeof setTimeout>
}

const DEFAULT_DURATION: Record<NotificationType, number> = {
  info: 4000,
  success: 3000,
  warning: 5000,
  error: 6000,
}

/**
 * Notification manager
 */
export class NotificationManager {
  private notifications: Map<string, Notification> = new Map()
  private eventBus: EventBus
  private idCounter = 0

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  /**
   * Show a notification
   * @param data - Notification data
   * @returns Notification ID
   */
  show(data: NotificationData | string): string {
    const normalized = typeof data === 'string' ? { title: '', message: data } : data
    const id = normalized.id ?? `notif-${++this.idCounter}`

    const notification: Notification = {
      ...normalized,
      id,
      type: normalized.options?.type ?? 'info',
      duration: normalized.options?.duration ?? DEFAULT_DURATION[normalized.options?.type ?? 'info'],
      closable: normalized.options?.closable ?? true,
      visible: true,
    }

    this.notifications.set(id, notification)

    if (notification.duration > 0) {
      notification.timer = setTimeout(() => {
        this.dismiss(id)
      }, notification.duration)
    }

    this.render()
    return id
  }

  /**
   * Show an info notification
   */
  info(message: string, title?: string): string {
    return this.show({ title: title ?? '', message, options: { type: 'info' } })
  }

  /**
   * Show a success notification
   */
  success(message: string, title?: string): string {
    return this.show({ title: title ?? '', message, options: { type: 'success' } })
  }

  /**
   * Show a warning notification
   */
  warning(message: string, title?: string): string {
    return this.show({ title: title ?? '', message, options: { type: 'warning' } })
  }

  /**
   * Show an error notification
   */
  error(message: string, title?: string): string {
    return this.show({ title: title ?? '', message, options: { type: 'error' } })
  }

  /**
   * Dismiss a notification
   * @param id - Notification ID
   */
  dismiss(id: string): void {
    const notification = this.notifications.get(id)
    if (!notification) return

    if (notification.timer) {
      clearTimeout(notification.timer)
    }

    notification.visible = false
    this.notifications.delete(id)
    this.render()
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    for (const [, notif] of this.notifications) {
      if (notif.timer) clearTimeout(notif.timer)
    }
    this.notifications.clear()
    this.render()
  }

  /**
   * Get active notification count
   */
  get count(): number {
    return this.notifications.size
  }

  /**
   * Get all active notifications
   */
  getAll(): Notification[] {
    return Array.from(this.notifications.values())
  }

  private render(): void {
    // In a real implementation, this would update the DOM
    // For now, we emit an event so the UI can react
    this.eventBus.emit('notification:changed', {
      notifications: this.getAll(),
      count: this.count,
    })
  }
}
