<template>
  <div class="calculator-app">
    <div class="calc-display">
      <div class="calc-expression">{{ expression || '0' }}</div>
      <div class="calc-result">{{ result }}</div>
    </div>
    <div class="calc-grid">
      <button
        v-for="btn in buttons"
        :key="btn.label"
        class="calc-btn"
        :class="[
          btn.type === 'operator' && 'calc-btn-op',
          btn.type === 'equals' && 'calc-btn-eq',
          btn.type === 'clear' && 'calc-btn-clear',
          btn.type === 'special' && 'calc-btn-special',
        ]"
        @click="handleBtn(btn)"
      >
        {{ btn.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const expression = ref('')
const currentInput = ref('')
const lastResult = ref('')

interface CalcBtn {
  label: string
  type: 'number' | 'operator' | 'equals' | 'clear' | 'special'
  value: string
}

const buttons: CalcBtn[] = [
  { label: 'C', type: 'clear', value: 'clear' },
  { label: '±', type: 'special', value: 'negate' },
  { label: '%', type: 'special', value: 'percent' },
  { label: '÷', type: 'operator', value: '/' },
  { label: '7', type: 'number', value: '7' },
  { label: '8', type: 'number', value: '8' },
  { label: '9', type: 'number', value: '9' },
  { label: '×', type: 'operator', value: '*' },
  { label: '4', type: 'number', value: '4' },
  { label: '5', type: 'number', value: '5' },
  { label: '6', type: 'number', value: '6' },
  { label: '−', type: 'operator', value: '-' },
  { label: '1', type: 'number', value: '1' },
  { label: '2', type: 'number', value: '2' },
  { label: '3', type: 'number', value: '3' },
  { label: '+', type: 'operator', value: '+' },
  { label: '0', type: 'number', value: '0' },
  { label: '.', type: 'number', value: '.' },
  { label: '⌫', type: 'special', value: 'backspace' },
  { label: '=', type: 'equals', value: '=' },
]

const result = computed(() => lastResult.value || expression.value || '0')

function handleBtn(btn: CalcBtn) {
  switch (btn.type) {
    case 'clear':
      expression.value = ''
      currentInput.value = ''
      lastResult.value = ''
      break
    case 'number':
      currentInput.value += btn.value
      expression.value += btn.value
      break
    case 'operator':
      expression.value += ` ${btn.value} `
      break
    case 'special':
      if (btn.value === 'negate' && currentInput.value) {
        currentInput.value = String(-parseFloat(currentInput.value))
        expression.value = currentInput.value
      } else if (btn.value === 'percent' && currentInput.value) {
        currentInput.value = String(parseFloat(currentInput.value) / 100)
        expression.value = currentInput.value
      } else if (btn.value === 'backspace') {
        expression.value = expression.value.slice(0, -1)
        currentInput.value = currentInput.value.slice(0, -1)
      }
      break
    case 'equals':
      try {
        const evalExpr = expression.value
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-')
        // Safe eval using Function constructor
        const res = new Function(`return (${evalExpr})`)()
        lastResult.value = formatNumber(res)
        expression.value = lastResult.value
        currentInput.value = lastResult.value
      } catch {
        lastResult.value = 'Error'
      }
      break
  }
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  return parseFloat(n.toFixed(8)).toString()
}
</script>

<style scoped>
.calculator-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--app-background, var(--bg-tertiary));
}

.calc-display {
  padding: var(--sp-xl) var(--sp-xl) var(--sp-lg);
  text-align: right;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.calc-expression {
  font-size: 1rem;
  color: var(--app-text-secondary, var(--text-muted));
  font-family: var(--font-mono);
  min-height: 1.4em;
  word-break: break-all;
}

.calc-result {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--app-text, var(--text-primary));
  font-family: var(--font-mono);
  word-break: break-all;
}

.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-sm);
  padding: 0 var(--sp-md) var(--sp-md);
}

.calc-btn {
  height: 56px;
  border-radius: var(--radius-lg);
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: var(--app-surface, var(--bg-primary));
  color: var(--app-text, var(--text-primary));
  transition: all var(--ease-fast);
  font-family: var(--font-sans);
}

.calc-btn:hover {
  background: var(--app-surface-hover, var(--bg-hover));
  transform: scale(1.02);
}

.calc-btn:active {
  transform: scale(0.98);
}

.calc-btn-op {
  background: var(--app-surface-hover, var(--bg-hover));
  color: var(--app-primary, var(--accent-primary));
  font-size: 1.4rem;
}

.calc-btn-op:hover {
  background: var(--app-primary, var(--accent-primary));
  color: white;
}

.calc-btn-eq {
  background: var(--app-primary, var(--accent-primary));
  color: white;
  font-size: 1.4rem;
}

.calc-btn-eq:hover {
  background: var(--app-primary-dark, var(--accent-primary-dark));
  box-shadow: var(--shadow-md);
}

.calc-btn-clear {
  color: var(--app-error, var(--accent-error));
  font-weight: 600;
}

.calc-btn-special {
  color: var(--app-text-secondary, var(--text-secondary));
  font-weight: 600;
}
</style>
