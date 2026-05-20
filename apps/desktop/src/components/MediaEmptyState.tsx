import React from 'react'
import { Music, Inbox } from 'lucide-react'
import { MediaCategory } from '../types/index'

interface MediaEmptyStateProps {
  category: MediaCategory
}

export const MediaEmptyState: React.FC<MediaEmptyStateProps> = ({ category }) => {
  const categoryMessages: Record<MediaCategory, { title: string; message: string }> = {
    chants: {
      title: 'Aucun Chant',
      message: 'Commencez par importer vos chants favoris pour peupler cette catégorie'
    },
    instrumentaux: {
      title: 'Aucune Musique Instrumentale',
      message: 'Importez des compositions musicales apaisantes pour vos moments de méditation'
    },
    prières: {
      title: 'Aucune Prière',
      message: 'Créez une collection de prières guidées pour vos moments spirituels'
    },
    podcasts: {
      title: 'Aucun Podcast',
      message: 'Ajoutez des podcasts spirituels à votre bibliothèque'
    },
    hymnes: {
      title: 'Aucun Hymne',
      message: 'Enrichissez votre collection avec des hymnes chrétiens'
    },
    enseignements: {
      title: 'Aucun Enseignement',
      message: 'Importez des vidéos et des contenus pédagogiques'
    },
    livres_audio: {
      title: 'Aucun Livre Audio',
      message: 'Ajoutez des livres audio à votre bibliothèque'
    },
    favoris: {
      title: 'Aucun Favori',
      message: 'Marquez vos contenus préférés comme favoris pour y accéder rapidement'
    }
  }

  const content = categoryMessages[category]

  return (
    <div className="text-center py-16">
      <Inbox size={64} className="mx-auto text-slate-600 mb-4" />
      <h3 className="text-2xl font-semibold text-white mb-2">{content.title}</h3>
      <p className="text-slate-400 mb-6">{content.message}</p>
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <Music size={16} />
        <span>Importer des médias pour commencer</span>
      </div>
    </div>
  )
}

export default MediaEmptyState
