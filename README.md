# DispoBox #

##1. Objectif ##
Détecter la présence de personnes dans les box et afficher l'état de toutes les box sur une _appli android/page web_ (cartes 4ème et 6ème étage, rouge = occupé, vert = libre, gris = aucune info/système éteint).



##2. Fonctionnement générale ##

Chaque étage comporte plusieurs boitiers wifi. Chaque boitier contient une carte wifi Arduino Huzzah, reliée à plusieurs détecteurs de présence. Il contient également une pile 9v et un pont diviseur de tension afin de mesurer l'autonomie restante.
Le boitier se connecte au wifi et envoie l'état des box sur un serveur local, qui reçoit les infos en TCP grâce à un script python et les stockent dans une base de données MySQL. 
Le serveur fait également tourner un serveur web qui lui permet de communiquer avec _l'appli Android/la page web_.

##3. Branchements Arduino ##
![alt tag](https://github.com/MakersExtia/DispoBox/edit/master/Arduino/branchements.jpg)

Capteurs infra-rouge 

Box 1 = pin 12

Box 2 = pin 14

Box 3 = pin 16


##4. Fonctionnement programme par programme ##
###     - Serveur Python ###
Le serveur python tourne sur le server. Connecté au wifi de la LAN visiteur d'Extia (Wifi-int4 ou Wifi-int6), comme les modules de détection Arduino.
Le serveur crée une connexion TCP et attend des connexions.

IP : 150.16.21.40

Mask: 255.255.255.128

GW: 150.16.21.1   

USER du serveur : polinno

MDP : boxdispo

**Fonctionnement des thread et process**

Trois thread sont lancés automatiquement, et un nouveaux process de communication est crée dès qu'un nouveau matériel se connecte en TCP.
- _main_ : crée la connexion TCP, se connecte la base de données SQL _nomdeladb_ , lance le thread _active_con_ et attend qu'on appuie sur une touche pour fermer toutes les connexions et arréter le programme.
- _active_connexion_ : ouvre une connexion TCP et attend que quel'qu'un se connecte. A chaque connexion, crée un process propre à la connexion qui gère la connexion. Elle reçoit l'état des capteurs et met ces infos dans la base de données _nomdeladb_.
- _MAJ_current_state_ : boucle qui récupère chaque nouvelle valeur dans la queue pour la mettre à jour dans la base de données SQL.


### - Code Arduino HUZZAH ###
Chaque Huzzah est connecté à 3 ou 4 détecteurs de présence ainsi qu'une pile et un pont diviseur de tension.
- Connexion au réseau TCP : la librairie [ESP8266WiFi.h](https://github.com/ekstrand/ESP8266wifi) permet de communiquer en wifi. 
- La fonction _setup()_ : connection au réseau wifi.
- La fonction _loop()_ : recherche d'un serveur TCP, s'y connecte, puis envoie l'état des capteurs ou entre en veille et envoie son niveau de batterie restant (grâce au pont diviseur de tension) en fonction de la réponse serveur.



### - Serveur web ###
- URL access : http://150.16.21.40/dispobox/
- Project directory : /var/www/html/dispobox/

_Server config_
- config/config.t : DB config
- config/create_database.sql : Create table query
- init.inc.php : Autoload init + custom error handler

_Lib_
- class/ActionHelper.php : Main WS handler
- class/DataDecoder.class.php : json encoder/decoder
- class/DBHelper.class.php : MySQL query helper

- main access : index.hp

_General WS use_
- WS use : http://150.16.21.40/dispobox/?action=[ACTION_NAME]&data=[DATA]

- ACTION_NAME = WS action name
- DATA = WS action data (with json format)

- Return : data with json format
- JSON Struct. :
    - code : return code (if code < 0 : something go wrong with action)
    - message : general message (use when there is an error)
    - data : data result for WS action
- Sample : {"code":0,"message":"","data":[]}

_Model_
- class/Box.class.php

### _Currents WS Actions_ ###
- name : getAllBoxes
- URL : http://150.16.21.40/dispobox/?action=getAllBoxes
- Return : json
- Return sample :
{"code":0,"message":"","data":[{"id":"0","state":1,"name":"0"},{"id":"41","state":1,"name":"41"},{"id":"42","state":1,"name":"42"},{"id":"43","state":1,"name":"43"}]}
- ActionHelper method called : getAllBoxesAction()


### - Appli mobile ###

