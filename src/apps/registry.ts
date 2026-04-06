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
    id: 'app-clock',
    name: 'Clock',
    description: 'All-in-one clock: Pomodoro, Countdown, Stopwatch, Alarm with notifications, World Clock with multi-timezone',
    icon: 'clock',
    category: 'utilities',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.7,
    downloads: 0,
    tags: ['clock', 'pomodoro', 'countdown', 'stopwatch', 'alarm', 'world clock', 'timezone', 'timer'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-calendar',
    name: 'Calendar',
    description: 'Full calendar: month view with lunar calendar, todos, date calculator, holidays, schedule with drag & drop',
    icon: 'calendar',
    category: 'productivity',
    status: 'available',
    version: '2.0.0',
    author: 'LemonHub',
    rating: 4.8,
    downloads: 0,
    tags: ['calendar', 'todo', 'lunar', 'holidays', 'schedule', 'date calculator', 'drag and drop', 'planner'],
    lastUpdated: '2026-04-06',
  },
  {
    id: 'app-games',
    name: 'Games',
    description: '3 classic games: Snake, Tetris, 2048 — all in one app with unified controls and high scores',
    icon: 'games',
    category: 'entertainment',
    status: 'available',
    version: '1.0.0',
    author: 'LemonHub',
    rating: 4.6,
    downloads: 0,
    tags: ['games', 'snake', 'tetris', '2048', 'arcade', 'puzzle', 'retro'],
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
    description: 'Markdown editor with 8 text tools: case, format, encode, 简繁, lines, regex, diff, hash. Export PDF/HTML/TXT',
    icon: 'memo',
    category: 'productivity',
    status: 'available',
    version: '2.0.0',
    author: 'LemonHub',
    rating: 4.9,
    downloads: 0,
    tags: ['notes', 'memo', 'markdown', 'editor', 'tools', 'export', 'regex', 'hash', 'diff'],
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
    'app-clock': () => import('@/apps/clock/Clock.vue'),
    'app-calendar': () => import('@/apps/calendar/Calendar.vue'),
    'app-games': () => import('@/apps/games/Games.vue'),
    'app-pomodoro': () => import('@/apps/pomodoro/Pomodoro.vue'),
    'app-music': () => import('@/apps/music/MusicPlayer.vue'),
    'app-memo': () => import('@/apps/memo/Memo.vue'),
  }
  return components[appId]
}
