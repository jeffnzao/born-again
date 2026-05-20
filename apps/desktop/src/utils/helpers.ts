// Utility functions

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}

export const getDayOfWeek = (date: Date) => {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  return days[date.getDay()]
}

export const getPurityDays = (startDate: string): number => {
  const start = new Date(startDate)
  const today = new Date()
  const diff = today.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() + 1
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export const getMoodEmoji = (mood: string) => {
  const moods: Record<string, string> = {
    excellent: '😊',
    bon: '🙂',
    neutre: '😐',
    difficile: '😔',
    lutte: '😞',
  }
  return moods[mood] || '😐'
}

export const getMoodColor = (mood: string) => {
  const colors: Record<string, string> = {
    excellent: 'bg-green-500 text-green-100',
    bon: 'bg-blue-500 text-blue-100',
    neutre: 'bg-gray-500 text-gray-100',
    difficile: 'bg-yellow-500 text-yellow-100',
    lutte: 'bg-red-500 text-red-100',
  }
  return colors[mood] || 'bg-gray-500 text-gray-100'
}

export const getRandomEncouragement = (list: string[]) => {
  return list[Math.floor(Math.random() * list.length)]
}

export const calculateConsecutiveDays = (entries: any[]) => {
  if (entries.length === 0) return 0

  const sorted = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let consecutive = 1
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i].date)
    const next = new Date(sorted[i + 1].date)
    const diff = current.getTime() - next.getTime()

    if (diff === 24 * 60 * 60 * 1000) {
      consecutive++
    } else {
      break
    }
  }

  return consecutive
}

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export const isFastingDay = (date: Date): boolean => {
  return date.getDay() === 5 // Friday is fasting day (0=Sunday, 5=Friday)
}
