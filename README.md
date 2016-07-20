# DispoBox #

##Objectif ##
Detecter la presence de personnes dans les box et afficher l'état de toutes les box sur une page web (cartes 4eme et 6eme étage, rouge = occupé, vert = libre

## Fonctionnement générale ##

On considère que wifi-int4 et wifi-int6 sont "identiques".

Pour chaque étage, on un arduino Huzzah relié à plusieurs detecteurs de présences. Huzzah se connecte au wifi et envoie l'état des box.
Sur un raspberry tourne le serveur (fichier python). Il récupère les données d'état et les affiche sur une page web ?

## Fonctionnement programme par programme ##
### Serveur Python ###
Le serveur python tourne sur le server. Connecté au wifi de la LAN visiteur d'Extia (Wifi-Vi4 ou Wifi-Vi6), comme les modules de détection Arduino.
Le serveur crée une connexion TCP et attend des connexions.

**Fonctionnement des thread et process**
Deux thread sont lancés automatiquement, et un nouveaux process de communication est crée dès qu'un nouveau matériel se connecte en TCP.
- _ _main_ _ : crée la connexion TCP, se connecte la base de données SQL _ _nomdeladb_ _ , lance le thread _ _nomduthread_ _ et attend qu'on appuie sur une touche pour fermer toutes les connexions et arréter le programme.
- _ _nomduthread_ _ : ouvre une connexion TCP et attend que quel'qu'un se connecte. A chaque connexion, crée un process propre à la connexion qui gère la connexion. Elle reçoit l'état des capteurs et met ces infos dans la base de données _ _nomdeladb_ _.

### Code Arduino HUZZAH ###

