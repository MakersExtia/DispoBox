#include <ESP8266WiFi.h>

// Paramètres du connexion
const char* ssid     = "Extia-Int4";
// IP du serveur Extia :
const char* host = "150.16.21.40";

String question;
WiFiClient client;
bool CONNECTED = false;

// Les GPIO
int IRpin1 = 4;
int IRpin2 = 14;
int IRpin3 = 16;
int IRpin4 = 13;


/*
    Lance uniquement la fonction connect_wifi()
*/
void setup() {
  Serial.println("----------------- DANS LE SETUP ------------------");
  Serial.begin(115200);
  delay(1000);
  connect_wifi();
  Serial.println("------------------ FIN DU SETUP ------------------");
  Serial.setTimeout(10000);
}


void loop() {
  // Vérifie la connexion
  Serial.println(String(digitalRead(IRpin1))+"  -  "+String(digitalRead(IRpin2))+"  -  "+String(digitalRead(IRpin3))+"  -  "+String(digitalRead(IRpin4)));
  if (!client.connected()) {
    Serial.println("//// \\\\ //// PAS DE CONNEXION \\\\ //// \\\\");
    CONNECTED = false;  
    setup();
  }
  else {
    question = client.readStringUntil('#');
    if (question == "datas") {
      client.print("41"+String(digitalRead(IRpin1))+"42"+String(digitalRead(IRpin2))+"43"+String(digitalRead(IRpin3))+"44"+String(digitalRead(IRpin4)));
    }
    else {
    }    
    delay(100);
    question = "";
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
    Serial.println(String(digitalRead(IRpin1))+"   "+String(digitalRead(IRpin2))+"   "+String(digitalRead(IRpin3))+"   "+String(digitalRead(IRpin4)));

    // On utilise la classe WiFiClient pour créer une connexion TCP avec le raspberry
    const int httpPort = 50000;
    if (!client.connect(host, httpPort)) {
      Serial.println("SERVEUR NON VISIBLE");
      delay(1000);
      return;
    }
    else {
      Serial.println("CONNECTE AU SERVEUR");
      CONNECTED = true;
    }
  }
}
