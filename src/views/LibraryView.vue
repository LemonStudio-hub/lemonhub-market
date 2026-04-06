<template>
  <div class="library-view">
    <div class="library-header">
      <h1 class="responsive-title">My Library</h1>
      <p class="responsive-subtitle">
        {{ installedApps.length }} {{ installedApps.length === 1 ? 'application' : 'applications' }} installed
      </p>
    </div>

    <div v-if="installedApps.length > 0" class="app-grid">
      <AppCard 
        v-for="(app, index) in installedApps" 
        :key="app.id"
        :app="app"
        class="animate-fade-in-up"
        :class="`stagger-${(index % 8) + 1}`"
      />
    </div>

    <div v-else class="empty-library">
      <IconLibrary :size="64" />
      <h2 class="empty-title">Your library is empty</h2>
      <p>Browse LemonHub to discover and install applications</p>
      <router-link to="/" class="browse-btn">
        Browse Applications
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { AppStatus } from '@/types'
import type { LemonHub } from '@/sdk'
import AppCard from '@/components/cards/AppCard.vue'
import IconLibrary from '@/components/common/IconLibrary.vue'

const sdk = inject<LemonHub>('sdk')!

const installedApps = computed(() => {
  return sdk.apps.getAll().filter(app => app.status === AppStatus.INSTALLED)
})
</script>

<style scoped>
.library-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.library-header {
  padding: var(--spacing-xl) 0;
}

.empty-library {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-text-muted);
}

.empty-library svg {
  margin-bottom: var(--spacing-xl);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-md) 0;
}

.empty-library p {
  margin: 0 0 var(--spacing-xl) 0;
  font-size: var(--text-base);
}

.browse-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 500;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
</style>
