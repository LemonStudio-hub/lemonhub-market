<template>
  <div class="pomodoro-app">
    <div class="pomo-display">
      <div class="pomo-modes">
        <button
          v-for="m in modes"
          :key="m.id"
          class="pomo-mode"
          :class="{ active: currentMode === m.id }"
          @click="switchMode(m.id as 'focus' | 'shortBreak' | 'longBreak')"
        >
          {{ m.label }}
        </button>
      </div>

      <div class="pomo-timer">
        <svg class="pomo-ring" viewBox="0 0 120 120">
          <circle class="pomo-ring-bg" cx="60" cy="60" r="54" />
          <circle
            class="pomo-ring-progress"
            cx="60"
            cy="60"
            r="54"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div class="pomo-time">
          <span class="pomo-minutes">{{ minutes.toString().padStart(2, '0') }}</span>
          <span class="pomo-sep">:</span>
          <span class="pomo-seconds">{{ seconds.toString().padStart(2, '0') }}</span>
        </div>
      </div>

      <div class="pomo-session">
        <span v-for="i in 4" :key="i" class="pomo-dot" :class="{ filled: i <= completedSessions }">●</span>
      </div>

      <div class="pomo-controls">
        <button class="app-btn app-btn-primary app-btn-lg pomo-btn-start" @click="toggleTimer">
          {{ isRunning ? 'Pause' : 'Start' }}
        </button>
        <button class="app-btn app-btn-secondary app-btn-lg" @click="resetTimer">
          Reset
        </button>
        <button class="app-btn app-btn-ghost app-btn-icon" @click="skipSession" title="Skip">
          ⏭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60 },
  shortBreak: { label: 'Short Break', duration: 5 * 60 },
  longBreak: { label: 'Long Break', duration: 15 * 60 },
}

const modes = [
  { id: 'focus', label: 'Focus' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
]

const currentMode = ref<'focus' | 'shortBreak' | 'longBreak'>('focus')
const timeLeft = ref(MODES.focus.duration)
const isRunning = ref(false)
const completedSessions = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

const circumference = 2 * Math.PI * 54
const progress = computed(() => 1 - timeLeft.value / MODES[currentMode.value].duration)
const dashOffset = computed(() => circumference * (1 - progress.value))

const minutes = computed(() => Math.floor(timeLeft.value / 60))
const seconds = computed(() => timeLeft.value % 60)

function toggleTimer() {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    timer = setInterval(() => {
      if (timeLeft.value <= 0) {
        completeSession()
      } else {
        timeLeft.value--
      }
    }, 1000)
  } else if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function completeSession() {
  if (timer) clearInterval(timer)
  timer = null
  isRunning.value = false

  if (currentMode.value === 'focus') {
    completedSessions.value = Math.min(completedSessions.value + 1, 4)
  }
  autoNextMode()
}

function autoNextMode() {
  if (currentMode.value === 'focus') {
    currentMode.value = completedSessions.value >= 4 ? 'longBreak' : 'shortBreak'
  } else {
    currentMode.value = 'focus'
    if (completedSessions.value >= 4) completedSessions.value = 0
  }
  timeLeft.value = MODES[currentMode.value].duration
}

function switchMode(mode: typeof currentMode.value) {
  currentMode.value = mode
  timeLeft.value = MODES[mode].duration
  if (isRunning.value) toggleTimer()
}

function resetTimer() {
  if (isRunning.value) toggleTimer()
  timeLeft.value = MODES[currentMode.value].duration
}

function skipSession() {
  completeSession()
}

watch(currentMode, () => {
  if (isRunning.value) toggleTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.pomodoro-app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pomo-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--sp-xl);
  gap: var(--sp-xl);
}

.pomo-modes {
  display: flex;
  gap: var(--sp-sm);
  background: var(--app-surface, var(--bg-primary));
  padding: var(--sp-xs);
  border-radius: var(--radius-lg);
  border: 1px solid var(--app-border, var(--border-primary));
}

.pomo-mode {
  padding: var(--sp-sm) var(--sp-md);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--app-text-secondary, var(--text-muted));
  transition: all var(--ease-fast);
}

.pomo-mode:hover {
  color: var(--app-text, var(--text-primary));
}

.pomo-mode.active {
  background: var(--app-primary, var(--accent-primary));
  color: white;
  box-shadow: var(--shadow-sm);
}

.pomo-timer {
  position: relative;
  width: 200px;
  height: 200px;
}

.pomo-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.pomo-ring-bg {
  fill: none;
  stroke: var(--app-border, var(--border-primary));
  stroke-width: 6;
}

.pomo-ring-progress {
  fill: none;
  stroke: var(--app-primary, var(--accent-primary));
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.pomo-time {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--app-text, var(--text-primary));
}

.pomo-sep {
  opacity: 0.5;
  margin: 0 2px;
}

.pomo-session {
  display: flex;
  gap: var(--sp-md);
}

.pomo-dot {
  font-size: 0.9rem;
  color: var(--app-border, var(--border-primary));
  transition: color var(--ease-base);
}

.pomo-dot.filled {
  color: var(--app-primary, var(--accent-primary));
}

.pomo-controls {
  display: flex;
  gap: var(--sp-md);
  align-items: center;
}

@media (max-width: 400px) {
  .pomo-timer { width: 160px; height: 160px; }
  .pomo-time { font-size: 2.2rem; }
}
</style>
