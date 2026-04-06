<template>
  <div class="cal-month">
    <div class="cal-month-header">
      <button class="cal-nav-btn" @click="prevMonth">◀</button>
      <h3 class="cal-month-title">{{ monthYear }}</h3>
      <button class="cal-nav-btn" @click="nextMonth">▶</button>
      <button class="cal-today-btn" @click="goToday">Today</button>
    </div>
    <div class="cal-weekdays">
      <span v-for="d in weekDays" :key="d" class="cal-weekday">{{ d }}</span>
    </div>
    <div class="cal-grid">
      <div v-for="i in firstDayOffset" :key="`e-${i}`" class="cal-cell cal-empty" />
      <button v-for="day in daysInMonth" :key="day" class="cal-cell cal-day"
        :class="{ 'cal-today': isToday(day), 'cal-selected': selectedDay === day, 'cal-weekend': isWeekend(day) }"
        @click="selectDay(day)">
        <span class="cal-day-num">{{ day }}</span>
        <span class="cal-lunar">{{ getLunar(day) }}</span>
        <span v-if="hasEvent(day)" class="cal-event-dot" />
      </button>
    </div>
    <!-- Selected day events -->
    <div v-if="selectedDay" class="cal-day-events">
      <div class="cal-day-events-header">
        <h4 class="cal-day-title">{{ selectedMonth }}/{{ selectedDay }} {{ getLunarFull(selectedDay) }}</h4>
        <button class="cal-add-btn" @click="addEvent">+ Add</button>
      </div>
      <div v-if="dayEvents.length" class="cal-event-list">
        <div v-for="evt in dayEvents" :key="evt.id" class="cal-event-item" draggable="true"
          @dragstart="dragStart(evt)" @dragover.prevent @drop="dropOnEvent($event, evt)">
          <span class="evt-color" :style="{ background: evt.color }" />
          <div class="evt-info">
            <span class="evt-title">{{ evt.title }}</span>
            <span class="evt-time">{{ evt.time }}</span>
          </div>
          <button class="evt-delete" @click="deleteEvent(evt.id)">×</button>
        </div>
      </div>
      <p v-else class="cal-no-events">No events</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { solarToLunar } from '../lunar/lunar'

interface CalEvent { id: string; date: string; title: string; time: string; color: string }
const COLORS = ['#6366f1','#0ea5e9','#22c55e','#f59e0b','#ef4444','#ec4899','#8b5cf6']

const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth() + 1)
const selectedDay = ref<number | null>(null)
const events = ref<CalEvent[]>([])

const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const monthYear = computed(() => new Date(year.value, month.value - 1).toLocaleDateString('en', { month:'long', year:'numeric' }))
const selectedMonth = computed(() => month.value)
const daysInMonth = computed(() => new Date(year.value, month.value, 0).getDate())
const firstDayOffset = computed(() => new Date(year.value, month.value - 1, 1).getDay())

function isToday(day: number) { return day === today.getDate() && month.value === today.getMonth() + 1 && year.value === today.getFullYear() }
function isWeekend(day: number) { const d = new Date(year.value, month.value - 1, day).getDay(); return d === 0 || d === 6 }
function hasEvent(day: number) { return events.value.some(e => e.date === `${year.value}-${month.value}-${day}`) }
function selectDay(day: number) { selectedDay.value = day }
function prevMonth() { if (month.value === 1) { month.value = 12; year.value-- } else month.value--; selectedDay.value = null }
function nextMonth() { if (month.value === 12) { month.value = 1; year.value++ } else month.value++; selectedDay.value = null }
function goToday() { year.value = today.getFullYear(); month.value = today.getMonth() + 1; selectedDay.value = today.getDate() }

function getLunar(day: number) {
  try {
    const l = solarToLunar(year.value, month.value, day)
    return l.day === 1 ? l.monthStr : l.dayStr
  } catch { return '' }
}

function getLunarFull(day: number) {
  try { const l = solarToLunar(year.value, month.value, day); return `${l.gzYear}${l.animal}年 ${l.monthStr}${l.dayStr}` } catch { return '' }
}

const dayEvents = computed(() => {
  if (!selectedDay.value) return []
  return events.value.filter(e => e.date === `${year.value}-${month.value}-${selectedDay.value}`)
})

function addEvent() {
  if (!selectedDay.value) return
  events.value.push({ id: `evt-${Date.now()}`, date: `${year.value}-${month.value}-${selectedDay.value}`, title: 'New Event', time: '12:00', color: COLORS[events.value.length % COLORS.length] })
  save()
}

