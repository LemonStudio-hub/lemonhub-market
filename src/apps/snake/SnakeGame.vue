<template>
  <div class="snake-app">
    <div class="snake-header">
      <span class="snake-score">Score: {{ score }}</span>
      <button class="app-btn app-btn-primary app-btn-sm" @click="startGame">
        {{ gameStatus === 'playing' ? 'Restart' : 'Start' }}
      </button>
      <span class="snake-best">Best: {{ best }}</span>
    </div>
    <div class="snake-board" ref="boardRef">
      <canvas ref="canvasRef" :width="gridSize * cellSize" :height="gridSize * cellSize" />
      <div v-if="gameStatus === 'idle'" class="snake-overlay">
        <p class="snake-overlay-text">Press Start to play</p>
      </div>
      <div v-if="gameStatus === 'over'" class="snake-overlay">
        <p class="snake-overlay-text">Game Over!</p>
        <p class="snake-overlay-score">Score: {{ score }}</p>
      </div>
    </div>
    <!-- Mobile Controls -->
    <div class="snake-controls mobile-only">
      <div class="snake-dpad">
        <button class="dpad-btn" @click="changeDir(0, -1)">▲</button>
        <div class="dpad-row">
          <button class="dpad-btn" @click="changeDir(-1, 0)">◀</button>
          <div class="dpad-center" />
          <button class="dpad-btn" @click="changeDir(1, 0)">▶</button>
        </div>
        <button class="dpad-btn" @click="changeDir(0, 1)">▼</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const GRID = 20
const CELL = 18
const SPEED = 120

type Dir = [number, number]

const canvasRef = ref<HTMLCanvasElement>()
const score = ref(0)
const best = ref(parseInt(localStorage.getItem('snake-best') || '0'))
const gameStatus = ref<'idle' | 'playing' | 'over'>('idle')

let snake: [number, number][] = [[10, 10]]
let food: [number, number] = [5, 5]
let dir: Dir = [1, 0]
let nextDir: Dir = [1, 0]
let interval: ReturnType<typeof setInterval> | null = null

const gridSize = GRID
const cellSize = CELL

function startGame() {
  snake = [[10, 10], [9, 10], [8, 10]]
  dir = [1, 0]
  nextDir = [1, 0]
  score.value = 0
  gameStatus.value = 'playing'
  placeFood()
  if (interval) clearInterval(interval)
  interval = setInterval(tick, SPEED)
}

function placeFood() {
  let pos: [number, number]
  do {
    pos = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)]
  } while (snake.some(([x, y]) => x === pos[0] && y === pos[1]))
  food = pos
}

function tick() {
  dir = [...nextDir]
  const head: [number, number] = [snake[0][0] + dir[0], snake[0][1] + dir[1]]

  // Wall collision
  if (head[0] < 0 || head[0] >= GRID || head[1] < 0 || head[1] >= GRID) return endGame()
  // Self collision
  if (snake.some(([x, y]) => x === head[0] && y === head[1])) return endGame()

  snake.unshift(head)

  if (head[0] === food[0] && head[1] === food[1]) {
    score.value++
    placeFood()
  } else {
    snake.pop()
  }

  draw()
}

function endGame() {
  gameStatus.value = 'over'
  if (interval) clearInterval(interval)
  interval = null
  if (score.value > best.value) {
    best.value = score.value
    localStorage.setItem('snake-best', String(best.value))
  }
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  // Background
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#f8fafc'
  ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize)

  // Grid lines
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-secondary').trim() || '#f1f5f9'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, GRID * cellSize)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(GRID * cellSize, i * cellSize)
    ctx.stroke()
  }

  // Food
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(food[0] * cellSize + cellSize / 2, food[1] * cellSize + cellSize / 2, cellSize / 2.5, 0, Math.PI * 2)
  ctx.fill()

  // Snake
  snake.forEach(([x, y], i) => {
    const hue = 145 + (i / snake.length) * 30
    ctx.fillStyle = i === 0 ? '#22c55e' : `hsl(${hue}, 70%, ${55 - i * 0.5}%)`
    const padding = 1
    ctx.beginPath()
    ctx.roundRect(x * cellSize + padding, y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2, 3)
    ctx.fill()
  })
}

function changeDir(dx: number, dy: number) {
  if (gameStatus.value !== 'playing') return
  if (dir[0] === -dx && dir[1] === -dy) return // prevent reverse
  nextDir = [dx, dy]
}

function handleKey(e: KeyboardEvent) {
  const map: Record<string, Dir> = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
  }
  const d = map[e.key]
  if (d) {
    e.preventDefault()
    changeDir(d[0], d[1])
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
  draw()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.snake-app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.snake-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-lg);
  padding: var(--sp-md);
}

.snake-score, .snake-best {
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-mono);
}

.snake-score { color: var(--app-primary, var(--accent-primary)); }
.snake-best { color: var(--app-warning, #f59e0b); }

.snake-board {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-md);
  position: relative;
}

canvas {
  border-radius: var(--radius-lg);
  border: 1px solid var(--app-border, var(--border-primary));
  box-shadow: var(--shadow-md);
}

.snake-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-lg);
}

.snake-overlay-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.snake-overlay-score {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-top: var(--sp-sm);
}

.snake-controls {
  padding: var(--sp-md);
  display: flex;
  justify-content: center;
}

.snake-dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dpad-row {
  display: flex;
  gap: 2px;
}

.dpad-btn {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  color: var(--app-text, var(--text-primary));
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dpad-btn:active {
  background: var(--app-primary, var(--accent-primary));
  color: white;
}

.dpad-center {
  width: 52px;
  height: 52px;
}

@media (min-width: 1024px) {
  .mobile-only { display: none; }
}
</style>
