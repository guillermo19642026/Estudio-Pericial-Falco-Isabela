/* =========================================================
   FALCO® DOCUMENT ENGINE
   EXPEDIENTE VIEWER™ v1.0
========================================================= */

const estadoCarga =
  document.getElementById(
    "estadoCarga"
  );

const expedienteElemento =
  document.getElementById(
    "expediente"
  );

const capitulosElemento =
  document.getElementById(
    "capitulos"
  );

const indiceElemento =
  document.getElementById(
    "indiceCapitulos"
  );


/* =========================================================
   CONFIGURACIÓN DE CAPÍTULOS
========================================================= */

const CAPITULOS = [
  ["I", "Datos personales", "datosPersonales"],
  ["II", "Datos judiciales", "datosJudiciales"],
  ["III", "Relato del hecho", "relatoHecho"],
  ["IV", "Grupo familiar", "grupoFamiliar"],
  ["V", "Área afectiva", "areaAfectiva"],
  ["VI", "Área social y recreativa", "areaSocial"],
  ["VII", "Educación y formación", "educacion"],
  ["VIII", "Historia laboral", "historiaLaboral"],
  ["IX", "Trabajo actual", "trabajoActual"],
  ["X", "Tratamientos", "tratamientos"],
  ["XI", "Antecedentes de salud", "antecedentesSalud"],
  ["XII", "Hábitos y calidad de vida", "habitosCalidadVida"],
  ["XIII", "Impacto actual", "impactoActual"],
  ["XIV", "Documentación", "documentacion"],
  ["XV", "Observaciones finales", "observacionesFinales"],
  ["XVI", "Consentimiento informado", "consentimiento"]
];


/* =========================================================
   UTILIDADES
========================================================= */

function escaparHtml(valor) {
  return String(
    valor ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatearEtiqueta(clave) {
  return clave
    .replaceAll("_", " ")
    .replace(
      /([a-záéíóúñ])([A-Z])/g,
      "$1 $2"
    )
    .replace(
      /^\w/,
      letra =>
        letra.toUpperCase()
    );
}


function tieneValor(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return false;
  }

  if (
    Array.isArray(valor)
  ) {
    return valor.length > 0;
  }

  return true;
}


function formatearFecha(valor) {
  if (!valor) return "—";

  const fecha =
    new Date(valor);

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return String(valor);
  }

  return fecha.toLocaleString(
    "es-AR",
    {
      dateStyle: "long",
      timeStyle: "short"
    }
  );
}


function valorLegible(valor) {
  if (
    typeof valor === "boolean"
  ) {
    return valor
      ? "Sí"
      : "No";
  }

  if (Array.isArray(valor)) {
    if (!valor.length) {
      return "—";
    }

    return valor
      .map(item => {
        if (
          typeof item === "object" &&
          item !== null
        ) {
          return (
            item.nombre ||
            item.url ||
            JSON.stringify(item)
          );
        }

        return String(item);
      })
      .join(", ");
  }

  if (
    typeof valor === "object" &&
    valor !== null
  ) {
    return JSON.stringify(
      valor,
      null,
      2
    );
  }

  return String(valor);
}


/* =========================================================
   PORTADA
========================================================= */

function renderPortada(expediente) {
  const portada =
    expediente.portada || {};

  document.getElementById(
    "portadaPericiado"
  ).textContent =
    portada.periciado || "—";

  document.getElementById(
    "portadaDni"
  ).textContent =
    portada.dni || "—";

  document.getElementById(
    "portadaExpediente"
  ).textContent =
    portada.expediente || "—";

  document.getElementById(
    "portadaCaratula"
  ).textContent =
    portada.caratula || "—";

  document.getElementById(
    "portadaTribunal"
  ).textContent =
    portada.tribunal || "—";

  document.getElementById(
    "portadaEstado"
  ).textContent =
    expediente.admision?.estado ===
    "finalizada"
      ? "Finalizada"
      : "En proceso";

  document.getElementById(
    "portadaFecha"
  ).textContent =
    formatearFecha(
      portada.fechaGeneracion
    );

  document.getElementById(
    "portadaVersion"
  ).textContent =
    expediente.version || "—";
}


/* =========================================================
   CAMPOS
========================================================= */

function renderCampos(datos) {
  if (
    !datos ||
    typeof datos !== "object"
  ) {
    return `
      <div class="sin-datos">
        No se registran datos.
      </div>
    `;
  }

  const entradas =
    Object.entries(datos)
      .filter(
        ([, valor]) =>
          tieneValor(valor)
      );

  if (!entradas.length) {
    return `
      <div class="sin-datos">
        No se registran datos.
      </div>
    `;
  }

  return `
    <div class="bloque-datos">

      ${entradas
        .map(([clave, valor]) => {
          const texto =
            valorLegible(valor);

          const largo =
            texto.length > 90;

          return `
            <div
              class="campo-expediente
              ${largo ? "full" : ""}"
            >
              <strong>
                ${escaparHtml(
                  formatearEtiqueta(clave)
                )}
              </strong>

              <p>
                ${escaparHtml(texto)}
              </p>
            </div>
          `;
        })
        .join("")}

    </div>
  `;
}


