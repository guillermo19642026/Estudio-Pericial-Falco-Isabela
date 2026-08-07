document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const agendaList =
    document.getElementById("gcAgendaList");

  const emptyState =
    document.getElementById("gcAgendaEmptyState");

  const resultsCount =
    document.getElementById("gcAgendaResultsCount");

  const overdueCount =
    document.getElementById("gcAgendaOverdueCount");

  const todayCount =
    document.getElementById("gcAgendaTodayCount");

  const weekCount =
    document.getElementById("gcAgendaWeekCount");

  const pendingCount =
    document.getElementById("gcAgendaPendingCount");

  const searchInput =
    document.getElementById("gcAgendaSearch");

  const departmentFilter =
    document.getElementById("gcAgendaDepartment");

  const statusFilter =
    document.getElementById("gcAgendaStatus");

  const periodFilter =
    document.getElementById("gcAgendaPeriod");

  const todayButton =
    document.getElementById("gcAgendaTodayButton");

  const clearFiltersButton =
    document.getElementById("gcAgendaClearFilters");

  let currentDeadlines = [];

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

  const toLocalDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    const date = new Date(`${dateValue}T12:00:00`);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  };

  const getToday = () => {
    const today = new Date();

    today.setHours(12, 0, 0, 0);

    return today;
  };

  const getDateKey = (date) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateValue) => {
    const date = toLocalDate(dateValue);

    if (!date) {
      return "Sin fecha";
    }

    return new Intl.DateTimeFormat("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
      .format(date)
      .replace(".", "");
  };

  const getDayNumber = (dateValue) => {
    const date = toLocalDate(dateValue);

    return date
      ? String(date.getDate()).padStart(2, "0")
      : "--";
  };

  const getMonthLabel = (dateValue) => {
    const date = toLocalDate(dateValue);

    if (!date) {
      return "SIN FECHA";
    }

    return new Intl.DateTimeFormat("es-AR", {
      month: "short",
      year: "numeric"
    })
      .format(date)
      .replace(".", "")
      .toUpperCase();
  };

  const getDifferenceInDays = (dateValue) => {
    const date = toLocalDate(dateValue);
    const today = getToday();

    if (!date) {
      return null;
    }

    return Math.round(
      (date.getTime() - today.getTime()) /
        86400000
    );
  };

  const isClosedStatus = (status = "") =>
    [
      "presentada",
      "cumplida",
      "no-corresponde"
    ].includes(status);

  const getPriority = (deadline) => {
    const difference =
      getDifferenceInDays(deadline.vencimiento);

    if (difference === null) {
      return "scheduled";
    }

    if (
      difference < 0 &&
      !isClosedStatus(deadline.estado)
    ) {
      return "overdue";
    }

    if (
      difference === 0 &&
      !isClosedStatus(deadline.estado)
    ) {
      return "today";
    }

    if (
      difference > 0 &&
      difference <= 7
    ) {
      return "upcoming";
    }

    return "scheduled";
  };

  const getPriorityLabel = (deadline) => {
    const priority = getPriority(deadline);
    const difference =
      getDifferenceInDays(deadline.vencimiento);

    if (priority === "overdue") {
      const days = Math.abs(difference);

      return days === 1
        ? "Vencido hace 1 día"
        : `Vencido hace ${days} días`;
    }

    if (priority === "today") {
      return "Vence hoy";
    }

    if (priority === "upcoming") {
      return difference === 1
        ? "Vence mañana"
        : `Vence dentro de ${difference} días`;
    }

    if (
      difference !== null &&
      difference > 7
    ) {
      return `Vence dentro de ${difference} días`;
    }

    return "Programado";
  };

  const getPriorityClass = (deadline) => {
    const priority = getPriority(deadline);

    return {
      overdue: "gc-agenda-item--overdue",
      today: "gc-agenda-item--today",
      upcoming: "gc-agenda-item--upcoming",
      scheduled: "gc-agenda-item--scheduled"
    }[priority];
  };

  const getDepartmentClass = (department) => {
    if (department === "moron") {
      return "gc-badge--moron";
    }

    if (department === "la-matanza") {
      return "gc-badge--matanza";
    }

    return "gc-status--neutral";
  };

  const getStatusLabel = (status = "") => {
    const labels = {
      pendiente: "Pendiente",
      "en-preparacion": "En preparación",
      presentada: "Presentada",
      cumplida: "Cumplida",
      vencida: "Vencida",
      "no-corresponde": "No corresponde"
    };

    return labels[status] || status || "Sin estado";
  };

  const getStatusClass = (status = "") => {
    if (
      status === "pendiente" ||
      status === "en-preparacion" ||
      status === "vencida"
    ) {
      return "gc-status--warning";
    }

    if (
      status === "presentada" ||
      status === "cumplida"
    ) {
      return "gc-status--active";
    }

    return "gc-status--neutral";
  };

  const buildDeadlines = () => {
    const cases =
      window.GestionCausasData?.getCases?.() || [];

    const deadlines = [];

    cases.forEach((causa) => {
      const actions = Array.isArray(
        causa.actuaciones
      )
        ? causa.actuaciones
        : [];

      actions.forEach((action) => {
        if (!action.vencimiento) {
          return;
        }

        deadlines.push({
          id: action.id,
          causaId: causa.id,
          caratula:
            causa.caratula || "Sin carátula",
          expediente:
            causa.expediente ||
            "Sin expediente",
          departamento:
            causa.departamento || "",
          departamentoNombre:
            causa.departamentoNombre || "",
          fuero:
            causa.fuero || "",
          actor:
            causa.actor ||
            causa.partes?.actora?.nombre ||
            "",
          demandado:
            causa.demandado ||
            causa.partes?.demandada?.nombre ||
            "",
          titulo:
            action.titulo ||
            "Actuación sin título",
          tipo:
            action.tipo || "Actuación",
          descripcion:
            action.descripcion || "",
          vencimiento:
            action.vencimiento,
          estado:
            action.estado || "pendiente",
          parte:
            action.parte || "",
          plazo:
            action.plazo || "",
          observaciones:
            action.observaciones || ""
        });
      });
    });

    return deadlines.sort((a, b) =>
      String(a.vencimiento).localeCompare(
        String(b.vencimiento)
      )
    );
  };

  const getSearchableText = (deadline) =>
    normalizeText(
      [
        deadline.caratula,
        deadline.expediente,
        deadline.titulo,
        deadline.tipo,
        deadline.descripcion,
        deadline.actor,
        deadline.demandado,
        deadline.departamentoNombre,
        deadline.fuero,
        deadline.parte,
        deadline.plazo
      ]
        .filter(Boolean)
        .join(" ")
    );

  const updateIndicators = (deadlines) => {
    const todayKey =
      getDateKey(getToday());

    const overdue = deadlines.filter(
      (deadline) =>
        getPriority(deadline) === "overdue"
    ).length;

    const today = deadlines.filter(
      (deadline) =>
        deadline.vencimiento === todayKey &&
        !isClosedStatus(deadline.estado)
    ).length;

    const week = deadlines.filter((deadline) => {
      const difference =
        getDifferenceInDays(
          deadline.vencimiento
        );

      return (
        difference !== null &&
        difference >= 0 &&
        difference <= 7 &&
        !isClosedStatus(deadline.estado)
      );
    }).length;

    const pending = deadlines.filter(
      (deadline) =>
        !isClosedStatus(deadline.estado)
    ).length;

    if (overdueCount) {
      overdueCount.textContent =
        String(overdue);
    }

    if (todayCount) {
      todayCount.textContent =
        String(today);
    }

    if (weekCount) {
      weekCount.textContent =
        String(week);
    }

    if (pendingCount) {
      pendingCount.textContent =
        String(pending);
    }
  };

  const renderAgenda = (deadlines) => {
    currentDeadlines = deadlines;

    if (
      !agendaList ||
      !emptyState ||
      !resultsCount
    ) {
      return;
    }

    resultsCount.textContent =
      String(deadlines.length);

    if (!deadlines.length) {
      agendaList.innerHTML = "";
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    agendaList.innerHTML = deadlines
      .map(
        (deadline) => `
          <article
            class="gc-agenda-item ${getPriorityClass(
              deadline
            )}"
          >

            <div class="gc-agenda-item__date">

              <strong>
                ${getDayNumber(
                  deadline.vencimiento
                )}
              </strong>

              <span>
                ${escapeHtml(
                  getMonthLabel(
                    deadline.vencimiento
                  )
                )}
              </span>

            </div>

            <div class="gc-agenda-item__content">

              <div class="gc-agenda-item__top">

                <div class="gc-agenda-item__badges">

                  <span
                    class="gc-badge ${getDepartmentClass(
                      deadline.departamento
                    )}"
                  >
                    ${escapeHtml(
                      deadline.departamentoNombre ||
                        "Sin departamento"
                    )}
                  </span>

                  <span
                    class="gc-status ${getStatusClass(
                      deadline.estado
                    )}"
                  >
                    ${escapeHtml(
                      getStatusLabel(
                        deadline.estado
                      )
                    )}
                  </span>

                </div>

                <span class="gc-agenda-item__priority">
                  ${escapeHtml(
                    getPriorityLabel(deadline)
                  )}
                </span>

              </div>

              <h4>
                ${escapeHtml(deadline.titulo)}
              </h4>

              <p class="gc-agenda-item__case">
                ${escapeHtml(
                  deadline.caratula
                )}
              </p>

              <div class="gc-agenda-item__meta">

                <span>
                  <strong>Expediente:</strong>
                  ${escapeHtml(
                    deadline.expediente
                  )}
                </span>

                <span>
                  <strong>Tipo:</strong>
                  ${escapeHtml(
                    deadline.tipo
                  )}
                </span>

                <span>
                  <strong>Vencimiento:</strong>
                  ${escapeHtml(
                    formatDate(
                      deadline.vencimiento
                    )
                  )}
                </span>

                ${
                  deadline.plazo
                    ? `
                      <span>
                        <strong>Plazo:</strong>
                        ${escapeHtml(
                          deadline.plazo
                        )}
                      </span>
                    `
                    : ""
                }

              </div>

              ${
                deadline.descripcion
                  ? `
                    <p class="gc-agenda-item__description">
                      ${escapeHtml(
                        deadline.descripcion
                      )}
                    </p>
                  `
                  : ""
              }

            </div>

            <div class="gc-agenda-item__actions">

              <a
                href="../causas/ficha-causa.html?id=${encodeURIComponent(
                  deadline.causaId
                )}"
                class="gc-button gc-button--secondary"
              >
                Abrir causa
              </a>

              <a
                href="../causas/ficha-causa.html?id=${encodeURIComponent(
                  deadline.causaId
                )}#actuaciones"
                class="gc-button gc-button--ghost"
              >
                Ver actuación
              </a>

            </div>

          </article>
        `
      )
      .join("");
  };

  const matchesPeriod = (
    deadline,
    period
  ) => {
    if (!period) {
      return true;
    }

    const difference =
      getDifferenceInDays(
        deadline.vencimiento
      );

    if (difference === null) {
      return false;
    }

    if (period === "overdue") {
      return (
        difference < 0 &&
        !isClosedStatus(deadline.estado)
      );
    }

    if (period === "today") {
      return difference === 0;
    }

    if (period === "week") {
      return (
        difference >= 0 &&
        difference <= 7
      );
    }

    if (period === "month") {
      return (
        difference >= 0 &&
        difference <= 30
      );
    }

    if (period === "future") {
      return difference > 0;
    }

    return true;
  };

  const applyFilters = () => {
    const deadlines = buildDeadlines();

    const searchValue =
      normalizeText(searchInput?.value);

    const departmentValue =
      departmentFilter?.value || "";

    const statusValue =
      statusFilter?.value || "";

    const periodValue =
      periodFilter?.value || "";

    const filtered = deadlines.filter(
      (deadline) => {
        const matchesSearch =
          !searchValue ||
          getSearchableText(
            deadline
          ).includes(searchValue);

        const matchesDepartment =
          !departmentValue ||
          deadline.departamento ===
            departmentValue;

        const matchesStatus =
          !statusValue ||
          deadline.estado ===
            statusValue;

        const periodMatches =
          matchesPeriod(
            deadline,
            periodValue
          );

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus &&
          periodMatches
        );
      }
    );

    updateIndicators(deadlines);
    renderAgenda(filtered);
  };

  const clearFilters = () => {
    if (searchInput) {
      searchInput.value = "";
    }

    if (departmentFilter) {
      departmentFilter.value = "";
    }

    if (statusFilter) {
      statusFilter.value = "";
    }

    if (periodFilter) {
      periodFilter.value = "";
    }

    applyFilters();
  };

  [
    searchInput,
    departmentFilter,
    statusFilter,
    periodFilter
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

  todayButton?.addEventListener(
    "click",
    () => {
      if (periodFilter) {
        periodFilter.value = "today";
      }

      applyFilters();
    }
  );

  clearFiltersButton?.addEventListener(
    "click",
    clearFilters
  );

  applyFilters();

  console.log(
    "Gestión de Causas FALCO® Agenda Ready",
    {
      total: buildDeadlines().length,
      visibles: currentDeadlines.length
    }
  );
});