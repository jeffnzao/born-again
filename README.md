# Nouvelle Création - Monorepo Architecture

## Structure

```
nouvelle-creation/
├── apps/
│   ├── web/          # Next.js web app (Vercel)
│   └── desktop/      # Electron desktop app
├── package.json      # Root workspace
└── README.md
```

## Development

### Web App
```bash
npm run dev:web
```

### Desktop App
```bash
npm run dev:desktop
```

## Build

### Web Build (Vercel)
```bash
npm run build:web
```

### Desktop Build (Windows EXE)
```bash
npm run build:desktop
```

## Environment Variables

### apps/web/.env.local
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Deployment

### Vercel (Web)
- Auto-deploys from `apps/web`
- Vercel config: `.vercelignore` excludes desktop files

### Windows (Desktop)
- Build: `npm run build:desktop`
- Output: `apps/desktop/release/*.exe`

### 5. **📊 Tableau de Bord**
- Statistiques de pureté, prière, lecture biblique
- Barres de progression animées
- Habitudes quotidiennes à cocher
- Vue synthétique de la semaine

### 6. **✨ Salomon - IA Spirituelle**
- Conseiller spirituel intelligent
- Réponses bibliques contextuelles
- Interface de chat conversationnel
- Conseils basés sur les Écritures

### 7. **🔔 Rappels & Alarmes**
- Alarmes configurables pour prière, lecture biblique, méditation
- Notifications système
- Activation/désactivation des rappels
- Horaires personnalisables

## 🎨 Design & Technologie

### Stack Technologique
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS avec thème spirituel personnalisé
- **Desktop**: Electron 27
- **Build**: Vite + Electron Builder
- **Icons**: Lucide React

### Palette de Couleurs
- **Couleurs Spirituelles**: Violet, bleu profond, or sacré
- **Animations**: Respiration, lueur, transitions lisses
- **Thème**: Mode sombre immersif et méditatif

## 🚀 Installation & Lancement

### 1. Installation des dépendances
```bash
npm install
```

### 2. Mode Développement (Web)
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### 3. Mode Développement (Electron)
Dans un premier terminal:
```bash
npm run dev
```

Dans un deuxième terminal:
```bash
npm run electron-dev
```

### 4. Les deux simultanément
```bash
npm run dev:all
```

## 📦 Build & Distribution

### Build pour Web
```bash
npm run build:web
```

### Build EXE Windows (avec Electron)
```bash
npm run build
```

Cela génère:
- `release/NouvelleCreation-1.0.0.exe` (Installeur NSIS)
- `release/NouvelleCreation-1.0.0-portable.exe` (Portable)

### Build uniquement Electron
```bash
npm run electron-build
```

## 📁 Structure du Projet

```
nouvelle-creation/
├── src/
│   ├── main.tsx          # Point d'entrée React
│   ├── App.tsx           # Composant principal (7 modules)
│   └── index.css         # Styles Tailwind
├── electron/
│   ├── main.ts           # Processus principal Electron
│   └── preload.ts        # Bridge sécurisé IPC
├── public/
│   └── icon.png          # Icône application (256x256)
├── package.json          # Dépendances & scripts
├── tsconfig.json         # Configuration TypeScript
├── vite.config.ts        # Configuration Vite
├── tailwind.config.js    # Configuration Tailwind
├── postcss.config.js     # Configuration PostCSS
└── index.html            # HTML racine
```

## 🔧 Configuration de Build (Electron Builder)

### Pour personnaliser le build Windows:

1. **Icône**: Remplacez `public/icon.png` (256x256)
2. **Nom**: Modifiez `productName` dans `package.json`
3. **Certificat**: Pour signer l'EXE, configurez dans `package.json`:
   ```json
   "win": {
     "certificateFile": "chemin/vers/cert.pfx",
     "certificatePassword": "password"
   }
   ```

## 💾 Persistance des Données

L'application utilise `electron-store` pour sauvegarder:
- Entrées de journal
- Paramètres de rappels
- Compteur de pureté
- Préférences utilisateur

**Stockage local**: `%APPDATA%/Nouvelle Création/User Data/`

## 🛠️ Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev server web (Vite) sur port 5173 |
| `npm run build:web` | Build web uniquement |
| `npm run build` | Build EXE complet (web + Electron) |
| `npm run electron-dev` | Lance Electron en dev |
| `npm run dev:all` | Dev web + Electron simultanément |
| `npm run preview` | Prévisualise le build web |
| `npm run electron-build` | Build Electron uniquement |

## 📝 Notes de Développement

- L'application utilise IPC Electron pour les notifications système
- Les données sont persistantes entre les sessions
- Le thème est chargé au démarrage
- Support complet TypeScript

## 🎯 Fonctionnalités Futures Possibles

- [ ] Synchronisation cloud Firebase
- [ ] Statistiques avancées et graphiques
- [ ] Partage de prières avec communauté
- [ ] Notifications mobiles
- [ ] Mode sombre/clair configurable
- [ ] Support multilingue (FR/EN/ES)
- [ ] Export PDF des journaux

## 📄 License

Libre d'utilisation à titre personnel et communautaire.

## 🙏 Crédits

Application construite avec amour pour la croissance spirituelle et le combat pour la pureté.

---

**Nouvelle Création** - Votre compagnon spirituel de pureté et de victoire en Christ.
