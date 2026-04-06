<template>
  <div class="converter-mode">
    <div class="converter-header">
      <h3 class="converter-title">📅 Date Calculator</h3>
    </div>

    <!-- Tabs -->
    <div class="date-tabs">
      <button class="date-tab" :class="{ active: tab === 'diff' }" @click="tab = 'diff'">Difference</button>
      <button class="date-tab" :class="{ active: tab === 'addsub' }" @click="tab = 'addsub'">Add / Subtract</button>
    </div>

    <div class="converter-body">
      <!-- Date Difference -->
      <template v-if="tab === 'diff'">
        <div class="converter-field">
          <label class="field-label">Start Date</label>
          <input v-model="startDate" type="date" class="converter-input date-input" />
        </div>
        <div class="converter-field">
          <label class="field-label">End Date</label>
          <input v-model="endDate" type="date" class="converter-input date-input" />
        </div>

        <div v-if="diffResult" class="diff-results">
          <div class="diff-main">
            <span class="diff-number">{{ diffResult.totalDays }}</span>
            <span class="diff-label">Total Days</span>
          </div>
          <div class="diff-details">
            <div class="diff-card"><span class="diff-card-num">{{ diffResult.years }}</span><span class="diff-card-label">Years</span></div>
            <div class="diff-card"><span class="diff-card-num">{{ diffResult.months }}</span><span class="diff-card-label">Months</span></div>
            <div class="diff-card"><span class="diff-card-num">{{ diffResult.weeks }}</span><span class="diff-card-label">Weeks</span></div>
            <div class="diff-card"><span class="diff-card-num">{{ diffResult.hours.toLocaleString() }}</span><span class="diff-card-label">Hours</span></div>
          </div>
          <div class="diff-extra">
            <p>📆 {{ diffResult.businessDays }} business days (Mon-Fri)</p>
            <p>🔢 {{ diffResult.weekends }} weekend days</p>
          </div>
        </div>
      </template>

      <!-- Add/Subtract -->
      <template v-else>
        <div class="converter-field">
          <label class="field-label">Start Date</label>
          <input v-model="baseDate" type="date" class="converter-input date-input" />
        </div>

        <div class="addsub-controls">
          <div class="addsub-row">
            <button class="addsub-btn" @click="addVal('years', 1)">+1Y</button>
            <button class="addsub-btn" @click="addVal('years', -1)">-1Y</button>
          </div>
          <div class="addsub-row">
            <button class="addsub-btn" @click="addVal('months', 1)">+1M</button>
            <button class="addsub-btn" @click="addVal('months', -1)">-1M</button>
          </div>
          <div class="addsub-row">
            <button class="addsub-btn" @click="addVal('weeks', 1)">+1W</button>
            <button class="addsub-btn" @click="addVal('weeks', -1)">-1W</button>
          </div>
          <div class="addsub-row">
            <button class="addsub-btn" @click="addVal('days', 1)">+1D</button>
            <button class="addsub-btn" @click="addVal('days', -1)">-1D</button>
          </div>
          <div class="addsub-custom">
            <input v-model.number="customAmount" type="number" class="addsub-input" min="0" placeholder="Amount" />
            <select v-model="customUnit" class="converter-select">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
            <button class="app-btn app-btn-primary" @click="addCustom(1)">Add</button>
            <button class="app-btn app-btn-secondary" @click="addCustom(-1)">Subtract</button>
          </div>
        </div>

        <div v-if="addsubResult" class="addsub-result">
          <span class="result-label">Result</span>
          <span class="result-date">{{ addsubResult.formatted }}</span>
          <span class="result-day">{{ addsubResult.dayOfWeek }}</span>
          <span class="result-diff">({{ addsubResult.daysFromBase }} days from start)</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const tab = ref<'diff' | 'addsub'>('diff')

// Difference mode
const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0])

