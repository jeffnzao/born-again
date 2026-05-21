import React, { useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import { useAudioEngine } from '../hooks/useAudioEngine'
import { useGlobalPlayer } from '../store/globalPlayer'

export const GlobalMusicPlayer: React.FC = () => {
  const player = useGlobalPlayer()
  const audio = useAudioEngine()

  // Sync with global player
  useEffect(() => {
    if (player.currentMedia) {
      audio.load(player.currentMedia.url)
      if (player.isPlaying) {
        audio.play()
      }
    }
  }, [player.currentMedia])

  // Handle play/pause
  useEffect(() => {
    if (player.isPlaying && !audio.state.isPlaying) {
      audio.play()
    } else if (!player.isPlaying && audio.state.isPlaying) {
      audio.pause()
    }
  }, [player.isPlaying])

  // Handle volume
  useEffect(() => {
    audio.setVolume(player.volume)
  }, [player.volume])

  // Handle playback rate
  useEffect(() => {
    audio.setPlaybackRate(player.playbackRate)
  }, [player.playbackRate])

  if (!player.currentMedia) return null

  const formatTime = (seconds: number): string => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = (audio.state.currentTime / audio.state.duration) * 100 || 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-sacred-500 border-opacity-30 p-4 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Progress bar */}
        <div className="mb-3 cursor-pointer" onClick={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
          const percent = (e.clientX - rect.left) / rect.width
          audio.seek(percent * audio.state.duration)
        }}>
          <div className="bg-slate-700 rounded-full h-1 overflow-hidden">
            <div
              className="bg-sacred-500 h-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Media info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{player.currentMedia.title}</p>
            {player.currentMedia.artist && (
              <p className="text-xs text-gray-400 truncate">{player.currentMedia.artist}</p>
            )}
          </div>

          {/* Playback info and time */}
          <div className="text-xs text-gray-400 whitespace-nowrap">
            {formatTime(audio.state.currentTime)} / {formatTime(audio.state.duration)}
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => player.previousTrack()}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={() => player.setIsPlaying(!player.isPlaying)}
              className="p-2 bg-sacred-600 hover:bg-sacred-700 rounded-lg transition-colors text-white"
            >
              {player.isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              onClick={() => player.nextTrack()}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <SkipForward size={16} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-2">
              <Volume2 size={14} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={player.volume}
                onChange={(e) => player.setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Close */}
            <button
              onClick={() => player.stop()}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-300 hover:text-white ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Status */}
        {audio.state.isBuffering && (
          <div className="mt-2 text-xs text-yellow-400">Chargement...</div>
        )}
        {audio.state.error && (
          <div className="mt-2 text-xs text-red-400">Erreur: {audio.state.error}</div>
        )}
      </div>
    </div>
  )
}
