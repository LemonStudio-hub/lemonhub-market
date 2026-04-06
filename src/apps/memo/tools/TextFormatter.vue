<template>
  <div class="tool-panel">
    <div class="tool-btns">
      <button class="tool-btn" @click="format('json')">JSON</button>
      <button class="tool-btn" @click="minify('json')">JSON Min</button>
      <button class="tool-btn" @click="format('sql')">SQL</button>
      <button class="tool-btn" @click="format('html')">HTML</button>
      <button class="tool-btn" @click="minify('html')">HTML Min</button>
      <button class="tool-btn" @click="format('yaml')">YAML→JSON</button>
      <button class="tool-btn" @click="format('csv')">CSV→JSON</button>
      <button class="tool-btn" @click="format('xml')">XML→JSON</button>
      <button class="tool-btn" @click="escapeHTML">Escape HTML</button>
      <button class="tool-btn" @click="unescapeHTML">Unescape HTML</button>
      <button class="tool-btn" @click="trimAll">Trim Lines</button>
      <button class="tool-btn" @click="removeEmpty">Remove Empty</button>
    </div>
    <div v-if="error" class="tool-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const model = defineModel<string>({ default: '' })
const error = ref('')

function format(type: string) {
  error.value = ''
  try {
    switch (type) {
      case 'json': {
        const obj = JSON.parse(model.value)
        model.value = JSON.stringify(obj, null, 2)
        break
      }
      case 'sql': {
        model.value = model.value
          .replace(/\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|AS|IN|NOT|NULL|IS|LIKE|BETWEEN|EXISTS|CASE|WHEN|THEN|ELSE|END|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MAX|MIN)\b/gi, '\n$1')
          .replace(/\s+/g, ' ')
          .trim()
        break
      }
      case 'html': {
        model.value = model.value
          .replace(/></g, '>\n<')
          .split('\n')
          .map((line, i) => {
            const indent = (line.match(/<\w/g) || []).length - (line.match(/<\/\w/g) || []).length
            return '  '.repeat(Math.max(0, i === 0 ? 0 : indent)) + line.trim()
          })
          .join('\n')
        break
      }
      case 'yaml': {
        const lines = model.value.split('\n')
        const obj: Record<string, any> = {}
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const [key, ...rest] = trimmed.split(':')
          if (key && rest.length) {
            obj[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '')
          }
        }
        model.value = JSON.stringify(obj, null, 2)
        break
      }
      case 'csv': {
        const [header, ...rows] = model.value.trim().split('\n')
        const keys = header.split(',').map(k => k.trim())
        const data = rows.map(row => {
          const vals = row.split(',').map(v => v.trim())
          return Object.fromEntries(keys.map((k, i) => [k, vals[i] || '']))
        })
        model.value = JSON.stringify(data, null, 2)
        break
      }
      case 'xml': {
        const parser = new DOMParser()
        const doc = parser.parseFromString(model.value, 'text/xml')
        const parseError = doc.querySelector('parsererror')
        if (parseError) throw new Error('Invalid XML')
        const obj: Record<string, any> = {}
        const root = doc.documentElement
        obj[root.tagName] = {}
        for (const child of root.children) {
          obj[root.tagName][child.tagName] = child.textContent
        }
        model.value = JSON.stringify(obj, null, 2)
        break
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Parse error'
  }
}

function minify(type: string) {
  error.value = ''
  try {
    if (type === 'json') {
      model.value = JSON.stringify(JSON.parse(model.value))
    } else if (type === 'html') {
      model.value = model.value.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
    }
  } catch (e: any) {
    error.value = e.message || 'Minify error'
  }
}

function escapeHTML() {
  model.value = model.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function unescapeHTML() {
  model.value = model.value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
}

function trimAll() {
  model.value = model.value.split('\n').map(l => l.trim()).join('\n')
}

function removeEmpty() {
  model.value = model.value.split('\n').filter(l => l.trim()).join('\n')
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
.tool-error { padding: var(--sp-sm); background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--app-error, #ef4444); }
</style>
