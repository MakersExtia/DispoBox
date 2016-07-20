# DispoBox #

##Objectif ##
Détecter la présence de personnes dans les box et afficher l'état de toutes les box sur une page web (cartes 4ème et 6ème étage, rouge = occupé, vert = libre

## Fonctionnement générale ##

On considère que wifi-int4 et wifi-int6 sont "identiques".

Pour chaque étage, on un Arduino Huzzah relié à plusieurs détecteurs de présences. Huzzah se connecte au wifi et envoie l'état des box sur le serveur dispobox. Celui-ci comporte un serveur web et une base de données SQL et communique avec l'appli Android.

## Fonctionnement programme par programme ##
### Serveur Python ###
Le serveur python tourne sur le server. Connecté au wifi de la LAN visiteur d'Extia (Wifi-Vi4 ou Wifi-Vi6), comme les modules de détection Arduino.
Le serveur crée une connexion TCP et attend des connexions.

**Fonctionnement des thread et process**
Deux thread sont lancés automatiquement, et un nouveaux process de communication est crée dès qu'un nouveau matériel se connecte en TCP.
- _main_ : crée la connexion TCP, se connecte la base de données SQL _nomdeladb_ , lance le thread _active_con_ et attend qu'on appuie sur une touche pour fermer toutes les connexions et arréter le programme.
- _active_con_ : ouvre une connexion TCP et attend que quel'qu'un se connecte. A chaque connexion, crée un process propre à la connexion qui gère la connexion. Elle reçoit l'état des capteurs et met ces infos dans la base de données _nomdeladb_.

### Code Arduino HUZZAH ###



### Serveur web ###

### Appli mobile ###
