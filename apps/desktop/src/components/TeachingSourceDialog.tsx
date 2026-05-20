import React, { useState } from 'react'
import { X, Plus, ExternalLink, AlertCircle } from 'lucide-react'
import { MediaItem } from '../types/index'
import { generateMediaId } from '../utils/mediaImport'
import { TEACHING_SOURCES } from '../data/mediaLibrary'

interface TeachingSourceDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddTeaching: (media: MediaItem) => void
}

export const TeachingSourceDialog: React.FC<TeachingSourceDialogProps> = ({
  isOpen,
  onClose,
  onAddTeaching
}) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [duration, setDuration] = useState('0')
  const [error, setError] = useState<string | null>(null)

  const handleAddTeaching = () => {
    if (!title.trim() || !url.trim()) {
      setError('Veuillez remplir le titre et l\'URL')
      return
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      setError('URL invalide')
      return
    }

    const mediaItem: MediaItem = {
      id: generateMediaId(),
      title: title.trim(),
      type: 'teaching',
      category: 'enseignements',
      source: 'external_url',
      url: url.trim(),
      thumbnail: thumbnail.trim() || undefined,
      duration: parseInt(duration) || 0,
      favorite: false,
      createdAt: Date.now(),
      author: author.trim() || undefined,
      isAvailable: true
    }

    onAddTeaching(mediaItem)

    // Reset form
    setTitle('')
    setUrl('')
    setAuthor('')
    setThumbnail('')
    setDuration('0')
    setError(null)
    setSelectedSource(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg p-8 max-w-md w-full mx-4 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sacred-400">Ajouter Enseignement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Source Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Source</label>
          <div className="grid grid-cols-2 gap-2">
            {TEACHING_SOURCES.map(source => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={`p-3 rounded border-2 text-left transition-all ${
                  selectedSource === source.id
                    ? 'border-sacred-400 bg-sacred-900 bg-opacity-30'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="text-xl mb-1">{source.icon}</div>
                <div className="text-sm font-semibold text-white">{source.name}</div>
                <div className="text-xs text-gray-400">{source.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Marche dans l'Esprit"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sacred-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sacred-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Auteur</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: Pasteur Jean"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sacred-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Durée (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sacred-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Miniature (URL)</label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sacred-400"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 rounded p-3">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded p-3 flex gap-2">
            <ExternalLink size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              Le lien s'ouvrira dans votre navigateur lors de la lecture
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddTeaching}
              className="flex-1 bg-sacred-600 hover:bg-sacred-700 text-white py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
