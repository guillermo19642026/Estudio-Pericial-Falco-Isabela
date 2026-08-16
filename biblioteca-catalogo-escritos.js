/* =========================================================
   BIBLIOTECA FALCO®
   CATÁLOGO DE ESCRITOS PROFESIONALES
   Versión 2026
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
  auth,
  db
} from "./firebase-config.js";


import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


console.log(
  "📑 Catálogo de Escritos FALCO® cargado"
);



/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


const ROLES_AUTORIZADOS = [
  "biblioteca",
  "admin",
  "perito",
  "profesional"
];



/* =========================================================
   ELEMENTOS
========================================================= */

const ui = {

  buscador:
    document.getElementById(
      "buscadorCatalogoEscritos"
    ),

  limpiar:
    document.getElementById(
      "limpiarCatalogoEscritos"
    ),

  estado:
    document.getElementById(
      "catalogoEscritosEstado"
    ),

  container:
    document.getElementById(
      "catalogoEscritosContainer"
    ),

  vacio:
    document.getElementById(
      "catalogoEscritosVacio"
    ),

  totalEscritos:
    document.getElementById(
      "totalEscritosCatalogo"
    ),

  totalGrupos:
    document.getElementById(
      "totalGruposCatalogo"
    )

};



/* =========================================================
   ESTADO
========================================================= */

let escritos = [];

let escritosFiltrados = [];

let usuarioActual = null;


const ESCRITOS_POR_PAGINA =
  10;


let paginaActual =
  1;



/* =========================================================
   NORMALIZAR
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
   ESCAPE HTML
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
   IDENTIFICAR ESCRITO
========================================================= */

function esEscritoProfesional(
  item
) {

  const categoria =
    normalizar(
      item.categoria ||
      ""
    );


  const tipoContenido =
    normalizar(
      item.tipoContenido ||
      ""
    );


  return (

    categoria.includes(
      "escritos profesionales"
    )

    ||

    categoria.includes(
      "escritos judiciales"
    )

    ||

    tipoContenido ===
      "escrito"

  );

}



/* =========================================================
   PERMISOS
========================================================= */

function puedeAbrir(
  item
) {

  if (
    usuarioActual?.esAdmin
  ) {

    return true;

  }


  const rolesPermitidos =

    Array.isArray(
      item.rolesPermitidos
    )

      ? item.rolesPermitidos

      : [];


  if (
    rolesPermitidos.length === 0
  ) {

    return true;

  }


  return rolesPermitidos.includes(
    usuarioActual?.rol
  );

}



/* =========================================================
   GRUPO DEL ESCRITO
========================================================= */

function obtenerGrupo(
  item
) {

  const subcategoria =
    String(
      item.subcategoria ||
      ""
    ).trim();


  if (
    subcategoria
  ) {

    return subcategoria;

  }


  const fuero =
    String(
      item.fuero ||
      ""
    ).trim();


  if (
    fuero
  ) {

    return fuero;

  }


  return "Otros escritos";

}



/* =========================================================
   ORDEN PREFERENTE DE GRUPOS
========================================================= */

const ORDEN_GRUPOS = [

  "Cargo y actuación del perito",

  "Honorarios",

  "Producción y actuación pericial",

  "Modelos judiciales y procesales",

  "Civil",

  "Civil · Daño psíquico",

  "Laboral",

  "Laboral · Incapacidad psicológica",

  "Familia y NNyA",

  "Familia",

  "Penal",

  "Actuaciones procesales e incumbencia",

  "Otros escritos"

];


function pesoGrupo(
  nombre
) {

  const indice =
    ORDEN_GRUPOS.findIndex(

      grupo =>

        normalizar(
          grupo
        )

        ===

        normalizar(
          nombre
        )

    );


  return indice === -1
    ? 999
    : indice;

}



/* =========================================================
   TEXTO INDEXADO
========================================================= */

function textoIndexado(
  item
) {

  return normalizar(`

    ${item.numero || ""}

    ${item.codigo || ""}

    ${item.titulo || ""}

    ${item.descripcion || ""}

    ${item.categoria || ""}

    ${item.subcategoria || ""}

    ${item.fuero || ""}

    ${
      Array.isArray(item.fueros)
        ? item.fueros.join(" ")
        : ""
    }

    ${item.tipoEscrito || ""}

    ${item.tags || ""}

    ${item.autor || ""}

  `);

}



/* =========================================================
   CARGAR CONTENIDOS
========================================================= */

