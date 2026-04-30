import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrWRqbgWPNXb3IQP0S7YKC1zuS5DmtWj8",
  authDomain: "tests-psicologicos.firebaseapp.com",
  projectId: "tests-psicologicos",
  storageBucket: "tests-psicologicos.firebasestorage.app",
  messagingSenderId: "985283051227",
  appId: "1:985283051227:web:f284cdfaa970cbeb64d6fe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };