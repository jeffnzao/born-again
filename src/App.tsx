import React, { useState, useEffect } from 'react'
import {
  Home, Flame, BookOpen, PenTool, BarChart3, Sparkles, Bell,
  Heart, Clock, AlertTriangle, Send, Plus, Trash2, CheckCircle,
  Settings, Menu, X, RotateCcw, Volume2
} from 'lucide-react'
import JournalEditor from './components/JournalEditor'

interface JournalEntry {
  id: string
  date: string
  mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious'
  content: string
}

interface ReminderItem {
  id: string
  title: string
  time: string
  enabled: boolean
}

interface DailyHabit {
  habit: string
  completed: boolean
}

interface DayStats {
  date: string
  habits: DailyHabit[]
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'combat' | 'bible' | 'journal' | 'dashboard' | 'solomon' | 'reminders' | 'program'>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [purityDays, setPurityDays] = useState(157)
  const [selectedBibleTheme, setSelectedBibleTheme] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedVersePopup, setSelectedVersePopup] = useState<string | null>(null)
  const [showVersePopup, setShowVersePopup] = useState(false)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      mood: 'joyful',
      content: 'Journée glorieuse avec le Seigneur. J\'ai senti sa présence fortement.'
    }
  ])
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: '1', title: 'Prière matinale', time: '06:00', enabled: true },
    { id: '2', title: 'Lecture biblique', time: '12:00', enabled: true },
    { id: '3', title: 'Méditation du soir', time: '21:00', enabled: false }
  ])
  const [newReminderTitle, setNewReminderTitle] = useState('')
  const [newReminderTime, setNewReminderTime] = useState('09:00')
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [journalText, setJournalText] = useState('')
  const [journalMood, setJournalMood] = useState<'joyful' | 'peaceful' | 'struggling' | 'victorious'>('peaceful')
  const [solomonChat, setSolomonChat] = useState<Array<{ role: 'user' | 'ai', text: string }>>([
    { role: 'ai', text: 'Paix soit avec vous. Je suis Salomon, votre conseiller spirituel. Comment puis-je vous aider?' }
  ])
  const [solomonInput, setSolomonInput] = useState('')
  const [dayStats, setDayStats] = useState<DayStats[]>([])

  // Versets par palier de combat
  const combatVersesByLevel = {
    '1 Jour': [
      'Philippiens 4:13 - Je fais toutes choses avec force en celui qui me fortifie.',
      '1 Jean 5:4 - Tout ce qui est né de Dieu triomphe du monde'
    ],
    '1 Semaine': [
      'Éphésiens 6:12 - Car nous n\'avons pas à lutter contre la chair et le sang...',
      '1 Corinthiens 10:13 - Dieu ne permettra pas que vous soyez tentés au-delà de vos forces'
    ],
    '2 Semaines': [
      '2 Timothée 2:22 - Fuis les convoitises de la jeunesse; recherche la justice...',
      'Proverbes 4:23 - Garde ton cœur plus que toute autre chose'
    ],
    '1 Mois': [
      'Romains 6:14 - Le péché n\'aura point de pouvoir sur vous...',
      'Colossiens 3:5 - Mortifiez donc les membres qui sont sur la terre'
    ],
    '3 Mois': [
      '1 Thessaloniciens 4:3-4 - Ce que Dieu veut, c\'est votre sanctification...',
      '2 Corinthiens 5:17 - Si quelqu\'un est en Christ, il est une nouvelle créature'
    ],
    '6 Mois': [
      'Hébreux 12:1 - Dépouillons-nous de tout fardeau et du péché qui nous enveloppe...',
      'Proverbes 8:11 - La sagesse est plus précieuse que les perles'
    ]
  }

  // Données bibliques complètes
  const bibleSections: Record<string, string[]> = {
    'pureté': [
      'Philipiens 4:8 - Frères, que tout ce qui est vrai, honorable, juste, pur, aimable, digne de louange...',
      '1 Théssaloniciens 4:3-4 - Ce que Dieu veut, c\'est votre sanctification...',
      'Proverbes 4:23 - Garde ton cœur plus que toute autre chose, car de lui jaillissent les sources de la vie',
      'Tite 2:12 - Elle nous enseigne à renoncer à l\'impiété et aux convoitises mondaines',
      '1 Corinthiens 6:18-19 - Fuyez l\'impureté. Celui qui commet l\'impureté pèche contre son propre corps'
    ],
    'combat': [
      'Éphésiens 6:12 - Car nous n\'avons pas à lutter contre la chair et le sang...',
      '2 Corinthiens 10:5 - Nous détruisons les arguments et toute hauteur qui s\'élève contre la connaissance de Dieu...',
      '1 Pierre 5:8 - Soyez sobres, veillez. Votre adversaire, le diable, rôde comme un lion rugissant...',
      'Éphésiens 6:10-11 - Fortifiez-vous dans le Seigneur et par sa puissance toute puissante',
      'Jacques 4:7 - Soumettez-vous donc à Dieu; résistez au diable, et il fuira loin de vous'
    ],
    'grâce': [
      'Romains 3:24 - Et ils sont gratuitement justifiés par sa grâce, par le moyen de la rédemption...',
      'Éphésiens 2:8-9 - Car c\'est par la grâce que vous êtes sauvés, par le moyen de la foi...',
      '2 Corinthiens 12:9 - Ma grâce te suffit, car ma puissance s\'accomplit dans la faiblesse',
      'Tite 3:7 - Afin que, justifiés par sa grâce, nous devenions héritiers de la vie éternelle',
      'Hébreux 4:16 - Approchons-nous donc avec assurance du trône de la grâce'
    ],
    'identité': [
      '2 Corinthiens 5:17 - Si quelqu\'un est en Christ, il est une nouvelle créature...',
      'Romains 8:37 - Dans toutes ces choses nous sommes plus que vainqueurs...',
      '1 Jean 3:1 - Voyez quel amour le Père nous a témoigné, de nous appeler enfants de Dieu',
      'Romains 8:1 - Il n\'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ',
      'Éphésiens 1:3 - Béni soit Dieu, le Père de notre Seigneur Jésus-Christ'
    ],
    'prière': [
      '1 Thessaloniciens 5:17 - Priez sans cesse',
      'Philippiens 4:6 - Ne vous inquiétez de rien; mais en toute chose, faites connaître vos besoins à Dieu...',
      'Matthieu 21:22 - Et tout ce que vous demanderez en priant, si vous y croyez, vous le recevrez',
      'Marc 11:24 - Croyez que vous les avez reçues, et vous les obtiendrez',
      'Luc 11:9 - Demandez, et vous recevrez; cherchez, et vous trouverez'
    ],
    'discipline': [
      'Proverbes 12:1 - Celui qui aime la discipline aime le savoir...',
      '1 Timothée 4:7 - Abstiens-toi des contes profanes et des vieilles femmes; exerce-toi plutôt à la piété',
      'Hébreux 12:11 - Il est vrai que toute correction semble d\'abord pénible et non pas agréable...',
      '2 Timothée 1:7 - Car Dieu ne nous a pas donné un esprit de timidité, mais de puissance',
      'Proverbes 25:28 - Celui qui n\'a pas de empire sur lui-même est comme une ville sans murs'
    ]
  }

  const habitsList = [
    'Prière du matin',
    'Lecture biblique',
    'Méditation',
    'Jeûne intermittent'
  ]

  // Horloge
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Programme de 4 semaines
  const program = {
    semaine1: {
      titre: 'Le pardon et la purification viennent de Toi Seigneur',
      versets: ['Ésaïe 1:1-20', 'Jérémie 4:14', 'Jacques 4:8', '2 Corinthiens 7:1', 'Psaume 51', '1 Jean 1:7-9'],
      requetes: [
        'Confession sincère et humiliation devant Dieu',
        'Demander la purification intérieure - Jérémie 4:14',
        'Se dépouiller du vieil homme - Éphésiens 4:22-24',
        'Retrouver la sensibilité spirituelle'
      ]
    },
    semaine2: {
      titre: 'Recevoir par la foi la délivrance complète',
      versets: ['Hébreux 9:12-14', 'Hébreux 9:25-28', 'Hébreux 2:14-15', '1 Jean 3:8-9', 'Romains 6', 'Psaume 56:13', 'Galates 5:24'],
      requetes: [
        'Croire à la puissance du sang de Jésus - Hébreux 9:12-14',
        'Recevoir la destruction des œuvres du diable - 1 Jean 3:8',
        'Être délivré de la servitude du péché - Hébreux 2:14-15',
        'Marcher désormais dans la lumière - Psaume 56:13'
      ]
    },
    semaine3: {
      titre: 'Être rempli du Saint-Esprit et restaurer une vie spirituelle forte',
      versets: ['Galates 5:16-25', 'Romains 8:1-14', 'Éphésiens 5:18', 'Jean 15:1-7', 'Psaume 119:9-11'],
      requetes: [
        'Seigneur, remplis-moi du Saint-Esprit chaque jour',
        'Apprends-moi à marcher selon l\'Esprit',
        'Que la Parole de Dieu prenne une grande place dans ma vie',
        'Donne-moi une discipline spirituelle stable'
      ]
    },
    semaine4: {
      titre: 'Marcher dans la sainteté et devenir stable spirituellement',
      versets: ['1 Thessaloniciens 4:3-8', 'Hébreux 12:14', '2 Timothée 2:20-22', 'Job 31:1', 'Proverbes 4:23'],
      requetes: [
        'Seigneur, établis-moi dans la sainteté durable',
        'Donne-moi la vigilance spirituelle',
        'Aide-moi à fuir les occasions de chute',
        'Que ma communion avec Dieu devienne ma priorité'
      ]
    }
  }

  // Fonction urgence avec son
  const handleUrgencyCall = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      console.log('Son non disponible')
    }
    
    // Notification
    if ((window as any).electronAPI) {
      (window as any).electronAPI.showNotification('🚨 URGENCE SPIRITUELLE', 'Priez! Appelez à l\'aide de Dieu immédiatement. Respiration: 4-4-4')
    } else {
      alert('🚨 URGENT - Demandez l\'aide de Dieu maintenant!\n\nRespiration: Inspirez 4s, Pausez 4s, Expirez 4s\n\nVersets: Philippiens 4:13, 1 Jean 5:4')
    }
  }

  const handleAddJournal = () => {
    if (journalText.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('fr-FR'),
        mood: journalMood,
        content: journalText
      }
      setJournalEntries([newEntry, ...journalEntries])
      setJournalText('')
    }
  }

  const handleDeleteJournal = (id: string) => {
    setJournalEntries(journalEntries.filter(e => e.id !== id))
  }

  const handleSolomonSend = () => {
    if (solomonInput.trim()) {
      const responses = [
        'Écoutez les Écritures: "Je fais toutes choses avec force en celui qui me fortifie"',
        'La prière change tout. Approchez-vous du trône de la grâce avec confiance.',
        'Le Seigneur dit: "Mon amour ne s\'éloignera pas de toi". Ayez confiance en Sa bienveillance.',
        'Rappelez-vous: "Si quelqu\'un est en Christ, il est une nouvelle créature"',
        'Dieu connaît vos luttes. Présentez-les devant Lui avec un cœur sincère et Il vous accordera la paix.'
      ]
      
      setSolomonChat([
        ...solomonChat,
        { role: 'user', text: solomonInput },
        { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }
      ])
      setSolomonInput('')
    }
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const addReminder = () => {
    if (newReminderTitle.trim()) {
      const newReminder: ReminderItem = {
        id: Date.now().toString(),
        title: newReminderTitle,
        time: newReminderTime,
        enabled: true
      }
      setReminders([...reminders, newReminder])
      setNewReminderTitle('')
      setNewReminderTime('09:00')
      setShowAddReminder(false)
    }
  }

  const toggleHabit = (habitName: string) => {
    const today = new Date().toLocaleDateString('fr-FR')
    const todayIndex = dayStats.findIndex(s => s.date === today)
    
    if (todayIndex === -1) {
      // Create new day stats for today
      const newTodayStats: DayStats = {
        date: today,
        habits: habitsList.map(h => ({ 
          habit: h, 
          completed: h === habitName // Set the clicked habit as completed
        }))
      }
      setDayStats([newTodayStats, ...dayStats])
    } else {
      // Update existing day stats
      const updatedStats = dayStats.map((day, idx) => 
        idx === todayIndex 
          ? {
              ...day,
              habits: day.habits.map(h =>
                h.habit === habitName ? { ...h, completed: !h.completed } : h
              )
            }
          : day
      )
      setDayStats(updatedStats)
    }
  }

  const getHabitPercentage = () => {
    if (dayStats.length === 0) return 0
    const totalCompleted = dayStats.reduce((sum, day) => sum + day.habits.filter(h => h.completed).length, 0)
    const totalPossible = dayStats.length * habitsList.length
    return Math.round((totalCompleted / totalPossible) * 100)
  }

  const checkHabitDecline = () => {
    if (dayStats.length < 2) return false
    const lastDay = dayStats[0]
    const previousDay = dayStats[1]
    const lastCompleted = lastDay.habits.filter(h => h.completed).length
    const previousCompleted = previousDay.habits.filter(h => h.completed).length
    return lastCompleted < previousCompleted
  }

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      joyful: 'bg-yellow-500/20 border-yellow-500/50',
      peaceful: 'bg-blue-500/20 border-blue-500/50',
      struggling: 'bg-red-500/20 border-red-500/50',
      victorious: 'bg-green-500/20 border-green-500/50'
    }
    return colors[mood] || colors.peaceful
  }

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      joyful: '😊',
      peaceful: '🕯️',
      struggling: '⚔️',
      victorious: '🏆'
    }
    return emojis[mood] || '📝'
  }

  const getRandomVerse = () => {
    const allVerses: string[] = []
    Object.values(bibleSections).forEach(verses => {
      allVerses.push(...verses)
    })
    Object.values(combatVersesByLevel).forEach(verses => {
      allVerses.push(...verses)
    })
    const randomVerse = allVerses[Math.floor(Math.random() * allVerses.length)]
    setSelectedVersePopup(randomVerse || 'Psaume 23:1 - L\'Eternel est mon berger')
    setShowVersePopup(true)
  }

  // ============= ACCUEIL =============
  const HomePage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-spiritual-400 to-spiritual-300 bg-clip-text text-transparent">
            Nouvelle Création
          </h1>
          <p className="text-xl text-spiritual-200">Votre compagnon spirituel de pureté et de victoire</p>
        </div>

        <div className="bg-gradient-to-br from-spiritual-800/40 to-sacred-900/40 border border-spiritual-600/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-spiritual-500/20 transition">
          <h3 className="text-sm uppercase tracking-wider text-spiritual-300 mb-3">Verset du jour</h3>
          <p className="text-lg text-sacred-100 italic leading-relaxed">
            "Je fais toutes choses avec force en celui qui me fortifie."
          </p>
          <p className="text-spiritual-300 text-sm mt-4">— Philippiens 4:13</p>
        </div>

        {/* Clock Section */}
        <div className="bg-gradient-to-br from-spiritual-800/40 to-sacred-900/40 border border-spiritual-600/30 rounded-xl p-8 text-center">
          <h3 className="text-sm uppercase tracking-wider text-spiritual-300 mb-4">Horloge Spirituelle</h3>
          <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
            {/* Clock face */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(192, 132, 250, 0.3)" strokeWidth="2"/>
            <circle cx="100" cy="100" r="90" fill="rgba(19, 20, 39, 0.5)"/>
            
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180
              const x1 = 100 + 75 * Math.cos(angle)
              const y1 = 100 + 75 * Math.sin(angle)
              const x2 = 100 + 85 * Math.cos(angle)
              const y2 = 100 + 85 * Math.sin(angle)
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(192, 132, 250, 0.6)" strokeWidth="2"/>
            })}

            {/* Hour hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 40 * Math.sin((currentTime.getHours() * 30 + currentTime.getMinutes() * 0.5) * Math.PI / 180)}
              y2={100 - 40 * Math.cos((currentTime.getHours() * 30 + currentTime.getMinutes() * 0.5) * Math.PI / 180)}
              stroke="rgba(200, 220, 100, 0.8)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Minute hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.sin((currentTime.getMinutes() * 6) * Math.PI / 180)}
              y2={100 - 60 * Math.cos((currentTime.getMinutes() * 6) * Math.PI / 180)}
              stroke="rgba(200, 220, 100, 0.6)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Center dot */}
            <circle cx="100" cy="100" r="4" fill="rgba(200, 220, 100, 0.8)"/>
          </svg>
          <p className="text-2xl font-bold text-spiritual-300 mt-4">
            {currentTime.toLocaleTimeString('fr-FR')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-spiritual-700/40 to-spiritual-900/40 border border-spiritual-500/50 rounded-xl p-8 text-center">
            <Heart className="mx-auto mb-4 text-red-400" size={48} />
            <h3 className="text-spiritual-200 text-sm uppercase tracking-wider mb-2">Jours de Pureté</h3>
            <p className="text-6xl font-bold text-spiritual-300 mb-4">{purityDays}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setPurityDays(purityDays + 1)}
                className="bg-spiritual-600 hover:bg-spiritual-500 px-6 py-2 rounded-lg transition text-sm flex-1"
              >
                +1 jour
              </button>
              <button
                onClick={() => setPurityDays(0)}
                className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg transition text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Réinitialiser
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-sacred-700/40 to-sacred-900/40 border border-sacred-500/50 rounded-xl p-8">
            <Clock className="mx-auto mb-4 text-sacred-300" size={48} />
            <h3 className="text-sacred-200 text-sm uppercase tracking-wider mb-4">Paliers Atteints</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: '1 semaine', days: 7 },
                { label: '1 mois', days: 30 },
                { label: '3 mois', days: 90 },
                { label: '6 mois', days: 180 }
              ].map((palier) => (
                <div key={palier.label} className="flex items-center justify-between">
                  <span className="text-sacred-300">{palier.label}</span>
                  {purityDays >= palier.days ? (
                    <CheckCircle className="text-green-400" size={20} />
                  ) : (
                    <div className="w-5 h-5 border-2 border-spiritual-600/50 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-spiritual-900/30 border border-spiritual-600/30 rounded-xl p-8">
          <h3 className="text-spiritual-200 text-sm uppercase tracking-wider mb-6">Accès rapide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Flame, label: 'Combat', action: 'combat' },
              { icon: BookOpen, label: 'Bible', action: 'bible' },
              { icon: PenTool, label: 'Journal', action: 'journal' },
              { icon: BarChart3, label: 'Tableau', action: 'dashboard' }
            ].map((item) => (
              <button
                key={item.action}
                onClick={() => setCurrentPage(item.action as any)}
                className="p-4 bg-spiritual-800/40 hover:bg-spiritual-700/60 border border-spiritual-500/30 rounded-lg transition flex flex-col items-center gap-2"
              >
                <item.icon className="text-spiritual-400" size={24} />
                <span className="text-xs text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={getRandomVerse}
            className="bg-gradient-to-r from-sacred-700 to-sacred-800 hover:from-sacred-600 hover:to-sacred-700 px-8 py-3 rounded-lg transition font-bold text-spiritual-200"
          >
            ✨ Verset Aléatoire
          </button>
        </div>
      </div>
    </div>
  )

  // ============= COMBAT SPIRITUEL =============
  const CombatPage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold text-spiritual-300">⚔️ Combat Spirituel</h2>

        <button 
          onClick={handleUrgencyCall}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 py-6 rounded-xl font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-red-500/50 animate-glow flex items-center justify-center gap-2"
        >
          <Volume2 size={24} /> 🚨 APPEL À L'AIDE - URGENCE TENTATION
        </button>

        <div className="bg-gradient-to-br from-spiritual-800/40 to-spiritual-900/40 border border-spiritual-500/50 rounded-xl p-12 text-center">
          <h3 className="text-spiritual-200 mb-8">Respiration de combat</h3>
          <div className="flex justify-center items-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-spiritual-500 to-spiritual-600 rounded-full animate-breathe shadow-lg shadow-spiritual-500/50" />
          </div>
          <div className="text-spiritual-300 space-y-2">
            <p>Inspiration: 4 secondes - Prière: 4 secondes</p>
            <p>Expiration: 4 secondes</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-spiritual-300">Versets par Palier de Victoire</h3>
          {Object.entries(combatVersesByLevel).map(([level, verses]) => (
            <div key={level} className="bg-spiritual-800/30 border border-spiritual-500/30 rounded-lg p-4 hover:border-spiritual-400/50 transition">
              <h4 className="font-bold text-spiritual-300 mb-3">{level}</h4>
              <div className="space-y-2">
                {verses.map((verse, idx) => (
                  <p key={idx} className="text-sm text-spiritual-200 pl-4 border-l-2 border-spiritual-500/50">{verse}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-sacred-700/40 to-sacred-900/40 border border-sacred-500/50 rounded-xl p-8">
          <h3 className="text-sacred-200 mb-6">Progression de la Victoire</h3>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`p-4 rounded-lg text-center ${i < Math.min(Math.floor(purityDays / 7), 12) ? 'bg-green-500/30 border border-green-400' : 'bg-spiritual-700/30 border border-spiritual-500/30'}`}>
                <p className="text-sm text-spiritual-300">{i + 1}w</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-sacred-300 mt-4">Semaines complétées: {Math.floor(purityDays / 7)}</p>
        </div>
      </div>
    </div>
  )

  // ============= BIBLE =============
  const BiblePage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold text-spiritual-300">📖 Bible Thématique</h2>

        {selectedBibleTheme ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedBibleTheme(null)}
              className="mb-4 bg-spiritual-700/40 hover:bg-spiritual-700/60 border border-spiritual-500/50 rounded-lg px-4 py-2 transition text-spiritual-300"
            >
              ← Retour aux thèmes
            </button>
            <h3 className="text-2xl font-bold text-spiritual-300 capitalize mb-4">{selectedBibleTheme}</h3>
            <div className="space-y-3">
              {(bibleSections[selectedBibleTheme] || []).map((verse, idx) => (
                <div key={idx} className="bg-spiritual-800/30 border border-spiritual-500/30 rounded-lg p-4 hover:border-spiritual-400/50 transition">
                  <p className="text-spiritual-200">{verse}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(bibleSections).map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedBibleTheme(theme)}
                className="bg-gradient-to-br from-spiritual-800/40 to-spiritual-900/40 border border-spiritual-500/50 hover:border-spiritual-400 rounded-xl p-6 transition cursor-pointer text-left"
              >
                <h3 className="font-bold text-spiritual-300 mb-4 capitalize text-lg">{theme}</h3>
                <div className="space-y-2 text-xs">
                  <p className="text-spiritual-200 line-clamp-2">{bibleSections[theme][0]}</p>
                  <p className="text-spiritual-400">+{bibleSections[theme].length} versets</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // ============= JOURNAL =============
  const JournalPage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-spiritual-300 mb-8">✍️ Journal Spirituel</h2>
        <JournalEditor
          journalText={journalText}
          journalMood={journalMood}
          journalEntries={journalEntries}
          onTextChange={setJournalText}
          onMoodChange={setJournalMood}
          onSave={handleAddJournal}
          onDeleteEntry={handleDeleteJournal}
          getMoodEmoji={getMoodEmoji}
          getMoodColor={getMoodColor}
        />
      </div>
    </div>
  )

  // ============= TABLEAU DE BORD =============
  const DashboardPage = () => {
    const today = new Date().toLocaleDateString('fr-FR')
    const todayStats = dayStats.find(s => s.date === today)
    const completedToday = todayStats?.habits.filter(h => h.completed).length || 0
    const decline = checkHabitDecline()

    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-spiritual-300">📊 Tableau de Bord</h2>

          {decline && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="text-red-400 mt-1" size={20} />
              <div>
                <p className="font-bold text-red-300">⚠️ Alerte: Baisse de performances constatée</p>
                <p className="text-sm text-red-200">Vos habitudes ont diminué aujourd'hui. Redoublez d'efforts!</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-spiritual-800/40 border border-spiritual-500/50 rounded-xl p-6">
              <h3 className="text-spiritual-300 text-sm uppercase tracking-wider mb-4">Pureté</h3>
              <p className="text-3xl font-bold mb-4 text-spiritual-200">{purityDays}</p>
              <div className="w-full bg-spiritual-900/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600"
                  style={{ width: `${Math.min((purityDays / 365) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-spiritual-800/40 border border-spiritual-500/50 rounded-xl p-6">
              <h3 className="text-spiritual-300 text-sm uppercase tracking-wider mb-4">Habitudes</h3>
              <p className="text-3xl font-bold mb-4 text-spiritual-200">{getHabitPercentage()}%</p>
              <div className="w-full bg-spiritual-900/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${getHabitPercentage()}%` }}
                />
              </div>
            </div>

            <div className="bg-spiritual-800/40 border border-spiritual-500/50 rounded-xl p-6">
              <h3 className="text-spiritual-300 text-sm uppercase tracking-wider mb-4">Aujourd'hui</h3>
              <p className="text-3xl font-bold mb-4 text-spiritual-200">{completedToday}/{habitsList.length}</p>
              <div className="w-full bg-spiritual-900/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${(completedToday / habitsList.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-spiritual-800/30 border border-spiritual-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-spiritual-300 mb-6">Habitudes Quotidiennes - {today}</h3>
            <div className="space-y-3">
              {habitsList.map((habit) => {
                const isCompleted = todayStats?.habits.find(h => h.habit === habit)?.completed || false
                return (
                  <label key={habit} className="flex items-center gap-3 p-3 bg-spiritual-700/30 rounded-lg hover:bg-spiritual-700/50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleHabit(habit)}
                      className="w-5 h-5"
                    />
                    <span className={`text-spiritual-200 ${isCompleted ? 'line-through opacity-60' : ''}`}>{habit}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {dayStats.length > 1 && (
            <div className="bg-spiritual-800/30 border border-spiritual-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-spiritual-300 mb-6">Historique ({dayStats.length} jours)</h3>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {dayStats.slice(-7).reverse().map(day => {
                  const completed = day.habits.filter(h => h.completed).length
                  const percentage = (completed / habitsList.length) * 100
                  return (
                    <div key={day.date} className="text-center">
                      <div className="bg-spiritual-700/30 rounded-lg p-2 mb-2 h-16 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-spiritual-300">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                      <p className="text-xs text-spiritual-400">{day.date}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ============= SALOMON IA =============
  const SolomonPage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto flex flex-col h-full space-y-8">
        <h2 className="text-4xl font-bold text-spiritual-300">✨ Salomon - IA Spirituelle</h2>

        <div className="flex-1 bg-spiritual-900/40 border border-spiritual-500/30 rounded-xl p-6 overflow-y-auto space-y-4">
          {solomonChat.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xl rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-spiritual-600/40 border border-spiritual-400/50'
                    : 'bg-sacred-700/40 border border-sacred-400/50'
                }`}
              >
                <p className="text-spiritual-200">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={solomonInput}
            onChange={(e) => setSolomonInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSolomonSend()}
            placeholder="Posez votre question spirituelle..."
            className="flex-1 bg-spiritual-900/50 border border-spiritual-500/30 rounded-lg px-4 py-2 text-spiritual-200 placeholder-spiritual-400/50 focus:outline-none focus:border-spiritual-400"
          />
          <button
            onClick={handleSolomonSend}
            className="bg-spiritual-600 hover:bg-spiritual-500 px-6 py-2 rounded-lg transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )

  // ============= RAPPELS =============
  const RemindersPage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold text-spiritual-300">🔔 Rappels & Alarmes</h2>

        <div className="space-y-4">
          {reminders.map(reminder => (
            <div key={reminder.id} className="bg-spiritual-800/40 border border-spiritual-500/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className={reminder.enabled ? 'text-spiritual-400' : 'text-spiritual-600'} size={24} />
                <div>
                  <p className="font-bold text-spiritual-300">{reminder.title}</p>
                  <p className="text-spiritual-400 text-sm">{reminder.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => toggleReminder(reminder.id)}
                    className="w-5 h-5"
                  />
                </label>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddReminder ? (
          <div className="bg-spiritual-800/40 border border-spiritual-500/50 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-spiritual-300">Ajouter un rappel</h3>
            <input
              type="text"
              value={newReminderTitle}
              onChange={(e) => setNewReminderTitle(e.target.value)}
              placeholder="Titre du rappel..."
              className="w-full bg-spiritual-900/50 border border-spiritual-500/30 rounded-lg px-4 py-2 text-spiritual-200 placeholder-spiritual-400/50 focus:outline-none focus:border-spiritual-400"
            />
            <input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="w-full bg-spiritual-900/50 border border-spiritual-500/30 rounded-lg px-4 py-2 text-spiritual-200 focus:outline-none focus:border-spiritual-400"
            />
            <div className="flex gap-2">
              <button
                onClick={addReminder}
                className="flex-1 bg-spiritual-600 hover:bg-spiritual-500 px-6 py-2 rounded-lg transition"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddReminder(false)}
                className="flex-1 bg-spiritual-800/50 hover:bg-spiritual-800/70 px-6 py-2 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddReminder(true)}
            className="w-full bg-spiritual-700/40 border border-spiritual-500/50 hover:border-spiritual-400 rounded-lg p-6 transition flex items-center justify-center gap-2 text-spiritual-300"
          >
            <Plus size={24} /> Ajouter un rappel
          </button>
        )}
      </div>
    </div>
  )

  // ============= RENDU PRINCIPAL =============
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
      case 'solomon':
        return <SolomonPage />
      case 'reminders':
        return <RemindersPage />
      case 'program':
        return <ProgramPage />
      default:
        return <HomePage />
    }
  }

  // ============= PROGRAMME / PDF =============
  const ProgramPage = () => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold text-spiritual-300">📋 Plan Spirituel</h2>
        
        <div className="space-y-6">
          {[
            {
              titre: 'Semaine 1',
              soustitre: 'Le pardon et la purification viennent de Toi Seigneur',
              versets: ['Ésaïe 1:1-20', 'Jérémie 4:14', 'Jacques 4:8', '2 Corinthiens 7:1', 'Psaume 51', '1 Jean 1:7-9'],
              requetes: [
                'Confession sincère et humiliation devant Dieu',
                'Demander la purification intérieure - Jérémie 4:14',
                'Se dépouiller du vieil homme - Éphésiens 4:22-24',
                'Retrouver la sensibilité spirituelle'
              ]
            },
            {
              titre: 'Semaine 2',
              soustitre: 'Recevoir par la foi la délivrance complète',
              versets: ['Hébreux 9:12-14', 'Hébreux 9:25-28', 'Hébreux 2:14-15', '1 Jean 3:8-9', 'Romains 6', 'Psaume 56:13', 'Galates 5:24'],
              requetes: [
                'Croire à la puissance du sang de Jésus - Hébreux 9:12-14',
                'Recevoir la destruction des œuvres du diable - 1 Jean 3:8',
                'Être délivré de la servitude du péché - Hébreux 2:14-15',
                'Marcher désormais dans la lumière - Psaume 56:13'
              ]
            },
            {
              titre: 'Semaine 3',
              soustitre: 'Être rempli du Saint-Esprit et restaurer une vie spirituelle forte',
              versets: ['Galates 5:16-25', 'Romains 8:1-14', 'Éphésiens 5:18', 'Jean 15:1-7', 'Psaume 119:9-11'],
              requetes: [
                'Seigneur, remplis-moi du Saint-Esprit chaque jour',
                'Apprends-moi à marcher selon l\'Esprit',
                'Que la Parole de Dieu prenne une grande place dans ma vie',
                'Donne-moi une discipline spirituelle stable'
              ]
            },
            {
              titre: 'Semaine 4',
              soustitre: 'Marcher dans la sainteté et devenir stable spirituellement',
              versets: ['1 Thessaloniciens 4:3-8', 'Hébreux 12:14', '2 Timothée 2:20-22', 'Job 31:1', 'Proverbes 4:23'],
              requetes: [
                'Seigneur, établis-moi dans la sainteté durable',
                'Donne-moi la vigilance spirituelle',
                'Aide-moi à fuir les occasions de chute',
                'Que ma communion avec Dieu devienne ma priorité'
              ]
            }
          ].map((semaine, idx) => (
            <div key={idx} className="bg-gradient-to-br from-spiritual-800/40 to-spiritual-900/40 border border-spiritual-500/50 rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-spiritual-300 mb-2">{semaine.titre}</h3>
                <p className="text-spiritual-200 italic text-lg">"{semaine.soustitre}"</p>
              </div>
              
              <div>
                <h4 className="text-spiritual-300 font-bold mb-3">📖 Versets à étudier:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {semaine.versets.map((verset, i) => (
                    <div key={i} className="bg-spiritual-700/30 border border-spiritual-500/30 rounded-lg p-3">
                      <p className="text-spiritual-200 text-sm">{verset}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-spiritual-300 font-bold mb-3">🙏 Points de prière:</h4>
                <ul className="space-y-2">
                  {semaine.requetes.map((req, i) => (
                    <li key={i} className="flex gap-3 text-spiritual-200">
                      <span className="text-spiritual-400">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-sacred-700/40 to-sacred-900/40 border border-sacred-500/50 rounded-xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-sacred-200">✨ Accompagnement Spirituel</h3>
          <p className="text-sacred-100 text-lg">Plan établi avec le Pasteur Eustach</p>
          <p className="text-sacred-200">Durée: 4 semaines de transformation spirituelle guidée bibliquement</p>
        </div>
      </div>
    </div>
  )

  const navItems = [
    { icon: Home, label: 'Accueil', id: 'home' },
    { icon: Flame, label: 'Combat', id: 'combat' },
    { icon: BookOpen, label: 'Bible', id: 'bible' },
    { icon: PenTool, label: 'Journal', id: 'journal' },
    { icon: BarChart3, label: 'Tableau', id: 'dashboard' },
    { icon: Sparkles, label: 'Salomon', id: 'solomon' },
    { icon: Bell, label: 'Rappels', id: 'reminders' },
    { icon: BookOpen, label: 'Plan', id: 'program' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-spiritual-950 via-spiritual-900 to-sacred-950 overflow-hidden">
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-spiritual-950/80 backdrop-blur-sm border-r border-spiritual-600/30 transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-spiritual-600/30 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Sparkles className="text-spiritual-400" size={24} />
              <span className="font-bold text-spiritual-300 text-sm">Nouvelle</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-spiritual-400 hover:text-spiritual-300 transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'bg-spiritual-600/50 border border-spiritual-400/50 text-spiritual-300'
                  : 'text-spiritual-400 hover:bg-spiritual-800/50'
              }`}
              title={item.label}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-spiritual-600/30 text-center text-xs text-spiritual-400">
          {sidebarOpen && <p>Jours: {purityDays}</p>}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </div>

      {/* Verse Popup Modal */}
      {showVersePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-spiritual-800 to-spiritual-900 border-2 border-spiritual-400 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-spiritual-500/50 animate-fadeIn">
            <div className="text-center space-y-6">
              <h3 className="text-3xl">✨</h3>
              <p className="text-lg text-spiritual-200 italic leading-relaxed">
                "{selectedVersePopup}"
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowVersePopup(false)}
                  className="flex-1 bg-spiritual-600 hover:bg-spiritual-500 px-6 py-2 rounded-lg transition"
                >
                  Fermer
                </button>
                <button
                  onClick={getRandomVerse}
                  className="flex-1 bg-spiritual-700 hover:bg-spiritual-600 px-6 py-2 rounded-lg transition"
                >
                  Autre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
