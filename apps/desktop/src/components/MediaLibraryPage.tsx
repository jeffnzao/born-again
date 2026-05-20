import React, { useState } from 'react'
import { Upload, Plus, ExternalLink, Music, Film } from 'lucide-react'
import { MediaCategory, MediaItem } from '../types/index'
import { MediaImportDialog } from './MediaImportDialog'
import { MediaEmptyState } from './MediaEmptyState'
import { MediaPlayer } from './MediaPlayer'
import { MediaItemCard } from './MediaItemCard'
import { TeachingSourceDialog } from './TeachingSourceDialog'
import { getCategoryIcon } from '../utils/mediaImport'
import { PRAYER_THEMES } from '../data/mediaLibrary'

interface MediaLibraryPageProps {
  media: any // from useMediaLibrary hook
  onPlayNext?: () => void
  onPlayPrevious?: () => void
  onRecommendationClick?: (mediaId: string) => void
}

export const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({
  media,
  onPlayNext,
  onPlayPrevious,
  onRecommendationClick
}) => {
  const categories: MediaCategory[] = ['chants', 'instrumentaux', 'podcasts', 'enseignements', 'prières', 'livres_audio', 'hymnes', 'favoris']
  
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('chants')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showTeachingDialog, setShowTeachingDialog] = useState(false)
  const [importType, setImportType] = useState<any>('song')
  const [prayerThemeFilter, setPrayerThemeFilter] = useState<string | null>(null)

  // Get filtered media
  const filteredMedia = selectedCategory === 'favoris'
    ? media.getFavoritesMedia()
    : media.getMediaByCategory(selectedCategory)

  // Filter by prayer theme if applicable
  const displayedMedia = selectedCategory === 'prières' && prayerThemeFilter
    ? filteredMedia.filter((m: MediaItem) => m.subCategory === prayerThemeFilter)
    : filteredMedia

  const handleImportClick = (type: any, category: MediaCategory) => {
    setImportType({ type, category })
    setShowImportDialog(true)
  }

  const handleImportedMedia = (items: MediaItem[]) => {
    items.forEach(item => media.addToLibrary(item))
  }

  const handleAddTeaching = (teaching: MediaItem) => {
    media.addToLibrary(teaching)
    setShowTeachingDialog(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-sacred-400">Bibliothèque Spirituelle</h1>
      <p className="text-gray-400 mb-8">Importez vos médias spirituels, créez des listes de lecture et écoutez</p>

      {/* Current Player */}
      {media.currentMedia && (
        <div className="mb-8">
          <MediaPlayer
            media={media.currentMedia}
            isPlaying={media.isPlaying}
            currentTime={media.currentTime}
            volume={media.volume}
            playbackSpeed={media.playbackSpeed}
            onPlayPause={() => media.isPlaying ? media.pauseMedia() : media.resumeMedia()}
            onNext={onPlayNext}
            onPrevious={onPlayPrevious}
            onTimeChange={media.setCurrentTime}
            onVolumeChange={media.setVolume}
            onSpeedChange={media.setPlaybackSpeed}
          />
        </div>
      )}

      {/* Category Navigation */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setPrayerThemeFilter(null)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-sacred-600 text-white ring-2 ring-sacred-400'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              <span className="capitalize">{category}</span>
              {selectedCategory === category && media.getMediaByCategory(category).length > 0 && (
                <span className="ml-1 text-xs bg-black bg-opacity-30 px-2 py-0.5 rounded-full">
                  {media.getMediaByCategory(category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Prayer Theme Filter (only for Prières category) */}
      {selectedCategory === 'prières' && displayedMedia.length > 0 && (
        <div className="mb-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-gray-400 mb-3">Filtrer par thème:</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPrayerThemeFilter(null)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                prayerThemeFilter === null
                  ? 'bg-sacred-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Tous
            </button>
            {PRAYER_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setPrayerThemeFilter(theme.id)}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                  prayerThemeFilter === theme.id
                    ? 'bg-sacred-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {theme.icon} {theme.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Import Section */}
      <div className="mb-8 bg-gradient-to-r from-sacred-900 to-sacred-800 rounded-lg p-6 border border-sacred-700">
        <h2 className="text-xl font-bold mb-4 text-sacred-300">Importer rapidement</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleImportClick('song', 'chants')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-sacred-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>🎵</span> Chants
          </button>
          <button
            onClick={() => handleImportClick('hymn', 'hymnes')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-sacred-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>🎼</span> Hymnes
          </button>
          <button
            onClick={() => handleImportClick('prayer', 'prières')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-sacred-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>🙏</span> Prières
          </button>
          <button
            onClick={() => handleImportClick('audiobook', 'livres_audio')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-sacred-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>📖</span> Livres Audio
          </button>
          <button
            onClick={() => handleImportClick('instrumental', 'instrumentaux')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-sacred-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>🎶</span> Instrumentaux
          </button>
          <button
            onClick={() => handleImportClick('podcast', 'podcasts')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-sacred-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>🎙️</span> Podcasts
          </button>
          <button
            onClick={() => {
              setShowTeachingDialog(true)
            }}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 border border-blue-600 hover:border-blue-500 rounded-lg p-3 transition-all text-sm font-semibold"
          >
            <span>🔗</span> Lien externe
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {displayedMedia.length === 0 ? (
        <MediaEmptyState
          category={selectedCategory}
          onImportClick={() => handleImportClick(
            selectedCategory === 'chants' ? 'song' :
            selectedCategory === 'hymnes' ? 'hymn' :
            selectedCategory === 'prières' ? 'prayer' :
            selectedCategory === 'livres_audio' ? 'audiobook' :
            selectedCategory === 'instrumentaux' ? 'instrumental' :
            selectedCategory === 'podcasts' ? 'podcast' : 'teaching',
            selectedCategory
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {displayedMedia.map((item: MediaItem) => (
            <MediaItemCard
              key={item.id}
              media={item}
              isPlaying={media.isPlaying && media.currentMedia?.id === item.id}
              onPlay={() => media.playMedia(item)}
              onFavorite={() => media.toggleFavorite(item.id)}
              onDelete={() => media.removeFromLibrary(item.id)}
              onSelect={() => media.playMedia(item)}
            />
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-2">📂 Organisation</h3>
          <p className="text-sm text-gray-300">
            Vos médias importés sont automatiquement organisés par catégories. Vous pouvez marquer vos favoris pour un accès rapide.
          </p>
        </div>
        <div className="bg-purple-900 bg-opacity-20 border border-purple-500 border-opacity-30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-2">🎯 Lecteur avancé</h3>
          <p className="text-sm text-gray-300">
            Contrôlez la vitesse de lecture, le volume, et reprenez où vous aviez arrêté. Tous vos médias sont synchronisés.
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <MediaImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportedMedia}
        defaultType={importType.type}
        defaultCategory={importType.category}
      />

      <TeachingSourceDialog
        isOpen={showTeachingDialog}
        onClose={() => setShowTeachingDialog(false)}
        onAddTeaching={handleAddTeaching}
      />
    </div>
  )
}
