/*
=========================================
FALCO®
Centro de Operaciones
Módulos por rol
Versión 3.1 - estructura por objetos
=========================================
*/

export const MODULOS = {
  admin: [
    {
      seccion: "Administración",
      items: [
        {
          titulo: "Motor de Contenidos FALCO®",
          descripcion: "Gestionar recursos, biblioteca, escritos, informes y módulos.",
          url: "../cms-dashboard.html",
          estado: "disponible"
        },
        {
          titulo: "Editor de Recursos",
          descripcion: "Crear y editar recursos profesionales antes de publicarlos.",
          url: "../editor.html",
          estado: "nuevo"
        },
        {
          titulo: "Usuarios y Permisos",
          descripcion: "Administrar accesos, perfiles y roles del ecosistema.",
          url: "../cms-dashboard.html",
          estado: "desarrollo"
        },
        {
          titulo: "Estadísticas",
          descripcion: "Consultar indicadores generales de la plataforma.",
          url: "../cms-dashboard.html",
          estado: "desarrollo"
        },
        {
          titulo: "Configuración",
          descripcion: "Ajustes generales del Ecosistema FALCO®.",
          url: "../cms-dashboard.html",
          estado: "desarrollo"
        }
      ]
    },

    {
      seccion: "Área Profesional",
      items: [
        {
          titulo: "Centro Profesional",
          descripcion: "Acceder al área técnica para psicólogos y peritos.",
          url: "../../area-profesional-psicologos.html",
          estado: "disponible"
        },
        {
          titulo: "Gestión Pericial",
          descripcion: "Acceso a evaluaciones, casos e instrumentos técnicos.",
          url: "../../dashboard-perito.html",
          estado: "disponible"
        },
        {
          titulo: "Método FALCO®",
          descripcion: "Metodología aplicada a la evaluación pericial.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        }
      ]
    },

    {
      seccion: "Biblioteca",
      items: [
        {
          titulo: "Biblioteca Profesional",
          descripcion: "Administrar y consultar recursos premium.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        }
      ]
    },

    {
      seccion: "Evaluación",
      items: [
        {
          titulo: "Plataforma de Evaluación",
          descripcion: "Tests, consentimiento informado y documentación.",
          url: "../../dashboard-periciado.html",
          estado: "disponible"
        },
        {
          titulo: "Documentación",
          descripcion: "Adjuntar DNI y documentación complementaria.",
          url: "../../dashboard-periciado.html",
          estado: "disponible"
        }
      ]
    },

    {
      seccion: "Formación",
      items: [
        {
          titulo: "Escuela para Padres",
          descripcion: "Acceso al curso asincrónico y materiales.",
          url: "../../escuela-panel.html",
          estado: "disponible"
        },
        {
          titulo: "Biblioteca del Curso",
          descripcion: "Material complementario para alumnos.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Programa Premium",
          descripcion: "Información del programa formativo.",
          url: "../../programa-premium.html",
          estado: "disponible"
        }
      ]
    },

    {
      seccion: "Sitio",
      items: [
        {
          titulo: "Sitio Institucional",
          descripcion: "Volver al sitio institucional.",
          url: "../../index.html",
          estado: "disponible"
        }
      ]
    }
  ],

  profesional: [
    {
      seccion: "Área Profesional",
      items: [
        {
          titulo: "Centro Profesional",
          descripcion: "Biblioteca, informes, escritos, cursos y recursos técnicos.",
          url: "../../area-profesional-psicologos.html",
          estado: "disponible"
        },
        {
          titulo: "Biblioteca Profesional",
          descripcion: "Acceso a recursos y materiales profesionales.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Método FALCO®",
          descripcion: "Consultar la metodología de trabajo pericial.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Sitio Institucional",
          descripcion: "Volver al sitio institucional.",
          url: "../../index.html",
          estado: "disponible"
        }
      ]
    }
  ],

  perito: [
    {
      seccion: "Área Pericial",
      items: [
        {
          titulo: "Gestión Pericial",
          descripcion: "Acceso a evaluaciones, casos e instrumentos técnicos.",
          url: "../../dashboard-perito.html",
          estado: "disponible"
        },
        {
          titulo: "Centro Profesional",
          descripcion: "Recursos técnicos, informes, escritos y herramientas.",
          url: "../../area-profesional-psicologos.html",
          estado: "disponible"
        },
        {
          titulo: "Biblioteca Profesional",
          descripcion: "Materiales, modelos y documentos profesionales.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Método FALCO®",
          descripcion: "Metodología aplicada a la evaluación pericial.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Sitio Institucional",
          descripcion: "Volver al sitio institucional.",
          url: "../../index.html",
          estado: "disponible"
        }
      ]
    }
  ],

  periciado: [
    {
      seccion: "Evaluación",
      items: [
        {
          titulo: "Plataforma de Evaluación",
          descripcion: "Completar tests, consentimiento informado y documentación.",
          url: "../../dashboard-periciado.html",
          estado: "disponible"
        },
        {
          titulo: "Documentación",
          descripcion: "Adjuntar DNI y documentación complementaria.",
          url: "../../dashboard-periciado.html",
          estado: "disponible"
        }
      ]
    }
  ],

  alumno: [
    {
      seccion: "Formación",
      items: [
        {
          titulo: "Escuela para Padres",
          descripcion: "Continuar el curso asincrónico y ver materiales.",
          url: "../../escuela-panel.html",
          estado: "disponible"
        },
        {
          titulo: "Biblioteca del Curso",
          descripcion: "Acceder a materiales complementarios.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Programa Premium",
          descripcion: "Consultar información del programa formativo.",
          url: "../../programa-premium.html",
          estado: "disponible"
        },
        {
          titulo: "Sitio Institucional",
          descripcion: "Volver al sitio institucional.",
          url: "../../index.html",
          estado: "disponible"
        }
      ]
    }
  ],

  biblioteca: [
    {
      seccion: "Biblioteca",
      items: [
        {
          titulo: "Biblioteca Profesional",
          descripcion: "Acceder a recursos, escritos, modelos y materiales.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Método FALCO®",
          descripcion: "Consultar materiales vinculados al método.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        },
        {
          titulo: "Sitio Institucional",
          descripcion: "Volver al sitio institucional.",
          url: "../../index.html",
          estado: "disponible"
        }
      ]
    }
  ]
};