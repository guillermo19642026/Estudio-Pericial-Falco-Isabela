/* =========================================================
   BIBLIOTECA FALCO®
   FICHA TÉCNICA DE INSTRUMENTOS
   Sistema dinámico desde Firestore
========================================================= */


import {
  auth,
  db
} from "./firebase-config.js";


import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


console.log(
  "🧠 Biblioteca FALCO® · Ficha técnica de instrumento"
);



/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


const ROLES_AUTORIZADOS = [

  "admin",

  "biblioteca",

  "perito",

  "profesional"

];



/* =========================================================
   ELEMENTOS DE LA INTERFAZ
========================================================= */

const ui = {

  estado:
    document.getElementById(
      "instrumentoEstado"
    ),

  titulo:
    document.getElementById(
      "instrumentoTitulo"
    ),

  sigla:
    document.getElementById(
      "instrumentoSigla"
    ),

  descripcion:
    document.getElementById(
      "instrumentoDescripcion"
    ),

  nombreCorto:
    document.getElementById(
      "instrumentoNombreCorto"
    ),

  tipo:
    document.getElementById(
      "instrumentoTipo"
    ),

  poblacion:
    document.getElementById(
      "instrumentoPoblacion"
    ),

  administracion:
    document.getElementById(
      "instrumentoAdministracion"
    ),

  tiempo:
    document.getElementById(
      "instrumentoTiempo"
    ),

  acceso:
    document.getElementById(
      "instrumentoAcceso"
    ),

  items:
    document.getElementById(
      "instrumentoItems"
    ),

  identificacion:
    document.getElementById(
      "instrumentoIdentificacion"
    ),

  finalidad:
    document.getElementById(
      "instrumentoFinalidad"
    ),

  evaluacion:
    document.getElementById(
      "instrumentoEvaluacion"
    ),

  administracionDetalle:
    document.getElementById(
      "instrumentoAdministracionDetalle"
    ),

  respuesta:
    document.getElementById(
      "instrumentoRespuesta"
    ),

  correccion:
    document.getElementById(
      "instrumentoCorreccion"
    ),

  analisis:
    document.getElementById(
      "instrumentoAnalisis"
    ),

  interpretacion:
    document.getElementById(
      "instrumentoInterpretacion"
    ),

  usoForense:
    document.getElementById(
      "instrumentoUsoForense"
    ),

  validez:
    document.getElementById(
      "instrumentoValidez"
    ),

  limitaciones:
    document.getElementById(
      "instrumentoLimitaciones"
    ),

  integracion:
    document.getElementById(
      "instrumentoIntegracion"
    ),

  errores:
    document.getElementById(
      "instrumentoErrores"
    ),

  ejemplo:
    document.getElementById(
      "instrumentoEjemplo"
    ),

  bibliografia:
    document.getElementById(
      "instrumentoBibliografia"
    ),

  fuenteOficial:
    document.getElementById(
      "instrumentoFuenteOficial"
    ),

  fuenteOficialHero:
    document.getElementById(
      "instrumentoFuenteOficialHero"
    ),

  logout:
    document.getElementById(
      "logoutBtn"
    )

};



/* =========================================================
   PARÁMETROS DE URL
========================================================= */

const params =
  new URLSearchParams(
    window.location.search
  );


const instrumentoId =
  params.get(
    "id"
  );



/* =========================================================
   SEGURIDAD HTML
========================================================= */

function escapeHtml(
  valor = ""
) {

  return String(valor)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}



/* =========================================================
   URL SEGURA
========================================================= */

function urlSegura(
  valor = ""
) {

  if (
    !valor
  ) {

    return "";

  }


  try {

    const url =
      new URL(
        valor,
        window.location.href
      );


    if (
      ![
        "http:",
        "https:"
      ].includes(
        url.protocol
      )
    ) {

      return "";

    }


    return url.href;


  } catch {

    return "";

  }

}



