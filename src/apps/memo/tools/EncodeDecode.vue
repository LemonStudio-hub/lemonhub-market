<template>
  <div class="tool-panel">
    <div class="tool-btns">
      <button class="tool-btn" @click="run('b64enc')">Base64 Enc</button>
      <button class="tool-btn" @click="run('b64dec')">Base64 Dec</button>
      <button class="tool-btn" @click="run('urlEnc')">URL Enc</button>
      <button class="tool-btn" @click="run('urlDec')">URL Dec</button>
      <button class="tool-btn" @click="run('htmlEnc')">HTML Enc</button>
      <button class="tool-btn" @click="run('htmlDec')">HTML Dec</button>
      <button class="tool-btn" @click="run('jwt')">JWT Decode</button>
      <button class="tool-btn" @click="run('unicode')">Unicode Esc</button>
      <button class="tool-btn" @click="run('unicodeDec')">Unicode Unesc</button>
      <button class="tool-btn" @click="run('hex')">Hex Enc</button>
      <button class="tool-btn" @click="run('hexDec')">Hex Dec</button>
    </div>
    <div v-if="error" class="tool-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const model = defineModel<string>({ default: '' })
const error = ref('')

function run(type: string) {
  error.value = ''
  try {
    switch (type) {
      case 'b64enc':
        model.value = btoa(unescape(encodeURIComponent(model.value)))
        break
      case 'b64dec':
        model.value = decodeURIComponent(escape(atob(model.value.trim())))
        break
      case 'urlEnc':
        model.value = encodeURIComponent(model.value)
        break
      case 'urlDec':
        model.value = decodeURIComponent(model.value)
        break
      case 'htmlEnc':
        model.value = model.value.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)
        break
      case 'htmlDec':
        model.value = model.value.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        break
      case 'jwt': {
        const parts = model.value.trim().split('.')
        if (parts.length !== 3) throw new Error('Invalid JWT format (need 3 parts)')
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        model.value = JSON.stringify({ header, payload }, null, 2)
        break
      }
      case 'unicode':
        model.value = model.value.split('').map(c => {
          const code = c.charCodeAt(0)
          return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : c
        }).join('')
        break
      case 'unicodeDec':
        model.value = model.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        break
      case 'hex':
        model.value = Array.from(model.value).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
        break
      case 'hexDec':
        model.value = model.value.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join('')
        break
    }
  } catch (e: any) {
    error.value = e.message || 'Encode/Decode error'
  }
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
