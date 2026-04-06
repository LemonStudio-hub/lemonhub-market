<template>
  <header class="header">
    <div class="header-left">
      <button 
        class="menu-toggle mobile-only"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <IconMenu :size="24" />
      </button>
      
      <div class="search-container">
        <IconSearch :size="18" />
        <input 
          type="text"
          class="search-input"
          placeholder="Search applications..."
          v-model="searchQuery"
          @focus="toggleSearchFocus"
          @blur="toggleSearchFocus"
        />
        <kbd v-show="!isSearchFocused" class="search-shortcut">⌘K</kbd>
      </div>
    </div>

    <div class="header-right">
      <div class="category-filter desktop-only">
        <select 
          v-model="selectedCategory"
          class="category-select"
        >
          <option value="all">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ formatCategoryName(category) }}
          </option>
        </select>
      </div>

      <button 
        class="theme-toggle-btn desktop-only"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      >
        <component :is="isDark ? IconSun : IconMoon" :size="20" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useSearchStore } from '@/stores/search'
import { useLayoutStore } from '@/stores/layout'
import { AppCategory } from '@/types'
import type { LemonHub } from '@/sdk'
import IconSearch from '@/components/common/IconSearch.vue'
import IconMenu from '@/components/common/IconMenu.vue'
import IconSun from '@/components/common/IconSun.vue'
import IconMoon from '@/components/common/IconMoon.vue'

const sdk = inject<LemonHub>('sdk')!
const searchStore = useSearchStore()
const layoutStore = useLayoutStore()

const searchQuery = computed({
  get: () => searchStore.searchQuery,
  set: (val) => searchStore.setSearchQuery(val),
})

const selectedCategory = computed({
  get: () => searchStore.selectedCategory,
  set: (val) => searchStore.setCategory(val as any),
})

const isSearchFocused = computed(() => searchStore.isSearchFocused)
const isDark = computed(() => sdk.theme.isDark())

const categories = Object.values(AppCategory)

function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function toggleTheme() {
  sdk.theme.toggle()
}

function toggleMobileMenu() {
  layoutStore.toggleMobileMenu()
}

function toggleSearchFocus() {
  searchStore.toggleSearchFocus()
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  z-index: var(--z-sticky);
  backdrop-filter: blur(8px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.menu-toggle {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.menu-toggle:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.search-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-container svg {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--color-text);
  font-size: var(--text-sm);
  
  &::placeholder {
    color: var(--color-text-muted);
  }
}

.search-shortcut {
  padding: 2px 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-sans);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.category-filter {
  position: relative;
}

.category-select {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-size: var(--text-sm);
  cursor: pointer;
  outline: none;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-primary);
  }
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}

.theme-toggle-btn {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }
}

@media (max-width: 1023px) {
  .header {
    padding: 0 var(--spacing-md);
  }

  .search-container {
    max-width: none;
  }

  .search-shortcut {
    display: none;
  }
}
</style>
