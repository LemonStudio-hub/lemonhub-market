<template>
  <div class="settings-view">
    <h1 class="responsive-title">Settings</h1>

    <div class="settings-grid">
      <section class="settings-section">
        <h2 class="section-title">Appearance</h2>
        <div class="setting-item">
          <div class="setting-info">
            <h3>Dark Mode</h3>
            <p>Toggle between light and dark theme</p>
          </div>
          <button 
            class="theme-toggle"
            :class="{ active: isDark }"
            @click="toggleTheme"
          >
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
          </button>
        </div>
      </section>

      <section class="settings-section">
        <h2 class="section-title">Layout</h2>
        <div class="setting-item">
          <div class="setting-info">
            <h3>Compact Sidebar</h3>
            <p>Minimize the sidebar width</p>
          </div>
          <button 
            class="theme-toggle"
            :class="{ active: isSidebarCollapsed }"
            @click="toggleSidebar"
          >
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
          </button>
        </div>
      </section>

      <section class="settings-section">
        <h2 class="section-title">About</h2>
        <div class="about-card">
          <div class="about-logo">
            <IconGrid :size="40" />
          </div>
          <div class="about-info">
            <h3>LemonHub</h3>
            <p>Version 1.0.0</p>
            <p class="about-description">
              A modern, modular application hub platform built with Vue, Vite, and TypeScript.
              Features responsive design, dark mode support, and a plugin-based architecture.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import type { LemonHub } from '@/sdk'
import IconGrid from '@/components/common/IconGrid.vue'

const sdk = inject<LemonHub>('sdk')!
const layoutStore = useLayoutStore()

const isDark = computed(() => sdk.theme.isDark())
const isSidebarCollapsed = computed(() => layoutStore.isSidebarCollapsed)

function toggleTheme() {
  sdk.theme.toggle()
}

function toggleSidebar() {
  layoutStore.toggleSidebar()
}
</script>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
}

.settings-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }
}

.setting-info h3 {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.setting-info p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.toggle-track {
  position: relative;
  display: block;
  width: 48px;
  height: 24px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.theme-toggle.active .toggle-track {
  background: var(--color-primary);
}

.theme-toggle.active .toggle-thumb {
  transform: translateX(24px);
}

.about-card {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.about-logo {
  flex-shrink: 0;
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-lg);
}

.about-info h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.about-info p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm) 0;

  &:last-child {
    margin-bottom: 0;
  }
}

.about-description {
  line-height: 1.6;
}
</style>
