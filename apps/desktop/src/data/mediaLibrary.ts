import { MediaItem, MediaCategory, Recommendation } from '../types/index'

// Empty media library - data comes from storage system
export const mediaLibrary: MediaItem[] = []

// Empty state for each category
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

// Supported file formats
export const SUPPORTED_FORMATS = {
  audio: ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'],
  video: ['mp4', 'webm', 'mkv', 'mov'],
  documents: ['pdf', 'epub', 'txt']
}

// Validate audio format
export const isValidAudioFormat = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return SUPPORTED_FORMATS.audio.includes(ext)
}

// Get media category from type
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

// Filter media by category
export const filterMediaByCategory = (media: MediaItem[], category: MediaCategory): MediaItem[] => {
  if (category === 'favoris') {
    return media.filter(m => m.favorite)
  }
  return media.filter(m => m.category === category)
}

// Get favorites
export const getFavorites = (media: MediaItem[]): MediaItem[] => {
  return media.filter(m => m.favorite)
}

// Generate recommendations based on user library
export const generateRecommendations = (
  week: number,
  day: number,
  mood: string,
  activity: string,
  isCombatMode: boolean,
  userLibrary: MediaItem[]
): Recommendation[] => {
  const recommendations: Recommendation[] = []
  const hour = new Date().getHours()

  // Morning prayer
  if (hour >= 5 && hour < 9) {
    const prayers = userLibrary.filter(m => m.type === 'prayer' || m.category === 'prières')
    if (prayers.length > 0) {
      recommendations.push({
        id: 'morning_prayer',
        title: 'Prière du Matin',
        description: 'Commencez votre journée avec la prière',
        mediaId: prayers[0].id,
        reason: 'morning'
      })
    }
  }

  // Midday teaching
  if (hour >= 12 && hour < 14) {
    const teachings = userLibrary.filter(m => m.type === 'teaching' || m.category === 'enseignements')
    if (teachings.length > 0) {
      recommendations.push({
        id: 'midday_teaching',
        title: 'Enseignement du Jour',
        description: 'Enrichissez votre compréhension spirituelle',
        mediaId: teachings[0].id,
        reason: 'learning'
      })
    }
  }

  // Combat mode - instrumental for strength
  if (isCombatMode) {
    const instrumentals = userLibrary.filter(m => m.type === 'instrumental' || m.category === 'instrumentaux')
    if (instrumentals.length > 0) {
      recommendations.push({
        id: 'combat_strength',
        title: 'Musique de Force',
        description: 'Force pour le combat spirituel',
        mediaId: instrumentals[0].id,
        reason: 'strength'
      })
    }
  }

  return recommendations
}

// Prayer themes
export const PRAYER_THEMES = [
  { id: 'repentance', label: 'Repentance' },
  { id: 'combat_spirituel', label: 'Combat Spirituel' },
  { id: 'sanctification', label: 'Sanctification' },
  { id: 'discipline', label: 'Discipline' },
  { id: 'foi', label: 'Foi' },
  { id: 'delivrance', label: 'Délivrance' },
  { id: 'saint_esprit', label: 'Saint Esprit' }
]

// Teaching sources
export const TEACHING_SOURCES = [
  { id: 'emci_tv', name: 'EMCI TV', url: 'https://www.emci.tv' },
  { id: 'youtube', name: 'YouTube Chrétien', url: 'https://www.youtube.com' },
  { id: 'podcasts', name: 'Podcasts Spirituels', url: 'https://podcasts.apple.com' }
]
