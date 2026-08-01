/*
=========================================
FALCO®
Portal Institucional
Accesos rápidos por rol
Versión 4.0
=========================================

Este archivo define únicamente los accesos
más frecuentes de cada rol.

No modifica:
- Firebase Authentication
- Firestore
- sesiones
- módulos principales
=========================================
*/

const WHATSAPP_SOPORTE =
  "https://wa.me/5491132049521?text=Hola.%0A%0ANecesito%20asistencia%20t%C3%A9cnica.%0A%0AM%C3%B3dulo:%20Portal%20Institucional%20FALCO%C2%AE.%0AUsuario:%20%0ARol:%20%0A%0ADetalle%20de%20la%20consulta:";

export const ACCESOS_RAPIDOS = {

  admin: [
    [
      "🏠 Sitio principal",
      "../../index.html"
    ],
    [
      "📂 Centro de contenidos",
      "../cms-dashboard.html"
    ],
    [
      "🧠 Evaluaciones",
      "../../dashboard.html"
    ],
    [
      "🏛️ Comunidad",
      "../../comunidad-admin/dashboard/dashboard.html"
    ],
    [
      "🎓 Campus",
      "../../campus-admin/dashboard/dashboard.html"
    ],
    [
      "👨‍👩‍👧 Escuela",
      "../../escuela-admin/dashboard/dashboard.html"
    ],
    [
      "📝 Admisiones",
      "../../admin-admisiones.html"
    ],
    [
      "💬 Soporte",
      WHATSAPP_SOPORTE
    ]
  ],

  profesional: [
    [
      "🏠 Sitio principal",
      "../../index.html"
    ],
    [
      "🧠 Centro profesional",
      "../../area-profesional-psicologos.html"
    ],
    [
      "📚 Biblioteca",
      "../../biblioteca-falco.html"
    ],
    [
      "🎓 Campus",
      "../../portal-cursos.html"
    ],
    [
      "💬 Soporte",
      WHATSAPP_SOPORTE
    ]
  ],

  perito: [
    [
      "🏠 Sitio principal",
      "../../index.html"
    ],
    [
      "⚖️ Gestión pericial",
      "../../dashboard-perito.html"
    ],
    [
      "🧠 Centro profesional",
      "../../area-profesional-psicologos.html"
    ],
    [
      "📚 Biblioteca",
      "../../biblioteca-falco.html"
    ],
    [
      "💬 Soporte",
      WHATSAPP_SOPORTE
    ]
  ],

  periciado: [
    [
      "🧪 Mi evaluación",
      "../../dashboard-periciado.html"
    ],
    [
      "📁 Mi documentación",
      "../../dashboard-periciado.html"
    ],
    [
      "💬 Soporte",
      WHATSAPP_SOPORTE
    ]
  ],

  alumno: [
    [
      "🎓 Mis cursos",
      "../../portal-cursos.html"
    ],
    [
      "👨‍👩‍👧 Escuela para Padres",
      "../../escuela-panel-v2.html"
    ],
    [
      "📚 Biblioteca",
      "../../biblioteca-falco.html"
    ],
    [
      "💬 Soporte",
      WHATSAPP_SOPORTE
    ]
  ],

  biblioteca: [
    [
      "📚 Biblioteca",
      "../../biblioteca-falco.html"
    ],
    [
      "📘 Método FALCO®",
      "../../metodo-falco.html"
    ],
    [
      "🏠 Sitio principal",
      "../../index.html"
    ],
    [
      "💬 Soporte",
      WHATSAPP_SOPORTE
    ]
  ]

};