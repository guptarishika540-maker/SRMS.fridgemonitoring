#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

// =========================
// WiFi Credentials
// =========================
#define WIFI_SSID "Rishika"
#define WIFI_PASSWORD "Rishika@540"

// =========================
// Firebase Credentials
// =========================
#define API_KEY "AIzaSyBnk3WDks8fCY0ig2Z4j5DtrblcMIl7BqU"

#define DATABASE_URL "smart-refrigerator-monitoring-default-rtdb.firebaseio.com"

#define USER_EMAIL "smartfridge@gmail.com"
#define USER_PASSWORD "SmartFridge123"

// =========================
// Hardware Pins
// =========================
#define DHTPIN 4
#define DHTTYPE DHT11

#define ALERT_BUTTON 18
#define CLEAR_BUTTON 19
#define DOOR_BUTTON 23
#define BUZZER 22

// =========================
// Objects
// =========================
DHT dht(DHTPIN, DHTTYPE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// =========================
// Variables
// =========================
unsigned long lastUpload = 0;
unsigned long lastHistoryUpload = 0;

unsigned long doorOpenStart = 0;

bool doorOpenFlag = false;
bool buzzerState = false;

// =========================
// Setup
// =========================
void setup()
{
  Serial.begin(115200);

  dht.begin();

  pinMode(ALERT_BUTTON, INPUT_PULLUP);
  pinMode(CLEAR_BUTTON, INPUT_PULLUP);
  pinMode(DOOR_BUTTON, INPUT_PULLUP);

  pinMode(BUZZER, OUTPUT);
  digitalWrite(BUZZER, LOW);

  // WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.println("WiFi Connected");

  // Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase Connected");

  Firebase.setString(fbdo,
                     "/sensor/sensorHealth",
                     "ONLINE");

  Firebase.setString(fbdo,
                     "/sensor/buzzer",
                     "LOW");

  Firebase.setString(fbdo,
                     "/sensor/doorStatus",
                     "CLOSED");
}

// =========================
// Loop
// =========================
void loop()
{
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  bool alertPressed = (digitalRead(ALERT_BUTTON) == LOW);
  bool clearPressed = (digitalRead(CLEAR_BUTTON) == LOW);
  bool doorPressed = (digitalRead(DOOR_BUTTON) == LOW);

  // =========================
  // Upload Sensor Data
  // =========================
  if (millis() - lastUpload > 5000)
  {
    lastUpload = millis();

    if (!isnan(temperature) && !isnan(humidity))
    {
      Firebase.setFloat(fbdo,
                        "/sensor/temperature",
                        temperature);

      Firebase.setFloat(fbdo,
                        "/sensor/humidity",
                        humidity);

      Firebase.setString(fbdo,
                         "/sensor/sensorHealth",
                         "ONLINE");

      Serial.print("Temperature: ");
      Serial.println(temperature);

      Serial.print("Humidity: ");
      Serial.println(humidity);
    }
    else
    {
      Firebase.setString(fbdo,
                         "/sensor/sensorHealth",
                         "ERROR");
    }
  }

  // =========================
  // Save Analytics History
  // Every 1 Minute
  // =========================
  if (millis() - lastHistoryUpload > 60000)
  {
    lastHistoryUpload = millis();

    FirebaseJson history;

    history.set("temperature", temperature);
    history.set("humidity", humidity);
    history.set("doorStatus",
                doorOpenFlag ? "OPEN" : "CLOSED");

    history.set("timestamp",
                millis());

    Firebase.pushJSON(fbdo,
                      "/history",
                      history);

    Serial.println("History Saved");
  }

  // =========================
  // Temperature Alert
  // =========================
  if (!isnan(temperature) && temperature > 10)
  {
    Firebase.setString(fbdo,
                       "/sensor/alert",
                       "TEMP HIGH");

    Firebase.setString(fbdo,
                       "/notification/lastAlert",
                       "Temperature High");

    FirebaseJson alertLog;

    alertLog.set("message",
                 "TEMP HIGH");

    alertLog.set("timestamp",
                 millis());

    Firebase.pushJSON(fbdo,
                      "/alertHistory",
                      alertLog);
  }

  // =========================
  // Alert Button
  // =========================
  if (alertPressed)
  {
    Firebase.setString(fbdo,
                       "/sensor/alert",
                       "MANUAL ALERT");

    Firebase.setString(fbdo,
                       "/notification/lastAlert",
                       "Manual Alert");

    FirebaseJson alertLog;

    alertLog.set("message",
                 "MANUAL ALERT");

    alertLog.set("timestamp",
                 millis());

    Firebase.pushJSON(fbdo,
                      "/alertHistory",
                      alertLog);

    Serial.println("Manual Alert");

    delay(500);
  }

  // =========================
  // Clear Button
  // =========================
  if (clearPressed)
  {
    Firebase.setString(fbdo,
                       "/sensor/alert",
                       "");

    Firebase.setString(fbdo,
                       "/notification/lastAlert",
                       "");

    Firebase.setString(fbdo,
                       "/sensor/buzzer",
                       "LOW");

    digitalWrite(BUZZER, LOW);

    Serial.println("Alert Cleared");

    delay(500);
  }

  // =========================
  // Door Open Monitoring
  // =========================
  if (doorPressed)
  {
    if (!doorOpenFlag)
    {
      doorOpenFlag = true;

      doorOpenStart = millis();

      Firebase.setString(fbdo,
                         "/sensor/doorStatus",
                         "OPEN");

      FirebaseJson doorEvent;

      doorEvent.set("event",
                    "OPEN");

      doorEvent.set("timestamp",
                    millis());

      Firebase.pushJSON(fbdo,
                        "/doorEvents",
                        doorEvent);

      Serial.println("Door Open");
    }

    if (millis() - doorOpenStart > 10000)
    {
      if (!buzzerState)
      {
        buzzerState = true;

        digitalWrite(BUZZER,
                     HIGH);

        Firebase.setString(fbdo,
                           "/sensor/buzzer",
                           "HIGH");

        Firebase.setString(fbdo,
                           "/sensor/alert",
                           "DOOR OPEN TOO LONG");

        Firebase.setString(fbdo,
                           "/notification/lastAlert",
                           "Door Open Too Long");

        FirebaseJson alertLog;

        alertLog.set("message",
                     "DOOR OPEN TOO LONG");

        alertLog.set("timestamp",
                     millis());

        Firebase.pushJSON(fbdo,
                          "/alertHistory",
                          alertLog);

        Serial.println("Door Open Too Long");
      }
    }
  }
  else
  {
    if (doorOpenFlag)
    {
      doorOpenFlag = false;

      Firebase.setString(fbdo,
                         "/sensor/doorStatus",
                         "CLOSED");

      Serial.println("Door Closed");
    }

    if (buzzerState)
    {
      buzzerState = false;

      digitalWrite(BUZZER,
                   LOW);

      Firebase.setString(fbdo,
                         "/sensor/buzzer",
                         "LOW");
    }
  }
}