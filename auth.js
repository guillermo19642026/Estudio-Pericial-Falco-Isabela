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

// 🔐 CONFIGURACIÓN ADMIN
const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

// ===== LOGIN =====
// Admin: sin límite
// Usuarios comunes: un solo uso
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

    // 🔐 ADMIN SIN LÍMITE
    if (user.email !== ADMIN_EMAIL) {

      // 🔥 BLOQUEO DE USO ÚNICO PARA USUARIOS COMUNES
      if (snap.exists() && snap.data().usado === true) {
        if (errorBox) errorBox.textContent = "Este usuario ya fue utilizado.";
        await signOut(auth);
        return;
      }

      // ✔ MARCAR COMO USADO SOLO USUARIOS COMUNES
      await setDoc(ref, {
        email: user.email,
        usado: true,
        fechaUso: new Date().toISOString()
      }, { merge: true });

    }

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

// ===== PROTEGER PÁGINAS + CONTROL ADMIN =====
onAuthStateChanged(auth, (user) => {
  const pagina = window.location.pathname.toLowerCase();

  const esLogin =
    pagina.includes("login.html") ||
    pagina.endsWith("/");

  const esAdminPanel = pagina.includes("admin-resultados.html");

  // 🔒 SI NO ESTÁ LOGUEADO → LOGIN
  if (!user && !esLogin) {
    window.location.href = "login.html";
    return;
  }

  // 🔒 SI NO ES ADMIN → BLOQUEAR PANEL
  if (user && esAdminPanel && user.email !== ADMIN_EMAIL) {
    alert("No tenés permisos para acceder a esta sección.");
    window.location.href = "dashboard.html";
    return;
  }

  // 👁️ MOSTRAR / OCULTAR BOTONES ADMIN
const btnResultados = document.getElementById("btnResultados");
const btnPostulaciones = document.getElementById("btnPostulaciones");
const btnMesaEntrada = document.getElementById("btnMesaEntrada");
const btnArchivoPericial = document.getElementById("btnArchivoPericial");
const dashboardMetricas = document.getElementById("dashboardMetricas");

if (user && user.email === ADMIN_EMAIL) {

  if (btnResultados) {
    btnResultados.style.display = "flex";
  }

  if (btnPostulaciones) {
    btnPostulaciones.style.display = "flex";
  }

  if (btnMesaEntrada) {
  btnMesaEntrada.style.display = "flex";
  }


  if (dashboardMetricas) {
  dashboardMetricas.style.display = "grid";
}

if (btnArchivoPericial) {
  btnArchivoPericial.style.display = "flex";
}



} else {

  if (btnResultados) {
    btnResultados.style.display = "none";
  }

  if (btnPostulaciones) {
    btnPostulaciones.style.display = "none";
  }

  if (btnMesaEntrada) {
  btnMesaEntrada.style.display = "none";
  }


  if (dashboardMetricas) {
  dashboardMetricas.style.display = "none";
}


if (btnArchivoPericial) {
  btnArchivoPericial.style.display = "none";
}



}
});