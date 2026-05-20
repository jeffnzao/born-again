import { MediaItem, MediaType, MediaCategory } from '../types/index'
import { getAudioDuration, generateThumbnail, formatFileSize, SUPPORTED_FORMATS } from '../data/mediaLibrary'

interface ImportOptions {
  type: MediaType
  category: MediaCategory
  subCategory?: string
}

export const generateMediaId = (): string => {
  return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const createMediaItemFromFile = async (
  file: File,
  options: ImportOptions
): Promise<MediaItem | null> => {
  try {
    // Validate file format
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    
    let isValid = false
    if (['audio', 'podcast'].includes(options.type)) {
      isValid = SUPPORTED_FORMATS.audio.includes(ext)
    } else if (options.type === 'song' || options.type === 'hymn' || options.type === 'instrumental') {
      isValid = SUPPORTED_FORMATS.audio.includes(ext)
    } else if (options.type === 'teaching') {
      isValid = SUPPORTED_FORMATS.video.includes(ext) || SUPPORTED_FORMATS.audio.includes(ext)
    } else if (options.type === 'audiobook') {
      isValid = SUPPORTED_FORMATS.audio.includes(ext)
    } else if (options.type === 'prayer') {
      isValid = SUPPORTED_FORMATS.audio.includes(ext)
    }

    if (!isValid) {
      console.error(`Invalid file format: ${ext}`)
      return null
    }

    // Get file duration for audio files
    let duration = 0
    if (SUPPORTED_FORMATS.audio.includes(ext)) {
      duration = await getAudioDuration(file)
    }

    // Generate thumbnail
    const thumbnail = await generateThumbnail(file)

    // Create object URL for the file
    const url = URL.createObjectURL(file)

    // Extract title from filename
    const title = file.name.replace(/\.[^/.]+$/, '')

    const mediaItem: MediaItem = {
      id: generateMediaId(),
      title: title,
      type: options.type,
      category: options.category,
      subCategory: options.subCategory as any,
      source: 'imported',
      url: url,
      thumbnail: thumbnail,
      duration: duration,
      favorite: false,
      createdAt: Date.now(),
      fileSize: file.size,
      mimeType: file.type,
      isAvailable: true,
      playbackProgress: {
        currentTime: 0,
        lastPlayedAt: Date.now()
      }
    }

    return mediaItem
  } catch (error) {
    console.error('Error creating media item:', error)
    return null
  }
}

export const importMultipleFiles = async (
  files: File[],
  options: ImportOptions
): Promise<MediaItem[]> => {
  const mediaItems: MediaItem[] = []

  for (const file of files) {
    try {
      const mediaItem = await createMediaItemFromFile(file, options)
      if (mediaItem) {
        mediaItems.push(mediaItem)
      }
    } catch (error) {
      console.error(`Failed to import ${file.name}:`, error)
    }
  }

  return mediaItems
}

export const validateImportFile = (file: File, expectedTypes?: string[]): boolean => {
  const maxSize = 500 * 1024 * 1024 // 500MB
  
  if (file.size > maxSize) {
    console.error(`File too large: ${formatFileSize(file.size)}`)
    return false
  }

  if (expectedTypes && expectedTypes.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!expectedTypes.includes(ext)) {
      console.error(`Invalid file type: ${ext}`)
      return false
    }
  }

  return true
}

export const saveMediaToLocalStorage = (media: MediaItem[], storageKey = 'appState_media'): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(media))
  } catch (error) {
    console.error('Failed to save media to localStorage:', error)
  }
}

export const loadMediaFromLocalStorage = (storageKey = 'appState_media'): MediaItem[] => {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load media from localStorage:', error)
    return []
  }
}

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

export const getMediaIcon = (type: MediaType): string => {
  const icons: Record<MediaType, string> = {
    'song': '🎵',
    'instrumental': '🎶',
    'podcast': '🎙️',
    'teaching': '📚',
    'prayer': '🙏',
    'audiobook': '📖',
    'hymn': '🎼'
  }
  return icons[type] || '📄'
}

export const getCategoryIcon = (category: MediaCategory): string => {
  const icons: Record<MediaCategory, string> = {
    'chants': '🎵',
    'instrumentaux': '🎶',
    'podcasts': '🎙️',
    'enseignements': '📚',
    'prières': '🙏',
    'livres_audio': '📖',
    'hymnes': '🎼',
    'favoris': '⭐'
  }
  return icons[category] || '📄'
}
