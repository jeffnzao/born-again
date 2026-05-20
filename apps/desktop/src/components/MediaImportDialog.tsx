import React, { useRef, useState } from 'react'
import { Upload, X, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { MediaType, MediaCategory } from '../types/index'
import { SUPPORTED_FORMATS } from '../data/mediaLibrary'
import { importMultipleFiles, validateImportFile } from '../utils/mediaImport'
import { MediaItem } from '../types/index'

interface MediaImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (media: MediaItem[]) => void
  defaultType?: MediaType
  defaultCategory?: MediaCategory
}

export const MediaImportDialog: React.FC<MediaImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  defaultType = 'song',
  defaultCategory = 'chants'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedType, setSelectedType] = useState<MediaType>(defaultType)
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>(defaultCategory)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState(0)

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsLoading(true)
    setError(null)
    setSuccessCount(0)

    try {
      // Validate files
      const validFiles = files.filter(file => {
        if (!validateImportFile(file)) {
          setError(`Fichier invalide: ${file.name}`)
          return false
        }
        return true
      })

      // Import files
      const imported = await importMultipleFiles(validFiles, {
        type: selectedType,
        category: selectedCategory
      })

      if (imported.length > 0) {
        setSuccessCount(imported.length)
        onImport(imported)
        setTimeout(() => onClose(), 1500)
      } else {
        setError('Aucun fichier valide à importer')
      }
    } catch (err) {
      setError('Erreur lors de l\'import: ' + (err as Error).message)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    if (fileInputRef.current) {
      // Create a DataTransfer object and set it to the input
      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))
      fileInputRef.current.files = dataTransfer.files
      
      // Trigger change event
      const event = new Event('change', { bubbles: true })
      fileInputRef.current.dispatchEvent(event)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg p-8 max-w-md w-full mx-4 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sacred-400">Importer Médias</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {successCount > 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-lg text-green-400 font-semibold">
              {successCount} fichier{successCount > 1 ? 's' : ''} importé{successCount > 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <>
            {/* Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Type de média</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MediaType)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-sacred-400"
              >
                {mediaTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MediaCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-sacred-400"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sacred-400 border-opacity-30 rounded-lg p-8 text-center cursor-pointer hover:border-opacity-50 transition-all mb-4 bg-sacred-900 bg-opacity-10"
            >
              <Upload size={40} className="text-sacred-400 mx-auto mb-2" />
              <p className="text-gray-300 font-semibold mb-1">Déposer fichiers ici</p>
              <p className="text-gray-500 text-sm">ou cliquer pour sélectionner</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={`${SUPPORTED_FORMATS.audio.map(f => `.${f}`).join(',')},${SUPPORTED_FORMATS.video.map(f => `.${f}`).join(',')}`}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Format Info */}
            <div className="bg-slate-800 rounded p-3 mb-4">
              <p className="text-xs text-gray-400 mb-2">Formats autorisés:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Audio: {SUPPORTED_FORMATS.audio.join(', ')}</p>
                <p>Vidéo: {SUPPORTED_FORMATS.video.join(', ')}</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 rounded p-3 mb-4">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sacred-400">
                <Loader size={18} className="animate-spin" />
                <span>Import en cours...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
