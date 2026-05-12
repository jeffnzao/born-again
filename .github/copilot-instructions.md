# Nouvelle Création - Nouvelles Instructions Copilot

## Vue d'ensemble du projet

Nouvelle Création est une **application spirituelle complète** construite avec **React + Electron** pour Windows. Elle offre un combat spirituel guidé bibliquement avec 7 modules interactifs (Bible, Journal, Combat, IA Salomon, etc.).

**Stack**: React 18 | TypeScript | Tailwind CSS | Electron 27 | Vite

## Configuration du projet

### Structure de dossiers
```
nouvelle-creation/
├── src/              # Code React (components, styles)
├── electron/         # Processus principal Electron + IPC
├── public/           # Assets (icônes)
├── dist/             # Build web (généré)
├── dist-electron/    # Build Electron (généré)
├── release/          # EXE final (généré après npm run build)
```

### Installation
1. `npm install` - Installe toutes les dépendances
2. Optionnel: `npm run dev` pour tester le web

## Commandes principales

| Commande | Utilité |
|----------|---------|
| `npm run dev` | Dev web local (Vite, port 5173) |
| `npm run dev:all` | Web + Electron simultan avec concurrently |
| `npm run build` | Génère EXE Windows final |
| `npm run build:web` | Génère seulement le build web |

## Architecture

### Frontend (src/)
- **App.tsx**: Composant principal avec 7 modules (Accueil, Combat, Bible, Journal, Dashboard, Salomon, Rappels)
- **main.tsx**: Point d'entrée React
- **index.css**: Styles Tailwind CSS globaux

### Backend (electron/)
- **main.ts**: Crée la fenêtre Electron, gère les IPC pour notifications
- **preload.ts**: Bridge sécurisé pour communiquer avec le rendu

### Configuration
- **vite.config.ts**: Bundler web
- **tsconfig.json**: Configuration TypeScript
- **tailwind.config.js**: Thème spirituel (couleurs, animations)
- **package.json**: Scripts de build + electron-builder config

## Particularités du design

- **Thème spirituel**: Couleurs violettes/or sacré avec animations (respiration, lueur)
- **7 modules complets**: Chacun avec interface immersi ve et données persistantes
- **IPC Electron**: Communications sécurisées pour notifications système
- **Données persistantes**: Journal, rappels, compteur sauvegardés localement

## Pour générer l'EXE Windows

```bash
npm run build
```

Cela:
1. Compile TypeScript (`tsc`)
2. Construit le web avec Vite (`vite build` → `dist/`)
3. Lance Electron Builder → génère `release/*.exe`

**Résultat final**: 
- `release/NouvelleCreation-1.0.0.exe` (Installeur)
- `release/NouvelleCreation-1.0.0-portable.exe` (Portable)

## Personnalisation

### Ajouter un module
1. Créer une fonction composant dans `src/App.tsx` (ex: `NewPage()`)
2. Ajouter à `navItems[]` en bas
3. Ajouter le cas dans `renderPage()`

### Modifier le thème
- **Couleurs**: `tailwind.config.js` → section `theme.extend.colors`
- **Animations**: `tailwind.config.js` → section `keyframes`

### Changer l'icône
- Remplacer `public/icon.png` (256x256 minimum)
- Rebuild avec `npm run build`

## Bonnes pratiques

- ✅ Utiliser `window.electronAPI.*` pour les IPC
- ✅ Garder la logique de données côté App (state)
- ✅ Utiliser Tailwind pour tous les styles
- ✅ Tester en `npm run dev:all` avant de build
- ❌ Ne pas modifier `electron/preload.ts` sans raison de sécurité

## Support et dépannage

**Application ne s'ouvre pas?**
- Vérifier que Vite tourne sur port 5173 (`npm run dev`)
- Check les logs Electron (F12 en dev)

**Build EXE échoue?**
- `npm install` pour rafraîchir dépendances
- Supprimer `node_modules` et `dist*` puis réinstaller

**Modification pas appliquée?**
- Recharger l'app Electron (Ctrl+R ou Cmd+R)
- En dev, elle devrait hot-reload automatiquement

## Prochaines étapes

1. Tester `npm run dev:all` en local
2. Ajouter plus de versets bibliques si désiré
3. Personnaliser l'icône
4. `npm run build` pour générer EXE final

---

**L'application est prête à être distribuée comme EXE Windows!**
