import { useState, useEffect, useRef, useCallback } from 'react'
import { MediaItem } from '../types/index'

export interface AudioEngineState {
  isPlaying: boolean
  isPaused: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  isBuffering: boolean
  error: string | null
  canPlay: boolean
}

export const useAudioEngine = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    playbackRate: 1,
    isBuffering: false,
    error: null,
    canPlay: false,
  })

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.crossOrigin = 'anonymous'
    }

    const audio = audioRef.current

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false, error: null }))
    }

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
    }

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      }))
    }

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration,
        canPlay: true,
        isBuffering: false,
      }))
    }

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isBuffering: true }))
    }

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, canPlay: true, isBuffering: false }))
    }

    const handleError = () => {
      const errorMessage = audio.error?.message || 'Audio error occurred'
      console.error('Audio error:', errorMessage)
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isPlaying: false,
        isBuffering: false,
      }))
    }

    const handleEnded = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }))
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const load = useCallback((url: string) => {
    if (!audioRef.current) return
    setState(prev => ({ ...prev, error: null, isBuffering: true }))
    audioRef.current.src = url
    audioRef.current.load()
  }, [])

  const play = useCallback(async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.play()
    } catch (err) {
      console.error('Play error:', err)
      setState(prev => ({
        ...prev,
        error: 'Unable to play audio',
        isPlaying: false,
      }))
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }))
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration))
    }
  }, [state.duration])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      const vol = Math.max(0, Math.min(1, volume))
      audioRef.current.volume = vol
      setState(prev => ({ ...prev, volume: vol }))
    }
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
      setState(prev => ({ ...prev, playbackRate: rate }))
    }
  }, [])

  const mute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = true
    }
  }, [])

  const unmute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = false
    }
  }, [])

  return {
    state,
    load,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
    mute,
    unmute,
    audioRef,
  }
}
