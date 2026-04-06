<template>
  <div class="game-container">
    <div class="game-header">
      <span class="game-score">Score: {{ score }}</span>
      <button class="game-btn game-btn-primary" @click="startGame">{{ gameStatus === 'playing' ? 'Restart' : 'Start' }}</button>
      <span class="game-best">Lines: {{ lines }}</span>
    </div>
    <div class="tetris-layout">
      <div class="tetris-side">
        <div class="tetris-next">
          <span class="next-label">Next</span>
          <canvas ref="nextRef" width="80" height="80" />
        </div>
        <div class="tetris-info">
          <p>Level: {{ level }}</p>
          <p>Lines: {{ lines }}</p>
        </div>
      </div>
      <div class="game-board-wrap">
        <canvas ref="canvasRef" :width="COLS * CELL" :height="ROWS * CELL" />
        <div v-if="gameStatus === 'idle'" class="game-overlay"><p>Press Start</p></div>
        <div v-if="gameStatus === 'over'" class="game-overlay"><p>Game Over!<br><small>Score: {{ score }}</small></p></div>
      </div>
    </div>
    <div class="game-dpad mobile-only">
      <div class="dpad-row-tetris">
        <button class="dpad-btn" @click="rotate">↻</button>
        <button class="dpad-btn" @click="move(0, -1)">▲</button>
        <button class="dpad-btn" @click="hardDrop">⏬</button>
      </div>
      <div class="dpad-row">
        <button class="dpad-btn" @click="move(-1, 0)">◀</button>
        <div class="dpad-center" />
        <button class="dpad-btn" @click="move(1, 0)">▶</button>
      </div>
      <div class="dpad-row"><button class="dpad-btn" @click="move(0, 1)">▼</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const COLS = 10; const ROWS = 20; const CELL = 22
const canvasRef = ref<HTMLCanvasElement>(); const nextRef = ref<HTMLCanvasElement>()
const score = ref(0); const lines = ref(0); const level = ref(1)
const gameStatus = ref<'idle' | 'playing' | 'over'>('idle')

const SHAPES: number[][][] = [
  [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]],
]
const COLORS = ['#06b6d4','#eab308','#a855f7','#f97316','#3b82f6','#22c55e','#ef4444']

let board: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
let boardColors: string[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(''))
let piece: number[][] = []; let pieceColor = ''; let px = 0; let py = 0
let nextPiece: number[][] = []; let nextColor = ''
let interval: ReturnType<typeof setInterval> | null = null

function randPiece() {
  const i = Math.floor(Math.random() * SHAPES.length)
  return { shape: SHAPES[i].map(r => [...r]), color: COLORS[i] }
}

function collides(p: number[][], x: number, y: number) {
  for (let r = 0; r < p.length; r++)
    for (let c = 0; c < p[r].length; c++)
      if (p[r][c] && (y + r < 0 || y + r >= ROWS || x + c < 0 || x + c >= COLS || board[y + r][x + c]))
        return true
  return false
}

function merge() {
  for (let r = 0; r < piece.length; r++)
    for (let c = 0; c < piece[r].length; c++)
      if (piece[r][c]) { board[py + r][px + c] = 1; boardColors[py + r][px + c] = pieceColor }
}

function clearLines() {
  let cleared = 0
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c)) {
      board.splice(r, 1); boardColors.splice(r, 1)
      board.unshift(Array(COLS).fill(0)); boardColors.unshift(Array(COLS).fill(''))
      cleared++; r++
    }
  }
  if (cleared) {
    const pts = [0, 100, 300, 500, 800]; score.value += (pts[cleared] || 800) * level.value
    lines.value += cleared; level.value = Math.floor(lines.value / 10) + 1
    restartInterval()
  }
}

function spawn() {
  if (nextPiece.length) { piece = nextPiece; pieceColor = nextColor }
  else { const p = randPiece(); piece = p.shape; pieceColor = p.color }
  const n = randPiece(); nextPiece = n.shape; nextColor = n.color
  px = Math.floor((COLS - piece[0].length) / 2); py = 0
  if (collides(piece, px, py)) { gameStatus.value = 'over'; if (interval) clearInterval(interval); interval = null }
}

function move(dx: number, dy: number) {
  if (gameStatus.value !== 'playing') return
  if (!collides(piece, px + dx, py + dy)) { px += dx; py += dy; draw() }
  else if (dy > 0) { merge(); clearLines(); spawn(); draw() }
}

function rotate() {
  if (gameStatus.value !== 'playing') return
  const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse())
  if (!collides(rotated, px, py)) { piece = rotated; draw() }
}

function hardDrop() {
  if (gameStatus.value !== 'playing') return
  while (!collides(piece, px, py + 1)) py++
  merge(); clearLines(); spawn(); draw()
}

