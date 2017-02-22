# Installation de l'environnement

Installer les outils suivants :

1. NodeJS (https://nodejs.org/en/download/)

Une fois NodeJS installé, ouvrir une console et 

1. npm install -g cordova (nécessite peut-être sudo)

2. npm install -g ionic (nécessite peut-être sudo)

Télécharger les sources et se placer dans le dossier puis faire
npm install

# Visualisation de l'application
## Dans le navigateur

Dans une console, se placer dans le dossier et faire : ionic serve --lab
L'option lab permet d'avoir en parallèle une vue iOS et Android. (Attention, certaines fonctionnalités ne marche pas sur navigateur comme InAppBrowser qui permet d'ouvrir une fenêtre à l'extérieur de l'appli. Cela sert par exemple à accepter l'authentification Google pour récuprérer les données de Google Calendar)

## Emulateur mobile

Pour émuler un mobile, il faut installer une platform dans le projet ainsi que les outils standard de cette plateforme (compilateur, SDK, etc).
Pour Android, il faut d'abord suivre les instructions ici : https://ionicframework.com/docs/v2/resources/platform-setup/mac-setup.html
Puis dans une console :

1. Se placer dans le projet

2. Faire ionic add platform android

3. ionic run android


Si aucun téléphone n'est branché au PC en mode debug, cela va lancer l'émulateur (pour Android il faut un AVD).

## Ionic view

Ionic View est une application mobile qui permet de tester les applications Ionic à distance.
Le développeur se créé un compte Ionic View (https://apps.ionic.io/login), puis dans une console : ionic upload
Depuis l'interface Web de Ionic View, il est ensuite possible d'inviter des personnes qui ont installé Ionic View sur leur mobile pour tester l'application.
Attention, Ionic View semble avoir les mêmes contraintes que la simulateur sur navigateur, à savoir les fonctionnalités bas niveau (i.e InAppBrowser) ne permettent pas d'ouvrir l'application.

# Génération de l'apk

Pour générer l'apk, entrer ionic build android (--release)
L'option --release permet de générer une release. Pour se faire, il faut pouvoir signer l'application sinon elle ne s'installera pas.
