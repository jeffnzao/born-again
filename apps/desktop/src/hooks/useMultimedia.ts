import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { MediaItem, Recommendation, SpiritualProgress } from '../types/index'
import { mediaLibrary, generateRecommendations } from '../data/mediaLibrary'

// HOOK: Media Library
export const useMediaLibrary = () => {
  const store = useAppStore()
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)

  const addToLibrary = useCallback((media: MediaItem) => {
    const exists = store.media_library?.some(m => m.id === media.id)
    if (!exists) {
      const updated = [...(store.media_library || []), media]
      localStorage.setItem('appState_media', JSON.stringify(updated))
    }
  }, [store])

  const toggleFavorite = useCallback((mediaId: string) => {
    const updated = (store.media_library || []).map(m =>
      m.id === mediaId ? { ...m, favorite: !m.favorite } : m
    )
    localStorage.setItem('appState_media', JSON.stringify(updated))
  }, [store])

  const playMedia = useCallback((media: MediaItem) => {
    setCurrentMedia(media)
    setIsPlaying(true)
  }, [])

  const pauseMedia = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const resumeMedia = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const stopMedia = useCallback(() => {
    setCurrentMedia(null)
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  return {
    currentMedia,
    isPlaying,
    volume,
    currentTime,
    mediaLibrary: store.media_library || mediaLibrary,
    playMedia,
    pauseMedia,
    resumeMedia,
    stopMedia,
    toggleFavorite,
    addToLibrary,
    setVolume,
    setCurrentTime
  }
}

// HOOK: Spiritual Progress Tracking
export const useSpiritualProgress = () => {
  const store = useAppStore()
  const [progress, setProgress] = useState<SpiritualProgress>(() => {
    const saved = localStorage.getItem('appState_progress')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      currentWeek: 1,
      currentDay: 1,
      daysCompleted: 0,
      weekStartDate: Date.now(),
      lastUpdateDate: Date.now(),
      meditationsCompleted: 0,
      prayerSessionsCompleted: 0,
      mediaListenedMinutes: 0
    }
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

  const recordMeditation = useCallback(() => {
    const updated = {
      ...progress,
      meditationsCompleted: progress.meditationsCompleted + 1,
      lastUpdateDate: Date.now()
    }
    setProgress(updated)
    localStorage.setItem('appState_progress', JSON.stringify(updated))
  }, [progress])

  const recordPrayerSession = useCallback((minutes: number) => {
    const updated = {
      ...progress,
      prayerSessionsCompleted: progress.prayerSessionsCompleted + 1,
      lastUpdateDate: Date.now()
    }
    setProgress(updated)
    localStorage.setItem('appState_progress', JSON.stringify(updated))
  }, [progress])

  const recordMediaListened = useCallback((minutes: number) => {
    const updated = {
      ...progress,
      mediaListenedMinutes: progress.mediaListenedMinutes + minutes,
      lastUpdateDate: Date.now()
    }
    setProgress(updated)
    localStorage.setItem('appState_progress', JSON.stringify(updated))
  }, [progress])

  const getProgressPercentage = useCallback(() => {
    const weekCompletion = (progress.currentDay / 7) * 100
    return Math.min(weekCompletion, 100)
  }, [progress])

  return {
    ...progress,
    updateDay,
    updateWeek,
    recordMeditation,
    recordPrayerSession,
    recordMediaListened,
    getProgressPercentage
  }
}

// HOOK: Recommendations Engine
export const useRecommendations = () => {
  const store = useAppStore()
  const progress = useSpiritualProgress()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isCombatMode, setIsCombatMode] = useState(false)

  // Generate recommendations when context changes
  useEffect(() => {
    const generated = generateRecommendations(
      progress.currentWeek,
      progress.currentDay,
      store.statistics?.bible_readings || 0,
      [],
      isCombatMode
    )
    setRecommendations(generated)
  }, [progress.currentWeek, progress.currentDay, isCombatMode, store.statistics?.bible_readings])

  return {
    recommendations,
    isCombatMode,
    setIsCombatMode
  }
}

// HOOK: Prayer Timer
export const usePrayerTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [totalTime, setTotalTime] = useState(0)

  const startTimer = useCallback((minutes: number) => {
    setTimeLeft(minutes * 60)
    setTotalTime(minutes * 60)
    setIsRunning(true)
  }, [])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resumeTimer = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stopTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(0)
    setTotalTime(0)
  }, [])

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPercentage = () => {
    if (totalTime === 0) return 0
    return (timeLeft / totalTime) * 100
  }

  return {
    timeLeft,
    isRunning,
    totalTime,
    formattedTime: formatTime(timeLeft),
    percentage: getPercentage(),
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  }
}

// HOOK: Verse Text-to-Speech
export const useVerseAudio = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentVerse, setCurrentVerse] = useState('')

  const speakVerse = useCallback((verseText: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(verseText)
    utterance.lang = 'fr-FR' // French language
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => {
      setIsSpeaking(true)
      setCurrentVerse(verseText)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    isSpeaking,
    currentVerse,
    speakVerse,
    stopSpeaking
  }
}

// HOOK: Clipboard Copy
export const useCopy = () => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback((text: string) => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const elem = document.createElement('textarea')
      elem.value = text
      document.body.appendChild(elem)
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }, [])

  return { copied, copyToClipboard }
}
