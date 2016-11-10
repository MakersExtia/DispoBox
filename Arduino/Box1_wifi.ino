#include <ESP8266WiFi.h>
#define NB_VERIF_IR 60 // Nombre de fois sur lesquels on regarde la valeur du capteur
#define MIN_POSITIF 4   // Nb de positif necessaires pour considérer que le box est occupé

// Paramètres du connexion
const char* ssid     = "Extia-Int4";
const char* password = "2d762d6963";
// IP du serveur Extia :
const char* host = "150.16.21.40";

String reponse;
WiFiClient client;
bool CONNECTED = false;

// Les GPIO
int IRpin1 = 12;
int IRpin2 = 14;
int IRpin3 = 16;
int IRpin4 = 13;


// Variables pour l'état des box
int ir01, ir02, ir03, ir04;
int indice;
int box1_queue[NB_VERIF_IR], box2_queue[NB_VERIF_IR], box3_queue[NB_VERIF_IR], box4_queue[NB_VERIF_IR];
int box1, box2, box3, box4;

// Mesure de tension
const float coeff_division = 9 / 5;

/*
    Lance uniquement la fonction connect_wifi()
*/
void setup() {
  indice = NB_VERIF_IR-10;
  Serial.println("----------------- DANS LE SETUP ------------------");
  Serial.begin(115200);
  delay(1000);
  connect_wifi();
  box1 = -1;  box2 = -1;  box3 = -1;  box4 = -1;
  // Init des queues
  for (int i = 0; i < NB_VERIF_IR;i++) {    box1_queue[i] = 0;    box2_queue[i] = 0;    box3_queue[i] = 0;  box4_queue[i] = 0;  }
  Serial.println("------------------ FIN DU SETUP ------------------");
  Serial.setTimeout(10000);
}


void loop() {
  // Vérifie la connexion
  if (!client.connected()) {
    Serial.println("//// \\\\ //// PAS DE CONNEXION \\\\ //// \\\\");
    CONNECTED = false;
    setup();
  }
  else {
    int prev1, prev2, prev3, prev4;
    // On écoute jusqu'à recevoir une requète
    reponse = client.readStringUntil('#');
    // Une fois la requète reçu :
    if (reponse == "") {
      box1_queue[indice] = digitalRead(IRpin1);
      box2_queue[indice] = digitalRead(IRpin2);
      box3_queue[indice] = digitalRead(IRpin3);
      box4_queue[indice] = digitalRead(IRpin4);
    }
    else if (reponse == "infos") {
      Serial.print("Message recu  : ");
      Serial.println(reponse);
      prev1 = box1; prev2 = box2; prev3 = box3; prev4 = box4;
      for (int j=0;j<NB_VERIF_IR;j++){
        box1+=box1_queue[j];  
        box2+=box2_queue[j];  
        box3+=box3_queue[j]; 
        box4+=box4_queue[j];  
      }
      if (box1 > MIN_POSITIF) {box1=1;} else {box1=0;}
      if (box2 > MIN_POSITIF) {box2=1;} else {box2=0;}
      if (box3 > MIN_POSITIF) {box3=1;} else {box3=0;}
      if (box4 > MIN_POSITIF) {box4=1;} else {box4=0;}
      Serial.print(box1);
      Serial.print(box2);
      Serial.print(box3);
      Serial.println(box4);
      
      indice = (indice+1) % NB_VERIF_IR;
      
      String reponse;
      int nb_chgt=0;
      if (box1 != prev1) {nb_chgt +=1;}
      if (box2 != prev2) {nb_chgt +=1;}
      if (box3 != prev3) {nb_chgt +=1;}
      if (box4 != prev4) {nb_chgt +=1;}
      
      reponse = String(nb_chgt);
      if (box1 != prev1) {        reponse = reponse+"41"+String(box1);      }
      if (box2 != prev2) {        reponse = reponse+"42"+String(box2);      }
      if (box3 != prev3) {        reponse = reponse+"43"+String(box3);      }
      if (box4 != prev4) {        reponse = reponse+"44"+String(box4);      }
      Serial.println(reponse);
      client.print(reponse);
      
      /*
      if (box1 != prev1) {        client.print("41;" + String(box1));      }
      delay(1000);
      if (box2 != prev2) {        client.print("42;" + String(box2));      }
      delay(1000);
      if (box3 != prev3) {        client.print("43;" + String(box3));      }

      if ((box1==prev1)&&(box2==prev2)&&(box3==prev3)) {client.print("rien");}
      
      client.print("3410420431");
      delay(3000);
      client.print("1411");
      delay(3000);
      client.print("3410421430");
      delay(3000);
      client.print("1431");
      delay(3000);
      client.print("2420430");
      delay(3000);
      */
    }
    else {
      Serial.println("MESSAGE PAS VIDE");
      //      int tps_attente = 2;
      //      Serial.println("J'attends 2 secondes");
      //      //client.print("ok");
      //      delay(tps_attente*1000);
      //      Serial.println("Je me reveille");
    }

    // Test de mise en veille
    //ESP.deepSleep(25000000,WAKE_RF_DEFAULT);
  }
}






/*
   Connexion au réseau wifi, récupère et affiche son adresse IP, puis ouvre une connexion TCP avec la raspberry
*/
void connect_wifi() {
  // Connexion au réseau Wifi
  while (!CONNECTED) {
    Serial.print("Connecting ...");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("WiFi connected");
    Serial.println("Mon IP address: ");
    Serial.println(WiFi.localIP());

    // On utilise la classe WiFiClient pour créer une connexion TCP avec le raspberry
    const int httpPort = 50000;
    if (!client.connect(host, httpPort)) {
      Serial.println("SERVEUR NON VISIBLE");
      return;
    }
    else {
      Serial.println("CONNECTE AU SERVEUR");
      CONNECTED = true;
    }
  }
}
