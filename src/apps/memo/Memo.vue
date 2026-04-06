<template>
  <div class="memo-app">
    <!-- Sidebar: Note List -->
    <aside class="memo-sidebar" :class="{ collapsed: isMobile && !showNoteList }">
      <div class="memo-sidebar-header">
        <h3 class="memo-sidebar-title">Notes</h3>
        <button class="memo-add-btn" @click="createNote" title="New Note">+</button>
      </div>
      <div class="memo-search">
        <input v-model="searchQuery" class="memo-search-input" placeholder="Search notes..." />
      </div>
      <div class="memo-note-list">
        <div
          v-for="note in filteredNotes"
          :key="note.id"
          class="memo-note-item"
          :class="{ active: currentNote?.id === note.id }"
          @click="selectNote(note)"
        >
          <div class="memo-note-item-header">
            <span class="memo-note-title">{{ note.title || 'Untitled' }}</span>
            <button class="memo-note-delete" @click.stop="deleteNote(note.id)">×</button>
          </div>
          <p class="memo-note-preview">{{ note.content.slice(0, 60) || 'Empty note' }}</p>
          <span class="memo-note-date">{{ formatDate(note.updatedAt) }}</span>
        </div>
      </div>
    </aside>

    <!-- Mobile toggle -->
    <button v-if="isMobile" class="memo-sidebar-toggle" @click="showNoteList = !showNoteList">
      {{ showNoteList ? '✕' : '☰' }}
    </button>

    <!-- Main: Editor + Preview -->
    <main class="memo-main">
      <div v-if="currentNote" class="memo-editor-wrap">
        <!-- Toolbar -->
        <div class="memo-toolbar">
          <input v-model="currentNote.title" class="memo-title-input" placeholder="Note title..." />
          <div class="memo-toolbar-actions">
            <button class="toolbar-btn" :class="{ active: editorView === 'split' }" @click="editorView = 'split'" title="Split View">⬜</button>
            <button class="toolbar-btn" :class="{ active: editorView === 'edit' }" @click="editorView = 'edit'" title="Editor Only">✏️</button>
            <button class="toolbar-btn" :class="{ active: editorView === 'preview' }" @click="editorView = 'preview'" title="Preview Only">👁️</button>
            <div class="toolbar-divider" />
            <button class="toolbar-btn" @click="showTools = !showTools" title="Text Tools">🔧</button>
            <button class="toolbar-btn" @click="showStats = !showStats" title="Statistics">📊</button>
            <button class="toolbar-btn" @click="exportMenu = !exportMenu" title="Export">📤</button>
          </div>
        </div>

        <!-- Stats Bar -->
        <div v-if="showStats" class="memo-stats">
          <span class="memo-stat"><strong>{{ charCount }}</strong> chars</span>
          <span class="memo-stat"><strong>{{ wordCount }}</strong> words</span>
          <span class="memo-stat"><strong>{{ lineCount }}</strong> lines</span>
          <span class="memo-stat"><strong>{{ paragraphCount }}</strong> paragraphs</span>
          <span class="memo-stat"><strong>{{ readTime }}</strong> read</span>
        </div>

        <!-- Editor + Preview -->
        <div class="memo-editor-area" :class="'view-' + editorView">
          <textarea
            v-if="editorView !== 'preview'"
            v-model="currentNote.content"
            class="memo-textarea"
            placeholder="Write in Markdown..."
            spellcheck="false"
            @input="autoSave"
          />
          <div v-if="editorView !== 'edit'" class="memo-preview" v-html="renderedMarkdown" />
        </div>

        <!-- Text Tools Panel -->
        <div v-if="showTools" class="memo-tools-panel">
          <div class="memo-tools-tabs">
            <button
              v-for="t in toolTabs" :key="t.id"
              class="memo-tool-tab" :class="{ active: activeTool === t.id }"
              @click="activeTool = t.id"
            >{{ t.label }}</button>
          </div>
          <div class="memo-tools-body">
            <CaseConverter v-if="activeTool === 'case'" v-model="toolText" />
            <TextFormatter v-else-if="activeTool === 'format'" v-model="toolText" />
            <EncodeDecode v-else-if="activeTool === 'encode'" v-model="toolText" />
            <ChineseConvert v-else-if="activeTool === 'chinese'" v-model="toolText" />
            <LineTools v-else-if="activeTool === 'lines'" v-model="toolText" />
            <RegexTester v-else-if="activeTool === 'regex'" v-model="toolText" />
            <TextDiff v-else-if="activeTool === 'diff'" v-model="toolText" />
            <HashGenerator v-else-if="activeTool === 'hash'" v-model="toolText" />
          </div>
        </div>

        <!-- Export Dropdown -->
        <div v-if="exportMenu" class="memo-export-menu">
          <button class="export-item" @click="exportAs('txt')">📄 Export as TXT</button>
          <button class="export-item" @click="exportAs('html')">🌐 Export as HTML</button>
          <button class="export-item" @click="exportAs('md')">📝 Export as Markdown</button>
          <button class="export-item" @click="exportAs('pdf')">📕 Export as PDF</button>
        </div>
      </div>

      <div v-else class="memo-empty">
        <p class="memo-empty-icon">📝</p>
        <p class="memo-empty-title">No note selected</p>
        <p class="memo-empty-desc">Select a note or create a new one</p>
        <button class="memo-empty-btn" @click="createNote">+ New Note</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import CaseConverter from './tools/CaseConverter.vue'
