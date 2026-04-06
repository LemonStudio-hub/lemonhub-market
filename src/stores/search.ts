import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppCategory } from '@/types'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const selectedCategory = ref<AppCategory | 'all'>('all')
  const isSearchFocused = ref(false)

  const hasActiveFilters = computed(() => 
    searchQuery.value.length > 0 || selectedCategory.value !== 'all'
  )

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setCategory(category: AppCategory | 'all') {
    selectedCategory.value = category
  }

  function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
  }

  function toggleSearchFocus() {
    isSearchFocused.value = !isSearchFocused.value
  }

  return {
    searchQuery,
    selectedCategory,
    isSearchFocused,
    hasActiveFilters,
    setSearchQuery,
    setCategory,
    clearFilters,
    toggleSearchFocus,
  }
})
