/*
=========================================
FALCO® CORE
Rutas centrales del ecosistema
=========================================
*/

export const ROUTES = {
  sitio: "../../index.html",

  cms: "../cms-dashboard.html",
  editor: "../editor.html",

  biblioteca: "../../biblioteca-falco.html",
  profesional: "../../area-profesional-psicologos.html",
  pericial: "../../dashboard-perito.html",
  evaluacion: "../../dashboard-periciado.html",

  metodo: "../../metodo-falco.html",
  escuela: "../../escuela-panel.html",
  programa: "../../programa-premium.html",

  loginEcosistema: "../ecosistema-falco.html"
};

export function ruta(nombre) {
  return ROUTES[nombre];
}