import TextFormatter from './tools/TextFormatter.vue'
import EncodeDecode from './tools/EncodeDecode.vue'
import ChineseConvert from './tools/ChineseConvert.vue'
import LineTools from './tools/LineTools.vue'
import RegexTester from './tools/RegexTester.vue'
import TextDiff from './tools/TextDiff.vue'
import HashGenerator from './tools/HashGenerator.vue'

interface Memo {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const notes = ref<Memo[]>([])
const currentNote = ref<Memo | null>(null)
const searchQuery = ref('')
const editorView = ref<'split' | 'edit' | 'preview'>('split')
const showTools = ref(false)
const showStats = ref(false)
const showNoteList = ref(false)
const isMobile = ref(window.innerWidth < 768)
const activeTool = ref('case')
const toolText = ref('')
const exportMenu = ref(false)

const toolTabs = [
  { id: 'case', label: 'Case' },
  { id: 'format', label: 'Format' },
  { id: 'encode', label: 'Encode' },
  { id: 'chinese', label: '简繁' },
  { id: 'lines', label: 'Lines' },
  { id: 'regex', label: 'Regex' },
  { id: 'diff', label: 'Diff' },
  { id: 'hash', label: 'Hash' },
]

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value
  const q = searchQuery.value.toLowerCase()
  return notes.value.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
})

const renderedMarkdown = computed(() => {
  if (!currentNote.value) return ''
  try { return marked.parse(currentNote.value.content) as string } catch { return currentNote.value.content }
})

const charCount = computed(() => currentNote.value?.content.length ?? 0)
const wordCount = computed(() => {
  const c = currentNote.value?.content.trim()
  if (!c) return 0
  return c.split(/\s+/).filter(Boolean).length
})
const lineCount = computed(() => (currentNote.value?.content || '').split('\n').length)
const paragraphCount = computed(() => {
  const c = currentNote.value?.content.trim()
  if (!c) return 0
  return c.split(/\n\s*\n/).filter(Boolean).length
})
const readTime = computed(() => {
  const mins = Math.ceil(wordCount.value / 200)
  return mins < 1 ? '<1 min' : `${mins} min`
})

