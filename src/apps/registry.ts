import type { LemonHub, AppInfo } from '@/sdk'

/**
 * Market Apps Registry
 * 
 * All apps register themselves via the @lemonhub/sdk.
 * Each app is completely self-contained and decoupled.
 */

const marketApps: AppInfo[] = [
  {
    id: 'app-calculator',
    name: 'Calculator',
    description: 'Calculator: basic math, currency, unit conversion, base converter, loan, age, date',
    icon: 'calc',
    category: 'utilities',
    status: 'available',
    version: '2.0.0',
    author: 'LemonHub',
    rating: 4.8,
    downloads: 0,
    tags: ['calculator', 'currency', 'unit', 'base', 'loan', 'age', 'date', 'math', 'converter'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-pomodoro',
    name: 'Pomodoro Timer',
    description: 'Stay focused with the Pomodoro Technique',
    icon: 'clock',
    category: 'productivity',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.8,
    downloads: 0,
    tags: ['timer', 'focus', 'productivity'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-snake',
    name: 'Snake Game',
    description: 'Classic snake game with modern visuals',
    icon: 'game',
    category: 'entertainment',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.3,
    downloads: 0,
    tags: ['game', 'snake', 'retro'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-calendar',
    name: 'Calendar',
    description: 'Monthly calendar view with event management',
    icon: 'calendar',
    category: 'productivity',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.6,
    downloads: 0,
    tags: ['calendar', 'schedule', 'events'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-music',
    name: 'Music Player',
    description: 'Beautiful music player with playlist support',
    icon: 'music',
    category: 'entertainment',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.7,
    downloads: 0,
    tags: ['music', 'player', 'audio'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-memo',
    name: 'Memo',
    description: 'Quick notes with color-coded cards',
    icon: 'memo',
    category: 'productivity',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.4,
    downloads: 0,
    tags: ['notes', 'memo', 'reminder'],
    lastUpdated: '2026-04-06',
  },
]

/**
 * Register all market apps via SDK
 */
export function registerMarketApps(sdk: LemonHub): void {
  for (const app of marketApps) {
    sdk.apps.register(app)
  }
}

/**
 * Get the component for an app by ID
 */
export function getAppComponent(appId: string) {
  const components: Record<string, () => Promise<any>> = {
    'app-calculator': () => import('@/apps/calculator/Calculator.vue'),
    'app-pomodoro': () => import('@/apps/pomodoro/Pomodoro.vue'),
    'app-snake': () => import('@/apps/snake/SnakeGame.vue'),
    'app-calendar': () => import('@/apps/calendar/Calendar.vue'),
    'app-music': () => import('@/apps/music/MusicPlayer.vue'),
    'app-memo': () => import('@/apps/memo/Memo.vue'),
  }
  return components[appId]
}
