// Firebase (CDN compatible con tu proyecto)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TU CONFIG REAL (la que copiaste)
const firebaseConfig = {
  apiKey: "AIzaSyDrWRqbgWPNXb3IQP0S7YKC1zuS5DmtWj8",
  authDomain: "tests-psicologicos.firebaseapp.com",
  projectId: "tests-psicologicos",
  storageBucket: "tests-psicologicos.firebasestorage.app",
  messagingSenderId: "985283051227",
  appId: "1:985283051227:web:f284cdfaa970cbeb64d6fe"
};

// Inicializar
const app = initializeApp(firebaseConfig);

// Servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar
export { auth, db };