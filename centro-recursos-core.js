import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("⚙️ Centro Recursos Core cargado");

function mostrar(id, visible) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  elemento.style.display = visible ? "" : "none";
}

async function obtenerUsuarioActual(user) {
  if (!user) {
    return {
      autenticado: false,
      uid: null,
      email: null,
      rol: "visitante",
      esAdmin: false
    };
  }

  const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

  const refUsuario = doc(db, "usuarios", user.uid);
  const snapUsuario = await getDoc(refUsuario);
  const dataUsuario = snapUsuario.exists() ? snapUsuario.data() : {};

  const rol =
    user.email === ADMIN_EMAIL
      ? "admin"
      : (dataUsuario.rol || "visitante");

  return {
    autenticado: true,
    uid: user.uid,
    email: user.email,
    rol,
    esAdmin: rol === "admin"
  };
}

function puedeAbrirRecursos(usuario) {
  return (
    usuario.esAdmin ||
    usuario.rol === "profesional" ||
    usuario.rol === "biblioteca"
  );
}

async function cargarConfiguracion() {
  const ref = doc(db, "configuracion", "general");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.log("⚠️ No existe configuracion/general");
    return null;
  }

  return snap.data();
}

function aplicarConfiguracion(config) {
  const componentes = [
    ["bloqueDestacado", config.mostrarDestacado],
    ["bloqueColeccion", config.mostrarColeccion],
    ["bloqueBuscador", config.mostrarBuscador],
    ["bloqueContadores", config.mostrarContadores],
    ["bloqueFiltros", config.mostrarFiltros],
    ["bloqueRecursos", true]
  ];

  componentes.forEach(([id, visible]) => {
    mostrar(id, visible);
  });
}

onAuthStateChanged(auth, async (user) => {
  try {
    const usuario = await obtenerUsuarioActual(user);
    const config = await cargarConfiguracion();

    window.centroRecursosUsuario = usuario;
    window.centroRecursosPuedeAbrir = puedeAbrirRecursos(usuario);


const nombreUsuarioBarra = document.getElementById("nombreUsuarioBarra");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (nombreUsuarioBarra) {
  nombreUsuarioBarra.textContent = usuario.autenticado
   ? `👤 ${usuario.rol}`
    : "Visitante";
}

if (btnCerrarSesion) {
  btnCerrarSesion.style.display = usuario.autenticado ? "inline-block" : "none";

  btnCerrarSesion.onclick = async () => {
    await auth.signOut();
    window.location.href = "biblioteca-profesional.html";
  };
}


    console.log("👤 Usuario Centro Recursos:", usuario);
    console.log("🔐 Puede abrir recursos:", puedeAbrirRecursos(usuario));
    console.log("⚙️ Configuración Centro Recursos:", config);

    if (config) {
      aplicarConfiguracion(config);
    }

window.dispatchEvent(new CustomEvent("centroRecursosListo", {
  detail: {
    usuario,
    config,
    puedeAbrir: puedeAbrirRecursos(usuario)
  }
}));



  } catch (error) {
    console.error("❌ Error en Centro Recursos Core:", error);
  }
});