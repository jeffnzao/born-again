import React from 'react'
import { Upload, Music } from 'lucide-react'
import { MediaCategory } from '../types/index'

interface MediaEmptyStateProps {
  category: MediaCategory
  onImportClick: () => void
}

const emptyMessages: Record<MediaCategory, { title: string; description: string }> = {
  chants: {
    title: 'Aucun chant disponible',
    description: 'Importez vos chants préférés ou explorez des recommandations'
  },
  instrumentaux: {
    title: 'Aucun instrumental disponible',
    description: 'Ajoutez des musiques instrumentales pour la prière et la méditation'
  },
  podcasts: {
    title: 'Aucun podcast',
    description: 'Importez des fichiers audio ou ajoutez des liens externes'
  },
  enseignements: {
    title: 'Aucun enseignement',
    description: 'Ajoutez des vidéos ou des enseignements spirituels'
  },
  prières: {
    title: 'Aucune prière enregistrée',
    description: 'Importez vos prières guidées ou ajoutez des prières audio'
  },
  livres_audio: {
    title: 'Aucun livre audio',
    description: 'Importez vos livres audio spirituels'
  },
  hymnes: {
    title: 'Aucun hymne disponible',
    description: 'Importez vos hymnes préférés'
  },
  favoris: {
    title: 'Aucun favori',
    description: 'Marquez vos médias préférés pour un accès rapide'
  }
}

export const MediaEmptyState: React.FC<MediaEmptyStateProps> = ({
  category,
  onImportClick
}) => {
  const message = emptyMessages[category]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Music size={64} className="text-sacred-400 text-opacity-30 mb-6" />
      
      <h3 className="text-2xl font-bold text-gray-300 mb-2">
        {message.title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-sm">
        {message.description}
      </p>
      
      <button
        onClick={onImportClick}
        className="flex items-center gap-2 bg-sacred-600 hover:bg-sacred-700 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
      >
        <Upload size={20} />
        Importer des médias
      </button>
    </div>
  )
}
