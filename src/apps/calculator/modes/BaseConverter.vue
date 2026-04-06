<template>
  <div class="converter-mode">
    <div class="converter-header">
      <h3 class="converter-title">🔣 Base Converter</h3>
    </div>

    <div class="converter-body">
      <div class="converter-field">
        <label class="field-label">Input Value</label>
        <div class="field-row">
          <input v-model="inputValue" class="converter-input" placeholder="Enter value" />
          <select v-model="inputBase" class="converter-select" @change="convert">
            <option value="10">DEC (10)</option>
            <option value="2">BIN (2)</option>
            <option value="8">OCT (8)</option>
            <option value="16">HEX (16)</option>
          </select>
        </div>
      </div>

      <div class="base-results">
        <div v-for="b in bases" :key="b.base" class="base-result" :class="{ active: b.base === inputBase }">
          <span class="base-label">{{ b.label }}</span>
          <code class="base-value">{{ b.value }}</code>
          <button class="copy-btn" @click="copyValue(b.value)" title="Copy">📋</button>
        </div>
      </div>

      <!-- Bit Visual -->
      <div class="bit-visual">
        <span class="bit-label">Binary (8-bit)</span>
        <div class="bit-bar">
          <span v-for="(bit, i) in bits" :key="i" class="bit" :class="{ on: bit === '1' }">{{ bit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const inputValue = ref('42')
const inputBase = ref('10')

const decimalValue = computed(() => {
  try { return parseInt(inputValue.value, parseInt(inputBase.value)) } catch { return NaN }
})

const bases = [
  { base: '10', label: 'Decimal', get value() { return isNaN(decimalValue.value) ? '—' : decimalValue.value.toString(10) } },
  { base: '2', label: 'Binary', get value() { return isNaN(decimalValue.value) ? '—' : decimalValue.value.toString(2).toUpperCase() } },
  { base: '8', label: 'Octal', get value() { return isNaN(decimalValue.value) ? '—' : decimalValue.value.toString(8).toUpperCase() } },
  { base: '16', label: 'Hex', get value() { return isNaN(decimalValue.value) ? '—' : decimalValue.value.toString(16).toUpperCase() } },
]

const bits = computed(() => {
  if (isNaN(decimalValue.value)) return '00000000'
  return (decimalValue.value & 0xFF).toString(2).padStart(8, '0')
})

function convert() { /* reactive via computed */ }

function copyValue(val: string) {
  navigator.clipboard?.writeText(val)
}
</script>

<style scoped>
.converter-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); }
.converter-header { margin-bottom: var(--sp-md); }
.converter-title { font-size: 1rem; font-weight: 600; margin: 0; }
.converter-body { display: flex; flex-direction: column; gap: var(--sp-lg); flex: 1; }
.converter-field { display: flex; flex-direction: column; gap: var(--sp-xs); }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); text-transform: uppercase; }
.field-row { display: flex; gap: var(--sp-sm); }
.converter-input { flex: 1; padding: var(--sp-md); font-size: 1.1rem; font-weight: 600; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); font-family: var(--font-mono); outline: none; transition: border-color var(--ease-base); text-transform: uppercase; }
.converter-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.converter-select { padding: var(--sp-md); font-size: 0.85rem; min-width: 110px; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; cursor: pointer; font-family: var(--font-mono); }

.base-results { display: flex; flex-direction: column; gap: var(--sp-sm); }
.base-result {
  display: flex; align-items: center; gap: var(--sp-md);
  padding: var(--sp-md); background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md); transition: all var(--ease-fast);
}
.base-result.active { border-color: var(--app-primary, var(--accent-primary)); background: var(--app-surface-hover, var(--bg-hover)); }
.base-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); min-width: 55px; }
.base-value { flex: 1; font-size: 1rem; font-family: var(--font-mono); font-weight: 600; color: var(--app-text, var(--text-primary)); word-break: break-all; }
.copy-btn { background: none; border: none; cursor: pointer; font-size: 0.9rem; opacity: 0.5; transition: opacity var(--ease-fast); }
.copy-btn:hover { opacity: 1; }

.bit-visual { padding: var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); }
.bit-label { display: block; font-size: 0.7rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); margin-bottom: var(--sp-sm); text-transform: uppercase; }
.bit-bar { display: flex; gap: 3px; }
.bit {
  flex: 1; height: 36px; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600;
  border-radius: var(--radius-sm); background: var(--app-tertiary, var(--bg-tertiary));
  color: var(--app-text-muted, var(--text-muted)); transition: all var(--ease-fast);
}
.bit.on { background: var(--app-primary, var(--accent-primary)); color: white; }
</style>
