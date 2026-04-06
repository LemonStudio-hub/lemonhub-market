<template>
  <article class="app-card" :class="{ 'is-installed': app.status === AppStatus.INSTALLED }">
    <div class="app-card-header">
      <div class="app-icon" :style="{ background: iconGradient }">
        <span class="app-icon-text">{{ app.name.charAt(0) }}</span>
      </div>
      <div class="app-status-badge" v-if="app.status === AppStatus.INSTALLED">
        <span class="status-dot"></span>
        <span class="status-text">Installed</span>
      </div>
    </div>

    <div class="app-card-body">
      <h3 class="app-name">{{ app.name }}</h3>
      <p class="app-description">{{ app.description }}</p>
      
      <div class="app-meta">
        <div class="meta-item">
          <IconStar :size="14" />
          <span>{{ app.rating.toFixed(1) }}</span>
        </div>
        <div class="meta-item">
          <IconDownload :size="14" />
          <span>{{ formatDownloads(app.downloads) }}</span>
        </div>
        <span class="app-version">v{{ app.version }}</span>
      </div>

      <div class="app-tags">
        <span v-for="tag in app.tags.slice(0, 3)" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="app-card-footer">
      <span class="app-category">{{ formatCategoryName(app.category) }}</span>
      <button 
        class="app-action-btn"
        :class="app.status === AppStatus.INSTALLED ? 'btn-secondary' : 'btn-primary'"
      >
        {{ app.status === AppStatus.INSTALLED ? 'Open' : 'Install' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppStatus } from '@/types'
import type { AppMetadata } from '@/types'
import type { AppInfo } from '@/sdk/types'
import IconStar from '@/components/common/IconStar.vue'
import IconDownload from '@/components/common/IconDownload.vue'

const props = defineProps<{
  app: AppMetadata | AppInfo
}>()

const iconGradient = computed(() => {
  const colors: Record<string, string> = {
    productivity: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    development: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    design: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    communication: 'linear-gradient(135deg, #43e97b 0%, #38f9d 100%)',
    utilities: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  }
  return colors[props.app.category] || colors.utilities
})

function formatDownloads(downloads: number): string {
  if (downloads >= 1000000) {
    return `${(downloads / 1000000).toFixed(1)}M`
  }
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}K`
  }
  return downloads.toString()
}

function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
</script>

<style scoped>
.app-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    opacity: 0;
    transition: opacity var(--transition-base);
  }
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);

  &::before {
    opacity: 1;
  }
}

.app-card.is-installed {
  border-color: var(--color-success);
}

.app-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.app-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.app-icon-text {
  color: white;
  font-size: var(--text-2xl);
  font-weight: 700;
}

.app-status-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(34, 197, 94, 0.1);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-success);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}

.app-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.app-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.app-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}

.app-version {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: 2px 6px;
  background: var(--color-background);
  border-radius: var(--radius-sm);
}

.app-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary);
    color: white;
  }
}

.app-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  margin-top: auto;
}

.app-category {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.app-action-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--color-primary);
  color: white;

  &:hover {
    background: var(--color-primary-dark);
    transform: scale(1.05);
  }
}

.btn-secondary {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}
</style>
