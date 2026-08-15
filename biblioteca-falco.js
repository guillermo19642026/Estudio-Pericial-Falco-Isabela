import {
  auth,
  db
} from "./firebase-config.js";


import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


console.log("🔥 Biblioteca FALCO® 2026 cargada");



/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


const MODULO_ACTUAL =
  document.body.dataset.modulo ||
  "biblioteca";



/* =========================================================
   ELEMENTOS DE INTERFAZ
========================================================= */

const ui = {

  container:
    document.getElementById(
      "biblioteca-container"
    ),

  buscador:
    document.getElementById(
      "buscadorBiblioteca"
    ),

  limpiar:
    document.getElementById(
      "limpiarBusqueda"
    ),

  contadorCategorias:
    document.getElementById(
      "contadorCategorias"
    ),

  contadorResultados:
    document.getElementById(
      "contadorResultados"
    ),

  totalRecursos:
    document.getElementById(
      "totalRecursos"
    ),

  totalCategorias:
    document.getElementById(
      "totalCategorias"
    ),

  filtros:
    document.getElementById(
      "filtrosBiblioteca"
    ),

  estado:
    document.getElementById(
      "bibliotecaEstado"
    ),

  vacia:
    document.getElementById(
      "bibliotecaVacia"
    ),

  acceso:
    document.getElementById(
      "estadoAcceso"
    ),

  logout:
    document.getElementById(
      "logoutBtn"
    )

};



/* =========================================================
   ESTADO
========================================================= */

let datos = [];


let usuarioActual = {

  rol:
    "visitante",

  esAdmin:
    false

};


let filtroActivo =
  "";


let textoActivo =
  "";



/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizar(
  valor = ""
) {

  return String(valor)

    .normalize("NFD")

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .toLowerCase()

    .trim();

}



/* =========================================================
   TEXTO INDEXADO
   PARA BUSCADOR Y FILTROS
========================================================= */

function textoIndexado(
  item
) {

  return normalizar(`

    ${item.titulo || ""}

    ${item.descripcion || ""}

    ${item.modulo || ""}

    ${item.tipoContenido || ""}

    ${item.categoria || ""}

    ${item.subcategoria || ""}

    ${item.fuero || ""}

    ${item.tipoEscrito || ""}

    ${item.autor || ""}

    ${item.tags || ""}

    ${item.codigo || ""}

    ${item.numero || ""}

  `);

}



/* =========================================================
   TAGS
========================================================= */

function tagsArray(
  tags
) {

  if (
    Array.isArray(tags)
  ) {

    return tags.filter(
      Boolean
    );

  }


  if (
    typeof tags === "string"
  ) {

    return tags

      .split(",")

      .map(
        tag =>
          tag.trim()
      )

      .filter(
        Boolean
      );

  }


  return [];

}



/* =========================================================
   ESCAPE HTML
   EVITA QUE FIRESTORE INSERTE HTML
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
   VALIDACIÓN DE URL
========================================================= */

function urlSegura(
  url = ""
) {

  const valor =
    String(url).trim();


  if (
    !valor
  ) {

    return "";

  }


  try {

    const parsed =
      new URL(
        valor,
        window.location.href
      );


    if (
      ![
        "http:",
        "https:"
      ].includes(
        parsed.protocol
      )
    ) {

      return "";

    }


    return parsed.href;


  } catch {

    return "";

  }

}



/* =========================================================
   CONTENIDOS ACTIVOS
========================================================= */

function recursosActivos() {

  return datos.filter(
    item =>

      item.modulo ===
        MODULO_ACTUAL

      &&

      item.activo !== false

  );

}



/* =========================================================
   PERMISOS
========================================================= */

function puedeAbrir(
  item
) {

  if (
    usuarioActual.esAdmin
  ) {

    return true;

  }


  const rolesPermitidos =

    Array.isArray(
      item.rolesPermitidos
    )

      ? item.rolesPermitidos

      : [];


  /*
    Si el contenido no tiene rolesPermitidos,
    se considera visible para usuarios
    autorizados a la Biblioteca.
  */

  if (
    rolesPermitidos.length === 0
  ) {

    return true;

  }


  return rolesPermitidos.includes(
    usuarioActual.rol
  );

}



