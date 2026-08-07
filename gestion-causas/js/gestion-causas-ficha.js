document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const tabs = document.querySelectorAll(".gc-case-tab");
  const panels = document.querySelectorAll(".gc-case-panel");

  const params = new URLSearchParams(window.location.search);
  const causeId = params.get("id");

  const causa =
    window.GestionCausasData?.getCaseById?.(causeId);

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
        causa.proximoPaso ||
        "Sin próximo paso";
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
        formatDate(causa.fechaDesignacion),
      gcDetailAcceptanceDate:
        formatDate(causa.fechaAceptacion)
    };

    Object.entries(values).forEach(
      ([elementId, value]) => {
        const element =
          document.getElementById(elementId);

        if (element) {
          element.textContent =
            value || "Sin cargar";
        }
      }
    );
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
          ? formatDate(causa.fechaDesignacion)
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
          ? formatDate(causa.fechaAceptacion)
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
        formatStageValue(
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
        formatStageValue(
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
        formatStageValue(
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
        formatStageValue(
          estadoImpugnacion,
          "Ninguna"
        ),
      complete:
        estadoImpugnacion === "recibida"
    },

    {
      title: "Contestación",
      value:
        formatStageValue(
          estadoContestacion,
          "Ninguna"
        ),
      complete:
        estadoContestacion === "presentada"
    },

    {
      title: "Honorarios",
      value:
        formatStageValue(
          estadoHonorarios,
          "Sin regular"
        ),
      complete: [
        "regulado",
        "registrado",
        "cobrado"
      ].includes(estadoHonorarios)
    },

    {
      title: "Cobro",
      value:
        formatStageValue(
          estadoCobro,
          "Pendiente"
        ),
      complete:
        estadoCobro === "cobrado"
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
    const panel = document.querySelector(
      '[data-panel="documentos"]'
    );

    if (!panel) {
      return;
    }

    const documents = Array.isArray(
      causa.documentos
    )
      ? causa.documentos
      : [];

    const documentsHtml = documents.length
      ? documents
          .map(
            (document) => `
              <article class="gc-document-card">

                <span class="gc-document-card__icon">
                  ${getValue(
                    document.extension,
                    "DOC"
                  )}
                </span>

                <div>
                  <strong>
                    ${getValue(
                      document.nombre,
                      "Documento"
                    )}
                  </strong>

                  <span>
                    ${getValue(
                      document.categoria,
                      "Sin categoría"
                    )}
                  </span>
                </div>

              </article>
            `
          )
          .join("")
      : `
        <div class="gc-empty-state gc-empty-state--compact">

          <div class="gc-empty-state__icon">
            D
          </div>

          <h3>Sin documentos asociados</h3>

          <p>
            Todavía no se cargaron archivos en esta causa.
          </p>

        </div>
      `;

    panel.innerHTML = `
      <div class="gc-section-heading">

        <div>
          <span class="gc-panel__eyebrow">
            Archivo digital
          </span>

          <h3>Documentación asociada</h3>
        </div>

        <button
          type="button"
          class="gc-button gc-button--secondary"
          id="gcUploadDocumentButton"
        >
          Subir documento
        </button>

      </div>

      <div class="gc-document-grid">
        ${documentsHtml}
      </div>
    `;
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

const updatedCase = {
  ...causa,
  actuaciones: actuacionesActualizadas,
  fechaActualizacion:
    new Date().toISOString()
};

    if (nuevaActuacion.vencimiento) {
      updatedCase.proximoVencimiento =
        nuevaActuacion.vencimiento;
    }

    if (
      nuevaActuacion.estado === "pendiente" ||
      nuevaActuacion.estado === "en-preparacion"
    ) {
      updatedCase.proximoPaso =
        nuevaActuacion.titulo;
    }

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

renderHeader();
renderGeneralInformation();
renderParties();
renderLawyers();
renderExpertReport();
renderPericiados();
renderTimeline();
renderDocuments();
renderFees();
renderNotes();

initializeActionModal();
initializeFeeModal();

activateTab("informacion");

console.log(
  "Gestión de Causas FALCO® Ficha Ready",
  causa
);
});