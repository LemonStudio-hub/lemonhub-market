<template>
  <div class="games-app">
    <div class="games-mode-switcher">
      <button
        v-for="m in modes" :key="m.id"
        class="games-chip" :class="{ active: currentMode === m.id }"
        @click="currentMode = m.id"
      >
        <span class="chip-icon">{{ m.icon }}</span>
        <span class="chip-label mobile-hidden">{{ m.label }}</span>
      </button>
    </div>
    <div class="games-body">
      <SnakeGame v-if="currentMode === 'snake'" />
      <TetrisGame v-else-if="currentMode === 'tetris'" />
      <Game2048 v-else-if="currentMode === '2048'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SnakeGame from './modes/GameSnake.vue'
import TetrisGame from './modes/GameTetris.vue'
import Game2048 from './modes/Game2048.vue'

const modes = [
  { id: 'snake', label: 'Snake', icon: '🐍' },
  { id: 'tetris', label: 'Tetris', icon: '🧱' },
  { id: '2048', label: '2048', icon: '🔢' },
]

const currentMode = ref('snake')
</script>

<style scoped>
.games-app {
  display: flex; flex-direction: column; height: 100%;
  background: var(--app-background, var(--bg-tertiary)); overflow: hidden;
}

.games-mode-switcher {
  display: flex; gap: var(--sp-xs); padding: var(--sp-md);
  overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
}
.games-mode-switcher::-webkit-scrollbar { display: none; }

.games-chip {
  display: flex; align-items: center; gap: var(--sp-xs);
  padding: var(--sp-sm) var(--sp-md); border-radius: var(--radius-lg);
  font-size: 0.78rem; font-weight: 500; white-space: nowrap;
  background: var(--app-surface, var(--bg-primary));
  color: var(--app-text-secondary, var(--text-muted));
  border: 1px solid var(--app-border, var(--border-primary));
  transition: all var(--ease-fast); cursor: pointer;
}
.games-chip:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-text, var(--text-primary)); }
.games-chip.active {
  background: var(--app-primary, var(--accent-primary)); color: white;
  border-color: var(--app-primary, var(--accent-primary)); box-shadow: var(--shadow-md);
}

.games-body { flex: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }

@media (max-width: 480px) {
  .chip-label.mobile-hidden { display: none; }
  .games-chip { padding: var(--sp-sm); }
}
</style>
