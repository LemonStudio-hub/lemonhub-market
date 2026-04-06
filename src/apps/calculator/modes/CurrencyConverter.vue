<template>
  <div class="converter-mode">
    <div class="converter-header">
      <h3 class="converter-title">💱 Currency Converter</h3>
      <span class="converter-updated">Rates updated: Apr 2026</span>
    </div>

    <div class="converter-body">
      <!-- From -->
      <div class="converter-field">
        <label class="field-label">From</label>
        <div class="field-row">
          <input v-model.number="amount" type="number" class="converter-input" min="0" placeholder="Amount" />
          <select v-model="fromCurrency" class="converter-select">
            <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
          </select>
        </div>
      </div>

      <!-- Swap Button -->
      <button class="swap-btn" @click="swapCurrencies">⇅ Swap</button>

      <!-- To -->
      <div class="converter-field">
        <label class="field-label">To</label>
        <div class="field-row">
          <input :value="convertedAmount" type="text" class="converter-input converter-result" readonly />
          <select v-model="toCurrency" class="converter-select">
            <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
          </select>
        </div>
      </div>

      <!-- Rate Info -->
      <div class="rate-info">
        <p>1 {{ fromCurrency }} = {{ rate.toFixed(4) }} {{ toCurrency }}</p>
        <p>1 {{ toCurrency }} = {{ (1/rate).toFixed(4) }} {{ fromCurrency }}</p>
      </div>

      <!-- Quick Amount Buttons -->
      <div class="quick-amounts">
        <button v-for="a in [100, 1000, 5000, 10000]" :key="a" class="quick-btn" @click="amount = a">
          {{ a.toLocaleString() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Currency { code: string; flag: string; rate: number } // rate relative to USD

const currencies: Currency[] = [
  { code: 'USD', flag: '🇺🇸', rate: 1 },
  { code: 'EUR', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', flag: '🇬🇧', rate: 0.79 },
  { code: 'JPY', flag: '🇯🇵', rate: 149.50 },
  { code: 'CNY', flag: '🇨🇳', rate: 7.24 },
  { code: 'KRW', flag: '🇰🇷', rate: 1320.0 },
  { code: 'HKD', flag: '🇭🇰', rate: 7.82 },
  { code: 'SGD', flag: '🇸🇬', rate: 1.34 },
  { code: 'INR', flag: '🇮🇳', rate: 83.12 },
  { code: 'THB', flag: '🇹🇭', rate: 35.50 },
  { code: 'AUD', flag: '🇦🇺', rate: 1.53 },
  { code: 'CAD', flag: '🇨🇦', rate: 1.36 },
]

const amount = ref(1000)
const fromCurrency = ref('USD')
const toCurrency = ref('CNY')

function getRate(from: string, to: string): number {
  const fromRate = currencies.find(c => c.code === from)!.rate
  const toRate = currencies.find(c => c.code === to)!.rate
  return toRate / fromRate
}

const rate = computed(() => getRate(fromCurrency.value, toCurrency.value))
const convertedAmount = computed(() => {
  if (!amount.value) return '0'
  return (amount.value * rate.value).toFixed(2)
})

function swapCurrencies() {
  const tmp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = tmp
}
</script>

<style scoped>
.converter-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); }

.converter-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--sp-xl);
}

.converter-title { font-size: 1rem; font-weight: 600; margin: 0; }
.converter-updated { font-size: 0.7rem; color: var(--app-text-muted, var(--text-muted)); }

.converter-body { display: flex; flex-direction: column; gap: var(--sp-lg); flex: 1; }

.converter-field { display: flex; flex-direction: column; gap: var(--sp-xs); }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); text-transform: uppercase; letter-spacing: 0.03em; }

.field-row { display: flex; gap: var(--sp-sm); }

.converter-input {
  flex: 1; padding: var(--sp-md); font-size: 1.1rem; font-weight: 600;
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md); color: var(--app-text, var(--text-primary));
  font-family: var(--font-mono); outline: none;
  transition: border-color var(--ease-base);
}
.converter-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.converter-result { background: var(--app-tertiary, var(--bg-tertiary)); color: var(--app-primary, var(--accent-primary)); }

.converter-select {
  padding: var(--sp-md); font-size: 0.9rem; min-width: 110px;
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md); color: var(--app-text, var(--text-primary));
  outline: none; cursor: pointer;
}

.swap-btn {
  align-self: center; width: 44px; height: 44px; border-radius: 50%;
  background: var(--app-primary, var(--accent-primary)); color: white;
  font-size: 1.2rem; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--ease-fast);
}
.swap-btn:hover { transform: scale(1.1); box-shadow: var(--shadow-md); }

.rate-info {
  padding: var(--sp-md); background: var(--app-surface-hover, var(--bg-hover));
  border-radius: var(--radius-md); font-size: 0.82rem;
  color: var(--app-text-secondary, var(--text-secondary));
  font-family: var(--font-mono);
}
.rate-info p { margin: var(--sp-xs) 0; }

.quick-amounts { display: flex; gap: var(--sp-sm); flex-wrap: wrap; }
.quick-btn {
  flex: 1; min-width: 60px; padding: var(--sp-sm); font-size: 0.8rem; font-weight: 500;
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md); color: var(--app-text, var(--text-primary));
  cursor: pointer; transition: all var(--ease-fast);
}
.quick-btn:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
</style>
