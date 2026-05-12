'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { useAppStore } from '@/store/appStore'

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

const AUTO_SAVE_DELAY = 3000 // 3 seconds

export const useJournal = () => {
  const { user } = useAppStore()
  const queryClient = useQueryClient()
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const pendingChangesRef = useRef<{ content: string; mood: string } | null>(null)

  // Real-time subscription to journal entries
  useEffect(() => {
    if (!user?.id) return

    const q = query(
      collection(db, 'journal_entries'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        syncedAt: doc.data().syncedAt?.toDate(),
      })) as JournalEntry[]

      useAppStore.setState({ journalEntries: entries })
      queryClient.setQueryData(['journal-entries', user.id], entries)
    })

    return () => unsubscribe()
  }, [user?.id, queryClient])

  // Add journal entry
  const addEntryMutation = useMutation({
    mutationFn: async (entry: Omit<JournalEntry, 'id' | 'syncedAt' | 'updatedAt'>) => {
      if (!user?.id) throw new Error('User not authenticated')

      const docRef = await addDoc(collection(db, 'journal_entries'), {
        userId: user.id,
        date: entry.date,
        mood: entry.mood,
        content: entry.content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        syncedAt: Timestamp.now(),
      })

      return {
        id: docRef.id,
        ...entry,
        syncedAt: new Date(),
        updatedAt: new Date(),
        createdAt: entry.createdAt,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries', user?.id] })
    },
  })

  // Update journal entry (with debounce for auto-save)
  const updateEntryMutation = useMutation({
    mutationFn: async ({
      id,
      content,
      mood,
    }: {
      id: string
      content: string
      mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious'
    }) => {
      if (!user?.id) throw new Error('User not authenticated')

      await updateDoc(doc(db, 'journal_entries', id), {
        content,
        mood,
        updatedAt: Timestamp.now(),
        syncedAt: Timestamp.now(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries', user?.id] })
    },
  })

  // Delete journal entry
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated')
      await deleteDoc(doc(db, 'journal_entries', id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries', user?.id] })
    },
  })

  // Auto-save with debounce
  const autoSave = useCallback(
    (id: string, content: string, mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious') => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      // Store pending changes
      pendingChangesRef.current = { content, mood }

      // Set timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (pendingChangesRef.current) {
          updateEntryMutation.mutate({
            id,
            content: pendingChangesRef.current.content,
            mood: pendingChangesRef.current.mood,
          })
          pendingChangesRef.current = null
        }
      }, AUTO_SAVE_DELAY)
    },
    [updateEntryMutation]
  )

  // Query to fetch journal entries
  const { data: entries = [] } = useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      // Data is populated by real-time subscription
      return useAppStore.getState().journalEntries
    },
    enabled: !!user?.id,
  })

  return {
    entries,
    addEntry: addEntryMutation.mutate,
    updateEntry: updateEntryMutation.mutate,
    deleteEntry: deleteEntryMutation.mutate,
    autoSave,
    isLoading:
      addEntryMutation.isPending ||
      updateEntryMutation.isPending ||
      deleteEntryMutation.isPending,
    error: addEntryMutation.error || updateEntryMutation.error || deleteEntryMutation.error,
  }
}
