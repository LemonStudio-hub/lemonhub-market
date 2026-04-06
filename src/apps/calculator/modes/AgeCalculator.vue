<template>
  <div class="converter-mode">
    <div class="converter-header">
      <h3 class="converter-title">🎂 Age Calculator</h3>
    </div>

    <div class="converter-body">
      <div class="converter-field">
        <label class="field-label">Date of Birth</label>
        <input v-model="birthDate" type="date" class="converter-input date-input" />
      </div>

      <div class="converter-field">
        <label class="field-label">Calculate at (default: today)</label>
        <input v-model="targetDate" type="date" class="converter-input date-input" />
      </div>

      <div v-if="ageResult" class="age-results">
        <div class="age-main">
          <span class="age-number">{{ ageResult.years }}</span>
          <span class="age-label">Years Old</span>
        </div>

        <div class="age-details">
          <div class="age-card">
            <span class="age-card-num">{{ ageResult.months }}</span>
            <span class="age-card-label">Months</span>
          </div>
          <div class="age-card">
            <span class="age-card-num">{{ ageResult.weeks.toLocaleString() }}</span>
            <span class="age-card-label">Weeks</span>
          </div>
          <div class="age-card">
            <span class="age-card-num">{{ ageResult.days.toLocaleString() }}</span>
            <span class="age-card-label">Days</span>
          </div>
          <div class="age-card">
            <span class="age-card-num">{{ ageResult.hours.toLocaleString() }}</span>
            <span class="age-card-label">Hours</span>
          </div>
        </div>

        <div class="age-extra">
          <p>🎂 Next birthday in <strong>{{ ageResult.nextBirthday }}</strong> days</p>
          <p>📅 Born on a <strong>{{ ageResult.dayOfWeek }}</strong></p>
          <p>⭐ Zodiac: <strong>{{ ageResult.zodiac }}</strong></p>
        </div>
      </div>

      <div v-else class="app-empty">
        <p class="app-empty-title">Select a birth date</p>
        <p class="app-empty-desc">Enter your date of birth to calculate your age</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const birthDate = ref('')
const targetDate = ref(new Date().toISOString().split('T')[0])

const zodiacSigns = [
  { name: '♑ Capricorn', start: [1, 1], end: [1, 19] },
  { name: '♒ Aquarius', start: [1, 20], end: [2, 18] },
  { name: '♓ Pisces', start: [2, 19], end: [3, 20] },
  { name: '♈ Aries', start: [3, 21], end: [4, 19] },
  { name: '♉ Taurus', start: [4, 20], end: [5, 20] },
  { name: '♊ Gemini', start: [5, 21], end: [6, 20] },
  { name: '♋ Cancer', start: [6, 21], end: [7, 22] },
  { name: '♌ Leo', start: [7, 23], end: [8, 22] },
  { name: '♍ Virgo', start: [8, 23], end: [9, 22] },
  { name: '♎ Libra', start: [9, 23], end: [10, 22] },
  { name: '♏ Scorpio', start: [10, 23], end: [11, 21] },
  { name: '♐ Sagittarius', start: [11, 22], end: [12, 21] },
  { name: '♑ Capricorn', start: [12, 22], end: [12, 31] },
]

const ageResult = computed(() => {
  if (!birthDate.value) return null

  const birth = new Date(birthDate.value + 'T00:00:00')
  const target = new Date(targetDate.value + 'T00:00:00')
  if (isNaN(birth.getTime()) || target <= birth) return null

  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  if (target.getDate() < birth.getDate()) months--
  if (months < 0) { years--; months += 12 }

  const diffMs = target.getTime() - birth.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))

  // Next birthday
  const now = new Date()
  let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1)
  const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Day of week
  const dayOfWeek = birth.toLocaleDateString('en', { weekday: 'long' })

  // Zodiac
  const bMonth = birth.getMonth() + 1
  const bDay = birth.getDate()
  const zodiac = zodiacSigns.find(s => {
    const [sm, sd] = s.start; const [em, ed] = s.end
    if (sm === em) return bMonth === sm && bDay >= sd && bDay <= ed
    return (bMonth === sm && bDay >= sd) || (bMonth === em && bDay <= ed)
  })

  return {
    years, months: totalMonths, weeks: totalWeeks, days: totalDays, hours: totalHours,
    nextBirthday: daysToNext, dayOfWeek, zodiac: zodiac?.name ?? '—',
  }
})
</script>

<style scoped>
.converter-mode { display: flex; flex-direction: column; height: 100%; padding: var(--sp-lg); }
.converter-header { margin-bottom: var(--sp-md); }
.converter-title { font-size: 1rem; font-weight: 600; margin: 0; }
.converter-body { display: flex; flex-direction: column; gap: var(--sp-lg); flex: 1; overflow-y: auto; }
.converter-field { display: flex; flex-direction: column; gap: var(--sp-xs); }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--app-text-secondary, var(--text-muted)); text-transform: uppercase; }
.date-input { font-size: 1rem; padding: var(--sp-md); }

.age-results { display: flex; flex-direction: column; gap: var(--sp-lg); }
.age-main { text-align: center; padding: var(--sp-xl); background: var(--app-primary, var(--accent-primary)); border-radius: var(--radius-lg); color: white; }
.age-number { display: block; font-size: 3rem; font-weight: 700; font-family: var(--font-mono); }
.age-label { font-size: 0.9rem; opacity: 0.85; }

.age-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-sm); }
.age-card { display: flex; flex-direction: column; align-items: center; padding: var(--sp-md); background: var(--app-surface, var(--bg-primary)); border: 1px solid var(--app-border, var(--border-primary)); border-radius: var(--radius-md); }
.age-card-num { font-size: 1.2rem; font-weight: 700; font-family: var(--font-mono); color: var(--app-text, var(--text-primary)); }
.age-card-label { font-size: 0.7rem; color: var(--app-text-muted, var(--text-muted)); text-transform: uppercase; }

.age-extra { padding: var(--sp-md); background: var(--app-surface-hover, var(--bg-hover)); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--app-text-secondary, var(--text-secondary)); }
.age-extra p { margin: var(--sp-xs) 0; }

.app-empty { text-align: center; padding: var(--sp-2xl) 0; color: var(--app-text-muted, var(--text-muted)); }
.app-empty-title { font-size: 1rem; font-weight: 600; color: var(--app-text, var(--text-primary)); margin-bottom: var(--sp-xs); }
.app-empty-desc { font-size: 0.85rem; }
</style>
