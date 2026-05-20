#!/bin/bash
# Installation et lancement automatique de Nouvelle Création

echo "📦 Installation de Nouvelle Création..."
echo ""

# Étape 1: Installer les dépendances
echo "1️⃣  Installation des dépendances globales..."
npm install

echo ""
echo "2️⃣  Accès au dossier desktop..."
cd apps/desktop || exit

echo ""
echo "3️⃣  Installation des dépendances desktop..."
npm install

echo ""
echo "✅ Installation terminée!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Pour lancer l'application:"
echo ""
echo "  Mode Web (dans le navigateur):"
echo "    npm run dev"
echo "    → http://localhost:5173/"
echo ""
echo "  Mode Electron (Application native):"
echo "    npm run dev:all"
echo ""
echo "  Générer l'EXE (Build Final):"
echo "    npm run build"
echo "    → Fichier dans: release/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Bonne marche spirituelle! 🙏"
echo ""
