# 📦 Guide de Déploiement - Nouvelle Création

## Étapes de Build pour EXE Windows

### 1. Préparation
```bash
# Installer les dépendances
npm install

# Vérifier que tout compile
npm run build:web
```

### 2. Build Electron (Générer l'EXE)
```bash
npm run build
```

### 3. Résultats
Après la compilation, vous trouverez dans le dossier `release/`:

```
release/
├── NouvelleCreation-1.0.0.exe          # Installeur NSIS
├── NouvelleCreation-1.0.0-portable.exe # Version portable
├── builder-effective-config.yaml       # Config utilisée
└── ...
```

## Distribution

### Option 1: Distribution de l'Installeur
- Distribuez `release/NouvelleCreation-1.0.0.exe`
- Les utilisateurs l'exécutent et suivent l'installeur
- L'app s'installe dans `Program Files\`

### Option 2: Distribution Portable
- Distribuez `release/NouvelleCreation-1.0.0-portable.exe`
- Pas d'installation, exécution directe
- Idéal pour clés USB ou distributon simple

## Personnalisations avant Build

### 1. Icône
- Remplacer `public/icon.png` (dimensions: 256x256 ou plus)
- Formats acceptés: PNG, JPG, ICO

### 2. Informations
Éditer `package.json`:
```json
{
  "name": "nouvelle-creation",
  "version": "1.0.1",
  "description": "Votre description",
  "build": {
    "appId": "com.votre-domaine.app",
    "productName": "Votre Nom"
  }
}
```

### 3. Signature (Optionnel mais recommandé)
Pour signer le certificat Windows:
```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your-password",
  "signingHashAlgorithms": ["sha256"],
  "sign": "./customSign.js"
}
```

## Dépannage de Build

### Erreur: "Electron not found"
```bash
npm install electron --save-dev
```

### Erreur: "electron-builder not found"
```bash
npm install electron-builder --save-dev
```

### Erreur: "Vite build failed"
```bash
rm -rf node_modules dist dist-electron
npm install
npm run build:web
```

### Erreur: "Cannot find module electron"
Vérifiez que le chemin dans `package.json` `main` pointe vers le bon fichier:
```json
"main": "dist-electron/main.js"
```

## Publication en Ligne

### GitHub Releases
```bash
# Commit et push vers GitHub
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin v1.0.0

# Allez sur GitHub Releases et uploadez les .exe
```

### Site Web Personnalisé
1. Créez un dossier `downloads/`
2. Uploadez les .exe sur votre serveur
3. Fournissez des liens de téléchargement

### Autres Stores
- Windows Store (appx format)
- Chocolatey (package manager Windows)
- Portals (Microsoft MSIX)

## Mise à Jour de l'Application

Pour les utilisateurs:
1. Télécharger la nouvelle version
2. Exécuter le nouvel installeur (ancien sera remplacé)
3. Les données sont préservées

Pour mettre à jour via code source:
1. Incrémenter version dans `package.json`
2. `npm run build`
3. Distribuer les nouveaux .exe

## Checklist Avant Livraison

- [ ] Version incrementée dans `package.json`
- [ ] Icône personnalisée dans `public/icon.png`
- [ ] Tous les modules testés sur `npm run dev:all`
- [ ] Build réussi sans warnings: `npm run build`
- [ ] Les .exe générés s'exécutent correctement
- [ ] Les données se sauvegardent correctement
- [ ] Les notifications système fonctionnent
- [ ] Pas d'erreurs dans la console Electron (F12)

---

**Votre EXE Windows est prêt pour la distribution!** 🎉
