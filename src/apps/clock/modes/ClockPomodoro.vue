<template>
  <div class="clock-mode">
    <div class="clock-display">
      <div class="clock-ring-wrap">
        <svg class="clock-ring" viewBox="0 0 120 120">
          <circle class="ring-bg" cx="60" cy="60" r="54" />
          <circle class="ring-fg" cx="60" cy="60" r="54"
            :stroke-dasharray="circ" :stroke-dashoffset="circ * (1 - progress)" />
        </svg>
        <div class="clock-time">{{ minutes.toString().padStart(2,'0') }}:{{ seconds.toString().padStart(2,'0') }}</div>
      </div>
      <div class="clock-modes">
        <button v-for="m in modeBtns" :key="m.id" class="clock-mode-btn" :class="{ active: pomodoroMode === m.id }" @click="setMode(m.id as 'focus'|'shortBreak'|'longBreak')">
          {{ m.label }}
        </button>
      </div>
      <div class="clock-session">
        <span v-for="i in 4" :key="i" class="session-dot" :class="{ filled: i <= sessions }">●</span>
      </div>
    </div>
    <div class="clock-controls">
      <button class="clock-btn clock-btn-primary clock-btn-lg" @click="toggle">{{ running ? 'Pause' : 'Start' }}</button>
      <button class="clock-btn clock-btn-secondary clock-btn-lg" @click="reset">Reset</button>
      <button class="clock-btn clock-btn-icon" @click="skip" title="Skip">⏭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const MODES = { focus: 25*60, shortBreak: 5*60, longBreak: 15*60 }
const modeBtns = [{ id: 'focus', label: 'Focus' }, { id: 'shortBreak', label: 'Short Break' }, { id: 'longBreak', label: 'Long Break' }]

const pomodoroMode = ref<'focus'|'shortBreak'|'longBreak'>('focus')
const timeLeft = ref(MODES.focus)
const running = ref(false)
const sessions = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const circ = 2 * Math.PI * 54
const progress = computed(() => 1 - timeLeft.value / MODES[pomodoroMode.value])
const minutes = computed(() => Math.floor(timeLeft.value / 60))
const seconds = computed(() => timeLeft.value % 60)

function toggle() {
  running.value = !running.value
  if (running.value) {
    timer = setInterval(() => {
      if (timeLeft.value <= 0) complete()
      else timeLeft.value--
    }, 1000)
  } else if (timer) { clearInterval(timer); timer = null }
}
function complete() {
  if (timer) clearInterval(timer); timer = null; running.value = false
  if (pomodoroMode.value === 'focus') sessions.value = Math.min(sessions.value + 1, 4)
  nextMode()
}
function nextMode() {
  if (pomodoroMode.value === 'focus') pomodoroMode.value = sessions.value >= 4 ? 'longBreak' : 'shortBreak'
  else { pomodoroMode.value = 'focus'; if (sessions.value >= 4) sessions.value = 0 }
  timeLeft.value = MODES[pomodoroMode.value]
}
function setMode(id: typeof pomodoroMode.value) { pomodoroMode.value = id; timeLeft.value = MODES[id]; if (running.value) toggle() }
function reset() { if (running.value) toggle(); timeLeft.value = MODES[pomodoroMode.value] }
function skip() { complete() }

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.clock-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); gap: var(--sp-xl); }
.clock-display { display: flex; flex-direction: column; align-items: center; gap: var(--sp-xl); flex: 1; justify-content: center; }
.clock-ring-wrap { position: relative; width: 200px; height: 200px; }
.clock-ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--app-border, var(--border-primary)); stroke-width: 6; }
.ring-fg { fill: none; stroke: var(--app-primary, var(--accent-primary)); stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }
.clock-time { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; font-weight: 700; font-family: var(--font-mono); }
.clock-modes { display: flex; gap: var(--sp-sm); background: var(--app-surface, var(--bg-primary)); padding: var(--sp-xs); border-radius: var(--radius-lg); border: 1px solid var(--app-border, var(--border-primary)); }
.clock-mode-btn { padding: var(--sp-sm) var(--sp-md); border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 500; color: var(--app-text-secondary, var(--text-muted)); transition: all var(--ease-fast); border: none; background: none; cursor: pointer; }
.clock-mode-btn.active { background: var(--app-primary, var(--accent-primary)); color: white; box-shadow: var(--shadow-sm); }
.clock-session { display: flex; gap: var(--sp-md); }
.session-dot { font-size: 0.9rem; color: var(--app-border, var(--border-primary)); transition: color var(--ease-base); }
.session-dot.filled { color: var(--app-primary, var(--accent-primary)); }
.clock-controls { display: flex; gap: var(--sp-md); justify-content: center; align-items: center; }
.clock-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.clock-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.clock-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.clock-btn-secondary { background: var(--app-surface, var(--bg-primary)); color: var(--app-text, var(--text-primary)); border: 1px solid var(--app-border, var(--border-primary)); }
.clock-btn-secondary:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.clock-btn-icon { width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border-radius: 50%; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); }
.clock-btn-icon:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.clock-btn-lg { padding: var(--sp-md) var(--sp-xl); min-height: 44px; font-size: 1rem; }
@media (max-width: 400px) { .clock-ring-wrap { width: 160px; height: 160px; } .clock-time { font-size: 2.2rem; } }
</style>
