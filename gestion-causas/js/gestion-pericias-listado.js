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

    const clearFiltersButton =
      document.getElementById(
        "gcClearFilters"
      );


    /* =========================================================
       ESTADO
    ========================================================= */

    let pericias = [];

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


    /* =========================================================
       RENDER
    ========================================================= */

    const renderPericias = (
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

      if (!items.length) {
        tableBody.innerHTML = "";

        emptyState.hidden =
          false;

        return;
      }

      emptyState.hidden =
        true;

      tableBody.innerHTML =
        items
          .map(
            (pericia) => `
              <tr>

                <td>

                  <div class="gc-case-name">

                    <strong>
                      ${escapeHtml(
                        pericia.caratula ||
                        "Sin carátula"
                      )}
                    </strong>

                    <span>
                      ${escapeHtml(
                        pericia.expediente ||
                        "Sin número de expediente"
                      )}
                    </span>

                  </div>

                </td>


                <td>

                  <span class="gc-badge">

                    ${escapeHtml(
                      pericia.departamentoNombre ||
                      "Sin departamento"
                    )}

                  </span>

                </td>


                <td>

                  ${escapeHtml(
                    pericia.fuero ||
                    "Sin definir"
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    getDamageLabel(
                      pericia.danioPsiquico
                    )
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    pericia.estadoGeneral ||
                    "Designada"
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    pericia.observaciones ||
                    "Sin observaciones"
                  )}

                </td>


                <td>

                  <div class="gc-table-actions">

                    <a
                      class="gc-button gc-button--small"
                      href="./ficha-causa.html?id=${encodeURIComponent(
                        pericia.id
                      )}&origen=pericias"
                    >
                      Abrir
                    </a>

                    <button
                      type="button"
                      class="gc-button gc-button--small gc-button--danger"
                      data-action="delete-pericia"
                      data-id="${escapeHtml(
                        pericia.id
                      )}"
                      data-name="${escapeHtml(
                        pericia.caratula ||
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


      const filtered =
        pericias.filter(
          (pericia) => {
            const searchableText =
              normalizeText(
                [
                  pericia.caratula,
                  pericia.expediente,
                  pericia.departamentoNombre,
                  pericia.fuero,
                  pericia.observaciones
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
              pericia.departamento ===
                departmentValue;


            const matchesCourt =
              !courtValue ||
              pericia.fuero ===
                courtValue;


            const matchesDamage =
              !damageValue ||
              pericia.danioPsiquico ===
                damageValue;


            return (
              matchesSearch &&
              matchesDepartment &&
              matchesCourt &&
              matchesDamage
            );
          }
        );


      renderPericias(
        filtered
      );
    };


    const clearFilters = () => {
      if (searchInput) {
        searchInput.value = "";
      }

      if (departmentFilter) {
        departmentFilter.value =
          "";
      }

      if (courtFilter) {
        courtFilter.value =
          "";
      }

      if (damageFilter) {
        damageFilter.value =
          "";
      }

      applyFilters();
    };


    /* =========================================================
       ELIMINAR PERICIA
    ========================================================= */

    const removePericia = async (
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
          "Firestore no está disponible para eliminar la pericia."
        );

        return;
      }


      const confirmed =
        window.confirm(
          `¿Eliminar la pericia "${nombre}"?\n\nEsta acción eliminará el registro de Pericias.`
        );


      if (!confirmed) {
        return;
      }


      try {
        await deleteDoc(
          doc(
            db,
            "gestion_pericias",
            String(id)
          )
        );


        pericias =
          pericias.filter(
            (pericia) =>
              String(
                pericia.id
              ) !==
              String(id)
          );


        applyFilters();


        console.log(
          "Pericia eliminada correctamente:",
          {
            id,
            nombre,
            total:
              pericias.length
          }
        );


      } catch (error) {
        console.error(
          "No se pudo eliminar la pericia:",
          error
        );

        window.alert(
          "No se pudo eliminar la pericia. Revise la consola."
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
            "gestion_pericias"
          )
        );


      pericias =
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
        "Gestión de Pericias FALCO® Ready",
        {
          total:
            pericias.length
        }
      );


    } catch (error) {
      console.error(
        "Error al cargar Pericias FALCO®:",
        error
      );

      pericias = [];
    }


    /* =========================================================
       EVENTOS DE FILTROS
    ========================================================= */

    [
      searchInput,
      departmentFilter,
      courtFilter,
      damageFilter
    ].forEach(
      (element) => {
        if (!element) {
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
              '[data-action="delete-pericia"]'
            );


          if (!deleteButton) {
            return;
          }


          const id =
            deleteButton.dataset.id ||
            "";


          const nombre =
            deleteButton.dataset.name ||
            "Sin carátula";


          await removePericia(
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