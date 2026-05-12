# 🚀 NOUVELLE CRÉATION 2.0 - Architecture & Setup

## Vue d'ensemble

Nouvelle Création 2.0 est une **plateforme spirituelle cloud-native** construite avec:

- **Frontend**: Next.js 15 (React 19, TypeScript 5)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS avec thème spirituel personnalisé
- **Deployment**: Vercel (frontend) + Firebase (backend)

## Structure du Projet

```
nouvelle-creation-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Pages d'authentification
│   │   ├── (dashboard)/       # Pages de l'app
│   │   ├── api/               # Routes API
│   │   ├── layout.tsx         # Layout racine
│   │   ├── globals.css        # Styles globaux
│   │   └── providers.tsx      # Providers (React Query, etc)
│   ├── components/            # Composants réutilisables
│   │   ├── layout/           # Layout components
│   │   ├── journal/          # Composants journal
│   │   ├── program/          # Composants programme
│   │   └── ui/               # Composants UI primitifs
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts        # Auth hook avec Firebase
│   │   └── useJournal.ts     # Journal hook avec sync cloud
│   ├── lib/                   # Utilitaires et configs
│   │   ├── firebase.ts       # Configuration Firebase
│   │   └── constants.ts      # Constantes
│   ├── store/                 # Zustand stores
│   │   └── appStore.ts       # Store principal
│   └── types/                 # Types TypeScript
│       └── index.ts          # Types principaux
├── public/                    # Assets statiques
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.example
└── README.md
```

## Configuration Firebase

### 1. Créer un projet Firebase

1. Aller à [Firebase Console](https://console.firebase.google.com)
2. Créer un nouveau projet: "Nouvelle Création"
3. Activer les services:
   - Authentication (Email + Google)
   - Firestore Database
   - Storage

### 2. Récupérer les clés

1. Aller à Settings → Project settings
2. Copier la config Firebase
3. Créer `.env.local` et ajouter les variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Configurer Firestore

Créer les collections avec les documents de tests:

```
Collections:
├── users/
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       ├── role: 'admin' | 'pastor' | 'mentor' | 'user'
│       ├── profileImage: string (optional)
│       ├── church: string (optional)
│       ├── mentorId: string (optional)
│       └── createdAt: timestamp
│
├── journal_entries/
│   └── {entryId}/
│       ├── userId: string (reference to users)
│       ├── date: string
│       ├── mood: 'joyful' | 'peaceful' | 'struggling' | 'victorious'
│       ├── content: string
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       └── syncedAt: timestamp
│
├── spiritual_program/
│   └── {weekId}/
│       ├── week: number
│       ├── title: string
│       ├── description: string
│       ├── verses: array[string]
│       ├── prayers: array[string]
│       └── createdAt: timestamp
│
└── pastoral_notes/
    └── {noteId}/
        ├── pastorId: string
        ├── menteeId: string
        ├── content: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

## Installation & Démarrage

```bash
# 1. Cloner et installer
git clone <repo>
cd nouvelle-creation-next
npm install

# 2. Configurer les variables d'env
cp .env.example .env.local
# Éditer .env.local avec vos clés Firebase

# 3. Démarrer le dev server
npm run dev

# 4. Ouvrir http://localhost:3000
```

## Architecture des Features

### Journal Spirituel

**Fichiers**:
- `src/hooks/useJournal.ts` - Hook avec auto-save
- `src/components/journal/JournalEditor.tsx` - Éditeur
- `src/app/(dashboard)/journal/page.tsx` - Page

**Fonctionnalités**:
- ✅ Texte multi-ligne
- ✅ Curseur persistant (pas de focus loss)
- ✅ Auto-save debounce (3s)
- ✅ Sync bidirectionnel Firestore
- ✅ Offline support (IndexedDB)
- ✅ Mood tracking
- ✅ Historique avec dates

**Flow**:
1. User tape → debounce 3s
2. Auto-save vers Firestore
3. Real-time sync via onSnapshot
4. Optimistic UI updates

### Authentification

**Flow**:
1. User clique "Sign In / Sign Up"
2. Email/Password ou Google Sign-In
3. Firebase Auth crée session
4. Firestore crée user document
5. Zustand store met à jour
6. Redirect dashboard

**Middleware**: À implémenter pour protéger les routes

### Système de Rôles

```
Admin
├── Voir tous les utilisateurs
├── Gérer les pasteurs
└── Voir tous les rapports

Pasteur
├── Voir ses mentorisés
├── Ajouter commentaires
├── Valider objectifs
└── Voir rapports de progression

Mentor
├── Voir le mentorisé
├── Ajouter commentaires
└── Voir journal (si autorisé)

User
└── Accès personnel seulement
```

## State Management (Zustand)

```typescript
useAppStore:
├── Auth
│   ├── user
│   ├── isAuthenticated
│   ├── isLoading
│   ├── setUser()
│   └── logout()
├── Journal
│   ├── journalEntries[]
│   ├── setJournalEntries()
│   ├── addJournalEntry()
│   └── deleteJournalEntry()
└── Settings
    ├── theme ('light' | 'dark')
    ├── notifications
    └── setNotifications()
```

## Data Fetching (React Query)

```typescript
Queries:
├── ['auth'] - Current user
├── ['journal-entries', userId] - User's entries
├── ['program'] - Spiritual program
└── ['pastoral-notes', userId] - Pastoral feedback

Mutations:
├── addJournalEntry
├── updateJournalEntry
├── deleteJournalEntry
└── updateUserProfile
```

## Déploiement Vercel

```bash
# 1. Push sur GitHub
git push origin main

# 2. Créer un projet sur Vercel
# https://vercel.com/new

# 3. Connecter le repo GitHub

# 4. Ajouter variables d'env dans Vercel:
# (Settings → Environment Variables)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# etc...

# 5. Deploy automatique sur chaque push!
```

## Prochaines Étapes

✅ **Semaine 1**: Auth + Journal + Foundation  
⏳ **Semaine 2-3**: Spiritual Program + Dashboard  
⏳ **Semaine 4**: Pastoral Dashboard  
⏳ **Semaine 5**: Premium Features (IA, Mode Urgence)  
⏳ **Semaine 6**: UI/UX Premium avec Framer Motion  
⏳ **Semaine 7**: Testing + Optimisation  
⏳ **Semaine 8**: Launch + Monitoring  

## Support & Documentation

- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
- React Query Docs: https://tanstack.com/query
- Tailwind Docs: https://tailwindcss.com/docs
