import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'pastor' | 'mentor' | 'user'

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  profileImage?: string
  church?: string
  mentorId?: string
  createdAt: Date
  updatedAt: Date
}

interface JournalEntry {
  id: string
  userId: string
  date: string
  mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious'
  content: string
  syncedAt: Date
  createdAt: Date
  updatedAt: Date
}

interface AppStore {
  // Auth
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (loading: boolean) => void
  logout: () => void

  // Journal
  journalEntries: JournalEntry[]
  setJournalEntries: (entries: JournalEntry[]) => void
  addJournalEntry: (entry: JournalEntry) => void
  deleteJournalEntry: (id: string) => void

  // Settings
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  notifications: boolean
  setNotifications: (enabled: boolean) => void
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // Auth
        user: null,
        isAuthenticated: false,
        isLoading: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setIsLoading: (isLoading) => set({ isLoading }),
        logout: () => set({ user: null, isAuthenticated: false }),

        // Journal
        journalEntries: [],
        setJournalEntries: (entries) => set({ journalEntries: entries }),
        addJournalEntry: (entry) =>
          set((state) => ({
            journalEntries: [entry, ...state.journalEntries],
          })),
        deleteJournalEntry: (id) =>
          set((state) => ({
            journalEntries: state.journalEntries.filter((e) => e.id !== id),
          })),

        // Settings
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        notifications: true,
        setNotifications: (notifications) => set({ notifications }),
      }),
      {
        name: 'nouvelle-creation-store',
        partialize: (state) => ({
          theme: state.theme,
          notifications: state.notifications,
        }),
      }
    )
  )
)

export default useAppStore
