import React, { useRef, useCallback, useState, memo } from 'react'
import { Send, Trash2 } from 'lucide-react'

interface JournalEntry {
  id: string
  date: string
  mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious'
  content: string
}

interface JournalEditorProps {
  journalText: string
  journalMood: 'joyful' | 'peaceful' | 'struggling' | 'victorious'
  journalEntries: JournalEntry[]
  onTextChange: (text: string) => void
  onMoodChange: (mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious') => void
  onSave: () => void
  onDeleteEntry: (id: string) => void
  getMoodEmoji: (mood: string) => string
  getMoodColor: (mood: string) => string
}

const JournalEditor = memo(({
  journalText,
  journalMood,
  journalEntries,
  onTextChange,
  onMoodChange,
  onSave,
  onDeleteEntry,
  getMoodEmoji,
  getMoodColor
}: JournalEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  // Gestion du changement de texte avec auto-save debounce
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    onTextChange(newText)
    setHasUnsavedChanges(true)

    // Auto-save debounce (3 secondes d'inactivité)
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (newText.trim() && newText !== journalText) {
        onSave()
        setHasUnsavedChanges(false)
      }
    }, 3000)
  }, [journalText, onTextChange, onSave])

  // Focus persistant
  const handleFocus = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Maintenir focus après mouvement souris
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Keyboard shortcut: Ctrl+Enter pour save
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      onSave()
      setHasUnsavedChanges(false)
    }
  }, [onSave])

  const handleMoodChange = useCallback((mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious') => {
    onMoodChange(mood)
  }, [onMoodChange])

  const handleSave = useCallback(() => {
    onSave()
    setHasUnsavedChanges(false)
  }, [onSave])

  return (
    <div className="space-y-8">
      {/* Éditeur */}
      <div className="bg-gradient-to-br from-spiritual-800/40 to-spiritual-900/40 border border-spiritual-500/50 rounded-xl p-8 space-y-4">
        {/* Sélecteur mood */}
        <div>
          <label className="block text-spiritual-200 mb-2">Votre ressenti spirituel</label>
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['joyful', 'peaceful', 'struggling', 'victorious'] as const).map(mood => (
              <button
                key={mood}
                onClick={() => handleMoodChange(mood)}
                className={`px-4 py-2 rounded-lg transition ${
                  journalMood === mood
                    ? 'bg-spiritual-600 border border-spiritual-400'
                    : 'bg-spiritual-800/50 border border-spiritual-600/50'
                }`}
              >
                {getMoodEmoji(mood)} {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-spiritual-200 mb-2">
            Votre texte
            {hasUnsavedChanges && <span className="text-yellow-400 ml-2 text-sm">(non sauvegardé)</span>}
          </label>
          <textarea
            ref={textareaRef}
            value={journalText}
            onChange={handleTextChange}
            onMouseDown={handleMouseDown}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez vos pensées, prières, luttes et victoires... (Ctrl+Entrée pour sauvegarder)"
            className="w-full bg-spiritual-900/50 border-2 border-spiritual-500/30 rounded-lg p-4 text-spiritual-200 placeholder-spiritual-400/50 focus:outline-none focus:border-spiritual-400 focus:border-2 resize-vertical selection:bg-spiritual-600 selection:text-spiritual-100 focus:shadow-lg focus:shadow-spiritual-600/20"
            style={{
              minHeight: '200px',
              maxHeight: '500px',
              fontFamily: 'inherit',
              caretColor: '#c084fa',
              transition: 'border-color 0.2s'
            }}
            spellCheck="true"
            autoComplete="off"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!journalText.trim()}
          className="bg-spiritual-600 hover:bg-spiritual-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition flex items-center gap-2 w-full justify-center"
        >
          <Send size={18} /> Sauvegarder l'entrée
        </button>
      </div>

      {/* Historique */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-spiritual-300">Historique ({journalEntries.length})</h3>
        {journalEntries.length === 0 ? (
          <p className="text-spiritual-400">Aucune entrée. Commencez à écrire!</p>
        ) : (
          journalEntries.map(entry => (
            <div key={entry.id} className={`border rounded-lg p-4 ${getMoodColor(entry.mood)}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-spiritual-300 font-bold">{getMoodEmoji(entry.mood)} {entry.mood}</p>
                  <p className="text-xs text-spiritual-400">{entry.date}</p>
                </div>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-spiritual-200 whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
})

JournalEditor.displayName = 'JournalEditor'

export default JournalEditor
