/* =========================================================
   FALCO Campus Admin™
   Dashboard General v1.0
========================================================= */

const CampusDashboard = {

  cursos: [
    {
      id: "escuela-padres",
      nombre: "Escuela para Padres",
      estado: "publicado",
      participantes: 0
    },
    {
      id: "formacion-pericial",
      nombre: "Formación Pericial",
      estado: "proximo",
      participantes: 0
    },
    {
      id: "informes-judiciales",
      nombre: "Informes Psicológicos Judiciales",
      estado: "proximo",
      participantes: 0
    }
  ],

  init() {

    this.actualizarMetricas();
    this.finalizarCarga();

    console.info(
      "FALCO Campus Admin Dashboard™ v1.0 Ready"
    );

  },

  actualizarMetricas() {

    const totalCursos =
      this.cursos.length;

    const cursosPublicados =
      this.cursos.filter(
        curso => curso.estado === "publicado"
      ).length;

    const cursosProximos =
      this.cursos.filter(
        curso => curso.estado === "proximo"
      ).length;

    const totalParticipantes =
      this.cursos.reduce(
        (total, curso) =>
          total + Number(curso.participantes || 0),
        0
      );

    this.actualizarTexto(
      "totalCursos",
      totalCursos
    );

    this.actualizarTexto(
      "cursosPublicados",
      cursosPublicados
    );

    this.actualizarTexto(
      "cursosProximos",
      cursosProximos
    );

    this.actualizarTexto(
      "totalParticipantes",
      totalParticipantes
    );

  },

  actualizarTexto(id, valor) {

    const elemento =
      document.getElementById(id);

    if (!elemento) return;

    elemento.textContent =
      String(valor);

  },

  finalizarCarga() {

    document.body.classList.remove(
      "dashboard-loading"
    );

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => {

    CampusDashboard.init();

  }
);