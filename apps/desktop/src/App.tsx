import React, { useState } from 'react'
import {
  Home, Flame, BookOpen, PenTool, BarChart3, Sparkles, Bell,
  Menu, X
} from 'lucide-react'

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home'>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-black bg-opacity-50 border-r border-sacred-600 p-4">
          <h1 className="text-2xl font-bold text-sacred-400 mb-8">NC</h1>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <Home size={20} />
              <span>Accueil</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <Flame size={20} />
              <span>Combat</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <BookOpen size={20} />
              <span>Bible</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <PenTool size={20} />
              <span>Journal</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <Sparkles size={20} />
              <span>Salomon</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sacred-600 hover:bg-opacity-20">
              <Bell size={20} />
              <span>Rappels</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-sacred-600 border-opacity-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-sacred-600 hover:bg-opacity-20 rounded-lg">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-2xl font-bold">Nouvelle Création</h2>
          <div></div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-sacred-400">Bienvenue</h1>
            <p className="text-xl text-gray-300">Commencez votre combat spirituel aujourd'hui</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
