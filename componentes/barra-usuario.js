import { auth } from "../firebase-config.js";

export function renderBarraUsuario(usuario) {
  const nombreUsuarioBarra = document.getElementById("nombreUsuarioBarra");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  if (!nombreUsuarioBarra) return;

  const estados = {
    visitante: {
      texto: "🔓 Acceso público",
      detalle: "Vista de catálogo"
    },
    biblioteca: {
      texto: "📚 Biblioteca Profesional",
      detalle: "Acceso a recursos"
    },
    profesional: {
      texto: "👨‍⚖️ Profesional",
      detalle: "Área profesional"
    },
    admin: {
      texto: "⚙️ Administrador",
      detalle: "Acceso completo"
    }
  };

  const estado = estados[usuario.rol] || estados.visitante;

  nombreUsuarioBarra.innerHTML = `
    <span class="barra-estado-titulo">${estado.texto}</span>
    <small class="barra-estado-detalle">${estado.detalle}</small>
  `;

  if (btnCerrarSesion) {
    btnCerrarSesion.textContent = usuario.autenticado
      ? "Cerrar sesión"
      : "Iniciar sesión";

    btnCerrarSesion.style.display = "inline-block";

    btnCerrarSesion.onclick = async () => {
      if (usuario.autenticado) {
        await auth.signOut();
        window.location.href = "biblioteca-profesional.html";
      } else {
        window.location.href = "login.html?destino=biblioteca";
      }
    };
  }
}