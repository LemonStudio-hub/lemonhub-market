<template>
  <div class="home-view">
    <div class="hero-section">
      <h1 class="responsive-title">
        Welcome to <span class="text-gradient">LemonHub</span>
      </h1>
      <p class="responsive-subtitle">
        Discover and manage your applications in one place
      </p>
    </div>

    <CategoryFilter />

    <section class="apps-section">
      <div class="section-header">
        <h2 class="section-title">
          {{ hasActiveFilters ? 'Search Results' : 'Featured Applications' }}
        </h2>
        <span class="app-count">{{ filteredApps.length }} applications</span>
      </div>

      <div v-if="filteredApps.length > 0" class="app-grid">
        <AppCard 
          v-for="(app, index) in filteredApps" 
          :key="app.id"
          :app="app"
          class="animate-fade-in-up"
          :class="`stagger-${(index % 8) + 1}`"
        />
      </div>

      <div v-else class="empty-state">
        <IconSearch :size="48" />
        <h3 class="empty-title">No applications found</h3>
        <p>Try adjusting your search or filters</p>
        <button v-if="hasActiveFilters" class="clear-filters-btn" @click="clearFilters">
          Clear Filters
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useSearchStore } from '@/stores/search'
import type { LemonHub } from '@/sdk'
import AppCard from '@/components/cards/AppCard.vue'
import CategoryFilter from '@/components/common/CategoryFilter.vue'
import IconSearch from '@/components/common/IconSearch.vue'

const sdk = inject<LemonHub>('sdk')!
const searchStore = useSearchStore()

const searchQuery = computed(() => searchStore.searchQuery)
const selectedCategory = computed(() => searchStore.selectedCategory)
const hasActiveFilters = computed(() => searchStore.hasActiveFilters)

const filteredApps = computed(() => {
  return sdk.apps.filterAndSearch(searchQuery.value, selectedCategory.value)
})

function clearFilters() {
  searchStore.clearFilters()
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.hero-section {
  text-align: center;
  padding: var(--spacing-2xl) 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.app-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-text-muted);
}

.empty-state svg {
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  margin: 0 0 var(--spacing-lg) 0;
}

.clear-filters-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-dark);
  }
}
</style>
