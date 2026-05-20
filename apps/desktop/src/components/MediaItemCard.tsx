import React from 'react'
import { Play, Heart, Trash2, Music } from 'lucide-react'
import { MediaItem } from '../types/index'
import { formatDuration } from '../utils/mediaStorage'

interface MediaItemCardProps {
  item: MediaItem
  onPlay: () => void
  onToggleFavorite: () => void
  onDelete: () => void
  isFavorite: boolean
  isPlaying: boolean
}

export const MediaItemCard: React.FC<MediaItemCardProps> = ({
  item,
  onPlay,
  onToggleFavorite,
  onDelete,
  isFavorite,
  isPlaying
}) => {
  return (
    <div className="group bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-sacred-600 to-purple-600 flex items-center justify-center overflow-hidden">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <Music size={48} className="text-white/50" />
        )}

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-1 h-6 bg-sacred-500 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1 h-6 bg-sacred-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-6 bg-sacred-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {item.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold">
            {formatDuration(item.duration)}
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onPlay}
            className="p-3 bg-sacred-600 hover:bg-sacred-700 rounded-full transition-colors"
            aria-label="Lecture"
          >
            <Play size={24} className="fill-white" />
          </button>
          <button
            onClick={onToggleFavorite}
            className={`p-3 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-600 hover:bg-slate-700 text-white'
            }`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart size={24} className={isFavorite ? 'fill-white' : ''} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{item.title}</h3>
        <p className="text-sm text-slate-400 truncate">
          {item.artist || item.author || 'Inconnu'}
        </p>
        {item.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-2">{item.description}</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="flex-1 px-3 py-2 bg-red-900/50 hover:bg-red-700 text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
          aria-label="Supprimer"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </div>
    </div>
  )
}

export default MediaItemCard
