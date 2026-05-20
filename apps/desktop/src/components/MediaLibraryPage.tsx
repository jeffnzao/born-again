import React, { useState, useMemo } from 'react'
import { Music, Heart, Plus, Upload, Eye, EyeOff } from 'lucide-react'
import { MediaItem, MediaCategory } from '../types/index'
import { formatDuration } from '../utils/mediaStorage'
import MediaPlayer from './MediaPlayer'
import MediaImportDialog from './MediaImportDialog'
import MediaItemCard from './MediaItemCard'
import MediaEmptyState from './MediaEmptyState'

interface MediaLibraryPageProps {
  media: any
  onPlayNext?: () => void
  onPlayPrevious?: () => void
}

const CATEGORIES: { id: MediaCategory; label: string; icon: string }[] = [
  { id: 'chants', label: 'Chants', icon: '🎵' },
  { id: 'instrumentaux', label: 'Instrumentaux', icon: '🎹' },
  { id: 'prières', label: 'Prières', icon: '🙏' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
  { id: 'hymnes', label: 'Hymnes', icon: '⛪' },
  { id: 'enseignements', label: 'Enseignements', icon: '📚' },
  { id: 'livres_audio', label: 'Livres Audio', icon: '📖' },
  { id: 'favoris', label: 'Favoris', icon: '❤️' }
]

export const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({
  media,
  onPlayNext,
  onPlayPrevious
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('chants')
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  // Get filtered media for selected category
  const filteredMedia = useMemo(() => {
    if (!media.mediaLibrary) return []

    if (selectedCategory === 'favoris') {
      return media.mediaLibrary.filter((m: MediaItem) => m.favorite)
    }
    return media.mediaLibrary.filter((m: MediaItem) => m.category === selectedCategory)
  }, [media.mediaLibrary, selectedCategory])

  const handlePlayMedia = (item: MediaItem) => {
    media.playMedia(item)
    setShowPlayer(true)
  }

  const handleToggleFavorite = (mediaId: string) => {
    media.toggleFavorite(mediaId)
  }

  const handleDeleteMedia = (mediaId: string) => {
    media.removeFromLibrary(mediaId)
  }

  const handleImportMedia = (items: MediaItem[]) => {
    items.forEach(item => {
      media.addToLibrary(item)
    })
    setIsImportDialogOpen(false)
  }

  const handleVolumeChange = (volume: number) => {
    media.setVolume(volume)
  }

  const handleTimeChange = (time: number) => {
    media.setCurrentTime(time)
  }

  const handleSpeedChange = (speed: number) => {
    media.setPlaybackSpeed(speed)
  }

  const categoryCount = (category: MediaCategory): number => {
    if (!media.mediaLibrary) return 0
    if (category === 'favoris') {
      return media.mediaLibrary.filter((m: MediaItem) => m.favorite).length
    }
    return media.mediaLibrary.filter((m: MediaItem) => m.category === category).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-sacred-600 to-purple-600 p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Music size={40} className="text-white" />
            <div>
              <h1 className="text-4xl font-bold">Bibliothèque Médias</h1>
              <p className="text-white/80">Organisez et écoutez vos contenus spirituels</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsImportDialogOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-sacred-600 hover:bg-sacred-700 rounded-lg font-semibold transition-colors"
          >
            <Upload size={20} />
            Importer un Média
          </button>
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            {showPlayer ? <EyeOff size={20} /> : <Eye size={20} />}
            {showPlayer ? 'Masquer' : 'Afficher'} le Lecteur
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category.id
            const count = categoryCount(category.id)
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sacred-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                {count > 0 && (
                  <span className="bg-slate-700 px-2 py-1 rounded text-xs ml-1">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item: MediaItem) => (
              <MediaItemCard
                key={item.id}
                item={item}
                onPlay={() => handlePlayMedia(item)}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
                onDelete={() => handleDeleteMedia(item.id)}
                isFavorite={item.favorite}
                isPlaying={media.currentMedia?.id === item.id && media.isPlaying}
              />
            ))}
          </div>
        ) : (
          <MediaEmptyState category={selectedCategory} />
        )}
      </div>

      {/* Media Player */}
      {showPlayer && (
        <MediaPlayer
          media={media.currentMedia}
          isPlaying={media.isPlaying}
          volume={media.volume}
          currentTime={media.currentTime}
          playbackSpeed={media.playbackSpeed}
          onPlayNext={onPlayNext || (() => {})}
          onPlayPrevious={onPlayPrevious || (() => {})}
          onPlay={() => media.playMedia(media.currentMedia)}
          onPause={() => media.pauseMedia()}
          onVolumeChange={handleVolumeChange}
          onTimeChange={handleTimeChange}
          onSpeedChange={handleSpeedChange}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Import Dialog */}
      {isImportDialogOpen && (
        <MediaImportDialog
          onImport={handleImportMedia}
          onClose={() => setIsImportDialogOpen(false)}
        />
      )}
    </div>
  )
}

export default MediaLibraryPage
