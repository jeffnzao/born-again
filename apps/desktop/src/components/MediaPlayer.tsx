import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Zap } from 'lucide-react'
import { MediaItem } from '../types/index'
import { formatDuration } from '../utils/mediaImport'

interface MediaPlayerProps {
  media: MediaItem | null
  isPlaying: boolean
  currentTime: number
  volume: number
  playbackSpeed: number
  onPlayPause: () => void
  onNext?: () => void
  onPrevious?: () => void
  onTimeChange: (time: number) => void
  onVolumeChange: (volume: number) => void
  onSpeedChange: (speed: number) => void
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  media,
  isPlaying,
  currentTime,
  volume,
  playbackSpeed,
  onPlayPause,
  onNext,
  onPrevious,
  onTimeChange,
  onVolumeChange,
  onSpeedChange
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !media) return

    // Update audio source
    audio.src = media.url
    audio.playbackRate = playbackSpeed
    audio.volume = volume

    // Handle play/pause
    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err))
    } else {
      audio.pause()
    }
  }, [media, isPlaying, playbackSpeed, volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      onTimeChange(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      onNext?.()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onNext, onTimeChange])

  if (!media) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-gray-400">
        Aucun média sélectionné
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Media Info */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white truncate">{media.title}</h3>
        {media.artist && (
          <p className="text-sm text-gray-400">{media.artist}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime || 0}
          onChange={(e) => {
            const audio = audioRef.current
            if (audio) {
              audio.currentTime = parseFloat(e.target.value)
              onTimeChange(parseFloat(e.target.value))
            }
          }}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sacred-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(Math.floor(duration))}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Play Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onPrevious}
            disabled={!onPrevious}
            className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={onPlayPause}
            className="bg-sacred-600 hover:bg-sacred-700 text-white p-3 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>

          <button
            onClick={onNext}
            disabled={!onNext}
            className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume and Speed */}
        <div className="grid grid-cols-2 gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sacred-500"
            />
            <span className="text-xs text-gray-400 w-6 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-gray-400" />
            <select
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-sacred-400"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