/* =========================================================
   CALIDAD DE VIDA
========================================================= */

function renderCalidadVida(datos) {
  const valor =
    Number(
      datos?.calidadVida
    );

  if (
    !Number.isFinite(valor)
  ) {
    return "";
  }

  const puntuacion =
    Math.min(
      10,
      Math.max(1, valor)
    );

  return `
    <div class="calidad-vida">

      <strong>
        Calidad de vida actual
      </strong>

      <div class="calidad-vida__valor">
        ${puntuacion} / 10
      </div>

      <div class="calidad-vida__barra">
        ${Array.from(
          { length: 10 },
          (_, indice) => `
            <span
              class="${
                indice < puntuacion
                  ? "activo"
                  : ""
              }"
            ></span>
          `
        ).join("")}
      </div>

      ${
        datos.explicacionCalidadVida
          ? `
            <p>
              ${escaparHtml(
                datos
                  .explicacionCalidadVida
              )}
            </p>
          `
          : ""
      }

    </div>
  `;
}


/* =========================================================
   CAPÍTULOS
========================================================= */

function renderCapitulo(
  numero,
  titulo,
  datos,
  clave
) {
  let contenido =
    renderCampos(datos);

  if (
    clave ===
    "habitosCalidadVida"
  ) {
    contenido +=
      renderCalidadVida(datos);
  }

  return `
    <section class="pagina">

      <span class="capitulo-numero">
        ${numero}
      </span>

      <h2>
        ${escaparHtml(titulo)}
      </h2>

      ${contenido}

    </section>
  `;
}


/* =========================================================
   PSICOMETRÍA
========================================================= */

function renderPsicometria(
  psicometria
) {
  const resultados =
    psicometria?.resultados || [];

  if (!resultados.length) {
    return `
      <section class="pagina">

        <span class="capitulo-numero">
          XVII
        </span>

        <h2>
          Evaluación psicométrica
        </h2>

        <div class="sin-datos">
          No se registran instrumentos
          psicométricos asociados a este
          usuario.
        </div>

      </section>
    `;
  }

  return `
    <section class="pagina">

      <span class="capitulo-numero">
        XVII
      </span>

      <h2>
        Evaluación psicométrica
      </h2>

      <div class="psicometria-resumen">

        ${resultados
          .map(resultado => `
            <article class="test-card">

              <h3>
                ${escaparHtml(
                  resultado.instrumento
                )}
              </h3>

              ${
                resultado.puntaje !== null
                  ? `
                    <div class="test-puntaje">
                      ${escaparHtml(
                        resultado.puntaje
                      )}
                    </div>
                  `
                  : ""
              }

              ${
                resultado.interpretacion
                  ? `
                    <p>
                      <strong>
                        Interpretación:
                      </strong>

                      ${escaparHtml(
                        resultado
                          .interpretacion
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                resultado.indices
                  ? renderCampos(
                      resultado.indices
                    )
                  : ""
              }

              <p>
                Protocolo disponible:
                ${
                  resultado
                    .protocoloDisponible
                    ? "Sí"
                    : "No"
                }
              </p>

            </article>
          `)
          .join("")}

      </div>

    </section>
  `;
}




/* =========================================================
   DOCUMENTACIÓN Y ANEXOS
========================================================= */

function esImagenArchivo(archivo) {
  const tipo =
    archivo?.tipo || "";

  const url =
    archivo?.url || "";

  return (
    tipo.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(url)
  );
}


function renderArchivoAdjunto(
  archivo,
  titulo
) {
  if (
    !archivo ||
    !archivo.url
  ) {
    return "";
  }

  const nombre =
    archivo.nombre ||
    titulo ||
    "Archivo adjunto";

  if (esImagenArchivo(archivo)) {
    return `
      <article class="anexo-card">

        <div class="anexo-card__encabezado">
          <div>
            <span class="anexo-card__tipo">
              Imagen adjunta
            </span>

            <h3>
              ${escaparHtml(titulo)}
            </h3>

            <p>
              ${escaparHtml(nombre)}
            </p>
          </div>

          <a
            href="${escaparHtml(archivo.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="anexo-boton"
          >
            Abrir archivo
          </a>
        </div>

        <div class="anexo-imagen-contenedor">
         <img
  src="${escaparHtml(archivo.url)}"
  alt="${escaparHtml(titulo)}"
  class="anexo-imagen"
  loading="eager"
  decoding="sync"
