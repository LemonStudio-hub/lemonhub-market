<template>
  <div class="clock-mode">
    <div class="clock-display">
      <div class="stopwatch-time">
        <span class="sw-min">{{ pad(minutes) }}</span>
        <span class="sw-sep">:</span>
        <span class="sw-sec">{{ pad(seconds) }}</span>
        <span class="sw-ms">.{{ padMs(ms) }}</span>
      </div>
    </div>
    <div class="clock-controls">
      <button class="clock-btn clock-btn-primary clock-btn-lg" @click="toggle">{{ running ? 'Stop' : 'Start' }}</button>
      <button class="clock-btn" :class="running ? 'clock-btn-secondary clock-btn-lg' : 'clock-btn-secondary clock-btn-lg'" @click="running ? lap() : reset()">{{ running ? 'Lap' : 'Reset' }}</button>
    </div>
    <div v-if="laps.length" class="sw-laps">
      <div class="sw-lap-header">
        <span>#</span><span>Lap Time</span><span>Total</span>
      </div>
      <div v-for="(lap, i) in laps" :key="i" class="sw-lap">
        <span class="sw-lap-num">{{ laps.length - i }}</span>
        <span class="sw-lap-time">{{ lap.time }}</span>
        <span class="sw-lap-total">{{ lap.total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const ms = ref(0)
const running = ref(false)
const laps = ref<{ time: string; total: string }[]>([])
let startTime = 0; let elapsed = 0; let raf: number | null = null; let lastLapTime = 0

const minutes = computed(() => Math.floor(ms.value / 60000))
const seconds = computed(() => Math.floor((ms.value % 60000) / 1000))

function pad(n: number) { return Math.floor(n).toString().padStart(2, '0') }
function padMs(n: number) { return Math.floor(n % 100).toString().padStart(2, '0') }
function fmt(ms: number) {
  const s = Math.floor(ms / 1000); const m = Math.floor(s / 60); const sec = s % 60
  return `${pad(m)}:${pad(sec)}.${padMs(ms)}`
}

function tick() {
  ms.value = elapsed + (performance.now() - startTime)
  raf = requestAnimationFrame(tick)
}

function toggle() {
  if (running.value) {
    cancelAnimationFrame(raf!); elapsed = ms.value; running.value = false
  } else {
    startTime = performance.now(); running.value = true; tick()
  }
}

function reset() {
  cancelAnimationFrame(raf!); elapsed = 0; ms.value = 0; running.value = false; laps.value = []; lastLapTime = 0
}

function lap() {
  const now = ms.value; const lapTime = now - lastLapTime
  laps.value.unshift({ time: fmt(lapTime), total: fmt(now) })
  lastLapTime = now
}

onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
</script>

<style scoped>
.clock-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); gap: var(--sp-xl); }
.clock-display { display: flex; align-items: center; justify-content: center; flex: 1; }
.stopwatch-time { display: flex; align-items: baseline; }
.sw-min { font-size: 3.5rem; font-weight: 700; font-family: var(--font-mono); }
.sw-sec { font-size: 3.5rem; font-weight: 700; font-family: var(--font-mono); }
.sw-ms { font-size: 1.8rem; font-weight: 600; font-family: var(--font-mono); opacity: 0.6; }
.sw-sep { font-size: 3.5rem; font-weight: 700; opacity: 0.5; margin: 0 4px; }
.clock-controls { display: flex; gap: var(--sp-md); justify-content: center; }
.clock-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.clock-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.clock-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.clock-btn-secondary { background: var(--app-surface, var(--bg-primary)); color: var(--app-text, var(--text-primary)); border: 1px solid var(--app-border, var(--border-primary)); }
.clock-btn-secondary:hover { border-color: var(--app-primary, var(--accent-primary)); color: var(--app-primary, var(--accent-primary)); }
.clock-btn-lg { padding: var(--sp-md) var(--sp-xl); min-height: 44px; font-size: 1rem; }
.sw-laps { max-height: 200px; overflow-y: auto; border-top: 1px solid var(--app-border, var(--border-primary)); }
.sw-lap-header, .sw-lap { display: grid; grid-template-columns: 40px 1fr 1fr; padding: var(--sp-sm) var(--sp-md); font-size: 0.85rem; font-family: var(--font-mono); }
.sw-lap-header { font-weight: 600; color: var(--app-text-muted, var(--text-muted)); font-size: 0.7rem; text-transform: uppercase; border-bottom: 1px solid var(--app-border, var(--border-primary)); }
.sw-lap { border-bottom: 1px solid var(--app-border-light, var(--border-secondary)); }
.sw-lap:first-child { color: var(--app-primary, var(--accent-primary)); font-weight: 600; }
.sw-lap-num { opacity: 0.5; }
</style>
