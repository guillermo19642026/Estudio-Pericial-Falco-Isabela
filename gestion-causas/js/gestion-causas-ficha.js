document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  const tabs =
    document.querySelectorAll(
      ".gc-case-tab"
    );

  const panels =
    document.querySelectorAll(
      ".gc-case-panel"
    );

  const params =
    new URLSearchParams(
      window.location.search
    );

  const causeId =
    params.get("id");

  const origen =
    params.get("origen") ||
    "causas";

  const isPericia =
    origen === "pericias";


    const isCobrada =
  origen === "cobradas";

  let causa = null;


if (isPericia) {

  try {

    const { db } =
      await import(
        "../../firebase-config.js"
      );

    const {
      doc,
      getDoc
    } =
      await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );

    const snapshot =
      await getDoc(
        doc(
          db,
          "gestion_pericias",
          String(causeId)
        )
      );

    if (snapshot.exists()) {

      causa = {
        id: snapshot.id,
        ...snapshot.data()
      };

    }

  } catch (error) {

    console.error(
      "Error cargando Pericia FALCO®:",
      error
    );

  }

} else if (isCobrada) {

  try {

    const { db } =
      await import(
        "../../firebase-config.js"
      );

    const {
      doc,
      getDoc
    } =
      await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );

    const snapshot =
      await getDoc(
        doc(
          db,
          "gestion_cobradas",
          String(causeId)
        )
      );

    if (snapshot.exists()) {

      causa = {
        id: snapshot.id,
        ...snapshot.data()
      };

    }

  } catch (error) {

    console.error(
      "Error cargando Causa Cobrada FALCO®:",
      error
    );

  }

} else {

  try {

    const { db } =
      await import(
        "../../firebase-config.js"
      );

    const {
      doc,
      getDoc
    } =
      await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );

    const snapshot =
      await getDoc(
        doc(
          db,
          "gestion_causas",
          String(causeId)
        )
      );

    if (snapshot.exists()) {

      causa = {
        id: snapshot.id,
        ...snapshot.data()
      };

    }

  } catch (error) {

    console.error(
      "Error cargando Causa FALCO®:",
      error
    );

  }

}

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Sin cargar";
    }

    const date = new Date(`${dateValue}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
      return escapeHtml(dateValue);
    }

    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const getValue = (value, fallback = "Sin cargar") => {
    const normalized = String(value || "").trim();

    return normalized
      ? escapeHtml(normalized)
      : fallback;
  };

  const getDepartmentClass = () => {
    if (causa?.departamento === "moron") {
      return "gc-badge gc-badge--moron";
    }

    if (causa?.departamento === "la-matanza") {
      return "gc-badge gc-badge--matanza";
    }

    return "gc-status gc-status--neutral";
  };

  const getStatusClass = (status = "") => {
    const normalized = String(status)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (
      normalized.includes("impugnacion") ||
      normalized.includes("explicaciones") ||
      normalized.includes("traslado") ||
      normalized.includes("pendiente")
    ) {
      return "gc-status gc-status--warning";
    }

    if (
      normalized.includes("finalizada") ||
      normalized.includes("archivada")
    ) {
      return "gc-status gc-status--neutral";
    }

    return "gc-status gc-status--active";
  };

  const getPartyLabel = (parte = "") => {
    const labels = {
      actora: "Parte actora",
      demandada: "Parte demandada",
      codemandada: "Codemandada",
      tercero: "Tercero citado"
    };

    return labels[parte] || "Interviniente";
  };

  const getTypeLabel = (tipo = "") => {
    const labels = {
      persona: "Persona",
      empresa: "Empresa",
      aseguradora: "Aseguradora",
      art: "ART",
      empleador: "Empleador",
      otro: "Otro"
    };

    return labels[tipo] || getValue(tipo);
  };

  const activateTab = (tabName) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });

    panels.forEach((panel) => {
      const isActive =
        panel.dataset.panel === tabName;

      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  const renderNotFound = () => {
    const content = document.querySelector(".gc-content");

    if (!content) {
      return;
    }

    content.innerHTML = `
      <section class="gc-case-panel">

        <div class="gc-empty-state">

          <div class="gc-empty-state__icon">
            ⚖
          </div>

          <h3>No se encontró la causa</h3>

          <p>
            El registro solicitado no existe o fue eliminado.
          </p>

          <a
            href="./causas.html"
            class="gc-button gc-button--primary"
          >
            Volver al listado
          </a>

        </div>

      </section>
    `;
  };

const calcularProximoPasoPericial = (
  causaActual = {}
) => {

  const seguimiento =
    causaActual.seguimiento || {};


  const aceptacion =
    seguimiento.estadoAceptacion ||
    "sin-cargar";


  const anticipo =
    seguimiento.estadoAnticipo ||
    "sin-solicitar";


  const entrevista =
    seguimiento.estadoEntrevista ||
    "sin-informacion";


  const pericia =
    seguimiento.estadoPericia ||
    "pendiente";


  const impugnacion =
    seguimiento.estadoImpugnacion ||
    "ninguna";


  const contestacion =
    seguimiento.estadoContestacion ||
    "ninguna";


  /* =========================================
     IMPUGNACIÓN PENDIENTE
  ========================================= */

  if (
    impugnacion === "recibida" &&
    contestacion !== "presentada"
  ) {

    return "Contestar impugnación / explicaciones";

  }


  /* =========================================
     PERICIA TODAVÍA PENDIENTE
  ========================================= */

  if (
    pericia === "pendiente"
  ) {

    if (
      entrevista === "realizada"
    ) {

      return "Presentar dictamen pericial";

    }


    if (
      entrevista === "registrada"
    ) {

      return "Realizar entrevista pericial";

    }


    if (
      aceptacion === "registrada"
    ) {

      return "Coordinar entrevista pericial";

    }


    return "Revisar aceptación del cargo";

  }


  /* =========================================
     PERICIA PRESENTADA
  ========================================= */

  if (
    pericia === "presentada"
  ) {

    if (
      impugnacion === "ninguna"
    ) {

      return "Controlar traslado del dictamen";

    }


    if (
      contestacion === "presentada"
    ) {

      return "Controlar resolución posterior";

    }

  }


  /* =========================================
     ANTICIPO
  ========================================= */

  if (
    anticipo === "solicitado"
  ) {

    return "Controlar anticipo de gastos";

  }


  return (
    causaActual.proximoPaso ||
    "Revisar estado de la causa"
  );

};


  const renderHeader = () => {
    const title = document.getElementById("gcCaseTitle");
    const fileNumber =
      document.getElementById("gcCaseFileNumber");
    const internalCode =
      document.getElementById("gcCaseInternalCode");
    const courtType =
      document.getElementById("gcCaseCourtType");
    const nextStep =
      document.getElementById("gcCaseNextStep");
    const nextDeadline =
      document.getElementById("gcCaseNextDeadline");
    const departmentBadge =
      document.getElementById(
        "gcCaseDepartmentBadge"
      );
    const statusBadge =
      document.getElementById("gcCaseStatusBadge");

    if (title) {
      title.textContent =
        causa.caratula || "Sin carátula";
    }

    if (fileNumber) {
      fileNumber.textContent =
        causa.expediente ||
        "Sin número de expediente";
    }

    if (internalCode) {
      internalCode.textContent =
        causa.codigoInterno ||
        "Sin código interno";
    }

    if (courtType) {
      courtType.textContent =
        causa.fuero || "Sin definir";
    }

    if (nextStep) {

  nextStep.textContent =
    calcularProximoPasoPericial(
      causa
    );

}

    if (nextDeadline) {
      nextDeadline.textContent =
        formatDate(causa.proximoVencimiento);
    }

    if (departmentBadge) {
      departmentBadge.textContent =
        causa.departamentoNombre ||
        "Sin departamento";

      departmentBadge.className =
        getDepartmentClass();
    }

    if (statusBadge) {
      statusBadge.textContent =
        causa.estadoGeneral ||
        "Sin estado";

      statusBadge.className =
        getStatusClass(causa.estadoGeneral);
    }

    document.title =
      `${causa.caratula || "Ficha de la causa"} | Gestión de Causas FALCO®`;
  };



const renderGeneralInformation = () => {

  const values = {

    gcDetailDepartment:
      causa.departamentoNombre,

    gcDetailCourtType:
      causa.fuero,

    gcDetailCourt:
      causa.organismo,

    gcDetailCourtNumber:
      causa.juzgado,

    gcDetailSecretary:
      causa.secretaria,

    gcDetailProcessType:
      causa.tipoProceso,

    gcDetailDesignationDate:
      formatDate(
        causa.fechaDesignacion
      ),

    gcDetailAcceptanceDate:
      formatDate(
        causa.fechaAceptacion
      )

  };


  Object.entries(
    values
  ).forEach(
    ([elementId, value]) => {

      const element =
        document.getElementById(
          elementId
        );

      if (element) {

        element.textContent =
          value ||
          "Sin cargar";

      }

    }
  );


  /* =========================================================
     INFORMACIÓN SCBA
  ========================================================= */

  const scbaSection =
    document.getElementById(
      "gcScbaSection"
    );

  const scbaExpediente =
    document.getElementById(
      "gcScbaExpediente"
    );

  const scbaCausaId =
    document.getElementById(
      "gcScbaCausaId"
    );

  const scbaOrganisms =
    document.getElementById(
      "gcScbaOrganisms"
    );


  const organismosSCBA =
    Array.isArray(
      causa.organismosSCBA
    )
      ? causa.organismosSCBA
      : [];


  const tieneInformacionSCBA =
    Boolean(
      causa.expedienteSCBA ||
      causa.idCausaSCBA ||
      organismosSCBA.length
    );


  if (
    !scbaSection
  ) {
    return;
  }


  if (
    !tieneInformacionSCBA
  ) {

    scbaSection.hidden =
      true;

    return;

  }


  scbaSection.hidden =
    false;


  if (
    scbaExpediente
  ) {

    scbaExpediente.textContent =
      causa.expedienteSCBA ||
      causa.expediente ||
      "Sin cargar";

  }


  if (
    scbaCausaId
  ) {

    scbaCausaId.textContent =
      causa.idCausaSCBA ||
      "Sin cargar";

  }


  if (
    scbaOrganisms
  ) {

    if (
      !organismosSCBA.length
    ) {

      scbaOrganisms.innerHTML =
        `
          <div class="gc-empty-state gc-empty-state--compact">
            <p>
              Sin organismos SCBA vinculados.
            </p>
          </div>
        `;

    } else {

      scbaOrganisms.innerHTML =
        organismosSCBA
          .map(
            (
              organismo,
              index
            ) => {

              const nombre =
                organismo.nombre ||
                `Organismo ${index + 1}`;


              const departamento =
                organismo.departamento ||
                "";


              const fuero =
                organismo.fuero ||
                "";


              const idOrganismo =
                organismo.idOrganismoSCBA ||
                "";


              const enlace =
                organismo.enlaceTramites ||
                "";


              return `
                <article class="gc-detail-card gc-scba-organism-card">

                  <span>
                    Organismo SCBA ${index + 1}
                  </span>

                  <strong>
                    ${escapeHtml(
                      nombre
                    )}
                  </strong>

                  ${
                    departamento
                      ? `
                        <small>
                          ${escapeHtml(
                            departamento
                          )}
                        </small>
                      `
                      : ""
                  }

                  ${
                    fuero
                      ? `
                        <small>
                          ${escapeHtml(
                            fuero
                          )}
                        </small>
                      `
                      : ""
                  }

                  ${
                    idOrganismo
                      ? `
                        <small>
                          ID Organismo:
                          ${escapeHtml(
                            idOrganismo
                          )}
                        </small>
                      `
                      : ""
                  }

                  ${
                    enlace
                      ? `
                        <a
                          href="${escapeHtml(
                            enlace
                          )}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="gc-button gc-button--secondary"
                        >
                          Abrir trámites SCBA
                        </a>
                      `
                      : ""
                  }

                </article>
              `;

            }
          )
          .join("");

    }

  }

};

  const createPartyCard = (
    title,
    party,
    badgeClass = ""
  ) => {
    if (!party) {
      return "";
    }

    return `
      <article class="gc-party-card">

        <div class="gc-party-card__header">

          <span
            class="gc-party-card__type ${badgeClass}"
          >
            ${escapeHtml(title)}
          </span>

        </div>

        <h4>
          ${getValue(party.nombre, "Sin nombre")}
        </h4>

        <dl class="gc-data-list">

          <div>
            <dt>DNI / CUIT</dt>
            <dd>${getValue(party.documento)}</dd>
          </div>

          ${
            party.tipo
              ? `
                <div>
                  <dt>Tipo</dt>
                  <dd>
                    ${escapeHtml(
                      getTypeLabel(party.tipo)
                    )}
                  </dd>
                </div>
              `
              : ""
          }

          <div>
            <dt>Teléfono</dt>
            <dd>${getValue(party.telefono)}</dd>
          </div>

          <div>
            <dt>Correo electrónico</dt>
            <dd>${getValue(party.email)}</dd>
          </div>

          <div>
            <dt>Domicilio</dt>
            <dd>${getValue(party.domicilio)}</dd>
          </div>

        </dl>

      </article>
    `;
  };

  const renderParties = () => {
    const panel = document.querySelector(
      '[data-panel="partes"]'
    );

    if (!panel) {
      return;
    }

    const actora = causa.partes?.actora || {
      nombre: causa.actor
    };

    const demandada = causa.partes?.demandada || {
      nombre: causa.demandado
    };

    const codefendants = Array.isArray(
      causa.codemandadas
    )
      ? causa.codemandadas
      : [];

    const codefendantsHtml = codefendants
      .map((item, index) => {
        const party =
          typeof item === "string"
            ? {
                nombre: item
              }
            : item;

        return createPartyCard(
          `Codemandada ${index + 1}`,
          party
        );
      })
      .join("");

    panel.innerHTML = `
      <div class="gc-section-heading">

        <div>
          <span class="gc-panel__eyebrow">
            Sujetos procesales
          </span>

          <h3>Partes de la causa</h3>
        </div>

        <button
          type="button"
          class="gc-button gc-button--secondary"
          id="gcAddCodefendantFromFile"
        >
          Agregar codemandada
        </button>

      </div>

      <div class="gc-party-grid">

        ${createPartyCard(
          "Parte actora",
          actora
        )}

        ${createPartyCard(
          "Parte demandada",
          demandada
        )}

        ${codefendantsHtml}

      </div>
    `;
  };

  const renderLawyers = () => {
    const container =
      document.getElementById("gcLawyerCards");

    if (!container) {
      return;
    }

    const lawyers = Array.isArray(causa.abogados)
      ? causa.abogados
      : [];

    if (!lawyers.length) {
      container.innerHTML = `
        <div class="gc-empty-state gc-empty-state--compact">

          <div class="gc-empty-state__icon">
            A
          </div>

          <h3>Sin abogados cargados</h3>

          <p>
            Todavía no se registraron representantes
            letrados en esta causa.
          </p>

        </div>
      `;

      return;
    }

    container.innerHTML = lawyers
      .map(
        (lawyer) => `
          <article class="gc-lawyer-card">

            <div class="gc-lawyer-card__header">

              <span
                class="${
                  lawyer.parte === "actora"
                    ? "gc-badge gc-badge--moron"
                    : "gc-badge gc-badge--matanza"
                }"
              >
                ${escapeHtml(
                  getPartyLabel(lawyer.parte)
                )}
              </span>

            </div>

            <h4>
              ${getValue(
                lawyer.nombreCompleto,
                "Sin nombre"
              )}
            </h4>

            <dl class="gc-data-list">

              <div>
                <dt>Matrícula</dt>
                <dd>
                  ${getValue(lawyer.matricula)}
                </dd>
              </div>

              <div>
                <dt>Colegio profesional</dt>
                <dd>
                  ${getValue(lawyer.colegio)}
                </dd>
              </div>

              <div>
                <dt>Teléfono</dt>
                <dd>
                  ${getValue(lawyer.telefono)}
                </dd>
              </div>

              <div>
                <dt>WhatsApp</dt>
                <dd>
                  ${getValue(lawyer.whatsapp)}
                </dd>
              </div>

              <div>
                <dt>Correo electrónico</dt>
                <dd>
                  ${getValue(lawyer.email)}
                </dd>
              </div>

              <div>
                <dt>Domicilio electrónico</dt>
                <dd>
                  ${getValue(
                    lawyer.domicilioElectronico
                  )}
                </dd>
              </div>

              <div>
                <dt>Estudio jurídico</dt>
                <dd>
                  ${getValue(
                    lawyer.estudioJuridico
                  )}
                </dd>
              </div>

              <div>
                <dt>Compañía representada</dt>
                <dd>
                  ${getValue(
                    lawyer.companiaRepresentada,
                    "No corresponde"
                  )}
                </dd>
              </div>

              <div>
                <dt>Observaciones</dt>
                <dd>
                  ${getValue(
                    lawyer.observaciones
                  )}
                </dd>
              </div>

            </dl>

          </article>
        `
      )
      .join("");
  };



 const renderExpertReport = () => {
  const panel = document.querySelector(
    '[data-panel="pericia"]'
  );

  if (!panel) {
    return;
  }

  const seguimiento =
    causa.seguimiento || {};

  const estadoDesignacion =
    seguimiento.estadoDesignacion ||
    (causa.fechaDesignacion
      ? "registrada"
      : "sin-cargar");

  const estadoAceptacion =
    seguimiento.estadoAceptacion ||
    (causa.fechaAceptacion
      ? "registrada"
      : "sin-cargar");

  const estadoAnticipo =
    seguimiento.estadoAnticipo ||
    "sin-solicitar";

  const estadoEntrevista =
    seguimiento.estadoEntrevista ||
    "sin-informacion";

  const estadoPericia =
    seguimiento.estadoPericia ||
    "pendiente";

  const estadoImpugnacion =
    seguimiento.estadoImpugnacion ||
    "ninguna";

  const estadoContestacion =
    seguimiento.estadoContestacion ||
    "ninguna";

  const estadoHonorarios =
    seguimiento.estadoHonorarios ||
    "sin-regular";

  const estadoCobro =
    seguimiento.estadoCobro ||
    "pendiente";

  const formatStageValue = (
    value = "",
    fallback = "Sin información"
  ) => {
    const labels = {
      registrada: "Registrada",
      registrado: "Registrado",
      "sin-cargar": "Sin cargar",
      solicitado: "Solicitado",
      depositado: "Depositado",
      "sin-solicitar": "Sin solicitar",
      realizada: "Realizada",
      "sin-informacion": "Sin información",
      presentada: "Presentada",
      pendiente: "Pendiente",
      recibida: "Recibida",
      ninguna: "Ninguna",
      regulado: "Regulado",
      cobrado: "Cobrado",
      "sin-regular": "Sin regular"
    };

    return labels[value] || value || fallback;
  };

  const stages = [
   {
  title: "Designación",
  value:
    causa.fechaDesignacion
      ? `${formatDate(causa.fechaDesignacion)} · ${formatStageValue(
          estadoDesignacion,
          "Sin cargar"
        )}`
      : formatStageValue(
          estadoDesignacion,
          "Sin cargar"
        ),
  complete:
    estadoDesignacion === "registrada" ||
    Boolean(causa.fechaDesignacion)
},

   {
  title: "Aceptación del cargo",
  value:
    causa.fechaAceptacion
      ? `${formatDate(causa.fechaAceptacion)} · ${formatStageValue(
          estadoAceptacion,
          "Sin cargar"
        )}`
      : formatStageValue(
          estadoAceptacion,
          "Sin cargar"
        ),
  complete:
    estadoAceptacion === "registrada" ||
    Boolean(causa.fechaAceptacion)
},

  {
  title: "Anticipo de gastos",
  value:
    causa.fechaAnticipo
      ? `${formatDate(causa.fechaAnticipo)} · ${formatStageValue(
          estadoAnticipo,
          "Sin solicitar"
        )}`
      : formatStageValue(
          estadoAnticipo,
          "Sin solicitar"
        ),
  complete: [
    "registrado",
    "solicitado",
    "depositado"
  ].includes(estadoAnticipo)
},

   {
  title: "Entrevista",
  value:
    causa.fechaEntrevista
      ? `${formatDate(causa.fechaEntrevista)} · ${formatStageValue(
          estadoEntrevista,
          "Sin información"
        )}`
      : formatStageValue(
          estadoEntrevista,
          "Sin información"
        ),
  complete: [
    "registrada",
    "realizada"
  ].includes(estadoEntrevista)
},

    {
  title: "Dictamen pericial",
  value:
    causa.fechaPericia
      ? `${formatDate(causa.fechaPericia)} · ${formatStageValue(
          estadoPericia,
          "Pendiente"
        )}`
      : formatStageValue(
          estadoPericia,
          "Pendiente"
        ),
  complete: [
    "presentada",
    "impugnada",
    "finalizada"
  ].includes(estadoPericia)
},

   {
  title: "Impugnación",
  value:
    causa.fechaImpugnacion
      ? `${formatDate(causa.fechaImpugnacion)} · ${formatStageValue(
          estadoImpugnacion,
          "Ninguna"
        )}`
      : formatStageValue(
          estadoImpugnacion,
          "Ninguna"
        ),
  complete:
    estadoImpugnacion === "recibida"
},

   {
  title: "Contestación",
  value:
    causa.fechaContestacion
      ? `${formatDate(causa.fechaContestacion)} · ${formatStageValue(
          estadoContestacion,
          "Ninguna"
        )}`
      : formatStageValue(
          estadoContestacion,
          "Ninguna"
        ),
  complete:
    estadoContestacion === "presentada"
},



    {
      title: "Estado actual",
      value:
        causa.estadoGeneral ||
        "Sin estado",
      current: true
    }
  ];

  panel.innerHTML = `
    <div class="gc-section-heading">

      <div>
        <span class="gc-panel__eyebrow">
          Seguimiento técnico
        </span>

        <h3>Estado de la labor pericial</h3>
      </div>

    </div>

    <div class="gc-stage-list">

      ${stages
        .map(
          (stage, index) => `
            <article
              class="gc-stage
              ${stage.complete ? "is-complete" : ""}
              ${stage.current ? "is-current" : ""}"
            >

              <span class="gc-stage__marker">
                ${
                  stage.complete
                    ? "✓"
                    : stage.current
                      ? "!"
                      : index + 1
                }
              </span>

              <div>
                <strong>
                  ${escapeHtml(stage.title)}
                </strong>

                <span>
                  ${escapeHtml(stage.value)}
                </span>
              </div>

            </article>
          `
        )
        .join("")}

    </div>
  `;
};
    

  const renderTimeline = () => {
    const panel = document.querySelector(
      '[data-panel="actuaciones"]'
    );

    if (!panel) {
      return;
    }

    const actuaciones = Array.isArray(
      causa.actuaciones
    )
      ? [...causa.actuaciones]
      : [];

    actuaciones.sort((a, b) =>
      String(b.fecha || "").localeCompare(
        String(a.fecha || "")
      )
    );

    const timelineHtml = actuaciones.length
      ? actuaciones
          .map((item) => {
            const date = item.fecha
              ? new Date(
                  `${item.fecha}T12:00:00`
                )
              : null;

            const day =
              date &&
              !Number.isNaN(date.getTime())
                ? String(date.getDate()).padStart(
                    2,
                    "0"
                  )
                : "--";

            const monthYear =
              date &&
              !Number.isNaN(date.getTime())
                ? new Intl.DateTimeFormat(
                    "es-AR",
                    {
                      month: "short",
                      year: "numeric"
                    }
                  )
                    .format(date)
                    .replace(".", "")
                    .toUpperCase()
                : "SIN FECHA";

            return `
              <article class="gc-timeline-item">

                <div class="gc-timeline-item__date">

                  <strong>${day}</strong>

                  <span>
                    ${escapeHtml(monthYear)}
                  </span>

                </div>

               <div class="gc-timeline-item__content">

  <div class="gc-timeline-item__top">

    <span class="${getStatusClass(
      item.tipo
    )}">
      ${getValue(
        item.tipo,
        "Actuación"
      )}
    </span>

    <div class="gc-timeline-item__actions">

      <button
        type="button"
        class="gc-timeline-action"
        data-action="edit-action"
        data-action-id="${escapeHtml(item.id)}"
      >
        Editar
      </button>

      <button
        type="button"
        class="gc-timeline-action gc-timeline-action--danger"
        data-action="delete-action"
        data-action-id="${escapeHtml(item.id)}"
      >
        Eliminar
      </button>

    </div>

  </div>

  <h4>
    ${getValue(
      item.titulo,
      "Movimiento judicial"
    )}
  </h4>

  <p>
    ${getValue(
      item.descripcion,
      "Sin descripción"
    )}
  </p>

  ${
    item.vencimiento
      ? `
        <small class="gc-timeline-item__deadline">
          Vencimiento: ${formatDate(item.vencimiento)}
        </small>
      `
      : ""
  }

