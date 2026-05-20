import React, { useState, useEffect } from 'react'
import {
  Home, Flame, BookOpen, PenTool, BarChart3, Sparkles, Bell,
  Menu, X, Send, Heart, Clock, BookMarked, TrendingUp, MessageCircle, Settings,
  Trash2, Edit2, Plus, ChevronDown, ChevronUp, Zap, Music, Play, Pause, Volume2,
  Copy, CheckCircle, AlertCircle, MapPin, Calendar
} from 'lucide-react'
import { useAppStore } from './store/appStore'
import { useJournal, usePurity, useReminders, useChat, useStats } from './hooks/useSpiritual'
import { useMediaLibrary, useSpiritualProgress, useRecommendations, usePrayerTimer, useVerseAudio, useCopy } from './hooks/useMultimedia'
import { biblicalVerses, encouragements, dailyVerses, weekProgrammes, salomonResponses } from './data/spiritualData'
import { mediaLibrary } from './data/mediaLibrary'
import { getMoodEmoji, getMoodColor, getRandomEncouragement, formatDate } from './utils/helpers'

type PageType = 'home' | 'combat' | 'bible' | 'journal' | 'dashboard' | 'salomon' | 'rappels' | 'multimedia' | 'parcours'

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const store = useAppStore()
  const journal = useJournal()
  const purity = usePurity()
  const reminders = useReminders()
  const chat = useChat()
  const stats = useStats()
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [chatInput, setChatInput] = useState('')
  const [selectedBibleTheme, setSelectedBibleTheme] = useState<keyof typeof biblicalVerses>('purity')
  const [activeReminder, setActiveReminder] = useState<string | null>(null)
  
  // New multimedia hooks
  const media = useMediaLibrary()
  const progress = useSpiritualProgress()
  const recommendations = useRecommendations()
  const prayerTimer = usePrayerTimer()
  const verseAudio = useVerseAudio()
  const { copied, copyToClipboard } = useCopy()
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'chants' | 'instrumentaux' | 'podcasts' | 'enseignements' | 'favoris'>('chants')
  const [combatModeActive, setCombatModeActive] = useState(false)

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'combat', label: 'Combat', icon: Flame },
    { id: 'bible', label: 'Bible', icon: BookOpen },
    { id: 'journal', label: 'Journal', icon: PenTool },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'multimedia', label: 'Médias', icon: Music },
    { id: 'parcours', label: 'Parcours', icon: MapPin },
    { id: 'salomon', label: 'Salomon', icon: Sparkles },
    { id: 'rappels', label: 'Rappels', icon: Bell },
  ] as const

  // PAGE: HOME / ACCUEIL
  const HomePage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-sacred-400 animate-glow">Nouvelle Création</h1>
        <p className="text-xl text-gray-300 mb-6">Marcher par l'Esprit et non selon la chair</p>
        <p className="text-lg text-sacred-300 italic mb-8">"{dailyVerses[0]}"</p>
      </div>

      {/* Verset du jour */}
      <div className="bg-gradient-to-r from-sacred-600 to-sacred-700 rounded-lg p-6 mb-8 border border-sacred-400 border-opacity-30">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Heart size={28} className="text-red-400" />
          Verset du jour
        </h2>
        <p className="text-lg leading-relaxed">{getRandomEncouragement(dailyVerses)}</p>
      </div>

      {/* Compteur de pureté */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-900 bg-opacity-30 rounded-lg p-6 border border-blue-500 border-opacity-20">
          <div className="text-4xl font-bold text-blue-400 mb-2">{purity.purityDays}</div>
          <p className="text-gray-300">Jours de pureté</p>
          {!purity.purityStartDate && (
            <button
              onClick={purity.startPurityJourney}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Commencer
            </button>
          )}
        </div>

        <div className="bg-green-900 bg-opacity-30 rounded-lg p-6 border border-green-500 border-opacity-20">
          <div className="text-4xl font-bold text-green-400 mb-2">{stats.bible_readings}</div>
          <p className="text-gray-300">Lectures bibliques</p>
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-purple-900 bg-opacity-20 rounded-lg p-6 border border-purple-500 border-opacity-20 text-center">
        <p className="text-lg text-purple-300 italic">"{getRandomEncouragement(encouragements)}"</p>
      </div>

      {/* Semaine actuelle */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-2xl font-bold mb-4">Programme de la semaine</h3>
        <div className="space-y-2">
          <p className="text-gray-300">{weekProgrammes[0].title}</p>
          <p className="text-sm text-sacred-300">{weekProgrammes[0].focus}</p>
        </div>
      </div>
    </div>
  )

  // PAGE: COMBAT SPIRITUEL
  const CombatPage = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Combat Spirituel</h1>

      <div className="bg-red-900 bg-opacity-20 rounded-lg p-8 border border-red-500 border-opacity-30 mb-8 text-center">
        <Flame size={64} className="mx-auto mb-4 text-red-400 animate-pulse" />
        <h2 className="text-3xl font-bold mb-4 text-red-300">Besoin d'aide?</h2>
        <p className="text-gray-300 mb-6">Cliquez sur le bouton ci-dessous pour accéder aux ressources d'urgence spirituelle</p>
        <button 
          onClick={() => {
            setCombatModeActive(true)
            prayerTimer.startTimer(5)
          }}
          className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
        >
          🆘 Tentation - Aide immédiate ({prayerTimer.formattedTime})
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-sacred-300">Versets pour le combat</h3>
          <div className="space-y-3">
            {biblicalVerses.victory.slice(0, 3).map((v, i) => (
              <div key={i} className="bg-slate-900 p-3 rounded text-sm text-gray-300">
                {v.book} {v.chapter}:{v.verse} - "{v.text.substring(0, 80)}..."
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-sacred-300">Respiration guidée</h3>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-sacred-500 rounded-full animate-breath mb-4"></div>
            <p className="text-gray-300">Inspirez... Expirez...</p>
            <button 
              onClick={() => prayerTimer.startTimer(5)}
              className="mt-4 bg-sacred-600 hover:bg-sacred-700 px-6 py-2 rounded-lg transition-all"
            >
              ⏱️ Démarrer {prayerTimer.isRunning && `(${prayerTimer.formattedTime})`}
            </button>
            {prayerTimer.isRunning && (
              <div className="mt-4 w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sacred-500 h-full transition-all duration-500"
                  style={{ width: `${prayerTimer.percentage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-sacred-300">Prière puissante</h3>
          <p className="text-gray-300 mb-4">
            "Seigneur Jésus, je reconnais ma faiblesse. Remplissez-moi de votre Saint-Esprit. Par votre force, je vaincs le péché aujourd'hui. Amen."
          </p>
          <button 
            onClick={() => media.playMedia(mediaLibrary[0])}
            className="w-full bg-sacred-600 hover:bg-sacred-700 px-4 py-2 rounded-lg transition-all"
          >
            {media.isPlaying && media.currentMedia?.id === mediaLibrary[0].id ? '⏸️ Arrêter musique' : '🎵 Lancer la musique worship'}
          </button>
        </div>
      </div>
    </div>
  )

  // PAGE: BIBLE
  const BiblePage = () => (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Méditation Biblique</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        {Object.keys(biblicalVerses).map((theme) => (
          <button
            key={theme}
            onClick={() => setSelectedBibleTheme(theme as keyof typeof biblicalVerses)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedBibleTheme === theme
                ? 'bg-sacred-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {biblicalVerses[selectedBibleTheme].map((verse, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-sacred-500 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sacred-300">
                {verse.book} {verse.chapter}:{verse.verse}
              </h3>
              <Heart size={20} className="text-red-400 cursor-pointer hover:fill-red-400" />
            </div>
            <p className="text-gray-300 leading-relaxed mb-3">"{verse.text}"</p>
            <div className="flex gap-2">
              <button 
                onClick={() => verseAudio.speakVerse(verse.text)}
                className="text-sm bg-sacred-600 hover:bg-sacred-700 px-3 py-1 rounded transition-colors flex items-center gap-1"
              >
                {verseAudio.isSpeaking && verseAudio.currentVerse === verse.text ? '⏸️' : '🎧'} Écouter
              </button>
              <button 
                onClick={() => copyToClipboard(`${verse.book} ${verse.chapter}:${verse.verse} - "${verse.text}"`)}
                className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors flex items-center gap-1"
              >
                {copied ? '✓' : <Copy size={14} />} {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // PAGE: JOURNAL
  const JournalPage = () => {
    const todayEntry = journal.getTodayEntry()

    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-sacred-400">Journal Spirituel</h1>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Aujourd'hui - {formatDate(new Date())}</h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Mon humeur spirituelle</label>
            <div className="flex gap-3">
              {(['excellent', 'bon', 'neutre', 'difficile', 'lutte'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => journal.setMood(m)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    journal.mood === m
                      ? `${getMoodColor(m)}`
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {getMoodEmoji(m)} {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Mes pensées et réflexions</label>
            <textarea
              value={journal.currentEntry}
              onChange={(e) => journal.setCurrentEntry(e.target.value)}
              placeholder="Écrivez vos pensées, vos victoires, vos luttes..."
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-4 text-gray-300 placeholder-gray-500 resize-none focus:border-sacred-500 focus:outline-none"
            />
          </div>

          <button
            onClick={journal.saveTodayEntry}
            disabled={!journal.currentEntry.trim()}
            className="w-full bg-sacred-600 hover:bg-sacred-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Sauvegarder l'entrée
          </button>
        </div>

        {/* Historique */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold mb-4">Historique récent</h3>
          {journal.entries.slice().reverse().slice(0, 7).map((entry) => (
            <div key={entry.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{formatDate(entry.date)}</p>
                  <p className="text-sm text-gray-400">{getMoodEmoji(entry.mood)} {entry.mood}</p>
                </div>
              </div>
              <p className="text-gray-300 line-clamp-2">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // PAGE: DASHBOARD
  const DashboardPage = () => (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Tableau de bord spirituel</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-500 border-opacity-20">
          <div className="text-3xl font-bold text-blue-400">{stats.purity_days}</div>
          <p className="text-sm text-gray-400">Jours de pureté</p>
        </div>
        <div className="bg-green-900 bg-opacity-30 rounded-lg p-4 border border-green-500 border-opacity-20">
          <div className="text-3xl font-bold text-green-400">{stats.prayer_minutes}</div>
          <p className="text-sm text-gray-400">Minutes de prière</p>
        </div>
        <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 border border-purple-500 border-opacity-20">
          <div className="text-3xl font-bold text-purple-400">{stats.bible_readings}</div>
          <p className="text-sm text-gray-400">Lectures bibliques</p>
        </div>
        <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-4 border border-yellow-500 border-opacity-20">
          <div className="text-3xl font-bold text-yellow-400">{stats.week_victories}</div>
          <p className="text-sm text-gray-400">Victoires cette semaine</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
        <h3 className="text-xl font-bold mb-4">Progression hebdomadaire</h3>
        <div className="space-y-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-12">{day}</span>
              <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sacred-500 to-sacred-400 h-full"
                  style={{ width: `${Math.random() * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold mb-4">Programme actuel</h3>
          <p className="text-gray-300 mb-2">{weekProgrammes[0].title}</p>
          <p className="text-sm text-gray-400">{weekProgrammes[0].focus}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold mb-4">Objectif hebdomadaire</h3>
          <p className="text-gray-300">5 lectures bibliques</p>
          <div className="mt-2 bg-slate-900 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-full w-3/5"></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">3 / 5 complétées</p>
        </div>
      </div>
    </div>
  )

  // PAGE: MULTIMEDIA - BIBLIOTHÈQUE SPIRITUELLE
  const MultimediaPage = () => (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Bibliothèque Spirituelle</h1>

      {/* Recommendations Section */}
      {recommendations.recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-sacred-300">✨ Recommandé pour toi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="bg-gradient-to-r from-sacred-700 to-sacred-600 rounded-lg p-4 border border-sacred-400">
                <p className="text-sm text-sacred-100 mb-2">{rec.reason}</p>
                <p className="font-semibold text-white">{rec.title}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    rec.priority === 'high' ? 'bg-red-600' : rec.priority === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Media Player */}
      {media.currentMedia && (
        <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-sacred-500 border-opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-sacred-300">{media.currentMedia.title}</h3>
              {media.currentMedia.artist && <p className="text-sm text-gray-400">{media.currentMedia.artist}</p>}
            </div>
            <button
              onClick={media.stopMedia}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-sacred-500 h-full transition-all duration-500"
                style={{ width: `${(media.currentTime / media.currentMedia.duration) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{Math.floor(media.currentTime / 60)}:{String(media.currentTime % 60).padStart(2, '0')}</span>
              <span>{Math.floor(media.currentMedia.duration / 60)}:{String(media.currentMedia.duration % 60).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={media.pauseMedia}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Pause size={20} />
            </button>
            <button
              onClick={media.resumeMedia}
              className="p-3 bg-sacred-600 hover:bg-sacred-700 rounded-lg transition-colors"
            >
              <Play size={20} />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <Volume2 size={16} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={media.volume}
                onChange={(e) => media.setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(['chants', 'instrumentaux', 'podcasts', 'enseignements', 'favoris'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedMediaCategory(cat)}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${
              selectedMediaCategory === cat
                ? 'bg-sacred-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {cat === 'chants' && '🎵'} {cat === 'instrumentaux' && '🎹'} {cat === 'podcasts' && '🎙️'} {cat === 'enseignements' && '📚'} {cat === 'favoris' && '❤️'} {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaLibrary.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-sacred-500 transition-colors">
            {item.thumbnail && (
              <img src={item.thumbnail} alt={item.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
              {item.artist && <p className="text-xs text-gray-400 mb-2">{item.artist}</p>}
              <div className="flex items-center justify-between">
                <span className="text-xs bg-sacred-700 text-sacred-200 px-2 py-1 rounded capitalize">{item.category}</span>
                <span className="text-xs text-gray-500">{Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => media.playMedia(item)}
                  className="flex-1 bg-sacred-600 hover:bg-sacred-700 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  {media.isPlaying && media.currentMedia?.id === item.id ? <Pause size={14} /> : <Play size={14} />}
                  {media.isPlaying && media.currentMedia?.id === item.id ? 'En cours' : 'Écouter'}
                </button>
                <button
                  onClick={() => media.toggleFavorite(item.id)}
                  className={`px-3 py-2 rounded transition-colors ${
                    item.favorite ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <Heart size={16} fill={item.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // PAGE: PARCOURS - PROGRESSION SPIRITUELLE
  const ParcourPage = () => (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Mon Parcours Spirituel</h1>

      {/* Current Status */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-900 bg-opacity-30 rounded-lg p-6 border border-blue-500 border-opacity-20 text-center">
          <p className="text-4xl font-bold text-blue-300 mb-2">Jour {progress.currentDay}</p>
          <p className="text-gray-300">Jour actuel</p>
        </div>
        <div className="bg-purple-900 bg-opacity-30 rounded-lg p-6 border border-purple-500 border-opacity-20 text-center">
          <p className="text-4xl font-bold text-purple-300 mb-2">{progress.currentWeek}</p>
          <p className="text-gray-300">Semaine</p>
        </div>
        <div className="bg-green-900 bg-opacity-30 rounded-lg p-6 border border-green-500 border-opacity-20 text-center">
          <p className="text-4xl font-bold text-green-300 mb-2">{Math.round(progress.getProgressPercentage())}%</p>
          <p className="text-gray-300">Progression</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <div className="flex gap-4">
          <button
            onClick={() => progress.updateDay(Math.max(1, progress.currentDay - 1))}
            disabled={progress.currentDay === 1}
            className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ChevronUp size={20} /> Jour précédent
          </button>
          <button
            onClick={() => progress.updateDay(Math.min(56, progress.currentDay + 1))}
            className="flex-1 bg-sacred-600 hover:bg-sacred-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Jour suivant <ChevronDown size={20} />
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4">Sélectionner une semaine</h2>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
            <button
              key={week}
              onClick={() => progress.updateWeek(week)}
              className={`p-3 rounded-lg font-bold transition-colors ${
                progress.currentWeek === week
                  ? 'bg-sacred-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              S{week}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Progression de la semaine</h3>
        <div className="bg-slate-900 rounded-full h-4 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-sacred-500 to-sacred-400 h-full transition-all duration-500"
            style={{ width: `${progress.getProgressPercentage()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400">{progress.daysCompleted} / 7 jours complétés</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-2xl font-bold text-sacred-300">{progress.meditationsCompleted}</p>
          <p className="text-sm text-gray-400">Méditations complétées</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-2xl font-bold text-sacred-300">{progress.prayerSessionsCompleted}</p>
          <p className="text-sm text-gray-400">Sessions de prière</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-2xl font-bold text-sacred-300">{progress.mediaListenedMinutes}</p>
          <p className="text-sm text-gray-400">Minutes écoutées</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-2xl font-bold text-sacred-300">{progress.daysCompleted}</p>
          <p className="text-sm text-gray-400">Jours complétés</p>
        </div>
      </div>

      {/* Current Week Focus */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4">Focus de la Semaine {progress.currentWeek}</h3>
        <p className="text-gray-300 mb-4">Écouter les recommandations adaptées à ta semaine actuelle</p>
        <button
          onClick={() => setCurrentPage('multimedia')}
          className="w-full bg-sacred-600 hover:bg-sacred-700 px-4 py-3 rounded-lg font-bold transition-colors"
        >
          📚 Voir les contenus recommandés
        </button>
      </div>
    </div>
  )

  // PAGE: SALOMON
  const SalomonPage = () => (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <h1 className="text-4xl font-bold mb-4 text-sacred-400">Salomon - Conseiller Spirituel</h1>
      <p className="text-gray-400 mb-6">Une IA spirituelle pour vous guider et vous encourager</p>

      <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 p-4 mb-4 overflow-y-auto space-y-4">
        {chat.getLastMessages(10).map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-sacred-600 text-white'
                  : 'bg-slate-800 text-gray-300 border border-slate-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && chatInput.trim()) {
              chat.addMessage('user', chatInput)
              const response = getRandomEncouragement(salomonResponses.prayer)
              setTimeout(() => chat.addMessage('salomon', response), 500)
              setChatInput('')
            }
          }}
          placeholder="Posez une question spirituelle..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:border-sacred-500 focus:outline-none"
        />
        <button
          onClick={() => {
            if (chatInput.trim()) {
              chat.addMessage('user', chatInput)
              const response = getRandomEncouragement(salomonResponses.prayer)
              setTimeout(() => chat.addMessage('salomon', response), 500)
              setChatInput('')
            }
          }}
          className="bg-sacred-600 hover:bg-sacred-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )

  // PAGE: RAPPELS
  const RappelsPage = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-sacred-400">Rappels Spirituels</h1>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4">Ajouter un rappel</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Titre du rappel..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-gray-300 focus:border-sacred-500 focus:outline-none"
          />
          <input
            type="time"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-gray-300 focus:border-sacred-500 focus:outline-none"
          />
          <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-gray-300 focus:border-sacred-500 focus:outline-none">
            <option>Prière</option>
            <option>Lecture biblique</option>
            <option>Jeûne</option>
            <option>Adoration</option>
            <option>Méditation</option>
          </select>
          <button className="w-full bg-sacred-600 hover:bg-sacred-700 px-4 py-3 rounded-lg font-bold transition-colors">
            + Créer le rappel
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-4">Rappels actifs</h3>
        {reminders.reminders.map((reminder) => (
          <div key={reminder.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-center">
            <div>
              <p className="font-semibold">{reminder.title}</p>
              <p className="text-sm text-gray-400">{reminder.time} - {reminder.type}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => reminders.toggleReminder(reminder.id)}
                className={`px-3 py-1 rounded transition-colors ${
                  reminder.enabled ? 'bg-green-600' : 'bg-slate-600'
                }`}
              >
                {reminder.enabled ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => reminders.deleteReminder(reminder.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Render page basée sur currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'combat':
        return <CombatPage />
      case 'bible':
        return <BiblePage />
      case 'journal':
        return <JournalPage />
      case 'dashboard':
        return <DashboardPage />
      case 'multimedia':
        return <MultimediaPage />
      case 'parcours':
        return <ParcourPage />
      case 'salomon':
        return <SalomonPage />
      case 'rappels':
        return <RappelsPage />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-black bg-opacity-50 border-r border-sacred-600 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold text-sacred-400 mb-8 text-center">✨ NC</h1>
          <nav className="space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id as PageType)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                  currentPage === id
                    ? 'bg-sacred-600 bg-opacity-40 text-sacred-200 border border-sacred-500'
                    : 'hover:bg-sacred-600 hover:bg-opacity-20 text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-600 mt-6 pt-6">
            <a
              href="/programme-spirituel-8semaines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sacred-400 hover:text-sacred-300 hover:underline text-center block mb-2 transition-colors"
            >
              📄 Programme (8 semaines)
            </a>
            <p className="text-xs text-gray-500 text-center">
              © Nouvelle Création 2024
            </p>
            <p className="text-xs text-gray-600 text-center mt-2">
              Marche par l'Esprit
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-sacred-600 border-opacity-20 bg-slate-800 bg-opacity-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sacred-600 hover:bg-opacity-20 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-2xl font-bold flex-1 text-center">Nouvelle Création</h2>
          <button className="p-2 hover:bg-sacred-600 hover:bg-opacity-20 rounded-lg transition-colors">
            <Settings size={24} />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">{renderPage()}</div>
      </div>
    </div>
  )
}

export default App
