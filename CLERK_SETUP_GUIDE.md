# Guide de Configuration Clerk

## ✅ Configuration Terminée

L'intégration Clerk a été complètement configurée dans votre application. Voici ce qui a été mis en place :

### 1. 📦 Dépendances Installées
- `@clerk/nextjs` (v6.20.2) - Déjà installé

### 2. 🔧 Configuration des Fichiers

#### Middleware (`src/middleware.ts`)
- Protection automatique des routes avec `clerkMiddleware`
- Configuration simplifiée pour une gestion optimale

#### Layout Principal (`src/app/layout.tsx`)
- `ClerkProvider` intégré pour envelopper toute l'application

#### Configuration Next.js (`next.config.js`)
- Suppression de l'option turbo invalide
- Ajout du domaine Clerk pour les images d'avatar

### 3. 🎨 Composants d'Interface

#### MainNavbar (`src/components/navigation/main-navbar.tsx`)
- Intégration complète des composants Clerk
- `UserButton`, `SignedIn`, `SignedOut`, `SignInButton`
- Gestion utilisateur dans desktop et mobile

#### Landing Navbar (`src/components/landing/navbar.tsx`)
- Authentification intégrée dans la navigation principale
- Affichage conditionnel basé sur l'état de connexion

### 4. 📄 Pages Créées

#### Routes d'Authentification
- `/auth/login/[[...login]]/page.tsx` - Page de connexion
- `/auth/register/[[...register]]/page.tsx` - Page d'inscription
- `/user-profile/[[...user-profile]]/page.tsx` - Profil utilisateur

#### Pages Protégées
- `/dashboard/page.tsx` - Tableau de bord utilisateur avec redirection automatique
- `/app/page.tsx` - Application principale (démo interactive avec MainNavbar)

### 5. 🔐 Service d'Authentification

#### AuthService (`src/services/authService.ts`)
- Fonctions utilitaires pour les requêtes authentifiées
- Support pour Server Components et Client Components
- Gestion automatique des tokens JWT

## 🚀 Prochaines Étapes

### 1. Créer un Compte Clerk
1. Visitez [clerk.com](https://clerk.com)
2. Créez un nouveau compte
3. Créez une nouvelle application

### 2. Configurer les Variables d'Environnement
Créez un fichier `.env.local` dans la racine du projet :

```env
# Clés Clerk (depuis votre dashboard Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_VOTRE_CLE_PUBLIQUE"
CLERK_SECRET_KEY="sk_test_VOTRE_CLE_SECRETE"

# URLs personnalisées Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app

# URL de votre API backend
NEXT_PUBLIC_API_BASE_URL="http://localhost:8080/api/v1"
```

### 3. Configuration Clerk Dashboard
1. **Méthodes d'authentification** : Activez Email/Mot de passe, Google, etc.
2. **URLs de redirection** : Configurez selon vos variables d'environnement
   - After sign-in URL: `/app`
   - After sign-up URL: `/app`
3. **Domaines autorisés** : Ajoutez `localhost:3000` pour le développement

### 4. Tests à Effectuer

#### ✅ Tests de Base
- [ ] Démarrer l'application : `npm run dev`
- [ ] Visiter la page d'accueil (`/`) - devrait fonctionner sans auth
- [ ] Tenter d'accéder à `/dashboard` - redirection vers login
- [ ] Tester l'inscription via `/auth/register` - redirection vers `/app`
- [ ] Tester la connexion via `/auth/login` - redirection vers `/app`
- [ ] Vérifier la navigation après connexion
- [ ] Tester la déconnexion via UserButton

#### ✅ Tests d'Interface
- [ ] Navigation desktop avec MainNavbar
- [ ] Navigation mobile responsive
- [ ] Affichage du nom d'utilisateur
- [ ] Fonctionnement du UserButton
- [ ] Transitions entre pages protégées

#### ✅ Tests de Sécurité
- [ ] Accès aux routes protégées sans auth
- [ ] Persistance de session après rechargement
- [ ] Redirection après déconnexion

### 5. Personnalisation Avancée

#### Apparence Clerk
Vous pouvez personnaliser l'apparence des composants Clerk :

```tsx
<SignIn 
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-xl border-0 rounded-2xl bg-white dark:bg-gray-800",
      headerTitle: "text-gray-900 dark:text-white",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
    }
  }}
/>
```

#### Templates JWT
Créez des templates JWT personnalisés dans le dashboard Clerk pour votre backend Spring Boot.

## 🔧 Dépannage

### Erreurs Communes

1. **"Module @clerk/nextjs/server has no exported member"**
   - ✅ Résolu : Utilisation de `clerkMiddleware` au lieu de `authMiddleware`

2. **"Property 'getToken' does not exist"**
   - ✅ Résolu : Utilisation de `await auth()` puis `getToken()`

3. **Erreurs TypeScript avec HeadersInit**
   - ✅ Résolu : Typage explicite `Record<string, string>`

4. **Conflits de routes**
   - ✅ Résolu : Suppression des pages statiques en conflit avec catch-all routes

### Support
- Documentation Clerk : [docs.clerk.com](https://docs.clerk.com)
- Support technique : [clerk.com/support](https://clerk.com/support)

## ✨ Fonctionnalités Disponibles

Après configuration, votre application aura :
- 🔐 Authentification complète (inscription, connexion, déconnexion)
- 👤 Gestion de profil utilisateur
- 🎨 Interface utilisateur moderne et responsive
- 📱 Support mobile complet
- 🔒 Protection automatique des routes
- 🚀 Performance optimisée avec Server Components
- 🌙 Support du mode sombre
- 📊 Redirection vers l'application interactive après connexion

## 🎯 Flux Utilisateur

1. **Visiteur** visite la page d'accueil (`/`)
2. **Clic sur "Commencer gratuitement"** → redirection vers `/auth/register`
3. **Inscription réussie** → redirection automatique vers `/app` (démo interactive)
4. **Connexion ultérieure** → redirection automatique vers `/app`
5. **Navigation dans l'app** → MainNavbar avec calendrier interactif

Votre application est maintenant prête pour l'authentification Clerk ! 🎉 