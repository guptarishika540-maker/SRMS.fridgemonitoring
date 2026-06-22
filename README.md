# 🥶 Smart Refrigerator Monitoring System

A Smart Refrigerator Monitoring System built using ESP32, Firebase Realtime Database, Firebase Authentication, and a Web Dashboard.

The system monitors refrigerator conditions in real time, provides alerts, tracks inventory, and stores data securely in the cloud.

---

## 🚀 Features

### 🌡 Temperature Monitoring
- Real-time temperature monitoring using DHT11 sensor.
- Data uploaded to Firebase Realtime Database.

### 💧 Humidity Monitoring
- Continuously tracks humidity levels.

### 🚪 Door Monitoring
- Door status simulation using push button.
- Detects OPEN/CLOSED state.

### 🔔 Alert System
- Manual alert generation.
- Door-open warning alerts.
- Real-time notifications.

### 📢 Buzzer Warning
- Buzzer activates when the refrigerator door remains open for more than 10 seconds.

### 📦 Inventory Management
- Add and manage food items.
- Track quantities and expiry dates.

### ☁ Firebase Integration
- Firebase Realtime Database
- Firebase Authentication

### 🌐 Web Dashboard
- Real-time monitoring dashboard
- Inventory management
- Alerts and notifications
- Analytics page

---

# 🏗 System Architecture

ESP32 + DHT11 + Buttons
        ↓
      WiFi
        ↓
Firebase Realtime Database
        ↓
Web Dashboard
        ↓
       User

---

# 🛠 Hardware Components

- ESP32 Dev Module
- DHT11 Temperature & Humidity Sensor
- Alert Push Button
- Clear Alert Push Button
- Door Status Push Button
- Active Buzzer
- Breadboard
- Jumper Wires

---

# 🔌 Hardware Connections

| Component | ESP32 Pin |
|------------|------------|
| DHT11 Data | GPIO4 |
| Alert Button | GPIO18 |
| Clear Alert Button | GPIO19 |
| Door Button | GPIO23 |
| Buzzer | GPIO22 |

---

# 📂 Project Structure

```text
.
├── About.html
├── Alerts.html
├── Analytics.html
├── Dashboard.html
├── Inventory.html
├── auth-guard.js
├── firebase-init.js
├── home.html
├── index.html
├── login.html
├── navigation.js
└── refrigerator.ino
```

---

# 📄 File Description

### refrigerator.ino
ESP32 firmware responsible for:
- Reading DHT11 sensor
- Monitoring buttons
- Controlling buzzer
- Uploading data to Firebase

### firebase-init.js
Firebase initialization and configuration.

### auth-guard.js
Handles Firebase Authentication and protected pages.

### login.html
User login page.

### Dashboard.html
Displays:
- Temperature
- Humidity
- Door Status
- Alert Status

### Inventory.html
Food inventory management.

### Alerts.html
Displays refrigerator alerts and notifications.

### Analytics.html
Displays monitoring analytics and statistics.

### navigation.js
Handles navigation between pages.

### About.html
Project information and documentation.

---

# 🔥 Firebase Database Structure

```json
{
  "sensor": {
    "temperature": 28,
    "humidity": 60,
    "doorStatus": "CLOSED",
    "alert": "NORMAL"
  },

  "notification": {
    "lastAlert": "NONE"
  },

  "inventory": {
    "milk": {
      "quantity": 2,
      "expiryDate": "2026-06-25"
    }
  }
}
```

---

# 🔄 Working

1. ESP32 connects to WiFi.
2. DHT11 reads temperature and humidity.
3. Sensor values are uploaded to Firebase.
4. Dashboard retrieves data from Firebase.
5. User can monitor refrigerator conditions remotely.
6. Door status is monitored using a push button.
7. If the door remains open for more than 10 seconds:
   - Buzzer activates
   - Alert is generated
   - Firebase updates instantly
8. Inventory items can be added through the website.
9. Expiry dates are tracked and displayed.

---

# 🌐 Live Website

**Dashboard URL:**

Replace with your deployed website URL:

```text
https://guptarishika540-maker.github.io/SRMS.fridgemonitoring/
```

---

# ☁ Firebase Project

Replace with your Firebase project URL:

```text
https://smart-refrigerator-monitoring-default-rtdb.firebaseio.com/
```

---

# 📸 Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Inventory Page
- Alerts Page
- Analytics Page
- Hardware Setup

---

# 🎯 Applications

- Smart Homes
- Hotels
- Restaurants
- Food Storage Units
- Healthcare Refrigeration Systems

---

# 🔮 Future Enhancements

- Mobile App
- Email Notifications
- SMS Alerts
- AI-based Food Recognition
- Camera Integration
- Predictive Inventory Management

---

# 📜 License

This project is intended for educational and research purposes.