/* =========================================================
   RENDER DE CONTENIDO TÉCNICO

   Los contenidos de estas fichas serán creados
   exclusivamente desde el panel administrativo FALCO®.

   Se admite HTML controlado para poder mostrar:
   - párrafos
   - listas
   - tablas
   - cajas técnicas
   - ejemplos profesionales
========================================================= */

function renderContenido(
  elemento,
  contenido
) {

  if (
    !elemento
  ) {

    return;

  }


  if (
    !contenido
  ) {

    elemento.innerHTML = `

      <p>
        Información en preparación.
      </p>

    `;

    return;

  }


  elemento.innerHTML =
    contenido;

}



/* =========================================================
   FICHA DE IDENTIFICACIÓN
========================================================= */

function crearIdentificacion(
  data
) {

  const filas = [

    [
      "Nombre completo",
      data.nombreCompleto
    ],

    [
      "Sigla",
      data.sigla
    ],

    [
      "Autor / autores",
      data.autores
    ],

    [
      "Tipo de instrumento",
      data.tipoInstrumento
    ],

    [
      "Área principal",
      data.area
    ],

    [
      "Población",
      data.poblacion
    ],

    [
      "Modalidad",
      data.modalidad
    ],

    [
      "Tiempo aproximado",
      data.tiempo
    ],

    [
      "Cantidad de ítems",
      data.cantidadItems
    ],

    [
      "Estado del material",
      data.accesoMaterial
    ]

  ];


  const filasValidas =
    filas.filter(
      item =>
        item[1]
    );


  return `

    <table
      class="bf-instrument-table"
    >

      <tbody>

        ${

          filasValidas

            .map(
              (
                [
                  etiqueta,
                  valor
                ]
              ) => `

                <tr>

                  <th>
                    ${escapeHtml(etiqueta)}
                  </th>

                  <td>
                    ${escapeHtml(valor)}
                  </td>

                </tr>

              `
            )

            .join("")

        }

      </tbody>

    </table>

  `;

}



/* =========================================================
   BADGES DE ESTADO
========================================================= */

function crearBadges(
  data
) {

  const badges = [];


  if (
    data.tipoAcceso
  ) {

    badges.push(
      data.tipoAcceso
    );

  }


  if (
    data.materialProtegido === true
  ) {

    badges.push(
      "Material protegido"
    );

  }


  if (
    data.materialProtegido === false
  ) {

    badges.push(
      "Material abierto"
    );

  }


  if (
    data.reproduccionItems
  ) {

    badges.push(
      `Ítems: ${data.reproduccionItems}`
    );

  }


  if (
    data.usoProfesional
  ) {

    badges.push(
      data.usoProfesional
    );

  }


  if (
    badges.length === 0
  ) {

    return "";

  }


  return `

    <div
      class="bf-instrument-badges"
    >

      ${

        badges

          .map(
            badge => `

              <span
                class="bf-instrument-badge"
              >
                ${escapeHtml(badge)}
              </span>

            `
          )

          .join("")

      }

    </div>

  `;

}



/* =========================================================
   ACTUALIZAR TÍTULO DEL NAVEGADOR
========================================================= */

function actualizarTituloPagina(
  data
) {

  const titulo =
    data.sigla
      ? `${data.sigla} | Biblioteca FALCO®`
      : `${data.nombreCompleto || "Instrumento"} | Biblioteca FALCO®`;


  document.title =
    titulo;

}



/* =========================================================
   RENDER PRINCIPAL
========================================================= */

