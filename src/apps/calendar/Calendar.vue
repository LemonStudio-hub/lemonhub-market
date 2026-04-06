<template>
  <div class="calendar-app">
    <div class="cal-header">
      <button class="app-btn app-btn-ghost app-btn-icon" @click="prevMonth">◀</button>
      <h3 class="cal-title">{{ monthYear }}</h3>
      <button class="app-btn app-btn-ghost app-btn-icon" @click="nextMonth">▶</button>
    </div>

    <div class="cal-weekdays">
      <span v-for="d in weekDays" :key="d" class="cal-weekday">{{ d }}</span>
    </div>

    <div class="cal-grid">
      <!-- Empty cells before first day -->
      <div v-for="i in firstDayOffset" :key="`empty-${i}`" class="cal-cell cal-empty" />
      <!-- Days -->
      <button
        v-for="day in daysInMonth"
        :key="day"
        class="cal-cell cal-day"
        :class="{
          'cal-today': isToday(day),
          'cal-selected': isSelected(day),
        }"
        @click="selectDay(day)"
      >
        {{ day }}
        <span v-if="hasEvent(day)" class="cal-event-dot" />
      </button>
    </div>

    <div v-if="selectedDate" class="cal-events">
      <div class="cal-events-header">
        <h4 class="cal-events-title">{{ formatDate(selectedDate) }}</h4>
        <button class="app-btn app-btn-primary app-btn-sm" @click="addEvent">+ Add</button>
      </div>
      <div v-if="eventsForSelected.length" class="cal-events-list">
        <div v-for="evt in eventsForSelected" :key="evt.id" class="cal-event-item">
          <span class="cal-event-color" :style="{ background: evt.color }" />
          <div class="cal-event-info">
            <span class="cal-event-name">{{ evt.title }}</span>
            <span class="cal-event-time">{{ evt.time }}</span>
          </div>
          <button class="cal-event-delete" @click="deleteEvent(evt.id)">×</button>
        </div>
      </div>
      <div v-else class="cal-empty-events">
        <p>No events scheduled</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface CalendarEvent {
  id: string
  date: string
  title: string
  time: string
  color: string
}

const COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899']

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref<string | null>(null)
const events = ref<CalendarEvent[]>([])

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthYear = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleDateString('en', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

const firstDayOffset = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())

function isToday(day: number): boolean {
  return day === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear()
}

function isSelected(day: number): boolean {
  return selectedDate.value === `${currentYear.value}-${currentMonth.value + 1}-${day}`
}

function selectDay(day: number) {
  selectedDate.value = `${currentYear.value}-${currentMonth.value + 1}-${day}`
}

function hasEvent(day: number): boolean {
  const dateStr = `${currentYear.value}-${currentMonth.value + 1}-${day}`
  return events.value.some(e => e.date === dateStr)
}

const eventsForSelected = computed(() => {
  if (!selectedDate.value) return []
  return events.value.filter(e => e.date === selectedDate.value)
})

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
  selectedDate.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
  selectedDate.value = null
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}

function addEvent() {
  if (!selectedDate.value) return
  events.value.push({
    id: `evt-${Date.now()}`,
    date: selectedDate.value,
    title: 'New Event',
    time: '12:00',
    color: COLORS[events.value.length % COLORS.length],
  })
  saveEvents()
}

function deleteEvent(id: string) {
  events.value = events.value.filter(e => e.id !== id)
  saveEvents()
}

function saveEvents() {
  localStorage.setItem('cal-events', JSON.stringify(events.value))
}

onMounted(() => {
  const saved = localStorage.getItem('cal-events')
  if (saved) events.value = JSON.parse(saved)
})
</script>

<style scoped>
.calendar-app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-md) var(--sp-md) var(--sp-lg);
}

.cal-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 var(--sp-sm);
  margin-bottom: var(--sp-xs);
}

.cal-weekday {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--app-text-muted, var(--text-muted));
  text-transform: uppercase;
  padding: var(--sp-xs) 0;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 0 var(--sp-sm);
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  border-radius: var(--radius-md);
  position: relative;
}

.cal-empty { /* invisible spacer */ }

.cal-day {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--app-text, var(--text-primary));
  transition: all var(--ease-fast);
  font-family: var(--font-sans);
}

.cal-day:hover { background: var(--app-surface-hover, var(--bg-hover)); }

.cal-today {
  background: var(--app-primary, var(--accent-primary));
  color: white;
  font-weight: 700;
  border-radius: 50%;
}

.cal-selected {
  background: var(--app-surface-hover, var(--bg-hover));
  border: 2px solid var(--app-primary, var(--accent-primary));
  font-weight: 700;
  border-radius: var(--radius-md);
}

.cal-event-dot {
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--app-primary, var(--accent-primary));
}

.cal-events {
  margin-top: var(--sp-lg);
  padding: 0 var(--sp-md) var(--sp-md);
  border-top: 1px solid var(--app-border, var(--border-primary));
}

.cal-events-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-md) 0;
}

.cal-events-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}

.cal-event-item {
  display: flex;
  align-items: center;
  gap: var(--sp-sm);
  padding: var(--sp-sm) 0;
  border-bottom: 1px solid var(--app-border-light, var(--border-secondary));
}

.cal-event-color {
  width: 4px;
  height: 28px;
  border-radius: 2px;
  flex-shrink: 0;
}

.cal-event-info { flex: 1; }

.cal-event-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
}

.cal-event-time {
  display: block;
  font-size: 0.7rem;
  color: var(--app-text-secondary, var(--text-muted));
}

.cal-event-delete {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--app-text-muted, var(--text-muted));
  font-size: 1rem;
}

.cal-event-delete:hover {
  background: var(--app-error-light, rgba(239, 68, 68, 0.1));
  color: var(--app-error, #ef4444);
}

.cal-empty-events {
  padding: var(--sp-lg) 0;
  text-align: center;
  color: var(--app-text-secondary, var(--text-muted));
  font-size: 0.85rem;
}
</style>
