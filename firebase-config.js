// Firebase (CDN compatible con el Sistema FALCO®)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

/* =========================================================
   CONFIGURACIÓN FIREBASE
========================================================= */

export const firebaseConfig = {
  apiKey: "AIzaSyDrWRqbgWPNXb3IQP0S7YKC1zuS5DmtWj8",
  authDomain: "tests-psicologicos.firebaseapp.com",
  projectId: "tests-psicologicos",
  storageBucket: "tests-psicologicos.firebasestorage.app",
  messagingSenderId: "985283051227",
  appId: "1:985283051227:web:f284cdfaa970cbeb64d6fe"
};

/* =========================================================
   APP PRINCIPAL
========================================================= */

const app = initializeApp(firebaseConfig);

/* =========================================================
   SERVICIOS
========================================================= */

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* =========================================================
   EXPORTS
========================================================= */

export {
  auth,
  db,
  storage
};