function renderInstrumento(
  data
) {

  actualizarTituloPagina(
    data
  );


  /* =======================================================
     HERO
  ======================================================= */

  if (
    ui.titulo
  ) {

    ui.titulo.childNodes[0].nodeValue =

      `${data.nombreCompleto || data.titulo || "Instrumento psicológico"} `;

  }


  if (
    ui.sigla
  ) {

    ui.sigla.textContent =
      data.sigla ||
      "Ficha técnica";

  }


  if (
    ui.descripcion
  ) {

    ui.descripcion.textContent =

      data.descripcionCorta ||

      data.descripcion ||

      "Información técnica y profesional del instrumento.";

  }


  if (
    ui.nombreCorto
  ) {

    ui.nombreCorto.textContent =

      data.sigla ||

      data.nombreCompleto ||

      "Instrumento";

  }



  /* =======================================================
     FICHA RÁPIDA
  ======================================================= */

  if (
    ui.tipo
  ) {

    ui.tipo.textContent =

      data.tipoInstrumento ||

      "—";

  }


  if (
    ui.poblacion
  ) {

    ui.poblacion.textContent =

      data.poblacion ||

      "—";

  }


  if (
    ui.administracion
  ) {

    ui.administracion.textContent =

      data.modalidad ||

      data.administracionResumen ||

      "—";

  }


  if (
    ui.tiempo
  ) {

    ui.tiempo.textContent =

      data.tiempo ||

      "—";

  }


  if (
    ui.acceso
  ) {

    ui.acceso.textContent =

      data.accesoMaterial ||

      data.tipoAcceso ||

      "Consultar fuente oficial";

  }


  if (
    ui.items
  ) {

    ui.items.textContent =

      data.reproduccionItems ||

      "Consultar condiciones de uso";

  }



  /* =======================================================
     IDENTIFICACIÓN
  ======================================================= */

  if (
    ui.identificacion
  ) {

    ui.identificacion.innerHTML =

      crearIdentificacion(
        data
      )

      +

      crearBadges(
        data
      );

  }



  /* =======================================================
     CONTENIDOS
  ======================================================= */

  renderContenido(

    ui.finalidad,

    data.finalidad

  );


  renderContenido(

    ui.evaluacion,

    data.queEvalua

  );


  renderContenido(

    ui.administracionDetalle,

    data.administracionDetalle

  );


  renderContenido(

    ui.respuesta,

    data.modalidadRespuesta

  );


  renderContenido(

    ui.correccion,

    data.correccion

  );


  renderContenido(

    ui.analisis,

    data.analisis

  );


  renderContenido(

    ui.interpretacion,

    data.interpretacion

  );


  renderContenido(

    ui.usoForense,

    data.usoForense

  );


  renderContenido(

    ui.validez,

    data.validez

  );


  renderContenido(

    ui.limitaciones,

    data.limitaciones

  );


  renderContenido(

    ui.integracion,

    data.integracionPericial

  );


  renderContenido(

    ui.errores,

    data.erroresFrecuentes

  );


  renderContenido(

    ui.ejemplo,

    data.ejemploIntegracion

  );


  renderContenido(

    ui.bibliografia,

    data.bibliografia

  );



  /* =======================================================
     FUENTE OFICIAL
  ======================================================= */

  const fuente =
    urlSegura(
      data.fuenteOficial
    );


  if (
    fuente
  ) {

    if (
      ui.fuenteOficial
    ) {

      ui.fuenteOficial.href =
        fuente;


      ui.fuenteOficial.hidden =
        false;

    }


    if (
      ui.fuenteOficialHero
    ) {

      ui.fuenteOficialHero.href =
        fuente;


      ui.fuenteOficialHero.hidden =
        false;

    }

  }



  /* =======================================================
     ESTADO
  ======================================================= */

  if (
    ui.estado
  ) {

    ui.estado.classList.add(
      "is-ready"
    );


    ui.estado.innerHTML = `

      <span
        class="bf-access-state__dot"
      ></span>

      <span>
        Ficha técnica profesional
      </span>

    `;

  }

}



/* =========================================================
   INSTRUMENTO NO ENCONTRADO
========================================================= */

