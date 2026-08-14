document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  const tableBody = document.getElementById(
    "gcCasesTableBody"
  );

  const emptyState = document.getElementById(
    "gcCasesEmptyState"
  );

  const countElement = document.getElementById(
    "gcCasesCount"
  );

  const searchInput = document.getElementById(
    "gcSearchCases"
  );

  const departmentFilter = document.getElementById(
    "gcDepartmentFilter"
  );

  const courtFilter = document.getElementById(
    "gcCourtFilter"
  );

  const statusFilter = document.getElementById(
    "gcStatusFilter"
  );

  const activityFilter = document.getElementById(
    "gcActivityFilter"
  );

  const clearFiltersButton = document.getElementById(
    "gcClearFilters"
  );

  const pageTitle = document.getElementById(
    "gcCasesPageTitle"
  );

  const pageHeading = document.getElementById(
    "gcCasesHeading"
  );

  let currentCases = [];

  const normalizeText = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(`${dateValue}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const getCases = () =>
    window.GestionCausasData?.getCases?.() || [];

  const getDepartmentName = (causa) => {
    if (causa.departamentoNombre) {
      return causa.departamentoNombre;
    }

    if (causa.departamento === "moron") {
      return "Morón";
    }

    if (causa.departamento === "la-matanza") {
      return "La Matanza";
    }

    return "Otro";
  };

  const getDepartmentClass = (causa) => {
    if (causa.departamento === "moron") {
      return "gc-badge--moron";
    }

    if (causa.departamento === "la-matanza") {
      return "gc-badge--matanza";
    }

    return "gc-status--neutral";
  };

  const getStatusClass = (status = "") => {
    const normalized = normalizeText(status);

    if (
      normalized.includes("impugnacion") ||
      normalized.includes("explicaciones") ||
      normalized.includes("traslado") ||
      normalized.includes("pendiente")
    ) {
      return "gc-status--warning";
    }

    if (
      normalized.includes("finalizada") ||
      normalized.includes("archivada")
    ) {
      return "gc-status--neutral";
    }

    return "gc-status--active";
  };

  const getPartyLabel = (party = "") => {
    const labels = {
      actora: "Parte actora",
      demandada: "Parte demandada",
      codemandada: "Codemandada",
      tercero: "Tercero citado"
    };

    return labels[party] || "Interviniente";
  };

  const getLawyersSearchText = (causa) => {
    const lawyers = Array.isArray(causa.abogados)
      ? causa.abogados
      : [];

    return lawyers
      .map((lawyer) =>
        [
          lawyer.nombreCompleto,
          lawyer.matricula,
          lawyer.colegio,
          lawyer.telefono,
          lawyer.whatsapp,
          lawyer.email,
          lawyer.domicilioElectronico,
          lawyer.estudioJuridico,
          lawyer.companiaRepresentada
        ]
          .filter(Boolean)
          .join(" ")
      )
      .join(" ");
  };

  const getCodefendantsSearchText = (causa) => {
    const codefendants = Array.isArray(causa.codemandadas)
      ? causa.codemandadas
      : [];

    return codefendants
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return [
          item.nombre,
          item.tipo,
          item.documento,
          item.telefono,
          item.email,
          item.compania,
          item.abogadoNombre,
          item.abogadoTelefono,
          item.abogadoEmail
        ]
          .filter(Boolean)
          .join(" ");
      })
      .join(" ");
  };

  const getSearchableText = (causa) =>
    normalizeText(
      [
        causa.caratula,
        causa.expediente,
        causa.codigoInterno,
        causa.actor,
        causa.demandado,
        causa.partes?.actora?.nombre,
        causa.partes?.actora?.documento,
        causa.partes?.actora?.telefono,
        causa.partes?.actora?.email,
        causa.partes?.demandada?.nombre,
        causa.partes?.demandada?.documento,
        causa.partes?.demandada?.telefono,
        causa.partes?.demandada?.email,
        getDepartmentName(causa),
        causa.fuero,
        causa.organismo,
        causa.juzgado,
        causa.secretaria,
        causa.tipoProceso,
        causa.estadoGeneral,
        causa.proximoPaso,
        getLawyersSearchText(causa),
        getCodefendantsSearchText(causa)
      ]
        .filter(Boolean)
        .join(" ")
    );

  const renderLawyers = (causa) => {
    const lawyers = Array.isArray(causa.abogados)
      ? causa.abogados
      : [];

    if (!lawyers.length) {
      return `
        <span class="gc-muted-text">
          Sin abogados cargados
        </span>
      `;
    }

    const visibleLawyers = lawyers.slice(0, 3);

    const html = visibleLawyers
      .map(
        (lawyer) => `
          <div class="gc-lawyer-summary">
            <strong>
              ${escapeHtml(
                lawyer.nombreCompleto || "Sin nombre"
              )}
            </strong>

            <span>
              ${escapeHtml(getPartyLabel(lawyer.parte))}
            </span>

            ${
              lawyer.companiaRepresentada
                ? `
                  <small>
                    ${escapeHtml(
                      lawyer.companiaRepresentada
                    )}
                  </small>
                `
                : ""
            }
          </div>
        `
      )
      .join("");

    if (lawyers.length <= 3) {
      return html;
    }

    return `
      ${html}

      <span class="gc-muted-text">
        +${lawyers.length - 3} abogado(s)
      </span>
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


  if (
    impugnacion === "recibida" &&
    contestacion !== "presentada"
  ) {
    return "Contestar impugnación / explicaciones";
  }


  if (pericia === "pendiente") {

    if (entrevista === "realizada") {
      return "Presentar dictamen pericial";
    }

    if (entrevista === "registrada") {
      return "Realizar entrevista pericial";
    }

    if (aceptacion === "registrada") {
      return "Coordinar entrevista pericial";
    }

    return "Revisar aceptación del cargo";
  }


  if (pericia === "presentada") {

    if (impugnacion === "ninguna") {
      return "Controlar traslado del dictamen";
    }

    if (contestacion === "presentada") {
      return "Controlar resolución posterior";
    }
  }


  if (anticipo === "solicitado") {
    return "Controlar anticipo de gastos";
  }


  return (
    causaActual.proximoPaso ||
    "Revisar estado de la causa"
  );

};

  const renderNextStep = (causa) => {
    const nextStep =
      causa.proximoPaso || "Sin próximo paso";

    const deadline = formatDate(
      causa.proximoVencimiento
    );

    return `
      <span class="gc-next-step">
        ${escapeHtml(nextStep)}
      </span>

      ${
        deadline
          ? `
            <small class="gc-table-subvalue">
              Vence: ${escapeHtml(deadline)}
            </small>
          `
          : ""
      }
    `;
  };

  const renderCases = (causas) => {
    currentCases = causas;

    if (!tableBody || !emptyState || !countElement) {
      return;
    }

    countElement.textContent = String(causas.length);

    if (!causas.length) {
      tableBody.innerHTML = "";
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    tableBody.innerHTML = causas
      .map(
        (causa) => `
          <tr data-case-id="${escapeHtml(causa.id)}">

            <td>
              <div class="gc-case-name">

                <strong>
                  ${escapeHtml(
                    causa.caratula || "Sin carátula"
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    causa.expediente ||
                      "Sin número de expediente"
                  )}

                  ·

                  ${escapeHtml(
                    causa.codigoInterno ||
                      "Sin código interno"
                  )}
                </span>

              </div>
            </td>

            <td>
              <span
                class="gc-badge ${getDepartmentClass(
                  causa
                )}"
              >
                ${escapeHtml(getDepartmentName(causa))}
              </span>
            </td>

            <td>
              <span class="gc-table-value">
                ${escapeHtml(
                  causa.fuero || "Sin definir"
                )}
              </span>
            </td>

            <td>
              <div class="gc-lawyers-cell">
                ${renderLawyers(causa)}
              </div>
            </td>

            <td>
              <span
                class="gc-status ${getStatusClass(
                  causa.estadoGeneral
                )}"
              >
                ${escapeHtml(
                  causa.estadoGeneral || "Sin estado"
                )}
              </span>
            </td>

            <td>
              ${renderNextStep(causa)}
            </td>

            <td>
              <div class="gc-row-actions">

                <a
                  href="./ficha-causa.html?id=${encodeURIComponent(
                    causa.id
                  )}"
                  class="gc-row-link"
                >
                  Abrir
                </a>

                <button
                  type="button"
                  class="gc-row-action-button"
                  data-action="delete-case"
                  data-case-id="${escapeHtml(causa.id)}"
                  aria-label="Eliminar causa"
                >
                  Eliminar
                </button>

              </div>
            </td>

          </tr>
        `
      )
      .join("");
  };

  const sortCases = (causas) =>
    [...causas].sort((a, b) => {
      const dateA =
        a.fechaActualizacion ||
        a.fechaCreacion ||
        "";

      const dateB =
        b.fechaActualizacion ||
        b.fechaCreacion ||
        "";

      if (dateA && dateB && dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      return String(a.caratula || "").localeCompare(
        String(b.caratula || ""),
        "es"
      );
    });

  const applyFilters = () => {
    const cases = getCases();

    const searchValue = normalizeText(
      searchInput?.value
    );

    const departmentValue =
      departmentFilter?.value || "";

    const courtValue =
      courtFilter?.value || "";

    const statusValue =
      statusFilter?.value || "";

    const activityValue =
      activityFilter?.value || "";

    const filteredCases = cases.filter((causa) => {
      const matchesSearch =
        !searchValue ||
        getSearchableText(causa).includes(
          searchValue
        );

      const matchesDepartment =
        !departmentValue ||
        causa.departamento === departmentValue;

      const matchesCourt =
        !courtValue ||
        causa.fuero === courtValue;

      const matchesStatus =
        !statusValue ||
        causa.estadoGeneral === statusValue;

      const matchesActivity =
        !activityValue ||
        (activityValue === "activa" &&
          causa.activa === true) ||
        (activityValue === "finalizada" &&
          causa.activa === false);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesCourt &&
        matchesStatus &&
        matchesActivity
      );
    });

    renderCases(sortCases(filteredCases));
  };

  const applyUrlFilters = () => {
    const params = new URLSearchParams(
      window.location.search
    );

    const department = params.get("departamento");
    const view = params.get("vista");

const navLinks =
  document.querySelectorAll(
    ".gc-nav__link"
  );

navLinks.forEach((link) => {
  link.classList.remove("is-active");
});

const activeLink =
  department === "moron"
    ? document.querySelector(
        '.gc-nav__link[href="./causas.html?departamento=moron"]'
      )
    : department === "la-matanza"
      ? document.querySelector(
          '.gc-nav__link[href="./causas.html?departamento=la-matanza"]'
        )
      : document.querySelector(
          '.gc-nav__link[href="./causas.html"]'
        );

activeLink?.classList.add("is-active");


    if (
      department &&
      departmentFilter &&
      ["moron", "la-matanza"].includes(department)
    ) {
      departmentFilter.value = department;

      const departmentName =
        department === "moron"
          ? "Morón"
          : "La Matanza";

      if (pageTitle) {
        pageTitle.textContent =
          `Causas de ${departmentName}`;
      }

      if (pageHeading) {
        pageHeading.textContent =
          `Expedientes del Departamento Judicial de ${departmentName}`;
      }
    }

    if (view === "impugnaciones") {
      if (pageTitle) {
        pageTitle.textContent =
          "Impugnaciones y traslados";
      }

      if (pageHeading) {
        pageHeading.textContent =
          "Seguimiento de impugnaciones, explicaciones y traslados";
      }

      if (statusFilter) {
        statusFilter.value = "En impugnación";
      }
    }

    if (view === "pericias") {
      if (pageTitle) {
        pageTitle.textContent = "Pericias";
      }

      if (pageHeading) {
        pageHeading.textContent =
          "Seguimiento de dictámenes y estados periciales";
      }
    }

    if (view === "entrevistas") {
      if (pageTitle) {
        pageTitle.textContent = "Entrevistas";
      }

      if (pageHeading) {
        pageHeading.textContent =
          "Seguimiento de entrevistas psicológicas";
      }
    }
  };

  const clearFilters = () => {
    if (searchInput) {
      searchInput.value = "";
    }

    if (departmentFilter) {
      departmentFilter.value = "";
    }

    if (courtFilter) {
      courtFilter.value = "";
    }

    if (statusFilter) {
      statusFilter.value = "";
    }

    if (activityFilter) {
      activityFilter.value = "";
    }

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    if (pageTitle) {
      pageTitle.textContent = "Todas las causas";
    }

    if (pageHeading) {
      pageHeading.textContent =
        "Consulta y seguimiento de causas";
    }

    applyFilters();
  };

  const deleteCase = (caseId) => {
    const causa =
      window.GestionCausasData?.getCaseById?.(
        caseId
      );

    if (!causa) {
      return;
    }

    const confirmed = window.confirm(
      `¿Eliminar la causa "${causa.caratula}"?\n\nEsta acción eliminará el registro local creado desde el sistema.`
    );

    if (!confirmed) {
      return;
    }

    const deleted =
      window.GestionCausasData?.deleteCase?.(
        caseId
      );

    if (!deleted) {
      window.alert(
        "No se pudo eliminar la causa."
      );

      return;
    }

    applyFilters();
  };

  tableBody?.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(
      '[data-action="delete-case"]'
    );

    if (!deleteButton) {
      return;
    }

    const caseId = deleteButton.dataset.caseId;

    deleteCase(caseId);
  });

  [
    searchInput,
    departmentFilter,
    courtFilter,
    statusFilter,
    activityFilter
  ].forEach((element) => {
    if (!element) {
      return;
    }

    const eventName =
      element.tagName === "INPUT"
        ? "input"
        : "change";

    element.addEventListener(
      eventName,
      applyFilters
    );
  });

  clearFiltersButton?.addEventListener(
  "click",
  clearFilters
);

applyUrlFilters();

if (
  window.GestionCausasData?.ready
) {
  await window.GestionCausasData.ready;
}

applyFilters();

document.body.classList.add("is-ready");


console.log(
  "Gestión de Causas FALCO® Listado Ready",
  {
    total: getCases().length,
    visibles: currentCases.length
  }
);
});