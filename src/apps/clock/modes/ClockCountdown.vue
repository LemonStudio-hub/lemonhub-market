<template>
  <div class="clock-mode">
    <div class="clock-display">
      <div class="timer-inputs">
        <div class="timer-row">
          <label class="timer-label">Hours</label>
          <input v-model.number="hours" type="number" class="timer-num" min="0" max="99" />
        </div>
        <div class="timer-row">
          <label class="timer-label">Minutes</label>
          <input v-model.number="minutes" type="number" class="timer-num" min="0" max="59" />
        </div>
        <div class="timer-row">
          <label class="timer-label">Seconds</label>
          <input v-model.number="seconds" type="number" class="timer-num" min="0" max="59" />
        </div>
      </div>
      <div class="timer-display">
        <span class="timer-digit">{{ pad(hours) }}</span>
        <span class="timer-sep">:</span>
        <span class="timer-digit">{{ pad(minutes) }}</span>
        <span class="timer-sep">:</span>
        <span class="timer-digit">{{ pad(secondsLeft) }}</span>
      </div>
      <div v-if="finished" class="timer-finished">⏰ Time's up!</div>
    </div>
    <div class="clock-controls">
      <button class="clock-btn clock-btn-primary clock-btn-lg" @click="toggle">{{ running ? 'Pause' : (finished ? 'Reset' : 'Start') }}</button>
      <button class="clock-btn clock-btn-secondary clock-btn-lg" @click="reset">Reset</button>
    </div>
    <div class="timer-presets">
      <button v-for="p in presets" :key="p.label" class="preset-btn" @click="setPreset(p.s)">{{ p.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const hours = ref(0)
const minutes = ref(5)
const seconds = ref(0)
const secondsLeft = ref(0)
const running = ref(false)
const finished = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const totalSeconds = computed(() => hours.value * 3600 + minutes.value * 60 + seconds.value)
const presets = [{ label: '1m', s: 60 }, { label: '5m', s: 300 }, { label: '10m', s: 600 }, { label: '15m', s: 900 }, { label: '30m', s: 1800 }, { label: '1h', s: 3600 }]

function pad(n: number) { return n.toString().padStart(2, '0') }

function toggle() {
  if (finished.value) { reset(); return }
  if (totalSeconds.value <= 0 && !running.value) return
  if (secondsLeft.value === 0 && !running.value) secondsLeft.value = totalSeconds.value
  running.value = !running.value
  if (running.value) {
    timer = setInterval(() => {
      if (secondsLeft.value <= 0) { complete() }
      else secondsLeft.value--
    }, 1000)
  } else if (timer) { clearInterval(timer); timer = null }
}
function complete() {
  if (timer) clearInterval(timer); timer = null; running.value = false; finished.value = true
  try { new Notification('Countdown Timer', { body: 'Time is up!' }) } catch {}
}
function reset() {
  if (timer) clearInterval(timer); timer = null
  running.value = false; finished.value = false; secondsLeft.value = 0
}
function setPreset(s: number) { reset(); hours.value = Math.floor(s / 3600); minutes.value = Math.floor((s % 3600) / 60); seconds.value = s % 60 }
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.clock-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); gap: var(--sp-xl); }
.clock-display { display: flex; flex-direction: column; align-items: center; gap: var(--sp-xl); flex: 1; justify-content: center; }
.timer-inputs { display: flex; gap: var(--sp-md); }
.timer-row { display: flex; flex-direction: column; align-items: center; gap: var(--sp-xs); }
.timer-label { font-size: 0.7rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; }
.timer-num { width: 64px; padding: var(--sp-sm); text-align: center; font-size: 1.2rem; font-family: var(--font-mono); font-weight: 600; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.timer-num:focus { border-color: var(--app-primary, var(--accent-primary)); }
.timer-display { display: flex; align-items: center; gap: var(--sp-xs); }
.timer-digit { font-size: 2.8rem; font-weight: 700; font-family: var(--font-mono); min-width: 2.5ch; text-align: center; }
.timer-sep { font-size: 2.8rem; font-weight: 700; font-family: var(--font-mono); opacity: 0.5; }
.timer-finished { font-size: 1.2rem; font-weight: 600; color: var(--app-primary, var(--accent-primary)); animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.clock-controls { display: flex; gap: var(--sp-md); justify-content: center; }
.timer-presets { display: flex; flex-wrap: wrap; gap: var(--sp-sm); justify-content: center; }
.preset-btn { padding: var(--sp-xs) var(--sp-md); font-size: 0.8rem; font-weight: 500; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); cursor: pointer; transition: all var(--ease-fast); }
.preset-btn:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.clock-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.clock-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.clock-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.clock-btn-secondary { background: var(--app-surface, var(--bg-primary)); color: var(--app-text, var(--text-primary)); border: 1px solid var(--app-border, var(--border-primary)); }
.clock-btn-secondary:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.clock-btn-lg { padding: var(--sp-md) var(--sp-xl); min-height: 44px; font-size: 1rem; }
</style>