function createNote() {
  const note: Memo = {
    id: `memo-${Date.now()}`,
    title: '',
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  notes.value.unshift(note)
  selectNote(note)
  if (isMobile.value) showNoteList.value = false
  save()
}

function selectNote(note: Memo) {
  currentNote.value = note
  toolText.value = note.content
}

function deleteNote(id: string) {
  notes.value = notes.value.filter(n => n.id !== id)
  if (currentNote.value?.id === id) currentNote.value = notes.value[0] ?? null
  save()
}

let saveTimer: ReturnType<typeof setTimeout>
function autoSave() {
  if (currentNote.value) currentNote.value.updatedAt = Date.now()
  clearTimeout(saveTimer)
  saveTimer = setTimeout(save, 500)
}

function save() {
  localStorage.setItem('memo-notes-v2', JSON.stringify(notes.value))
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function exportAs(type: 'txt' | 'html' | 'md' | 'pdf') {
  if (!currentNote.value) return
  const title = currentNote.value.title || 'note'
  let content: string
  let mime: string
  let ext: string

  if (type === 'txt') {
    content = currentNote.value.content
    mime = 'text/plain'
    ext = 'txt'
  } else if (type === 'html') {
    content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:1rem;line-height:1.6}pre{background:#f5f5f5;padding:1rem;border-radius:8px;overflow-x:auto}code{font-family:monospace}blockquote{border-left:3px solid #6366f1;padding-left:1rem;color:#666}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body>${renderedMarkdown.value}</body></html>`
    mime = 'text/html'
    ext = 'html'
  } else if (type === 'md') {
    content = currentNote.value.content
    mime = 'text/markdown'
    ext = 'md'
  } else {
    // PDF: open HTML in new window for print
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:system-ui;max-width:700px;margin:2rem auto;padding:1rem;line-height:1.7;color:#1a1a1a}pre{background:#f5f5f5;padding:1rem;border-radius:8px;overflow-x:auto;page-break-inside:avoid}blockquote{border-left:3px solid #6366f1;padding-left:1rem;color:#555}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}h1{page-break-before:auto}img{max-width:100%}@media print{body{margin:0;padding:1rem}}</style></head><body>${renderedMarkdown.value}</body></html>`)
      printWindow.document.close()
      setTimeout(() => printWindow.print(), 500)
    }
    exportMenu.value = false
    return
  }

  const blob = new Blob([content], { type: mime + ';charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
  exportMenu.value = false
}

function handleResize() {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) showNoteList.value = false
}

// Close export menu on outside click
function closeExport() { exportMenu.value = false }

onMounted(() => {
  const saved = localStorage.getItem('memo-notes-v2')
  if (saved) {
    notes.value = JSON.parse(saved)
    if (notes.value.length) currentNote.value = notes.value[0]
  }
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', closeExport)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', closeExport)
})
</script>

<style scoped>
.memo-app {
  display: flex;
  height: 100%;
  position: relative;
  background: var(--app-background, var(--bg-tertiary));
  overflow: hidden;
}

/* Sidebar */
.memo-sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--app-surface, var(--bg-primary));
  border-right: 1px solid var(--app-border, var(--border-primary));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all var(--ease-slow);
}

.memo-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-md) var(--sp-md);
  border-bottom: 1px solid var(--app-border, var(--border-primary));
}

.memo-sidebar-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--app-text-secondary, var(--text-muted));
}

.memo-add-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  background: var(--app-primary, var(--accent-primary));
  color: white;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all var(--ease-fast);
}
.memo-add-btn:hover { transform: scale(1.1); box-shadow: var(--shadow-md); }

