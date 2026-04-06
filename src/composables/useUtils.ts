import { onBeforeUnmount } from 'vue'

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>

  onBeforeUnmount(() => {
    clearTimeout(timeoutId)
  })

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function useLocalStorage(key: string, initialValue: any) {
  const getValue = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  }

  const setValue = (value: any) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return {
    get value() {
      return getValue()
    },
    set value(val: any) {
      setValue(val)
    }
  }
}
