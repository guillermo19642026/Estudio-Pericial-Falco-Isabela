window.GestionCausasUI = {
  renderCausasRecientes() {
    const container = document.getElementById("gcRecentCases");

    if (!container || !window.GestionCausasData) {
      return;
    }

    const causas = window.GestionCausasData.causas || [];

    container.innerHTML = causas
      .map((causa) => {
        const badgeClass =
          causa.departamento === "moron"
            ? "gc-badge--moron"
            : "gc-badge--matanza";

        const estadoClass =
          causa.estadoGeneral === "En impugnación"
            ? "gc-status--warning"
            : "gc-status--active";

        return `
          <tr>
            <td>
              <div class="gc-case-name">
                <strong>${causa.caratula}</strong>
                <span>${causa.expediente || "Sin número de expediente"}</span>
              </div>
            </td>

            <td>
              <span class="gc-badge ${badgeClass}">
                ${causa.departamentoNombre}
              </span>
            </td>

            <td>
              <span class="gc-status ${estadoClass}">
                ${causa.estadoGeneral}
              </span>
            </td>

            <td>${causa.proximoPaso || "Sin próximo paso"}</td>

            <td>
              <a
                href="./causas/ficha-causa.html?id=${encodeURIComponent(causa.id)}"
                class="gc-row-link"
              >
                Abrir
              </a>
            </td>
          </tr>
        `;
      })
      .join("");
  },

  renderVencimientos() {
    const container = document.getElementById("gcDeadlines");

    if (!container || !window.GestionCausasData) {
      return;
    }

    const vencimientos = window.GestionCausasData.vencimientos || [];

    container.innerHTML = vencimientos
      .map((vencimiento) => {
        const urgentClass = vencimiento.urgente
          ? "gc-deadline--urgent"
          : "";

        return `
          <article class="gc-deadline ${urgentClass}">
            <div class="gc-deadline__date">
              <strong>${vencimiento.dia}</strong>
              <span>${vencimiento.mes}</span>
            </div>

            <div class="gc-deadline__content">
              <strong>${vencimiento.titulo}</strong>
              <span>${vencimiento.causa}</span>
              <small>${vencimiento.detalle}</small>
            </div>
          </article>
        `;
      })
      .join("");
  },

  renderIndicadores() {
    const causas = window.GestionCausasData?.causas || [];

    const total = causas.length;
    const activas = causas.filter((causa) => causa.activa).length;
    const moron = causas.filter(
      (causa) => causa.departamento === "moron"
    ).length;
    const matanza = causas.filter(
      (causa) => causa.departamento === "la-matanza"
    ).length;

    const totalElement = document.getElementById("gcTotalCausas");
    const activasElement = document.getElementById("gcCausasActivas");
    const moronElement = document.getElementById("gcCausasMoron");
    const matanzaElement = document.getElementById("gcCausasMatanza");

    if (totalElement) totalElement.textContent = total;
    if (activasElement) activasElement.textContent = activas;
    if (moronElement) moronElement.textContent = moron;
    if (matanzaElement) matanzaElement.textContent = matanza;
  },

  renderYear() {
    const yearElement = document.getElementById("gcCurrentYear");

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
};