<template>
  <div class="calculator-app">
    <!-- Mode Switcher -->
    <div class="calc-mode-switcher">
      <button
        v-for="mode in modes"
        :key="mode.id"
        class="mode-chip"
        :class="{ active: currentMode === mode.id }"
        @click="currentMode = mode.id"
      >
        <span class="mode-icon">{{ mode.icon }}</span>
        <span class="mode-label mobile-hidden">{{ mode.label }}</span>
      </button>
    </div>

    <!-- Basic Calculator -->
    <BasicCalc v-if="currentMode === 'basic'" />
    <CurrencyConverter v-else-if="currentMode === 'currency'" />
    <UnitConverter v-else-if="currentMode === 'unit'" />
    <BaseConverter v-else-if="currentMode === 'base'" />
    <LoanCalculator v-else-if="currentMode === 'loan'" />
    <AgeCalculator v-else-if="currentMode === 'age'" />
    <DateCalculator v-else-if="currentMode === 'date'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicCalc from './modes/BasicCalc.vue'
import CurrencyConverter from './modes/CurrencyConverter.vue'
import UnitConverter from './modes/UnitConverter.vue'
import BaseConverter from './modes/BaseConverter.vue'
import LoanCalculator from './modes/LoanCalculator.vue'
import AgeCalculator from './modes/AgeCalculator.vue'
import DateCalculator from './modes/DateCalculator.vue'

const modes = [
  { id: 'basic', label: 'Calc', icon: '🔢' },
  { id: 'currency', label: 'Currency', icon: '💱' },
  { id: 'unit', label: 'Unit', icon: '📏' },
  { id: 'base', label: 'Base', icon: '🔣' },
  { id: 'loan', label: 'Loan', icon: '🏦' },
  { id: 'age', label: 'Age', icon: '🎂' },
  { id: 'date', label: 'Date', icon: '📅' },
]

const currentMode = ref('basic')
</script>

<style scoped>
.calculator-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--app-background, var(--bg-tertiary));
  overflow: hidden;
}

.calc-mode-switcher {
  display: flex;
  gap: var(--sp-xs);
  padding: var(--sp-md);
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}

.calc-mode-switcher::-webkit-scrollbar { display: none; }

.mode-chip {
  display: flex;
  align-items: center;
  gap: var(--sp-xs);
  padding: var(--sp-sm) var(--sp-md);
  border-radius: var(--radius-lg);
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
  background: var(--app-surface, var(--bg-primary));
  color: var(--app-text-secondary, var(--text-muted));
  border: 1px solid var(--app-border, var(--border-primary));
  transition: all var(--ease-fast);
  cursor: pointer;
}

.mode-chip:hover {
  border-color: var(--app-primary, var(--accent-primary));
  color: var(--app-text, var(--text-primary));
}

.mode-chip.active {
  background: var(--app-primary, var(--accent-primary));
  color: white;
  border-color: var(--app-primary, var(--accent-primary));
  box-shadow: var(--shadow-md);
}

.mode-icon { font-size: 1rem; }

@media (max-width: 480px) {
  .mode-label.mobile-hidden { display: none; }
  .mode-chip { padding: var(--sp-sm); }
}
</style>
