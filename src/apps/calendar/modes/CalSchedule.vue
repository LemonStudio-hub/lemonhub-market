<template>
  <div class="cal-schedule">
    <div class="schedule-header">
      <h3 class="schedule-title">📋 Schedule</h3>
      <button class="cal-add-btn" @click="addSchedule">+ Add Event</button>
    </div>

    <!-- Week View -->
    <div class="schedule-week-nav">
      <button class="cal-nav-btn" @click="weekOffset--">◀</button>
      <span class="schedule-week-label">{{ weekLabel }}</span>
      <button class="cal-nav-btn" @click="weekOffset++">▶</button>
    </div>

    <!-- Time Grid -->
    <div class="schedule-grid">
      <div class="schedule-time-col">
        <div v-for="h in hours" :key="h" class="schedule-hour">{{ h.toString().padStart(2,'0') }}:00</div>
      </div>
      <div class="schedule-day-cols">
        <div v-for="(d, i) in weekDays" :key="i" class="schedule-day-col">
          <div class="schedule-day-header">{{ d.name }}</div>
          <div v-for="h in hours" :key="h" class="schedule-hour-slot" />
          <div v-for="evt in dayEvents(d.date)" :key="evt.id" class="schedule-event"
            :style="{ top: eventTop(evt), height: eventHeight(evt), background: eventColor(evt) }"
            draggable="true" @dragstart="dragStart(evt)" @dragover.prevent @drop="dropEvt($event, d.date)"
            @click="editEvt(evt.id)">
            <span class="evt-title">{{ evt.title }}</span>
            <span class="evt-time">{{ evt.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showForm" class="schedule-form-overlay" @click.self="showForm = false">
      <div class="schedule-form">
        <h4 class="form-title">{{ editingEvt ? 'Edit' : 'New' }} Event</h4>
        <input v-model="form.title" class="form-input" placeholder="Event title" />
        <div class="form-row">
          <input v-model="form.date" type="date" class="form-input" />
          <input v-model="form.time" type="time" class="form-input" />
        </div>
        <select v-model="form.color" class="form-input">
          <option v-for="c in colors" :key="c" :value="c" :style="{ background: c }">{{ c }}</option>
        </select>
        <div class="form-actions">
          <button v-if="editingEvt" class="form-btn form-btn-danger" @click="deleteEvt(editingEvt)">Delete</button>
          <div style="flex:1" />
          <button class="form-btn form-btn-secondary" @click="showForm = false">Cancel</button>
          <button class="form-btn form-btn-primary" @click="saveEvt">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ScheduleEvt { id: string; title: string; date: string; time: string; color: string; duration?: number }

const weekOffset = ref(0)
const events = ref<ScheduleEvt[]>([])
const showForm = ref(false)
const editingEvt = ref<string | null>(null)
const form = ref({ title: '', date: '', time: '', color: '#6366f1' })
const colors = ['#6366f1','#0ea5e9','#22c55e','#f59e0b','#ef4444','#ec4899','#8b5cf6']
const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 6:00 - 21:00

const today = new Date()
const startOfWeek = computed(() => {
  const d = new Date(today); d.setDate(d.getDate() - d.getDay() + weekOffset.value * 7); return d
})

const weekDays = computed(() => {
  const days = []; const d = new Date(startOfWeek.value)
  for (let i = 0; i < 7; i++) { days.push({ name: d.toLocaleDateString('en', { weekday: 'short' }), date: d.toISOString().split('T')[0] }); d.setDate(d.getDate() + 1) }
  return days
})

const weekLabel = computed(() => {
  const s = startOfWeek.value; const e = new Date(s); e.setDate(e.getDate() + 6)
  return `${s.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
})

function dayEvents(date: string) { return events.value.filter(e => e.date === date).sort((a, b) => a.time.localeCompare(b.time)) }

function addSchedule() { form.value = { title: '', date: new Date().toISOString().split('T')[0], time: '12:00', color: colors[0] }; editingEvt.value = null; showForm.value = true }

function saveEvt() {
  if (!form.value.title.trim() || !form.value.date) return
  if (editingEvt.value) {
    const idx = events.value.findIndex(e => e.id === editingEvt.value)
    if (idx >= 0) events.value[idx] = { ...events.value[idx], ...form.value }
  } else {
    events.value.push({ id: `sched-${Date.now()}`, ...form.value })
  }
  showForm.value = false; save()
}

function deleteEvt(id: string) { events.value = events.value.filter(e => e.id !== id); showForm.value = false; save() }

function editEvt(id: string) { const e = events.value.find(ev => ev.id === id); if (e) { form.value = { title: e.title, date: e.date, time: e.time, color: e.color }; editingEvt.value = id; showForm.value = true } }

let dragEvt: ScheduleEvt | null = null
function dragStart(evt: ScheduleEvt) { dragEvt = evt }
function dropEvt(e: DragEvent, date: string) {
  e.preventDefault()
  if (dragEvt) { dragEvt.date = date; save(); dragEvt = null }
}

function eventTop(evt: ScheduleEvt) {
  const [h, m] = evt.time.split(':').map(Number)
  return `${(h - 6) * 40 + (m / 60) * 40}px`
}
function eventHeight(evt: ScheduleEvt) { return `${(evt.duration || 1) * 40}px` }
function eventColor(evt: ScheduleEvt) { return evt.color }

function save() { localStorage.setItem('cal-schedule', JSON.stringify(events.value)) }

onMounted(() => { const s = localStorage.getItem('cal-schedule'); if (s) events.value = JSON.parse(s) })
</script>

<style scoped>
.cal-schedule { display: flex; flex-direction: column; height: 100%; }
.schedule-header { display: flex; align-items: center; justify-content: space-between; padding: var(--sp-md); }
.schedule-title { font-size: 0.9rem; font-weight: 600; margin: 0; }
.cal-add-btn { padding: var(--sp-xs) var(--sp-sm); font-size: 0.75rem; font-weight: 500; background: var(--app-primary, var(--accent-primary)); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; }
.schedule-week-nav { display: flex; align-items: center; justify-content: center; gap: var(--sp-md); padding: var(--sp-sm) var(--sp-md); border-bottom: 1px solid var(--app-border, var(--border-primary)); }
.cal-nav-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); cursor: pointer; color: var(--app-text, var(--text-primary)); font-size: 0.8rem; }
.schedule-week-label { font-size: 0.8rem; font-weight: 600; }
.schedule-grid { flex: 1; display: flex; overflow-y: auto; min-height: 0; }
.schedule-time-col { width: 52px; flex-shrink: 0; border-right: 1px solid var(--app-border, var(--border-primary)); }
.schedule-hour { height: 40px; display: flex; align-items: flex-start; justify-content: center; font-size: 0.65rem; color: var(--app-text-muted, var(--text-muted)); padding-top: 2px; font-family: var(--font-mono); }
.schedule-day-cols { flex: 1; display: flex; min-width: 0; }
.schedule-day-col { flex: 1; position: relative; border-right: 1px solid var(--app-border-light, var(--border-secondary)); }
.schedule-day-header { height: 24px; text-align: center; font-size: 0.65rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); border-bottom: 1px solid var(--app-border, var(--border-primary)); line-height: 24px; }
.schedule-hour-slot { height: 40px; border-bottom: 1px solid var(--app-border-light, var(--border-secondary)); }
.schedule-event { position: absolute; left: 2px; right: 2px; padding: 2px 4px; border-radius: var(--radius-sm); font-size: 0.65rem; cursor: pointer; overflow: hidden; z-index: 2; }
.evt-title { display: block; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.evt-time { display: block; font-size: 0.55rem; opacity: 0.8; }
.schedule-form-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 30; display: flex; align-items: center; justify-content: center; }
.schedule-form { background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-xl); padding: var(--sp-xl); width: 90%; max-width: 360px; }
.form-title { font-size: 1rem; font-weight: 600; margin: 0 0 var(--sp-md); }
.form-input { width: 100%; padding: var(--sp-sm); font-size: 0.85rem; background: var(--app-tertiary, var(--bg-tertiary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; margin-bottom: var(--sp-sm); }
.form-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.form-row { display: flex; gap: var(--sp-sm); }
.form-actions { display: flex; gap: var(--sp-sm); margin-top: var(--sp-md); }
.form-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; }
.form-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.form-btn-secondary { background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text, var(--text-primary)); }
.form-btn-danger { background: rgba(239,68,68,0.1); color: var(--app-error, #ef4444); }
</style>
