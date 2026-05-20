// Types for Nouvelle Création application

export type PageType = 'home' | 'combat' | 'bible' | 'journal' | 'dashboard' | 'salomon' | 'rappels' | 'multimedia' | 'parcours'

export interface BiblicalVerse {
  id: string
  book: string
  chapter: number
  verse: number
  text: string
  themes: string[]
  audio_url?: string
}

export interface JournalEntry {
  id: string
  date: string
  mood: 'excellent' | 'bon' | 'neutre' | 'difficile' | 'lutte'
  content: string
  spiritual_focus?: string
  victory_count?: number
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  type: 'prayer' | 'bible' | 'fast' | 'worship' | 'meditation' | 'custom'
  title: string
  time: string // HH:mm format
  enabled: boolean
  days: number[] // 0-6, 0 = Sunday
  verse?: string
  sound_enabled: boolean
}

export interface SpiritualStats {
  purity_days: number
  prayer_minutes: number
  bible_readings: number
  journal_entries: number
  total_days: number
  week_victories: number
}

export interface WeekProgram {
  week_number: number
  title: string
  verses: string[]
  focus: string
  start_date: string
  end_date: string
  daily_focus: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'salomon'
  content: string
  timestamp: string
  verse?: string
}

export interface AppState {
  current_user?: {
    id: string
    name: string
    email?: string
    started_date: string
  }
  statistics: SpiritualStats
  journal_entries: JournalEntry[]
  reminders: Reminder[]
  chat_history: ChatMessage[]
  last_updated: string
  purity_start_date?: string
  current_week_program?: WeekProgram
  theme: 'dark' | 'light'
}

export interface SalomonResponse {
  message: string
  verse?: BiblicalVerse
  encouragement: string
  suggestion?: string
}

// MULTIMEDIA TYPES
export interface MediaItem {
  id: string
  title: string
  type: 'song' | 'instrumental' | 'podcast' | 'teaching' | 'prayer'
  category: 'worship' | 'prayer' | 'meditation' | 'teaching' | 'pure-sound'
  url: string
  thumbnail?: string
  duration: number
  favorite: boolean
  createdAt: number
  artist?: string
  views?: number
}

// RECOMMENDATIONS
export interface Recommendation {
  id: string
  title: string
  reason: string
  type: 'media' | 'verse' | 'task'
  contentId: string
  priority: 'high' | 'medium' | 'low'
  timestamp: number
}

// SPIRITUAL PROGRESS
export interface SpiritualProgress {
  currentWeek: number
  currentDay: number
  daysCompleted: number
  weekStartDate: number
  lastUpdateDate: number
  meditationsCompleted: number
  prayerSessionsCompleted: number
  mediaListenedMinutes: number
}
