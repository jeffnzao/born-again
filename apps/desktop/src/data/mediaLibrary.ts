import { MediaItem, Recommendation } from '../types/index'

// MEDIA LIBRARY - Sample content
export const mediaLibrary: MediaItem[] = [
  // WORSHIP SONGS
  {
    id: 'song_001',
    title: 'Au Nom de Jésus',
    type: 'song',
    category: 'worship',
    url: 'https://www.youtube.com/embed/WmVhVdKxGkI',
    thumbnail: 'https://img.youtube.com/vi/WmVhVdKxGkI/maxresdefault.jpg',
    duration: 240,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Jésus Culture',
    views: 1200000
  },
  {
    id: 'song_002',
    title: 'Victoire en Christ',
    type: 'song',
    category: 'worship',
    url: 'https://www.youtube.com/embed/J-Ui1_4aFkE',
    thumbnail: 'https://img.youtube.com/vi/J-Ui1_4aFkE/maxresdefault.jpg',
    duration: 320,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Communauté Chrétienne',
    views: 980000
  },
  {
    id: 'song_003',
    title: 'Grâce Suffisante',
    type: 'song',
    category: 'worship',
    url: 'https://www.youtube.com/embed/dUJrvvCfzCc',
    thumbnail: 'https://img.youtube.com/vi/dUJrvvCfzCc/maxresdefault.jpg',
    duration: 280,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Hillsong Young & Free',
    views: 1100000
  },
  {
    id: 'song_004',
    title: 'Purifié par le Sang',
    type: 'song',
    category: 'worship',
    url: 'https://www.youtube.com/embed/6MrTKfVVZkQ',
    thumbnail: 'https://img.youtube.com/vi/6MrTKfVVZkQ/maxresdefault.jpg',
    duration: 290,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Christy Nockels',
    views: 850000
  },
  {
    id: 'song_005',
    title: 'Merci Seigneur',
    type: 'song',
    category: 'worship',
    url: 'https://www.youtube.com/embed/1vMRJ-DBkMI',
    thumbnail: 'https://img.youtube.com/vi/1vMRJ-DBkMI/maxresdefault.jpg',
    duration: 260,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Évangile Vivant',
    views: 920000
  },

  // INSTRUMENTALS - PRAYER
  {
    id: 'inst_001',
    title: 'Musique de Prière Apaisante',
    type: 'instrumental',
    category: 'prayer',
    url: 'https://www.youtube.com/embed/N_zchCkAHpI',
    thumbnail: 'https://img.youtube.com/vi/N_zchCkAHpI/maxresdefault.jpg',
    duration: 600,
    favorite: false,
    createdAt: Date.now(),
    views: 450000
  },
  {
    id: 'inst_002',
    title: 'Piano Spirituel - Calme',
    type: 'instrumental',
    category: 'meditation',
    url: 'https://www.youtube.com/embed/qqYQ_rWZVAQ',
    thumbnail: 'https://img.youtube.com/vi/qqYQ_rWZVAQ/maxresdefault.jpg',
    duration: 720,
    favorite: false,
    createdAt: Date.now(),
    views: 380000
  },
  {
    id: 'inst_003',
    title: 'Respirations Guidées - 10 Min',
    type: 'instrumental',
    category: 'meditation',
    url: 'https://www.youtube.com/embed/8cUt90MmcKo',
    thumbnail: 'https://img.youtube.com/vi/8cUt90MmcKo/maxresdefault.jpg',
    duration: 600,
    favorite: false,
    createdAt: Date.now(),
    views: 320000
  },
  {
    id: 'inst_004',
    title: 'Arpèges Sacrés - Méditation',
    type: 'instrumental',
    category: 'meditation',
    url: 'https://www.youtube.com/embed/a0XNu9FTMrQ',
    thumbnail: 'https://img.youtube.com/vi/a0XNu9FTMrQ/maxresdefault.jpg',
    duration: 780,
    favorite: false,
    createdAt: Date.now(),
    views: 290000
  },

  // PODCASTS / TEACHINGS
  {
    id: 'teach_001',
    title: 'Enseignement: La Pureté Spirituelle',
    type: 'teaching',
    category: 'teaching',
    url: 'https://www.youtube.com/embed/8cUt90MmcKo',
    thumbnail: 'https://img.youtube.com/vi/8cUt90MmcKo/maxresdefault.jpg',
    duration: 1800,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Pasteur Emmanuel',
    views: 250000
  },
  {
    id: 'teach_002',
    title: 'Vaincre la Tentation - Stratégies Bibliques',
    type: 'teaching',
    category: 'teaching',
    url: 'https://www.youtube.com/embed/YkU0ZvxQ9bE',
    thumbnail: 'https://img.youtube.com/vi/YkU0ZvxQ9bE/maxresdefault.jpg',
    duration: 2100,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Dr. Warren Wiersbe',
    views: 180000
  },
  {
    id: 'teach_003',
    title: 'Le Saint-Esprit dans la Vie du Croyant',
    type: 'teaching',
    category: 'teaching',
    url: 'https://www.youtube.com/embed/GjxM6j9EgS0',
    thumbnail: 'https://img.youtube.com/vi/GjxM6j9EgS0/maxresdefault.jpg',
    duration: 2400,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Pasteur John MacArthur',
    views: 320000
  },
  {
    id: 'teach_004',
    title: 'Marche dans la Sanctification',
    type: 'teaching',
    category: 'teaching',
    url: 'https://www.youtube.com/embed/I-s6x_kNVzY',
    thumbnail: 'https://img.youtube.com/vi/I-s6x_kNVzY/maxresdefault.jpg',
    duration: 1950,
    favorite: false,
    createdAt: Date.now(),
    artist: 'Pasteur Paul Washer',
    views: 410000
  }
]

