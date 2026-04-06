<template>
  <div class="tool-panel">
    <div class="tool-btns">
      <button class="tool-btn" @click="hash('SHA-1')">SHA-1</button>
      <button class="tool-btn" @click="hash('SHA-256')">SHA-256</button>
      <button class="tool-btn" @click="hash('SHA-384')">SHA-384</button>
      <button class="tool-btn" @click="hash('SHA-512')">SHA-512</button>
    </div>
    <div v-for="h in hashes" :key="h.algo" class="hash-result">
      <span class="hash-label">{{ h.algo }}</span>
      <code class="hash-value" @click="copyHash(h.hash)" :title="'Click to copy'">{{ h.hash }}</code>
      <button class="hash-copy-btn" @click="copyHash(h.hash)">📋</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const model = defineModel<string>({ default: '' })
const hashes = ref<{ algo: string; hash: string }[]>([])

async function hash(algo: string) {
  if (!model.value) return
  const encoder = new TextEncoder()
  const data = encoder.encode(model.value)
  const buffer = await crypto.subtle.digest(algo.replace('-', ''), data)
  const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  const existing = hashes.value.findIndex(h => h.algo === algo)
  if (existing >= 0) hashes.value[existing].hash = hex
  else hashes.value.push({ algo, hash: hex })
}

async function copyHash(hash: string) {
  try { await navigator.clipboard.writeText(hash) } catch {}
}
</script>

<style scoped>
.tool-panel { display: flex; flex-direction: column; gap: var(--sp-sm); }
.tool-btns { display: flex; flex-wrap: wrap; gap: var(--sp-xs); }
.tool-btn {
  padding: var(--sp-xs) var(--sp-sm);
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md);
  color: var(--app-text, var(--text-primary));
  cursor: pointer;
  transition: all var(--ease-fast);
  font-family: var(--font-mono);
}
.tool-btn:hover { background: var(--app-primary, var(--accent-primary)); color: white; border-color: var(--app-primary, var(--accent-primary)); }
.hash-result { display: flex; align-items: center; gap: var(--sp-sm); padding: var(--sp-sm); background: var(--app-tertiary, var(--bg-tertiary)); border-radius: var(--radius-md); }
.hash-label { font-size: 0.7rem; font-weight: 600; color: var(--app-text-muted, var(--text-muted)); min-width: 60px; text-transform: uppercase; }
.hash-value { flex: 1; font-size: 0.72rem; font-family: var(--font-mono); word-break: break-all; cursor: pointer; color: var(--app-text, var(--text-primary)); }
.hash-value:hover { color: var(--app-primary, var(--accent-primary)); }
.hash-copy-btn { background: none; border: none; cursor: pointer; font-size: 0.9rem; opacity: 0.5; }
.hash-copy-btn:hover { opacity: 1; }
</style>