function deleteEvent(id: string) { events.value = events.value.filter(e => e.id !== id); save() }

let dragEvt: CalEvent | null = null
function dragStart(evt: CalEvent) { dragEvt = evt }
function dropOnEvent(e: DragEvent, target: CalEvent) {
  e.preventDefault()
  if (!dragEvt || dragEvt.id === target.id) return
  const dates = events.value.map(ev => ({ ...ev }))
  const src = dates.find(d => d.id === dragEvt!.id)
  const tgt = dates.find(d => d.id === target.id)
  if (src && tgt) { const tmp = { date: src.date, time: src.time }; src.date = tgt.date; src.time = tgt.time; tgt.date = tmp.date; tgt.time = tmp.time; events.value = dates }
  dragEvt = null
  save()
}

function save() { localStorage.setItem('cal-events-v2', JSON.stringify(events.value)) }

onMounted(() => { const s = localStorage.getItem('cal-events-v2'); if (s) events.value = JSON.parse(s) })
</script>

<style scoped>
.cal-month { display: flex; flex-direction: column; height: 100%; padding: var(--sp-md); }
.cal-month-header { display: flex; align-items: center; gap: var(--sp-sm); margin-bottom: var(--sp-md); }
.cal-nav-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text, var(--text-primary)); cursor: pointer; }
.cal-nav-btn:hover { border-color: var(--app-primary, var(--accent-primary)); }
.cal-month-title { font-size: 1rem; font-weight: 600; margin: 0; flex: 1; }
.cal-today-btn { padding: var(--sp-xs) var(--sp-sm); font-size: 0.75rem; font-weight: 500; background: var(--app-primary, var(--accent-primary)); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; }
.cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: var(--sp-xs); }
.cal-weekday { text-align: center; font-size: 0.68rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; padding: var(--sp-xs) 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
.cal-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); font-size: 0.85rem; position: relative; }
.cal-empty { /* spacer */ }
.cal-day { background: none; border: none; cursor: pointer; color: var(--app-text, var(--text-primary)); transition: all var(--ease-fast); padding: 2px; }
.cal-day:hover { background: var(--app-surface-hover, var(--bg-hover)); }
.cal-day.cal-today { background: var(--app-primary, var(--accent-primary)); color: white; border-radius: 50%; font-weight: 700; }
.cal-day.cal-selected { background: var(--app-surface-hover, var(--bg-hover)); border: 2px solid var(--app-primary, var(--accent-primary)); border-radius: var(--radius-md); }
.cal-day.cal-weekend { color: var(--app-error, var(--accent-error)); }
.cal-day.cal-today.cal-weekend { color: white; }
.cal-day-num { font-size: 0.85rem; font-weight: 500; }
.cal-lunar { font-size: 0.55rem; color: var(--app-text-muted, var(--text-muted)); line-height: 1; }
.cal-day.cal-today .cal-lunar { color: rgba(255,255,255,0.7); }
.cal-event-dot { position: absolute; bottom: 2px; width: 4px; height: 4px; border-radius: 50%; background: var(--app-primary, var(--accent-primary)); }
.cal-day-events { margin-top: var(--sp-md); padding-top: var(--sp-md); border-top: 1px solid var(--app-border, var(--border-primary)); }
.cal-day-events-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-sm); }
.cal-day-title { font-size: 0.85rem; font-weight: 600; margin: 0; }
.cal-add-btn { padding: var(--sp-xs) var(--sp-sm); font-size: 0.75rem; font-weight: 500; background: var(--app-primary, var(--accent-primary)); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; }
.cal-event-list { display: flex; flex-direction: column; gap: var(--sp-xs); }
.cal-event-item { display: flex; align-items: center; gap: var(--sp-sm); padding: var(--sp-sm); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); cursor: grab; }
.cal-event-item:active { cursor: grabbing; }
.evt-color { width: 4px; height: 28px; border-radius: 2px; flex-shrink: 0; }
.evt-info { flex: 1; }
.evt-title { display: block; font-size: 0.82rem; font-weight: 500; }
.evt-time { display: block; font-size: 0.68rem; color: var(--app-text-muted, var(--text-muted)); }
.evt-delete { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); color: var(--app-text-muted, var(--text-muted)); background: none; border: none; cursor: pointer; }
.evt-delete:hover { background: rgba(239,68,68,0.1); color: var(--app-error, #ef4444); }
.cal-no-events { padding: var(--sp-lg); text-align: center; color: var(--app-text-muted, var(--text-muted)); font-size: 0.85rem; }
</style>