/* =========================================================
   BOTÓN DE ARCHIVO
========================================================= */

function crearBotonArchivo(

  url,

  icono,

  etiqueta,

  permitido

) {

  const safeUrl =
    urlSegura(
      url
    );


  if (
    !safeUrl
  ) {

    return "";

  }


  const destino =

    permitido

      ? safeUrl

      : "biblioteca-login.html?destino=biblioteca";


  return `

    <a

      href="${destino}"

      target="${
        permitido
          ? "_blank"
          : "_self"
      }"

      rel="${
        permitido
          ? "noopener noreferrer"
          : ""
      }"

      class="btn-acceso-mini"

    >

      ${
        permitido

          ? `${icono} ${etiqueta}`

          : "🔒 Acceder para abrir"
      }

    </a>

  `;

}



/* =========================================================
   CREAR TARJETA
========================================================= */

function crearCard(
  item
) {

  const permitido =
    puedeAbrir(
      item
    );


  const tags =
    tagsArray(
      item.tags
    );


  const titulo =
    escapeHtml(

      item.titulo ||

      "Recurso profesional"

    );


  const descripcion =
    escapeHtml(

      item.descripcion ||

      "Recurso profesional disponible para consulta."

    );


  return `

    <article
      class="recurso-card bf-reveal"
    >


      <div
        class="recurso-ficha-top"
      >

        <span
          class="recurso-clase"
        >

          ${
            escapeHtml(

              item.categoria ||

              "Recurso profesional"

            )
          }

        </span>


        <span
          class="recurso-formato"
        >

          ${
            escapeHtml(

              item.icono ||

              "📄"

            )
          }

          ${
            escapeHtml(

              (
                item.tipo ||

                item.tipoContenido ||

                "PDF"
              )

              .toUpperCase()

            )
          }

        </span>

      </div>



      <h3
        class="recurso-titulo"
      >

        ${titulo}

      </h3>



      <p
        class="recurso-descripcion"
      >

        ${descripcion}

      </p>



      <div
        class="recurso-separador"
      ></div>



      <div
        class="recurso-meta"
      >


        <div>

          <small>
            Fuero / Categoría
          </small>

          <strong>

            ${
              escapeHtml(

                item.fuero ||

                item.categoria ||

                "General"

              )
            }

          </strong>

        </div>



        <div>

          <small>
            Tipo / Subcategoría
          </small>

          <strong>

            ${
              escapeHtml(

                item.tipoEscrito ||

                item.subcategoria ||

                "—"

              )
            }

          </strong>

        </div>



        <div>

          <small>
            Autor
          </small>

          <strong>

            ${
              escapeHtml(

                item.autor ||

                "Estudio Pericial Psicológico FALCO®"

              )
            }

          </strong>

        </div>



        <div>

          <small>
            Actualización
          </small>

          <strong>

            ${
              escapeHtml(

                item.fechaActualizacion ||

                item.anio ||

                "2026"

              )
            }

          </strong>

        </div>


      </div>



      <div
        class="recurso-tags"
      >

        ${
          tags

            .map(

              tag =>

                `<span>${
                  escapeHtml(tag)
                }</span>`

            )

            .join("")
        }

      </div>



      <div
        class="recurso-accion recurso-botones"
      >


        ${

          crearBotonArchivo(

            item.urlPdf,

            "📄",

            "PDF",

            permitido

          )

        }


        ${

          crearBotonArchivo(

            item.urlWord,

            "📝",

            "Word",

            permitido

          )

        }


        ${

          crearBotonArchivo(

            item.urlVideo,

            "🎥",

            "Video",

            permitido

          )

        }



        ${

          !item.urlPdf

          &&

          !item.urlWord

          &&

          !item.urlVideo

            ?

            `
              <span
                class="badge-bloqueado"
              >
                Disponible próximamente
              </span>
            `

            :

            ""

        }


      </div>


    </article>

  `;

}



/* =========================================================
   RESUMEN DE CATEGORÍAS
========================================================= */

