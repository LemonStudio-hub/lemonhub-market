<template>
  <div class="tool-panel">
    <p class="tool-desc">Enter original text in the editor, then paste modified text below to see differences.</p>
    <textarea v-model="textB" class="diff-input" placeholder="Paste modified text here..." />
    <button class="tool-btn diff-btn" @click="computeDiff">Compare Diff</button>
    <div v-if="diffHtml" class="diff-output" v-html="diffHtml" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const model = defineModel<string>({ default: '' })
const textB = ref('')
const diffHtml = ref('')

function computeDiff() {
  const a = model.value.split('\n')
  const b = textB.value.split('\n')
  const maxLen = Math.max(a.length, b.length)
  const lines: string[] = []

  for (let i = 0; i < maxLen; i++) {
    const lineA = a[i]
    const lineB = b[i]
    const num = (i + 1).toString().padStart(3, ' ')

    if (lineA === lineB && lineA !== undefined) {
      lines.push(`<div class="diff-line"><span class="diff-num">${num}</span><span class="diff-text">${esc(lineA)}</span></div>`)
    } else {
      if (lineA !== undefined) lines.push(`<div class="diff-line diff-removed"><span class="diff-num">${num}</span><span class="diff-marker">- </span><span class="diff-text">${esc(lineA)}</span></div>`)
      if (lineB !== undefined && lineB !== lineA) lines.push(`<div class="diff-line diff-added"><span class="diff-num">${num}</span><span class="diff-marker">+ </span><span class="diff-text">${esc(lineB)}</span></div>`)
    }
  }

  diffHtml.value = lines.join('') || '<p class="diff-empty">No differences found</p>'
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>

<style scoped>
.tool-panel { display: flex; flex-direction: column; gap: var(--sp-sm); }
.tool-desc { font-size: 0.8rem; color: var(--app-text-muted, var(--text-muted)); margin: 0; }
.diff-input { width: 100%; min-height: 80px; padding: var(--sp-sm); font-size: 0.85rem; font-family: var(--font-mono); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; resize: vertical; }
.diff-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.diff-btn { width: 100%; padding: var(--sp-sm); font-size: 0.85rem; font-weight: 600; background: var(--app-primary, var(--accent-primary)); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; }
.diff-btn:hover { background: var(--app-primary-dark, var(--accent-primary-dark)); }
.diff-output { max-height: 200px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.78rem; border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); }
.diff-line { display: flex; padding: 2px var(--sp-sm); gap: var(--sp-sm); border-bottom: 1px solid var(--app-border-light, var(--border-secondary)); }
.diff-num { color: var(--app-text-muted, var(--text-muted)); min-width: 30px; text-align: right; flex-shrink: 0; }
.diff-marker { font-weight: 700; flex-shrink: 0; }
.diff-text { word-break: break-all; }
.diff-added { background: rgba(34, 197, 94, 0.1); }
.diff-added .diff-marker { color: var(--app-success, #22c55e); }
.diff-removed { background: rgba(239, 68, 68, 0.1); }
.diff-removed .diff-marker { color: var(--app-error, #ef4444); }
.diff-empty { padding: var(--sp-lg); text-align: center; color: var(--app-text-muted, var(--text-muted)); }
</style>
