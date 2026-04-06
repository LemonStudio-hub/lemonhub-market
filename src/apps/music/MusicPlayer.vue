<template>
  <div class="music-app">
    <!-- Now Playing -->
    <div class="music-player">
      <div class="music-artwork" :style="{ background: currentTrack?.color || 'var(--accent-primary)' }">
        <div class="music-vinyl" :class="{ spinning: isPlaying }">
          <MusicNoteIcon :size="48" />
        </div>
      </div>

      <div class="music-info">
        <h3 class="music-title">{{ currentTrack?.title || 'Select a track' }}</h3>
        <p class="music-artist">{{ currentTrack?.artist || 'LemonHub Music' }}</p>
      </div>

      <!-- Progress -->
      <div class="music-progress">
        <div class="music-progress-bar" @click="seek">
          <div class="music-progress-fill" :style="{ width: progressPercent + '%' }" />
        </div>
        <div class="music-times">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(currentTrack?.duration || 0) }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="music-controls">
        <button class="music-ctrl-btn" :class="{ active: isShuffled }" @click="toggleShuffle">🔀</button>
        <button class="music-ctrl-btn" @click="prevTrack">⏮</button>
        <button class="music-ctrl-btn music-ctrl-play" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶️' }}
        </button>
        <button class="music-ctrl-btn" @click="nextTrack">⏭</button>
        <button class="music-ctrl-btn" :class="{ active: isLooping }" @click="toggleLoop">🔁</button>
      </div>

      <!-- Volume -->
      <div class="music-volume">
        <span class="vol-icon">🔊</span>
        <input
          type="range"
          class="vol-slider"
          min="0" max="100"
          v-model.number="volume"
        />
      </div>
    </div>

    <!-- Playlist -->
    <div class="music-playlist">
      <h4 class="playlist-title">Playlist</h4>
      <div
        v-for="(track, i) in tracks"
        :key="track.id"
        class="playlist-item"
        :class="{ active: currentTrack?.id === track.id }"
        @click="playTrack(i)"
      >
        <span class="playlist-num">{{ i + 1 }}</span>
        <div class="playlist-info">
          <span class="playlist-name">{{ track.title }}</span>
          <span class="playlist-artist">{{ track.artist }}</span>
        </div>
        <span class="playlist-duration">{{ formatTime(track.duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  color: string
}

const tracks: Track[] = [
  { id: 't1', title: 'Morning Light', artist: 'Ambient Flow', duration: 185, color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 't2', title: 'Ocean Waves', artist: 'Nature Sounds', duration: 240, color: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
  { id: 't3', title: 'City Nights', artist: 'Lo-Fi Beats', duration: 198, color: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 't4', title: 'Forest Walk', artist: 'Calm Vibes', duration: 220, color: 'linear-gradient(135deg, #22c55e, #14b8a6)' },
  { id: 't5', title: 'Stargazing', artist: 'Deep Space', duration: 310, color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 't6', title: 'Coffee Shop', artist: 'Jazz Collective', duration: 175, color: 'linear-gradient(135deg, #a855f7, #ec4899)' },
]

const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const volume = ref(80)
const isShuffled = ref(false)
const isLooping = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

const currentTrack = computed(() => tracks[currentIndex.value] ?? null)
const progressPercent = computed(() => currentTrack.value ? (currentTime.value / currentTrack.value.duration) * 100 : 0)

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    timer = setInterval(() => {
      if (currentTime.value >= (currentTrack.value?.duration ?? 0)) {
        nextTrack()
      } else {
        currentTime.value++
      }
    }, 1000)
  } else if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function playTrack(index: number) {
  currentIndex.value = index
  currentTime.value = 0
  if (!isPlaying.value) togglePlay()
}

function nextTrack() {
  if (isLooping.value) {
    currentTime.value = 0
  } else if (isShuffled.value) {
    let next: number
    do { next = Math.floor(Math.random() * tracks.length) } while (next === currentIndex.value && tracks.length > 1)
    currentIndex.value = next
    currentTime.value = 0
  } else {
    currentIndex.value = (currentIndex.value + 1) % tracks.length
    currentTime.value = 0
  }
}

function prevTrack() {
  if (currentTime.value > 5) {
    currentTime.value = 0
  } else {
    currentIndex.value = (currentIndex.value - 1 + tracks.length) % tracks.length
    currentTime.value = 0
  }
}

function toggleShuffle() { isShuffled.value = !isShuffled.value }
function toggleLoop() { isLooping.value = !isLooping.value }

function seek(e: MouseEvent) {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  if (currentTrack.value) currentTime.value = Math.floor(pct * currentTrack.value.duration)
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.music-app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.music-player {
  padding: var(--sp-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-lg);
}

.music-artwork {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xl);
}

.music-vinyl {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.music-vinyl.spinning {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.music-info { text-align: center; }

.music-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 var(--sp-xs) 0;
}

.music-artist {
  font-size: 0.8rem;
  color: var(--app-text-secondary, var(--text-muted));
  margin: 0;
}

.music-progress {
  width: 100%;
  max-width: 320px;
}

.music-progress-bar {
  height: 4px;
  background: var(--app-border, var(--border-primary));
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
}

.music-progress-fill {
  height: 100%;
  background: var(--app-primary, var(--accent-primary));
  border-radius: 2px;
  transition: width 0.3s ease;
}

.music-times {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--app-text-muted, var(--text-muted));
  margin-top: var(--sp-xs);
}

.music-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-lg);
}

.music-ctrl-btn {
  font-size: 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--ease-fast);
  padding: var(--sp-sm);
}

.music-ctrl-btn:hover { opacity: 1; }
.music-ctrl-btn.active { opacity: 1; }

.music-ctrl-play {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--app-primary, var(--accent-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  font-size: 1.3rem;
}

.music-volume {
  display: flex;
  align-items: center;
  gap: var(--sp-sm);
  width: 100%;
  max-width: 200px;
}

.vol-icon { font-size: 0.9rem; }

.vol-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--app-border, var(--border-primary));
  border-radius: 2px;
  outline: none;
}

.vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--app-primary, var(--accent-primary));
  cursor: pointer;
}

.music-playlist {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--sp-md) var(--sp-md);
  border-top: 1px solid var(--app-border, var(--border-primary));
}

.playlist-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--app-text-muted, var(--text-muted));
  padding: var(--sp-md) 0;
  margin: 0;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: var(--sp-md);
  padding: var(--sp-sm) var(--sp-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--ease-fast);
}

.playlist-item:hover { background: var(--app-surface-hover, var(--bg-hover)); }

.playlist-item.active {
  background: var(--app-primary, var(--accent-primary));
  color: white;
}

.playlist-item.active .playlist-artist { color: rgba(255, 255, 255, 0.7); }

.playlist-num {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--app-text-muted, var(--text-muted));
  width: 20px;
  text-align: center;
}

.playlist-info { flex: 1; min-width: 0; }

.playlist-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-artist {
  display: block;
  font-size: 0.7rem;
  color: var(--app-text-secondary, var(--text-muted));
}

.playlist-duration {
  font-size: 0.7rem;
  color: var(--app-text-muted, var(--text-muted));
  font-family: var(--font-mono);
}

@media (max-width: 400px) {
  .music-artwork { width: 110px; height: 110px; }
  .music-vinyl { width: 80px; height: 80px; }
}
</style>
