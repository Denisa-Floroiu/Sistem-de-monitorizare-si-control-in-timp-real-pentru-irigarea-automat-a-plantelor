#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "DHT.h"
#include <Adafruit_Sensor.h>
#include "time.h"
#include <string.h>

// Definirea pinului pentru senzorul DHT22
#define dht_dpin 4

// Definirea tipului de senzor DHT22
#define DHTTYPE DHT22

// Inițializarea obiectului DHT pentru citirea temperaturii și umidității
DHT dht(dht_dpin, DHTTYPE);

// Pinul analog pentru citirea nivelului apei
const int waterLevelPin = A0;

// Pinul digital pentru citirea umidității solului
const int soilMoisturePin = D5;

const int RELAY_PIN = D1;

const char* ntpServer = "pool.ntp.org";  // Serverul NTP pentru sincronizarea timpului
const long gmtOffset_sec = 10800;        // Diferența de fus orar GMT (în secunde)
const int daylightOffset_sec = 0;        // Diferența de fus orar pentru ora de vară (în secunde)

const char* ssid = "414";           // Numele rețelei Wi-Fi
const char* password = "67489275";  // Parola rețelei Wi-Fi

String serverName = "http://192.168.0.117";  // Adresa IP a serverului

void setup() {
  // Inițializarea comunicării seriale
  Serial.begin(9600);
  // Inițializarea senzorului DHT22
  dht.begin();
  // Setarea pinului de umiditate a solului ca intrare
  pinMode(soilMoisturePin, INPUT);
  // Setarea pinului de la releu ca ieșire
  pinMode(RELAY_PIN, OUTPUT);
  //Oprire pompă
  digitalWrite(RELAY_PIN, HIGH);

  // Conectarea la rețeaua WiFi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectare la rețeaua WiFi...");
  }

  Serial.println("Conectare WiFi realizată cu succes!");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {

  char date[12];
  char time[9];
  char targetTime[] = "08:00:00";

  // Obțineți data și ora locală formatate
  getLocalDateTime(date, time);

  // Afișați data și ora
  Serial.print("Date: ");
  Serial.println(date);
  Serial.print("Time: ");
  Serial.println(time);

  // Citirea valorii nivelului de apă
  int waterLevelValue = analogRead(waterLevelPin);

  // Citirea valorii de umiditate a solului
  int soilMoisture = digitalRead(soilMoisturePin);

  // Afișarea valorii nivelului de apă
  Serial.print("Valoarea nivelului de apă: ");
  Serial.println(waterLevelValue);

  // Afișarea stării solului (uscăt/umed)
  if (soilMoisture == HIGH) {
    Serial.print("Solul este uscat, avem valoarea: ");
    Serial.println(soilMoisture);
  } else {
    Serial.print("Solul este umed, avem valoarea: ");
    Serial.println(soilMoisture);
  }

  // Citirea valorii de umiditate și temperatură de la senzorul DHT22
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Verificarea dacă citirea s-a efectuat cu succes
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Eroare la citirea senzorului!");
    return;
  }

  // Afișarea valorii de temperatură și umiditate
  Serial.print("Temperatura: ");
  Serial.print(temperature);
  Serial.print(" °C");

  Serial.print("   Umiditate: ");
  Serial.print(humidity);
  Serial.println(" %");

  // Așteptarea pentru următoarea citire
  delay(2000);

  // Trimite datele către baza de date
  sendToDB("Licenta/insertDate", soilMoisture, temperature, humidity, waterLevelValue, 1, 0, 0, 0);

  delay(20000);
  int status, timer;
  char data[12];

  // Obține starea pompei ,timer-ul, si data selectată de la server
  getPumpStatusAndTimer("Licenta/ckech_pump_state.php", status, timer, data);

  //Afișare data selectată
  Serial.print("Data: ");
  Serial.println(data);

  //Verifică dacă există suficientă apă în rezervor
  if (waterLevelValue > 100) {
    // Procesare și utilizare date
    // Verifică starea pompei și controlează pornirea/oprirea pompei
    if (status == 1 && timer == 1 && strcmp(data, date) == 0 && isTimeEqualTo(time, targetTime) ) {
      // Se verifică condițiile pentru pornirea pompei
      Serial.println("Pompa este pornită când timer=1 (udare o dată pe zi) și este ora 8");

      // Pornirea pompei
      digitalWrite(RELAY_PIN, LOW);
      delay(3000);  // Se așteaptă 3 secunde

      // Oprirea pompei
      digitalWrite(RELAY_PIN, HIGH);

      // Actualizarea datei
      addDays(data, timer);

      // Afișarea datei actualizate
      Serial.print("Data actualizată: ");
      Serial.println(data);

      // Trimite informațiile actualizate la baza de date
      sendToDB("Licenta/Update_data_noua", 0, 0, 0, 0, 1, status, timer, data);
    } else if (status == 1 && timer == 3 && strcmp(data, date) == 0 && isTimeEqualTo(time, targetTime)) {
      // Se verifică condițiile pentru pornirea pompei
      Serial.println("Pompa este pornită când timer=3 și este ora 8");

      // Pornirea pompei
      digitalWrite(RELAY_PIN, LOW);
      delay(3000);

      // Oprirea pompei
      digitalWrite(RELAY_PIN, HIGH);

      // Actualizarea datei
      addDays(data, timer);

      // Afișarea datei actualizate
      Serial.print("Data actualizată: ");
      Serial.println(data);

      // Trimite informațiile actualizate la baza de date
      sendToDB("Licenta/Update_data_noua", 0, 0, 0, 0, 1, status, timer, data);
    } else if (status == 1 && timer == 7 && strcmp(data, date) == 0 && isTimeEqualTo(time, targetTime)) {
      // Se verifică condițiile pentru pornirea pompei
      Serial.println("Pompa este pornită când timer=7 și este ora 8");

      // Pornirea pompei
      digitalWrite(RELAY_PIN, LOW);
      delay(3000);

      // Oprirea pompei
      digitalWrite(RELAY_PIN, HIGH);

      // Actualizarea datei
      addDays(data, timer);

      // Afișarea datei actualizate
      Serial.print("Data actualizată: ");
      Serial.println(data);

      // Trimite informațiile actualizate la baza de date
      sendToDB("Licenta/Update_data_noua", 0, 0, 0, 0, 1, status, timer, data);
    } else if (status == 1 && timer == 9 && isTimeEqualTo(time, targetTime)) {
      // Se verifică condițiile pentru pornirea pompei
      Serial.println("Pompa este pornită când este selectată doar data, nu și intervalul de timp, și este ora 8");

      // Pornirea pompei
      digitalWrite(RELAY_PIN, LOW);
      delay(3000);

      // Oprirea pompei
      digitalWrite(RELAY_PIN, HIGH);

      // Trimite informațiile actualizate la baza de date
      sendToDB("Licenta/Update_state", 0, 0, 0, 0, 1, 0, timer, data);
    } else if (status == 1 && timer == 0) {
      // Se verifică condițiile pentru pornirea pompei
      Serial.println("Pompa este pornită când butonul este activat");

      // Pornirea pompei
      digitalWrite(RELAY_PIN, LOW);
      delay(3000);

      // Oprirea pompei
      digitalWrite(RELAY_PIN, HIGH);

      // Trimite informațiile actualizate la baza de date
      sendToDB("Licenta/Update_state", 0, 0, 0, 0, 1, 0, timer, data);
    } else if (status == 1 && timer == 2) {
      // Se verifică condițiile pentru pornirea pompei
      Serial.println("Pompa este pornită pentru udare automată");

      if (soilMoisture == 1 && temperature < 30) {
        // Pornirea pompei
        digitalWrite(RELAY_PIN, LOW);
        delay(3000);

        // Oprirea pompei
        digitalWrite(RELAY_PIN, HIGH);

      } else {
        Serial.println("Floarea are condițiile optime pentru a se dezvolta cum trebuie");
      }
    } else if (status == 0 && timer == 0) {
      Serial.println("Pompa este oprită când butonul este dezactivat");
      digitalWrite(RELAY_PIN, HIGH);
    } else {
      // Cazul implicit
    }
  } else {
    Serial.println("Nu există suficientă apă în rezervor");
  }
}
//Funcție pentru trimiterea datelor de la senzori la baza de date
void sendToDB(const char* apiPath, float umiditateSol, float temperatura, float umiditateAer, float NivelApa, int sensor_id, int state, int timmer, char* data) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    // Construirea adresei URL
    String path = serverName + "/" + apiPath + ".php?Umiditate_sol=" + String(umiditateSol) + "&Umiditate_aer=" + String(umiditateAer) + "&Temperatura=" + String(temperatura)
                  + "&NivelApa=" + String(NivelApa) + "&IdSensor=" + String(sensor_id) + "&state=" + String(state) + "&timmer=" + String(timmer) + "&data=" + String(data);

    Serial.println(path);

    // Inițierea conexiunii HTTP
    bool httpbegin = http.begin(client, path);
    Serial.println(httpbegin);

    // Trimiterea cererii HTTP GET
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      // Răspunsul HTTP este valid
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
      Serial.println(" ");
    } else {
      // Răspunsul HTTP este invalid
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    // Eliberarea resurselor
    http.end();
  } else {
    // Conexiunea WiFi nu este activă
    Serial.println("WiFi Disconnected");
  }
}

