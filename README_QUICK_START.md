# ✨ Nouvelle Création

**Marcher par l'Esprit et non selon la chair**

Une application chrétienne moderne et professionnelle pour la transformation spirituelle, la sanctification et la marche avec Dieu.

## 🚀 Démarrage Rapide

### Installation (5 min)

```bash
# 1. Installer les dépendances
npm install

# 2. Aller dans le dossier desktop
cd apps/desktop

# 3. Lancer l'application en développement
npm run dev

# Ouvrir: http://localhost:5173/
```

### Lancer avec Electron (Application native)

```bash
cd apps/desktop
npm run dev:all  # Lance web + Electron ensemble
```

### Générer l'EXE Windows (Build Final)

```bash
cd apps/desktop
npm run build

# L'EXE sera dans: apps/desktop/release/
# - NouvelleCreation-1.0.0.exe (Installeur)
# - NouvelleCreation-1.0.0-portable.exe (Portable)
```

---

## 📋 7 Modules de l'Application

### 🏠 **1. Accueil**
- Verset du jour
- Compteur de pureté personnel
- Encouragements spirituels
- Programme hebdomadaire actuel

### 🔥 **2. Combat Spirituel**
- Aide immédiate en cas de tentation
- Respiration guidée (5 minutes)
- Versets puissants pour la victoire
- Prière de combat
- Musique worship

### 📖 **3. Méditation Biblique**
- 36+ versets bibliques
- 6 thèmes: Pureté, Sanctification, Délivrance, Saint-Esprit, Identité, Victoire
- Favoris et marquage
- Copie facile

### 📝 **4. Journal Spirituel**
- Entrée quotidienne avec humeur (😊 - 😞)
- Sauvegarde automatique
- Historique personnel
- Persistance locale

### 📊 **5. Dashboard**
- Statistiques spirituelles en temps réel
- Progression hebdomadaire
- Objectifs et défis
- Graphiques interactifs

### 🤖 **6. Salomon - Conseiller IA**
- Chatbot spirituel bienveillant
- Réponses bibliques
- Encouragements personnalisés
- Conseils pour la sanctification

### ⏰ **7. Rappels Spirituels**
- Prière matin/midi/soir
- Lecture biblique
- Jeûne (vendredi)
- Adoration et méditation
- Notifications personnalisées

---

## 🎨 Design & Technologie

**Stack Technologique:**
- ⚛️ React 18 + TypeScript
- 🖥️ Electron 27 (Desktop)
- 🎨 Tailwind CSS (Design)
- ⚡ Vite (Build)
- 🏪 Zustand (State)

**Interface:**
- 🌙 Thème sombre élégant
- 📱 Minimaliste et intuitif
- ✨ Animations fluides
- 🎯 Focus spirituel

---

## 📂 Structure du Projet

```
nouvelle-creation/
├── apps/
│   └── desktop/
│       ├── src/
│       │   ├── App.tsx              # App principale (7 modules)
│       │   ├── components/          # Composants
│       │   ├── hooks/               # React hooks
│       │   ├── store/               # Zustand store
│       │   ├── data/                # Données bibliques
│       │   └── utils/               # Utilitaires
│       ├── electron/
│       │   ├── main.ts              # Electron main
│       │   └── preload.ts           # Preload script
│       ├── public/                  # Assets
│       ├── dist/                    # Web build
│       ├── dist-electron/           # Electron build
│       ├── release/                 # EXE final
│       └── package.json
├── BUILD_GUIDE.md                   # Guide détaillé de build
└── README.md                        # Ce fichier
```

---

## 💾 Persistance des Données

L'application sauvegarde automatiquement dans `localStorage`:
- ✅ Entrées du journal
- ✅ Compteur de pureté
- ✅ Historique chat (Salomon)
- ✅ Rappels configurés
- ✅ Statistiques
- ✅ Préférences utilisateur

**Aucune dépendance réseau requise** - Fonctionne hors ligne!

---

## 📝 Programme d'8 Semaines

L'application inclut le **Programme de Restauration Spirituelle** du Pasteur Eustache G.:

**Cycle (8 semaines × 2):**
1. Le pardon et la purification
2. La délivrance complète
3. Être rempli du Saint-Esprit
4. Marcher dans la sainteté

**Ressources:**
- 📄 [Télécharger le PDF complet](./apps/desktop/public/programme-spirituel-8semaines.pdf)
- 🕯️ Versets bibliques pour chaque semaine
- ✅ Checklist quotidienne
- 📊 Suivi de progression

---

## 🔧 Commandes Disponibles

```bash
# Development
npm run dev                  # Web dev server
npm run dev:all            # Web + Electron
npm run dev:web            # Next.js web app

# Build
npm run build              # Build EXE final
npm run build:web          # Build web seulement
npm run build:desktop      # Build Electron seulement

# Preview
npm run preview            # Prévisualiser build web
```

---

## 🐛 Dépannage

### L'app web ne charge pas?
```bash
# Vérifiez que le port 5173 est libre
cd apps/desktop
npm run dev
# Ouvrez http://localhost:5173
```

### Electron ne s'ouvre pas?
```bash
# Redémarrez les deux processus
cd apps/desktop
npm run dev:all
```

### Les modifications ne s'appliquent pas?
```bash
# En Electron: Appuyez sur Ctrl+R pour recharger
# En web: F5 pour recharger
```

### Problème de dépendances?
```bash
# Réinstallez tout
rm -r node_modules apps/*/node_modules
npm install
cd apps/desktop && npm install
```

---

## 📦 Distribution

### Pour distribuer à d'autres:

1. **Générer l'EXE:**
   ```bash
   cd apps/desktop
   npm run build
   ```

2. **Fichiers à distribuer:**
   - `release/NouvelleCreation-1.0.0.exe` (Installeur complet)
   - `release/NouvelleCreation-1.0.0-portable.exe` (Sans installation)

3. **Instructions utilisateur:**
   - Télécharger l'EXE
   - Double-cliquer et suivre l'installation
   - L'app se lance automatiquement
   - Les données se sauvegardent automatiquement

---

## 🎯 Objectif Spirituel

> "Marchez par l'Esprit, et vous n'accomplirez pas les désirs de la chair." - Galates 5:16

Cette application est conçue pour aider les croyants à:

✨ **Construire une nouvelle vie** en Christ  
🙏 **Développer la discipline spirituelle**  
📖 **S'enraciner dans la Parole de Dieu**  
💪 **Vaincre les pièges du péché**  
🕯️ **Marcher dans la sainteté**  
❤️ **Grandir dans l'amour de Dieu**  
🌟 **Devenir une nouvelle création**

---

## 📞 Support

Pour plus d'informations:
- 📖 Consultez [BUILD_GUIDE.md](./BUILD_GUIDE.md)
- 💬 Lisez les commentaires du code
- 🔍 Explorez les fichiers dans `src/data/`

---

## ✨ Crédits

**Inspiré par:**
- Programme du Pasteur Eustache G.
- Enseignements bibliques chrétiens
- Communauté des croyants

**Technologie:**
- React & TypeScript
- Electron & Vite
- Tailwind CSS
- Open source ecosystem

---

## 🙏 Bénédictions

> "Si je suis tombé, je me relèverai; l'Éternel sera ma lumière." - Michée 7:8

Que cette application vous accompagne dans votre marche spirituelle!

---

**Nouvelle Création - Vers une vie transformée en Christ** 🌟
