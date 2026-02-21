# KhatmaGroup 📖

Une application web moderne et responsive pour la gestion de Khatma du Coran en groupe.

## 🚀 Technologies

- **Frontend**: React + Vite + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Icons**: Lucide React

## ⚙️ Installation

1. Clonez ou téléchargez le projet.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement :
   - Créez un fichier `.env` à la racine du projet.
   - Copiez le contenu de `.env.example` et remplissez vos identifiants Supabase.
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```
4. Exécutez le script SQL (fourni dans la demande) dans votre éditeur SQL Supabase pour créer les tables, index, fonctions et vues nécessaires.
5. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```

## 🛠 Structure du projet

- `src/components`: Composants réutilisables (Barre de progression, Cartes, etc.)
- `src/pages`: Pages principales (Accueil, Création, Détails)
- `src/hooks`: Hooks personnalisés pour l'interaction avec Supabase et le temps réel.
- `src/lib`: Configuration de Supabase et utilitaires.
- `src/types`: Définitions des types TypeScript.

## ✨ Fonctionnalités

- **Accueil**: Vue d'ensemble des Khatmas avec barre de progression animée.
- **Création**: Formulaire simple pour lancer une nouvelle lecture collective.
- **Détails**: Grille interactive des 30 Juz avec sélection multiple.
- **Temps réel**: Les mises à jour des participants s'affichent instantanément sans rafraîchir la page.
- **UX**: Design minimaliste "Islamic Emerald" optimisé pour mobile.
