import { auth, db } from "../firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

const formLogin = document.getElementById("formLoginEcosistema");

const btnMostrarRecuperacion =
  document.getElementById("btnMostrarRecuperacion");

const panelRecuperacion =
  document.getElementById("panelRecuperacion");

const recoveryEmail =
  document.getElementById("recoveryEmail");

const btnEnviarRecuperacion =
  document.getElementById("btnEnviarRecuperacion");

const btnCancelarRecuperacion =
  document.getElementById("btnCancelarRecuperacion");


  function mostrarRecuperacion() {
  if (!panelRecuperacion) {
    return;
  }

  panelRecuperacion.hidden = false;

  const emailLogin =
    document.getElementById("email")
      ?.value
      .trim();

  if (
    recoveryEmail &&
    emailLogin
  ) {
    recoveryEmail.value =
      emailLogin;
  }

  recoveryEmail?.focus();
}


function ocultarRecuperacion() {
  if (!panelRecuperacion) {
    return;
  }

  panelRecuperacion.hidden = true;

  if (recoveryEmail) {
    recoveryEmail.value = "";
  }
}


async function enviarRecuperacion() {
  const email =
    String(
      recoveryEmail?.value || ""
    )
      .trim()
      .toLowerCase();

  if (!email) {
    alert(
      "Ingrese el correo electrónico asociado a su cuenta."
    );

    recoveryEmail?.focus();
    return;
  }

  if (!recoveryEmail?.checkValidity()) {
    alert(
      "Ingrese un correo electrónico válido."
    );

    recoveryEmail?.focus();
    return;
  }

  const textoOriginal =
    btnEnviarRecuperacion?.textContent ||
    "Enviar enlace";

  if (btnEnviarRecuperacion) {
    btnEnviarRecuperacion.disabled = true;
    btnEnviarRecuperacion.textContent =
      "Enviando...";
  }

  try {
    auth.languageCode = "es";

    await sendPasswordResetEmail(
      auth,
      email
    );

    alert(
      "Si el correo está registrado, recibirá un enlace para crear una nueva contraseña."
    );

    ocultarRecuperacion();

  } catch (error) {
    console.error(
      "FALCO® Login: error al recuperar contraseña.",
      error
    );

    const mensajes = {
      "auth/invalid-email":
        "El correo electrónico no es válido.",

      "auth/too-many-requests":
        "Se realizaron demasiadas solicitudes. Intente nuevamente más tarde.",

      "auth/network-request-failed":
        "No fue posible conectarse con Firebase. Revise su conexión."
    };

    alert(
      mensajes[error?.code] ||
      "No fue posible enviar el enlace de recuperación."
    );

  } finally {
    if (btnEnviarRecuperacion) {
      btnEnviarRecuperacion.disabled = false;
      btnEnviarRecuperacion.textContent =
        textoOriginal;
    }
  }
}

btnMostrarRecuperacion?.addEventListener(
  "click",
  mostrarRecuperacion
);

btnCancelarRecuperacion?.addEventListener(
  "click",
  ocultarRecuperacion
);

btnEnviarRecuperacion?.addEventListener(
  "click",
  enviarRecuperacion
);

recoveryEmail?.addEventListener(
  "keydown",
  async (evento) => {
    if (evento.key !== "Enter") {
      return;
    }

    evento.preventDefault();
    await enviarRecuperacion();
  }
);



formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Ingrese email y contraseña.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);
    const dataUsuario = snap.exists() ? snap.data() : {};



if (dataUsuario.archivado === true) {
  alert(
    "Este usuario se encuentra archivado. Comuníquese con la administración del Sistema FALCO®."
  );

  await signOut(auth);
  return;
}


    const rol =
      user.email === ADMIN_EMAIL
        ? "admin"
        : (dataUsuario.rol || "periciado");

    if (!rol) {
      alert("Este usuario no tiene un rol asignado.");
      await signOut(auth);
      return;
    }

    if (rol === "periciado" && snap.exists() && dataUsuario.usado === true) {
      alert("Este usuario ya fue utilizado.");
      await signOut(auth);
      return;
    }

    localStorage.setItem("falcoUidUsuario", user.uid);
    localStorage.setItem("falcoRolUsuario", rol);
    localStorage.setItem("falcoEmailUsuario", user.email);

    window.location.href = "centro-operaciones/centro-operaciones.html";

  } catch (error) {
    console.error(error);
    alert("Correo o contraseña incorrectos.");
  }
});