function mostrarNoEncontrado() {

  if (
    ui.estado
  ) {

    ui.estado.innerHTML = `

      <span
        class="bf-access-state__dot"
      ></span>

      <span>
        Instrumento no encontrado
      </span>

    `;

  }


  if (
    ui.titulo
  ) {

    ui.titulo.innerHTML = `

      Ficha no disponible

      <em>
        Biblioteca FALCO®
      </em>

    `;

  }


  if (
    ui.descripcion
  ) {

    ui.descripcion.textContent =

      "No encontramos la ficha técnica solicitada.";

  }

}



/* =========================================================
   CARGAR INSTRUMENTO DESDE FIRESTORE
========================================================= */

async function cargarInstrumento() {

  if (
    !instrumentoId
  ) {

    console.warn(
      "No se indicó un instrumento mediante ?id="
    );


    mostrarNoEncontrado();

    return;

  }


  try {

    /*
      Colección específica para las fichas técnicas.

      Ejemplo:
      instrumentos/scl90-r
    */

    const referencia =
  doc(
    db,
    "contenidos",
    instrumentoId
  );


    const snap =
      await getDoc(
        referencia
      );


    if (
      !snap.exists()
    ) {

      console.warn(
        `Instrumento no encontrado: ${instrumentoId}`
      );


      mostrarNoEncontrado();

      return;

    }


    const data =
      snap.data();


    if (
      data.activo === false
    ) {

      mostrarNoEncontrado();

      return;

    }


    renderInstrumento(
      data
    );


    console.log(

      "✅ Instrumento cargado:",

      instrumentoId

    );


  } catch (
    error
  ) {

    console.error(

      "❌ Error cargando instrumento:",

      error

    );


    if (
      ui.estado
    ) {

      ui.estado.innerHTML = `

        <span
          class="bf-access-state__dot"
        ></span>

        <span>
          No se pudo cargar la ficha técnica
        </span>

      `;

    }

  }

}



/* =========================================================
   VERIFICAR USUARIO
========================================================= */

async function verificarUsuario(
  user
) {

  if (
    !user
  ) {

    window.location.href =
      "biblioteca-login.html";

    return;

  }


  try {

    const referencia =
      doc(
        db,
        "usuarios",
        user.uid
      );


    const snap =
      await getDoc(
        referencia
      );


    const data =
      snap.exists()
        ? snap.data()
        : {};


    const rol =

      user.email ===
        ADMIN_EMAIL

        ? "admin"

        :

        (
          data.rol ||

          "visitante"
        );


    if (
      !ROLES_AUTORIZADOS.includes(
        rol
      )
    ) {

      window.location.href =
        "biblioteca-login.html";

      return;

    }


    await cargarInstrumento();


  } catch (
    error
  ) {

    console.error(

      "❌ Error verificando usuario:",

      error

    );


    window.location.href =
      "biblioteca-login.html";

  }

}



/* =========================================================
   FIREBASE AUTH
========================================================= */

onAuthStateChanged(

  auth,

  verificarUsuario

);



/* =========================================================
   CERRAR SESIÓN
========================================================= */

ui.logout?.addEventListener(

  "click",

  async () => {

    try {

      await signOut(
        auth
      );


      window.location.href =
        "biblioteca-login.html";


    } catch (
      error
    ) {

      console.error(

        "Error cerrando sesión:",

        error

      );

    }

  }

);



/* =========================================================
   SCROLL SUAVE PARA ÍNDICE
========================================================= */

document.addEventListener(

  "click",

  event => {

    const enlace =
      event.target.closest(
        'a[href^="#"]'
      );


    if (
      !enlace
    ) {

      return;

    }


    const destinoId =
      enlace
        .getAttribute(
          "href"
        )
        ?.replace(
          "#",
          ""
        );


    if (
      !destinoId
    ) {

      return;

    }


    const destino =
      document.getElementById(
        destinoId
      );


    if (
      !destino
    ) {

      return;

    }


    event.preventDefault();


    destino.scrollIntoView({

      behavior:
        "smooth",

      block:
        "start"

    });

  }

);