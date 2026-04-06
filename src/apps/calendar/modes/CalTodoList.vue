<template>
  <div class="cal-todo">
    <div class="todo-input-row">
      <input v-model="newTodo" class="todo-input" placeholder="Add a task..." @keydown.enter="addTodo" />
      <select v-model="newPriority" class="todo-priority-select">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button class="cal-add-btn" @click="addTodo">+ Add</button>
    </div>
    <div class="todo-filters">
      <button class="todo-filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
      <button class="todo-filter-btn" :class="{ active: filter === 'active' }" @click="filter = 'active'">Active</button>
      <button class="todo-filter-btn" :class="{ active: filter === 'done' }" @click="filter = 'done'">Done</button>
      <span class="todo-count">{{ todos.filter(t => t.done).length }}/{{ todos.length }} done</span>
    </div>
    <div class="todo-list">
      <div v-for="todo in filteredTodos" :key="todo.id" class="todo-item" :class="{ done: todo.done }" :data-priority="todo.priority">
        <button class="todo-check" @click="todo.done = !todo.done; save()">
          <span v-if="todo.done">✓</span>
        </button>
        <span class="todo-text">{{ todo.text }}</span>
        <span class="todo-priority" :class="todo.priority">{{ todo.priority }}</span>
        <button class="todo-delete" @click="deleteTodo(todo.id)">×</button>
      </div>
    </div>
    <div v-if="!filteredTodos.length" class="todo-empty">
      <p>📝 No tasks</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
interface Todo { id: string; text: string; done: boolean; priority: 'low'|'medium'|'high'; createdAt: number }
const todos = ref<Todo[]>([])
const newTodo = ref('')
const newPriority = ref<'low'|'medium'|'high'>('medium')
const filter = ref<'all'|'active'|'done'>('all')

const filteredTodos = computed(() => {
  let list = todos.value
  if (filter.value === 'active') list = list.filter(t => !t.done)
  if (filter.value === 'done') list = list.filter(t => t.done)
  return list.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const p = { high: 0, medium: 1, low: 2 }
    return p[a.priority] - p[b.priority] || b.createdAt - a.createdAt
  })
})

function addTodo() {
  if (!newTodo.value.trim()) return
  todos.value.push({ id: `todo-${Date.now()}`, text: newTodo.value.trim(), done: false, priority: newPriority.value, createdAt: Date.now() })
  newTodo.value = ''; save()
}

function deleteTodo(id: string) { todos.value = todos.value.filter(t => t.id !== id); save() }
function save() { localStorage.setItem('cal-todos', JSON.stringify(todos.value)) }

onMounted(() => { const s = localStorage.getItem('cal-todos'); if (s) todos.value = JSON.parse(s) })
</script>

<style scoped>
.cal-todo { display: flex; flex-direction: column; height: 100%; padding: var(--sp-md); }
.todo-input-row { display: flex; gap: var(--sp-sm); margin-bottom: var(--sp-md); }
.todo-input { flex: 1; padding: var(--sp-sm); font-size: 0.9rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.todo-input:focus { border-color: var(--app-primary, var(--accent-primary)); }
.todo-priority-select { padding: var(--sp-sm); font-size: 0.8rem; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text, var(--text-primary)); outline: none; }
.cal-add-btn { padding: var(--sp-sm) var(--sp-md); font-size: 0.85rem; font-weight: 500; background: var(--app-primary, var(--accent-primary)); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; }
.todo-filters { display: flex; gap: var(--sp-xs); align-items: center; margin-bottom: var(--sp-md); }
.todo-filter-btn { padding: var(--sp-xs) var(--sp-sm); font-size: 0.75rem; font-weight: 500; background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); color: var(--app-text-secondary, var(--text-muted)); cursor: pointer; transition: all var(--ease-fast); }
.todo-filter-btn.active { background: var(--app-primary, var(--accent-primary)); color: white; border-color: var(--app-primary, var(--accent-primary)); }
.todo-count { margin-left: auto; font-size: 0.72rem; color: var(--app-text-muted, var(--text-muted)); }
.todo-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--sp-xs); }
.todo-item { display: flex; align-items: center; gap: var(--sp-sm); padding: var(--sp-sm) var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); transition: all var(--ease-fast); }
.todo-item.done { opacity: 0.6; }
.todo-item.done .todo-text { text-decoration: line-through; }
.todo-check { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid var(--app-border, var(--border-primary)); background: none; cursor: pointer; color: var(--app-primary, var(--accent-primary)); font-weight: 700; font-size: 0.8rem; }
.todo-text { flex: 1; font-size: 0.85rem; }
.todo-priority { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; padding: 2px 6px; border-radius: var(--radius-sm); }
.todo-priority.high { background: rgba(239,68,68,0.15); color: var(--app-error, #ef4444); }
.todo-priority.medium { background: rgba(245,158,11,0.15); color: var(--app-warning, #f59e0b); }
.todo-priority.low { background: rgba(34,197,94,0.15); color: var(--app-success, #22c55e); }
.todo-delete { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); color: var(--app-text-muted, var(--text-muted)); background: none; border: none; cursor: pointer; }
.todo-delete:hover { background: rgba(239,68,68,0.1); color: var(--app-error, #ef4444); }
.todo-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--app-text-muted, var(--text-muted)); font-size: 0.9rem; }
</style>
