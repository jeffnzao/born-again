# 📱 Nouvelle Création - Guide de Build et Lancement

## 🎯 Objectif
Nouvelle Création est une application chrétienne de transformation spirituelle pour Windows, construite avec Electron + React + TypeScript.

L'application aide l'utilisateur à:
- ✨ Marcher par l'Esprit et non selon la chair
- 🙏 Construire une vie de prière et de discipline  
- 📖 Méditer la Parole de Dieu
- 📝 Suivre son journal spirituel
- 💪 Suivre son combat contre l'impureté
- 🤖 Recevoir des conseils de Salomon (IA spirituelle)
- ⏰ Configurer des rappels spirituels

## 📋 Prérequis

- **Node.js** v18+ (avec npm)
- **Windows** 7 ou supérieur
- **Git** (pour cloner le projet)

## 🚀 Installation Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer en développement (Web)
```bash
cd apps/desktop
npm run dev
```

L'application web sera disponible à: **http://localhost:5173/**

### 3. Lancer avec Electron (Application native)
```bash
cd apps/desktop
npm run dev:all
```

Cela lancera simultanément:
- Le serveur Vite (http://localhost:5173)
- L'application Electron (fenêtre native)

## 🏗️ Build - Générer l'EXE Windows

### Générer l'EXE prêt à distribuer
```bash
cd apps/desktop
npm run build
```

**Résultat final:**
- `release/NouvelleCreation-1.0.0.exe` - Installeur
- `release/NouvelleCreation-1.0.0-portable.exe` - Version portable (sans installation)

L'EXE final sera dans le dossier `release/`

### Détails du processus de build:
1. **TypeScript Compilation** - Compile tout le code TS
2. **Vite Build** - Bundle le React + CSS
3. **Electron Builder** - Crée les exécutables Windows

## 📦 Structure du Projet

```
apps/desktop/
├── src/
│   ├── App.tsx              # Composant principal (7 modules)
│   ├── main.tsx             # Point d'entrée React
│   ├── index.css            # Styles Tailwind
│   ├── components/          # Composants réutilisables
│   ├── hooks/               # React hooks personnalisés
│   ├── store/               # Zustand store (persistance)
│   ├── data/                # Données bibliques
│   ├── types/               # Types TypeScript
│   └── utils/               # Fonctions utilitaires
├── electron/
│   ├── main.ts              # Processus principal Electron
│   ├── preload.ts           # Bridge de sécurité
│   └── ...
├── public/                  # Assets (icônes, images)
├── dist/                    # Build web (généré)
├── dist-electron/           # Build Electron (généré)
├── release/                 # EXE final (généré)
└── package.json             # Dépendances et scripts
```

## 🎨 7 Modules de l'Application

### 1️⃣ **Accueil**
- Affichage du verset du jour
- Compteur de pureté
- Encouragements spirituels
- Programme de la semaine

### 2️⃣ **Combat Spirituel** 🔥
- Bouton urgence tentation
- Respiration guidée (5 min)
- Versets puissants pour la victoire
- Prière de combat
- Musique worship

### 3️⃣ **Méditation Biblique** 📖
- 6 thèmes spirituels (Pureté, Sanctification, Délivrance, Saint-Esprit, Identité, Victoire)
- 36+ versets bibliques
- Favoris et marquage
- Copie facile des versets

### 4️⃣ **Journal Spirituel** 📝
- Entrée quotidienne avec humeur (😊 - 😞)
- Sauvegarde automatique
- Historique avec affichage des dernières entrées
- Persistance locale

### 5️⃣ **Dashboard Statistiques** 📊
- Jours de pureté
- Minutes de prière
- Lectures bibliques
- Victoires de la semaine
- Progression hebdomadaire
- Objectifs spirituels

### 6️⃣ **Salomon - IA Spirituelle** 🤖
- Chatbot sage et bienvveillant
- Réponses bibliques
- Encouragements personnalisés
- Suggestions spirituelles

### 7️⃣ **Rappels Spirituels** ⏰
- Créer des rappels pour:
  - Prière matin/midi/soir
  - Lecture biblique
  - Jeûne (vendredi)
  - Adoration
  - Méditation
- Son optionnel
- Activation/Désactivation

## 🎨 Design & Esthétique

**Thème Spirituel:**
- Couleurs: Noir profond, bleu nuit, or doux, blanc cassé, violet
- Animations fluides (respiration, lueur, fade-in)
- Mode sombre uniquement (plus reposant pour les yeux)
- Interface minimaliste et inspirante

**Performance:**
- Navigation ultra-rapide
- Persistance locale (localStorage)
- Aucune dépendance réseau requise (offline mode)

## 💾 Stockage & Persistance

L'application sauvegarde automatiquement:
- ✅ Entrées du journal
- ✅ Compteur de pureté
- ✅ Historique du chat (Salomon)
- ✅ Rappels configurés
- ✅ Thème utilisateur
- ✅ Toutes les statistiques

**Emplacement**: `localStorage` du navigateur (synchronisé automatiquement)

## 🔧 Configuration Avancée

### Modifier le programme (8 semaines)
Fichier: `src/data/spiritualData.ts`

Modifiez `weekProgrammes` pour adapter le programme à vos besoins.

### Ajouter des versets bibliques
Fichier: `src/data/spiritualData.ts`

Ajoutez à `biblicalVerses[theme]` pour ajouter de nouveaux versets.

### Personnaliser les couleurs
Fichier: `tailwind.config.ts`

Modifiez la palette `colors.sacred` pour adapter le design.

## 📝 Programme d'8 Semaines

L'application inclut le **Programme de Restauration Spirituelle du Pasteur Eustache G.:**

**Semaines 1-4 & 5-8 (cycle de répétition):**
- **S1-S5**: Le pardon et la purification
- **S2-S6**: La délivrance complète  
- **S3-S7**: Être rempli du Saint-Esprit
- **S4-S8**: Marcher dans la sainteté

📄 **Télécharger le PDF complet**: [Programme de Restauration Spirituelle](./public/programme-spirituel-8semaines.pdf)

Chaque jour inclut:
- ✅ Sanctification
- ✅ Prière du soir
- ✅ Victoire sur le péché
- 🔔 Vendredi = Jeûne & Prière

## 🖼️ Captures d'écran

| Page | Description |
|------|-------------|
| **Accueil** | Verset du jour, compteur pureté, encouragements |
| **Combat** | Ressources d'urgence, respiration, prière |
| **Bible** | Versets thématiques, favoris |
| **Journal** | Entrées quotidiennes avec mood |
| **Dashboard** | Statistiques et progression |
| **Salomon** | Chat avec IA spirituelle |
| **Rappels** | Gestion des notifications |

## 🐛 Dépannage

### "Module not found" error
```bash
npm install
cd apps/desktop
npm install
```

### Application Electron ne s'ouvre pas
```bash
# Assurez-vous que le serveur Vite est actif
cd apps/desktop
npm run dev

# Dans un autre terminal
npm run electron-dev
```

### Port 5173 déjà utilisé
```bash
# Changez le port dans vite.config.ts
# ou tuez le processus
lsof -ti:5173 | xargs kill -9
```

### Les changements ne se reflètent pas
```bash
# Recharger l'app Electron (Ctrl+R ou Cmd+R)
# ou redémarrer le dev server
```

## 📦 Dépendances Principales

| Package | Utilité |
|---------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Electron 27** | Desktop app |
| **Vite** | Build tool |
| **Zustand** | State management |
| **Lucide Icons** | Icons |

## 🚢 Déploiement

### Pour distribuer l'application:

1. **Générer l'EXE:**
   ```bash
   npm run build
   ```

2. **Tester l'installeur:**
   - Double-cliquez sur `release/NouvelleCreation-1.0.0.exe`
   - Suivez l'assistant d'installation
   - L'app s'installe dans Program Files

3. **Version Portable:**
   - Utilisez `NouvelleCreation-1.0.0-portable.exe`
   - Pas d'installation requise
   - Exécutable directement depuis une clé USB

### Mise à jour (futur):
- Configurer `electron-updater` pour les mises à jour automatiques
- Héberger les releases sur un serveur

## 📱 Compatibilité

- ✅ Windows 7, 8, 10, 11
- ✅ Electron 27+ (compatible avec nouvelles versions de Node)
- ✅ Mode offline (aucune dépendance réseau)

## 🆘 Support & Contribution

Pour des issues ou améliorations:
1. Vérifiez les logs (F12 en développement)
2. Consultez ce guide de dépannage
3. Vérifiez que toutes les dépendances sont installées

## ✨ Fonctionnalités Futures

- 📊 Export PDF du journal spirituel
- 🌐 Synchronisation cloud (Firebase)
- 🔔 Notifications système native
- 🎵 Playlist worship intégrée
- 📱 Application Android (Flutter/React Native)
- 🤖 IA Salomon plus avancée (API OpenAI)

## 📜 Licence & Crédits

Inspiré du programme du **Pasteur Eustache G.**

> "Marche par l'Esprit et tu n'accompliras pas les désirs de la chair." - Galates 5:16

---

**Bonne marche spirituelle! 🙏**

*Nouvelle Création - Vers une vie transformée en Christ*