const diffResult = computed(() => {
  const s = new Date(startDate.value + 'T00:00:00')
  const e = new Date(endDate.value + 'T00:00:00')
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null

  const diffMs = Math.abs(e.getTime() - s.getTime())
  const totalDays = Math.floor(diffMs / 86400000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = Math.floor(diffMs / 3600000)

  // Years and months
  let years = e.getFullYear() - s.getFullYear()
  let months = e.getMonth() - s.getMonth()
  if (e.getDate() < s.getDate()) months--
  if (months < 0) { years--; months += 12 }
  if (e < s) { years = -years; months = -(months + years * 12) }

  // Business days and weekends
  let businessDays = 0; let weekends = 0
  const cur = new Date(Math.min(s.getTime(), e.getTime()))
  const end = new Date(Math.max(s.getTime(), e.getTime()))
  while (cur < end) {
    const day = cur.getDay()
    if (day === 0 || day === 6) weekends++
    else businessDays++
    cur.setDate(cur.getDate() + 1)
  }

  return { years: Math.abs(years), months: Math.abs(months) + Math.abs(years) * 12, weeks: totalWeeks, totalDays, hours: totalHours, businessDays, weekends }
})

// Add/Sub mode
const baseDate = ref(new Date().toISOString().split('T')[0])
const currentDate = reactive({ years: 0, months: 0, weeks: 0, days: 0 })
const customAmount = ref(0)
const customUnit = ref<'days' | 'weeks' | 'months' | 'years'>('days')

function addVal(unit: keyof typeof currentDate, amount: number) {
  currentDate[unit] += amount
}

function addCustom(sign: number) {
  if (!customAmount.value) return
  const unit = customUnit.value as keyof typeof currentDate
  currentDate[unit] += customAmount.value * sign
}

const addsubResult = computed(() => {
  const base = new Date(baseDate.value + 'T00:00:00')
  if (isNaN(base.getTime())) return null

  const result = new Date(base)
  result.setFullYear(result.getFullYear() + currentDate.years)
  result.setMonth(result.getMonth() + currentDate.months)
  result.setDate(result.getDate() + currentDate.weeks * 7 + currentDate.days)

  const daysFromBase = Math.round((result.getTime() - base.getTime()) / 86400000)

  return {
    formatted: result.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }),
    dayOfWeek: result.toLocaleDateString('en', { weekday: 'long' }),
    daysFromBase,
  }
})
</script>

<style scoped>
.converter-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); }
.converter-header { margin-bottom: var(--sp-md); }
.converter-title { font-size: 1rem; font-weight: 600; margin: 0; }
.converter-body { display: flex; flex-direction: column; gap: var(--sp-lg); flex: 1; overflow-y: auto; }
.converter-field { display: flex; flex-direction: column; gap: var(--sp-xs); }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); text-transform: uppercase; }
.date-input { font-size: 1rem; padding: var(--sp-md); }
.converter-select { padding: var(--sp-md); font-size: 0.85rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; cursor: pointer; }

.date-tabs { display: flex; gap: var(--sp-xs); margin-bottom: var(--sp-md); }
.date-tab { flex: 1; padding: var(--sp-sm); font-size: 0.85rem; font-weight: 500; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text-secondary, var(--text-muted)); cursor: pointer; transition: all var(--ease-fast); }
.date-tab.active { background: var(--app-primary, var(--accent-primary)); color: white; border-color: var(--app-primary, var(--accent-primary)); }

.diff-results { display: flex; flex-direction: column; gap: var(--sp-md); }
.diff-main { text-align: center; padding: var(--sp-xl); background: var(--app-primary, var(--accent-primary)); border-radius: var(--radius-lg); color: white; }
.diff-number { display: block; font-size: 2.5rem; font-weight: 700; font-family: var(--font-mono); }
.diff-label { font-size: 0.9rem; opacity: 0.85; }

.diff-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-sm); }
.diff-card { display: flex; flex-direction: column; align-items: center; padding: var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); }
.diff-card-num { font-size: 1.1rem; font-weight: 700; font-family: var(--font-mono); }
.diff-card-label { font-size: 0.7rem; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; }

.diff-extra { padding: var(--sp-md); background: var(--app-surface-hover, var(--bg-hover)); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--app-text-secondary, var(--text-secondary)); }
.diff-extra p { margin: var(--sp-xs) 0; }

.addsub-controls { display: flex; flex-direction: column; gap: var(--sp-sm); }
.addsub-row { display: flex; gap: var(--sp-sm); }
.addsub-btn { flex: 1; padding: var(--sp-md); font-size: 1rem; font-weight: 600; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text, var(--text-primary)); cursor: pointer; transition: all var(--ease-fast); }
.addsub-btn:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.addsub-btn:active { transform: scale(0.98); }
.addsub-custom { display: flex; gap: var(--sp-sm); align-items: center; flex-wrap: wrap; }
.addsub-input { width: 80px; padding: var(--sp-sm); font-size: 0.9rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; font-family: var(--font-mono); }

.addsub-result { text-align: center; padding: var(--sp-xl); background: var(--app-surface, var(--bg-primary)); border: 2px solid var(--app-primary, var(--accent-primary)); border-radius: var(--radius-lg); }
.addsub-result .result-label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; margin-bottom: var(--sp-xs); }
.addsub-result .result-date { display: block; font-size: 1.3rem; font-weight: 700; color: var(--app-primary, var(--accent-primary)); }
.addsub-result .result-day { display: block; font-size: 0.9rem; color: var(--app-text-secondary, var(--text-secondary)); margin-top: var(--sp-xs); }
.addsub-result .result-diff { display: block; font-size: 0.8rem; color: var(--app-text-muted, var(--text-muted)); margin-top: var(--sp-xs); font-family: var(--font-mono); }
</style>
