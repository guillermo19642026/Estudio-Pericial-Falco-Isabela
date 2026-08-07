document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const tableBody =
    document.getElementById("gcFeesTableBody");

  const emptyState =
    document.getElementById("gcFeesEmptyState");

  const resultsCount =
    document.getElementById("gcFeesResultsCount");

  const totalRegulated =
    document.getElementById("gcFeesTotalRegulated");

  const totalCollected =
    document.getElementById("gcFeesTotalCollected");

  const pendingBalance =
    document.getElementById("gcFeesPendingBalance");

  const casesCount =
    document.getElementById("gcFeesCasesCount");

  const searchInput =
    document.getElementById("gcFeesSearch");

  const departmentFilter =
    document.getElementById("gcFeesDepartment");

  const typeFilter =
    document.getElementById("gcFeesType");

  const statusFilter =
    document.getElementById("gcFeesStatus");

  const clearFiltersButton =
    document.getElementById("gcFeesClearFilters");

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

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(Number(amount || 0));

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Sin fecha";
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

  const getTypeLabel = (type = "") => {
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

  const getStatusLabel = (status = "") => {
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

  const getStatusClass = (status = "") => {
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

  const getDepartmentClass = (department = "") => {
    if (department === "moron") {
      return "gc-badge--moron";
    }

    if (department === "la-matanza") {
      return "gc-badge--matanza";
    }

    return "gc-status--neutral";
  };

  const buildMovements = () => {
    const cases =
      window.GestionCausasData?.getCases?.() || [];

    const movements = [];

    cases.forEach((causa) => {
      const fees = Array.isArray(causa.honorarios)
        ? causa.honorarios
        : [];

      fees.forEach((movement) => {
        movements.push({
          ...movement,

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

          actor:
            causa.actor ||
            causa.partes?.actora?.nombre ||
            "",

          demandado:
            causa.demandado ||
            causa.partes?.demandada?.nombre ||
            ""
        });
      });
    });

    return movements.sort((a, b) =>
      String(b.fecha || "").localeCompare(
        String(a.fecha || "")
      )
    );
  };

  const getSearchableText = (movement) =>
    normalizeText(
      [
        movement.caratula,
        movement.expediente,
        movement.tipo,
        getTypeLabel(movement.tipo),
        movement.estado,
        getStatusLabel(movement.estado),
        movement.parteObligada,
        movement.descripcion,
        movement.observaciones,
        movement.actor,
        movement.demandado,
        movement.departamentoNombre
      ]
        .filter(Boolean)
        .join(" ")
    );

  const getRegulatedAmount = (movements) =>
    movements
      .filter((movement) =>
        [
          "regulacion",
          "pago-parcial",
          "pago-total"
        ].includes(movement.tipo)
      )
      .reduce(
        (sum, movement) =>
          sum + Number(movement.monto || 0),
        0
      );

  const getCollectedAmount = (movements) =>
    movements
      .filter(
        (movement) =>
          movement.tipo === "pago-parcial" ||
          movement.tipo === "pago-total" ||
          movement.estado === "cobrado" ||
          movement.estado === "pagado"
      )
      .reduce(
        (sum, movement) =>
          sum + Number(movement.monto || 0),
        0
      );

  const updateIndicators = (movements) => {
    const regulated =
      getRegulatedAmount(movements);

    const collected =
      getCollectedAmount(movements);

    const pending =
      Math.max(regulated - collected, 0);

    const uniqueCases =
      new Set(
        movements.map(
          (movement) => movement.causaId
        )
      ).size;

    if (totalRegulated) {
      totalRegulated.textContent =
        formatCurrency(regulated);
    }

    if (totalCollected) {
      totalCollected.textContent =
        formatCurrency(collected);
    }

    if (pendingBalance) {
      pendingBalance.textContent =
        formatCurrency(pending);
    }

    if (casesCount) {
      casesCount.textContent =
        String(uniqueCases);
    }
  };

  const renderMovements = (movements) => {
    if (
      !tableBody ||
      !emptyState ||
      !resultsCount
    ) {
      return;
    }

    resultsCount.textContent =
      String(movements.length);

    if (!movements.length) {
      tableBody.innerHTML = "";
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    tableBody.innerHTML = movements
      .map(
        (movement) => `
          <tr>

            <td>
              <div class="gc-case-name">

                <strong>
                  ${escapeHtml(
                    movement.caratula
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    movement.expediente
                  )}
                </span>

              </div>
            </td>

            <td>
              <span
                class="gc-badge ${getDepartmentClass(
                  movement.departamento
                )}"
              >
                ${escapeHtml(
                  movement.departamentoNombre ||
                    "Sin departamento"
                )}
              </span>
            </td>

            <td>
              <span class="gc-table-value">
                ${escapeHtml(
                  getTypeLabel(
                    movement.tipo
                  )
                )}
              </span>
            </td>

            <td>
              <span class="gc-table-value">
                ${escapeHtml(
                  formatDate(
                    movement.fecha
                  )
                )}
              </span>
            </td>

            <td>
              <strong class="gc-fee-amount">
                ${escapeHtml(
                  formatCurrency(
                    movement.monto
                  )
                )}
              </strong>
            </td>

            <td>
              <span
                class="gc-status ${getStatusClass(
                  movement.estado
                )}"
              >
                ${escapeHtml(
                  getStatusLabel(
                    movement.estado
                  )
                )}
              </span>
            </td>

            <td>
              <span class="gc-table-value">
                ${escapeHtml(
                  movement.parteObligada ||
                    "Sin especificar"
                )}
              </span>
            </td>

            <td>
              <a
                href="../causas/ficha-causa.html?id=${encodeURIComponent(
                  movement.causaId
                )}"
                class="gc-row-link"
              >
                Abrir
              </a>
            </td>

          </tr>
        `
      )
      .join("");
  };

  const applyFilters = () => {
    const movements = buildMovements();

    const searchValue =
      normalizeText(searchInput?.value);

    const departmentValue =
      departmentFilter?.value || "";

    const typeValue =
      typeFilter?.value || "";

    const statusValue =
      statusFilter?.value || "";

    const filtered = movements.filter(
      (movement) => {
        const matchesSearch =
          !searchValue ||
          getSearchableText(
            movement
          ).includes(searchValue);

        const matchesDepartment =
          !departmentValue ||
          movement.departamento ===
            departmentValue;

        const matchesType =
          !typeValue ||
          movement.tipo === typeValue;

        const matchesStatus =
          !statusValue ||
          movement.estado === statusValue;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesType &&
          matchesStatus
        );
      }
    );

    updateIndicators(movements);
    renderMovements(filtered);
  };

  const clearFilters = () => {
    if (searchInput) {
      searchInput.value = "";
    }

    if (departmentFilter) {
      departmentFilter.value = "";
    }

    if (typeFilter) {
      typeFilter.value = "";
    }

    if (statusFilter) {
      statusFilter.value = "";
    }

    applyFilters();
  };

  [
    searchInput,
    departmentFilter,
    typeFilter,
    statusFilter
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

  applyFilters();

  console.log(
    "Gestión de Causas FALCO® Honorarios Ready",
    {
      total: buildMovements().length
    }
  );
});