async function cargarEscritos() {

  try {

    const snap =
      await getDocs(

        collection(
          db,
          "contenidos"
        )

      );


    escritos =

      snap.docs

        .map(
          documento => ({

            id:
              documento.id,

            ...documento.data()

          })
        )

       .filter(
  item =>

    item.modulo ===
      "biblioteca"

    &&

    item.activo !== false

    &&

    esEscritoProfesional(
      item
    )
);


    /*
      Ordenamos por número cuando existe.
      Si no existe, utilizamos el título.
    */

    escritos.sort(
      (
        a,
        b
      ) => {

        const numeroA =
          Number(
            a.numero
          );


        const numeroB =
          Number(
            b.numero
          );


        const tieneNumeroA =
          Number.isFinite(
            numeroA
          )

          &&

          numeroA > 0;


        const tieneNumeroB =
          Number.isFinite(
            numeroB
          )

          &&

          numeroB > 0;


        if (
          tieneNumeroA

          &&

          tieneNumeroB

          &&

          numeroA !== numeroB
        ) {

          return numeroA - numeroB;

        }


        return String(
          a.titulo ||
          ""
        ).localeCompare(

          String(
            b.titulo ||
            ""
          ),

          "es",

          {
            sensitivity:
              "base"
          }

        );

      }
    );


    escritosFiltrados =
      [
        ...escritos
      ];


    actualizarMetricas();

    render();


    console.log(
      `📑 Catálogo: ${escritos.length} escritos disponibles`
    );


  } catch (
    error
  ) {

    console.error(
      "❌ Error al cargar catálogo:",
      error
    );


    if (
      ui.estado
    ) {

      ui.estado.innerHTML = `

        <p>
          No se pudo cargar el catálogo
          de escritos profesionales.
        </p>

      `;

    }

  }

}



/* =========================================================
   MÉTRICAS
========================================================= */

function actualizarMetricas() {

  if (
    ui.totalEscritos
  ) {

    ui.totalEscritos.textContent =
      escritos.length;

  }


  const grupos =
    new Set(

      escritos.map(
        obtenerGrupo
      )

    );


  if (
    ui.totalGrupos
  ) {

    ui.totalGrupos.textContent =
      grupos.size;

  }

}



/* =========================================================
   AGRUPAR
========================================================= */

function agrupar(
  lista
) {

  const mapa =
    new Map();


  lista.forEach(
    item => {

      const grupo =
        obtenerGrupo(
          item
        );


      if (
        !mapa.has(
          grupo
        )
      ) {

        mapa.set(
          grupo,
          []
        );

      }


      mapa.get(
        grupo
      ).push(
        item
      );

    }
  );


  return [
    ...mapa.entries()
  ]

    .sort(
      (
        [grupoA],
        [grupoB]
      ) => {

        const pesoA =
          pesoGrupo(
            grupoA
          );


        const pesoB =
          pesoGrupo(
            grupoB
          );


        if (
          pesoA !== pesoB
        ) {

          return pesoA - pesoB;

        }


        return grupoA.localeCompare(

          grupoB,

          "es",

          {
            sensitivity:
              "base"
          }

        );

      }
    );

}



/* =========================================================
   CREAR FILA
========================================================= */

function crearFila(
  item
) {

  const titulo =
    escapeHtml(
      item.titulo ||
      "Escrito profesional"
    );


  const numero =
    item.numero
      ? escapeHtml(
          item.numero
        )
      : "—";


  const codigo =
    escapeHtml(
      item.codigo ||
      ""
    );


  const fuero =

    Array.isArray(
      item.fueros
    )

    &&

    item.fueros.length

      ? escapeHtml(
          item.fueros.join(
            " · "
          )
        )

      : escapeHtml(
          item.fuero ||
          ""
        );


  const permitido =
    puedeAbrir(
      item
    );


  const pdf =
    urlSegura(
      item.urlPdf ||
      ""
    );


  let accion = `

    <span class="bf-catalog-item__unavailable">
      Sin archivo
    </span>

  `;


  if (
    pdf
  ) {

    if (
      permitido
    ) {

      accion = `

        <a
          href="${escapeHtml(pdf)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir PDF →
        </a>

      `;

    }

    else {

      accion = `

        <a
          href="biblioteca-login.html?destino=catalogo-escritos"
        >
          🔒 Acceder
        </a>

      `;

    }

  }


  return `

    <article class="bf-catalog-item">

      <div class="bf-catalog-item__main">

        <div class="bf-catalog-item__number">
          ${numero}
        </div>


        <div class="bf-catalog-item__content">

          <h3>
            ${titulo}
          </h3>


          <div class="bf-catalog-item__meta">

            ${
              codigo

                ? `
                    <span>
                      ${codigo}
                    </span>
                  `

                : ""
            }


            ${
              fuero

                ? `
                    <span>
                      ${fuero}
                    </span>
                  `

                : ""
            }

          </div>

        </div>

      </div>


      <div class="bf-catalog-item__action">
        ${accion}
      </div>

    </article>

  `;

}

/* =========================================================
   RENDER
========================================================= */

