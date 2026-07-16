/* =========================================================
   FALCO® DOCUMENT ENGINE
   EXPEDIENTE BUILDER™ v1.0
========================================================= */

import {
  auth,
  db
} from "../../firebase-config.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const COLECCION_ADMISIONES =
  "falco_admisiones";



const COLECCION_RESULTADOS =
  "resultados_tests";

const TESTS_PSICOMETRICOS = [
  {
    id: "scl90",
    nombre: "SCL-90 / BSI"
  },
  {
    id: "bdi",
    nombre: "Inventario de Depresión de Beck"
  },
  {
    id: "bai",
    nombre: "Inventario de Ansiedad de Beck"
  },
  {
    id: "desesperanza",
    nombre: "Escala de Desesperanza de Beck"
  }
];



/* =========================================================
   ESPERAR USUARIO AUTENTICADO
========================================================= */

function esperarUsuario() {
  return new Promise((resolve, reject) => {
    const cancelar =
      onAuthStateChanged(
        auth,

        usuario => {
          cancelar();

          if (!usuario) {
            reject(
              new Error(
                "No hay un usuario autenticado."
              )
            );

            return;
          }

          resolve(usuario);
        },

        error => {
          cancelar();
          reject(error);
        }
      );
  });
}


/* =========================================================
   CONVERTIR TIMESTAMP DE FIREBASE
========================================================= */

function convertirFecha(valor) {
  if (!valor) {
    return null;
  }

  if (
    typeof valor.toDate ===
    "function"
  ) {
    return valor
      .toDate()
      .toISOString();
  }

  if (
    typeof valor ===
    "string"
  ) {
    return valor;
  }

  return null;
}


/* =========================================================
   OBTENER MÓDULO DE DATOS
========================================================= */

function obtenerModulo(
  datos,
  moduloId
) {
  const modulo =
    datos?.[moduloId];

  if (
    !modulo ||
    typeof modulo !== "object"
  ) {
    return {};
  }

  return structuredClone(modulo);
}


/* =========================================================
   NORMALIZAR RESULTADO PSICOMÉTRICO
========================================================= */

function normalizarResultadoTest(
  tipo,
  nombreInstrumento,
  documento
) {
  if (!documento) {
    return null;
  }

  const puntaje =
    documento.puntajeTotal ??
    documento.puntaje ??
    documento.total ??
    null;

  const interpretacion =
    documento.nivel ??
    documento.interpretacion ??
    documento.clasificacion ??
    documento.resultado ??
    "";

  const resultado = {
    tipo,
    instrumento:
      nombreInstrumento,

    nombreOriginal:
      documento.nombreTest ||
      documento.test ||
      "",

    nombrePericiado:
      documento.nombre || "",

    dni:
      documento.dni || "",

    fecha:
      documento.fecha || "",

    creadoEn:
      convertirFecha(
        documento.creadoEn
      ),

    puntaje,

    interpretacion,

    cantidadRespuestas:
      Array.isArray(
        documento.respuestas
      )
        ? documento.respuestas.length
        : 0,

    protocoloDisponible:
      Array.isArray(
        documento.respuestas
      ) &&
      documento.respuestas.length > 0
  };

  if (tipo === "scl90") {
    resultado.indices = {
      gsi:
        documento.gsi ?? null,

      psdi:
        documento.psdi ?? null,

      pst:
        documento.pst ?? null,

      total:
        documento.total ?? null
    };
  }

  return resultado;
}


/* =========================================================
   CARGAR RESULTADOS PSICOMÉTRICOS
========================================================= */

async function cargarPsicometria(
  usuarioUID
) {
  const instrumentos = [];
  const resultados = [];

  for (
    const test of
    TESTS_PSICOMETRICOS
  ) {
    const documentoId =
      `${usuarioUID}_${test.id}`;

    const referencia =
      doc(
        db,
        COLECCION_RESULTADOS,
        documentoId
      );

    try {
      const documento =
        await getDoc(referencia);

      if (!documento.exists()) {
        continue;
      }

      const datos =
        documento.data();

      const resultado =
        normalizarResultadoTest(
          test.id,
          test.nombre,
          datos
        );

      if (!resultado) {
        continue;
      }

      instrumentos.push({
        tipo:
          test.id,

        nombre:
          test.nombre,

        administrado:
          true,

        documentoId
      });

      resultados.push(resultado);

    } catch (error) {
      console.warn(
        `No se pudo recuperar el test ${test.id}:`,
        error
      );
    }
  }

  return {
    instrumentos,
    resultados,
    cantidad:
      resultados.length
  };
}



