<template>
  <div class="app-layout">
    <AppSidebar />
    
    <main class="main-content">
      <AppHeader />
      
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  transition: margin-left var(--transition-slow);
}

@media (max-width: 1023px) {
  .main-content {
    margin-left: 0;
  }
}

.content-wrapper {
  flex: 1;
  padding: var(--spacing-xl);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: var(--spacing-md);
  }
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
