import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnk3WDks8fCY0ig2Z4j5DtrblcMIl7BqU",
  authDomain: "smart-refrigerator-monitoring.firebaseapp.com",
  databaseURL: "https://smart-refrigerator-monitoring-default-rtdb.firebaseio.com",
  projectId: "smart-refrigerator-monitoring",
  storageBucket: "smart-refrigerator-monitoring.firebasestorage.app",
  messagingSenderId: "86963707706",
  appId: "1:86963707706:web:91402f4db6666ada01ba03",
  measurementId: "G-JYTCPZNGXL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
