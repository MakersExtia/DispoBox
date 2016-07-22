# DispoBox #

##1. Objectif ##
Détecter la présence de personnes dans les box et afficher l'état de toutes les box sur une _appli android/page web_ (cartes 4ème et 6ème étage, rouge = occupé, vert = libre, gris = aucune info/système éteint).



##2. Fonctionnement générale ##

Chaque étage comporte plusieurs boitiers wifi. Chaque boitier contient une carte wifi Arduino Huzzah, reliée à plusieurs détecteurs de présence. Il contient également une pile 9v et un pont diviseur de tension afin de mesurer l'autonomie restante.
Le boitier se connecte au wifi et envoie l'état des box sur un serveur local, qui reçoit les infos en TCP grâce à un script python et les stockent dans une base de données MySQL. 
Le serveur fait également tourner un serveur web qui lui permet de communiquer avec _l'appli Android/la page web_.



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
URL d'acces : http://190.23.0.10/dispobox/
Dossier projet : /var/www/html/dispobox/

_Config serveur_
- config/config.t : DB config
- config/create_database.sql : Crate table query
- init.inc.php : Autoload init + custom error handler

_Lib_
class/ActionHelper.php : Main WS handler
class/DataDecoder.class.php : json encoder/decoder
class/DBHelper.class.php : MySQL query helper

main access : index.php

_General WS use_
WS use : http://190.23.0.10/dispobox/?action=[ACTION_NAME]&data=[DATA]

ACTION_NAME = WS action name
DATA = WS action data (with json format)

Return : data with json format
JSON Struct. :
    code : return code (if code < 0 : something go wrong with action)
    message : general message (use when there is an error)
    data : data result for WS action
Sample : {"code":0,"message":"","data":[]}

_Model_
class/Box.class.php

_Current WS Action_
name : getAllBoxes
URL : http://190.23.0.10/dispobox/?action=getAllBoxes
Return : json
Return sample :
{"code":0,"message":"","data":[{"id":"0","state":1,"name":"0"},{"id":"41","state":1,"name":"41"},{"id":"42","state":1,"name":"42"},{"id":"43","state":1,"name":"43"}]}
ActionHelper method called : getAllBoxesAction()


### - Appli mobile ###

