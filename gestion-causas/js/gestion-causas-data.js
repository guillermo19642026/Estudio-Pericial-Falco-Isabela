(() => {
  "use strict";

  const STORAGE_KEY = "falco_gestion_causas";
  const FIRESTORE_COLLECTION = "gestion_causas";

  const causasIniciales = [
    {
      id: "causa-001",
      codigoInterno: "FALCO-LM-2022-001",
      expediente: "LM-20675-2022",
      caratula: "RIOS CAROLINA VIVIANA c/ IARAI S.A. s/ Despido",

      departamento: "la-matanza",
      departamentoNombre: "La Matanza",
      anio: "2022",

      fuero: "Laboral",
      organismo: "Tribunal de Trabajo",
      juzgado: "",
      secretaria: "",
      tipoProceso: "Despido",

      estadoGeneral: "En impugnación",
      proximoPaso: "Contestar traslado",
      proximoVencimiento: "",
      activa: true,

      actor: "Carolina Viviana Ríos",
      demandado: "IARAI S.A.",

      partes: {
        actora: {
          nombre: "Carolina Viviana Ríos",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        },

        demandada: {
          nombre: "IARAI S.A.",
          tipo: "empresa",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        }
      },

      abogados: [
        {
          id: "abogado-001-actora",
          parte: "actora",
          nombreCompleto: "Abogado/a de la parte actora",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico:
            "20287509651@notificaciones.scba.gov.ar",
          estudioJuridico: "",
          companiaRepresentada: "",
          observaciones: ""
        },
        {
          id: "abogado-001-demandada",
          parte: "demandada",
          nombreCompleto: "Abogado/a de la parte demandada",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico:
            "20311597834@notificaciones.scba.gov.ar",
          estudioJuridico: "",
          companiaRepresentada: "IARAI S.A.",
          observaciones: ""
        }
      ],

      codemandadas: [],

      seguimiento: {
        estadoAnticipo: "sin-solicitar",
        estadoEntrevista: "realizada",
        estadoPericia: "impugnada",
        estadoHonorarios: "sin-regular"
      },

      observaciones: "",

      actuaciones: [
        {
          id: "actuacion-001",
          fecha: "2026-06-30",
          tipo: "Traslado",
          titulo: "Traslado de impugnación",
          descripcion:
            "Se confiere traslado de la impugnación a la pericia psicológica.",
          estado: "pendiente"
        }
      ],

      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: "2026-06-30T12:00:00.000Z",
      fechaActualizacion: "2026-06-30T12:00:00.000Z"
    },

    {
      id: "causa-002",
      codigoInterno: "FALCO-MO-2023-001",
      expediente: "MO-45838-2023",
      caratula:
        "FERREYRA CRISTIAN MIGUEL c/ SWISS MEDICAL ART S.A. s/ Acción de Revisión CMJ Ley 15057",

      departamento: "moron",
      departamentoNombre: "Morón",
      anio: "2023",

      fuero: "Laboral",
      organismo: "Tribunal de Trabajo",
      juzgado: "",
      secretaria: "",
      tipoProceso: "Acción de Revisión CMJ Ley 15057",

      estadoGeneral: "En explicaciones",
      proximoPaso: "Preparar contestación",
      proximoVencimiento: "",
      activa: true,

      actor: "Cristian Miguel Ferreyra",
      demandado: "SWISS MEDICAL ART S.A.",

      partes: {
        actora: {
          nombre: "Cristian Miguel Ferreyra",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        },

        demandada: {
          nombre: "SWISS MEDICAL ART S.A.",
          tipo: "art",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        }
      },

      abogados: [
        {
          id: "abogado-002-actora",
          parte: "actora",
          nombreCompleto: "Abogado/a de la parte actora",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico: "",
          estudioJuridico: "",
          companiaRepresentada: "",
          observaciones: ""
        },
        {
          id: "abogado-002-demandada",
          parte: "demandada",
          nombreCompleto: "Abogado/a de la parte demandada",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico: "",
          estudioJuridico: "",
          companiaRepresentada: "SWISS MEDICAL ART S.A.",
          observaciones: ""
        }
      ],

      codemandadas: [],

      seguimiento: {
        estadoAnticipo: "sin-solicitar",
        estadoEntrevista: "realizada",
        estadoPericia: "presentada",
        estadoHonorarios: "sin-regular"
      },

      observaciones: "",

      actuaciones: [
        {
          id: "actuacion-002",
          fecha: "2026-06-30",
          tipo: "Traslado",
          titulo: "Traslado de impugnación",
          descripcion:
            "Se confiere traslado de la impugnación a la pericia psicológica.",
          estado: "pendiente"
        }
      ],

      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: "2026-06-30T12:00:00.000Z",
      fechaActualizacion: "2026-06-30T12:00:00.000Z"
    },

    {
      id: "causa-003",
      codigoInterno: "FALCO-MO-2014-001",
      expediente: "MO-34464-2014",
      caratula:
        "ARCE CACERES, CRISTIAN RAUL Y OTRO c/ NUÑEZ, HECTOR FABIO Y OTRO s/ Daños y Perjuicios",

      departamento: "moron",
      departamentoNombre: "Morón",
      anio: "2014",

      fuero: "Civil",
      organismo: "Juzgado Civil y Comercial",
      juzgado: "",
      secretaria: "",
      tipoProceso: "Daños y perjuicios",

      estadoGeneral: "En explicaciones",
      proximoPaso: "Responder observaciones",
      proximoVencimiento: "",
      activa: true,

      actor: "Cristian Raúl Arce Cáceres y otro",
      demandado: "Héctor Fabio Núñez y otro",

      partes: {
        actora: {
          nombre: "Cristian Raúl Arce Cáceres y otro",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        },

        demandada: {
          nombre: "Héctor Fabio Núñez y otro",
          tipo: "persona",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        }
      },

      abogados: [
        {
          id: "abogado-003-demandada",
          parte: "demandada",
          nombreCompleto: "Dr. Daniel Commisso",
          matricula: "Tº VIII Fº 183 CAM",
          colegio: "CAM",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico:
            "20207275469@notificaciones.scba.gov.ar",
          estudioJuridico: "",
          companiaRepresentada:
            "Seguros Bernardino Rivadavia Cooperativa Limitada",
          observaciones: ""
        }
      ],

      codemandadas: [
        {
          id: "codemandada-003",
          nombre:
            "Seguros Bernardino Rivadavia Cooperativa Limitada",
          tipo: "aseguradora",
          documento: "",
          telefono: "",
          email: "",
          domicilio: "",
          compania:
            "Seguros Bernardino Rivadavia Cooperativa Limitada",
          abogadoNombre: "Dr. Daniel Commisso",
          abogadoTelefono: "",
          abogadoEmail: "",
          observaciones: ""
        }
      ],

      seguimiento: {
        estadoAnticipo: "sin-solicitar",
        estadoEntrevista: "realizada",
        estadoPericia: "presentada",
        estadoHonorarios: "sin-regular"
      },

      observaciones: "",

      actuaciones: [
        {
          id: "actuacion-003",
          fecha: "2026-08-03",
          tipo: "Explicaciones",
          titulo: "Solicitud de explicaciones",
          descripcion:
            "La parte demandada solicita explicaciones al dictamen pericial.",
          estado: "pendiente"
        }
      ],

      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: "2026-08-03T12:00:00.000Z",
      fechaActualizacion: "2026-08-03T12:00:00.000Z"
    }
  ];

  const vencimientosIniciales = [
    {
      id: "vencimiento-001",
      dia: "06",
      mes: "AGO",
      titulo: "Contestar traslado",
      causa: "RIOS c/ IARAI S.A.",
      detalle: "Vence hoy",
      urgente: true
    },
    {
      id: "vencimiento-002",
      dia: "10",
      mes: "AGO",
      titulo: "Presentar explicación",
      causa: "ARCE CACERES c/ NUÑEZ",
      detalle: "Dentro de 4 días",
      urgente: false
    },
    {
      id: "vencimiento-003",
      dia: "13",
      mes: "AGO",
      titulo: "Entrevista psicológica",
      causa: "Causa laboral",
      detalle: "Modalidad virtual",
      urgente: false
    }
  ];

  /* =========================================================
     CACHE DE COMPATIBILIDAD
  ========================================================= */

  let cacheCases = [];
  let firestoreReady = false;
  let firebaseApi = null;

  let writeQueue = Promise.resolve();

  const clone = (value) => {
    try {
      return structuredClone(value);
    } catch (error) {
      return JSON.parse(
        JSON.stringify(value)
      );
    }
  };

  /* =========================================================
     RESPALDO LOCAL TEMPORAL
  ========================================================= */

  const readLegacyLocalCases = () => {
    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!stored) {
        return [];
      }

      const parsed =
        JSON.parse(stored);

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {

      console.error(
        "No se pudieron leer las causas locales de respaldo:",
        error
      );

      return [];
    }
  };

  const buildInitialCache = () => {

    const casesMap =
      new Map();

    causasIniciales.forEach(
      (causa) => {

        casesMap.set(
          String(causa.id),
          clone(causa)
        );
      }
    );

    readLegacyLocalCases().forEach(
      (causa) => {

        if (!causa?.id) {
          return;
        }

        casesMap.set(
          String(causa.id),
          clone(causa)
        );
      }
    );

    return Array.from(
      casesMap.values()
    );
  };

  cacheCases =
    buildInitialCache();

  /* =========================================================
     FIREBASE
  ========================================================= */

  const loadFirebaseApi =
    async () => {

      if (firebaseApi) {
        return firebaseApi;
      }

      const firebaseConfigModule =
        await import(
          "../../firebase-config.js"
        );

      const firestoreModule =
        await import(
          "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );

      firebaseApi = {

        db:
          firebaseConfigModule.db,

        collection:
          firestoreModule.collection,

        doc:
          firestoreModule.doc,

        getDocs:
          firestoreModule.getDocs,

        setDoc:
          firestoreModule.setDoc,

        deleteDoc:
          firestoreModule.deleteDoc,

        serverTimestamp:
          firestoreModule.serverTimestamp
      };

      return firebaseApi;
    };

  /* =========================================================
     DOCUMENTOS LIVIANOS PARA LA FICHA
  ========================================================= */

  const getSlimDocuments = (
    documents = []
  ) => {

    return (
      Array.isArray(documents)
        ? documents
        : []
    )
      .map((document) => {

        if (
          !document ||
          typeof document !== "object"
        ) {
          return null;
        }

        const {
          textoExtraido,
          zipEntry,
          ...slimDocument
        } = document;

        return slimDocument;
      })
      .filter(Boolean);
  };

  const prepareMainCase = (
    causa = {}
  ) => {

    const {
      documentos = [],
      ...mainCase
    } = causa;

    return {
      ...mainCase,

      documentos:
        getSlimDocuments(
          documentos
        ),

      documentosCount:
        Array.isArray(documentos)
          ? documentos.length
          : 0,

      fechaActualizacion:
        causa.fechaActualizacion ||
        new Date().toISOString()
    };
  };

  /* =========================================================
     LECTURA DESDE FIRESTORE
  ========================================================= */

  const replaceCache = (
    firestoreCases = []
  ) => {

    const casesMap =
      new Map();

    firestoreCases.forEach(
      (causa) => {

        if (!causa?.id) {
          return;
        }

        casesMap.set(
          String(causa.id),
          causa
        );
      }
    );

    causasIniciales.forEach(
      (causa) => {

        const key =
          String(causa.id);

        if (
          !casesMap.has(key)
        ) {

          casesMap.set(
            key,
            clone(causa)
          );
        }
      }
    );

    cacheCases =
      Array.from(
        casesMap.values()
      );
  };

  const loadCasesFromFirestore =
    async () => {

      const {
        db,
        collection,
        getDocs
      } =
        await loadFirebaseApi();

      const snapshot =
        await getDocs(
          collection(
            db,
            FIRESTORE_COLLECTION
          )
        );

      const firestoreCases =
        snapshot.docs.map(
          (documentSnapshot) => ({
            id:
              documentSnapshot.id,

            ...documentSnapshot.data()
          })
        );

      replaceCache(
        firestoreCases
      );

      firestoreReady = true;

      window.dispatchEvent(
        new CustomEvent(
          "gestion-causas-data-ready",
          {
            detail: {
              total:
                cacheCases.length,

              origen:
                "firestore"
            }
          }
        )
      );

      console.log(
        "Gestión de Causas FALCO® Data Firestore Ready",
        {
          total:
            cacheCases.length
        }
      );

      return getCases();
    };

  /* =========================================================
     GUARDADO EN FIRESTORE
  ========================================================= */

  const persistCase =
    async (causa) => {

      if (!causa?.id) {

        throw new Error(
          "La causa no tiene identificador."
        );
      }

      const {
        db,
        doc,
        setDoc,
        serverTimestamp
      } =
        await loadFirebaseApi();

      const documents =
        Array.isArray(
          causa.documentos
        )
          ? causa.documentos
          : [];

      const mainCase =
        prepareMainCase(
          causa
        );

      await setDoc(
        doc(
          db,
          FIRESTORE_COLLECTION,
          String(causa.id)
        ),
        {
          ...mainCase,

          fechaPersistencia:
            serverTimestamp()
        },
        {
          merge: true
        }
      );

      for (
        const document
        of documents
      ) {

        if (!document) {
          continue;
        }

        const documentId =
          document.id ||
          window.crypto
            ?.randomUUID?.() ||
          `documento-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

        const {
          zipEntry,
          ...safeDocument
        } = document;

        await setDoc(
          doc(
            db,
            FIRESTORE_COLLECTION,
            String(causa.id),
            "documentos",
            String(documentId)
          ),
          {
            ...safeDocument,
            id: documentId
          },
          {
            merge: true
          }
        );
      }

      return true;
    };

  /* =========================================================
     ELIMINAR EN FIRESTORE
  ========================================================= */

  const removeCaseFromFirestore =
    async (id) => {

      const {
        db,
        collection,
        doc,
        getDocs,
        deleteDoc
      } =
        await loadFirebaseApi();

      const documentsSnapshot =
        await getDocs(
          collection(
            db,
            FIRESTORE_COLLECTION,
            String(id),
            "documentos"
          )
        );

      for (
        const documentSnapshot
        of documentsSnapshot.docs
      ) {

        await deleteDoc(
          documentSnapshot.ref
        );
      }

      await deleteDoc(
        doc(
          db,
          FIRESTORE_COLLECTION,
          String(id)
        )
      );

      return true;
    };

  /* =========================================================
     COLA DE ESCRITURA
  ========================================================= */

  const enqueueWrite = (
    operation
  ) => {

    writeQueue =
      writeQueue
        .then(operation)
        .catch((error) => {

          console.error(
            "Gestión de Causas FALCO® Error de persistencia:",
            error
          );

          throw error;
        });

    return writeQueue;
  };

  /* =========================================================
     API COMPATIBLE
  ========================================================= */

  const getCases = () => {

    return cacheCases.map(
      (causa) =>
        clone(causa)
    );
  };

  const getCaseById = (
    id
  ) => {

    if (!id) {
      return null;
    }

    const causa =
      cacheCases.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    return causa
      ? clone(causa)
      : null;
  };

  const addCase = (
    newCase
  ) => {

    if (!newCase?.id) {
      return false;
    }

    const id =
      String(newCase.id);

    const existingIndex =
      cacheCases.findIndex(
        (causa) =>
          String(causa.id) === id
      );

    const normalizedCase = {
      ...clone(newCase),

      fechaActualizacion:
        newCase.fechaActualizacion ||
        new Date().toISOString()
    };

    if (
      existingIndex >= 0
    ) {

      cacheCases[
        existingIndex
      ] =
        normalizedCase;

    } else {

      cacheCases.push(
        normalizedCase
      );
    }

    enqueueWrite(
      () =>
        persistCase(
          normalizedCase
        )
    );

    return true;
  };

  const updateCase = (
    updatedCase
  ) => {

    if (!updatedCase?.id) {
      return false;
    }

    const id =
      String(updatedCase.id);

    const normalizedCase = {
      ...clone(updatedCase),

      fechaActualizacion:
        new Date().toISOString()
    };

    const existingIndex =
      cacheCases.findIndex(
        (causa) =>
          String(causa.id) === id
      );

    if (
      existingIndex >= 0
    ) {

      cacheCases[
        existingIndex
      ] =
        normalizedCase;

    } else {

      cacheCases.push(
        normalizedCase
      );
    }

    enqueueWrite(
      () =>
        persistCase(
          normalizedCase
        )
    );

    return true;
  };

  const deleteCase = (
    id
  ) => {

    if (!id) {
      return false;
    }

    const normalizedId =
      String(id);

    const previousLength =
      cacheCases.length;

    cacheCases =
      cacheCases.filter(
        (causa) =>
          String(causa.id) !==
          normalizedId
      );

    if (
      cacheCases.length ===
      previousLength
    ) {
      return false;
    }

    enqueueWrite(
      () =>
        removeCaseFromFirestore(
          normalizedId
        )
    );

    return true;
  };

  /* =========================================================
     SINCRONIZACIÓN
  ========================================================= */

  const flush =
    async () => {

      await writeQueue;

      return true;
    };

  const refresh =
    async () => {

      await flush();

      return (
        loadCasesFromFirestore()
      );
    };

  const clearLegacyLocalStorage =
    () => {

      try {

        localStorage.removeItem(
          STORAGE_KEY
        );

        return true;

      } catch (error) {

        console.error(
          "No se pudo limpiar el respaldo local:",
          error
        );

        return false;
      }
    };

  /* =========================================================
     INICIALIZACIÓN FIRESTORE
  ========================================================= */

  const ready =
    loadCasesFromFirestore()
      .catch((error) => {

        firestoreReady = false;

        console.error(
          "Gestión de Causas FALCO® no pudo cargar Firestore. Se mantiene la cache local de respaldo:",
          error
        );

        return getCases();
      });

  /* =========================================================
     EXPORTACIÓN GLOBAL
  ========================================================= */

  window.GestionCausasData = {

    STORAGE_KEY,
    FIRESTORE_COLLECTION,

    causasIniciales,

    vencimientos:
      vencimientosIniciales,

    ready,

    getCases,
    getCaseById,

    addCase,
    updateCase,
    deleteCase,

    flush,
    refresh,

    clearLegacyLocalStorage,

    get firestoreReady() {
      return firestoreReady;
    },

    get causas() {
      return getCases();
    }
  };

  console.log(
    "Gestión de Causas FALCO® Data Bridge Ready",
    {
      cacheInicial:
        cacheCases.length
    }
  );

})();