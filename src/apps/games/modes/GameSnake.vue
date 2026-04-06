<template>
  <div class="game-container">
    <div class="game-header">
      <span class="game-score">Score: {{ score }}</span>
      <button class="game-btn game-btn-primary" @click="startGame">
        {{ gameStatus === 'playing' ? 'Restart' : 'Start' }}
      </button>
      <span class="game-best">Best: {{ best }}</span>
    </div>
    <div class="game-board-wrap">
      <canvas ref="canvasRef" :width="GRID * CELL" :height="GRID * CELL" />
      <div v-if="gameStatus === 'idle'" class="game-overlay"><p>Press Start to play</p></div>
      <div v-if="gameStatus === 'over'" class="game-overlay"><p>Game Over!<br><small>Score: {{ score }}</small></p></div>
    </div>
    <div class="game-dpad mobile-only">
      <button class="dpad-btn" @click="changeDir(0, -1)">▲</button>
      <div class="dpad-row">
        <button class="dpad-btn" @click="changeDir(-1, 0)">◀</button>
        <div class="dpad-center" />
        <button class="dpad-btn" @click="changeDir(1, 0)">▶</button>
      </div>
      <button class="dpad-btn" @click="changeDir(0, 1)">▼</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const GRID = 20; const CELL = 18; const SPEED = 120
type Dir = [number, number]

const canvasRef = ref<HTMLCanvasElement>()
const score = ref(0)
const best = ref(parseInt(localStorage.getItem('games-snake-best') || '0'))
const gameStatus = ref<'idle' | 'playing' | 'over'>('idle')

let snake: [number, number][] = [[10, 10]]
let food: [number, number] = [5, 5]
let dir: Dir = [1, 0]; let nextDir: Dir = [1, 0]
let interval: ReturnType<typeof setInterval> | null = null

function startGame() {
  snake = [[10, 10], [9, 10], [8, 10]]; dir = [1, 0]; nextDir = [1, 0]
  score.value = 0; gameStatus.value = 'playing'; placeFood()
  if (interval) clearInterval(interval)
  interval = setInterval(tick, SPEED)
}

function placeFood() {
  let pos: [number, number]
  do { pos = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)] }
  while (snake.some(([x, y]) => x === pos[0] && y === pos[1]))
  food = pos
}

function tick() {
  dir = [...nextDir]
  const head: [number, number] = [snake[0][0] + dir[0], snake[0][1] + dir[1]]
  if (head[0] < 0 || head[0] >= GRID || head[1] < 0 || head[1] >= GRID) return endGame()
  if (snake.some(([x, y]) => x === head[0] && y === head[1])) return endGame()
  snake.unshift(head)
  if (head[0] === food[0] && head[1] === food[1]) { score.value++; placeFood() } else snake.pop()
  draw()
}

function endGame() {
  gameStatus.value = 'over'; if (interval) clearInterval(interval); interval = null
  if (score.value > best.value) { best.value = score.value; localStorage.setItem('games-snake-best', String(best.value)) }
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d'); if (!ctx) return
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#f8fafc'
  const grid = getComputedStyle(document.documentElement).getPropertyValue('--border-secondary').trim() || '#f1f5f9'
  ctx.fillStyle = bg; ctx.fillRect(0, 0, GRID * CELL, GRID * CELL)
  ctx.strokeStyle = grid; ctx.lineWidth = 0.5
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, GRID * CELL); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(GRID * CELL, i * CELL); ctx.stroke()
  }
  ctx.fillStyle = '#ef4444'; ctx.beginPath()
  ctx.arc(food[0] * CELL + CELL / 2, food[1] * CELL + CELL / 2, CELL / 2.5, 0, Math.PI * 2); ctx.fill()
  snake.forEach(([x, y], i) => {
    ctx.fillStyle = i === 0 ? '#22c55e' : `hsl(${145 + (i / snake.length) * 30}, 70%, ${55 - i * 0.5}%)`
    ctx.beginPath()
    ctx.roundRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2, 3); ctx.fill()
  })
}

function changeDir(dx: number, dy: number) {
  if (gameStatus.value !== 'playing') return
  if (dir[0] === -dx && dir[1] === -dy) return
  nextDir = [dx, dy]
}

function handleKey(e: KeyboardEvent) {
  const map: Record<string, Dir> = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
  }
  const d = map[e.key]; if (d) { e.preventDefault(); changeDir(d[0], d[1]) }
}

onMounted(() => { window.addEventListener('keydown', handleKey); draw() })
onUnmounted(() => { window.removeEventListener('keydown', handleKey); if (interval) clearInterval(interval) })
</script>

<style scoped>
.game-container { display: flex; flex-direction: column; height: 100%; width: 100%; max-width: 420px; margin: 0 auto; padding: var(--sp-md); }
.game-header { display: flex; align-items: center; justify-content: center; gap: var(--sp-lg); padding: var(--sp-sm); }
.game-score { font-size: 0.9rem; font-weight: 600; font-family: var(--font-mono); color: var(--app-primary, var(--accent-primary)); }
.game-best { font-size: 0.9rem; font-weight: 600; font-family: var(--font-mono); color: var(--app-warning, #f59e0b); }
.game-board-wrap { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; }
canvas { border-radius: var(--radius-lg); border: 1px solid var(--app-border, var(--border-primary)); box-shadow: var(--shadow-md); max-width: 100%; max-height: 100%; }
.game-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); border-radius: var(--radius-lg); color: white; font-size: 1.2rem; font-weight: 700; text-align: center; }
.game-dpad { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: var(--sp-md); }
.dpad-row { display: flex; gap: 2px; }
.dpad-btn { width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text, var(--text-primary)); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
.dpad-btn:active { background: var(--app-primary, var(--accent-primary)); color: white; }
.dpad-center { width: 52px; height: 52px; }
.game-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.game-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.game-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); transform: translateY(-1px); box-shadow: var(--shadow-md); }
@media (min-width: 1024px) { .mobile-only { display: none; } }
</style>
