<template>
  <div class="app-container" :style="containerStyle">
    <header class="app-header" v-if="showHeader">
      <div class="app-header-icon" v-if="icon">
        <component :is="icon" :size="20" />
      </div>
      <div>
        <h2 class="app-header-title">{{ title }}</h2>
        <p v-if="subtitle" class="app-header-subtitle">{{ subtitle }}</p>
      </div>
      <div class="app-header-spacer" />
      <slot name="header-actions" />
    </header>
    <main class="app-body">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  icon?: any
  showHeader?: boolean
  accentColor?: string
}>()

const showHeader = computed(() => props.showHeader !== false)

const containerStyle = computed(() => {
  if (!props.accentColor) return {}
  return {
    '--app-primary': props.accentColor,
  } as Record<string, string>
})
</script>

<style scoped>
.app-header-spacer { flex: 1; }
</style>
