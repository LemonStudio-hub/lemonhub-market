<template>
  <div class="cal-datecalc">
    <div class="dc-section">
      <h3 class="dc-title">Days Between Dates</h3>
      <div class="dc-row">
        <label class="dc-label">Start</label>
        <input v-model="dcStart" type="date" class="dc-date-input" />
      </div>
      <div class="dc-row">
        <label class="dc-label">End</label>
        <input v-model="dcEnd" type="date" class="dc-date-input" />
      </div>
      <div v-if="dcResult" class="dc-results">
        <div class="dc-result-card"><span class="dc-num">{{ dcResult.days }}</span><span class="dc-label">Total Days</span></div>
        <div class="dc-result-card"><span class="dc-num">{{ dcResult.weekdays }}</span><span class="dc-label">Weekdays</span></div>
        <div class="dc-result-card"><span class="dc-num">{{ dcResult.weekends }}</span><span class="dc-label">Weekends</span></div>
        <div class="dc-result-card"><span class="dc-num">{{ dcResult.weeks }}</span><span class="dc-label">Weeks</span></div>
        <div class="dc-result-card"><span class="dc-num">{{ dcResult.months }}</span><span class="dc-label">Months</span></div>
      </div>
    </div>

    <div class="dc-section">
      <h3 class="dc-title">Add/Subtract Days</h3>
      <div class="dc-row">
        <label class="dc-label">From</label>
        <input v-model="dcFromDate" type="date" class="dc-date-input" />
      </div>
      <div class="dc-add-row">
        <button class="dc-add-btn" @click="dcAdd(-365)">-1Y</button>
        <button class="dc-add-btn" @click="dcAdd(-30)">-1M</button>
        <button class="dc-add-btn" @click="dcAdd(-7)">-1W</button>
        <button class="dc-add-btn" @click="dcAdd(-1)">-1D</button>
        <button class="dc-add-btn dc-add-pos" @click="dcAdd(1)">+1D</button>
        <button class="dc-add-btn dc-add-pos" @click="dcAdd(7)">+1W</button>
        <button class="dc-add-btn dc-add-pos" @click="dcAdd(30)">+1M</button>
        <button class="dc-add-btn dc-add-pos" @click="dcAdd(365)">+1Y</button>
      </div>
      <div v-if="dcAddResult" class="dc-add-result">
        <span class="dc-add-date">{{ dcAddResult }}</span>
        <span class="dc-add-day">{{ dcAddDay }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const dcStart = ref(new Date().toISOString().split('T')[0])
const dcEnd = ref(new Date(Date.now() + 90 * 864e5).toISOString().split('T')[0])
const dcFromDate = ref(new Date().toISOString().split('T')[0])
const dcAddDays = ref(0)

const dcResult = computed(() => {
  const s = new Date(dcStart.value + 'T00:00:00'); const e = new Date(dcEnd.value + 'T00:00:00')
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null
  const totalDays = Math.abs(Math.round((e.getTime() - s.getTime()) / 864e5))
  let weekdays = 0; let weekends = 0
  const cur = new Date(Math.min(s.getTime(), e.getTime())); const end = new Date(Math.max(s.getTime(), e.getTime()))
  while (cur < end) { const d = cur.getDay(); if (d === 0 || d === 6) weekends++; else weekdays++; cur.setDate(cur.getDate() + 1) }
  return { days: totalDays, weekdays, weekends, weeks: Math.floor(totalDays / 7), months: Math.round(totalDays / 30.44) }
})

function dcAdd(d: number) { dcAddDays.value += d }

const dcAddResult = computed(() => {
  if (!dcAddDays.value) return null
  const d = new Date(dcFromDate.value + 'T00:00:00'); d.setDate(d.getDate() + dcAddDays.value)
  return d.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
})

const dcAddDay = computed(() => {
  if (!dcAddDays.value) return null
  const d = new Date(dcFromDate.value + 'T00:00:00'); d.setDate(d.getDate() + dcAddDays.value)
  return d.toLocaleDateString('en', { weekday: 'long' })
})
</script>

<style scoped>
.cal-datecalc { display: flex; flex-direction: column; gap: var(--sp-xl); padding: var(--sp-lg); }
.dc-section { display: flex; flex-direction: column; gap: var(--sp-md); }
.dc-title { font-size: 0.85rem; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.03em; color: var(--app-text-secondary, var(--text-muted)); }
.dc-row { display: flex; align-items: center; gap: var(--sp-md); }
.dc-label { font-size: 0.8rem; font-weight: 500; min-width: 50px; color: var(--app-text-secondary, var(--text-muted)); }
.dc-date-input { flex: 1; padding: var(--sp-sm); font-size: 0.9rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.dc-date-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.dc-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: var(--sp-sm); }
.dc-result-card { display: flex; flex-direction: column; align-items: center; padding: var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-lg); }
.dc-num { font-size: 1.3rem; font-weight: 700; font-family: var(--font-mono); color: var(--app-primary, var(--accent-primary)); }
.dc-result-card .dc-label { font-size: 0.68rem; text-transform: uppercase; color: var(--app-text-muted, var(--text-muted)); }
.dc-add-row { display: flex; gap: var(--sp-xs); flex-wrap: wrap; }
.dc-add-btn { padding: var(--sp-sm) var(--sp-md); font-size: 0.85rem; font-weight: 600; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); cursor: pointer; transition: all var(--ease-fast); }
.dc-add-btn:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.dc-add-pos { background: var(--app-primary, var(--accent-primary)); color: white; border-color: var(--app-primary, var(--accent-primary)); }
.dc-add-pos:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); }
.dc-add-result { padding: var(--sp-lg); text-align: center; background: var(--app-surface, var(--bg-primary)); border: 2px solid var(--app-primary, var(--accent-primary)); border-radius: var(--radius-lg); }
.dc-add-date { display: block; font-size: 1.2rem; font-weight: 600; color: var(--app-primary, var(--accent-primary)); }
.dc-add-day { display: block; font-size: 0.85rem; color: var(--app-text-secondary, var(--text-muted)); margin-top: var(--sp-xs); }
</style>
