<template>
  <div class="tool-panel">
    <div class="tool-btns">
      <button class="tool-btn" @click="run('upper')">UPPER</button>
      <button class="tool-btn" @click="run('lower')">lower</button>
      <button class="tool-btn" @click="run('title')">Title Case</button>
      <button class="tool-btn" @click="run('sentence')">Sentence case</button>
      <button class="tool-btn" @click="run('toggle')">tOGGLE</button>
      <button class="tool-btn" @click="run('camel')">camelCase</button>
      <button class="tool-btn" @click="run('snake')">snake_case</button>
      <button class="tool-btn" @click="run('kebab')">kebab-case</button>
      <button class="tool-btn" @click="run('constant')">CONSTANT_CASE</button>
      <button class="tool-btn" @click="run('dot')">dot.case</button>
      <button class="tool-btn" @click="run('slug')">slug-case</button>
      <button class="tool-btn" @click="run('inverse')">InVeRsE</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

function run(type: string) {
  let t = model.value
  switch (type) {
    case 'upper': t = t.toUpperCase(); break
    case 'lower': t = t.toLowerCase(); break
    case 'title': t = t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); break
    case 'sentence': t = t.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (_m, p1, p2) => p1 + p2.toUpperCase()); break
    case 'toggle': t = t.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break
    case 'camel': t = t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break
    case 'snake': t = t.replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); break
    case 'kebab': t = t.replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); break
    case 'constant': t = t.replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase(); break
    case 'dot': t = t.replace(/\s+/g, '.').replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase(); break
    case 'slug': t = t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-'); break
    case 'inverse': t = t.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''); break
  }
  model.value = t
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
.tool-btn:hover {
  background: var(--app-primary, var(--accent-primary));
  color: white;
  border-color: var(--app-primary, var(--accent-primary));
}
</style>
