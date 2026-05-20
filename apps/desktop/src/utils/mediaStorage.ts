import { MediaItem, MediaCategory } from '../types/index'

/**
 * MEDIA STORAGE SYSTEM
 * Manages both default media and user-imported media
 */

const STORAGE_KEY = 'nc_media_library'
const DEFAULT_MEDIA_KEY = 'nc_default_media_loaded'

// Load default media metadata
export const loadDefaultMedia = async (): Promise<MediaItem[]> => {
  try {
    // Check if already loaded
    const alreadyLoaded = localStorage.getItem(DEFAULT_MEDIA_KEY)
    if (alreadyLoaded === 'true') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    }

    // Fetch metadata
    const response = await fetch('/default-media/metadata.json')
    if (!response.ok) throw new Error('Failed to load metadata')
    
    const metadata = await response.json()
    const mediaItems: MediaItem[] = []

    // Convert metadata to MediaItem objects
    for (const category in metadata) {
      if (Array.isArray(metadata[category])) {
        metadata[category].forEach((item: any) => {
          mediaItems.push({
            id: item.id,
            title: item.title,
            type: item.type,
            category: item.category as MediaCategory,
            subCategory: item.subCategory,
            source: 'imported',
            url: `/default-media/${category}/${item.filename}`,
            thumbnail: item.thumbnail || '',
            duration: item.duration || 0,
            favorite: false,
            createdAt: Date.now(),
            artist: item.artist,
            author: item.author,
            description: item.description,
            isAvailable: true
          })
        })
      }
    }

    // Save to localStorage
    saveMediaLibrary(mediaItems)
    localStorage.setItem(DEFAULT_MEDIA_KEY, 'true')
    return mediaItems
  } catch (error) {
    console.error('Error loading default media:', error)
    return []
  }
}

// Save media library to localStorage
export const saveMediaLibrary = (items: MediaItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving media library:', error)
  }
}

// Get current media library
export const getMediaLibrary = (): MediaItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading media library:', error)
    return []
  }
}

// Add media to library
export const addMediaToLibrary = (media: MediaItem): void => {
  const library = getMediaLibrary()
  const exists = library.some(m => m.id === media.id)
  if (!exists) {
    library.push(media)
    saveMediaLibrary(library)
  }
}

// Remove media from library
export const removeMediaFromLibrary = (mediaId: string): void => {
  const library = getMediaLibrary()
  const filtered = library.filter(m => m.id !== mediaId)
  saveMediaLibrary(filtered)
}

// Update media
export const updateMedia = (mediaId: string, updates: Partial<MediaItem>): void => {
  const library = getMediaLibrary()
  const updated = library.map(m =>
    m.id === mediaId ? { ...m, ...updates } : m
  )
  saveMediaLibrary(updated)
}

// Toggle favorite
export const toggleFavorite = (mediaId: string): void => {
  const library = getMediaLibrary()
  const media = library.find(m => m.id === mediaId)
  if (media) {
    media.favorite = !media.favorite
    saveMediaLibrary(library)
  }
}

// Get media by category
export const getMediaByCategory = (category: MediaCategory): MediaItem[] => {
  const library = getMediaLibrary()
  return library.filter(m => m.category === category)
}

// Get favorites
export const getFavorites = (): MediaItem[] => {
  const library = getMediaLibrary()
  return library.filter(m => m.favorite)
}

// Handle file import
export const importAudioFile = async (file: File): Promise<MediaItem | null> => {
  try {
    // Validate file
    const validFormats = ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac', 'mp4', 'webm']
    const ext = file.name.split('.').pop()?.toLowerCase()
    
    if (!ext || !validFormats.includes(ext)) {
      throw new Error(`Format not supported: ${ext}`)
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB max
      throw new Error('File too large (max 500MB)')
    }

    // Create object URL
    const url = URL.createObjectURL(file)

    // Get duration for audio files
    let duration = 0
    if (['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'].includes(ext)) {
      duration = await getAudioDuration(file)
    }

    // Create media item
    const mediaItem: MediaItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: ext === 'mp4' ? 'teaching' : 'song',
      category: 'chants',
      source: 'imported',
      url: url,
      duration: duration,
      favorite: false,
      createdAt: Date.now(),
      fileSize: file.size,
      mimeType: file.type,
      isAvailable: true
    }

    return mediaItem
  } catch (error) {
    console.error('Error importing file:', error)
    return null
  }
}

// Get audio duration
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve(Math.floor(audio.duration))
    })

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      resolve(0)
    })

    audio.src = url
  })
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Format duration
export const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '0:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Clear library (for testing)
export const clearMediaLibrary = (): void => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(DEFAULT_MEDIA_KEY)
}

// Export all functions
export default {
  loadDefaultMedia,
  saveMediaLibrary,
  getMediaLibrary,
  addMediaToLibrary,
  removeMediaFromLibrary,
  updateMedia,
  toggleFavorite,
  getMediaByCategory,
  getFavorites,
  importAudioFile,
  formatFileSize,
  formatDuration,
  clearMediaLibrary
}
