# DispoBox

Objectif : detecter la presence de personnes dans les box et afficher l'état de toutes les box sur une page web (cartes 4eme et 6eme étage, rouge = occupé, vert = libre)

Fonctionnement générale :

On considère que wifi-int4 et wifi-int6 sont "identiques".

Pour chaque étage, on un arduino Huzzah relié à plusieurs detecteurs de présences. Huzzah se connecte au wifi et envoie l'état des box.
Sur un raspberry tourne le serveur (fichier python). Il récupère les données d'état et les affiche sur une page web ?

