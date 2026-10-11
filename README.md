# Streamabl ❤️

Un salon vidéo privé à deux : appel caméra/micro en WebRTC + lecture vidéo
synchronisée (MP4, HLS/.m3u8, YouTube), pour regarder un film ensemble à
distance comme si vous étiez côte à côte.

**Démo :** https://streamabl.onrender.com

## Fonctionnalités

- 📹 Appel vidéo/audio en WebRTC (pair à pair, 2 personnes par salon)
- 🎬 Vidéo synchronisée : lecture, pause, avance/recul, seek — partagés en temps réel
- 🔗 Support des liens MP4 directs, flux HLS (.m3u8) et YouTube
- 🔑 Salons privés par code, à partager avec qui vous voulez
- ⏯️ Clic sur la vidéo pour lecture/pause (fonctionne aussi en plein écran)
- 📱 Interface responsive, pensée mobile

## Stack technique

- **Front-end** : HTML/CSS/JS vanilla (aucun framework), `hls.js` pour les flux HLS
- **Back-end** : Node.js, [Express](https://expressjs.com/), [Socket.IO](https://socket.io/) (signaling WebRTC + synchro vidéo)
- **Appel vidéo** : WebRTC natif du navigateur — le flux audio/vidéo passe
  directement entre les deux navigateurs, le serveur ne fait que relayer le
  signaling et l'état de la vidéo partagée

## Installation locale

Prérequis : [Node.js](https://nodejs.org/) 20 ou plus récent.

```bash
git clone https://github.com/sosoleti07/streamabl.git
cd streamabl
npm install
cp .env.example .env
npm start
```

L'app est accessible sur **http://localhost:3000**. Ouvre cette adresse dans
deux onglets/navigateurs différents pour simuler les deux participants.

## Utilisation

1. Ouvre le site
2. Clique sur **Créer un salon**
3. Autorise la caméra + le micro
4. Clique sur **Copier le lien** et envoie-le à l'autre personne
5. Elle ouvre le lien et clique sur **Rejoindre**
6. Collez un lien vidéo (MP4, .m3u8 ou YouTube) pour le regarder en synchro

## Variables d'environnement

| Variable          | Obligatoire | Description                                              |
|-------------------|:-----------:|------------------------------------------------------------|
| `PORT`            | Non         | Port du serveur (défini automatiquement par Render)         |
| `TURN_URL`        | Non         | URL d'un serveur TURN (ex: `turn:relay.example.com:80`)     |
| `TURN_USERNAME`   | Non         | Identifiant du serveur TURN                                  |
| `TURN_CREDENTIAL` | Non         | Mot de passe/credential du serveur TURN                      |

Le projet inclut déjà deux serveurs STUN publics, ce qui suffit dans la
majorité des réseaux. Un serveur TURN est recommandé pour fiabiliser la
connexion sur certains réseaux mobiles ou d'entreprise plus restrictifs — des
offres gratuites existent chez [Metered](https://www.metered.ca/tools/openrelay/),
Twilio, Xirsys, etc.

**Ne mets jamais de vrais identifiants TURN directement dans le code ou sur
GitHub** — utilise les variables d'environnement.

## Déploiement sur Render

1. Pousse ce projet sur un dépôt GitHub
2. Sur [Render](https://render.com), crée un **Web Service** et connecte le dépôt
3. Render détecte `render.yaml`, ou renseigne manuellement :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Health Check Path** : `/health`
4. (Optionnel) Ajoute `TURN_URL`, `TURN_USERNAME`, `TURN_CREDENTIAL` dans l'onglet *Environment*
5. Déploie — Render redéploiera automatiquement à chaque `git push` sur la branche connectée

> Sur le plan **Free**, le service se met en veille après 15 minutes sans
> trafic ; le premier accès suivant peut prendre environ une minute.

## Dépannage

**Erreur `AbortError` sur Brave/Windows** : la permission caméra/micro est
peut-être déjà accordée mais le navigateur n'arrive pas à garder le
périphérique ouvert. Ferme les autres applications qui utilisent la caméra ou
le micro (Teams, Zoom, Discord, OBS, app Caméra), puis réessaie.

## Contribuer

Les contributions sont les bienvenues (bugs, idées, pull requests). Voir
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Licence

[MIT](./LICENSE) — libre d'utilisation, de modification et de redistribution.
