import { create } from 'zustand'

interface AppState {
  purity_days: number
  prayer_minutes: number
  bible_readings: number
  journal_entries: any[]
  reminders: any[]
  chat_history: any[]
  current_page: string
  theme: 'dark' | 'light'
  media_library?: any[]
  statistics?: {
    bible_readings: number
    [key: string]: any
  }

  // Actions
  incrementPurityDays: () => void
  resetPurityDays: () => void
  addJournalEntry: (entry: any) => void
  addReminder: (reminder: any) => void
  updateStats: (stats: Partial<AppState>) => void
  setCurrentPage: (page: string) => void
  setTheme: (theme: 'dark' | 'light') => void
}

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem('appState')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('Failed to load appState from localStorage:', e)
  }

  return {
    purity_days: 0,
    prayer_minutes: 0,
    bible_readings: 0,
    journal_entries: [],
    reminders: [],
    chat_history: [],
    current_page: 'home',
    theme: 'dark' as const,
    media_library: [],
    statistics: {
      bible_readings: 0,
    },
  }
}

export const useAppStore = create<AppState>((set, get) => {
  const initialState = loadInitialState()

  const saveToLocalStorage = (state: Partial<AppState>) => {
    try {
      localStorage.setItem('appState', JSON.stringify(get()))
    } catch (e) {
      console.warn('Failed to save appState to localStorage:', e)
    }
  }

  return {
    ...initialState,

    incrementPurityDays: () =>
      set((state) => {
        const newState = { ...state, purity_days: state.purity_days + 1 }
        saveToLocalStorage(newState)
        return newState
      }),

    resetPurityDays: () =>
      set((state) => {
        const newState = { ...state, purity_days: 0 }
        saveToLocalStorage(newState)
        return newState
      }),

    addJournalEntry: (entry) =>
      set((state) => {
        const newEntries = [...state.journal_entries, entry]
        const newState = { ...state, journal_entries: newEntries }
        saveToLocalStorage(newState)
        return newState
      }),

    addReminder: (reminder) =>
      set((state) => {
        const newReminders = [...state.reminders, reminder]
        const newState = { ...state, reminders: newReminders }
        saveToLocalStorage(newState)
        return newState
      }),

    updateStats: (stats) =>
      set((state) => {
        const newState = { ...state, ...stats }
        saveToLocalStorage(newState)
        return newState
      }),

    setCurrentPage: (page) => set({ current_page: page }),

    setTheme: (theme) =>
      set((state) => {
        const newState = { ...state, theme }
        saveToLocalStorage(newState)
        return newState
      }),
  }
})
