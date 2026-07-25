/* =========================================================
   ESCUELA PROGRESS ENGINE™ v1.0
   Gestión centralizada del progreso de participantes
========================================================= */

const EscuelaProgressEngine = {

  version: "1.0",

  ready: false,

  state: {
    usuarioId: null,
    encuentrosCompletados: [],
    porcentaje: 0,
    ultimoEncuentro: null,
    ultimaActualizacion: null
  },


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.ready = true;

    console.log(
      "Escuela Progress Engine™ v1.0 Ready"
    );

    return this.getState();

  },


  /* =======================================================
     OBTENER ESTADO ACTUAL
  ======================================================= */

  getState() {

    return {
      engine: "Escuela Progress Engine™",
      version: this.version,
      ready: this.ready,
      state: {
        ...this.state,
        encuentrosCompletados: [
          ...this.state.encuentrosCompletados
        ]
      }
    };

  },


  /* =======================================================
     CALCULAR PORCENTAJE
  ======================================================= */

  calcularPorcentaje(
    completados,
    total = 8
  ) {

    if (
      !Number.isFinite(total) ||
      total <= 0
    ) {
      return 0;
    }

    const cantidad =
      Array.isArray(completados)
        ? completados.length
        : 0;

    return Math.min(
      100,
      Math.round(
        (cantidad / total) * 100
      )
    );

  },


  /* =======================================================
     CARGAR ENCUENTROS COMPLETADOS
  ======================================================= */

  cargarCompletados(
    completados = []
  ) {

    const normalizados =
      Array.isArray(completados)
        ? completados
            .map(Number)
            .filter(numero =>
              Number.isInteger(numero) &&
              numero >= 1 &&
              numero <= 8
            )
        : [];

    this.state.encuentrosCompletados =
      [...new Set(normalizados)];

    this.state.porcentaje =
      this.calcularPorcentaje(
        this.state.encuentrosCompletados
      );

    this.state.ultimaActualizacion =
      new Date().toISOString();

    return this.getState();

  },


  /* =======================================================
     VERIFICAR ENCUENTRO COMPLETADO
  ======================================================= */

  estaCompletado(numero) {

    const encuentro =
      Number(numero);

    return this.state
      .encuentrosCompletados
      .includes(encuentro);

  }

};


EscuelaProgressEngine.init();


export default EscuelaProgressEngine;