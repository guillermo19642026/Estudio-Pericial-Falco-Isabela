/* =========================================================
   FALCO® COMUNIDAD
   DOCUMENTOS
   documentos.js
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const DOCUMENTOS_STORAGE_KEY =
  "falcoComunidadDocumentos";

const DOCUMENTOS_PROGRAMAS_KEY =
  "falcoComunidadProgramas";

const DOCUMENTOS_PROYECTOS_KEYS = [

  "falcoComunidadProyectos",

  "falcoProyectos"

];


/* =========================================================
   CATÁLOGOS
========================================================= */

const DOCUMENTOS_TIPOS = {

  acta:
    "Acta",

  convenio:
    "Convenio",

  propuesta:
    "Propuesta",

  informe:
    "Informe",

  presupuesto:
    "Presupuesto",

  presentacion:
    "Presentación",

  constancia:
    "Constancia",

  otro:
    "Otro"

};


const DOCUMENTOS_ESTADOS = {

  borrador: {

    etiqueta:
      "Borrador",

    clase:
      "documento-estado--borrador"

  },

  vigente: {

    etiqueta:
      "Vigente",

    clase:
      "documento-estado--vigente"

  },

  pendiente: {

    etiqueta:
      "Pendiente",

    clase:
      "documento-estado--pendiente"

  },

  aprobado: {

    etiqueta:
      "Aprobado",

    clase:
      "documento-estado--aprobado"

  },

  archivado: {

    etiqueta:
      "Archivado",

    clase:
      "documento-estado--archivado"

  }

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const documentosState = {

  documentos:
    [],

  documentosFiltrados:
    [],

  programas:
    [],

  proyectos:
    [],

  busqueda:
    "",

  tipo:
    "todos",

  estado:
    "todos",

  documentoEditandoId:
    null,

  temporizadorNotificacion:
    null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const documentosElementos = {

  listado:
    document.getElementById(
      "documentosListado"
    ),

  loader:
    document.getElementById(
      "documentosLoader"
    ),

  vacio:
    document.getElementById(
      "documentosVacio"
    ),

  sinResultados:
    document.getElementById(
      "documentosSinResultados"
    ),


  /* -------------------------------------------------------
     INDICADORES
  ------------------------------------------------------- */

  indicadorTotal:
    document.getElementById(
      "indicadorDocumentosTotal"
    ),

  indicadorVigentes:
    document.getElementById(
      "indicadorDocumentosVigentes"
    ),

  indicadorPendientes:
    document.getElementById(
      "indicadorDocumentosPendientes"
    ),

  indicadorArchivados:
    document.getElementById(
      "indicadorDocumentosArchivados"
    ),

  contadorVisibles:
    document.getElementById(
      "contadorDocumentosVisibles"
    ),


  /* -------------------------------------------------------
     FILTROS
  ------------------------------------------------------- */

  buscador:
    document.getElementById(
      "buscadorDocumentos"
    ),

  filtroTipo:
    document.getElementById(
      "filtroTipoDocumento"
    ),

  filtroEstado:
    document.getElementById(
      "filtroEstadoDocumento"
    ),

  botonLimpiar:
    document.getElementById(
      "botonLimpiarFiltrosDocumentos"
    ),

  botonRestablecer:
    document.getElementById(
      "botonRestablecerDocumentos"
    ),


  /* -------------------------------------------------------
     BOTONES
  ------------------------------------------------------- */

  botonActualizar:
    document.getElementById(
      "botonActualizarDocumentos"
    ),

  botonNuevo:
    document.getElementById(
      "botonNuevoDocumento"
    ),

  botonCrearPrimero:
    document.getElementById(
      "botonCrearPrimerDocumento"
    ),


  /* -------------------------------------------------------
     MODAL
  ------------------------------------------------------- */

  modal:
    document.getElementById(
      "modalDocumento"
    ),

  modalTitulo:
    document.getElementById(
      "modalDocumentoTitulo"
    ),

  modalDescripcion:
    document.getElementById(
      "modalDocumentoDescripcion"
    ),

  formulario:
    document.getElementById(
      "formularioDocumento"
    ),


  /* -------------------------------------------------------
     CAMPOS
  ------------------------------------------------------- */

  campoId:
    document.getElementById(
      "documentoId"
    ),

  campoTitulo:
    document.getElementById(
      "documentoTitulo"
    ),

  campoTipo:
    document.getElementById(
      "documentoTipo"
    ),

  campoEstado:
    document.getElementById(
      "documentoEstado"
    ),

  campoFecha:
    document.getElementById(
      "documentoFecha"
    ),

  campoResponsable:
    document.getElementById(
      "documentoResponsable"
    ),

  campoInstitucion:
    document.getElementById(
      "documentoInstitucion"
    ),

  campoPrograma:
    document.getElementById(
      "documentoPrograma"
    ),

  campoProyecto:
    document.getElementById(
      "documentoProyecto"
    ),

  campoEnlace:
    document.getElementById(
      "documentoEnlace"
    ),

  campoDescripcion:
    document.getElementById(
      "documentoDescripcion"
    ),


  /* -------------------------------------------------------
     NOTIFICACIÓN
  ------------------------------------------------------- */

  notificacion:
    document.getElementById(
      "documentosNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "documentosNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "documentosNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "documentosNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "documentosNotificacionCerrar"
    )

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarDocumentos
);


function iniciarDocumentos() {

  registrarEventosDocumentos();

  cargarProgramasDocumentos();

  cargarProyectosDocumentos();

  cargarSelectProgramasDocumentos();

  cargarSelectProyectosDocumentos();

  cargarDocumentos();

  ocultarLoaderDocumentos();

  actualizarDocumentosCompleto();


  console.info(
    "FALCO Comunidad Documentos™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventosDocumentos() {

  documentosElementos.buscador
    ?.addEventListener(
      "input",
      manejarBusquedaDocumentos
    );


  documentosElementos.filtroTipo
    ?.addEventListener(
      "change",
      manejarFiltroTipoDocumentos
    );


  documentosElementos.filtroEstado
    ?.addEventListener(
      "change",
      manejarFiltroEstadoDocumentos
    );


  documentosElementos.botonLimpiar
    ?.addEventListener(
      "click",
      limpiarFiltrosDocumentos
    );


  documentosElementos.botonRestablecer
    ?.addEventListener(
      "click",
      limpiarFiltrosDocumentos
    );


  documentosElementos.botonActualizar
    ?.addEventListener(
      "click",
      actualizarDocumentosManual
    );


  documentosElementos.botonNuevo
    ?.addEventListener(
      "click",
      abrirModalNuevoDocumento
    );


  documentosElementos.botonCrearPrimero
    ?.addEventListener(
      "click",
      abrirModalNuevoDocumento
    );


  documentosElementos.formulario
    ?.addEventListener(
      "submit",
      guardarDocumento
    );


  documentosElementos.formulario
    ?.addEventListener(
      "input",
      manejarCambioCampoDocumento
    );


  documentosElementos.listado
    ?.addEventListener(
      "click",
      manejarAccionesDocumento
    );


  document
    .querySelectorAll(
      "[data-cerrar-modal]"
    )
    .forEach(
      (elemento) => {

        elemento.addEventListener(
          "click",
          cerrarModalDocumento
        );

      }
    );


  documentosElementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacionDocumentos
    );


  document.addEventListener(
    "keydown",
    manejarTecladoDocumentos
  );


  window.addEventListener(
    "storage",
    manejarCambioStorageDocumentos
  );

}


/* =========================================================
   CARGA DE DOCUMENTOS
========================================================= */

function cargarDocumentos() {

  try {

    const contenido =
      localStorage.getItem(
        DOCUMENTOS_STORAGE_KEY
      );


    if (!contenido) {

      documentosState.documentos =
        [];

      return;

    }


    const datos =
      JSON.parse(
        contenido
      );


    documentosState.documentos =
      Array.isArray(datos)
        ? datos
            .map(
              normalizarDocumento
            )
            .filter(Boolean)
        : [];

  } catch (error) {

    console.error(
      "No fue posible cargar los documentos:",
      error
    );


    documentosState.documentos =
      [];

  }

}


/* =========================================================
   PROGRAMAS
========================================================= */

function cargarProgramasDocumentos() {

  try {

    const contenido =
      localStorage.getItem(
        DOCUMENTOS_PROGRAMAS_KEY
      );


    if (!contenido) {

      documentosState.programas =
        [];

      return;

    }


    const programas =
      JSON.parse(
        contenido
      );


    documentosState.programas =
      Array.isArray(programas)
        ? programas
        : [];

  } catch (error) {

    documentosState.programas =
      [];

  }

}


/* =========================================================
   PROYECTOS
========================================================= */

function cargarProyectosDocumentos() {

  documentosState.proyectos =
    obtenerPrimeraColeccionDocumentos(
      DOCUMENTOS_PROYECTOS_KEYS
    );

}


/* =========================================================
   SELECT PROGRAMAS
========================================================= */

function cargarSelectProgramasDocumentos() {

  const select =
    documentosElementos.campoPrograma;


  if (!select) {

    return;

  }


  select.innerHTML = `
    <option value="">
      Sin programa asociado
    </option>
  `;


  documentosState.programas
    .slice()
    .sort(
      ordenarPorNombreDocumentos
    )
    .forEach(
      (programa) => {

        const id =
          obtenerTextoDocumentos(
            programa.id
          );


        if (!id) {

          return;

        }


        const opcion =
          document.createElement(
            "option"
          );


        opcion.value =
          id;


        opcion.textContent =
          obtenerTextoDocumentos(
            programa.nombre ||
            programa.titulo
          ) ||
          "Programa sin nombre";


        select.appendChild(
          opcion
        );

      }
    );

}


/* =========================================================
   SELECT PROYECTOS
========================================================= */

function cargarSelectProyectosDocumentos() {

  const select =
    documentosElementos.campoProyecto;


  if (!select) {

    return;

  }


  select.innerHTML = `
    <option value="">
      Sin proyecto asociado
    </option>
  `;


  documentosState.proyectos
    .slice()
    .sort(
      ordenarPorNombreDocumentos
    )
    .forEach(
      (proyecto) => {

        const id =
          obtenerTextoDocumentos(
            proyecto.id ||
            proyecto.proyectoId
          );


        if (!id) {

          return;

        }


        const opcion =
          document.createElement(
            "option"
          );


        opcion.value =
          id;


        opcion.textContent =
          obtenerTextoDocumentos(
            proyecto.nombre ||
            proyecto.titulo
          ) ||
          "Proyecto sin nombre";


        select.appendChild(
          opcion
        );

      }
    );

}


/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizarDocumento(
  documento
) {

  if (
    !documento ||
    typeof documento !== "object"
  ) {

    return null;

  }


  const id =
    obtenerTextoDocumentos(
      documento.id
    );


  if (!id) {

    return null;

  }


  return {

    ...documento,

    id,

    titulo:
      obtenerTextoDocumentos(
        documento.titulo ||
        documento.nombre
      ) ||
      "Documento sin título",

    tipo:
      normalizarTipoDocumento(
        documento.tipo
      ),

    estado:
      normalizarEstadoDocumento(
        documento.estado
      ),

    fecha:
      obtenerTextoDocumentos(
        documento.fecha
      ),

    responsable:
      obtenerTextoDocumentos(
        documento.responsable
      ),

    institucion:
      obtenerTextoDocumentos(
        documento.institucion
      ),

    programaId:
      obtenerTextoDocumentos(
        documento.programaId
      ),

    programa:
      obtenerTextoDocumentos(
        documento.programa
      ),

    proyectoId:
      obtenerTextoDocumentos(
        documento.proyectoId
      ),

    proyecto:
      obtenerTextoDocumentos(
        documento.proyecto
      ),

    enlace:
      obtenerTextoDocumentos(
        documento.enlace ||
        documento.url
      ),

    descripcion:
      obtenerTextoDocumentos(
        documento.descripcion
      ),

    fechaCreacion:
      documento.fechaCreacion ||
      new Date().toISOString(),

    fechaActualizacion:
      documento.fechaActualizacion ||
      documento.fechaCreacion ||
      new Date().toISOString()

  };

}


/* =========================================================
   NORMALIZAR TIPO
========================================================= */

function normalizarTipoDocumento(
  valor
) {

  const tipo =
    normalizarTextoDocumentos(
      valor
    );


  return Object.prototype.hasOwnProperty.call(
    DOCUMENTOS_TIPOS,
    tipo
  )
    ? tipo
    : "otro";

}


/* =========================================================
   NORMALIZAR ESTADO
========================================================= */

function normalizarEstadoDocumento(
  valor
) {

  const estado =
    normalizarTextoDocumentos(
      valor
    );


  return Object.prototype.hasOwnProperty.call(
    DOCUMENTOS_ESTADOS,
    estado
  )
    ? estado
    : "borrador";

}


/* =========================================================
   ACTUALIZACIÓN COMPLETA
========================================================= */

function actualizarDocumentosCompleto() {

  aplicarFiltrosDocumentos();

  actualizarIndicadoresDocumentos();

  renderizarDocumentos();

}


/* =========================================================
   FILTROS
========================================================= */

function manejarBusquedaDocumentos(
  evento
) {

  documentosState.busqueda =
    evento.target.value.trim();


  actualizarDocumentosCompleto();

}


function manejarFiltroTipoDocumentos(
  evento
) {

  documentosState.tipo =
    evento.target.value;


  actualizarDocumentosCompleto();

}


function manejarFiltroEstadoDocumentos(
  evento
) {

  documentosState.estado =
    evento.target.value;


  actualizarDocumentosCompleto();

}


function aplicarFiltrosDocumentos() {

  const busqueda =
    normalizarTextoDocumentos(
      documentosState.busqueda
    );


  documentosState.documentosFiltrados =
    documentosState.documentos.filter(
      (documento) => {

        const cadena =
          normalizarTextoDocumentos([

            documento.titulo,

            documento.descripcion,

            documento.institucion,

            documento.responsable,

            documento.programa,

            documento.proyecto,

            DOCUMENTOS_TIPOS[
              documento.tipo
            ],

            DOCUMENTOS_ESTADOS[
              documento.estado
            ]?.etiqueta

          ].join(" "));


        const coincideBusqueda =
          !busqueda ||
          cadena.includes(
            busqueda
          );


        const coincideTipo =
          documentosState.tipo === "todos" ||
          documento.tipo === documentosState.tipo;


        const coincideEstado =
          documentosState.estado === "todos" ||
          documento.estado === documentosState.estado;


        return (
          coincideBusqueda &&
          coincideTipo &&
          coincideEstado
        );

      }
    )
    .sort(
      ordenarDocumentosPorFecha
    );

}


/* =========================================================
   LIMPIAR FILTROS
========================================================= */

function limpiarFiltrosDocumentos() {

  documentosState.busqueda =
    "";

  documentosState.tipo =
    "todos";

  documentosState.estado =
    "todos";


  if (
    documentosElementos.buscador
  ) {

    documentosElementos.buscador.value =
      "";

  }


  if (
    documentosElementos.filtroTipo
  ) {

    documentosElementos.filtroTipo.value =
      "todos";

  }


  if (
    documentosElementos.filtroEstado
  ) {

    documentosElementos.filtroEstado.value =
      "todos";

  }


  actualizarDocumentosCompleto();

}

/* =========================================================
   INDICADORES
========================================================= */

function actualizarIndicadoresDocumentos() {

  const total =
    documentosState.documentos.length;


  const vigentes =
    documentosState.documentos.filter(
      (documento) =>
        documento.estado ===
        "vigente"
    ).length;


  const pendientes =
    documentosState.documentos.filter(
      (documento) =>
        documento.estado ===
        "pendiente"
    ).length;


  const archivados =
    documentosState.documentos.filter(
      (documento) =>
        documento.estado ===
        "archivado"
    ).length;


  establecerTextoDocumentos(
    documentosElementos.indicadorTotal,
    total
  );


  establecerTextoDocumentos(
    documentosElementos.indicadorVigentes,
    vigentes
  );


  establecerTextoDocumentos(
    documentosElementos.indicadorPendientes,
    pendientes
  );


  establecerTextoDocumentos(
    documentosElementos.indicadorArchivados,
    archivados
  );


  establecerTextoDocumentos(
    documentosElementos.contadorVisibles,
    documentosState.documentosFiltrados.length
  );

}


/* =========================================================
   RENDERIZADO GENERAL
========================================================= */

function renderizarDocumentos() {

  if (
    !documentosElementos.listado
  ) {

    return;

  }


  documentosElementos.listado.innerHTML =
    "";


  ocultarElementoDocumentos(
    documentosElementos.vacio
  );


  ocultarElementoDocumentos(
    documentosElementos.sinResultados
  );


  const hayDocumentos =
    documentosState.documentos.length > 0;


  const hayResultados =
    documentosState.documentosFiltrados.length > 0;


  if (!hayDocumentos) {

    ocultarElementoDocumentos(
      documentosElementos.listado
    );


    mostrarElementoDocumentos(
      documentosElementos.vacio
    );


    return;

  }


  if (!hayResultados) {

    ocultarElementoDocumentos(
      documentosElementos.listado
    );


    mostrarElementoDocumentos(
      documentosElementos.sinResultados
    );


    return;

  }


  documentosElementos.listado.innerHTML =
    documentosState.documentosFiltrados
      .map(
        crearDocumentoHTML
      )
      .join("");


  mostrarElementoDocumentos(
    documentosElementos.listado
  );

}


/* =========================================================
   TARJETA DEL DOCUMENTO
========================================================= */

function crearDocumentoHTML(
  documento
) {

  const tipo =
    DOCUMENTOS_TIPOS[
      documento.tipo
    ] ||
    DOCUMENTOS_TIPOS.otro;


  const estado =
    DOCUMENTOS_ESTADOS[
      documento.estado
    ] ||
    DOCUMENTOS_ESTADOS.borrador;


  const fecha =
    documento.fecha
      ? formatearFechaDocumentos(
          documento.fecha
        )
      : "Sin fecha";


  const vinculacion =
    documento.programa ||
    documento.proyecto ||
    "Sin vinculación";


  return `
    <article
      class="documento-card"
      data-documento-id="${escaparAtributoDocumentos(documento.id)}"
    >

      <div class="documento-card__cabecera">

        <div class="documento-card__identidad">

          <span
            class="documento-card__icono"
            aria-hidden="true"
          >
            □
          </span>

          <div>

            <p class="documento-card__tipo">
              ${escaparHTMLDocumentos(tipo)}
            </p>

            <h3 class="documento-card__titulo">
              ${escaparHTMLDocumentos(documento.titulo)}
            </h3>

          </div>

        </div>


        <span
          class="documento-estado ${estado.clase}"
        >
          ${escaparHTMLDocumentos(estado.etiqueta)}
        </span>

      </div>


      ${
        documento.descripcion
          ? `
            <p class="documento-card__descripcion">
              ${escaparHTMLDocumentos(documento.descripcion)}
            </p>
          `
          : ""
      }


      <div class="documento-card__datos">

        <div class="documento-card__dato">

          <span>
            Fecha
          </span>

          <strong>
            ${escaparHTMLDocumentos(fecha)}
          </strong>

        </div>


        <div class="documento-card__dato">

          <span>
            Institución
          </span>

          <strong>
            ${escaparHTMLDocumentos(
              documento.institucion ||
              "Sin institución"
            )}
          </strong>

        </div>


        <div class="documento-card__dato">

          <span>
            Responsable
          </span>

          <strong>
            ${escaparHTMLDocumentos(
              documento.responsable ||
              "Sin responsable"
            )}
          </strong>

        </div>


        <div class="documento-card__dato">

          <span>
            Vinculación
          </span>

          <strong>
            ${escaparHTMLDocumentos(vinculacion)}
          </strong>

        </div>

      </div>


      <div class="documento-card__acciones">

        ${
          documento.enlace
            ? `
              <a
                href="${escaparAtributoDocumentos(documento.enlace)}"
                target="_blank"
                rel="noopener noreferrer"
                class="documento-card__boton"
              >
                Abrir archivo
              </a>
            `
            : ""
        }


        <button
          type="button"
          class="documento-card__boton"
          data-editar-documento="${escaparAtributoDocumentos(documento.id)}"
        >
          Editar
        </button>


        <button
          type="button"
          class="documento-card__boton documento-card__boton--eliminar"
          data-eliminar-documento="${escaparAtributoDocumentos(documento.id)}"
        >
          Eliminar
        </button>

      </div>

    </article>
  `;

}


/* =========================================================
   ABRIR MODAL NUEVO
========================================================= */

function abrirModalNuevoDocumento() {

  documentosState.documentoEditandoId =
    null;


  documentosElementos.formulario
    ?.reset();


  limpiarErroresDocumento();


  establecerTextoDocumentos(
    documentosElementos.modalTitulo,
    "Nuevo documento"
  );


  establecerTextoDocumentos(
    documentosElementos.modalDescripcion,
    "Completá la información básica del documento."
  );


  if (
    documentosElementos.campoEstado
  ) {

    documentosElementos.campoEstado.value =
      "borrador";

  }


  if (
    documentosElementos.campoFecha
  ) {

    documentosElementos.campoFecha.value =
      normalizarFechaInputDocumentos(
        new Date()
      );

  }


  if (
    documentosElementos.campoId
  ) {

    documentosElementos.campoId.value =
      "";

  }


  abrirModalDocumento();


  window.setTimeout(
    () => {

      documentosElementos.campoTitulo
        ?.focus();

    },
    60
  );

}


/* =========================================================
   ABRIR MODAL EDITAR
========================================================= */

function abrirModalEditarDocumento(
  documentoId
) {

  const documento =
    documentosState.documentos.find(
      (registro) =>
        registro.id ===
        documentoId
    );


  if (!documento) {

    mostrarNotificacionDocumentos({

      tipo:
        "error",

      titulo:
        "Documento no encontrado",

      mensaje:
        "No fue posible localizar el registro seleccionado."

    });


    return;

  }


  documentosState.documentoEditandoId =
    documentoId;


  completarCampoDocumento(
    "id",
    documento.id
  );


  completarCampoDocumento(
    "titulo",
    documento.titulo
  );


  completarCampoDocumento(
    "tipo",
    documento.tipo
  );


  completarCampoDocumento(
    "estado",
    documento.estado
  );


  completarCampoDocumento(
    "fecha",
    normalizarFechaInputDocumentos(
      documento.fecha
    )
  );


  completarCampoDocumento(
    "responsable",
    documento.responsable
  );


  completarCampoDocumento(
    "institucion",
    documento.institucion
  );


  completarCampoDocumento(
    "programaId",
    documento.programaId
  );


  completarCampoDocumento(
    "proyectoId",
    documento.proyectoId
  );


  completarCampoDocumento(
    "enlace",
    documento.enlace
  );


  completarCampoDocumento(
    "descripcion",
    documento.descripcion
  );


  limpiarErroresDocumento();


  establecerTextoDocumentos(
    documentosElementos.modalTitulo,
    "Editar documento"
  );


  establecerTextoDocumentos(
    documentosElementos.modalDescripcion,
    "Actualizá la información del documento seleccionado."
  );


  abrirModalDocumento();


  window.setTimeout(
    () => {

      documentosElementos.campoTitulo
        ?.focus();

    },
    60
  );

}


/* =========================================================
   COMPLETAR CAMPO
========================================================= */

function completarCampoDocumento(
  nombre,
  valor
) {

  const campo =
    documentosElementos.formulario
      ?.elements
      .namedItem(
        nombre
      );


  if (!campo) {

    return;

  }


  campo.value =
    valor ?? "";

}


/* =========================================================
   GUARDAR DOCUMENTO
========================================================= */

function guardarDocumento(
  evento
) {

  evento.preventDefault();


  if (
    !validarFormularioDocumento()
  ) {

    mostrarNotificacionDocumentos({

      tipo:
        "error",

      titulo:
        "Revisá la información",

      mensaje:
        "Completá los campos obligatorios antes de guardar."

    });


    enfocarPrimerErrorDocumento();

    return;

  }


  const datosFormulario =
    new FormData(
      documentosElementos.formulario
    );


  const programaId =
    obtenerTextoDocumentos(
      datosFormulario.get(
        "programaId"
      )
    );


  const proyectoId =
    obtenerTextoDocumentos(
      datosFormulario.get(
        "proyectoId"
      )
    );


  const programa =
    documentosState.programas.find(
      (registro) =>
        obtenerTextoDocumentos(
          registro.id
        ) ===
        programaId
    );


  const proyecto =
    documentosState.proyectos.find(
      (registro) =>
        obtenerTextoDocumentos(
          registro.id ||
          registro.proyectoId
        ) ===
        proyectoId
    );


  const ahora =
    new Date().toISOString();


  const datosDocumento = {

    titulo:
      obtenerTextoDocumentos(
        datosFormulario.get(
          "titulo"
        )
      ),

    tipo:
      normalizarTipoDocumento(
        datosFormulario.get(
          "tipo"
        )
      ),

    estado:
      normalizarEstadoDocumento(
        datosFormulario.get(
          "estado"
        )
      ),

    fecha:
      obtenerTextoDocumentos(
        datosFormulario.get(
          "fecha"
        )
      ),

    responsable:
      obtenerTextoDocumentos(
        datosFormulario.get(
          "responsable"
        )
      ),

    institucion:
      obtenerTextoDocumentos(
        datosFormulario.get(
          "institucion"
        )
      ),

    programaId,

    programa:
      obtenerTextoDocumentos(
        programa?.nombre ||
        programa?.titulo
      ),

    proyectoId,

    proyecto:
      obtenerTextoDocumentos(
        proyecto?.nombre ||
        proyecto?.titulo
      ),

    enlace:
      obtenerTextoDocumentos(
        datosFormulario.get(
          "enlace"
        )
      ),

    descripcion:
      obtenerTextoDocumentos(
        datosFormulario.get(
          "descripcion"
        )
      ),

    fechaActualizacion:
      ahora

  };


  if (
    documentosState.documentoEditandoId
  ) {

    const indice =
      documentosState.documentos.findIndex(
        (documento) =>
          documento.id ===
          documentosState.documentoEditandoId
      );


    if (
      indice === -1
    ) {

      return;

    }


    documentosState.documentos[indice] = {

      ...documentosState.documentos[indice],

      ...datosDocumento

    };

  } else {

    documentosState.documentos.unshift({

      id:
        generarIdDocumento(),

      ...datosDocumento,

      fechaCreacion:
        ahora

    });

  }


  if (
    !persistirDocumentos()
  ) {

    return;

  }


  cerrarModalDocumento();


  actualizarDocumentosCompleto();


  mostrarNotificacionDocumentos({

    tipo:
      "success",

    titulo:
      documentosState.documentoEditandoId
        ? "Documento actualizado"
        : "Documento registrado",

    mensaje:
      documentosState.documentoEditandoId
        ? "Los cambios fueron guardados correctamente."
        : "El documento fue incorporado al archivo institucional."

  });


  documentosState.documentoEditandoId =
    null;

}


/* =========================================================
   VALIDACIÓN
========================================================= */

function validarFormularioDocumento() {

  limpiarErroresDocumento();


  let valido =
    true;


  valido =
    validarCampoDocumento(
      documentosElementos.campoTitulo,
      "Ingresá el título del documento."
    ) && valido;


  valido =
    validarCampoDocumento(
      documentosElementos.campoTipo,
      "Seleccioná el tipo de documento."
    ) && valido;


  const enlace =
    documentosElementos.campoEnlace;


  if (
    enlace &&
    enlace.value &&
    !enlace.checkValidity()
  ) {

    mostrarErrorDocumento(
      enlace,
      "Ingresá un enlace válido."
    );


    valido =
      false;

  }


  return valido;

}


function validarCampoDocumento(
  campo,
  mensaje
) {

  if (
    !campo ||
    !obtenerTextoDocumentos(
      campo.value
    )
  ) {

    mostrarErrorDocumento(
      campo,
      mensaje
    );


    return false;

  }


  return true;

}


/* =========================================================
   ERRORES
========================================================= */

function mostrarErrorDocumento(
  campo,
  mensaje
) {

  if (!campo) {

    return;

  }


  campo.setAttribute(
    "aria-invalid",
    "true"
  );


  const error =
    documentosElementos.formulario
      ?.querySelector(
        `[data-error="${campo.name}"]`
      );


  establecerTextoDocumentos(
    error,
    mensaje
  );

}


function limpiarErrorDocumento(
  campo
) {

  if (
    !campo ||
    !campo.name
  ) {

    return;

  }


  campo.removeAttribute(
    "aria-invalid"
  );


  const error =
    documentosElementos.formulario
      ?.querySelector(
        `[data-error="${campo.name}"]`
      );


  establecerTextoDocumentos(
    error,
    ""
  );

}


function limpiarErroresDocumento() {

  documentosElementos.formulario
    ?.querySelectorAll(
      "input, select, textarea"
    )
    .forEach(
      limpiarErrorDocumento
    );

}


function manejarCambioCampoDocumento(
  evento
) {

  limpiarErrorDocumento(
    evento.target
  );

}


function enfocarPrimerErrorDocumento() {

  documentosElementos.formulario
    ?.querySelector(
      '[aria-invalid="true"]'
    )
    ?.focus();

}

/* =========================================================
   ACCIONES DE LAS TARJETAS
========================================================= */

function manejarAccionesDocumento(
  evento
) {

  const botonEditar =
    evento.target.closest(
      "[data-editar-documento]"
    );


  if (botonEditar) {

    abrirModalEditarDocumento(
      botonEditar.dataset
        .editarDocumento
    );

    return;

  }


  const botonEliminar =
    evento.target.closest(
      "[data-eliminar-documento]"
    );


  if (botonEliminar) {

    eliminarDocumento(
      botonEliminar.dataset
        .eliminarDocumento
    );

  }

}


/* =========================================================
   ELIMINAR DOCUMENTO
========================================================= */

function eliminarDocumento(
  documentoId
) {

  const documento =
    documentosState.documentos.find(
      (registro) =>
        registro.id ===
        documentoId
    );


  if (!documento) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Querés eliminar el documento "${documento.titulo}"?`
    );


  if (!confirmar) {

    return;

  }


  documentosState.documentos =
    documentosState.documentos.filter(
      (registro) =>
        registro.id !==
        documentoId
    );


  if (
    !persistirDocumentos()
  ) {

    return;

  }


  actualizarDocumentosCompleto();


  mostrarNotificacionDocumentos({

    tipo:
      "success",

    titulo:
      "Documento eliminado",

    mensaje:
      "El registro fue eliminado correctamente."

  });

}


/* =========================================================
   PERSISTENCIA
========================================================= */

function persistirDocumentos() {

  try {

    localStorage.setItem(
      DOCUMENTOS_STORAGE_KEY,
      JSON.stringify(
        documentosState.documentos
      )
    );


    return true;

  } catch (error) {

    console.error(
      "No fue posible guardar los documentos:",
      error
    );


    mostrarNotificacionDocumentos({

      tipo:
        "error",

      titulo:
        "No pudimos guardar los cambios",

      mensaje:
        "Se produjo un inconveniente al actualizar el archivo institucional."

    });


    return false;

  }

}


/* =========================================================
   ACTUALIZACIÓN MANUAL
========================================================= */

function actualizarDocumentosManual() {

  mostrarLoaderDocumentos();


  window.setTimeout(
    () => {

      cargarProgramasDocumentos();

      cargarProyectosDocumentos();

      cargarSelectProgramasDocumentos();

      cargarSelectProyectosDocumentos();

      cargarDocumentos();

      ocultarLoaderDocumentos();

      actualizarDocumentosCompleto();


      mostrarNotificacionDocumentos({

        tipo:
          "success",

        titulo:
          "Documentos actualizados",

        mensaje:
          "La información fue recargada correctamente."

      });

    },
    300
  );

}


/* =========================================================
   MODAL
========================================================= */

function abrirModalDocumento() {

  if (
    !documentosElementos.modal
  ) {

    return;

  }


  documentosElementos.modal.hidden =
    false;


  document.body.classList.add(
    "documentos-modal-abierto"
  );

}


function cerrarModalDocumento() {

  if (
    !documentosElementos.modal
  ) {

    return;

  }


  documentosElementos.modal.hidden =
    true;


  document.body.classList.remove(
    "documentos-modal-abierto"
  );


  documentosState.documentoEditandoId =
    null;

}


/* =========================================================
   TECLADO
========================================================= */

function manejarTecladoDocumentos(
  evento
) {

  if (
    evento.key !== "Escape"
  ) {

    return;

  }


  if (
    documentosElementos.modal &&
    !documentosElementos.modal.hidden
  ) {

    cerrarModalDocumento();

  }

}


/* =========================================================
   CAMBIO DE STORAGE
========================================================= */

function manejarCambioStorageDocumentos(
  evento
) {

  const clavesRelevantes = [

    DOCUMENTOS_STORAGE_KEY,

    DOCUMENTOS_PROGRAMAS_KEY,

    ...DOCUMENTOS_PROYECTOS_KEYS

  ];


  if (
    !clavesRelevantes.includes(
      evento.key
    )
  ) {

    return;

  }


  cargarProgramasDocumentos();

  cargarProyectosDocumentos();

  cargarSelectProgramasDocumentos();

  cargarSelectProyectosDocumentos();

  cargarDocumentos();

  actualizarDocumentosCompleto();

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacionDocumentos({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !documentosElementos.notificacion
  ) {

    return;

  }


  window.clearTimeout(
    documentosState.temporizadorNotificacion
  );


  const configuraciones = {

    success: {

      icono:
        "✓",

      color:
        "#61c79a",

      borde:
        "rgba(97,199,154,.28)",

      fondo:
        "rgba(97,199,154,.10)"

    },

    error: {

      icono:
        "!",

      color:
        "#e47a7a",

      borde:
        "rgba(228,122,122,.30)",

      fondo:
        "rgba(228,122,122,.10)"

    },

    info: {

      icono:
        "i",

      color:
        "#78aee8",

      borde:
        "rgba(120,174,232,.28)",

      fondo:
        "rgba(120,174,232,.10)"

    }

  };


  const configuracion =
    configuraciones[tipo] ||
    configuraciones.success;


  establecerTextoDocumentos(
    documentosElementos.notificacionIcono,
    configuracion.icono
  );


  establecerTextoDocumentos(
    documentosElementos.notificacionTitulo,
    titulo
  );


  establecerTextoDocumentos(
    documentosElementos.notificacionMensaje,
    mensaje
  );


  documentosElementos.notificacion
    .style.borderColor =
      configuracion.borde;


  documentosElementos.notificacionIcono
    .style.color =
      configuracion.color;


  documentosElementos.notificacionIcono
    .style.borderColor =
      configuracion.borde;


  documentosElementos.notificacionIcono
    .style.background =
      configuracion.fondo;


  documentosElementos.notificacion.hidden =
    false;


  documentosState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacionDocumentos,
      4500
    );

}


function ocultarNotificacionDocumentos() {

  if (
    !documentosElementos.notificacion
  ) {

    return;

  }


  documentosElementos.notificacion.hidden =
    true;


  window.clearTimeout(
    documentosState.temporizadorNotificacion
  );

}


/* =========================================================
   LOADER
========================================================= */

function mostrarLoaderDocumentos() {

  mostrarElementoDocumentos(
    documentosElementos.loader
  );


  ocultarElementoDocumentos(
    documentosElementos.listado
  );


  ocultarElementoDocumentos(
    documentosElementos.vacio
  );


  ocultarElementoDocumentos(
    documentosElementos.sinResultados
  );

}


function ocultarLoaderDocumentos() {

  ocultarElementoDocumentos(
    documentosElementos.loader
  );

}


/* =========================================================
   COLECCIONES AUXILIARES
========================================================= */

function obtenerPrimeraColeccionDocumentos(
  claves
) {

  for (
    const clave of claves
  ) {

    try {

      const contenido =
        localStorage.getItem(
          clave
        );


      if (!contenido) {

        continue;

      }


      const datos =
        JSON.parse(
          contenido
        );


      if (
        Array.isArray(datos)
      ) {

        return datos;

      }

    } catch (error) {

      console.warn(
        `No fue posible leer ${clave}:`,
        error
      );

    }

  }


  return [];

}


/* =========================================================
   ORDENAMIENTO
========================================================= */

function ordenarDocumentosPorFecha(
  documentoA,
  documentoB
) {

  const fechaA =
    crearFechaDocumentos(
      documentoA.fecha ||
      documentoA.fechaCreacion
    );


  const fechaB =
    crearFechaDocumentos(
      documentoB.fecha ||
      documentoB.fechaCreacion
    );


  if (
    fechaA &&
    fechaB
  ) {

    return (
      fechaB.getTime() -
      fechaA.getTime()
    );

  }


  if (
    fechaA &&
    !fechaB
  ) {

    return -1;

  }


  if (
    !fechaA &&
    fechaB
  ) {

    return 1;

  }


  return documentoA.titulo.localeCompare(
    documentoB.titulo,
    "es",
    {
      sensitivity:
        "base"
    }
  );

}


function ordenarPorNombreDocumentos(
  elementoA,
  elementoB
) {

  const nombreA =
    obtenerTextoDocumentos(
      elementoA.nombre ||
      elementoA.titulo
    );


  const nombreB =
    obtenerTextoDocumentos(
      elementoB.nombre ||
      elementoB.titulo
    );


  return nombreA.localeCompare(
    nombreB,
    "es",
    {
      sensitivity:
        "base"
    }
  );

}


/* =========================================================
   GENERACIÓN DE ID
========================================================= */

function generarIdDocumento() {

  const fecha =
    Date.now()
      .toString(36)
      .toUpperCase();


  const aleatorio =
    Math.random()
      .toString(36)
      .slice(2, 9)
      .toUpperCase();


  return `DOCUMENTO-${fecha}-${aleatorio}`;

}


/* =========================================================
   FECHAS
========================================================= */

function crearFechaDocumentos(
  valor
) {

  if (!valor) {

    return null;

  }


  if (
    valor instanceof Date
  ) {

    return valor;

  }


  if (
    typeof valor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      valor
    )
  ) {

    const [
      anio,
      mes,
      dia
    ] =
      valor
        .split("-")
        .map(Number);


    return new Date(
      anio,
      mes - 1,
      dia
    );

  }


  const fecha =
    new Date(
      valor
    );


  return Number.isNaN(
    fecha.getTime()
  )
    ? null
    : fecha;

}


function formatearFechaDocumentos(
  valor
) {

  const fecha =
    crearFechaDocumentos(
      valor
    );


  if (!fecha) {

    return "Sin fecha";

  }


  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric"
    }
  ).format(
    fecha
  );

}


function normalizarFechaInputDocumentos(
  valor
) {

  const fecha =
    crearFechaDocumentos(
      valor
    );


  if (!fecha) {

    return "";

  }


  const anio =
    fecha.getFullYear();


  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const dia =
    String(
      fecha.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${anio}-${mes}-${dia}`;

}


/* =========================================================
   UTILIDADES DE TEXTO
========================================================= */

function obtenerTextoDocumentos(
  valor
) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return "";

  }


  return String(
    valor
  ).trim();

}


function normalizarTextoDocumentos(
  valor
) {

  return obtenerTextoDocumentos(
    valor
  )
    .toLocaleLowerCase(
      "es"
    )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}


function escaparHTMLDocumentos(
  valor
) {

  return obtenerTextoDocumentos(
    valor
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escaparAtributoDocumentos(
  valor
) {

  return escaparHTMLDocumentos(
    valor
  ).replace(
    /`/g,
    "&#096;"
  );

}


/* =========================================================
   UTILIDADES DEL DOM
========================================================= */

function establecerTextoDocumentos(
  elemento,
  valor
) {

  if (!elemento) {

    return;

  }


  elemento.textContent =
    String(
      valor
    );

}


function mostrarElementoDocumentos(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    false;

}


function ocultarElementoDocumentos(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    true;

}


/* =========================================================
   FIN DEL ARCHIVO
========================================================= */