function actualizarResumen(
  listaTotal
) {

  const conteo =
    {};


  listaTotal.forEach(
    item => {

      const categoria =

        item.categoria ||

        "General";


      conteo[categoria] =

        (
          conteo[categoria] ||

          0
        )

        +

        1;

    }
  );


  if (
    ui.contadorCategorias
  ) {

    ui.contadorCategorias.innerHTML =

      Object.entries(
        conteo
      )

      .sort(
        (a, b) =>
          b[1] - a[1]
      )

      .map(

        (
          [
            categoria,
            total
          ]
        ) => `

          <div
            class="resumen-item"
          >

            <strong>
              ${total}
            </strong>

            <span>
              ${
                escapeHtml(
                  categoria
                )
              }
            </span>

          </div>

        `

      )

      .join("");

  }


  if (
    ui.totalRecursos
  ) {

    ui.totalRecursos.textContent =
      listaTotal.length;

  }


  if (
    ui.totalCategorias
  ) {

    ui.totalCategorias.textContent =

      Object.keys(
        conteo
      ).length;

  }

}



/* =========================================================
   FILTRADO
========================================================= */

function filtrar() {

  const activos =
    recursosActivos();


  const texto =
    normalizar(
      textoActivo
    );


  const filtro =
    normalizar(
      filtroActivo
    );


  return activos.filter(
    item => {

      const indice =
        textoIndexado(
          item
        );


      const coincideTexto =

        !texto

        ||

        indice.includes(
          texto
        );


      const coincideFiltro =

        !filtro

        ||

        indice.includes(
          filtro
        );


      return (

        coincideTexto

        &&

        coincideFiltro

      );

    }
  );

}



/* =========================================================
   RENDER
========================================================= */

function render() {

  if (
    !ui.container
  ) {

    console.error(
      "❌ biblioteca-container no encontrado"
    );

    return;

  }


  const lista =
    filtrar();


  ui.container.innerHTML =

    lista

      .map(
        crearCard
      )

      .join("");


  if (
    ui.contadorResultados
  ) {

    ui.contadorResultados.textContent =
      lista.length;

  }


  if (
    ui.estado
  ) {

    ui.estado.hidden =
      true;

  }


  if (
    ui.vacia
  ) {

    ui.vacia.hidden =
      lista.length !== 0;

  }


  activarReveal();

}



/* =========================================================
   ANIMACIONES
========================================================= */

function activarReveal() {

  const elementos =

    document.querySelectorAll(

      ".bf-reveal:not(.is-visible)"

    );


  if (
    !(
      "IntersectionObserver"
      in window
    )
  ) {

    elementos.forEach(

      el =>
        el.classList.add(
          "is-visible"
        )

    );

    return;

  }


  const observer =

    new IntersectionObserver(

      entries => {

        entries.forEach(

          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "is-visible"
              );


              observer.unobserve(
                entry.target
              );

            }

          }

        );

      },

      {

        threshold:
          0.08

      }

    );


  elementos.forEach(

    (
      el,
      index
    ) => {

      el.style.transitionDelay =

        `${
          Math.min(
            index * 35,
            280
          )
        }ms`;


      observer.observe(
        el
      );

    }

  );

}



/* =========================================================
   CARGAR FIRESTORE
========================================================= */

async function cargarContenidos() {

  try {

    const snap =

      await getDocs(

        collection(
          db,
          "contenidos"
        )

      );


    datos =

      snap.docs.map(

        documento => ({

          id:
            documento.id,

          ...documento.data()

        })

      );


    const activos =
      recursosActivos();


    actualizarResumen(
      activos
    );


    render();


    console.log(

      `📚 Biblioteca: ${activos.length} recursos activos`

    );


  } catch (
    error
  ) {

    console.error(

      "❌ ERROR FIRESTORE:",

      error

    );


    if (
      ui.estado
    ) {

      ui.estado.innerHTML = `

        <p>

          No se pudieron cargar los contenidos
          de Biblioteca FALCO®.

        </p>

      `;

    }

  }

}



/* =========================================================
   USUARIO
========================================================= */

