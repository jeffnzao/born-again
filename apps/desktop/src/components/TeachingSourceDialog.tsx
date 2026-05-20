import React, { useState } from 'react'
import { X, Plus, ExternalLink, AlertCircle } from 'lucide-react'
import { MediaItem } from '../types/index'
import { TEACHING_SOURCES } from '../data/mediaLibrary'

interface TeachingSourceDialogProps {
  isOpen?: boolean
  onClose: () => void
  onAddTeaching: (media: MediaItem) => void
}

export const TeachingSourceDialog: React.FC<TeachingSourceDialogProps> = ({
  isOpen = true,
  onClose,
  onAddTeaching
}) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    setError(null)

    if (!selectedSource || !title || !url) {
      setError('Veuillez remplir tous les champs')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('URL invalide')
      return
    }

    const mediaItem: MediaItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: 'teaching',
      category: 'enseignements',
      source: 'external_url',
      url,
      duration: 0,
      favorite: false,
      createdAt: Date.now(),
      artist: author || 'Inconnu',
      isAvailable: true
    }

    onAddTeaching(mediaItem)
    handleReset()
  }

  const handleReset = () => {
    setSelectedSource(null)
    setTitle('')
    setUrl('')
    setAuthor('')
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Ajouter un Enseignement</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Source Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Source</label>
          <div className="space-y-2">
            {TEACHING_SOURCES.map(source => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedSource === source.id
                    ? 'border-sacred-500 bg-sacred-500/20'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="font-semibold">{source.name}</div>
                <div className="text-xs text-slate-400">{source.url}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Titre</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre de l'enseignement"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500"
          />
        </div>

        {/* URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500"
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Auteur (optionnel)</label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Nom de l'auteur"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700 rounded mb-4">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-sacred-600 hover:bg-sacred-700 rounded font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeachingSourceDialog
