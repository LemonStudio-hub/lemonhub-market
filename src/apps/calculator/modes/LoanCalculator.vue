<template>
  <div class="converter-mode">
    <div class="converter-header">
      <h3 class="converter-title">🏦 Loan Calculator</h3>
    </div>

    <div class="converter-body">
      <!-- Inputs -->
      <div class="loan-inputs">
        <div class="input-group">
          <label class="input-label">Loan Amount</label>
          <div class="input-with-suffix">
            <input v-model.number="principal" type="number" class="converter-input" min="0" step="1000" />
            <span class="input-suffix">$</span>
          </div>
          <input v-model.number="principal" type="range" class="loan-range" min="10000" max="1000000" step="10000" />
        </div>

        <div class="input-group">
          <label class="input-label">Annual Interest Rate</label>
          <div class="input-with-suffix">
            <input v-model.number="rate" type="number" class="converter-input" min="0" max="30" step="0.1" />
            <span class="input-suffix">%</span>
          </div>
          <input v-model.number="rate" type="range" class="loan-range" min="0.5" max="20" step="0.1" />
        </div>

        <div class="input-group">
          <label class="input-label">Loan Term</label>
          <div class="input-with-suffix">
            <input v-model.number="years" type="number" class="converter-input" min="1" max="30" />
            <span class="input-suffix">Years</span>
          </div>
          <input v-model.number="years" type="range" class="loan-range" min="1" max="30" step="1" />
        </div>
      </div>

      <!-- Results -->
      <div class="loan-results">
        <div class="result-main">
          <span class="result-label">Monthly Payment</span>
          <span class="result-value main">${{ monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        </div>

        <div class="result-row">
          <span class="result-label">Total Payment</span>
          <span class="result-value">${{ totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        </div>

        <div class="result-row">
          <span class="result-label">Total Interest</span>
          <span class="result-value interest">${{ totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        </div>

        <!-- Ratio Bar -->
        <div class="ratio-bar">
          <div class="ratio-principal" :style="{ width: principalPct + '%' }" />
          <div class="ratio-interest" :style="{ width: interestPct + '%' }" />
        </div>
        <div class="ratio-legend">
          <span><span class="dot principal" /> Principal {{ principalPct.toFixed(1) }}%</span>
          <span><span class="dot interest" /> Interest {{ interestPct.toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const principal = ref(300000)
const rate = ref(4.5)
const years = ref(20)

const monthlyRate = computed(() => rate.value / 100 / 12)
const numPayments = computed(() => years.value * 12)

const monthlyPayment = computed(() => {
  const r = monthlyRate.value
  const n = numPayments.value
  if (r === 0) return principal.value / n
  return principal.value * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
})

const totalPayment = computed(() => monthlyPayment.value * numPayments.value)
const totalInterest = computed(() => totalPayment.value - principal.value)

const principalPct = computed(() => (principal.value / totalPayment.value) * 100)
const interestPct = computed(() => (totalInterest.value / totalPayment.value) * 100)
</script>

<style scoped>
.converter-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); }
.converter-header { margin-bottom: var(--sp-md); }
.converter-title { font-size: 1rem; font-weight: 600; margin: 0; }
.converter-body { display: flex; flex-direction: column; gap: var(--sp-lg); flex: 1; }

.loan-inputs { display: flex; flex-direction: column; gap: var(--sp-md); }
.input-group { display: flex; flex-direction: column; gap: var(--sp-xs); }
.input-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); text-transform: uppercase; }
.input-with-suffix { display: flex; align-items: center; border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); overflow: hidden; background: var(--app-surface, var(--bg-primary)); }
.input-with-suffix .converter-input { border: none; flex: 1; }
.input-with-suffix .converter-input:focus { border: none; box-shadow: none; }
.input-suffix { padding: var(--sp-md); font-size: 0.85rem; color: var(--app-text-secondary, var(--text-muted)); background: var(--app-tertiary, var(--bg-tertiary)); border-left: 1px solid var(--app-border, var(--border-primary)); min-width: 40px; text-align: center; }
.converter-input { padding: var(--sp-md); font-size: 1rem; font-weight: 600; background: var(--app-surface, var(--bg-primary)); color: var(--app-text, var(--text-primary)); font-family: var(--font-mono); outline: none; width: 100%; }
.loan-range { width: 100%; margin-top: var(--sp-xs); accent-color: var(--app-primary, var(--accent-primary)); }

.loan-results { display: flex; flex-direction: column; gap: var(--sp-md); }
.result-main { text-align: center; padding: var(--sp-lg); background: var(--app-primary, var(--accent-primary)); border-radius: var(--radius-lg); color: white; }
.result-main .result-label { font-size: 0.8rem; opacity: 0.8; }
.result-main .result-value { display: block; font-size: 1.8rem; font-weight: 700; font-family: var(--font-mono); }

.result-row { display: flex; justify-content: space-between; align-items: center; padding: var(--sp-sm) 0; border-bottom: 1px solid var(--app-border, var(--border-primary)); }
.result-label { font-size: 0.85rem; color: var(--app-text-secondary, var(--text-muted)); }
.result-value { font-size: 1rem; font-weight: 600; font-family: var(--font-mono); }
.result-value.interest { color: var(--app-warning, #f59e0b); }

.ratio-bar { height: 12px; border-radius: 6px; overflow: hidden; display: flex; background: var(--app-border, var(--border-primary)); }
.ratio-principal { background: var(--app-primary, var(--accent-primary)); transition: width var(--ease-slow); }
.ratio-interest { background: var(--app-warning, #f59e0b); transition: width var(--ease-slow); }
.ratio-legend { display: flex; justify-content: center; gap: var(--sp-lg); font-size: 0.75rem; color: var(--app-text-secondary, var(--text-muted)); }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.dot.principal { background: var(--app-primary, var(--accent-primary)); }
.dot.interest { background: var(--app-warning, #f59e0b); }
</style>