.memo-search { padding: var(--sp-sm) var(--sp-md); }
.memo-search-input {
  width: 100%;
  padding: var(--sp-sm) var(--sp-md);
  font-size: 0.82rem;
  background: var(--app-tertiary, var(--bg-tertiary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md);
  color: var(--app-text, var(--text-primary));
  outline: none;
}
.memo-search-input:focus { border-color: var(--app-primary, var(--accent-primary)); }

.memo-note-list { flex: 1; overflow-y: auto; }

.memo-note-item {
  padding: var(--sp-sm) var(--sp-md);
  border-bottom: 1px solid var(--app-border-light, var(--border-secondary));
  cursor: pointer;
  transition: background var(--ease-fast);
}
.memo-note-item:hover { background: var(--app-surface-hover, var(--bg-hover)); }
.memo-note-item.active {
  background: var(--app-primary, var(--accent-primary));
  color: white;
}
.memo-note-item.active .memo-note-preview,
.memo-note-item.active .memo-note-date { color: rgba(255, 255, 255, 0.7); }

.memo-note-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.memo-note-title {
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.memo-note-delete {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  opacity: 0;
  color: inherit;
}
.memo-note-item:hover .memo-note-delete { opacity: 0.5; }
.memo-note-delete:hover { opacity: 1; background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.memo-note-preview {
  font-size: 0.75rem;
  color: var(--app-text-secondary, var(--text-muted));
  margin: 0 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memo-note-date {
  font-size: 0.65rem;
  color: var(--app-text-muted, var(--text-muted));
}

/* Mobile sidebar toggle */
.memo-sidebar-toggle {
  position: absolute;
  top: var(--sp-md);
  left: var(--sp-md);
  z-index: 20;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--app-primary, var(--accent-primary));
  color: white;
  font-size: 1rem;
  display: none;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
}

/* Main */
.memo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.memo-editor-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Toolbar */
.memo-toolbar {
  display: flex;
  align-items: center;
  gap: var(--sp-md);
  padding: var(--sp-sm) var(--sp-md);
  background: var(--app-surface, var(--bg-primary));
  border-bottom: 1px solid var(--app-border, var(--border-primary));
  flex-shrink: 0;
}

.memo-title-input {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  padding: var(--sp-xs) var(--sp-sm);
  background: none;
  color: var(--app-text, var(--text-primary));
  border: none;
  outline: none;
  min-width: 0;
}
.memo-title-input::placeholder { color: var(--app-text-muted, var(--text-muted)); }

.memo-toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--sp-xs);
  flex-shrink: 0;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--app-text-secondary, var(--text-muted));
  transition: all var(--ease-fast);
  border: none;
  background: none;
  cursor: pointer;
}
.toolbar-btn:hover { background: var(--app-surface-hover, var(--bg-hover)); color: var(--app-text, var(--text-primary)); }
.toolbar-btn.active { background: var(--app-primary, var(--accent-primary)); color: white; }
.toolbar-divider { width: 1px; height: 20px; background: var(--app-border, var(--border-primary)); }

/* Stats */
.memo-stats {
  display: flex;
  gap: var(--sp-lg);
  padding: var(--sp-xs) var(--sp-md);
  background: var(--app-tertiary, var(--bg-tertiary));
  border-bottom: 1px solid var(--app-border, var(--border-primary));
  flex-shrink: 0;
}
.memo-stat { font-size: 0.72rem; color: var(--app-text-secondary, var(--text-muted)); }
.memo-stat strong { color: var(--app-text, var(--text-primary)); }

/* Editor + Preview */
.memo-editor-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.memo-textarea {
  flex: 1;
  padding: var(--sp-lg);
  font-size: 0.9rem;
  line-height: 1.7;
  background: var(--app-surface, var(--bg-primary));
  border: none;
  color: var(--app-text, var(--text-primary));
  outline: none;
  resize: none;
  font-family: var(--font-mono);
  overflow-y: auto;
}
.memo-textarea::placeholder { color: var(--app-text-muted, var(--text-muted)); }

.memo-preview {
  flex: 1;
  padding: var(--sp-lg);
  overflow-y: auto;
  background: var(--app-surface, var(--bg-primary));
  border-left: 1px solid var(--app-border, var(--border-primary));
  font-size: 0.9rem;
  line-height: 1.7;
}

