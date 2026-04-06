<template>
  <div class="cal-holidays">
    <div class="holiday-header">
      <h3 class="holiday-year">{{ year }}</h3>
      <div class="holiday-year-nav">
        <button class="holiday-nav-btn" @click="year--">◀</button>
        <button class="holiday-nav-btn" @click="year++">▶</button>
      </div>
    </div>
    <div class="holiday-list">
      <div v-for="h in filteredHolidays" :key="h.name" class="holiday-item" :class="{ passed: isPassed(h) }">
        <div class="holiday-date">
          <span class="holiday-month">{{ h.month }}</span>
          <span class="holiday-day">{{ h.day }}</span>
        </div>
        <div class="holiday-info">
          <span class="holiday-name">{{ h.name }}</span>
          <span class="holiday-type">{{ h.type }}</span>
        </div>
        <span v-if="isUpcoming(h)" class="holiday-countdown">In {{ daysUntil(h) }} days</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Holiday { month: string; day: number; name: string; type: string; lunar?: boolean }

const year = ref(new Date().getFullYear())
const today = new Date()

const holidays: Holiday[] = [
  { month: 'Jan', day: 1, name: "New Year's Day", type: 'Public' },
  { month: 'Feb', day: 14, name: "Valentine's Day", type: 'Observance' },
  { month: 'Mar', day: 8, name: "Women's Day", type: 'Observance' },
  { month: 'Mar', day: 12, name: 'Arbor Day', type: 'Observance' },
  { month: 'Apr', day: 1, name: "April Fool's", type: 'Observance' },
  { month: 'May', day: 1, name: 'Labour Day', type: 'Public' },
  { month: 'May', day: 4, name: 'Youth Day', type: 'Observance' },
  { month: 'Jun', day: 1, name: "Children's Day", type: 'Observance' },
  { month: 'Jul', day: 1, name: 'Party Day', type: 'Observance' },
  { month: 'Aug', day: 1, name: 'Army Day', type: 'Observance' },
  { month: 'Sep', day: 10, name: "Teacher's Day", type: 'Observance' },
  { month: 'Oct', day: 1, name: 'National Day', type: 'Public' },
  { month: 'Oct', day: 31, name: 'Halloween', type: 'Observance' },
  { month: 'Nov', day: 11, name: "Singles' Day", type: 'Observance' },
  { month: 'Dec', day: 25, name: 'Christmas', type: 'Observance' },
  { month: 'Dec', day: 31, name: "New Year's Eve", type: 'Observance' },
  // Chinese lunar holidays (approximate dates)
  { month: 'Jan', day: 29, name: 'Chinese New Year', type: 'Lunar', lunar: true },
  { month: 'Jan', day: 15, name: 'Lantern Festival', type: 'Lunar', lunar: true },
  { month: 'Apr', day: 4, name: 'Qingming Festival', type: 'Lunar', lunar: true },
  { month: 'May', day: 31, name: 'Dragon Boat Festival', type: 'Lunar', lunar: true },
  { month: 'Sep', day: 29, name: 'Mid-Autumn Festival', type: 'Lunar', lunar: true },
  { month: 'Oct', day: 29, name: 'Double Ninth Festival', type: 'Lunar', lunar: true },
]


const filteredHolidays = computed(() => {
  return holidays
    .filter(h => {
      const m = new Date(`${h.month} 1, ${year.value}`).getMonth() + 1
      return m <= 12
    })
    .sort((a, b) => {
      const ma = new Date(`${a.month} 1, ${year.value}`).getTime()
      const mb = new Date(`${b.month} 1, ${year.value}`).getTime()
      return ma - mb || a.day - b.day
    })
})

function getDate(h: Holiday) { return new Date(year.value, new Date(`${h.month} 1, ${year.value}`).getMonth(), h.day) }
function isPassed(h: Holiday) { return getDate(h) < today }
function isUpcoming(h: Holiday) { const d = getDate(h); return d >= today }
function daysUntil(h: Holiday) { return Math.ceil((getDate(h).getTime() - today.getTime()) / 864e5) }

onMounted(() => { year.value = today.getFullYear() })
</script>

<style scoped>
.cal-holidays { display: flex; flex-direction: column; height: 100%; padding: var(--sp-md); }
.holiday-header { display: flex; align-items: center; gap: var(--sp-md); margin-bottom: var(--sp-md); }
.holiday-year { font-size: 1.2rem; font-weight: 700; margin: 0; flex: 1; }
.holiday-year-nav { display: flex; gap: var(--sp-xs); }
.holiday-nav-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); cursor: pointer; color: var(--app-text, var(--text-primary)); }
.holiday-nav-btn:hover { border-color: var(--app-primary, var(--accent-primary)); }
.holiday-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--sp-xs); }
.holiday-item { display: flex; align-items: center; gap: var(--sp-md); padding: var(--sp-sm) var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-lg); }
.holiday-item.passed { opacity: 0.5; }
.holiday-date { text-align: center; min-width: 48px; }
.holiday-month { display: block; font-size: 0.7rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; }
.holiday-day { display: block; font-size: 1.3rem; font-weight: 700; font-family: var(--font-mono); }
.holiday-info { flex: 1; }
.holiday-name { display: block; font-size: 0.9rem; font-weight: 500; }
.holiday-type { display: block; font-size: 0.68rem; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; }
.holiday-countdown { font-size: 0.75rem; font-weight: 600; color: var(--app-primary, var(--accent-primary)); background: rgba(99,102,241,0.1); padding: var(--sp-xs) var(--sp-sm); border-radius: var(--radius-md); }
</style>
