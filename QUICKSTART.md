# ⚡ Démarrage Rapide - Nouvelle Création

## 🚀 Lancements en 3 étapes

### 1️⃣ Installation
```bash
npm install
```

### 2️⃣ Développement (Web)
```bash
npm run dev
```
Puis ouvrez `http://localhost:5173` dans votre navigateur.

### 3️⃣ Développement (Electron Desktop)
Lancez dans **deux terminaux différents**:

**Terminal 1** - Serveur web:
```bash
npm run dev
```

**Terminal 2** - App Electron:
```bash
npm run electron-dev
```

## 🎯 Ou les deux à la fois:
```bash
npm run dev:all
```

## 📦 Build Final (EXE Windows)
```bash
npm run build
```

Les fichiers `.exe` seront dans `release/`

## 🎨 Les 7 Modules Inclus

| Icône | Module | Fonction |
|-------|--------|----------|
| 🏠 | **Accueil** | Verset du jour + compteur pureté |
| ⚔️ | **Combat** | Respiration guidée + versets |
| 📖 | **Bible** | 6 thèmes bibliques |
| ✍️ | **Journal** | Entrées avec humeur |
| 📊 | **Tableau** | Stats et habitudes |
| ✨ | **Salomon** | Chat IA spirituel |
| 🔔 | **Rappels** | Alarmes configurables |

## ✅ Vérifications

- [ ] Node.js 16+ installé: `node -v`
- [ ] npm installé: `npm -v`
- [ ] Dépendances: `npm install`
- [ ] Port 5173 disponible

## 🐛 Problèmes?

**App ne s'ouvre pas**
```bash
# Vérifier Vite sur port 5173
npm run dev
# Puis dans un autre terminal
npm run electron-dev
```

**Build échoue**
```bash
rm -rf node_modules dist dist-electron
npm install
npm run build
```

**Port 5173 occupé**
```bash
# Libérer le port ou spécifier un autre
# (Modifier dans vite.config.ts)
```

## 🎓 Prochaines étapes

1. Explorez les 7 modules
2. Testez les fonctionnalités (journal, rappels, etc.)
3. Personnalisez l'icône dans `public/icon.png`
4. Modifiez les versets bibliques dans `src/App.tsx`
5. Build final: `npm run build`

---

**Prêt à combattre spirituellement?** ⚔️
