import React, { useRef, useState } from 'react'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { importMediaFile, getImportedMedia } from '../utils/mediaImport'
import { MediaItem } from '../types/index'

interface MediaImporterProps {
  onMediaImported?: (media: MediaItem[]) => void
}

export const MediaImporter: React.FC<MediaImporterProps> = ({ onMediaImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  const supportedFormats = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4', 'application/pdf']
  const supportedExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.pdf']

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setImporting(true)
    setError(null)
    setSuccess(false)
    setProgress(0)

    try {
      const imported: MediaItem[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!supportedFormats.includes(file.type)) {
          console.warn(`Skipping unsupported file: ${file.name}`)
          continue
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          setError(`File ${file.name} is too large (max 100MB)`)
          continue
        }

        try {
          const media = await importMediaFile(file)
          imported.push(media)
          setProgress(((i + 1) / files.length) * 100)
        } catch (err) {
          console.error(`Error importing ${file.name}:`, err)
        }
      }

      if (imported.length > 0) {
        setSuccess(true)
        onMediaImported?.(imported)
      } else if (!error) {
        setError('No valid files were imported')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={supportedExtensions.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sacred-600 hover:bg-sacred-700 disabled:bg-slate-700 rounded-lg transition-colors text-white font-semibold"
      >
        <Upload size={18} />
        {importing ? `Importing... ${Math.round(progress)}%` : 'Import Media'}
      </button>

      <div className="mt-2 text-xs text-gray-400">
        Formats: MP3, WAV, M4A, MP4, PDF (max 100MB)
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-900 bg-opacity-20 rounded-lg border border-red-500 border-opacity-30">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-green-900 bg-opacity-20 rounded-lg border border-green-500 border-opacity-30">
          <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">Media imported successfully!</p>
        </div>
      )}
    </div>
  )
}
