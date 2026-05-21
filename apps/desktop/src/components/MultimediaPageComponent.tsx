import React, { useState, useEffect } from 'react'
import { MediaItem, MediaCategory } from '../types/index'
import { getImportedMedia, removeImportedMedia } from '../utils/mediaImport'
import { useGlobalPlayer, GlobalPlayerState } from '../store/globalPlayer'
import { MediaImporter } from './MediaImporter'
import MediaItemCard from './MediaItemCard'

interface MultimediaPageProps {
  player: GlobalPlayerState
}

const CATEGORIES: { id: MediaCategory; label: string; emoji: string }[] = [
  { id: 'chants', label: 'Chants', emoji: '🎵' },
  { id: 'instrumentaux', label: 'Instrumentaux', emoji: '🎹' },
  { id: 'podcasts', label: 'Podcasts', emoji: '🎙️' },
  { id: 'enseignements', label: 'Enseignements', emoji: '📚' },
  { id: 'prières', label: 'Prières', emoji: '🙏' },
  { id: 'livres_audio', label: 'Livres audio', emoji: '📖' },
  { id: 'hymnes', label: 'Hymnes', emoji: '⛪' },
  { id: 'favoris', label: 'Favoris', emoji: '❤️' },
]

export const MultimediaPageComponent: React.FC<MultimediaPageProps> = ({ player }) => {
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('chants')
  const [importedMedia, setImportedMedia] = useState<MediaItem[]>([])
  const [mediaToDisplay, setMediaToDisplay] = useState<MediaItem[]>([])

  // Load media on mount
  useEffect(() => {
    const media = getImportedMedia()
    setImportedMedia(media)
  }, [])

  // Filter media when category changes
  useEffect(() => {
    const filtered = importedMedia.filter(m => 
      selectedCategory === 'favoris' ? m.favorite : m.category === selectedCategory
    )
    setMediaToDisplay(filtered)
  }, [selectedCategory, importedMedia])

  const handlePlayMedia = (media: MediaItem) => {
    player.setCurrentMedia(media)
    player.setPlayList(mediaToDisplay)
    player.setIsPlaying(true)
  }

  const handleRemoveMedia = (mediaId: string) => {
    removeImportedMedia(mediaId)
    setImportedMedia(getImportedMedia())
  }

  const handleMediaImported = () => {
    setImportedMedia(getImportedMedia())
  }

  const handleToggleFavorite = (mediaId: string) => {
    const media = importedMedia.find(m => m.id === mediaId)
    if (media) {
      media.favorite = !media.favorite
      setImportedMedia([...importedMedia])
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Bibliothèque Spirituelle</h1>

      {/* Import Section */}
      <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-sacred-300">📥 Importer des médias</h2>
        <MediaImporter onMediaImported={handleMediaImported} />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
              selectedCategory === cat.id
                ? 'bg-sacred-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {cat.emoji} {cat.label}
            {selectedCategory === cat.id && (
              <span className="ml-2 text-xs bg-sacred-500 px-2 py-1 rounded">
                {mediaToDisplay.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {mediaToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaToDisplay.map((media) => (
            <MediaItemCard
              key={media.id}
              item={media}
              onPlay={() => handlePlayMedia(media)}
              onDelete={() => handleRemoveMedia(media.id)}
              onToggleFavorite={() => handleToggleFavorite(media.id)}
              isFavorite={media.favorite}
              isPlaying={player.currentMedia?.id === media.id && player.isPlaying}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Aucun média dans cette catégorie</p>
          <p className="text-gray-500 text-sm mt-2">Importez des fichiers pour commencer</p>
        </div>
      )}
    </div>
  )
}

export default MultimediaPageComponent
