<template>
  <nav 
    class="sidebar" 
    :class="{ collapsed: isCollapsed, 'mobile-open': isMobileOpen }"
  >
    <div class="sidebar-header">
      <div class="logo">
        <IconGrid :size="28" />
        <span v-show="!isCollapsed" class="logo-text text-gradient">LemonHub</span>
      </div>
      <button 
        class="collapse-toggle desktop-only"
        @click="toggleSidebar"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <IconExpand :size="20" />
      </button>
    </div>

    <div class="sidebar-nav">
      <router-link 
        v-for="item in navItems" 
        :key="item.id"
        :to="item.route"
        class="nav-item"
        :class="{ active: $route.path === item.route }"
      >
        <component :is="getIconComponent(item.icon)" :size="20" />
        <span v-show="!isCollapsed" class="nav-label">{{ item.label }}</span>
        <span v-show="!isCollapsed && item.badge" class="nav-badge">
          {{ item.badge }}
        </span>
      </router-link>
    </div>

    <div class="sidebar-footer">
      <button 
        class="theme-toggle nav-item"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      >
        <component :is="isDark ? IconSun : IconMoon" :size="20" />
        <span v-show="!isCollapsed">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </nav>

  <div 
    v-if="isMobileOpen" 
    class="sidebar-overlay" 
    :class="{ active: isMobileOpen }"
    @click="closeMobileMenu"
  />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import type { NavItem } from '@/types'
import type { LemonHub } from '@/sdk'
import IconGrid from '@/components/common/IconGrid.vue'
import IconSun from '@/components/common/IconSun.vue'
import IconMoon from '@/components/common/IconMoon.vue'
import IconHome from '@/components/common/IconHome.vue'
import IconLibrary from '@/components/common/IconLibrary.vue'
import IconSettings from '@/components/common/IconSettings.vue'

const sdk = inject<LemonHub>('sdk')!
const layoutStore = useLayoutStore()

const isCollapsed = computed(() => layoutStore.isSidebarCollapsed)
const isMobileOpen = computed(() => layoutStore.isMobileMenuOpen)
const isDark = computed(() => sdk.theme.isDark())

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', route: '/' },
  { id: 'library', label: 'My Library', icon: 'library', route: '/library' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
]

function getIconComponent(iconName: string) {
  const iconMap: Record<string, any> = {
    home: IconHome,
    library: IconLibrary,
    settings: IconSettings,
  }
  return iconMap[iconName] || IconHome
}

function toggleTheme() {
  sdk.theme.toggle()
}

function toggleSidebar() {
  layoutStore.toggleSidebar()
}

function closeMobileMenu() {
  layoutStore.closeMobileMenu()
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: width var(--transition-slow), transform var(--transition-slow);
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-text {
  font-size: var(--text-xl);
  font-weight: 700;
  white-space: nowrap;
}

.collapse-toggle {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.collapse-toggle:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-primary);
  color: white;
}

.nav-label {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: 500;
}

.nav-badge {
  background: var(--color-accent);
  color: white;
  font-size: var(--text-xs);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.theme-toggle {
  width: 100%;
}

@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .collapse-toggle {
    display: none;
  }
}

@media (min-width: 1024px) {
  .sidebar-overlay {
    display: none;
  }
}
</style>