void getLocalDateTime(char* date, char* time1) {
  time_t rawtime;       // Variabila pentru timpul curent in format raw (timestamp)
  struct tm* timeinfo;  // Structura pentru a stoca informatii despre timpul local

  time(&rawtime);                  // Obține timpul curent
  timeinfo = localtime(&rawtime);  // Converteste timpul curent la timpul local

  // Obține componentele individuale ale datei și orei
  int year = timeinfo->tm_year + 1900;  // Anul (trebuie adăugat 1900)
  int month = timeinfo->tm_mon + 1;     // Luna (indicele începe de la 0, deci trebuie adăugat 1)
  int day = timeinfo->tm_mday;          // Ziua
  int hour = timeinfo->tm_hour;         // Ora
  int minute = timeinfo->tm_min;        // Minutul
  int second = timeinfo->tm_sec;        // Secunda

  // Formatează valorile în șirurile de caractere corespunzătoare
  sprintf(date, "%04d-%02d-%02d", year, month, day);       // Formatează data în șirul "YYYY-MM-DD"
  sprintf(time1, "%02d:%02d:%02d", hour, minute, second);  // Formatează ora în șirul "HH:MM:SS"
}

bool isTimeEqualTo(const char* time1, const char* targetTime) {
  int currentHour, currentMinute;
  int targetHour, targetMinute;

  // Extrageți orele și minutele din șirurile de caractere
  sscanf(time1, "%d:%d", &currentHour, &currentMinute);
  sscanf(targetTime, "%d:%d", &targetHour, &targetMinute);

  // Comparați orele și minutele
  return (currentHour == targetHour && currentMinute == targetMinute);
}
void addDays(char* date, int numDays) {
  // Extrage componentele individuale ale datei
  int year, month, day;
  sscanf(date, "%d-%d-%d", &year, &month, &day);

  // Adaugă numDays la ziua curentă
  day += numDays;

  // Verifică și ajustează luna și anul dacă este necesar
  while (day > 31) {
    if (month == 2) {
      // Februarie are maxim 29 de zile în cazul anilor bisecți
      if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        if (day > 29) {
          day -= 29;
          month++;
        }
      } else {
        // Anul nu este bisect, februarie are 28 de zile
        day -= 28;
        month++;
      }
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      // Luna aprilie, iunie, septembrie, noiembrie are 30 de zile
      day -= 30;
      month++;
    } else {
      // Restul lunilor au 31 de zile
      day -= 31;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }

  // Actualizează șirul de caractere cu noua dată
  sprintf(date, "%04d-%02d-%02d", year, month, day);
}
//Funcție care extrage anumite date din baza de date
void getPumpStatusAndTimer(const char* apiPath, int& status, int& timer, char* data) {
  // Creează obiectul HTTPClient
  HTTPClient http;
  WiFiClient client;

  // Construiește URL-ul cererii HTTP GET
  String url = serverName + "/" + apiPath;
  Serial.println(url);

  // Trimite cererea HTTP GET și primește răspunsul
  bool httpbegin = http.begin(client, url);
  Serial.println(httpbegin);

  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    // Citirea răspunsului HTTP
    String response = http.getString();
    Serial.println(response);

    // Extrage statusul, timer-ul și datele din răspunsul HTTP
    status = response.substring(0, response.indexOf(',')).toInt();
    timer = response.substring(response.indexOf(',') + 1, response.lastIndexOf(',')).toInt();
    response.substring(response.lastIndexOf(',') + 1).toCharArray(data, 12);
  } else {
    Serial.printf("Cerere HTTP eșuată cu cod de răspuns: %d\n", httpCode);
  }

  // Eliberare resurse HTTP
  http.end();
}
