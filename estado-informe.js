const tests = {
  scl: localStorage.getItem("scl_completado") === "true",
  bdi: localStorage.getItem("bdi_completado") === "true",
  bai: localStorage.getItem("bai_completado") === "true",
  desesperanza: localStorage.getItem("desesperanza_completado") === "true"
};

marcarEstado("estadoSCL", tests.scl);
marcarEstado("estadoBDI", tests.bdi);
marcarEstado("estadoBAI", tests.bai);
marcarEstado("estadoDesesperanza", tests.desesperanza);

const cantidad = Object.values(tests).filter(Boolean).length;

const bloqueInforme =
  document.getElementById("bloqueInformeDisponible");

if (bloqueInforme && cantidad >= 3) {
  bloqueInforme.style.display = "block";
}

function marcarEstado(id, completado) {
  const span = document.getElementById(id);

  if (!span) return;

  span.textContent = completado ? "Completado" : "Pendiente";
  span.className = completado ? "estado-completado" : "estado-pendiente";
}