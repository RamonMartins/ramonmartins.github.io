#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <U8g2lib.h>  // Biblioteca para o Display Oled
#include <Wire.h>     // Biblioteca para o Display Oled

const char* ssid = "ESP8266-AP";
const char* password = "password";
const int localUdpPort = 4210;  // Porta local para a comunicação UDP

WiFiUDP Udp;

U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /* clock=*/ 14, /* data=*/ 12, U8X8_PIN_NONE);

void setup() {
  u8g2.begin(); // Inicialize o display
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_7x14B_tr);
  u8g2.drawStr(45,20,"Master");
  u8g2.sendBuffer();

  Serial.begin(115200);
  Serial.println();
  Serial.println("Iniciando mestre...");

  // Inicializa o ponto de acesso (Access Point)
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid, password);

  Serial.println("Ponto de acesso (AP) iniciado:");
  Serial.print("Nome do SSID: ");
  Serial.println(ssid);
  Serial.print("Senha do AP: ");
  Serial.println(password);
  Serial.print("Endereço IP do mestre: ");
  Serial.println(WiFi.softAPIP());

  Udp.begin(localUdpPort);
  Serial.print("Porta local UDP: ");
  Serial.println(localUdpPort);
}

void loop() {
  // Verifica se há dados recebidos
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    // Lê os dados recebidos
    char packetBuffer[255];
    int len = Udp.read(packetBuffer, 255);
    if (len > 0) {
      packetBuffer[len] = 0;
    }
    // Imprime os dados recebidos na porta serial
    Serial.print("Dados recebidos do escravo: ");
    Serial.println(packetBuffer);
  }
  delay(10);
}
