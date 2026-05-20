import { MediaItem, MediaCategory, Recommendation } from '../types/index'

// EMPTY MEDIA LIBRARY - Users import their own content
export const mediaLibrary: MediaItem[] = []

// DEFAULT EMPTY STATE FOR EACH CATEGORY
export const emptyMediaState: Record<MediaCategory, MediaItem[]> = {
  chants: [],
  instrumentaux: [],
  podcasts: [],
  enseignements: [],
  prières: [],
  livres_audio: [],
  hymnes: [],
  favoris: []
}

// SUPPORTED FILE TYPES
export const SUPPORTED_FORMATS = {
  audio: ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'],
  video: ['mp4', 'webm', 'mkv', 'mov'],
  documents: ['pdf', 'epub', 'txt']
}

// UTILITY: Validate file format
export const isValidAudioFormat = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return SUPPORTED_FORMATS.audio.includes(ext)
}

export const isValidVideoFormat = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return SUPPORTED_FORMATS.video.includes(ext)
}

export const isValidDocumentFormat = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return SUPPORTED_FORMATS.documents.includes(ext)
}

// UTILITY: Get media category from type
export const getMediaCategory = (type: string): MediaCategory => {
  const categoryMap: Record<string, MediaCategory> = {
    'song': 'chants',
    'hymn': 'hymnes',
    'instrumental': 'instrumentaux',
    'podcast': 'podcasts',
    'teaching': 'enseignements',
    'prayer': 'prières',
    'audiobook': 'livres_audio'
  }
  return categoryMap[type] || 'chants'
}

// UTILITY: Get duration from audio file
export const getAudioDuration = (file: File): Promise<number> => {
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

// UTILITY: Generate file preview thumbnail
export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = () => {
      resolve('')
    }
    reader.readAsDataURL(file)
  })
}

// UTILITY: Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// PRAYER THEMES
export const PRAYER_THEMES = [
  { id: 'repentance', label: 'Repentance', icon: '🙏' },
  { id: 'combat_spirituel', label: 'Combat Spirituel', icon: '⚔️' },
  { id: 'sanctification', label: 'Sanctification', icon: '✨' },
  { id: 'discipline', label: 'Discipline', icon: '💪' },
  { id: 'foi', label: 'Foi', icon: '🌟' },
  { id: 'delivrance', label: 'Délivrance', icon: '🔓' },
  { id: 'saint_esprit', label: 'Saint-Esprit', icon: '🕊️' }
]

// CLASSIC SPIRITUAL AUTHORS FOR AUDIOBOOKS (Structure only, no actual files)
export const CLASSIC_AUTHORS = [
  {
    id: 'watchman_nee',
    name: 'Watchman Nee',
    books: [
      'The Normal Christian Life',
      'The Spiritual Man'
    ]
  },
  {
    id: 'andrew_murray',
    name: 'Andrew Murray',
    books: [
      'Abiding in Christ',
      'The Prayer Life'
    ]
  },
  {
    id: 'aw_tozer',
    name: 'A. W. Tozer',
    books: [
      'The Pursuit of God',
      'Knowledge of the Holy'
    ]
  },
  {
    id: 'charles_spurgeon',
    name: 'Charles Spurgeon',
    books: [
      'Lectures to My Students',
      'All of Grace'
    ]
  }
]

// RECOMMENDATION ENGINE (Updated for real content)
export const generateRecommendations = (
  currentWeek: number,
  currentDay: number,
  userMood: number,
  recentActivity: string[],
  isCombatMode: boolean,
  userLibrary: MediaItem[]
): Recommendation[] => {
  const recommendations: Recommendation[] = []
  const now = Date.now()

  // If in combat mode and user has imported relevant content
  if (isCombatMode) {
    const victorySongs = userLibrary.filter(m =>
      m.category === 'chants' && 
      (m.title.toLowerCase().includes('victoire') || 
       m.title.toLowerCase().includes('force'))
    )
    
    if (victorySongs.length > 0) {
      recommendations.push({
        id: 'rec_combat_1',
        title: victorySongs[0].title,
        reason: 'Pour renforcer ta foi en ce moment de tentation',
        type: 'media',
        contentId: victorySongs[0].id,
        priority: 'high',
        timestamp: now
      })
    }

    const prayerMusic = userLibrary.filter(m =>
      m.category === 'instrumentaux' || 
      m.category === 'prières'
    )
    
    if (prayerMusic.length > 0) {
      recommendations.push({
        id: 'rec_combat_2',
        title: prayerMusic[0].title,
        reason: 'Pour fortifier ton esprit en prière',
        type: 'media',
        contentId: prayerMusic[0].id,
        priority: 'high',
        timestamp: now
      })
    }

    const teachings = userLibrary.filter(m => m.category === 'enseignements')
    if (teachings.length > 0) {
      recommendations.push({
        id: 'rec_combat_3',
        title: teachings[0].title,
        reason: 'Comprendre les stratégies bibliques pour la victoire',
        type: 'media',
        contentId: teachings[0].id,
        priority: 'medium',
        timestamp: now
      })
    }
  }

  // Week-based recommendations for imported content
  if (currentWeek === 1) {
    const repentancePrayers = userLibrary.filter(m =>
      m.category === 'prières' && 
      m.subCategory === 'repentance'
    )
    if (repentancePrayers.length > 0) {
      recommendations.push({
        id: 'rec_week1_1',
        title: repentancePrayers[0].title,
        reason: 'Méditation sur la restauration spirituelle',
        type: 'media',
        contentId: repentancePrayers[0].id,
        priority: 'high',
        timestamp: now
      })
    }
  }

  if (currentWeek === 2) {
    const disciplineContent = userLibrary.filter(m =>
      (m.category === 'enseignements' || m.category === 'livres_audio') && 
      m.subCategory === 'discipline'
    )
    if (disciplineContent.length > 0) {
      recommendations.push({
        id: 'rec_week2_1',
        title: disciplineContent[0].title,
        reason: 'Approfondissement sur la discipline spirituelle',
        type: 'media',
        contentId: disciplineContent[0].id,
        priority: 'high',
        timestamp: now
      })
    }
  }

  return recommendations
}

// DEFAULT TEACHING SOURCES (Structure for adding external content)
export const TEACHING_SOURCES = [
  {
    id: 'emci_tv',
    name: 'EMCI TV',
    url: 'https://emcitv.com',
    icon: '📺',
    description: 'Contenu spirituel français'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: '▶️',
    description: 'Enseignements et prédications'
  },
  {
    id: 'podcast_platforms',
    name: 'Podcasts',
    url: 'https://podcasts.google.com',
    icon: '🎙️',
    description: 'Enseignements en audio'
  }
]

// UTILITY: Filter media by category
export const filterMediaByCategory = (media: MediaItem[], category: MediaCategory): MediaItem[] => {
  return media.filter(m => m.category === category)
}

// UTILITY: Get filtered favorites
export const getFavorites = (media: MediaItem[]): MediaItem[] => {
  return media.filter(m => m.favorite)
}
