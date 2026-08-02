import { ICONOS } from "./iconos.js";
import { MODULOS } from "./modulos.js";
import { KPIS } from "./kpis.js";
import { ACCESOS_RAPIDOS } from "./accesos.js";
import { ACTIVIDAD } from "./actividad.js";
import { BIENVENIDAS } from "./bienvenida.js";

import {
  filtrarGruposPorPermisos,
  filtrarAccesosPorPermisos
} from "./permisos.js";

export function renderCentroOperaciones(
  rol,
  permisos = null
) {
  renderMensajeBienvenida(rol);
  renderKPIs(rol);
  renderModulos(rol, permisos);
  renderAccesosRapidos(rol, permisos);
  renderActividadYNotificaciones(rol);
}

function renderMensajeBienvenida(rol) {
  const mensaje = document.getElementById("mensajeBienvenida");
  if (!mensaje) return;

  mensaje.textContent = BIENVENIDAS[rol] || BIENVENIDAS.default;
}

function renderKPIs(rol) {
  const datos = KPIS[rol] || KPIS.default;

  document.getElementById("kpiUsuarios").textContent = datos.usuarios;
  document.getElementById("kpiBiblioteca").textContent = datos.biblioteca;
  document.getElementById("kpiEvaluaciones").textContent = datos.evaluaciones;
  document.getElementById("kpiCursos").textContent = datos.cursos;
}

function crearTarjetaModulo(modulo) {
  const card = document.createElement("article");
  card.className = "co-module-card";

  const icono = ICONOS[modulo.titulo] || "◆";
  const estado = modulo.estado || "disponible";

  card.innerHTML = `
    <div>
      <div class="co-module-icon">${icono}</div>

      <span class="co-module-status co-status-${estado}">
        ${traducirEstado(estado)}
      </span>

      <strong>${modulo.titulo}</strong>
      <p>${modulo.descripcion}</p>
    </div>

    <a href="${modulo.url}" class="co-module-link">
      Ingresar →
    </a>
  `;

  return card;
}

function traducirEstado(estado) {
  const estados = {
    disponible: "Disponible",
    nuevo: "Nuevo",
    desarrollo: "En desarrollo",
    mantenimiento: "Mantenimiento"
  };

  return estados[estado] || "Disponible";
}

function renderModulos(
  rol,
  permisos = null
) {
  const contenedor =
    document.getElementById("modulosUsuario");

  const buscador =
    document.getElementById("buscadorModulos");

  if (!contenedor) return;

  const gruposBase =
    MODULOS[rol] || [];

  const grupos =
    filtrarGruposPorPermisos(
      gruposBase,
      rol,
      permisos
    );

  function pintar(filtro = "") {
    contenedor.innerHTML = "";

    const texto = filtro.trim().toLowerCase();

    grupos.forEach((grupo) => {
      const itemsFiltrados = grupo.items.filter((modulo) => {
        return (
          modulo.titulo.toLowerCase().includes(texto) ||
          modulo.descripcion.toLowerCase().includes(texto) ||
          grupo.seccion.toLowerCase().includes(texto)
        );
      });

      if (!itemsFiltrados.length) return;

      const bloque = document.createElement("section");
      bloque.className = "co-module-group";

      const tituloGrupo = document.createElement("h3");
      tituloGrupo.className = "co-module-group-title";
      tituloGrupo.textContent = grupo.seccion;

      const grid = document.createElement("div");
      grid.className = "co-grid";

      itemsFiltrados.forEach((modulo) => {
        grid.appendChild(crearTarjetaModulo(modulo));
      });

      bloque.appendChild(tituloGrupo);
      bloque.appendChild(grid);
      contenedor.appendChild(bloque);
    });

    if (!contenedor.innerHTML.trim()) {
      contenedor.innerHTML = `
        <div class="co-empty-state">
          <h3>No se encontraron módulos</h3>
          <p>Probá buscar por otro nombre, área o herramienta.</p>
        </div>
      `;
    }
  }

  pintar();

  if (buscador) {
    buscador.oninput = () => pintar(buscador.value);
  }
}





function renderAccesosRapidos(
  rol,
  permisos = null
) {
  const contenedor =
    document.getElementById("accesosRapidos");

  if (!contenedor) return;

  const accesosBase =
    ACCESOS_RAPIDOS[rol] || [];

  const accesos =
    filtrarAccesosPorPermisos(
      accesosBase,
      rol,
      permisos
    );

  contenedor.innerHTML = "";

  accesos.forEach(([titulo, url]) => {
    const link =
      document.createElement("a");

    link.href = url;
    link.textContent = titulo;

    if (url.includes("wa.me")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    contenedor.appendChild(link);
  });

  if (!accesos.length) {
    contenedor.innerHTML = `
      <span class="co-empty-access">
        No hay accesos rápidos habilitados.
      </span>
    `;
  }
}

function renderActividadYNotificaciones(rol) {
  const actividad = document.getElementById("actividadReciente");
  const notificaciones = document.getElementById("notificacionesSistema");

  if (!actividad || !notificaciones) return;

  const datos = ACTIVIDAD[rol] || ACTIVIDAD.default;

  actividad.innerHTML = datos.actividad
    .map((item) => `<li>${item}</li>`)
    .join("");

  notificaciones.innerHTML = datos.notificaciones
    .map((item) => `<li>${item}</li>`)
    .join("");
}