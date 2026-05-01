import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== LOGIN DE UN SOLO USO =====
window.login = async function () {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const errorBox = document.getElementById("error");

  if (errorBox) errorBox.textContent = "";

  if (!email || !password) {
    if (errorBox) errorBox.textContent = "Ingrese email y contraseña.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().usado === true) {
      if (errorBox) errorBox.textContent = "Este usuario ya fue utilizado.";
      await signOut(auth);
      return;
    }

    await setDoc(ref, {
      email: user.email,
      usado: true,
      fechaUso: new Date().toISOString()
    }, { merge: true });

    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    if (errorBox) {
      errorBox.textContent = "No se pudo iniciar sesión. Revisá usuario, contraseña o permisos.";
    }
  }
};

// ===== LOGOUT =====
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ===== PROTEGER PÁGINAS =====
onAuthStateChanged(auth, user => {
  const pagina = window.location.pathname.toLowerCase();
  const esLogin = pagina.includes("login.html") || pagina.endsWith("/");

  if (!user && !esLogin) {
    window.location.href = "login.html";
  }
});