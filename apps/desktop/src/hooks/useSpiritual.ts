import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../store/appStore'
import { generateId, isToday } from '../utils/helpers'

export const useJournal = () => {
  const store = useAppStore()
  const [currentEntry, setCurrentEntry] = useState('')
  const [mood, setMood] = useState<'excellent' | 'bon' | 'neutre' | 'difficile' | 'lutte'>('bon')

  const saveTodayEntry = useCallback(() => {
    if (!currentEntry.trim()) return

    const today = new Date().toISOString().split('T')[0]
    const existingIndex = store.journal_entries.findIndex((e) => e.date === today)

    const newEntry = {
      id: generateId(),
      date: today,
      mood,
      content: currentEntry,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      const updated = [...store.journal_entries]
      updated[existingIndex] = newEntry
      store.updateStats({ journal_entries: updated })
    } else {
      store.addJournalEntry(newEntry)
    }

    setCurrentEntry('')
    setMood('bon')
  }, [currentEntry, mood, store])

  const getTodayEntry = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return store.journal_entries.find((e) => e.date === today)
  }, [store.journal_entries])

  return {
    currentEntry,
    setCurrentEntry,
    mood,
    setMood,
    saveTodayEntry,
    getTodayEntry,
    entries: store.journal_entries,
  }
}

export const usePurity = () => {
  const store = useAppStore()
  const [purityStartDate, setPurityStartDate] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('purityStartDate')
    if (saved) setPurityStartDate(saved)
  }, [])

  const startPurityJourney = useCallback(() => {
    const today = new Date().toISOString()
    setPurityStartDate(today)
    localStorage.setItem('purityStartDate', today)
    store.updateStats({ purity_days: 0 })
  }, [store])

  const getPurityDays = useCallback(() => {
    if (!purityStartDate) return 0
    const start = new Date(purityStartDate)
    const today = new Date()
    const diff = today.getTime() - start.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
  }, [purityStartDate])

  const resetPurity = useCallback(() => {
    setPurityStartDate(null)
    localStorage.removeItem('purityStartDate')
    store.resetPurityDays()
  }, [store])

  return {
    purityStartDate,
    purityDays: getPurityDays(),
    startPurityJourney,
    resetPurity,
  }
}

export const useReminders = () => {
  const store = useAppStore()

  const createReminder = useCallback(
    (reminder: any) => {
      const newReminder = {
        id: generateId(),
        ...reminder,
        enabled: true,
        sound_enabled: true,
      }
      store.addReminder(newReminder)
      return newReminder
    },
    [store]
  )

  const deleteReminder = useCallback(
    (id: string) => {
      const updated = store.reminders.filter((r) => r.id !== id)
      store.updateStats({ reminders: updated })
    },
    [store]
  )

  const toggleReminder = useCallback(
    (id: string) => {
      const updated = store.reminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
      store.updateStats({ reminders: updated })
    },
    [store]
  )

  const getRemindersForToday = useCallback(() => {
    const today = new Date().getDay()
    return store.reminders.filter((r) => r.enabled && r.days.includes(today))
  }, [store.reminders])

  return {
    reminders: store.reminders,
    createReminder,
    deleteReminder,
    toggleReminder,
    getRemindersForToday,
  }
}

export const useChat = () => {
  const store = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = useCallback(
    (role: 'user' | 'salomon', content: string) => {
      const message = {
        id: generateId(),
        role,
        content,
        timestamp: new Date().toISOString(),
      }
      const updated = [...store.chat_history, message]
      store.updateStats({ chat_history: updated })
      return message
    },
    [store]
  )

  const getLastMessages = useCallback((count: number = 10) => {
    return store.chat_history.slice(-count)
  }, [store.chat_history])

  return {
    messages: store.chat_history,
    isLoading,
    setIsLoading,
    addMessage,
    getLastMessages,
  }
}

export const useStats = () => {
  const store = useAppStore()
  const [stats, setStats] = useState({
    purity_days: 0,
    prayer_minutes: 0,
    bible_readings: 0,
    journal_entries: 0,
    week_victories: 0,
  })

  useEffect(() => {
    const newStats = {
      purity_days: store.purity_days,
      prayer_minutes: store.prayer_minutes,
      bible_readings: store.bible_readings,
      journal_entries: store.journal_entries.length,
      week_victories: store.journal_entries.filter((e) => {
        const date = new Date(e.date)
        const today = new Date()
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return date >= weekAgo && e.mood === 'excellent'
      }).length,
    }
    setStats(newStats)
  }, [store])

  return stats
}