// RECOMMENDATION ENGINE
export const generateRecommendations = (
  currentWeek: number,
  currentDay: number,
  userMood: number,
  recentActivity: string[],
  isCombatMode: boolean
): Recommendation[] => {
  const recommendations: Recommendation[] = []
  const now = Date.now()

  // If in combat mode (tentation active)
  if (isCombatMode) {
    recommendations.push(
      {
        id: 'rec_combat_1',
        title: 'Chant de Victoire',
        reason: 'Pour renforcer ta foi en ce moment',
        type: 'media',
        contentId: 'song_002',
        priority: 'high',
        timestamp: now
      },
      {
        id: 'rec_combat_2',
        title: 'Musique de Prière - Force Spirituelle',
        reason: 'Pour fortifier ton esprit',
        type: 'media',
        contentId: 'inst_001',
        priority: 'high',
        timestamp: now
      },
      {
        id: 'rec_combat_3',
        title: 'Enseignement: Vaincre la Tentation',
        reason: 'Comprendre les stratégies bibliques',
        type: 'media',
        contentId: 'teach_002',
        priority: 'high',
        timestamp: now
      }
    )
  }

  // Week 1: Repentance & Restoration
  if (currentWeek === 1) {
    recommendations.push(
      {
        id: 'rec_week1_1',
        title: 'Purifié par le Sang',
        reason: 'Méditation sur la purification',
        type: 'media',
        contentId: 'song_004',
        priority: 'high',
        timestamp: now
      },
      {
        id: 'rec_week1_2',
        title: 'Prière d\'Intercession',
        reason: 'Pour la restauration spirituelle',
        type: 'media',
        contentId: 'inst_001',
        priority: 'medium',
        timestamp: now
      }
    )
  }

  // Week 2: Discipline
  if (currentWeek === 2) {
    recommendations.push(
      {
        id: 'rec_week2_1',
        title: 'Enseignement: Marche dans la Sanctification',
        reason: 'Renforcer ta discipline spirituelle',
        type: 'media',
        contentId: 'teach_004',
        priority: 'high',
        timestamp: now
      }
    )
  }

  // Week 3: Holy Spirit Power
  if (currentWeek === 3) {
    recommendations.push(
      {
        id: 'rec_week3_1',
        title: 'Enseignement: Le Saint-Esprit',
        reason: 'Expérimenter la puissance du Saint-Esprit',
        type: 'media',
        contentId: 'teach_003',
        priority: 'high',
        timestamp: now
      },
      {
        id: 'rec_week3_2',
        title: 'Victoire en Christ',
        reason: 'Célébrer la puissance divine',
        type: 'media',
        contentId: 'song_002',
        priority: 'medium',
        timestamp: now
      }
    )
  }

  // Difficult mood - need encouragement
  if (userMood <= 2) {
    recommendations.push(
      {
        id: 'rec_mood_1',
        title: 'Grâce Suffisante',
        reason: 'Message d\'encouragement pour toi',
        type: 'media',
        contentId: 'song_003',
        priority: 'high',
        timestamp: now
      },
      {
        id: 'rec_mood_2',
        title: 'Méditation Apaisante',
        reason: 'Calme et réconfort spirituel',
        type: 'media',
        contentId: 'inst_002',
        priority: 'high',
        timestamp: now
      }
    )
  }

  // Return unique recommendations
  return recommendations.filter((rec, index, self) =>
    index === self.findIndex(r => r.contentId === rec.contentId)
  )
}

// MEDIA CATEGORIES FOR FILTERING
export const mediaCategories = {
  chants: mediaLibrary.filter(m => m.type === 'song'),
  instrumentaux: mediaLibrary.filter(m => m.type === 'instrumental'),
  podcasts: mediaLibrary.filter(m => m.type === 'teaching'),
  enseignements: mediaLibrary.filter(m => m.category === 'teaching'),
  favoris: mediaLibrary.filter(m => m.favorite)
}
