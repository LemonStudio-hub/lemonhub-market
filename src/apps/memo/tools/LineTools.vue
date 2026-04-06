<template>
  <div class="tool-panel">
    <div class="tool-btns">
      <button class="tool-btn" @click="run('sort')">Sort A→Z</button>
      <button class="tool-btn" @click="run('sortDesc')">Sort Z→A</button>
      <button class="tool-btn" @click="run('sortLen')">Sort by Length</button>
      <button class="tool-btn" @click="run('reverse')">Reverse</button>
      <button class="tool-btn" @click="run('shuffle')">Shuffle</button>
      <button class="tool-btn" @click="run('unique')">Deduplicate</button>
      <button class="tool-btn" @click="run('uniqueCount')">Count Unique</button>
      <button class="tool-btn" @click="run('addPrefix')">Add Prefix</button>
      <button class="tool-btn" @click="run('addSuffix')">Add Suffix</button>
      <button class="tool-btn" @click="run('addNum')">Number Lines</button>
      <button class="tool-btn" @click="run('removeEmpty')">Remove Empty</button>
      <button class="tool-btn" @click="run('join')">Join Lines</button>
    </div>
    <div v-if="result" class="tool-result">{{ result }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const model = defineModel<string>({ default: '' })
const result = ref('')

function run(type: string) {
  let lines = model.value.split('\n')
  switch (type) {
    case 'sort': lines.sort((a, b) => a.localeCompare(b)); break
    case 'sortDesc': lines.sort((a, b) => b.localeCompare(a)); break
    case 'sortLen': lines.sort((a, b) => a.length - b.length); break
    case 'reverse': lines.reverse(); break
    case 'shuffle': for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]] } break
    case 'unique': lines = [...new Set(lines)]; break
    case 'uniqueCount': {
      const unique = new Set(lines.filter(l => l.trim()))
      result.value = `Total: ${lines.length} | Unique: ${unique.size} | Duplicates: ${lines.length - unique.size}`
      return
    }
    case 'addPrefix': { const p = prompt('Prefix:') || ''; lines = lines.map(l => p + l); break }
    case 'addSuffix': { const s = prompt('Suffix:') || ''; lines = lines.map(l => l + s); break }
    case 'addNum': lines = lines.map((l, i) => `${i + 1}. ${l}`); break
    case 'removeEmpty': lines = lines.filter(l => l.trim()); break
    case 'join': lines = [lines.join(' ')]; break
  }
  model.value = lines.join('\n')
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
.tool-result { padding: var(--sp-sm); background: var(--app-tertiary, var(--bg-tertiary)); border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 600; font-family: var(--font-mono); }
</style>
