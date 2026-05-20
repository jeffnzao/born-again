import React, { useRef, useState } from 'react'
import { Upload, X, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { MediaType, MediaCategory, MediaItem } from '../types/index'
import { importAudioFile, formatFileSize } from '../utils/mediaStorage'

interface MediaImportDialogProps {
  onImport: (media: MediaItem[]) => void
  onClose: () => void
}

export const MediaImportDialog: React.FC<MediaImportDialogProps> = ({
  onImport,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedType, setSelectedType] = useState<MediaType>('song')
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('chants')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const mediaTypes: { value: MediaType; label: string }[] = [
    { value: 'song', label: 'Chant' },
    { value: 'hymn', label: 'Hymne' },
    { value: 'instrumental', label: 'Instrumental' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'teaching', label: 'Enseignement' },
    { value: 'prayer', label: 'Prière' },
    { value: 'audiobook', label: 'Livre Audio' }
  ]

  const categories: { value: MediaCategory; label: string }[] = [
    { value: 'chants', label: 'Chants' },
    { value: 'instrumentaux', label: 'Instrumentaux' },
    { value: 'podcasts', label: 'Podcasts' },
    { value: 'enseignements', label: 'Enseignements' },
    { value: 'prières', label: 'Prières' },
    { value: 'livres_audio', label: 'Livres Audio' },
    { value: 'hymnes', label: 'Hymnes' }
  ]

  const handleFiles = async (files: FileList) => {
    if (!files || files.length === 0) return

    setIsLoading(true)
    setError(null)
    setSuccessCount(0)

    try {
      const importedItems: MediaItem[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const mediaItem = await importAudioFile(file)

        if (mediaItem) {
          // Update with user selections
          mediaItem.type = selectedType
          mediaItem.category = selectedCategory
          importedItems.push(mediaItem)
          setSuccessCount(prev => prev + 1)
        }
      }

      if (importedItems.length > 0) {
        onImport(importedItems)
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setError('Aucun fichier n\'a pu être importé')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'import'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Importer des Médias</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all mb-4 ${
            dragActive
              ? 'border-sacred-500 bg-sacred-500/10'
              : 'border-slate-600 hover:border-sacred-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload size={32} className="mx-auto mb-2 text-slate-400" />
          <p className="font-semibold">Déposer vos fichiers ici</p>
          <p className="text-sm text-slate-400">ou cliquez pour parcourir</p>
        </div>

        {/* Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Type de Média</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as MediaType)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
          >
            {mediaTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Catégorie</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as MediaCategory)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700 rounded mb-4">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {successCount > 0 && !isLoading && (
          <div className="flex items-start gap-2 p-3 bg-green-900/30 border border-green-700 rounded mb-4">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{successCount} fichier(s) importé(s) avec succès</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-900/30 border border-blue-700 rounded mb-4">
            <Loader size={20} className="animate-spin" />
            <p className="text-sm">Importation en cours...</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Importation...' : 'Fermer'}
        </button>
      </div>
    </div>
  )
}

export default MediaImportDialog
