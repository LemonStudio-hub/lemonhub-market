import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeConfig } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const currentTheme = computed<ThemeConfig>(() => ({
    primary: isDark.value ? '#818cf8' : '#6366f1',
    secondary: isDark.value ? '#38bdf8' : '#0ea5e9',
    accent: isDark.value ? '#fbbf24' : '#f59e0b',
    background: isDark.value ? '#0f172a' : '#f8fafc',
    surface: isDark.value ? '#1e293b' : '#ffffff',
    text: isDark.value ? '#f8fafc' : '#0f172a',
    textSecondary: isDark.value ? '#cbd5e1' : '#64748b',
    border: isDark.value ? '#334155' : '#e2e8f0',
    shadow: isDark.value ? '0 4px 6px -1px rgb(0 0 0 / 0.4)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  }))

  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }

  function setTheme(dark: boolean) {
    isDark.value = dark
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  return {
    isDark,
    currentTheme,
    toggleTheme,
    setTheme,
    initTheme,
  }
})
