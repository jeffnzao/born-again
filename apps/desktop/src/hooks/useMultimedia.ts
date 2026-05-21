import { useState, useCallback, useEffect } from 'react'
import { MediaItem, MediaCategory, SpiritualProgress, Recommendation } from '../types/index'
import {
  getMediaLibrary,
  getMediaByCategory,
  getFavorites,
  addMediaToLibrary,
  removeMediaFromLibrary,
  toggleFavorite as toggleFavoriteStorage,
  loadDefaultMedia,
  updateMedia
} from '../utils/mediaStorage'

// HOOK: Media Library - Real File Management
export const useMediaLibrary = () => {
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([])
  const [libraryLoaded, setLibraryLoaded] = useState(false)

  // Load library on mount
  useEffect(() => {
    const initializeLibrary = async () => {
      setLoadingState('loading')
      try {
        await loadDefaultMedia()
        const loaded = getMediaLibrary()
        setMediaLibrary(loaded)
        setLibraryLoaded(true)
        setLoadingState('idle')
      } catch (error) {
        console.error('Error loading library:', error)
        setLoadingState('error')
      }
    }

    if (!libraryLoaded) {
      initializeLibrary()
    }
  }, [libraryLoaded])

  const refreshLibrary = useCallback(() => {
    const current = getMediaLibrary()
    setMediaLibrary(current)
  }, [])

  const getLibrary = useCallback((): MediaItem[] => {
    return getMediaLibrary()
  }, [])

  const addToLibrary = useCallback((media: MediaItem) => {
    addMediaToLibrary(media)
    refreshLibrary()
  }, [refreshLibrary])

  const removeFromLibrary = useCallback((mediaId: string) => {
    removeMediaFromLibrary(mediaId)
    if (currentMedia?.id === mediaId) {
      setCurrentMedia(null)
      setIsPlaying(false)
    }
    refreshLibrary()
  }, [currentMedia, refreshLibrary])

  const toggleFavorite = useCallback((mediaId: string) => {
    toggleFavoriteStorage(mediaId)
    refreshLibrary()
  }, [refreshLibrary])

  const updatePlaybackProgress = useCallback((mediaId: string, newTime: number) => {
    updateMedia(mediaId, {
      playbackProgress: {
        currentTime: newTime,
        lastPlayedAt: Date.now()
      }
    })
    setCurrentTime(newTime)
  }, [])

  const playMedia = useCallback((media: MediaItem) => {
    setCurrentMedia(media)
    setIsPlaying(true)
    setLoadingState('loading')
  }, [])

  const pauseMedia = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const resumeMedia = useCallback(() => {
    if (currentMedia) {
      setIsPlaying(true)
    }
  }, [currentMedia])

  const stopMedia = useCallback(() => {
    setCurrentMedia(null)
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  const getMediaByCategory = useCallback((category: MediaCategory) => {
    const lib = getMediaLibrary()
    return lib.filter(m => m.category === category)
  }, [])

  const getFavoritesMedia = useCallback(() => {
    return getFavorites()
  }, [])

  return {
    currentMedia,
    isPlaying,
    volume,
    currentTime,
    playbackSpeed,
    loadingState,
    mediaLibrary,
    playMedia,
    pauseMedia,
    resumeMedia,
    stopMedia,
    toggleFavorite,
    addToLibrary,
    removeFromLibrary,
    updatePlaybackProgress,
    getMediaByCategory,
    getFavoritesMedia,
    setVolume,
    setCurrentTime,
    setPlaybackSpeed,
    setLoadingState,
    refreshLibrary,
    getLibrary
  }
}

// HOOK: Spiritual Progress Tracking
export const useSpiritualProgress = () => {
  const getDefaultProgress = (): SpiritualProgress => ({
    currentWeek: 1,
    currentDay: 1,
    daysCompleted: 0,
    weekStartDate: Date.now(),
    lastUpdateDate: Date.now(),
    meditationsCompleted: 0,
    prayerSessionsCompleted: 0,
    mediaListenedMinutes: 0
  })

  const [progress, setProgress] = useState<SpiritualProgress>(() => {
    const saved = localStorage.getItem('appState_progress')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return getDefaultProgress()
      }
    }
    return getDefaultProgress()
  })

  const updateDay = useCallback((newDay: number) => {
    const updated = {
      ...progress,
      currentDay: newDay,
      lastUpdateDate: Date.now(),
      daysCompleted: newDay - 1
    }
    setProgress(updated)
    localStorage.setItem('appState_progress', JSON.stringify(updated))
  }, [progress])

  const updateWeek = useCallback((newWeek: number) => {
    const updated = {
      ...progress,
      currentWeek: newWeek,
      currentDay: 1,
      weekStartDate: Date.now(),
      lastUpdateDate: Date.now()
    }
    setProgress(updated)
    localStorage.setItem('appState_progress', JSON.stringify(updated))
  }, [progress])

  const getProgressPercentage = useCallback(() => {
    // Calculate percentage: (currentDay - 1) / 56 * 100
    return ((progress.currentDay - 1) / 56) * 100
  }, [progress.currentDay])

  return {
    ...progress,
    updateDay,
    updateWeek,
    getProgressPercentage
  }
}

