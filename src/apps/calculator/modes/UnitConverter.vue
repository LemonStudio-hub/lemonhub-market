<template>
  <div class="converter-mode">
    <div class="converter-header">
      <h3 class="converter-title">📏 Unit Converter</h3>
    </div>

    <!-- Category Tabs -->
    <div class="unit-categories">
      <button
        v-for="cat in categories" :key="cat.id"
        class="unit-cat" :class="{ active: currentCat === cat.id }"
        @click="selectCategory(cat.id)"
      >
        <span class="unit-cat-icon">{{ cat.icon }}</span>
        <span class="unit-cat-label">{{ cat.label }}</span>
      </button>
    </div>

    <div class="converter-body">
      <div class="converter-field">
        <label class="field-label">From</label>
        <div class="field-row">
          <input v-model.number="value" type="number" class="converter-input" placeholder="Value" />
          <select v-model="fromUnit" class="converter-select">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

      <button class="swap-btn" @click="swap">⇅ Swap</button>

      <div class="converter-field">
        <label class="field-label">To</label>
        <div class="field-row">
          <input :value="result" class="converter-input converter-result" readonly />
          <select v-model="toUnit" class="converter-select">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

      <div class="rate-info">
        <p>1 {{ fromUnit }} = {{ conversionRate.toFixed(6) }} {{ toUnit }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const categories = [
  { id: 'length', icon: '📐', label: 'Length' },
  { id: 'weight', icon: '⚖️', label: 'Weight' },
  { id: 'temp', icon: '🌡️', label: 'Temp' },
  { id: 'area', icon: '📊', label: 'Area' },
  { id: 'volume', icon: '🧪', label: 'Volume' },
  { id: 'speed', icon: '🚀', label: 'Speed' },
  { id: 'data', icon: '💾', label: 'Data' },
  { id: 'time', icon: '⏱️', label: 'Time' },
]

// All units relative to base unit
const unitData: Record<string, { units: string[]; toBase: Record<string, number>; convert?: (v: number, from: string, to: string) => number }> = {
  length: {
    units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
    toBase: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  },
  weight: {
    units: ['Kilogram', 'Gram', 'Milligram', 'Ton', 'Pound', 'Ounce'],
    toBase: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Ton: 1000, Pound: 0.453592, Ounce: 0.0283495 },
  },
  temp: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    toBase: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 },
    convert: (v: number, from: string, to: string) => {
      let celsius: number
      if (from === 'Celsius') celsius = v
      else if (from === 'Fahrenheit') celsius = (v - 32) * 5/9
      else celsius = v - 273.15
      if (to === 'Celsius') return celsius
      if (to === 'Fahrenheit') return celsius * 9/5 + 32
      return celsius + 273.15
    },
  },
  area: {
    units: ['Sq Meter', 'Sq Kilometer', 'Sq Mile', 'Acre', 'Hectare', 'Sq Foot'],
    toBase: { 'Sq Meter': 1, 'Sq Kilometer': 1e6, 'Sq Mile': 2.59e6, Acre: 4046.86, Hectare: 10000, 'Sq Foot': 0.092903 },
  },
  volume: {
    units: ['Liter', 'Milliliter', 'Gallon (US)', 'Quart', 'Cup', 'Cubic Meter'],
    toBase: { Liter: 1, Milliliter: 0.001, 'Gallon (US)': 3.78541, Quart: 0.946353, Cup: 0.236588, 'Cubic Meter': 1000 },
  },
  speed: {
    units: ['m/s', 'km/h', 'mph', 'Knot'],
    toBase: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'Knot': 0.514444 },
  },
  data: {
    units: ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'],
    toBase: { Byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 },
  },
  time: {
    units: ['Second', 'Minute', 'Hour', 'Day', 'Week', 'Month', 'Year'],
    toBase: { Second: 1, Minute: 60, Hour: 3600, Day: 86400, Week: 604800, Month: 2592000, Year: 31536000 },
  },
}

const currentCat = ref('length')
const value = ref(1)
const fromUnit = ref('Meter')
const toUnit = ref('Kilometer')

const currentUnits = computed(() => unitData[currentCat.value].units)

function selectCategory(cat: string) {
  currentCat.value = cat
  const units = unitData[cat].units
  fromUnit.value = units[0]
  toUnit.value = units[1] || units[0]
  value.value = 1
}

const conversionRate = computed(() => {
  const data = unitData[currentCat.value]
  if (data.convert) return data.convert(1, fromUnit.value, toUnit.value)
  return data.toBase[toUnit.value] / data.toBase[fromUnit.value]
})

const result = computed(() => {
  const data = unitData[currentCat.value]
  if (data.convert) return data.convert(value.value, fromUnit.value, toUnit.value).toFixed(6)
  return (value.value * conversionRate.value).toFixed(6)
})

function swap() {
  const tmp = fromUnit.value; fromUnit.value = toUnit.value; toUnit.value = tmp
}

// Init
selectCategory('length')
</script>

<style scoped>
.converter-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); }
.converter-header { margin-bottom: var(--sp-md); }
.converter-title { font-size: 1rem; font-weight: 600; margin: 0; }

.unit-categories {
  display: flex; gap: var(--sp-xs); overflow-x: auto; padding-bottom: var(--sp-sm);
  scrollbar-width: none; margin-bottom: var(--sp-md);
}
.unit-categories::-webkit-scrollbar { display: none; }

.unit-cat {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--sp-sm) var(--sp-md); border-radius: var(--radius-md);
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  color: var(--app-text-secondary, var(--text-muted));
  font-size: 0.65rem; cursor: pointer; transition: all var(--ease-fast);
  white-space: nowrap; min-width: 52px;
}
.unit-cat-icon { font-size: 1rem; }
.unit-cat.active {
  background: var(--app-primary, var(--accent-primary));
  color: white; border-color: var(--app-primary, var(--accent-primary));
}

.converter-body { display: flex; flex-direction: column; gap: var(--sp-lg); flex: 1; }
.converter-field { display: flex; flex-direction: column; gap: var(--sp-xs); }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); text-transform: uppercase; }
.field-row { display: flex; gap: var(--sp-sm); }
.converter-input { flex: 1; padding: var(--sp-md); font-size: 1.1rem; font-weight: 600; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); font-family: var(--font-mono); outline: none; transition: border-color var(--ease-base); }
.converter-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.converter-result { background: var(--app-tertiary, var(--bg-tertiary)); color: var(--app-primary, var(--accent-primary)); }
.converter-select { padding: var(--sp-md); font-size: 0.85rem; min-width: 100px; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; cursor: pointer; }
.swap-btn { align-self: center; width: 44px; height: 44px; border-radius: 50%; background: var(--app-primary, var(--accent-primary)); color: white; font-size: 1.2rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--ease-fast); }
.swap-btn:hover { transform: scale(1.1); box-shadow: var(--shadow-md); }
.rate-info { padding: var(--sp-md); background: var(--app-surface-hover, var(--bg-hover)); border-radius: var(--radius-md); font-size: 0.82rem; color: var(--app-text-secondary, var(--text-secondary)); font-family: var(--font-mono); }
.rate-info p { margin: var(--sp-xs) 0; }
</style>