function tick() { move(0, 1) }

function restartInterval() {
  if (interval) clearInterval(interval)
  interval = setInterval(tick, Math.max(50, 500 - (level.value - 1) * 40))
}

function startGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  boardColors = Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  score.value = 0; lines.value = 0; level.value = 1; gameStatus.value = 'playing'
  nextPiece = []; nextColor = ''; spawn(); restartInterval(); draw()
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d'); if (!ctx) return
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#f8fafc'
  const grid = getComputedStyle(document.documentElement).getPropertyValue('--border-secondary').trim() || '#f1f5f9'
  ctx.fillStyle = bg; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)
  ctx.strokeStyle = grid; ctx.lineWidth = 0.5
  for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(COLS * CELL, r * CELL); ctx.stroke() }
  for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, ROWS * CELL); ctx.stroke() }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c]) { ctx.fillStyle = boardColors[r][c]; ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2) }
  for (let r = 0; r < piece.length; r++)
    for (let c = 0; c < piece[r].length; c++)
      if (piece[r][c]) { ctx.fillStyle = pieceColor; ctx.fillRect((px + c) * CELL + 1, (py + r) * CELL + 1, CELL - 2, CELL - 2) }
  // Ghost
  let gy = py; while (!collides(piece, px, gy + 1)) gy++
  if (gy !== py) {
    ctx.globalAlpha = 0.2; ctx.fillStyle = pieceColor
    for (let r = 0; r < piece.length; r++)
      for (let c = 0; c < piece[r].length; c++)
        if (piece[r][c]) ctx.fillRect((px + c) * CELL + 1, (gy + r) * CELL + 1, CELL - 2, CELL - 2)
    ctx.globalAlpha = 1
  }
  // Next piece
  const nctx = nextRef.value?.getContext('2d'); if (nctx && nextPiece.length) {
    nctx.clearRect(0, 0, 80, 80)
    const ox = (80 - nextPiece[0].length * 18) / 2; const oy = (80 - nextPiece.length * 18) / 2
    nctx.fillStyle = nextColor
    for (let r = 0; r < nextPiece.length; r++)
      for (let c = 0; c < nextPiece[r].length; c++)
        if (nextPiece[r][c]) nctx.fillRect(ox + c * 18 + 1, oy + r * 18 + 1, 16, 16)
  }
}

function handleKey(e: KeyboardEvent) {
  const map: Record<string, () => void> = {
    ArrowLeft: () => move(-1, 0), ArrowRight: () => move(1, 0), ArrowDown: () => move(0, 1),
    ArrowUp: rotate, ' ': hardDrop,
  }
  if (map[e.key]) { e.preventDefault(); map[e.key]() }
}

onMounted(() => { window.addEventListener('keydown', handleKey); draw() })
onUnmounted(() => { window.removeEventListener('keydown', handleKey); if (interval) clearInterval(interval) })
</script>

<style scoped>
.game-container { display: flex; flex-direction: column; height: 100%; width: 100%; max-width: 400px; margin: 0 auto; padding: var(--sp-md); }
.game-header { display: flex; align-items: center; justify-content: center; gap: var(--sp-lg); padding: var(--sp-sm); }
.game-score { font-size: 0.9rem; font-weight: 600; font-family: var(--font-mono); color: var(--app-primary, var(--accent-primary)); }
.game-best { font-size: 0.9rem; font-weight: 600; font-family: var(--font-mono); color: var(--app-warning, #f59e0b); }
.tetris-layout { display: flex; gap: var(--sp-md); flex: 1; min-height: 0; align-items: flex-start; }
.tetris-side { display: flex; flex-direction: column; gap: var(--sp-md); min-width: 80px; }
.tetris-next { background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-lg); padding: var(--sp-sm); text-align: center; }
.next-label { font-size: 0.7rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; }
.tetris-info { font-size: 0.75rem; color: var(--app-text-secondary, var(--text-muted)); }
.tetris-info p { margin: var(--sp-xs) 0; }
.game-board-wrap { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; }
canvas { border-radius: var(--radius-lg); border: 1px solid var(--app-border, var(--border-primary)); box-shadow: var(--shadow-md); max-width: 100%; max-height: 100%; }
.game-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); border-radius: var(--radius-lg); color: white; font-size: 1.2rem; font-weight: 700; text-align: center; }
.game-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.game-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.game-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.game-dpad { padding: var(--sp-md); }
.dpad-row, .dpad-row-tetris { display: flex; gap: 2px; justify-content: center; }
.dpad-btn { width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text, var(--text-primary)); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
.dpad-btn:active { background: var(--app-primary, var(--accent-primary)); color: white; }
.dpad-center { width: 52px; height: 52px; }
@media (min-width: 1024px) { .mobile-only { display: none; } }
</style>
