# DispoBox #

##1. Objectif ##
Détecter la présence de personnes dans les box et afficher l'état de toutes les box sur une _appli android/page web_ (cartes 4ème et 6ème étage, rouge = occupé, vert = libre, gris = aucune info/système éteint).



##2. Fonctionnement générale ##

Pour chaque étage comporte plusieurs boitiers wifi. Chaque boitier contient une carte wifi Arduino Huzzah, reliée à plusieurs détecteurs de présences
. Huzzah se connecte au wifi et envoie l'état des box sur un serveur local, qui reçoit les infos en pythons et les stock dans une base de données MySQL. 
Le serveur comporte également un serveur web qui lui permet de communiquer avec _l'appli Android/la page web_.



##3. Fonctionnement programme par programme ##
###     - Serveur Python ###
Le serveur python tourne sur le server. Connecté au wifi de la LAN visiteur d'Extia (Wifi-Vi4 ou Wifi-Vi6), comme les modules de détection Arduino.
Le serveur crée une connexion TCP et attend des connexions.

**Fonctionnement des thread et process**

Deux thread sont lancés automatiquement, et un nouveaux process de communication est crée dès qu'un nouveau matériel se connecte en TCP.
- _main_ : crée la connexion TCP, se connecte la base de données SQL _nomdeladb_ , lance le thread _active_con_ et attend qu'on appuie sur une touche pour fermer toutes les connexions et arréter le programme.
- _active_con_ : ouvre une connexion TCP et attend que quel'qu'un se connecte. A chaque connexion, crée un process propre à la connexion qui gère la connexion. Elle reçoit l'état des capteurs et met ces infos dans la base de données _nomdeladb_.



### - Code Arduino HUZZAH ###
Chaque Huzzah est connecté à 3 ou 4 détecteurs de présence ainsi qu'une pile et un pont diviseur de tension.
- Connexion au réseau TCP : la librairie [ESP8266WiFi.h](https://github.com/ekstrand/ESP8266wifi) permet de communiquer en wifi. 
- La fonction _setup()_ : connection au réseau wifi.
- La fonction _loop()_ : recherche d'un serveur TCP, s'y connecte, puis envoie l'état des capteurs ou entre en veille et envoie son niveau de batterie restant (grâce au pont diviseur de tension) en fonction de la réponse serveur.



### - Serveur web ###



### - Appli mobile ###

