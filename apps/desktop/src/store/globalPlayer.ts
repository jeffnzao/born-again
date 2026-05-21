import { create } from 'zustand'
import { MediaItem } from '../types/index'

export interface GlobalPlayerState {
  currentMedia: MediaItem | null
  isPlaying: boolean
  playList: MediaItem[]
  currentIndex: number
  volume: number
  playbackRate: number
  
  // Actions
  setCurrentMedia: (media: MediaItem | null) => void
  setIsPlaying: (playing: boolean) => void
  setPlayList: (list: MediaItem[]) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  nextTrack: () => void
  previousTrack: () => void
  stop: () => void
}

export const useGlobalPlayer = create<GlobalPlayerState>((set, get) => ({
  currentMedia: null,
  isPlaying: false,
  playList: [],
  currentIndex: 0,
  volume: 0.8,
  playbackRate: 1,

  setCurrentMedia: (media) => set({ currentMedia: media }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlayList: (list) => set({ playList: list, currentIndex: 0 }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setPlaybackRate: (rate) => set({ playbackRate: Math.max(0.5, Math.min(2, rate)) }),

  nextTrack: () => {
    const { playList, currentIndex } = get()
    if (playList.length > 0) {
      const nextIndex = (currentIndex + 1) % playList.length
      set({
        currentIndex: nextIndex,
        currentMedia: playList[nextIndex],
        isPlaying: true,
      })
    }
  },

  previousTrack: () => {
    const { playList, currentIndex } = get()
    if (playList.length > 0) {
      const prevIndex = Math.max(0, currentIndex - 1)
      set({
        currentIndex: prevIndex,
        currentMedia: playList[prevIndex],
      })
    }
  },

  stop: () => set({
    currentMedia: null,
    isPlaying: false,
  }),
}))
