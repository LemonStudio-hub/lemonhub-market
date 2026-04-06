<template>
  <div class="category-filter-mobile mobile-only">
    <div class="category-scroll">
      <button
        v-for="category in allCategories"
        :key="category.value"
        class="category-chip"
        :class="{ active: selectedCategory === category.value }"
        @click="setCategory(category.value as AppCategory | 'all')"
      >
        {{ category.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSearchStore } from '@/stores/search'
import { AppCategory } from '@/types'

const searchStore = useSearchStore()

const allCategories = [
  { value: 'all', label: 'All' },
  ...Object.values(AppCategory).map(cat => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  })),
]

const selectedCategory = computed(() => searchStore.selectedCategory)

function setCategory(category: AppCategory | 'all') {
  searchStore.setCategory(category)
}
</script>

<style scoped>
.category-filter-mobile {
  padding: var(--spacing-md) 0;
}

.category-scroll {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.category-chip {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  
  &.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }
}
</style>
