<template>
  <div class="clock-mode">
    <div class="world-clock-local">
      <div class="local-time">{{ localTime }}</div>
      <div class="local-date">{{ localDate }}</div>
      <div class="local-label">📍 Local Time</div>
    </div>
    <div class="world-clock-add">
      <select v-model="selectedTz" class="tz-select">
        <option value="">Select city...</option>
        <option v-for="tz in availableTz" :key="tz.tz" :value="tz.tz">{{ tz.label }}</option>
      </select>
      <button class="clock-btn clock-btn-primary clock-btn-sm" @click="addCity" :disabled="!selectedTz">+ Add</button>
    </div>
    <div v-if="cities.length" class="world-list">
      <div v-for="(c, i) in cities" :key="c.tz" class="world-item">
        <div class="world-info">
          <span class="world-city">{{ c.label }}</span>
          <span class="world-tz-name">{{ c.tz.split('/').pop()?.replace(/_/g, ' ') }}</span>
        </div>
        <div class="world-time-col">
          <span class="world-time">{{ getTime(c.tz) }}</span>
          <span class="world-diff">{{ getDiff(c.tz) }}</span>
        </div>
        <button class="world-delete" @click="removeCity(i)">×</button>
      </div>
    </div>
    <div v-else class="world-empty">
      <p>🌍 Add cities to track timezones</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface City { tz: string; label: string }

const cities = ref<City[]>([])
const selectedTz = ref('')
let interval: ReturnType<typeof setInterval> | null = null

const allTz: City[] = [
  { tz: 'America/New_York', label: 'New York' }, { tz: 'America/Chicago', label: 'Chicago' },
  { tz: 'America/Denver', label: 'Denver' }, { tz: 'America/Los_Angeles', label: 'Los Angeles' },
  { tz: 'America/Sao_Paulo', label: 'São Paulo' }, { tz: 'Europe/London', label: 'London' },
  { tz: 'Europe/Paris', label: 'Paris' }, { tz: 'Europe/Berlin', label: 'Berlin' },
  { tz: 'Europe/Moscow', label: 'Moscow' }, { tz: 'Asia/Dubai', label: 'Dubai' },
  { tz: 'Asia/Kolkata', label: 'Mumbai' }, { tz: 'Asia/Shanghai', label: 'Shanghai' },
  { tz: 'Asia/Tokyo', label: 'Tokyo' }, { tz: 'Asia/Seoul', label: 'Seoul' },
  { tz: 'Asia/Singapore', label: 'Singapore' }, { tz: 'Australia/Sydney', label: 'Sydney' },
  { tz: 'Pacific/Auckland', label: 'Auckland' }, { tz: 'Pacific/Honolulu', label: 'Honolulu' },
]

const availableTz = computed(() => allTz.filter(tz => !cities.value.some(c => c.tz === tz.tz)))

const localTime = ref('')
const localDate = ref('')

function updateTime() {
  const now = new Date()
  localTime.value = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  localDate.value = now.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function getTime(tz: string) {
  try { return new Date().toLocaleTimeString('en', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' }) } catch { return '—' }
}

function getDiff(tz: string) {
  try {
    const now = new Date()
    const local = new Date(now.toLocaleString('en', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }))
    const target = new Date(now.toLocaleString('en', { timeZone: tz }))
    const diff = (target.getTime() - local.getTime()) / 3600000
    return diff >= 0 ? `+${diff.toFixed(1)}h` : `${diff.toFixed(1)}h`
  } catch { return '' }
}

function addCity() {
  if (!selectedTz.value) return
  const found = allTz.find(t => t.tz === selectedTz.value)
  if (found) { cities.value.push(found); selectedTz.value = ''; save() }
}

function removeCity(i: number) { cities.value.splice(i, 1); save() }
function save() { localStorage.setItem('clock-cities', JSON.stringify(cities.value)) }

onMounted(() => {
  const saved = localStorage.getItem('clock-cities')
  if (saved) cities.value = JSON.parse(saved)
  updateTime(); interval = setInterval(updateTime, 1000)
})

onUnmounted(() => { if (interval) clearInterval(interval) })
</script>

<style scoped>
.clock-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); gap: var(--sp-lg); }
.world-clock-local { text-align: center; padding: var(--sp-xl) 0; border-bottom: 1px solid var(--app-border, var(--border-primary)); }
.local-time { font-size: 2.5rem; font-weight: 700; font-family: var(--font-mono); }
.local-date { font-size: 0.85rem; color: var(--app-text-secondary, var(--text-muted)); margin-top: var(--sp-xs); }
.local-label { font-size: 0.7rem; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; margin-top: var(--sp-sm); }
.world-clock-add { display: flex; gap: var(--sp-sm); }
.tz-select { flex: 1; padding: var(--sp-sm); font-size: 0.85rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.world-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--sp-sm); }
.world-item { display: flex; align-items: center; gap: var(--sp-md); padding: var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-lg); }
.world-info { flex: 1; }
.world-city { display: block; font-size: 0.95rem; font-weight: 600; }
.world-tz-name { display: block; font-size: 0.72rem; color: var(--app-text-muted, var(--text-muted)); }
.world-time-col { text-align: right; }
.world-time { display: block; font-size: 1rem; font-weight: 600; font-family: var(--font-mono); }
.world-diff { display: block; font-size: 0.7rem; color: var(--app-text-muted, var(--text-muted)); }
.world-delete { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); font-size: 1rem; color: var(--app-text-muted, var(--text-muted)); background: none; border: none; cursor: pointer; }
.world-delete:hover { background: rgba(239,68,68,0.1); color: var(--app-error, #ef4444); }
.world-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--app-text-muted, var(--text-muted)); font-size: 0.9rem; }
.clock-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.clock-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.clock-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); }
.clock-btn-sm { padding: var(--sp-sm) var(--sp-md); }
.clock-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
