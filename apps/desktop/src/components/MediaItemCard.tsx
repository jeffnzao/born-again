import React from 'react'
import { Heart, Play, Trash2, MoreVertical } from 'lucide-react'
import { MediaItem } from '../types/index'
import { formatDuration, getMediaIcon } from '../utils/mediaImport'

interface MediaItemCardProps {
  media: MediaItem
  isPlaying: boolean
  onPlay: () => void
  onFavorite: () => void
  onDelete: () => void
  onSelect?: () => void
}

export const MediaItemCard: React.FC<MediaItemCardProps> = ({
  media,
  isPlaying,
  onPlay,
  onFavorite,
  onDelete,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-slate-800 border rounded-lg overflow-hidden hover:border-sacred-400 transition-all cursor-pointer group ${
        isPlaying ? 'border-sacred-400 ring-2 ring-sacred-400 ring-opacity-50' : 'border-slate-700'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full bg-gradient-to-br from-slate-700 to-slate-900 aspect-square flex items-center justify-center overflow-hidden">
        {media.thumbnail ? (
          <img
            src={media.thumbnail}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-4xl">{getMediaIcon(media.type)}</div>
        )}

        {/* Play Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlay()
          }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-all"
        >
          <Play size={48} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Duration Badge */}
        {media.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
            {formatDuration(media.duration)}
          </div>
        )}

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute top-2 right-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-3 bg-sacred-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-white truncate" title={media.title}>
          {media.title}
        </h3>

        {media.artist && (
          <p className="text-xs text-gray-400 truncate">{media.artist}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-sacred-600 hover:bg-sacred-700 text-white py-2 rounded text-xs font-semibold transition-colors"
          >
            <Play size={14} fill="currentColor" />
            Jouer
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavorite()
            }}
            className={`p-2 rounded transition-colors ${
              media.favorite
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600 hover:text-red-400'
            }`}
            title={media.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart size={16} fill={media.favorite ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 rounded bg-slate-700 text-gray-400 hover:bg-red-900 hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
