<template>
  <div class="memo-app">
    <!-- New Note Input -->
    <div class="memo-input-section">
      <input
        v-model="newTitle"
        class="app-input"
        placeholder="Title..."
        @keydown.enter="focusContent"
      />
      <textarea
        ref="contentRef"
        v-model="newContent"
        class="memo-textarea"
        placeholder="Write a note..."
        @keydown.ctrl.enter="addMemo"
      />
      <div class="memo-input-actions">
        <select v-model="newColor" class="memo-color-select">
          <option v-for="c in COLORS" :key="c" :value="c" :style="{ background: c }">{{ c }}</option>
        </select>
        <button class="app-btn app-btn-primary" :disabled="!newContent.trim()" @click="addMemo">
          Save
        </button>
      </div>
    </div>

    <!-- Notes Grid -->
    <div v-if="memos.length" class="memo-grid">
      <div
        v-for="memo in memos"
        :key="memo.id"
        class="memo-card"
        :style="{ borderLeftColor: memo.color }"
      >
        <div class="memo-card-header">
          <h4 class="memo-card-title">{{ memo.title || 'Untitled' }}</h4>
          <div class="memo-card-actions">
            <button class="memo-icon-btn" @click="editMemo(memo)" title="Edit">✏️</button>
            <button class="memo-icon-btn" @click="deleteMemo(memo.id)" title="Delete">🗑️</button>
          </div>
        </div>
        <p class="memo-card-content">{{ memo.content }}</p>
        <span class="memo-card-date">{{ formatDate(memo.createdAt) }}</span>
      </div>
    </div>

    <div v-else class="app-empty">
      <p class="app-empty-title">No notes yet</p>
      <p class="app-empty-desc">Create your first note above</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Memo {
  id: string
  title: string
  content: string
  color: string
  createdAt: number
  updatedAt: number
}

const COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6']

const memos = ref<Memo[]>([])
const newTitle = ref('')
const newContent = ref('')
const newColor = ref(COLORS[0])
const editingId = ref<string | null>(null)
const contentRef = ref<HTMLTextAreaElement>()

function focusContent() {
  contentRef.value?.focus()
}

function addMemo() {
  if (!newContent.value.trim()) return

  if (editingId.value) {
    const idx = memos.value.findIndex(m => m.id === editingId.value)
    if (idx !== -1) {
      memos.value[idx] = {
        ...memos.value[idx],
        title: newTitle.value,
        content: newContent.value,
        color: newColor.value,
        updatedAt: Date.now(),
      }
    }
    editingId.value = null
  } else {
    memos.value.unshift({
      id: `memo-${Date.now()}`,
      title: newTitle.value,
      content: newContent.value,
      color: newColor.value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  }

  newTitle.value = ''
  newContent.value = ''
  newColor.value = COLORS[Math.floor(Math.random() * COLORS.length)]
  save()
}

function editMemo(memo: Memo) {
  editingId.value = memo.id
  newTitle.value = memo.title
  newContent.value = memo.content
  newColor.value = memo.color
  contentRef.value?.focus()
}

function deleteMemo(id: string) {
  memos.value = memos.value.filter(m => m.id !== id)
  if (editingId.value === id) {
    editingId.value = null
    newTitle.value = ''
    newContent.value = ''
  }
  save()
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function save() {
  localStorage.setItem('memos', JSON.stringify(memos.value))
}

onMounted(() => {
  const saved = localStorage.getItem('memos')
  if (saved) memos.value = JSON.parse(saved)
})
</script>

<style scoped>
.memo-app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.memo-input-section {
  padding: var(--sp-md);
  border-bottom: 1px solid var(--app-border, var(--border-primary));
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
}

.memo-textarea {
  width: 100%;
  min-height: 80px;
  padding: var(--sp-sm) var(--sp-md);
  font-size: 0.9rem;
  line-height: 1.5;
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-radius: var(--radius-md);
  color: var(--app-text, var(--text-primary));
  outline: none;
  resize: vertical;
  font-family: var(--font-sans);
  transition: border-color var(--ease-base);
}

.memo-textarea:focus {
  border-color: var(--app-primary, var(--accent-primary));
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.memo-input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.memo-color-select {
  padding: var(--sp-xs) var(--sp-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--app-border, var(--border-primary));
  background: var(--app-surface, var(--bg-primary));
  color: var(--app-text, var(--text-primary));
  font-size: 0.8rem;
  outline: none;
  max-width: 120px;
}

.memo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-md);
  padding: var(--sp-md);
  overflow-y: auto;
  flex: 1;
}

.memo-card {
  background: var(--app-surface, var(--bg-primary));
  border: 1px solid var(--app-border, var(--border-primary));
  border-left: 3px solid;
  border-radius: var(--radius-md);
  padding: var(--sp-md);
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
  transition: all var(--ease-base);
}

.memo-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.memo-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.memo-card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memo-card-actions { display: flex; gap: 2px; flex-shrink: 0; }

.memo-icon-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  opacity: 0;
  transition: all var(--ease-fast);
}

.memo-card:hover .memo-icon-btn { opacity: 0.6; }
.memo-icon-btn:hover { opacity: 1; background: var(--app-surface-hover, var(--bg-hover)); }

.memo-card-content {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--app-text-secondary, var(--text-secondary));
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.memo-card-date {
  font-size: 0.68rem;
  color: var(--app-text-muted, var(--text-muted));
}

@media (max-width: 480px) {
  .memo-grid { grid-template-columns: 1fr; }
}
</style>