function render() {

  if (
    !ui.container
  ) {

    console.error(
      "❌ catalogoEscritosContainer no encontrado"
    );

    return;

  }


  if (
    ui.estado
  ) {

    ui.estado.hidden =
      true;

  }


  ui.container.innerHTML =
    "";


  document
    .getElementById(
      "catalogoPaginacion"
    )
    ?.remove();


  if (
    escritosFiltrados.length === 0
  ) {

    if (
      ui.vacio
    ) {

      ui.vacio.hidden =
        false;

    }

    return;

  }


  if (
    ui.vacio
  ) {

    ui.vacio.hidden =
      true;

  }


  const totalPaginas =
    Math.ceil(
      escritosFiltrados.length /
      ESCRITOS_POR_PAGINA
    );


  if (
    paginaActual >
    totalPaginas
  ) {

    paginaActual =
      totalPaginas;

  }


  const inicio =
    (
      paginaActual -
      1
    )
    *
    ESCRITOS_POR_PAGINA;


  const fin =
    inicio +
    ESCRITOS_POR_PAGINA;


  const listaVisible =
    escritosFiltrados.slice(
      inicio,
      fin
    );


  const grupos =
    agrupar(
      listaVisible
    );


  grupos.forEach(
    (
      [
        nombreGrupo,
        items
      ]
    ) => {

      const section =
        document.createElement(
          "section"
        );


      section.className =
        "bf-catalog-group";


      section.innerHTML = `

        <div class="bf-catalog-group__head">

          <div>

            <span class="bf-kicker">
              Escritos profesionales
            </span>

            <h2>
              ${escapeHtml(nombreGrupo)}
            </h2>

          </div>


          <span class="bf-catalog-group__count">

            ${items.length}

            ${
              items.length === 1
                ? "escrito"
                : "escritos"
            }

          </span>

        </div>


        <div class="bf-catalog-group__list">

          ${
            items
              .map(
                crearFila
              )
              .join("")
          }

        </div>

      `;


      ui.container.appendChild(
        section
      );

    }
  );


  renderPaginacion(
    escritosFiltrados.length,
    totalPaginas
  );

}

/* =========================================================
   PAGINACIÓN
========================================================= */

function renderPaginacion(
  total,
  totalPaginas
) {

  document
    .getElementById(
      "catalogoPaginacion"
    )
    ?.remove();


  if (
    total === 0
  ) {

    return;

  }


  const inicio =
    (
      paginaActual -
      1
    )
    *
    ESCRITOS_POR_PAGINA
    +
    1;


  const fin =
    Math.min(
      paginaActual *
      ESCRITOS_POR_PAGINA,
      total
    );


  const control =
    document.createElement(
      "div"
    );


  control.id =
    "catalogoPaginacion";


  control.className =
    "bf-catalog-pagination";


  control.innerHTML = `

    <p class="bf-catalog-pagination__status">

      Mostrando
      <strong>${inicio}–${fin}</strong>
      de
      <strong>${total}</strong>
      escritos

    </p>


    <div class="bf-catalog-pagination__controls">

      <button
        type="button"
        id="catalogoAnterior"
        class="bf-btn bf-btn--outline"
        ${
          paginaActual === 1
            ? "disabled"
            : ""
        }
      >
        ← Anteriores
      </button>


      <span class="bf-catalog-pagination__page">

        Página
        <strong>${paginaActual}</strong>
        de
        <strong>${totalPaginas}</strong>

      </span>


      <button
        type="button"
        id="catalogoSiguiente"
        class="bf-btn bf-btn--outline"
        ${
          paginaActual === totalPaginas
            ? "disabled"
            : ""
        }
      >
        Siguientes →
      </button>

    </div>

  `;


  ui.container.insertAdjacentElement(
    "afterend",
    control
  );


  document
    .getElementById(
      "catalogoAnterior"
    )
    ?.addEventListener(
      "click",
      () => {

        if (
          paginaActual <= 1
        ) {

          return;

        }


        paginaActual--;


        render();


        document
          .getElementById(
            "catalogo"
          )
          ?.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });

      }
    );


  document
    .getElementById(
      "catalogoSiguiente"
    )
    ?.addEventListener(
      "click",
      () => {

        if (
          paginaActual >=
          totalPaginas
        ) {

          return;

        }


        paginaActual++;


        render();


        document
          .getElementById(
            "catalogo"
          )
          ?.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });

      }
    );

}



/* =========================================================
   BUSCADOR
========================================================= */

function buscar() {

  const termino =
    normalizar(
      ui.buscador?.value ||
      ""
    );


  if (
    !termino
  ) {

    escritosFiltrados =
      [
        ...escritos
      ];


    render();

    return;

  }


  escritosFiltrados =

    escritos.filter(
      item =>

        textoIndexado(
          item
        ).includes(
          termino
        )
    );


  render();

}



/* =========================================================
   EVENTOS
========================================================= */

ui.buscador?.addEventListener(

  "input",

  buscar

);


ui.limpiar?.addEventListener(

  "click",

  () => {

    if (
      ui.buscador
    ) {

      ui.buscador.value =
        "";

      ui.buscador.focus();

    }


    buscar();

  }

);



/* =========================================================
   VERIFICAR USUARIO
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

        : (

            dataUsuario.rol ||

            "periciado"

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


    usuarioActual = {

      uid:
        user.uid,

      email:
        user.email || "",

      rol,

      esAdmin:
        rol === "admin"

    };


    await cargarEscritos();


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