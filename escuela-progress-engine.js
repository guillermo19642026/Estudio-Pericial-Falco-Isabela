/* =========================================================
   ESCUELA PROGRESS ENGINE™ v1.0
   Gestión centralizada del progreso de participantes
========================================================= */

import {
  db
} from "./firebase-config.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



const EscuelaProgressEngine = {

  version: "1.0",

  ready: false,

state: {
  usuarioId: null,
  participanteExiste: false,
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
     CARGAR PROGRESO DESDE FIREBASE
  ======================================================= */

  async cargar(
    usuarioId
  ) {

    if (!usuarioId) {

      console.warn(
        "Escuela Progress Engine™: usuario no identificado"
      );

      return this.getState();

    }

    try {

      const referencia = doc(
        db,
        "escuela_participantes",
        usuarioId
      );

      const resultado =
        await getDoc(referencia);

      if (!resultado.exists()) {

        console.warn(
          "Escuela Progress Engine™: participante no encontrado"
        );

        this.state.usuarioId =
          usuarioId;

          this.state.participanteExiste =
  false;

        this.cargarCompletados([]);

        return this.getState();

      }

      const datos =
        resultado.data();

      const completados = [];

      for (
        let numero = 1;
        numero <= 8;
        numero++
      ) {

        if (
          datos[`completado${numero}`] === true
        ) {
          completados.push(numero);
        }

      }

      this.state.usuarioId =
  usuarioId;

this.state.participanteExiste =
  true;

this.cargarCompletados(
  completados
);

      this.state.ultimoEncuentro =
        completados.at(-1) || null;

      console.log(
        "Escuela Progress Engine™: progreso cargado",
        completados
      );

      return this.getState();

    } catch (error) {

      console.error(
        "Escuela Progress Engine™: error al cargar progreso",
        error
      );

      return this.getState();

    }

  },


  /* =======================================================
     GUARDAR PROGRESO EN FIREBASE
  ======================================================= */

  async guardar() {

  const usuarioId =
    this.state.usuarioId;

  if (!usuarioId) {

    console.warn(
      "Escuela Progress Engine™: no se puede guardar sin usuario"
    );

    return {
      success: false,
      state: this.getState()
    };

  }

  if (!this.state.participanteExiste) {

    console.warn(
      "Escuela Progress Engine™: guardado omitido; no existe un participante registrado"
    );

    return {
      success: false,
      reason: "participante-no-registrado",
      state: this.getState()
    };

  }

  try {



      const datosProgreso = {};

      for (
        let numero = 1;
        numero <= 8;
        numero++
      ) {

        datosProgreso[
          `completado${numero}`
        ] =
          this.estaCompletado(numero);

      }

      datosProgreso.porcentaje =
        this.state.porcentaje;

      datosProgreso.ultimoEncuentro =
        this.state.ultimoEncuentro;

      datosProgreso.ultimaActualizacion =
        new Date().toISOString();

      const referencia = doc(
        db,
        "escuela_participantes",
        usuarioId
      );

      await updateDoc(
        referencia,
        datosProgreso
      );

      this.state.ultimaActualizacion =
        datosProgreso.ultimaActualizacion;

      console.log(
        "Escuela Progress Engine™: progreso guardado",
        datosProgreso
      );

      return {
        success: true,
        state: this.getState()
      };

    } catch (error) {

      console.error(
        "Escuela Progress Engine™: error al guardar progreso",
        error
      );

      return {
        success: false,
        error,
        state: this.getState()
      };

    }

  },



  /* =======================================================
     MARCAR ENCUENTRO COMO COMPLETADO
  ======================================================= */

  async marcarCompletado(
  numero
) {

    const encuentro =
      Number(numero);

    if (
      !Number.isInteger(encuentro) ||
      encuentro < 1 ||
      encuentro > 8
    ) {

      console.warn(
        "Escuela Progress Engine™: encuentro inválido",
        numero
      );

      return this.getState();

    }

    if (
      !this.state
        .encuentrosCompletados
        .includes(encuentro)
    ) {

      this.state
        .encuentrosCompletados
        .push(encuentro);

      this.state
        .encuentrosCompletados
        .sort(
          (a, b) => a - b
        );

    }

    this.state.ultimoEncuentro =
      encuentro;

    this.state.porcentaje =
      this.calcularPorcentaje(
        this.state.encuentrosCompletados
      );

    this.state.ultimaActualizacion =
      new Date().toISOString();

   console.log(
  `Encuentro ${encuentro} marcado como completado`
);

if (this.state.usuarioId) {

  await this.guardar();

}

return this.getState();

  },


  /* =======================================================
     DESMARCAR ENCUENTRO COMPLETADO
  ======================================================= */

async desmarcarCompletado(
  numero
) {

    const encuentro =
      Number(numero);

    if (
      !Number.isInteger(encuentro) ||
      encuentro < 1 ||
      encuentro > 8
    ) {

      console.warn(
        "Escuela Progress Engine™: encuentro inválido",
        numero
      );

      return this.getState();

    }

    this.state.encuentrosCompletados =
      this.state.encuentrosCompletados.filter(
        item => item !== encuentro
      );

    this.state.porcentaje =
      this.calcularPorcentaje(
        this.state.encuentrosCompletados
      );

    if (
      this.state.ultimoEncuentro === encuentro
    ) {
      this.state.ultimoEncuentro =
        this.state.encuentrosCompletados.at(-1) || null;
    }

    this.state.ultimaActualizacion =
      new Date().toISOString();

    console.log(
  `Encuentro ${encuentro} desmarcado`
);

if (this.state.usuarioId) {

  await this.guardar();

}

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