/*
 *  Simple HTTP get webclient test
 */
 
#include <ESP8266WiFi.h>
 
const char* ssid     = "Wifi_Polinno";
const char* password = "ladpgeregrave";
const char* host = "192.168.150.9";

String reponse;
WiFiClient client; 
bool CONNECTED = false;

void setup() {
  Serial.begin(115200);
  delay(1000);
 
  Serial.println("-----------------------------------");
  // We start by connecting to a WiFi network
  while (!CONNECTED) {
    Serial.print("Connecting ...");
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("WiFi connected");  
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    // Use WiFiClient class to create TCP connections
  
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
  Serial.println("-----------------------------------");
}
 
void loop() {
  if ( !client.connected() ){
    CONNECTED = false;
    setup();
  }
  delay(500);
  reponse = client.readStringUntil('#');
  if (reponse == ""){  
    // Le code envoyé est : XX;Y avec XX le  numéro de Box et Y son état (0 vide, 1 occupé, autre = incertain)
    // Pas de capteur IR donc j'envoi toujours la même information
    client.print("01;0");
  }
  else {
    int tps_attente = 2;
    Serial.println("J'attends 2 secondes");
    client.print("ok");
    delay(tps_attente*1000);
    Serial.println("Je me reveille");
  }
}
