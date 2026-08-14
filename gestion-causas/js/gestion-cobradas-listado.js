document.addEventListener(
  "DOMContentLoaded",
  async () => {

    "use strict";


    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const tableBody =
      document.getElementById(
        "gcCasesTableBody"
      );

    const emptyState =
      document.getElementById(
        "gcCasesEmptyState"
      );

    const countElement =
      document.getElementById(
        "gcCasesCount"
      );

    const searchInput =
      document.getElementById(
        "gcSearchCases"
      );

    const departmentFilter =
      document.getElementById(
        "gcDepartmentFilter"
      );

    const courtFilter =
      document.getElementById(
        "gcCourtFilter"
      );

    const damageFilter =
      document.getElementById(
        "gcDamageFilter"
      );

    const statusFilter =
      document.getElementById(
        "gcStatusFilter"
      );

    const activityFilter =
      document.getElementById(
        "gcActivityFilter"
      );

    const clearFiltersButton =
      document.getElementById(
        "gcClearFilters"
      );


    /* =========================================================
       ESTADO
    ========================================================= */

    let cobradas = [];

    let db = null;

    let deleteDoc = null;

    let doc = null;


    /* =========================================================
       UTILIDADES
    ========================================================= */

    const normalizeText = (
      value = ""
    ) =>
      String(value)
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .toLowerCase()
        .trim();


    const escapeHtml = (
      value = ""
    ) =>
      String(value)
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


    const getDamageLabel = (
      value = ""
    ) => {

      const labels = {

        "con-danio":
          "Con daño",

        "sin-danio":
          "Sin daño",

        "sin-determinar":
          "Sin determinar"

      };

      return (
        labels[value] ||
        "Sin determinar"
      );

    };


    const getDepartmentLabel = (
      item
    ) => {

      if (
        item.departamentoNombre
      ) {
        return (
          item.departamentoNombre
        );
      }

      if (
        item.departamento ===
        "moron"
      ) {
        return "Morón";
      }

      if (
        item.departamento ===
        "la-matanza"
      ) {
        return "La Matanza";
      }

      return "Sin departamento";

    };


    /* =========================================================
       RENDER
    ========================================================= */

    const renderCobradas = (
      items
    ) => {

      if (
        !tableBody ||
        !emptyState ||
        !countElement
      ) {
        return;
      }


      countElement.textContent =
        String(
          items.length
        );


      if (
        !items.length
      ) {

        tableBody.innerHTML =
          "";

        emptyState.hidden =
          false;

        return;

      }


      emptyState.hidden =
        true;


      tableBody.innerHTML =
        items
          .map(
            (causa) => `

              <tr>

                <td>

                  <div class="gc-case-name">

                    <strong>

                      ${escapeHtml(
                        causa.caratula ||
                        "Sin carátula"
                      )}

                    </strong>

                    <span>

                      ${escapeHtml(
                        causa.expediente ||
                        "Sin número de expediente"
                      )}

                    </span>

                  </div>

                </td>


                <td>

                  <span class="gc-badge">

                    ${escapeHtml(
                      getDepartmentLabel(
                        causa
                      )
                    )}

                  </span>

                </td>


                <td>

                  ${escapeHtml(
                    causa.fuero ||
                    "Sin definir"
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    getDamageLabel(
                      causa.danioPsiquico
                    )
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    causa.estadoGeneral ||
                    "Cobrada"
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    causa.observaciones ||
                    "Sin observaciones"
                  )}

                </td>


                <td>

                  <div class="gc-table-actions">

                    <a
                      class="gc-button gc-button--small"
                      href="./ficha-causa.html?id=${encodeURIComponent(
                        causa.id
                      )}&origen=cobradas"
                    >
                      Abrir
                    </a>


                    <button
                      type="button"
                      class="gc-button gc-button--small gc-button--danger"
                      data-action="delete-cobrada"
                      data-id="${escapeHtml(
                        causa.id
                      )}"
                      data-name="${escapeHtml(
                        causa.caratula ||
                        "Sin carátula"
                      )}"
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


    /* =========================================================
       FILTROS
    ========================================================= */

    const applyFilters = () => {

      const searchValue =
        normalizeText(
          searchInput?.value
        );


      const departmentValue =
        departmentFilter?.value ||
        "";


      const courtValue =
        courtFilter?.value ||
        "";


      const damageValue =
        damageFilter?.value ||
        "";


      const statusValue =
        statusFilter?.value ||
        "";


      const activityValue =
        activityFilter?.value ||
        "";


      const filtered =
        cobradas.filter(
          (causa) => {

            const searchableText =
              normalizeText(
                [
                  causa.caratula,
                  causa.expediente,
                  causa.departamentoNombre,
                  causa.departamento,
                  causa.fuero,
                  causa.observaciones,
                  causa.anio
                ]
                  .filter(Boolean)
                  .join(" ")
              );


            const matchesSearch =
              !searchValue ||
              searchableText.includes(
                searchValue
              );


            const matchesDepartment =
              !departmentValue ||
              causa.departamento ===
                departmentValue;


            const matchesCourt =
              !courtValue ||
              causa.fuero ===
                courtValue;


            const matchesDamage =
              !damageValue ||
              causa.danioPsiquico ===
                damageValue;


            const matchesStatus =
              !statusValue ||
              causa.estadoGeneral ===
                statusValue;


            const matchesActivity =
              !activityValue ||
              (
                activityValue ===
                  "finalizada" &&
                causa.activa === false
              );


            return (
              matchesSearch &&
              matchesDepartment &&
              matchesCourt &&
              matchesDamage &&
              matchesStatus &&
              matchesActivity
            );

          }
        );


      renderCobradas(
        filtered
      );

    };


    const clearFilters = () => {

      if (
        searchInput
      ) {
        searchInput.value =
          "";
      }


      if (
        departmentFilter
      ) {
        departmentFilter.value =
          "";
      }


      if (
        courtFilter
      ) {
        courtFilter.value =
          "";
      }


      if (
        damageFilter
      ) {
        damageFilter.value =
          "";
      }


      if (
        statusFilter
      ) {
        statusFilter.value =
          "";
      }


      if (
        activityFilter
      ) {
        activityFilter.value =
          "";
      }


      applyFilters();

    };


    /* =========================================================
       ELIMINAR CAUSA COBRADA
    ========================================================= */

    const removeCobrada =
      async (
        id,
        nombre
      ) => {

        if (
          !id ||
          !db ||
          !deleteDoc ||
          !doc
        ) {

          console.error(
            "Firestore no está disponible para eliminar la causa cobrada."
          );

          return;

        }


        const confirmed =
          window.confirm(
            `¿Eliminar la causa cobrada "${nombre}"?\n\nEsta acción eliminará el registro de Causas Cobradas.`
          );


        if (
          !confirmed
        ) {
          return;
        }


        try {

          await deleteDoc(
            doc(
              db,
              "gestion_cobradas",
              String(id)
            )
          );


          cobradas =
            cobradas.filter(
              (causa) =>
                String(
                  causa.id
                ) !==
                String(id)
            );


          applyFilters();


          console.log(
            "Causa cobrada eliminada correctamente:",
            {
              id,
              nombre,
              total:
                cobradas.length
            }
          );


        } catch (
          error
        ) {

          console.error(
            "No se pudo eliminar la causa cobrada:",
            error
          );


          window.alert(
            "No se pudo eliminar la causa cobrada. Revise la consola."
          );

        }

      };


    /* =========================================================
       FIRESTORE
    ========================================================= */

    try {

      const firebaseModule =
        await import(
          "../../firebase-config.js"
        );


      const firestoreModule =
        await import(
          "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );


      db =
        firebaseModule.db;


      const {
        collection,
        getDocs
      } =
        firestoreModule;


      deleteDoc =
        firestoreModule.deleteDoc;


      doc =
        firestoreModule.doc;


      const snapshot =
        await getDocs(
          collection(
            db,
            "gestion_cobradas"
          )
        );


      cobradas =
        snapshot.docs.map(
          (
            documentSnapshot
          ) => ({
            id:
              documentSnapshot.id,

            ...documentSnapshot.data()
          })
        );


      console.log(
        "Gestión de Causas Cobradas FALCO® Ready",
        {
          total:
            cobradas.length
        }
      );


    } catch (
      error
    ) {

      console.error(
        "Error al cargar Causas Cobradas FALCO®:",
        error
      );


      cobradas = [];

    }


    /* =========================================================
       EVENTOS DE FILTROS
    ========================================================= */

    [
      searchInput,
      departmentFilter,
      courtFilter,
      damageFilter,
      statusFilter,
      activityFilter
    ]
      .forEach(
        (element) => {

          if (
            !element
          ) {
            return;
          }


          const eventName =
            element.tagName ===
            "INPUT"
              ? "input"
              : "change";


          element.addEventListener(
            eventName,
            applyFilters
          );

        }
      );


    clearFiltersButton
      ?.addEventListener(
        "click",
        clearFilters
      );


    /* =========================================================
       EVENTOS DE TABLA
    ========================================================= */

    tableBody
      ?.addEventListener(
        "click",
        async (
          event
        ) => {

          const deleteButton =
            event.target.closest(
              '[data-action="delete-cobrada"]'
            );


          if (
            !deleteButton
          ) {
            return;
          }


          const id =
            deleteButton.dataset.id ||
            "";


          const nombre =
            deleteButton.dataset.name ||
            "Sin carátula";


          await removeCobrada(
            id,
            nombre
          );

        }
      );


    /* =========================================================
       INICIO
    ========================================================= */

    applyFilters();


    document.body.classList.add(
      "is-ready"
    );

  }
);