>
        </div>

      </article>
    `;
  }

  return `
    <article class="anexo-card">

      <div class="anexo-card__encabezado">

        <div>
          <span class="anexo-card__tipo">
            Documento adjunto
          </span>

          <h3>
            ${escaparHtml(titulo)}
          </h3>

          <p>
            ${escaparHtml(nombre)}
          </p>
        </div>

        <a
          href="${escaparHtml(archivo.url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="anexo-boton"
        >
          Abrir documento
        </a>

      </div>

    </article>
  `;
}


function renderConstancia(
  constancia,
  indice
) {
  const numero =
    indice + 1;

  const datosClinicos = {
    nombre:
      constancia.nombre || "",

    dni:
      constancia.dni || "",

    fecha:
      constancia.fecha || "",

    firma:
      constancia.firma || "",

    enTratamiento:
      constancia.enTratamiento || "",

    tipoTratamiento:
      constancia.tipoTratamiento || "",

    medicacion:
      constancia.medicacion || "",

    profesional:
      constancia.profesional || "",

    observaciones:
      constancia.observaciones || ""
  };

  return `
    <article class="anexo-grupo">

      <div class="anexo-grupo__titulo">

        <span>
          Constancia ${numero}
        </span>

        <h3>
          Constancia de tratamiento
        </h3>

      </div>

      ${renderCampos(datosClinicos)}

    

      ${
        renderArchivoAdjunto(
          constancia.constancia,
          "Constancia profesional adjunta"
        )
      }

    </article>
  `;
}








function renderAnexos(anexos) {
  const dni =
    Array.isArray(anexos?.dni)
      ? anexos.dni
      : [];

  const constancias =
    Array.isArray(anexos?.constancias)
      ? anexos.constancias
      : [];

  const consentimientos =
    Array.isArray(anexos?.consentimiento)
      ? anexos.consentimiento
      : [];

  const fichas =
    Array.isArray(anexos?.fichas)
      ? anexos.fichas
      : [];

  const certificados =
    Array.isArray(anexos?.certificados)
      ? anexos.certificados
      : [];

  const otros =
    Array.isArray(anexos?.otros)
      ? anexos.otros
      : [];

  const cantidadTotal =
    Number.isFinite(anexos?.cantidadTotal)
      ? anexos.cantidadTotal
      : (
          dni.length +
          constancias.length +
          consentimientos.length +
          fichas.length +
          certificados.length +
          otros.length
        );

  if (!cantidadTotal) {
    return `
      <section class="pagina">

        <span class="capitulo-numero">
          XVIII
        </span>

        <h2>
          Documentación y anexos
        </h2>

        <div class="sin-datos">
          No se registran documentos adjuntos
          asociados a este expediente.
        </div>

      </section>
    `;
  }

  return `
    <section class="pagina anexos-pagina">

      <span class="capitulo-numero">
        XVIII
      </span>

      <h2>
        Documentación y anexos
      </h2>

      <div class="anexos-resumen">

        <strong>
          Archivos y documentos vinculados:
        </strong>

        <span>
          ${cantidadTotal}
        </span>

      </div>

      <div class="anexos-contenido">

        ${
          dni.length
            ? `
              <section class="anexo-seccion anexo-seccion--dni">

                <h3>
                  Documento de identidad
                </h3>

                ${dni
                  .map(
                    (archivo, indice) =>
                      renderArchivoAdjunto(
                        archivo,
                        archivo.titulo ||
                        `Documento de identidad ${indice + 1}`
                      )
                  )
                  .join("")}

              </section>
            `
            : ""
        }

        ${
          certificados.length
            ? `
              <section class="anexo-seccion">

                <h3>
                  Certificados y documentación complementaria
                </h3>

                ${certificados
                  .map(
                    (archivo, indice) =>
                      renderArchivoAdjunto(
                        archivo,
                        archivo.titulo ||
                        archivo.nombre ||
                        `Documento complementario ${indice + 1}`
                      )
                  )
                  .join("")}

              </section>
            `
            : ""
        }

        ${
          constancias.length
            ? `
              <section class="anexo-seccion">

                <h3>
                  Constancias de tratamiento
                </h3>

                ${constancias
                  .map(
                    (constancia, indice) =>
                      renderConstancia(
                        constancia,
                        indice
                      )
                  )
                  .join("")}

              </section>
            `
            : ""
        }

        ${
          consentimientos.length
            ? `
              <section class="anexo-seccion">

                <h3>
                  Consentimientos informados
                </h3>

                ${consentimientos
                  .map(
                    (consentimiento, indice) => `
                      <article class="anexo-grupo">

                        <div class="anexo-grupo__titulo">

                          <span>
                            Consentimiento ${indice + 1}
                          </span>

                          <h3>
                            Consentimiento informado
                          </h3>

                        </div>

                        ${renderCampos(
                          consentimiento
                        )}

                      </article>
                    `
                  )
                  .join("")}

              </section>
            `
            : ""
        }

        ${
          fichas.length
            ? `
              <section class="anexo-seccion">

                <h3>
                  Fichas integrales anteriores
                </h3>

                ${fichas
                  .map(
                    (ficha, indice) => `
                      <article class="anexo-grupo">

                        <div class="anexo-grupo__titulo">

                          <span>
                            Ficha ${indice + 1}
                          </span>

                          <h3>
                            Ficha integral del periciado
                          </h3>

                        </div>

                        ${renderCampos(ficha)}

                      </article>
                    `
                  )
                  .join("")}

              </section>
            `
            : ""
        }

        ${
          otros.length
            ? `
              <section class="anexo-seccion">

                <h3>
                  Otros documentos
                </h3>

                ${otros
                  .map(
                    documento => `
                      <article class="anexo-grupo">
                        ${renderCampos(documento)}
                      </article>
                    `
                  )
                  .join("")}

              </section>
            `
            : ""
        }

      </div>

    </section>
  `;
}

















/* =========================================================
   RENDER GENERAL
========================================================= */

function renderExpediente(
  expediente
) {
  renderPortada(expediente);

  indiceElemento.innerHTML =
    CAPITULOS
      .map(
        ([numero, titulo]) => `
          <li>
            ${numero}. ${escaparHtml(titulo)}
          </li>
        `
      )
      .join("") +
    `
      <li>
        XVII. Evaluación psicométrica
      </li>

      <li>
        XVIII. Documentación y anexos
      </li>
    `;

  capitulosElemento.innerHTML =
    CAPITULOS
      .map(
        ([numero, titulo, clave]) =>
          renderCapitulo(
            numero,
            titulo,
            expediente
              .fichaIntegral?.[clave],
            clave
          )
      )
      .join("") +
    renderPsicometria(
      expediente.psicometria
    ) +
    renderAnexos(
      expediente.anexos
    );

  estadoCarga.hidden = true;

  expedienteElemento.hidden =
    false;
}




/* =========================================================
   INICIALIZACIÓN
========================================================= */

async function iniciarViewer() {
  try {
    if (
      !window
        .FalcoExpedienteBuilder
    ) {
      throw new Error(
        "El Expediente Builder no está disponible."
      );
    }

    const expediente =
      await window
        .FalcoExpedienteBuilder
        .construirActual();

    if (!expediente) {
      throw new Error(
        "No se encontró el expediente."
      );
    }

    renderExpediente(
      expediente
    );

  } catch (error) {
    console.error(error);

    estadoCarga.textContent =
      error.message ||
      "No se pudo cargar el expediente.";
  }
}












async function esperarImagenesDelExpediente() {
  const imagenes =
    Array.from(
      document.querySelectorAll(
        ".anexo-imagen"
      )
    );

  if (!imagenes.length) {
    return;
  }

  await Promise.all(
    imagenes.map(imagen => {
      if (
        imagen.complete &&
        imagen.naturalWidth > 0
      ) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        const finalizar = () => {
          imagen.removeEventListener(
            "load",
            finalizar
          );

          imagen.removeEventListener(
            "error",
            finalizar
          );

          resolve();
        };

        imagen.addEventListener(
          "load",
          finalizar,
          { once: true }
        );

        imagen.addEventListener(
          "error",
          finalizar,
          { once: true }
        );
      });
    })
  );
}


document
  .getElementById(
    "botonImprimir"
  )
  .addEventListener(
    "click",
    async event => {
      const boton =
        event.currentTarget;

      const textoOriginal =
        boton.textContent;

      boton.disabled =
        true;

      boton.textContent =
        "Preparando imágenes...";

      try {
        await esperarImagenesDelExpediente();

        window.print();

      } finally {
        boton.disabled =
          false;

        boton.textContent =
          textoOriginal;
      }
    }
  );


/* =========================================================
   BOTÓN VOLVER
========================================================= */

document
  .getElementById(
    "botonVolver"
  )
  ?.addEventListener(
    "click",
    () => {

      const parametros =
        new URLSearchParams(
          window.location.search
        );

      const destino =
        parametros.get(
          "volver"
        );

      if (destino) {

        window.location.href =
          destino;

        return;
      }

      if (
        window.history.length > 1
      ) {

        window.history.back();

      } else {

        window.location.href =
          "../dashboard-profesional.html";

      }

    }
  );




window.addEventListener(
  "load",
  iniciarViewer
);


console.log(
  "FALCO Expediente Viewer™ v1.0 Ready"
);