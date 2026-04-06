<template>
  <div class="app-detail-view">
    <button class="app-detail-back" @click="goBack">
      ← Back
    </button>
    <div class="app-detail-content">
      <component
        v-if="AppComponent"
        :is="AppComponent"
      />
      <div v-else class="app-detail-loading">
        <p>Loading app...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAppComponent } from '@/apps/registry'

const route = useRoute()
const router = useRouter()
const AppComponent = ref<any>(null)

const appId = route.params.id as string

async function loadApp() {
  const loader = getAppComponent(appId)
  if (loader) {
    AppComponent.value = (await loader()).default
  }
}

function goBack() {
  router.push('/')
}

onMounted(loadApp)
watch(() => route.params.id, loadApp)
</script>

<style scoped>
.app-detail-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - var(--spacing-xl) * 2);
  max-height: calc(100vh - var(--header-height) - var(--spacing-xl) * 2);
  position: relative;
}

.app-detail-back {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-sm);
  padding: var(--sp-sm) var(--sp-md);
  font-size: 0.85rem;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--sp-md);
  transition: all var(--ease-fast);
  align-self: flex-start;
}

.app-detail-back:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.app-detail-content {
  flex: 1;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.app-detail-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-muted);
}
</style>
