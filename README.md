# Chat vidéo privé à 2 — version Internet

Cette version est prête à être hébergée sur Internet avec **HTTPS + WebSocket**.

## Déploiement recommandé : Render

Render fournit une URL publique `https://...onrender.com`, avec HTTPS/TLS géré et prise en charge des WebSockets nécessaires au salon temps réel.

### 1. Mettre le projet sur GitHub

1. Crée un nouveau dépôt GitHub, par exemple `love-video-chat`.
2. Envoie **tout le contenu de ce dossier** dans le dépôt.

### 2. Créer le serveur public

Dans Render :

- **New → Web Service**
- connecte ton dépôt GitHub
- choisis le plan **Free** pour tester
- Render détectera le `render.yaml`, ou renseigne :
  - Build Command : `npm install`
  - Start Command : `npm start`
  - Health Check Path : `/health`

Render demande que le serveur écoute sur `0.0.0.0`; c’est déjà configuré dans `server.js`.

À la fin du déploiement, Render donne une adresse du type :

`https://love-video-chat.onrender.com`

Cette adresse peut être envoyée à ta copine. Chaque personne peut être sur un Wi-Fi différent ou en 4G/5G.

### 3. Utilisation

1. Ouvre le site public.
2. Clique sur **Créer un salon**.
3. Clique sur **Rejoindre** et autorise caméra + micro.
4. Clique sur **Copier le lien**.
5. Envoie le lien à ta copine.
6. Elle ouvre le lien et clique sur **Rejoindre**.

Les deux caméras et micros passent directement par WebRTC; le serveur sert surtout à signaler et synchroniser le salon.

## Vidéo partagée

Le salon permet aussi de coller un lien YouTube ou un lien vidéo direct compatible avec le navigateur. Les commandes lecture/pause/avance/retour sont synchronisées.

## Important : Free Render

Le plan Free peut mettre le service en veille après 15 minutes sans trafic; le prochain accès peut alors prendre environ une minute. Le plan Free est pratique pour tester ou pour un projet personnel, mais il a des limitations et peut mettre le service en veille lorsqu’il reste inactif.

## Connexion WebRTC

La version inclut deux serveurs STUN publics. Cela fonctionne dans beaucoup de réseaux, mais certaines configurations NAT/firewall exigent un serveur **TURN** pour obtenir une connectivité média plus fiable.

Le projet accepte des identifiants TURN via les variables d'environnement :

- `TURN_URL`
- `TURN_USERNAME`
- `TURN_CREDENTIAL`

Ne mets jamais les vrais identifiants TURN dans GitHub.


### Brave : AbortError
Si le site affiche `AbortError`, la permission peut déjà être accordée mais Windows/Brave n'arrive pas à garder le périphérique ouvert. Ferme les applications qui utilisent la caméra ou le micro (Teams, Zoom, Discord, OBS, application Caméra), puis clique à nouveau sur « Tester caméra + micro ». Le site tente désormais une seconde méthode en ouvrant caméra et micro séparément.
