<template>
  <div class="clock-app">
    <div class="clock-mode-switcher">
      <button
        v-for="m in modes" :key="m.id"
        class="clock-chip" :class="{ active: currentMode === m.id }"
        @click="currentMode = m.id"
      >
        <span class="chip-icon">{{ m.icon }}</span>
        <span class="chip-label mobile-hidden">{{ m.label }}</span>
      </button>
    </div>
    <div class="clock-body">
      <Pomodoro v-if="currentMode === 'pomodoro'" />
      <Countdown v-else-if="currentMode === 'countdown'" />
      <Stopwatch v-else-if="currentMode === 'stopwatch'" />
      <Alarm v-else-if="currentMode === 'alarm'" />
      <WorldClock v-else-if="currentMode === 'world'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Pomodoro from './modes/ClockPomodoro.vue'
import Countdown from './modes/ClockCountdown.vue'
import Stopwatch from './modes/ClockStopwatch.vue'
import Alarm from './modes/ClockAlarm.vue'
import WorldClock from './modes/ClockWorldClock.vue'

const modes = [
  { id: 'pomodoro', label: 'Pomodoro', icon: '🍅' },
  { id: 'countdown', label: 'Countdown', icon: '⏳' },
  { id: 'stopwatch', label: 'Stopwatch', icon: '⏱️' },
  { id: 'alarm', label: 'Alarm', icon: '⏰' },
  { id: 'world', label: 'World', icon: '🌍' },
]

const currentMode = ref('pomodoro')
</script>

<style scoped>
.clock-app {
  display: flex; flex-direction: column; height: 100%;
  background: var(--app-background, var(--bg-tertiary)); overflow: hidden;
}

.clock-mode-switcher {
  display: flex; gap: var(--sp-xs); padding: var(--sp-md);
  overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
}
.clock-mode-switcher::-webkit-scrollbar { display: none; }

.clock-chip {
  display: flex; align-items: center; gap: var(--sp-xs);
  padding: var(--sp-sm) var(--sp-md); border-radius: var(--radius-lg);
  font-size: 0.78rem; font-weight: 500; white-space: nowrap;
  background: var(--app-surface, var(--bg-primary));
  color: var(--app-text-secondary, var(--text-muted));
  border: 1px solid var(--app-border, var(--border-primary));
  transition: all var(--ease-fast); cursor: pointer;
}
.clock-chip:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-text, var(--text-primary)); }
.clock-chip.active {
  background: var(--app-primary, var(--accent-primary)); color: white;
  border-color: var(--app-primary, var(--accent-primary)); box-shadow: var(--shadow-md);
}

.clock-body {
  flex: 1; overflow-y: auto; overflow-x: hidden;
}

@media (max-width: 480px) {
  .chip-label.mobile-hidden { display: none; }
  .clock-chip { padding: var(--sp-sm); }
}
</style>
