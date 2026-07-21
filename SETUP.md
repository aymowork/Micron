# MICRON — Setup Guide

## 1. Installer les dépendances

```bash
cd micron-site
npm install
```

## 2. Créer le fichier .env.local

Copie `.env.local.example` en `.env.local` et remplis :

```
NEXT_PUBLIC_SUPABASE_URL=    → ton URL Supabase (Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=    → ta clé anon Supabase
SUPABASE_SERVICE_ROLE_KEY=    → ta clé service_role (ne jamais exposer côté client)
ADMIN_PASSWORD=    → mot de passe admin de ton choix
ADMIN_SESSION_SECRET=    → une chaîne aléatoire longue (ex: openssl rand -hex 32)
```

## 3. Configurer Supabase

1. Crée un nouveau projet sur supabase.com
2. Va dans **SQL Editor** → paste le contenu de `supabase/migration.sql` → Run
3. Va dans **Storage** → New bucket → Name: `micron` → Public: YES

## 4. Lancer le site

```bash
npm run dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin

## 5. Configurer Whop (quand tu es prêt)

1. Crée ton store sur whop.com
2. Ajoute tes produits sur Whop
3. Pour chaque produit, copie l'URL de checkout
4. Dans l'admin MICRON → Produits → Edit → colle l'URL dans le champ "Whop URL"

## Structure admin

| Route | Description |
|---|---|
| `/admin` | Dashboard + stats |
| `/admin/produits` | Gérer les produits (CRUD + upload photos) |
| `/admin/drops` | Planifier les drops (timer sur la home) |

## Touche perso incluses

- Curseur custom magnétique
- Effet grain film sur tout le site
- Animation contamination (canvas, particules vertes)
- Effet glitch sur le logo MICRON
- 3D tilt sur les produits (suit la souris)
- Drop timer live sur la home
- Archive horizontale scroll
- Marquee animé
