<template>
  <div class="game-container">
    <div class="game-header">
      <span class="game-score">Score: {{ score }}</span>
      <button class="game-btn game-btn-primary" @click="newGame">New Game</button>
      <span class="game-best">Best: {{ best }}</span>
    </div>
    <div class="grid-2048" ref="gridRef">
      <div v-for="(row, r) in grid" :key="r" class="grid-row">
        <div v-for="(val, c) in row" :key="c" class="tile" :class="`tile-${val || 0}`">
          <span v-if="val" class="tile-num">{{ val }}</span>
        </div>
      </div>
    </div>
    <div class="game-dpad mobile-only">
      <button class="dpad-btn" @click="swipe('up')">▲</button>
      <div class="dpad-row">
        <button class="dpad-btn" @click="swipe('left')">◀</button>
        <div class="dpad-center" />
        <button class="dpad-btn" @click="swipe('right')">▶</button>
      </div>
      <button class="dpad-btn" @click="swipe('down')">▼</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const SIZE = 4; const gridRef = ref<HTMLDivElement>()
const grid = ref<number[][]>(Array.from({ length: SIZE }, () => Array(SIZE).fill(0)))
const score = ref(0); const best = ref(parseInt(localStorage.getItem('games-2048-best') || '0'))

function addRandom() {
  const empty: [number, number][] = []
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!grid.value[r][c]) empty.push([r, c])
  if (!empty.length) return
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  grid.value[r][c] = Math.random() < 0.9 ? 2 : 4
}

function newGame() {
  grid.value = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  score.value = 0; addRandom(); addRandom()
}

function slide(row: number[]): number[] {
  let arr = row.filter(v => v)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) { arr[i] *= 2; score.value += arr[i]; arr.splice(i + 1, 1) }
  }
  while (arr.length < SIZE) arr.push(0)
  return arr
}

function move(dir: 'up' | 'down' | 'left' | 'right') {
  const old = JSON.stringify(grid.value)

  if (dir === 'left') {
    for (let r = 0; r < SIZE; r++) grid.value[r] = slide(grid.value[r])
  } else if (dir === 'right') {
    for (let r = 0; r < SIZE; r++) grid.value[r] = slide(grid.value[r].reverse()).reverse()
  } else if (dir === 'up') {
    for (let c = 0; c < SIZE; c++) {
      let col = grid.value.map(r => r[c])
      col = slide(col)
      for (let r = 0; r < SIZE; r++) grid.value[r][c] = col[r]
    }
  } else if (dir === 'down') {
    for (let c = 0; c < SIZE; c++) {
      let col = grid.value.map(r => r[c]).reverse()
      col = slide(col).reverse()
      for (let r = 0; r < SIZE; r++) grid.value[r][c] = col[r]
    }
  }

  if (JSON.stringify(grid.value) !== old) addRandom()
  if (score.value > best.value) { best.value = score.value; localStorage.setItem('games-2048-best', String(best.value)) }
}

function swipe(dir: 'up' | 'down' | 'left' | 'right') { move(dir) }

let startX = 0; let startY = 0
function onTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; startY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - startX; const dy = e.changedTouches[0].clientY - startY
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
  if (Math.abs(dx) > Math.abs(dy)) swipe(dx > 0 ? 'right' : 'left')
  else swipe(dy > 0 ? 'down' : 'up')
}

function handleKey(e: KeyboardEvent) {
  const map: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
  }
  if (map[e.key]) { e.preventDefault(); swipe(map[e.key]) }
}

onMounted(() => {
  newGame()
  window.addEventListener('keydown', handleKey)
  const el = gridRef.value; if (el) { el.addEventListener('touchstart', onTouchStart); el.addEventListener('touchend', onTouchEnd) }
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  const el = gridRef.value; if (el) { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd) }
})
</script>

<style scoped>
.game-container { display: flex; flex-direction: column; height: 100%; width: 100%; max-width: 380px; margin: 0 auto; padding: var(--sp-md); }
.game-header { display: flex; align-items: center; justify-content: center; gap: var(--sp-lg); padding: var(--sp-sm); }
.game-score { font-size: 0.9rem; font-weight: 600; font-family: var(--font-mono); color: var(--app-primary, var(--accent-primary)); }
.game-best { font-size: 0.9rem; font-weight: 600; font-family: var(--font-mono); color: var(--app-warning, #f59e0b); }
.grid-2048 { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; touch-action: none; }
.grid-row { display: flex; gap: 8px; }
.tile {
  width: 72px; height: 72px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-lg); font-size: 1.3rem; font-weight: 700; font-family: var(--font-mono);
  background: var(--app-surface-hover, var(--bg-hover)); color: var(--app-text, var(--text-primary));
  margin: 4px; transition: all var(--ease-fast);
}
.tile-num { line-height: 1; }
.tile-2 { background: #eee4da; color: #776e65; }
.tile-4 { background: #ede0c8; color: #776e65; }
.tile-8 { background: #f2b179; color: white; }
.tile-16 { background: #f59563; color: white; }
.tile-32 { background: #f67c5f; color: white; }
.tile-64 { background: #f65e3b; color: white; }
.tile-128 { background: #edcf72; color: white; font-size: 1.1rem; }
.tile-256 { background: #edcc61; color: white; font-size: 1.1rem; }
.tile-512 { background: #edc850; color: white; font-size: 1.1rem; }
.tile-1024 { background: #edc53f; color: white; font-size: 0.9rem; }
.tile-2048 { background: #edc22e; color: white; font-size: 0.9rem; box-shadow: 0 0 20px rgba(237,194,46,0.5); }
.game-btn { padding: var(--sp-sm) var(--sp-lg); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease-fast); }
.game-btn-primary { background: var(--app-primary, var(--accent-primary)); color: white; }
.game-btn-primary:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.game-dpad { padding: var(--sp-md); }
.dpad-row { display: flex; gap: 2px; justify-content: center; }
.dpad-btn { width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); color: var(--app-text, var(--text-primary)); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
.dpad-btn:active { background: var(--app-primary, var(--accent-primary)); color: white; }
.dpad-center { width: 52px; height: 52px; }
@media (min-width: 1024px) { .mobile-only { display: none; } }
@media (max-width: 360px) {
  .tile { width: 60px; height: 60px; font-size: 1rem; margin: 3px; }
  .tile-128, .tile-256, .tile-512 { font-size: 0.9rem; }
  .tile-1024, .tile-2048 { font-size: 0.75rem; }
}
</style>