/* =========================================================
   CARGAR DOCUMENTOS DEL PERICIADO
========================================================= */

async function cargarDocumentosPericiado(
  usuarioUID
) {
  const documentos = {
    dni: [],
    consentimiento: [],
    constancias: [],
    fichas: [],
    certificados: [],
    otros: []
  };

  const referencia =
    collection(
      db,
      "documentos_periciados"
    );

  const consulta =
    query(
      referencia,
      where(
        "usuarioUID",
        "==",
        usuarioUID
      )
    );

  const resultado =
    await getDocs(
      consulta
    );

  resultado.forEach(
    documento => {
      const datos = {
        id:
          documento.id,

        ...documento.data()
      };


      /* =========================
         DOCUMENTOS PRINCIPALES
      ========================= */

      switch (datos.tipo) {
        case "constancia_tratamiento":
          documentos.constancias.push(
            datos
          );
          break;

        case "consentimiento_informado":
          documentos.consentimiento.push(
            datos
          );
          break;

        case "ficha_integral_periciado":
          documentos.fichas.push(
            datos
          );
          break;

        default:
          /*
            Los documentos de adjuntos generales
            pueden no tener campo "tipo".
          */
          break;
      }


      /* =========================
         DNI CARGADO EN CONSTANCIA
      ========================= */

      if (
  datos.fotoDni &&
  typeof datos.fotoDni === "object" &&
  datos.fotoDni.url
) {
  /*
    La foto del DNI asociada a una constancia
    se conserva dentro de la propia constancia,
    pero no se agrega nuevamente al listado
    general de documentos de identidad.
  */
}


      /* =========================
         DNI FRENTE
      ========================= */

      if (
        datos.dniFrente &&
        typeof datos.dniFrente === "object" &&
        datos.dniFrente.url
      ) {
        documentos.dni.push({
          ...datos.dniFrente,
          categoria:
            "dni_frente",

          titulo:
            "DNI — Frente"
        });
      }


      /* =========================
         DNI DORSO
      ========================= */

      if (
        datos.dniDorso &&
        typeof datos.dniDorso === "object" &&
        datos.dniDorso.url
      ) {
        documentos.dni.push({
          ...datos.dniDorso,
          categoria:
            "dni_dorso",

          titulo:
            "DNI — Dorso"
        });
      }


      /* =========================
         CERTIFICADOS
      ========================= */

      if (
        Array.isArray(
          datos.certificados
        )
      ) {
        datos.certificados
          .filter(
            archivo =>
              archivo &&
              typeof archivo ===
                "object" &&
              archivo.url
          )
          .forEach(
            archivo => {
              documentos.certificados.push({
                ...archivo,

                categoria:
                  "certificado",

                titulo:
                  archivo.nombre ||
                  "Documentación complementaria"
              });
            }
          );
      }


      /* =========================
         OTROS DOCUMENTOS
      ========================= */

      const tieneContenidoConocido =
        datos.tipo ||
        datos.fotoDni ||
        datos.dniFrente ||
        datos.dniDorso ||
        (
          Array.isArray(
            datos.certificados
          ) &&
          datos.certificados.length > 0
        );

      if (!tieneContenidoConocido) {
        documentos.otros.push(
          datos
        );
      }
    }
  );

  documentos.cantidadTotal =
    documentos.dni.length +
    documentos.consentimiento.length +
    documentos.constancias.length +
    documentos.fichas.length +
    documentos.certificados.length +
    documentos.otros.length;

  return documentos;
}




/* =========================================================
   CONSTRUIR EXPEDIENTE
========================================================= */