async function iniciarUsuario(
  user
) {

  try {

    const ref =

      doc(
        db,
        "usuarios",
        user.uid
      );


    const snap =

      await getDoc(
        ref
      );


    const dataUsuario =

      snap.exists()

        ? snap.data()

        : {};


    const rol =

      user.email ===
        ADMIN_EMAIL

        ? "admin"

        :

        (
          dataUsuario.rol ||

          "periciado"
        );


    const rolesAutorizados = [

      "biblioteca",

      "admin",

      "perito",

      "profesional"

    ];


    if (
      !rolesAutorizados.includes(
        rol
      )
    ) {

      window.location.href =
        "biblioteca-login.html";

      return;

    }


    usuarioActual = {

      uid:
        user.uid,

      email:
        user.email || "",

      rol,

      esAdmin:
        rol === "admin"

    };


    /*
      Compatibilidad con el sistema
      Centro de Recursos actual.
    */

    window.centroRecursosUsuario =
      usuarioActual;


    window.centroRecursosPuedeAbrir =
      true;


    if (
      ui.acceso
    ) {

      ui.acceso.classList.add(
        "is-ready"
      );


      ui.acceso.innerHTML = `

        <span
          class="bf-access-state__dot"
        ></span>

        <span>

          Acceso autorizado ·
          ${
            escapeHtml(
              rol
            )
          }

        </span>

      `;

    }


    /*
      Mantiene compatibilidad
      con otros módulos existentes.
    */

    window.dispatchEvent(

      new CustomEvent(

        "centroRecursosListo",

        {

          detail:
            usuarioActual

        }

      )

    );


    await cargarContenidos();


  } catch (
    error
  ) {

    console.error(

      "Error al verificar acceso a Biblioteca FALCO®:",

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

  async user => {


    if (
      !user
    ) {

      window.location.href =
        "biblioteca-login.html";

      return;

    }


    await iniciarUsuario(
      user
    );

  }

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

        "No se pudo cerrar la sesión:",

        error

      );

    }

  }

);



/* =========================================================
   BUSCADOR
========================================================= */

ui.buscador?.addEventListener(

  "input",

  event => {

    textoActivo =
      event.target.value ||
      "";


    render();

  }

);



/* =========================================================
   LIMPIAR BUSCADOR
========================================================= */

ui.limpiar?.addEventListener(

  "click",

  () => {

    textoActivo =
      "";


    if (
      ui.buscador
    ) {

      ui.buscador.value =
        "";


      ui.buscador.focus();

    }


    render();

  }

);



/* =========================================================
   FILTROS
========================================================= */

ui.filtros?.addEventListener(

  "click",

  event => {

    const button =

      event.target.closest(
        "[data-filter]"
      );


    if (
      !button
    ) {

      return;

    }


    filtroActivo =

      button.dataset.filter ||

      "";


    ui.filtros

      .querySelectorAll(
        "[data-filter]"
      )

      .forEach(

        btn =>

          btn.classList.toggle(

            "is-active",

            btn === button

          )

      );


    render();

  }

);



/* =========================================================
   COLECCIONES → FILTRO
========================================================= */

document.addEventListener(

  "click",

  event => {

    const action =

      event.target.closest(
        "[data-filter-value]"
      );


    if (
      !action
    ) {

      return;

    }


    const valor =

      action.dataset.filterValue ||

      "";


    filtroActivo =
      valor;


    if (
      ui.filtros
    ) {

      ui.filtros

        .querySelectorAll(
          "[data-filter]"
        )

        .forEach(

          btn => {

            btn.classList.toggle(

              "is-active",

              normalizar(
                btn.dataset.filter ||
                ""
              )

              ===

              normalizar(
                valor
              )

            );

          }

        );

    }


    document

      .getElementById(
        "explorar"
      )

      ?.scrollIntoView({

        behavior:
          "smooth",

        block:
          "start"

      });


    render();

  }

);



/* =========================================================
   REVEAL INICIAL
========================================================= */

document

  .querySelectorAll(

    `
      .bf-collection,
      .bf-section-head,
      .bf-search-panel
    `

  )

  .forEach(

    el =>

      el.classList.add(
        "bf-reveal"
      )

  );


activarReveal();