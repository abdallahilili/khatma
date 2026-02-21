# Icônes PWA — Instructions

Placez dans ce dossier les fichiers PNG suivants avec ces noms exacts :

| Fichier           | Taille  | Usage |
|-------------------|---------|-------|
| icon-72x72.png    | 72×72   | Android legacy |
| icon-96x96.png    | 96×96   | Android |
| icon-128x128.png  | 128×128 | Chrome Web Store |
| icon-144x144.png  | 144×144 | Windows tile |
| icon-152x152.png  | 152×152 | iPad |
| icon-192x192.png  | 192×192 | Android home screen ⭐ |
| icon-384x384.png  | 384×384 | Android splash |
| icon-512x512.png  | 512×512 | Splash screen ⭐ |

## Génération rapide avec sharp (Node.js)

Depuis la racine du projet, après avoir une image source `public/icon-source.png` (512×512 minimum) :

```bash
npm install sharp --save-dev
node scripts/generate-icons.js
```

## Génération en ligne (alternative rapide)

Utilisez https://realfavicongenerator.net ou https://maskable.app
