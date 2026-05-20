import React, { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Volume2,
  SkipBack,
  SkipForward,
  X
} from 'lucide-react'
import { MediaItem } from '../types/index'
import { formatDuration } from '../utils/mediaStorage'

interface MediaPlayerProps {
  media: MediaItem | null
  isPlaying: boolean
  volume: number
  currentTime: number
  playbackSpeed: number
  onPlayNext?: () => void
  onPlayPrevious?: () => void
  onPlay: () => void
  onPause: () => void
  onVolumeChange: (volume: number) => void
  onTimeChange: (time: number) => void
  onSpeedChange: (speed: number) => void
  onClose?: () => void
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  media,
  isPlaying,
  volume,
  currentTime,
  playbackSpeed,
  onPlayNext,
  onPlayPrevious,
  onPlay,
  onPause,
  onVolumeChange,
  onTimeChange,
  onSpeedChange,
  onClose
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !media) return

    if (isPlaying) {
      audioRef.current.play().catch(err => console.error('Playback error:', err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, media])

  // Update audio source
  useEffect(() => {
    if (!audioRef.current || !media) return
    audioRef.current.src = media.url
    audioRef.current.currentTime = currentTime
  }, [media, currentTime])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setBuffered(audio.buffered.length > 0 ? audio.buffered.end(0) : 0)
      // Only update if not seeking
      if (!isUserSeeking) {
        onTimeChange(audio.currentTime)
      }
    }

    const handleEnded = () => {
      onPlayNext?.()
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onTimeChange, onPlayNext])

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Handle playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  const [isUserSeeking, setIsUserSeeking] = useState(false)

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audioRef.current.currentTime = newTime
    onTimeChange(newTime)
  }

  const handleProgressMouseDown = () => {
    setIsUserSeeking(true)
  }

  const handleProgressMouseUp = () => {
    setIsUserSeeking(false)
  }

  if (!media) {
    return null
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-slate-900 to-slate-800 text-white shadow-2xl border-t border-sacred-500/20 z-40">
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Progress Bar */}
      <div
        className="w-full h-1 bg-slate-700 cursor-pointer group"
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
        onMouseUp={handleProgressMouseUp}
        onMouseLeave={handleProgressMouseUp}
      >
        <div
          className="h-full bg-slate-400 transition-all"
          style={{ width: `${bufferedPercent}%` }}
        />
        <div
          className="absolute -top-2 h-5 w-1 bg-sacred-500 opacity-0 group-hover:opacity-100 transition-all"
          style={{ left: `${progressPercent}%` }}
        />
        <div
          className="h-full bg-sacred-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-4">
        {/* Media Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-white truncate">{media.title}</h3>
            <p className="text-sm text-slate-400">{media.artist || media.author || 'Inconnu'}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Fermer le lecteur"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Time Display */}
          <div className="text-sm font-mono text-slate-300 min-w-12">
            {formatDuration(Math.floor(currentTime))}
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onPlayPrevious}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Piste précédente"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={isPlaying ? onPause : onPlay}
              className="p-3 bg-sacred-500 hover:bg-sacred-600 rounded-full transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={onPlayNext}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Piste suivante"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 size={20} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={e => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume"
            />
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <select
              value={playbackSpeed}
              onChange={e => onSpeedChange(parseFloat(e.target.value))}
              className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 hover:border-sacred-500"
              aria-label="Vitesse de lecture"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {/* Duration Display */}
          <div className="text-sm font-mono text-slate-300 min-w-12 text-right">
            {formatDuration(Math.floor(duration))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaPlayer
