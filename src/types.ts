// Types TypeScript réutilisables pour Nouvelle Création

export interface Verse {
  reference: string
  text: string
  theme: string
}

export interface JournalEntry {
  id: string
  date: string
  mood: MoodType
  content: string
}

export interface Reminder {
  id: string
  title: string
  time: string
  enabled: boolean
  frequency?: 'daily' | 'weekly' | 'once'
}

export interface AppState {
  purityDays: number
  journalEntries: JournalEntry[]
  reminders: Reminder[]
  theme: 'light' | 'dark'
}

export type MoodType = 'joyful' | 'peaceful' | 'struggling' | 'victorious'

export type PageType = 'home' | 'combat' | 'bible' | 'journal' | 'dashboard' | 'solomon' | 'reminders'

export interface SolomonMessage {
  role: 'user' | 'ai'
  text: string
  timestamp?: Date
}

// Types pour l'API Electron
declare global {
  interface Window {
    electronAPI?: {
      showNotification: (title: string, body: string, tag?: string) => Promise<boolean>
      dbGet: (key: string) => Promise<any>
      dbSet: (key: string, value: any) => Promise<boolean>
    }
  }
}

export {}
