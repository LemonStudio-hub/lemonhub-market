<template>
  <div class="tool-panel">
    <div class="regex-input-row">
      <span class="regex-prefix">/</span>
      <input v-model="pattern" class="regex-pattern" placeholder="Enter regex pattern..." @input="test" />
      <span class="regex-prefix">/</span>
      <input v-model="flags" class="regex-flags" placeholder="gi" style="width: 40px" @input="test" />
    </div>
    <div v-if="matchCount >= 0" class="regex-result">
      <span class="regex-match-count">{{ matchCount }} matches</span>
      <div v-if="matches.length" class="regex-matches">
        <span v-for="(m, i) in matches.slice(0, 50)" :key="i" class="regex-match-item">{{ m }}</span>
      </div>
    </div>
    <div v-if="error" class="tool-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const model = defineModel<string>({ default: '' })
const pattern = ref('')
const flags = ref('gi')
const matches = ref<string[]>([])
const matchCount = ref(-1)
const error = ref('')

function test() {
  error.value = ''
  matchCount.value = -1
  matches.value = []
  if (!pattern.value || !model.value) return
  try {
    const re = new RegExp(pattern.value, flags.value)
    const all = model.value.match(re)
    matches.value = all || []
    matchCount.value = all?.length ?? 0
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<style scoped>
.tool-panel { display: flex; flex-direction: column; gap: var(--sp-sm); }
.regex-input-row { display: flex; align-items: center; gap: var(--sp-xs); }
.regex-prefix { font-size: 1.2rem; color: var(--app-text-muted, var(--text-muted)); font-family: var(--font-mono); }
.regex-pattern { flex: 1; padding: var(--sp-sm) var(--sp-md); font-size: 0.85rem; font-family: var(--font-mono); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.regex-pattern:focus { border-color: var(--app-primary, var(--accent-primary)); }
.regex-flags { padding: var(--sp-sm); font-size: 0.85rem; font-family: var(--font-mono); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; text-align: center; }
.regex-result { padding: var(--sp-sm); background: var(--app-tertiary, var(--bg-tertiary)); border-radius: var(--radius-md); }
.regex-match-count { font-size: 0.82rem; font-weight: 600; color: var(--app-primary, var(--accent-primary)); }
.regex-matches { display: flex; flex-wrap: wrap; gap: var(--sp-xs); margin-top: var(--sp-xs); }
.regex-match-item { padding: 2px 6px; background: rgba(99, 102, 241, 0.15); border-radius: var(--radius-sm); font-size: 0.75rem; font-family: var(--font-mono); color: var(--app-primary, var(--accent-primary)); }
.tool-error { padding: var(--sp-sm); background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--app-error, #ef4444); }
</style>
