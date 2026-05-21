import { MediaItem, MediaCategory, MediaType } from '../types/index'

const IMPORTED_MEDIA_KEY = 'nc_imported_media'

/**
 * Convert File to base64 URL for storage
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

/**
 * Get file duration from media file
 */
export const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    audio.src = url
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve(audio.duration)
    })
    audio.addEventListener('error', reject)
  })
}

/**
 * Get media category from file type
 */
export const getCategoryFromMimeType = (mimeType: string): MediaCategory => {
  if (mimeType.includes('audio')) return 'chants'
  if (mimeType.includes('video')) return 'enseignements'
  if (mimeType.includes('pdf')) return 'livres_audio'
  return 'chants'
}

/**
 * Get media type from file
 */
export const getMediaTypeFromMimeType = (mimeType: string): MediaType => {
  if (mimeType.includes('mp3') || mimeType.includes('audio')) return 'song'
  if (mimeType.includes('mp4') || mimeType.includes('video')) return 'teaching'
  if (mimeType.includes('pdf')) return 'audiobook'
  return 'song'
}

/**
 * Import media file from local PC
 */
export const importMediaFile = async (file: File): Promise<MediaItem> => {
  try {
    const base64Url = await fileToBase64(file)
    const duration = await getMediaDuration(file)
    const category = getCategoryFromMimeType(file.type)
    const mediaType = getMediaTypeFromMimeType(file.type)

    const mediaItem: MediaItem = {
      id: `imported_${Date.now()}_${Math.random()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: mediaType,
      category,
      source: 'imported',
      url: base64Url,
      duration,
      favorite: false,
      createdAt: Date.now(),
      fileSize: file.size,
      mimeType: file.type,
      isAvailable: true,
    }

    // Save to localStorage
    const saved = localStorage.getItem(IMPORTED_MEDIA_KEY)
    const imported = saved ? JSON.parse(saved) : []
    imported.push(mediaItem)
    localStorage.setItem(IMPORTED_MEDIA_KEY, JSON.stringify(imported))

    return mediaItem
  } catch (error) {
    console.error('Error importing media:', error)
    throw error
  }
}

/**
 * Get all imported media
 */
export const getImportedMedia = (): MediaItem[] => {
  const saved = localStorage.getItem(IMPORTED_MEDIA_KEY)
  return saved ? JSON.parse(saved) : []
}

/**
 * Remove imported media
 */
export const removeImportedMedia = (mediaId: string): void => {
  const saved = localStorage.getItem(IMPORTED_MEDIA_KEY)
  if (saved) {
    const imported = JSON.parse(saved)
    const filtered = imported.filter((m: MediaItem) => m.id !== mediaId)
    localStorage.setItem(IMPORTED_MEDIA_KEY, JSON.stringify(filtered))
  }
}

/**
 * Get streaming URL for radio
 */
export const getRadioStreams = () => {
  return {
    dclmFrench: {
      name: 'DCLM French Radio',
      url: 'https://radio.dclm.org/french',
      type: 'streaming',
      description: 'Daily Christian Living for Men - French',
    },
    emciTV: {
      name: 'EMCI TV',
      url: 'https://emcitv.com',
      type: 'streaming',
      description: 'Enseignements bibliques en français',
    },
  }
}

/**
 * Download PDF
 */
export const downloadPDF = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate example media for testing
 */
export const generateDefaultMedia = (): MediaItem[] => {
  return [
    {
      id: 'default_pray_1',
      title: 'Prière du Matin - Sanctification',
      type: 'prayer',
      category: 'prières',
      subCategory: 'sanctification',
      source: 'imported',
      url: '', // Will be set when file is available
      duration: 0,
      favorite: false,
      createdAt: Date.now(),
      description: 'Une prière guidée pour commencer ta journée en sainteté',
      isAvailable: false,
    },
    {
      id: 'default_hymn_1',
      title: 'Amazing Grace',
      type: 'hymn',
      category: 'hymnes',
      source: 'external_url',
      url: '', // Will be set when file is available
      duration: 0,
      favorite: false,
      createdAt: Date.now(),
      artist: 'Traditional',
      description: 'L\'hymne spirituel classique',
      isAvailable: false,
    },
    {
      id: 'default_worship_1',
      title: 'Worship Song',
      type: 'song',
      category: 'chants',
      source: 'external_url',
      url: '', // Will be set when file is available
      duration: 0,
      favorite: false,
      createdAt: Date.now(),
      description: 'Chant de louange',
      isAvailable: false,
    },
  ]
}

/**
 * Load default media files from public/default-media/
 */
export const loadDefaultMedia = async (): Promise<void> => {
  const INITIALIZED_KEY = 'nc_default_media_initialized'
  
  // Skip if already initialized
  if (localStorage.getItem(INITIALIZED_KEY)) {
    return
  }

  try {
    const defaultMediaFiles: Record<string, Array<{ file: string; title: string; artist?: string }>> = {
      chants: [
        { file: '/default-media/chants/au-nom-de-jesus.wav', title: 'Au Nom de Jésus' },
        { file: '/default-media/chants/victoire-en-christ.wav', title: 'Victoire en Christ' },
      ],
      instrumentaux: [
        { file: '/default-media/instrumentaux/musique-priere.wav', title: 'Musique de Prière' },
      ],
      prières: [
        { file: '/default-media/prieres/priere-repentance.wav', title: 'Prière de Repentance' },
      ],
      podcasts: [
        { file: '/default-media/podcasts/reflexion-spirituelle.wav', title: 'Réflexion Spirituelle' },
      ],
      hymnes: [
        { file: '/default-media/hymnes/grand-dieu.wav', title: 'Grand Dieu nous te Louons' },
      ],
      livres_audio: [
        { file: '/default-media/livres-audio/vie-normale-chretien.wav', title: 'La Vie Normale du Chrétien' },
      ],
      enseignements: [
        { file: '/default-media/enseignements/purete-spirituelle.mp4', title: 'La Pureté Spirituelle' },
      ],
    }

    const mediaItems: MediaItem[] = []
    
    for (const [category, files] of Object.entries(defaultMediaFiles)) {
      for (const fileInfo of files) {
        try {
          // Try to fetch the file to check if it exists
          const response = await fetch(fileInfo.file)
          if (response.ok) {
            const blob = await response.blob()
            
            // Create a MediaItem for each file
            const mediaItem: MediaItem = {
              id: `default_${Date.now()}_${Math.random()}`,
              title: fileInfo.title,
              type: category.includes('chants') ? 'song' : 
                     category.includes('instrumental') ? 'instrumental' : 
                     category.includes('prière') ? 'prayer' : 
                     category.includes('podcast') ? 'podcast' : 
                     category.includes('hymne') ? 'hymn' : 
                     category.includes('livre') ? 'audiobook' : 'teaching',
              category: category as MediaCategory,
              source: 'default',
              url: fileInfo.file,
              duration: 0,
              favorite: false,
              createdAt: Date.now(),
              artist: fileInfo.artist || '',
              description: `Default media: ${fileInfo.title}`,
              isAvailable: true,
            }
            
            mediaItems.push(mediaItem)
          }
        } catch (error) {
          console.log(`Could not load default media: ${fileInfo.file}`)
        }
      }
    }

    // If we found any media items, save them to localStorage
    if (mediaItems.length > 0) {
      const existing = localStorage.getItem(IMPORTED_MEDIA_KEY)
      const allMedia = existing ? [...JSON.parse(existing), ...mediaItems] : mediaItems
      localStorage.setItem(IMPORTED_MEDIA_KEY, JSON.stringify(allMedia))
    }

    // Mark as initialized
    localStorage.setItem(INITIALIZED_KEY, 'true')
  } catch (error) {
    console.error('Error loading default media:', error)
  }
}
