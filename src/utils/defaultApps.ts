import { AppCategory, AppStatus } from '@/types'
import type { AppMetadata } from '@/types'
import type { LemonHub } from '@/sdk'

/**
 * Default Applications Registry
 * 
 * This file demonstrates the plugin architecture by registering
 * a set of default applications via the LemonHub SDK.
 */

const defaultApps: AppMetadata[] = [
  {
    id: 'app-001',
    name: 'Code Editor',
    description: 'A powerful, lightweight code editor with syntax highlighting and IntelliSense support.',
    icon: 'code',
    category: AppCategory.DEVELOPMENT,
    status: AppStatus.AVAILABLE,
    version: '2.4.1',
    author: 'DevTools Inc',
    rating: 4.8,
    downloads: 1250000,
    tags: ['editor', 'code', 'IDE'],
    lastUpdated: '2026-04-01',
  },
  {
    id: 'app-002',
    name: 'Task Manager',
    description: 'Organize your workflow with customizable task boards and project management tools.',
    icon: 'tasks',
    category: AppCategory.PRODUCTIVITY,
    status: AppStatus.INSTALLED,
    version: '3.1.0',
    author: 'Productivity Labs',
    rating: 4.6,
    downloads: 890000,
    tags: ['tasks', 'project', 'management'],
    lastUpdated: '2026-03-28',
  },
  {
    id: 'app-003',
    name: 'Design Studio',
    description: 'Professional design tool for creating stunning UI/UX mockups and graphics.',
    icon: 'design',
    category: AppCategory.DESIGN,
    status: AppStatus.AVAILABLE,
    version: '1.9.2',
    author: 'Creative Suite Co',
    rating: 4.9,
    downloads: 2100000,
    tags: ['design', 'UI', 'graphics'],
    lastUpdated: '2026-04-03',
  },
  {
    id: 'app-004',
    name: 'Team Chat',
    description: 'Real-time communication platform for teams with channels and direct messaging.',
    icon: 'chat',
    category: AppCategory.COMMUNICATION,
    status: AppStatus.INSTALLED,
    version: '5.0.3',
    author: 'ConnectTech',
    rating: 4.5,
    downloads: 3500000,
    tags: ['chat', 'team', 'messaging'],
    lastUpdated: '2026-04-05',
  },
  {
    id: 'app-005',
    name: 'File Manager',
    description: 'Advanced file management with cloud sync, version control, and sharing capabilities.',
    icon: 'files',
    category: AppCategory.UTILITIES,
    status: AppStatus.AVAILABLE,
    version: '2.0.0',
    author: 'CloudTools',
    rating: 4.4,
    downloads: 670000,
    tags: ['files', 'storage', 'cloud'],
    lastUpdated: '2026-03-20',
  },
  {
    id: 'app-006',
    name: 'Analytics Dashboard',
    description: 'Comprehensive analytics and reporting tool with real-time data visualization.',
    icon: 'analytics',
    category: AppCategory.PRODUCTIVITY,
    status: AppStatus.AVAILABLE,
    version: '1.5.8',
    author: 'DataViz Pro',
    rating: 4.7,
    downloads: 540000,
    tags: ['analytics', 'dashboard', 'data'],
    lastUpdated: '2026-03-15',
  },
  {
    id: 'app-007',
    name: 'API Tester',
    description: 'Test and debug APIs with an intuitive interface and automated testing workflows.',
    icon: 'api',
    category: AppCategory.DEVELOPMENT,
    status: AppStatus.AVAILABLE,
    version: '3.2.1',
    author: 'DevTools Inc',
    rating: 4.6,
    downloads: 920000,
    tags: ['API', 'testing', 'debug'],
    lastUpdated: '2026-04-02',
  },
  {
    id: 'app-008',
    name: 'Image Editor',
    description: 'Professional photo editing with AI-powered tools and non-destructive editing.',
    icon: 'image',
    category: AppCategory.DESIGN,
    status: AppStatus.INSTALLED,
    version: '4.1.0',
    author: 'Creative Suite Co',
    rating: 4.8,
    downloads: 1800000,
    tags: ['photo', 'editing', 'AI'],
    lastUpdated: '2026-03-30',
  },
]

/**
 * Initialize and register all default applications via SDK
 */
export function initializeDefaultApps(sdk: LemonHub): void {
  for (const app of defaultApps) {
    sdk.apps.register(app)
  }
}
