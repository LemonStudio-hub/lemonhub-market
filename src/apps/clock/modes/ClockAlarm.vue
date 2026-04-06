<template>
  <div class="clock-mode">
    <div class="alarm-add">
      <div class="alarm-time-inputs">
        <input v-model.number="alarmH" type="number" class="alarm-num" min="0" max="23" />
        <span class="alarm-sep">:</span>
        <input v-model.number="alarmM" type="number" class="alarm-num" min="0" max="59" />
      </div>
      <input v-model="alarmLabel" class="alarm-label-input" placeholder="Alarm label..." />
      <button class="clock-btn clock-btn-primary clock-btn-sm" @click="addAlarm">+ Add</button>
    </div>
    <div v-if="alarms.length" class="alarm-list">
      <div v-for="a in alarms" :key="a.id" class="alarm-item" :class="{ active: a.enabled }">
        <div class="alarm-info">
          <span class="alarm-time">{{ pad(a.h) }}:{{ pad(a.m) }}</span>
          <span class="alarm-label">{{ a.label || 'Alarm' }}</span>
        </div>
        <div class="alarm-actions">
          <button class="alarm-toggle" :class="{ on: a.enabled }" @click="a.enabled = !a.enabled">
            <span class="toggle-knob" />
          </button>
          <button class="alarm-delete" @click="deleteAlarm(a.id)">×</button>
        </div>
      </div>
    </div>
    <div v-else class="alarm-empty">
      <p class="alarm-empty-icon">⏰</p>
      <p class="alarm-empty-text">No alarms set</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Alarm { id: string; h: number; m: number; label: string; enabled: boolean }
const alarms = ref<Alarm[]>([])
const alarmH = ref(7)
const alarmM = ref(0)
const alarmLabel = ref('')
let interval: ReturnType<typeof setInterval> | null = null

function pad(n: number) { return n.toString().padStart(2, '0') }

function addAlarm() {
  if (alarmH.value < 0 || alarmH.value > 23 || alarmM.value < 0 || alarmM.value > 59) return
  alarms.value.push({ id: `alarm-${Date.now()}`, h: alarmH.value, m: alarmM.value, label: alarmLabel.value, enabled: true })
  alarmLabel.value = ''; save()
}

function deleteAlarm(id: string) {
  alarms.value = alarms.value.filter(a => a.id !== id); save()
}

function checkAlarms() {
  const now = new Date()
  for (const a of alarms.value) {
    if (a.enabled && a.h === now.getHours() && a.m === now.getMinutes() && now.getSeconds() === 0) {
      try { new Notification('⏰ Alarm', { body: a.label || 'Alarm!' }) } catch {}
    }
  }
}

function save() { localStorage.setItem('clock-alarms', JSON.stringify(alarms.value)) }

onMounted(() => {
  const saved = localStorage.getItem('clock-alarms')
  if (saved) alarms.value = JSON.parse(saved)
  interval = setInterval(checkAlarms, 1000)
  if (Notification.permission === 'default') Notification.requestPermission()
})

onUnmounted(() => { if (interval) clearInterval(interval) })
</script>

<style scoped>
.clock-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); gap: var(--sp-lg); }
.alarm-add { display: flex; align-items: center; gap: var(--sp-sm); padding-bottom: var(--sp-md); border-bottom: 1px solid var(--app-border, var(--border-primary)); }
.alarm-time-inputs { display: flex; align-items: center; gap: var(--sp-xs); }
.alarm-num { width: 56px; padding: var(--sp-sm); text-align: center; font-size: 1.1rem; font-family: var(--font-mono); font-weight: 600; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.alarm-num:focus { border-color: var(--app-primary, var(--accent-primary)); }
.alarm-sep { font-size: 1.2rem; font-weight: 700; font-family: var(--font-mono); }
.alarm-label-input { flex: 1; padding: var(--sp-sm); font-size: 0.85rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.alarm-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--sp-sm); }
.alarm-item { display: flex; align-items: center; justify-content: space-between; padding: var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-lg); transition: all var(--ease-fast); }
.alarm-item.active { border-color: var(--app-primary, var(--accent-primary)); }
.alarm-info { display: flex; flex-direction: column; }
.alarm-time { font-size: 1.3rem; font-weight: 700; font-family: var(--font-mono); }
.alarm-label { font-size: 0.75rem; color: var(--app-text-muted, var(--text-muted)); }
.alarm-actions { display: flex; align-items: center; gap: var(--sp-sm); }
.alarm-toggle { position: relative; width: 44px; height: 24px; background: var(--bg-hover, #e2e8f0); border-radius: 12px; border: none; cursor: pointer; transition: background var(--ease-base); }
.alarm-toggle.on { background: var(--app-primary, var(--accent-primary)); }
.toggle-knob { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform var(--ease-base); box-shadow: var(--shadow-sm); }
.alarm-toggle.on .toggle-knob { transform: translateX(20px); }
.alarm-delete { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); font-size: 1rem; color: var(--app-text-muted, var(--text-muted)); background: none; border: none; cursor: pointer; }
.alarm-delete:hover { background: rgba(239,68,68,0.1); color: var(--app-error, #ef4444); }
.alarm-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--app-text-muted, var(--text-muted)); }
.alarm-empty-icon { font-size: 3rem; margin-bottom: var(--sp-md); }
.alarm-empty-text { font-size: 0.9rem; }
.clock-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.clock-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.clock-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); }
.clock-btn-sm { padding: var(--sp-sm) var(--sp-md); }
</style>
