<template>
  <div class="calendar-app">
    <div class="cal-mode-switcher">
      <button v-for="m in modes" :key="m.id" class="cal-chip" :class="{ active: currentMode === m.id }" @click="currentMode = m.id">
        <span class="chip-icon">{{ m.icon }}</span>
        <span class="chip-label mobile-hidden">{{ m.label }}</span>
      </button>
    </div>
    <div class="cal-body">
      <MonthView v-if="currentMode === 'month'" @open-todos="currentMode = 'todos'" />
      <TodoList v-else-if="currentMode === 'todos'" />
      <DateCalc v-else-if="currentMode === 'datecalc'" />
      <Holidays v-else-if="currentMode === 'holidays'" />
      <Schedule v-else-if="currentMode === 'schedule'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MonthView from './modes/CalMonthView.vue'
import TodoList from './modes/CalTodoList.vue'
import DateCalc from './modes/CalDateCalc.vue'
import Holidays from './modes/CalHolidays.vue'
import Schedule from './modes/CalSchedule.vue'

const modes = [
  { id: 'month', label: 'Month', icon: '📅' },
  { id: 'todos', label: 'Todos', icon: '✅' },
  { id: 'datecalc', label: 'Date Calc', icon: '🔢' },
  { id: 'holidays', label: 'Holidays', icon: '🎉' },
  { id: 'schedule', label: 'Schedule', icon: '📋' },
]
const currentMode = ref('month')
</script>

<style scoped>
.calendar-app { display: flex; flex-direction: column; height: 100%; background: var(--app-background, var(--bg-tertiary)); overflow: hidden; }
.cal-mode-switcher { display: flex; gap: var(--sp-xs); padding: var(--sp-md); overflow-x: auto; scrollbar-width: none; flex-shrink: 0; }
.cal-mode-switcher::-webkit-scrollbar { display: none; }
.cal-chip { display: flex; align-items: center; gap: var(--sp-xs); padding: var(--sp-sm) var(--sp-md); border-radius: var(--radius-lg); font-size: 0.78rem; font-weight: 500; white-space: nowrap; background: var(--app-surface, var(--bg-primary)); color: var(--app-text-secondary, var(--text-muted)); border: 1px solid var(--app-border, var(--border-primary)); transition: all var(--ease-fast); cursor: pointer; }
.cal-chip:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-text, var(--text-primary)); }
.cal-chip.active { background: var(--app-primary, var(--accent-primary)); color: white; border-color: var(--app-primary, var(--accent-primary)); box-shadow: var(--shadow-md); }
.cal-body { flex: 1; overflow-y: auto; overflow-x: hidden; }
@media (max-width: 480px) { .chip-label.mobile-hidden { display: none; } .cal-chip { padding: var(--sp-sm); } }
</style>