async function construirExpediente(
  usuarioUID
) {
  if (!usuarioUID) {
    throw new Error(
      "Debe indicarse el UID del periciado."
    );
  }

  const referencia =
    doc(
      db,
      COLECCION_ADMISIONES,
      usuarioUID
    );

  const documento =
    await getDoc(referencia);

  if (!documento.exists()) {
    return null;
  }

  const admision =
    documento.data();

  const datos =
    admision.datos || {};


const documentos =
  await cargarDocumentosPericiado(
    usuarioUID
  );



const psicometria =
  await cargarPsicometria(
    usuarioUID
  );




  const datosPersonales =
    obtenerModulo(
      datos,
      "datos-personales"
    );

  const datosJudiciales =
    obtenerModulo(
      datos,
      "datos-judiciales"
    );

  const expediente = {

    /* =========================
       IDENTIFICACIÓN
    ========================= */

    id:
      documento.id,

    version:
      "2.0",

    tipo:
      "expediente_digital_pericial",

    generadoEn:
      new Date().toISOString(),


    /* =========================
       ESTADO DE LA ADMISIÓN
    ========================= */

    admision: {
      usuarioUID:
        admision.usuarioUID || usuarioUID,

      usuarioEmail:
        admision.usuarioEmail || "",

      estado:
        admision.estado || "en_proceso",

      moduloActual:
        admision.moduloActual ?? 0,

      completados:
        Array.isArray(
          admision.completados
        )
          ? [...admision.completados]
          : [],

      ultimaActualizacion:
        convertirFecha(
          admision.ultimaActualizacion
        ),

      finalizadaEn:
        convertirFecha(
          admision.finalizadaEn
        )
    },


    /* =========================
       PORTADA
    ========================= */

    portada: {
      periciado:
        datosPersonales.nombre || "",

      dni:
        datosPersonales.dni || "",

      expediente:
        datosJudiciales.expediente || "",

      caratula:
        datosJudiciales.caratula || "",

      tribunal:
        datosJudiciales.tribunal || "",

      fechaGeneracion:
        new Date().toISOString()
    },


    /* =========================
       FICHA INTEGRAL
    ========================= */

    fichaIntegral: {
      datosPersonales,

      datosJudiciales,

      relatoHecho:
        obtenerModulo(
          datos,
          "relato-hecho"
        ),

      grupoFamiliar:
        obtenerModulo(
          datos,
          "grupo-familiar"
        ),

      areaAfectiva:
        obtenerModulo(
          datos,
          "area-afectiva"
        ),

      areaSocial:
        obtenerModulo(
          datos,
          "area-social"
        ),

      educacion:
        obtenerModulo(
          datos,
          "educacion"
        ),

      historiaLaboral:
        obtenerModulo(
          datos,
          "historia-laboral"
        ),

      trabajoActual:
        obtenerModulo(
          datos,
          "trabajo-actual"
        ),

      tratamientos:
        obtenerModulo(
          datos,
          "tratamientos"
        ),

      antecedentesSalud:
        obtenerModulo(
          datos,
          "antecedentes-salud"
        ),

      habitosCalidadVida:
        obtenerModulo(
          datos,
          "habitos-calidad-vida"
        ),

      impactoActual:
        obtenerModulo(
          datos,
          "impacto-actual"
        ),

      documentacion:
        obtenerModulo(
          datos,
          "documentacion"
        ),

      observacionesFinales:
        obtenerModulo(
          datos,
          "observaciones-finales"
        ),

      consentimiento:
        obtenerModulo(
          datos,
          "consentimiento"
        )
    },


    /* =========================
       SECCIONES FUTURAS
    ========================= */

        psicometria,

    anexos: documentos
  };

  return expediente;
}


/* =========================================================
   CONSTRUIR EXPEDIENTE DEL USUARIO ACTUAL
========================================================= */

async function construirExpedienteActual() {
  const usuario =
    await esperarUsuario();

  return construirExpediente(
    usuario.uid
  );
}


/* =========================================================
   API PÚBLICA
========================================================= */

window.FalcoExpedienteBuilder =
  Object.freeze({

    construir:
      construirExpediente,

    construirActual:
      construirExpedienteActual
  });


console.log(
  "FALCO Expediente Builder™ v1.0 Ready"
);