</div>

              </article>
            `;
          })
          .join("")
      : `
        <div class="gc-empty-state gc-empty-state--compact">

          <div class="gc-empty-state__icon">
            A
          </div>

          <h3>Sin actuaciones cargadas</h3>

          <p>
            Todavía no se registraron movimientos
            judiciales en esta causa.
          </p>

        </div>
      `;

    panel.innerHTML = `
      <div class="gc-section-heading">

        <div>
          <span class="gc-panel__eyebrow">
            Línea de tiempo
          </span>

          <h3>Actuaciones y movimientos</h3>
        </div>

        <button
          type="button"
          class="gc-button gc-button--secondary"
          id="gcAddActionButton"
        >
          Nueva actuación
        </button>

      </div>

      <div class="gc-timeline">
        ${timelineHtml}
      </div>
    `;
  };




const renderDocuments = () => {
  const panel =
    document.querySelector(
      '[data-panel="documentos"]'
    );

  if (!panel) {
    return;
  }

  const documents =
    Array.isArray(
      causa.documentos
    )
      ? causa.documentos
      : [];

  const documentsHtml =
    documents.length
      ? documents
          .map(
            (documento) => {

              const documentUrl =
                documento.secureUrl ||
                documento.url ||
                documento.downloadURL ||
                "";

              const extension =
                documento.extension ||
                documento.formato ||
                "DOC";

              return `
                <article class="gc-document-card">

                  <span class="gc-document-card__icon">
                    ${getValue(
                      extension,
                      "DOC"
                    )}
                  </span>

                  <div class="gc-document-card__content">

                    <strong>
                      ${getValue(
                        documento.nombre ||
                        documento.nombreOriginal,
                        "Documento"
                      )}
                    </strong>

                    <span>
                      ${getValue(
                        documento.categoria,
                        "Documento asociado"
                      )}
                    </span>

                    ${
                      documento.tamanioLegible
                        ? `
                          <small>
                            ${escapeHtml(
                              documento.tamanioLegible
                            )}
                          </small>
                        `
                        : ""
                    }

                  </div>

                  ${
                    documentUrl
                      ? `
                        <div class="gc-document-card__actions">

                          ${
                            String(extension).toLowerCase() === "pdf"
                              ? `
                                <a
                                  href="${escapeHtml(documentUrl)}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="gc-button gc-button--small"
                                >
                                  Abrir
                                </a>
                              `
                              : ""
                          }

                          <a
                            href="${escapeHtml(documentUrl)}"
                            download
                            class="gc-button gc-button--small gc-button--ghost"
                          >
                            Descargar
                          </a>

                        </div>
                      `
                      : `
                        <div class="gc-document-card__status">
                          <span class="gc-status gc-status--neutral">
                            Archivo histórico
                          </span>
                        </div>
                      `
                  }

                </article>
              `;
            }
          )
          .join("")
      : `
        <div class="gc-empty-state gc-empty-state--compact">

          <div class="gc-empty-state__icon">
            D
          </div>

          <h3>
            Sin documentos asociados
          </h3>

          <p>
            Todavía no se cargaron archivos en este registro.
          </p>

        </div>
      `;

  panel.innerHTML = `
    <div class="gc-section-heading">

      <div>

        <span class="gc-panel__eyebrow">
          Archivo digital
        </span>

        <h3>
          Documentación asociada
        </h3>

      </div>

      <button
        type="button"
        class="gc-button gc-button--secondary"
        id="gcUploadDocumentButton"
      >
        Subir documento
      </button>

      <input
        type="file"
        id="gcDocumentFileInput"
        accept=".pdf,.odt,.doc,.docx"
        hidden
      >

    </div>

    <div class="gc-document-grid">
      ${documentsHtml}
    </div>
  `;
};

const initializeDocumentUpload = () => {

  const uploadButton =
    document.getElementById(
      "gcUploadDocumentButton"
    );

  const fileInput =
    document.getElementById(
      "gcDocumentFileInput"
    );

  if (
    !uploadButton ||
    !fileInput
  ) {
    return;
  }


  /* =====================================================
     ABRIR SELECTOR
  ====================================================== */

  uploadButton.addEventListener(
    "click",
    () => {
      fileInput.click();
    }
  );


  /* =====================================================
     SUBIR DOCUMENTO
  ====================================================== */

  fileInput.addEventListener(
    "change",
    async (event) => {

      const archivo =
        event.target.files?.[0];

      if (!archivo) {
        return;
      }


      uploadButton.disabled = true;

      uploadButton.textContent =
        "Subiendo...";


      try {

        /* ===============================================
           TIPO DE REGISTRO
        =============================================== */

        const tipoRegistro =
          isPericia
            ? "pericias"
            : "causas";


        const coleccionFirestore =
          isPericia
            ? "gestion_pericias"
            : "gestion_causas";


        /* ===============================================
           SUBIR A CLOUDINARY
        =============================================== */

        const resultado =
          await window
            .GestionCausasDocumentosStorage
            .subirDocumento(
              tipoRegistro,
              causa.id,
              archivo
            );


        /* ===============================================
           DETECTAR CATEGORÍA
        =============================================== */

        const nombreNormalizado =
          String(
            archivo.name || ""
          )
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            )
            .toLowerCase();


        let categoria =
          "otros-documentos";


        if (
          nombreNormalizado.includes(
            "pericia"
          )
        ) {

          categoria =
            "pericia";

        } else if (
          nombreNormalizado.includes(
            "conteste"
          ) ||
          nombreNormalizado.includes(
            "contestacion"
          )
        ) {

          categoria =
            "contestacion-impugnacion";

        } else if (
          nombreNormalizado.includes(
            "impugnacion"
          )
        ) {

          categoria =
            "impugnacion";

        } else if (
          nombreNormalizado.includes(
            "aceptacion"
          )
        ) {

          categoria =
            "aceptacion-cargo";

        }


        /* ===============================================
           NUEVO DOCUMENTO
        =============================================== */

        const nuevoDocumento = {

          id:
            resultado.id ||
            window.crypto
              ?.randomUUID?.() ||
            `documento-${Date.now()}`,

          nombre:
            archivo.name,

          nombreOriginal:
            archivo.name,

          categoria,

          extension:
            resultado.extension ||
            "",

          formato:
            resultado.formato ||
            "",

          tipo:
            resultado.tipo ||
            archivo.type ||
            "",

          tamanio:
            resultado.tamanio ||
            archivo.size ||
            0,

          tamanioLegible:
            resultado.tamanioLegible ||
            "",

          publicId:
            resultado.publicId ||
            "",

          assetId:
            resultado.assetId ||
            null,

          secureUrl:
            resultado.secureUrl ||
            resultado.url ||
            "",

          url:
            resultado.secureUrl ||
            resultado.url ||
            "",

          carpeta:
            resultado.carpeta ||
            "",

          rutaCloudinary:
            resultado.ruta ||
            "",

          resourceType:
            resultado.resourceType ||
            "",

          proveedor:
            "cloudinary",

          estado:
            "subido",

          fechaCarga:
            new Date()
              .toISOString()
        };


        /* ===============================================
           DOCUMENTOS ACTUALES
        =============================================== */

        const documentosActuales =
          Array.isArray(
            causa.documentos
          )
            ? [
                ...causa.documentos
              ]
            : [];


        const documentosActualizados = [
          ...documentosActuales,
          nuevoDocumento
        ];


        /* ===============================================
           GUARDAR EN FIRESTORE
        =============================================== */

        const { db } =
          await import(
            "../../firebase-config.js"
          );


        const {
          doc,
          updateDoc
        } =
          await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
          );


        const registroRef =
          doc(
            db,
            coleccionFirestore,
            String(
              causa.id
            )
          );


        await updateDoc(
          registroRef,
          {
            documentos:
              documentosActualizados,

            documentosCount:
              documentosActualizados.length,

            fechaActualizacion:
              new Date()
                .toISOString()
          }
        );


        /* ===============================================
           ACTUALIZAR FICHA
        =============================================== */

        causa.documentos =
          documentosActualizados;

        causa.documentosCount =
          documentosActualizados.length;


        renderDocuments();

        initializeDocumentUpload();

        activateTab(
          "documentos"
        );


        showToast(
          "Documento subido y guardado correctamente."
        );


        console.log(
          "Gestión de Causas FALCO® documento vinculado:",
          nuevoDocumento
        );


      } catch (error) {

        console.error(
          "Error al subir el documento:",
          error
        );

        showToast(
          "No se pudo subir el documento.",
          "error"
        );

      } finally {

        const nuevoBoton =
          document.getElementById(
            "gcUploadDocumentButton"
          );

        if (nuevoBoton) {

          nuevoBoton.disabled =
            false;

          nuevoBoton.textContent =
            "Subir documento";

        }

      }

    }
  );
};




const renderFees = () => {
  const panel = document.querySelector(
    '[data-panel="honorarios"]'
  );

  if (!panel) {
    return;
  }

  const seguimiento = causa.seguimiento || {};

  const honorarios = Array.isArray(
    causa.honorarios
  )
    ? [...causa.honorarios]
    : [];

  honorarios.sort((a, b) =>
    String(b.fecha || "").localeCompare(
      String(a.fecha || "")
    )
  );

  const total = honorarios
    .filter((item) =>
      [
        "regulacion",
        "anticipo-solicitado",
        "anticipo-depositado"
      ].includes(item.tipo)
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.monto || 0),
      0
    );

  const paid = honorarios
    .filter(
      (item) =>
        item.tipo === "pago-parcial" ||
        item.tipo === "pago-total" ||
        item.estado === "cobrado" ||
        item.estado === "pagado"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.monto || 0),
      0
    );

  const pending = Math.max(total - paid, 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(Number(amount || 0));

  const getFeeTypeLabel = (type = "") => {
    const labels = {
      "anticipo-solicitado": "Anticipo solicitado",
      "anticipo-depositado": "Anticipo depositado",
      regulacion: "Regulación",
      "pago-parcial": "Pago parcial",
      "pago-total": "Pago total",
      aporte: "Aporte",
      factura: "Factura",
      otro: "Otro"
    };

    return labels[type] || type || "Sin tipo";
  };

  const getFeeStatusLabel = (status = "") => {
    const labels = {
      pendiente: "Pendiente",
      regulado: "Regulado",
      apelado: "Apelado",
      firme: "Firme",
      cobrado: "Cobrado",
      pagado: "Pagado"
    };

    return labels[status] || status || "Sin estado";
  };

  const getFeeStatusClass = (status = "") => {
    if (
      status === "pendiente" ||
      status === "apelado"
    ) {
      return "gc-status--warning";
    }

    if (
      status === "cobrado" ||
      status === "pagado" ||
      status === "firme"
    ) {
      return "gc-status--active";
    }

    return "gc-status--neutral";
  };

  const movementsHtml = honorarios.length
    ? honorarios
        .map(
          (item) => `
            <article class="gc-fee-movement">

              <div class="gc-fee-movement__main">

                <div class="gc-fee-movement__top">

                  <div class="gc-fee-movement__badges">

                    <span class="gc-badge gc-badge--moron">
                      ${escapeHtml(
                        getFeeTypeLabel(item.tipo)
                      )}
                    </span>

                    <span
                      class="gc-status ${getFeeStatusClass(
                        item.estado
                      )}"
                    >
                      ${escapeHtml(
                        getFeeStatusLabel(item.estado)
                      )}
                    </span>

                  </div>

                  <strong class="gc-fee-movement__amount">
                    ${formatCurrency(item.monto)}
                  </strong>

                </div>

                <div class="gc-fee-movement__meta">

                  <span>
                    <strong>Fecha:</strong>
                    ${formatDate(item.fecha)}
                  </span>

                  <span>
                    <strong>Parte obligada:</strong>
                    ${getValue(
                      item.parteObligada,
                      "Sin especificar"
                    )}
                  </span>

                  ${
                    item.formaPago
                      ? `
                        <span>
                          <strong>Forma de pago:</strong>
                          ${escapeHtml(item.formaPago)}
                        </span>
                      `
                      : ""
                  }

                  ${
                    item.comprobante
                      ? `
                        <span>
                          <strong>Comprobante:</strong>
                          ${escapeHtml(item.comprobante)}
                        </span>
                      `
                      : ""
                  }

                </div>

                ${
                  item.descripcion
                    ? `
                      <p class="gc-fee-movement__description">
                        ${escapeHtml(item.descripcion)}
                      </p>
                    `
                    : ""
                }

              </div>

              <div class="gc-fee-movement__actions">

                <button
                  type="button"
                  class="gc-timeline-action"
                  data-action="edit-fee"
                  data-fee-id="${escapeHtml(item.id)}"
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="gc-timeline-action gc-timeline-action--danger"
                  data-action="delete-fee"
                  data-fee-id="${escapeHtml(item.id)}"
                >
                  Eliminar
                </button>

              </div>

            </article>
          `
        )
        .join("")
    : `
      <div class="gc-empty-state gc-empty-state--compact">

        <div class="gc-empty-state__icon">
          $
        </div>

        <h3>Sin movimientos registrados</h3>

        <p>
          Todavía no se cargaron anticipos,
          regulaciones o pagos en esta causa.
        </p>

      </div>
    `;

  panel.innerHTML = `
    <div class="gc-section-heading">

      <div>
        <span class="gc-panel__eyebrow">
          Seguimiento económico
        </span>

        <h3>Honorarios y cobros</h3>
      </div>

      <button
        type="button"
        class="gc-button gc-button--secondary"
        id="gcAddFeeMovementButton"
      >
        Registrar movimiento
      </button>

    </div>

    <div class="gc-detail-grid">

      <article class="gc-detail-card">
        <span>Estado de honorarios</span>
        <strong>
          ${getValue(
            seguimiento.estadoHonorarios,
            "Sin regular"
          )}
        </strong>
      </article>

      <article class="gc-detail-card">
        <span>Anticipo de gastos</span>
        <strong>
          ${getValue(
            seguimiento.estadoAnticipo,
            "Sin solicitar"
          )}
        </strong>
      </article>

      <article class="gc-detail-card">
        <span>Total registrado</span>
        <strong>
          ${formatCurrency(total)}
        </strong>
      </article>

      <article class="gc-detail-card">
        <span>Total cobrado</span>
        <strong>
          ${formatCurrency(paid)}
        </strong>
      </article>

      <article class="gc-detail-card">
        <span>Saldo pendiente</span>
        <strong>
          ${formatCurrency(pending)}
        </strong>
      </article>

      <article class="gc-detail-card">
        <span>Movimientos registrados</span>
        <strong>
          ${honorarios.length}
        </strong>
      </article>

    </div>

    <div class="gc-fee-movements">

      <div class="gc-section-heading gc-section-heading--compact">

        <div>
          <span class="gc-panel__eyebrow">
            Detalle económico
          </span>

          <h3>Movimientos registrados</h3>
        </div>

      </div>

      ${movementsHtml}

    </div>
  `;
};

  const renderNotes = () => {
    const notes =
      document.getElementById("gcPrivateNotes");

    if (notes) {
      notes.value = causa.observaciones || "";
    }
  };

  const renderPericiados = () => {
    const panel = document.querySelector(
      '[data-panel="periciados"]'
    );

    if (!panel) {
      return;
    }

    const periciados = Array.isArray(
      causa.periciados
    )
      ? causa.periciados
      : [];

    if (!periciados.length) {
      return;
    }

    panel.innerHTML = `
      <div class="gc-section-heading">

        <div>
          <span class="gc-panel__eyebrow">
            Evaluación psicológica
          </span>

          <h3>Personas periciadas</h3>
        </div>

        <button
          type="button"
          class="gc-button gc-button--secondary"
        >
          Vincular periciado
        </button>

      </div>

      <div class="gc-party-grid">

        ${periciados
          .map(
            (person) => `
              <article class="gc-party-card">

                <div class="gc-party-card__header">

                  <span class="gc-party-card__type">
                    Periciado/a
                  </span>

                </div>

                <h4>
                  ${getValue(
                    person.nombre,
                    "Sin nombre"
                  )}
                </h4>

                <dl class="gc-data-list">

                  <div>
                    <dt>DNI</dt>
                    <dd>
                      ${getValue(person.dni)}
                    </dd>
                  </div>

                  <div>
                    <dt>Estado</dt>
                    <dd>
                      ${getValue(
                        person.estado,
                        "Sin definir"
                      )}
                    </dd>
                  </div>

                </dl>

              </article>
            `
          )
          .join("")}

      </div>
    `;
  };
  const showToast = (message, type = "success") => {
  const toast = document.getElementById("gcToast");

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.className =
    `gc-toast is-visible gc-toast--${type}`;

  window.clearTimeout(showToast.timeout);

  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
};

const generateId = () => {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `actuacion-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const initializeActionModal = () => {
  const modal =
    document.getElementById("gcActionModal");

  const form =
    document.getElementById("gcActionForm");

  const closeButton =
    document.getElementById("gcCloseActionModal");

  const cancelButton =
    document.getElementById("gcCancelActionButton");

let editingActionId = null;


  if (!modal || !form) {
    console.error(
      "No se encontró el modal o el formulario de actuaciones."
    );
    return;
  }

  const openModal = (action = null) => {
  form.reset();

  editingActionId = action?.id || null;

  const modalTitle =
    document.getElementById("gcActionModalTitle");

  const dateInput =
    document.getElementById("gcActionDate");

  if (modalTitle) {
    modalTitle.textContent = action
      ? "Editar actuación"
      : "Nueva actuación";
  }

  if (action) {
    form.elements.fecha.value =
      action.fecha || "";

    form.elements.tipo.value =
      action.tipo || "";

    form.elements.titulo.value =
      action.titulo || "";

    form.elements.descripcion.value =
      action.descripcion || "";

    form.elements.vencimiento.value =
      action.vencimiento || "";

    form.elements.estado.value =
      action.estado || "pendiente";

    form.elements.parte.value =
      action.parte || "";

    form.elements.plazo.value =
      action.plazo || "";

    form.elements.observaciones.value =
      action.observaciones || "";
  } else if (dateInput) {
    dateInput.value =
      new Date().toISOString().slice(0, 10);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("gc-modal-open");

  window.setTimeout(() => {
    dateInput?.focus();
  }, 50);
};
  const closeModal = () => {
    editingActionId = null;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gc-modal-open");
  };

 document.addEventListener("click", (event) => {
  const addButton = event.target.closest(
    "#gcAddActionButton"
  );

  const editButton = event.target.closest(
    '[data-action="edit-action"]'
  );

  const deleteButton = event.target.closest(
    '[data-action="delete-action"]'
  );

  if (addButton) {
    openModal();
    return;
  }

  if (editButton) {
    const actionId = editButton.dataset.actionId;

    const action = causa.actuaciones?.find(
      (item) => item.id === actionId
    );

    if (!action) {
      showToast(
        "No se encontró la actuación.",
        "error"
      );

      return;
    }

    openModal(action);
    return;
  }

  if (deleteButton) {
    const actionId = deleteButton.dataset.actionId;

    const action = causa.actuaciones?.find(
      (item) => item.id === actionId
    );

    if (!action) {
      showToast(
        "No se encontró la actuación.",
        "error"
      );

      return;
    }

    const confirmed = window.confirm(
      `¿Eliminar la actuación "${action.titulo}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedCase = {
      ...causa,

      actuaciones: causa.actuaciones.filter(
        (item) => item.id !== actionId
      ),

      fechaActualizacion:
        new Date().toISOString()
    };

    const saved =
      window.GestionCausasData?.updateCase?.(
        updatedCase
      );

    if (!saved) {
      showToast(
        "No se pudo eliminar la actuación.",
        "error"
      );

      return;
    }

    Object.assign(causa, updatedCase);

    renderTimeline();
    activateTab("actuaciones");

    showToast(
      "La actuación fue eliminada correctamente."
    );
  }
});

  closeButton?.addEventListener(
    "click",
    closeModal
  );

  cancelButton?.addEventListener(
    "click",
    closeModal
  );

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
      ) {
        closeModal();
      }
    }
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const nuevaActuacion = {
      id: generateId(),
      fecha: String(
        formData.get("fecha") || ""
      ),
      tipo: String(
        formData.get("tipo") || ""
      ),
      titulo: String(
        formData.get("titulo") || ""
      ).trim(),
      descripcion: String(
        formData.get("descripcion") || ""
      ).trim(),
      vencimiento: String(
        formData.get("vencimiento") || ""
      ),
      estado: String(
        formData.get("estado") || "pendiente"
      ),
      parte: String(
        formData.get("parte") || ""
      ),
      plazo: String(
        formData.get("plazo") || ""
      ).trim(),
      observaciones: String(
        formData.get("observaciones") || ""
      ).trim(),
      fechaCreacion: new Date().toISOString()
    };

   const actuacionesActuales =
  Array.isArray(causa.actuaciones)
    ? [...causa.actuaciones]
    : [];

const actuacionesActualizadas = editingActionId
  ? actuacionesActuales.map((item) =>
      item.id === editingActionId
        ? {
            ...item,
            ...nuevaActuacion,
            id: editingActionId,
            fechaCreacion:
              item.fechaCreacion ||
              nuevaActuacion.fechaCreacion,
            fechaActualizacion:
              new Date().toISOString()
          }
        : item
    )
  : [
      ...actuacionesActuales,
      nuevaActuacion
    ];

const seguimientoActual =
  (
    causa.seguimiento &&
    typeof causa.seguimiento === "object"
  )
    ? {
        ...causa.seguimiento
      }
    : {};


const updatedCase = {
  ...causa,

  actuaciones:
    actuacionesActualizadas,

  seguimiento:
    seguimientoActual,

  fechaActualizacion:
    new Date().toISOString()
};


/* =====================================================
   SINCRONIZAR ACTUACIÓN CON SEGUIMIENTO PERICIAL
===================================================== */

const tipoActuacion =
  String(
    nuevaActuacion.tipo || ""
  )
    .trim()
    .toLowerCase();


const estadoActuacion =
  String(
    nuevaActuacion.estado || ""
  )
    .trim()
    .toLowerCase();


const fechaActuacion =
  nuevaActuacion.fecha || "";


/* =========================
   DESIGNACIÓN
========================= */

if (
  tipoActuacion === "designación" ||
  tipoActuacion === "designacion"
) {

  updatedCase.fechaDesignacion =
    fechaActuacion;

  updatedCase.seguimiento.estadoDesignacion =
    estadoActuacion === "cumplida" ||
    estadoActuacion === "presentada"
      ? "registrada"
      : estadoActuacion === "pendiente"
        ? "sin-cargar"
        : "registrada";

}


/* =========================
   ACEPTACIÓN DEL CARGO
========================= */

if (
  tipoActuacion === "aceptación del cargo" ||
  tipoActuacion === "aceptacion del cargo"
) {

  updatedCase.fechaAceptacion =
    fechaActuacion;

  updatedCase.seguimiento.estadoAceptacion =
    estadoActuacion === "presentada" ||
    estadoActuacion === "cumplida"
      ? "registrada"
      : "registrada";

}


/* =========================
   ANTICIPO DE GASTOS
========================= */

if (
  tipoActuacion === "anticipo de gastos"
) {

  if (
    estadoActuacion === "presentada" ||
    estadoActuacion === "cumplida"
  ) {

    updatedCase.seguimiento.estadoAnticipo =
      "solicitado";

  } else {

    updatedCase.seguimiento.estadoAnticipo =
      estadoActuacion === "pendiente"
        ? "sin-solicitar"
        : "solicitado";

  }

  updatedCase.fechaAnticipo =
    fechaActuacion;

}


/* =========================
   ENTREVISTA
========================= */

if (
  tipoActuacion === "entrevista"
) {

  updatedCase.fechaEntrevista =
    fechaActuacion;

  updatedCase.seguimiento.estadoEntrevista =
    estadoActuacion === "cumplida"
      ? "realizada"
      : estadoActuacion === "pendiente" ||
        estadoActuacion === "en-preparacion"
        ? "registrada"
        : "registrada";

}


/* =========================
   PERICIA
========================= */

if (
  tipoActuacion === "pericia"
) {

  updatedCase.fechaPericia =
    fechaActuacion;

  updatedCase.seguimiento.estadoPericia =
    estadoActuacion === "presentada" ||
    estadoActuacion === "cumplida"
      ? "presentada"
      : estadoActuacion === "pendiente" ||
        estadoActuacion === "en-preparacion"
        ? "pendiente"
        : estadoActuacion;

}


/* =========================
   IMPUGNACIÓN
========================= */

if (
  tipoActuacion === "impugnación" ||
  tipoActuacion === "impugnacion"
) {

  updatedCase.fechaImpugnacion =
    fechaActuacion;

  updatedCase.seguimiento.estadoImpugnacion =
    estadoActuacion === "pendiente" ||
    estadoActuacion === "en-preparacion"
      ? "recibida"
      : estadoActuacion === "cumplida"
        ? "recibida"
        : "recibida";

}


/* =========================
   EXPLICACIONES / CONTESTACIÓN
========================= */

if (
  tipoActuacion === "explicaciones"
) {

  updatedCase.fechaContestacion =
    fechaActuacion;

  updatedCase.seguimiento.estadoContestacion =
    estadoActuacion === "presentada" ||
    estadoActuacion === "cumplida"
      ? "presentada"
      : estadoActuacion === "pendiente" ||
        estadoActuacion === "en-preparacion"
        ? "pendiente"
        : estadoActuacion;

}

    if (nuevaActuacion.vencimiento) {
      updatedCase.proximoVencimiento =
        nuevaActuacion.vencimiento;
    }

  /* =====================================================
   CALCULAR PRÓXIMO PASO PERICIAL
===================================================== */

const seguimientoParaPaso =
  updatedCase.seguimiento || {};


const estadoAceptacionPaso =
  seguimientoParaPaso.estadoAceptacion ||
  "sin-cargar";

const estadoAnticipoPaso =
  seguimientoParaPaso.estadoAnticipo ||
  "sin-solicitar";

const estadoEntrevistaPaso =
  seguimientoParaPaso.estadoEntrevista ||
  "sin-informacion";

const estadoPericiaPaso =
  seguimientoParaPaso.estadoPericia ||
  "pendiente";

const estadoImpugnacionPaso =
  seguimientoParaPaso.estadoImpugnacion ||
  "ninguna";

const estadoContestacionPaso =
  seguimientoParaPaso.estadoContestacion ||
  "ninguna";


let proximoPasoCalculado =
  "Revisar estado de la causa";


/* =========================================
   PRIORIDAD 1 — CONTESTAR IMPUGNACIÓN
========================================= */

if (
  estadoImpugnacionPaso === "recibida" &&
  estadoContestacionPaso !== "presentada"
) {

  proximoPasoCalculado =
    "Contestar impugnación / explicaciones";

}


/* =========================================
   PRIORIDAD 2 — PERICIA
========================================= */

else if (
  estadoPericiaPaso === "pendiente"
) {

  if (
    estadoEntrevistaPaso === "realizada"
  ) {

    proximoPasoCalculado =
      "Presentar dictamen pericial";

  }

  else if (
    estadoEntrevistaPaso === "registrada"
  ) {

    proximoPasoCalculado =
      "Realizar entrevista pericial";

  }

  else if (
    estadoAceptacionPaso === "registrada"
  ) {

    proximoPasoCalculado =
      "Coordinar entrevista pericial";

  }

  else {

    proximoPasoCalculado =
      "Revisar aceptación del cargo";

  }

}


/* =========================================
   PRIORIDAD 3 — PERICIA YA PRESENTADA
========================================= */

else if (
  estadoPericiaPaso === "presentada"
) {

  if (
    estadoImpugnacionPaso === "ninguna"
  ) {

    proximoPasoCalculado =
      "Controlar traslado del dictamen";

  }

  else if (
    estadoContestacionPaso === "presentada"
  ) {

    proximoPasoCalculado =
      "Controlar resolución posterior";

  }

}


/* =========================================
   GUARDAR PRÓXIMO PASO
========================================= */

updatedCase.proximoPaso =
  proximoPasoCalculado;

    const saved =
      window.GestionCausasData?.updateCase?.(
        updatedCase
      );

    if (!saved) {
      showToast(
        "No se pudo guardar la actuación.",
        "error"
      );

      return;
    }

    Object.assign(causa, updatedCase);

    closeModal();
    renderHeader();
    renderTimeline();
    activateTab("actuaciones");

   showToast(
  editingActionId
    ? "La actuación fue actualizada correctamente."
    : "La actuación fue registrada correctamente."
);
  });
};


const initializeFeeModal = () => {
  const modal =
    document.getElementById("gcFeeModal");

  const form =
    document.getElementById("gcFeeForm");

  const closeButton =
    document.getElementById("gcCloseFeeModal");

  const cancelButton =
    document.getElementById("gcCancelFeeButton");

    let editingFeeId = null;

  if (!modal || !form) {
    return;
  }




 const openModal = (movement = null) => {
  form.reset();

  editingFeeId = movement?.id || null;

  const title =
    document.getElementById("gcFeeModalTitle");

  const dateInput =
    document.getElementById("gcFeeDate");

  if (title) {
    title.textContent = movement
      ? "Editar movimiento"
      : "Registrar movimiento";
  }

  if (movement) {
    form.elements.fecha.value =
      movement.fecha || "";

    form.elements.tipo.value =
      movement.tipo || "";

    form.elements.monto.value =
      movement.monto || "";

    form.elements.estado.value =
      movement.estado || "pendiente";

    form.elements.parteObligada.value =
      movement.parteObligada || "";

    form.elements.porcentaje.value =
      movement.porcentaje || "";

    form.elements.formaPago.value =
      movement.formaPago || "";

    form.elements.comprobante.value =
      movement.comprobante || "";

    form.elements.aportes.value =
      movement.aportes || "";

    form.elements.descripcion.value =
      movement.descripcion || "";

    form.elements.observaciones.value =
      movement.observaciones || "";
  } else if (dateInput) {
    dateInput.value =
      new Date().toISOString().slice(0, 10);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("gc-modal-open");

  window.setTimeout(() => {
    dateInput?.focus();
  }, 50);
};

  const closeModal = () => {
    editingFeeId = null;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gc-modal-open");
  };





document.addEventListener("click", (event) => {

  const addButton = event.target.closest(
    "#gcAddFeeMovementButton"
  );

  const editButton = event.target.closest(
    '[data-action="edit-fee"]'
  );

  const deleteButton = event.target.closest(
    '[data-action="delete-fee"]'
  );

  if (addButton) {
    openModal();
    return;
  }

  if (editButton) {

    const feeId =
      editButton.dataset.feeId;

    const movement =
      causa.honorarios?.find(
        item => item.id === feeId
      );

    if (!movement) {
      showToast(
        "No se encontró el movimiento.",
        "error"
      );
      return;
    }

    openModal(movement);
    return;
  }

  if (deleteButton) {

    const feeId =
      deleteButton.dataset.feeId;

    const confirmed = window.confirm(
      "¿Eliminar este movimiento?"
    );

    if (!confirmed) {
      return;
    }

    const updatedCase = {
      ...causa,

      honorarios:
        causa.honorarios.filter(
          item => item.id !== feeId
        ),

      fechaActualizacion:
        new Date().toISOString()
    };

    const saved =
      window.GestionCausasData?.updateCase?.(
        updatedCase
      );

    if (!saved) {

      showToast(
        "No se pudo eliminar.",
        "error"
      );

      return;
    }

    Object.assign(causa, updatedCase);

    renderFees();
    activateTab("honorarios");

    showToast(
      "Movimiento eliminado."
    );
  }

});

  closeButton?.addEventListener(
    "click",
    closeModal
  );

  cancelButton?.addEventListener(
    "click",
    closeModal
  );

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("is-open")
    ) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const movimiento = {
      id:
        window.crypto?.randomUUID?.() ||
        `honorario-${Date.now()}`,

      fecha: String(
        formData.get("fecha") || ""
      ),

      tipo: String(
        formData.get("tipo") || ""
      ),

      monto: Number(
        formData.get("monto") || 0
      ),

      estado: String(
        formData.get("estado") || "pendiente"
      ),

      parteObligada: String(
        formData.get("parteObligada") || ""
      ).trim(),

      porcentaje: Number(
        formData.get("porcentaje") || 0
      ),

      formaPago: String(
        formData.get("formaPago") || ""
      ),

      comprobante: String(
        formData.get("comprobante") || ""
      ).trim(),

      aportes: Number(
        formData.get("aportes") || 0
      ),

      descripcion: String(
        formData.get("descripcion") || ""
      ).trim(),

      observaciones: String(
        formData.get("observaciones") || ""
      ).trim(),

      fechaCreacion:
        new Date().toISOString()
    };



    const movimientosActuales =
  Array.isArray(causa.honorarios)
    ? [...causa.honorarios]
    : [];

const estabaEditando = Boolean(editingFeeId);

const movimientosActualizados = estabaEditando
  ? movimientosActuales.map((item) =>
      item.id === editingFeeId
        ? {
            ...item,
            ...movimiento,
            id: editingFeeId,
            fechaCreacion:
              item.fechaCreacion ||
              movimiento.fechaCreacion,
            fechaActualizacion:
              new Date().toISOString()
          }
        : item
    )
  : [
      ...movimientosActuales,
      movimiento
    ];

const updatedCase = {
  ...causa,

  honorarios: movimientosActualizados,

  seguimiento: {
    ...(causa.seguimiento || {}),
    estadoHonorarios: movimiento.estado
  },

  fechaActualizacion:
    new Date().toISOString()
};

    const saved =
      window.GestionCausasData?.updateCase?.(
        updatedCase
      );

    if (!saved) {
      showToast(
        "No se pudo guardar el movimiento.",
        "error"
      );

      return;
    }

    Object.assign(causa, updatedCase);

    closeModal();
    renderFees();
    activateTab("honorarios");

   showToast(
  estabaEditando
    ? "El movimiento fue actualizado correctamente."
    : "El movimiento fue registrado correctamente."
);
  });
};



tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateTab(tab.dataset.tab);
  });
});

if (!causa) {
  renderNotFound();
  return;
}


/* =========================================================
   MODO PERICIA
========================================================= */

if (isPericia) {

  const editButton =
    document.getElementById(
      "gcEditCaseButton"
    );

  const saveButton =
    document.getElementById(
      "gcSaveCaseButton"
    );

  const backButton =
    document.querySelector(
      ".gc-topbar__actions a"
    );

  if (editButton) {
    editButton.hidden = true;
  }

  if (saveButton) {
    saveButton.hidden = true;
  }

  if (backButton) {
    backButton.href =
      "./pericias.html";

    backButton.textContent =
      "Volver a Pericias";
  }

  const topTitle =
    document.querySelector(
      ".gc-topbar h1"
    );

  if (topTitle) {
    topTitle.textContent =
      "Ficha de la pericia";
  }

  const eyebrow =
    document.querySelector(
      ".gc-topbar__eyebrow"
    );

  if (eyebrow) {
    eyebrow.textContent =
      "Archivo pericial";
  }

}


renderHeader();
renderGeneralInformation();
renderParties();
renderLawyers();
renderExpertReport();
renderPericiados();
renderTimeline();
renderDocuments();

initializeDocumentUpload();

renderFees();
renderNotes();

initializeActionModal();
initializeFeeModal();

activateTab("informacion");

document.body.classList.remove(
  "gc-ficha-loading"
);

console.log(
  "Gestión de Causas FALCO® Ficha Ready",
  causa
);
});