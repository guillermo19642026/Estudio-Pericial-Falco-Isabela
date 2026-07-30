/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Dashboard
   Versión 1.0
========================================================= */

"use strict";


const FalcoComunidadDashboard = {

  indicadores: {
    solicitudes: 0,
    instituciones: 0,
    reuniones: 0,
    proyectos: 0
  },


  init() {

    this.cargarIndicadores();
    this.configurarAcciones();

    console.info(
      "FALCO Comunidad Dashboard™ v1.0 Ready"
    );

  },


  cargarIndicadores() {

    this.actualizarIndicador(
      "totalSolicitudes",
      this.indicadores.solicitudes
    );

    this.actualizarIndicador(
      "totalInstituciones",
      this.indicadores.instituciones
    );

    this.actualizarIndicador(
      "totalReuniones",
      this.indicadores.reuniones
    );

    this.actualizarIndicador(
      "totalProyectos",
      this.indicadores.proyectos
    );

  },


  actualizarIndicador(
    elementoId,
    valor
  ) {

    const elemento =
      document.getElementById(
        elementoId
      );

    if (!elemento) {
      return;
    }

    elemento.textContent =
      Number(valor) || 0;

  },


  configurarAcciones() {

    const botonNuevaSolicitud =
      document.getElementById(
        "botonNuevaSolicitud"
      );

    if (!botonNuevaSolicitud) {
      return;
    }

    botonNuevaSolicitud.addEventListener(
      "click",
      () => {

        window.location.href =
          "../solicitudes/solicitudes.html";

      }
    );

  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadDashboard.init();

  }
);