.memo-preview :deep(h1) { font-size: 1.8rem; margin: 1rem 0 0.5rem; border-bottom: 1px solid var(--app-border, var(--border-primary)); padding-bottom: 0.3rem; }
.memo-preview :deep(h2) { font-size: 1.4rem; margin: 1rem 0 0.5rem; }
.memo-preview :deep(h3) { font-size: 1.15rem; margin: 0.8rem 0 0.4rem; }
.memo-preview :deep(p) { margin: 0.5rem 0; }
.memo-preview :deep(code) { background: var(--app-tertiary, var(--bg-tertiary)); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.memo-preview :deep(pre) { background: var(--app-tertiary, var(--bg-tertiary)); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; }
.memo-preview :deep(pre code) { background: none; padding: 0; }
.memo-preview :deep(blockquote) { border-left: 3px solid var(--app-primary, var(--accent-primary)); padding-left: 1rem; color: var(--app-text-secondary, var(--text-muted)); margin: 0.5rem 0; }
.memo-preview :deep(table) { border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
.memo-preview :deep(th), .memo-preview :deep(td) { border: 1px solid var(--app-border, var(--border-primary)); padding: 6px 10px; text-align: left; }
.memo-preview :deep(th) { background: var(--app-tertiary, var(--bg-tertiary)); font-weight: 600; }
.memo-preview :deep(img) { max-width: 100%; border-radius: var(--radius-md); }
.memo-preview :deep(ul), .memo-preview :deep(ol) { padding-left: 1.5rem; }
.memo-preview :deep(hr) { border: none; border-top: 1px solid var(--app-border, var(--border-primary)); margin: 1rem 0; }

/* View modes */
.view-edit .memo-preview { display: none; }
.view-preview .memo-textarea { display: none; }

/* Tools Panel */
.memo-tools-panel {
  border-top: 1px solid var(--app-border, var(--border-primary));
  max-height: 300px;
  display: flex;
  flex-direction: column;
  background: var(--app-surface, var(--bg-primary));
  flex-shrink: 0;
}
.memo-tools-tabs {
  display: flex;
  gap: var(--sp-xs);
  padding: var(--sp-sm) var(--sp-md);
  border-bottom: 1px solid var(--app-border, var(--border-primary));
  overflow-x: auto;
  scrollbar-width: none;
}
.memo-tools-tabs::-webkit-scrollbar { display: none; }
.memo-tool-tab {
  padding: var(--sp-xs) var(--sp-sm);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--app-tertiary, var(--bg-tertiary));
  color: var(--app-text-secondary, var(--text-muted));
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--ease-fast);
}
.memo-tool-tab:hover { color: var(--app-text, var(--text-primary)); }
.memo-tool-tab.active { background: var(--app-primary, var(--accent-primary)); color: white; }
.memo-tools-body { flex: 1; overflow-y: auto; padding: var(--sp-md); }

/* Export Menu */
.memo-export-menu {
  position: absolute;
  right: var(--sp-md);
  top: 72px;
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--sp-xs);
  z-index: 30;
  min-width: 180px;
}
.export-item {
  display: block;
  width: 100%;
  padding: var(--sp-sm) var(--sp-md);
  text-align: left;
  font-size: 0.85rem;
  border-radius: var(--radius-md);
  color: var(--app-text, var(--text-primary));
  background: none;
  border: none;
  cursor: pointer;
  transition: background var(--ease-fast);
}
.export-item:hover { background: var(--app-surface-hover, var(--bg-hover)); }

/* Empty State */
.memo-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--app-text-muted, var(--text-muted));
}
.memo-empty-icon { font-size: 3rem; margin-bottom: var(--sp-md); }
.memo-empty-title { font-size: 1.1rem; font-weight: 600; color: var(--app-text, var(--text-primary)); margin-bottom: var(--sp-xs); }
.memo-empty-desc { font-size: 0.85rem; margin-bottom: var(--sp-xl); }
.memo-empty-btn {
  padding: var(--sp-sm) var(--sp-xl);
  background: var(--app-primary, var(--accent-primary));
  color: white;
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
.memo-empty-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }

/* Responsive */
@media (max-width: 767px) {
  .memo-sidebar-toggle { display: flex; }
  .memo-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 15;
    box-shadow: var(--shadow-xl);
    transform: translateX(-100%);
  }
  .memo-sidebar.collapsed { transform: translateX(-100%); }
  .memo-sidebar:not(.collapsed) { transform: translateX(0); }
  .memo-toolbar { padding-left: 44px; }
}
</style>
