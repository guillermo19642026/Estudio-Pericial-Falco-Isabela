/*
=========================================
FALCO®
Centro de Operaciones
Accesos rápidos por rol
=========================================
*/

const WHATSAPP_SOPORTE =
  "https://wa.me/5491132049521?text=Hola.%0A%0ANecesito%20asistencia%20t%C3%A9cnica.%0A%0AM%C3%B3dulo:%20Centro%20de%20Operaciones%20FALCO%C2%AE.%0AUsuario:%20%0ARol:%20%0A%0ADetalle%20de%20la%20consulta:";

export const ACCESOS_RAPIDOS = {
  admin: [
    ["🏠 Sitio principal", "../../index.html"],
    ["📂 CMS", "../cms-dashboard.html"],
    ["📚 Biblioteca", "../../biblioteca-falco.html"],
    ["🧠 Área profesional", "../../area-profesional-psicologos.html"],
    ["🎓 Escuela", "../../escuela-panel.html"],
    ["💬 Soporte", WHATSAPP_SOPORTE]
  ],

  profesional: [
    ["🏠 Sitio principal", "../../index.html"],
    ["📚 Biblioteca", "../../biblioteca-falco.html"],
    ["🧠 Área profesional", "../../area-profesional-psicologos.html"],
    ["💬 Soporte", WHATSAPP_SOPORTE]
  ],

  perito: [
    ["🏠 Sitio principal", "../../index.html"],
    ["🧠 Gestión pericial", "../../dashboard-perito.html"],
    ["📚 Biblioteca", "../../biblioteca-falco.html"],
    ["💬 Soporte", WHATSAPP_SOPORTE]
  ],

  periciado: [
    ["🧪 Mi evaluación", "../../dashboard-periciado.html"],
    ["📁 Documentación", "../../dashboard-periciado.html"],
    ["💬 Soporte", WHATSAPP_SOPORTE]
  ],

  alumno: [
    ["🎓 Mi curso", "../../escuela-panel.html"],
    ["📚 Biblioteca", "../../biblioteca-falco.html"],
    ["💬 Soporte", WHATSAPP_SOPORTE]
  ],

  biblioteca: [
    ["📚 Biblioteca", "../../biblioteca-falco.html"],
    ["🏠 Sitio principal", "../../index.html"],
    ["💬 Soporte", WHATSAPP_SOPORTE]
  ]
};