// HOOK: Recommendations
export const useRecommendations = (): Recommendation[] => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const { mediaLibrary } = useMediaLibrary()

  useEffect(() => {
    const recs: Recommendation[] = []
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 9) {
      const prayers = mediaLibrary.filter(m => m.type === 'prayer' || m.category === 'prières')
      if (prayers.length > 0) {
        recs.push({
          id: 'morning_prayer',
          title: 'Prière du Matin',
          description: 'Commencez votre journée avec la prière',
          mediaId: prayers[0].id,
          reason: 'morning'
        })
      }
    }

    const favorites = mediaLibrary.filter(m => m.favorite).slice(0, 2)
    favorites.forEach((fav, i) => {
      recs.push({
        id: `favorite_${i}`,
        title: fav.title,
        description: 'Un de vos favoris',
        mediaId: fav.id,
        reason: 'favorite'
      })
    })

    setRecommendations(recs)
  }, [mediaLibrary])

  return recommendations
}

// HOOK: Prayer Timer
export const usePrayerTimer = (initialSeconds: number = 600) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds)
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  const startTimer = useCallback((seconds?: number) => {
    if (seconds) {
      setTotalSeconds(seconds)
      setTimeRemaining(seconds)
    }
    setIsRunning(true)
  }, [])

  const pauseTimer = useCallback(() => setIsRunning(false), [])
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeRemaining(totalSeconds)
  }, [totalSeconds])

  const formattedTime = `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
  const percentage = (timeRemaining / totalSeconds) * 100

  return {
    timeRemaining,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formattedTime,
    percentage
  }
}

// HOOK: Verse Audio (Text-to-Speech)
export const useVerseAudio = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentVerse, setCurrentVerse] = useState('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices())
      }
      updateVoices()
      window.speechSynthesis.onvoiceschanged = updateVoices
    }
  }, [])

  const speakVerse = useCallback((verseText: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported')
      return
    }

    if (isSpeaking && currentVerse === verseText) {
      // Toggle off
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentVerse('')
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(verseText)
    utterance.lang = 'fr-FR'
    utterance.rate = 0.9
    utterance.pitch = 1

    // Find French voice if available
    const frenchVoice = voices.find(v => v.lang.includes('fr-FR')) || voices[0]
    if (frenchVoice) {
      utterance.voice = frenchVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      setCurrentVerse(verseText)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setCurrentVerse('')
    }

    window.speechSynthesis.speak(utterance)
  }, [isSpeaking, currentVerse, voices])

  return {
    isSpeaking,
    currentVerse,
    speakVerse
  }
}

// HOOK: Clipboard
export const useCopy = () => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }, [])

  return { copied, copyToClipboard }
}
