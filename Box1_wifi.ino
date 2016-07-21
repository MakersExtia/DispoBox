/*
 *  Code a mettre en place sur les modules Huzzah du proket KINAO
 */
 
#include <ESP8266WiFi.h>

// Paramètres du connexion
const char* ssid     = "Extia-Vis4";
const char* password = "haverhill";
// IP du serveur Extia : 
const char* host = "190.23.0.10";

String reponse;
WiFiClient client; 
bool CONNECTED = false;

// Les GPIO
int IRpin1 = 12;

// Mesure de tension
const float coeff_division = 9/5;


/*
 *  Lance uniquement la fonction connect_wifi()
 */
void setup() {
  Serial.println("----------------- DANS LE SETUP ------------------");
  Serial.begin(115200);
  delay(1000);
  connect_wifi();
  Serial.println("------------------ FIN DU SETUP ------------------");
}




/*
 * C'est la boucle principale du programme.
 * Si l'Arduino n'est pas connectée au serveur, elle retourne dans le setup.
 * Sinon, écoute et attend une requete client.
 * La requete peut être :
 *  - "X" (avec X un entier) : dans ce cas on hiverne (limitation de la consommation) pendant X secondes
 *  - "" : dans ce cas récupère l'état des box avec readIRvalues() et renvoie les infos au serveur
 */
void loop() {
  // Vérifie la connexion
  if ( !client.connected() ){
    Serial.println("//// \\\\ //// PAS DE CONNEXION \\\\ //// \\\\");
    CONNECTED = false;
    setup();
  }
  else {
    delay(500);
  
    // On écoute jusqu'à recevoir une requète
    reponse = client.readStringUntil('#');
    Serial.print("Message recu  : ");
    Serial.println(reponse);
    // Une fois la requète reçu :  
    if (reponse == ""){  
      int ir01 = readIRvalues();
      client.print("01;"+String(ir01));
    }
    else {
      int tps_attente = 2;
      Serial.println("J'attends 2 secondes");
      client.print("ok");
      delay(tps_attente*1000);
      Serial.println("Je me reveille");
    }
  
    // Test de mise en veille
    //ESP.deepSleep(25000000,WAKE_RF_DEFAULT);
  }
}






/*
 * Connexion au réseau wifi, récupère et affiche son adresse IP, puis ouvre une connexion TCP avec la raspberry
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
      Serial.println("RASPBERRY NON VISIBLE");
      return;
    }
    else {
      Serial.println("CONNECTE AU RASPBERRY");
      CONNECTED = true;
    }
  }
}




/*
 * Lecture de l'état des capteurs IR, puis création de la chaine de caractère à renvoyer.
 * Pour éviter les faux positifs on regarde sur 50 valeurs. Si il y a plus de 10 positifs, alors on considère la salle comme occupée
 */
int readIRvalues() {
  Serial.println("** Dans readIRvalues **");
  // Le code envoyé est : XX;Y avec XX le  numéro de Box et Y son état (0 vide, 1 occupé, autre = incertain)
  int ir01=0;
  
  int i=0;
  while (i<50) {
    Serial.println(digitalRead(IRpin1));
    ir01 = ir01+digitalRead(IRpin1);
    delay(50);
    i = i+1;
  }
  if (ir01>10) {  ir01 = 1;  }
  else         {  ir01 = 0;  }
  Serial.println(ir01);
  return ir01;
}




/*
 * Mesure la tension aux bornes de la pile.
 */
void verify_tension() {
  /* 
  Pont diviseur de tension pour mesurer la tension de la pile
  Vmax (mesure analogique) = 5v
  Vpile = 9v
  R2 /(R1+R2) = 0.55
  
  Soit R2 = 0.55/0.45 R1 = 1.22 R1
  On prend :
    R1 = 1K
    R2 = 1.22K = 1K + 220
  */
  // Fonction qui vérifie la tension aux bornes de la pile. Si la tension est trop faible, préviens le raspberry.
  
  // Mesure de la tension brute 
  unsigned int raw_bat = analogRead(A0);
   
  // Calcul de la tension réel
  float real_bat = ((raw_bat * (5.0 / 1024)) * coeff_division);
  
}
