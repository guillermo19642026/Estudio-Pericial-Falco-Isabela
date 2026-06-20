import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaAdjuntos");

async function cargarAdjuntos() {

  try {

    const q = query(
      collection(db, "documentos_periciados")
    );

    const snap = await getDocs(q);

    if (snap.empty) {

      tabla.innerHTML = `
        <tr>
          <td colspan="5">
            No existen documentos cargados.
          </td>
        </tr>
      `;

      return;
    }

    tabla.innerHTML = "";

    snap.forEach(docSnap => {

      const data = docSnap.data();

      const fecha =
        data.fechaCargaAdjuntos
          ? new Date(data.fechaCargaAdjuntos).toLocaleString("es-AR")
          : "-";

      const dniFrente = data.dniFrente?.url || "";
      const dniDorso = data.dniDorso?.url || "";

      let certificadosHtml = "-";

      if (
        data.certificados &&
        data.certificados.length > 0
      ) {

        certificadosHtml =
          data.certificados
            .map((c, i) => `
              <a
                href="${c.url}"
                target="_blank">
                Certificado ${i + 1}
              </a>
            `)
            .join("<br>");
      }

      tabla.innerHTML += `
        <tr>

          <td>${fecha}</td>

          <td>
            ${data.usuarioEmail || "-"}
          </td>

          <td>
            ${
              dniFrente
              ? `<a href="${dniFrente}" target="_blank">👁 Ver</a>`
              : "-"
            }
          </td>

          <td>
            ${
              dniDorso
              ? `<a href="${dniDorso}" target="_blank">👁 Ver</a>`
              : "-"
            }
          </td>

          <td>
            ${certificadosHtml}
          </td>

        </tr>
      `;
    });

  } catch(error) {

    console.error(error);

    tabla.innerHTML = `
      <tr>
        <td colspan="5">
          Error al cargar documentos.
        </td>
      </tr>
    `;
  }
}

cargarAdjuntos();