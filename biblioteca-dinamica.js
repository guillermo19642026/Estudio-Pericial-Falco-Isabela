import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("🔥 JS biblioteca cargado");

// 🔥 ejecución inmediata pero segura
setTimeout(async () => {

  console.log("🔥 INICIO BIBLIOTECA");

  const container = document.getElementById("biblioteca-container");

  console.log("📦 container:", container);

  if (!container) {
    console.log("❌ ERROR: container no encontrado en DOM final");
    return;
  }

  try {

    const snap = await getDocs(collection(db, "contenidos"));

    console.log("📡 snap size:", snap.size);

    const datos = snap.docs.map(doc => doc.data());

    container.innerHTML = "";

    datos.forEach(item => {

      if (item.modulo === "biblioteca") {

        const card = document.createElement("div");
      card.className = "recurso-card";

    

       card.innerHTML = `
  <h3>📄 ${item.titulo}</h3>

  <p class="bloque-tests-texto">
    <strong>Categoría:</strong> ${item.categoria || "General"}
  </p>

  <p class="bloque-tests-nota">
    ${item.tags || ""}
  </p>

  <div class="recurso-footer">

    <span class="badge-bloqueado">
      📚 Biblioteca Profesional
    </span>

    <a
      href="${item.url}"
      target="_blank"
      class="btn-acceso-mini"
    >
      Ver documento
    </a>

  </div>
`;

        container.appendChild(card);
      }

    });

  } catch (error) {
    console.error("❌ ERROR FIRESTORE:", error);
  }

}, 500);