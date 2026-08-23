/*
=========================================
FALCO®
Portal Institucional
Módulos por rol
Versión 4.0 · Centro de Operaciones V2
=========================================

Este archivo define qué módulos se muestran
a cada rol dentro del Portal Institucional.

V2:
- Simplifica únicamente la vista ADMIN.
- Conserva los accesos de los demás roles.
- No modifica Firebase Authentication.
- No modifica Firestore.
- No modifica sesiones ni usuarios.
- No modifica la lógica de renderizado.
=========================================
*/

export const MODULOS = {

  /* =====================================================
     ADMIN
  ===================================================== */

  admin: [

    /* ===================================================
       ADMINISTRACIÓN GENERAL
    =================================================== */

    {
      seccion: "Administración general",
      items: [

        {
          titulo: "Motor de Contenidos FALCO®",
          descripcion:
            "Gestionar contenidos, publicaciones, biblioteca, recursos y materiales institucionales.",
          url: "../cms-dashboard.html",
          estado: "disponible"
        },

        {
          titulo: "Usuarios y Permisos",
          descripcion:
            "Administrar usuarios, perfiles, roles, estados y accesos del Sistema FALCO®.",
          url: "../usuarios-permisos/usuarios.html",
          estado: "disponible"
        },

        {
          titulo: "Solicitudes de Acceso",
          descripcion:
            "Revisar y gestionar solicitudes de nuevos usuarios y accesos al Sistema FALCO®.",
          url: "solicitudes-acceso.html",
          estado: "nuevo"
        }

      ]
    },


    /* ===================================================
       ÁREA PERICIAL Y PROFESIONAL
    =================================================== */

 {
  seccion: "Área pericial y profesional",
  items: [

    {
      titulo: "Centro Profesional",
      descripcion:
        "Acceder al área técnica destinada a psicólogos, peritos y profesionales.",
      url: "../../area-profesional-psicologos.html",
      estado: "disponible"
    },

    {
      titulo: "Gestión Pericial",
      descripcion:
        "Gestionar evaluaciones, casos, instrumentos y procesos periciales.",
      url: "../../dashboard-perito.html",
      estado: "disponible"
    },

    {
      titulo: "Centro de Evaluaciones",
      descripcion:
        "Administrar instrumentos psicológicos, documentación y resultados almacenados.",
      url: "../../dashboard.html",
      estado: "disponible"
    },

    {
      titulo: "Plataforma de Periciados",
      descripcion:
        "Acceder directamente a fichas, tests, consentimientos y documentación de periciados.",
      url: "../../dashboard-periciado.html",
      estado: "disponible"
    },

    {
  titulo: "Documentación Integral del Periciado",
  descripcion:
    "Consultar consentimientos informados, constancias de tratamiento y fichas integrales completadas por los periciados.",
  url: "../../admin-documentos.html",
  estado: "disponible"
},


    {
      titulo: "Resultados de Evaluaciones",
      descripcion:
        "Consultar y administrar los resultados psicológicos registrados.",
      url: "../../admin-resultados.html",
      estado: "disponible"
    },

    {
      titulo: "Documentación de Periciados",
      descripcion:
        "Consultar DNI, archivos complementarios y documentación adjunta.",
      url: "../../admin-adjuntos-periciados.html",
      estado: "disponible"
    },

    {
      titulo: "Mesa de Entrada",
      descripcion:
        "Recepcionar y gestionar documentación, presentaciones y trámites.",
      url: "../../panel-mesa-entrada.html",
      estado: "disponible"
    },

    {
      titulo: "Asistencia Profesional",
      descripcion:
        "Gestionar solicitudes de asistencia profesional, documentación recibida, presupuestos y seguimiento.",
      url: "asistencia-profesional.html",
      estado: "nuevo"
    },

    {
      titulo: "Document Engine FALCO®",
      descripcion:
        "Acceder al sistema de expedientes y construcción documental profesional.",
      url: "../../FALCO-DOCUMENT-ENGINE/FALCO-PROFESIONAL/index.html",
      estado: "nuevo"
    }

  ]
},


    /* ===================================================
       ADMISIÓN
    =================================================== */

    {
      seccion: "Admisión",
      items: [

        {
          titulo: "FALCO® Admisión",
          descripcion:
            "Acceder al sistema institucional de admisión de profesionales y postulantes.",
          url: "../../FALCO-ADMISION/index.html",
          estado: "disponible"
        },

        {
          titulo: "Gestión de Admisiones",
          descripcion:
            "Consultar solicitudes, perfiles y documentación recibida.",
          url: "../../admin-admisiones.html",
          estado: "disponible"
        },

        {
          titulo: "Postulaciones Profesionales",
          descripcion:
            "Consultar antecedentes y postulaciones profesionales recibidas.",
          url: "../../panel-postulaciones.html",
          estado: "disponible"
        }

      ]
    },


    /* ===================================================
       COMUNIDAD
    =================================================== */

    {
      seccion: "Comunidad",
      items: [

        {
          titulo: "FALCO® Comunidad",
          descripcion:
            "Acceder al sitio institucional de programas y propuestas para organizaciones.",
          url: "../../FALCO-COMUNIDAD/index.html",
          estado: "nuevo"
        },

        {
          titulo: "Gestión de Comunidad",
          descripcion:
            "Administrar solicitudes, instituciones, reuniones, proyectos, programas y agenda.",
          url: "../../comunidad-admin/dashboard/dashboard.html",
          estado: "nuevo"
        }

      ]
    },


    /* ===================================================
       FORMACIÓN
    =================================================== */

    {
      seccion: "Formación",
      items: [

        {
          titulo: "Campus de Formación",
          descripcion:
            "Acceder al portal general de cursos y recorridos académicos.",
          url: "../../portal-cursos.html",
          estado: "nuevo"
        },

        {
          titulo: "Gestión de Campus",
          descripcion:
            "Administrar cursos, propuestas formativas y configuración académica.",
          url: "../../campus-admin/dashboard/dashboard.html",
          estado: "nuevo"
        },

        {
          titulo: "Escuela para Padres",
          descripcion:
            "Acceder al programa de orientación familiar y sus ocho encuentros.",
          url: "../../escuela-panel-v2.html",
          estado: "disponible"
        },

        {
          titulo: "Gestión de Escuela",
          descripcion:
            "Administrar participantes, altas, encuentros, certificados y configuración.",
          url: "../../escuela-admin/dashboard/dashboard.html",
          estado: "disponible"
        }

      ]
    },


    /* ===================================================
       BIBLIOTECA
    =================================================== */

    {
      seccion: "Biblioteca",
      items: [

        {
          titulo: "Biblioteca FALCO®",
          descripcion:
            "Acceder a escritos, modelos, manuales, guías y recursos profesionales.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Gestión de Biblioteca",
          descripcion:
            "Administrar recursos, categorías, contenidos y publicaciones de Biblioteca FALCO®.",
          url: "../biblioteca.html",
          estado: "disponible"
        }

      ]
    },


    /* ===================================================
       SITIO INSTITUCIONAL
    =================================================== */

    {
      seccion: "Sitio institucional",
      items: [

        {
          titulo: "Página Principal",
          descripcion:
            "Volver al sitio público principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        },

        {
          titulo: "Ecosistema FALCO®",
          descripcion:
            "Acceder a la presentación pública y al acceso institucional del Sistema FALCO®.",
          url: "../ecosistema-falco.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     PROFESIONAL
  ===================================================== */

  profesional: [

    {
      seccion: "Área profesional",
      items: [

        {
          titulo: "Centro Profesional",
          descripcion:
            "Acceder a recursos técnicos, informes, escritos y herramientas profesionales.",
          url: "../../area-profesional-psicologos.html",
          estado: "disponible"
        },

        {
          titulo: "Biblioteca Profesional",
          descripcion:
            "Acceder a recursos, modelos y materiales profesionales habilitados.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Método FALCO®",
          descripcion:
            "Consultar la metodología aplicada al trabajo psicológico pericial.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Campus de Formación",
          descripcion:
            "Acceder a cursos y propuestas de formación profesional habilitadas.",
          url: "../../portal-cursos.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Periciados y evaluaciones",
      items: [

        {
          titulo: "Gestión de Periciados",
          descripcion:
            "Consultar periciados asignados, evaluaciones psicológicas, expedientes, fichas y documentación asociada.",
          url: "../../dashboard.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Sitio institucional",
      items: [

        {
          titulo: "Sitio Institucional",
          descripcion:
            "Volver al sitio principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     PERITO
  ===================================================== */

  perito: [

    {
      seccion: "Área pericial",
      items: [

        {
          titulo: "Gestión Pericial",
          descripcion:
            "Acceder a casos, periciados asignados, evaluaciones, instrumentos técnicos y documentación asociada.",
          url: "../../dashboard-perito.html",
          estado: "disponible"
        },

        {
          titulo: "Centro Profesional",
          descripcion:
            "Acceder a informes, escritos, recursos y herramientas técnicas.",
          url: "../../area-profesional-psicologos.html",
          estado: "disponible"
        },

        {
          titulo: "Biblioteca Profesional",
          descripcion:
            "Consultar materiales, modelos y documentos profesionales.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Método FALCO®",
          descripcion:
            "Consultar la metodología aplicada a la evaluación psicológica pericial.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Formación",
      items: [

        {
          titulo: "Campus de Formación",
          descripcion:
            "Acceder a cursos y propuestas de formación profesional habilitadas.",
          url: "../../portal-cursos.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Sitio institucional",
      items: [

        {
          titulo: "Sitio Institucional",
          descripcion:
            "Volver al sitio principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     PERICIADO
  ===================================================== */

  periciado: [

    {
      seccion: "Mi evaluación",
      items: [

        {
          titulo: "Plataforma de Evaluación",
          descripcion:
            "Completar instrumentos, consentimiento, constancias, documentación y ficha personal.",
          url: "../../dashboard-periciado.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     ALUMNO
  ===================================================== */

  alumno: [

    {
      seccion: "Mi formación",
      items: [

        {
          titulo: "Campus de Formación",
          descripcion:
            "Acceder a los cursos habilitados y continuar el recorrido académico.",
          url: "../../portal-cursos.html",
          estado: "disponible"
        },

        {
          titulo: "Escuela para Padres",
          descripcion:
            "Continuar el programa de orientación familiar y acceder a sus encuentros.",
          url: "../../escuela-panel-v2.html",
          estado: "disponible"
        },

        {
          titulo: "Biblioteca del Curso",
          descripcion:
            "Consultar materiales y recursos complementarios habilitados.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Programa Premium",
          descripcion:
            "Consultar información sobre la propuesta formativa premium.",
          url: "../../programa-premium.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Sitio institucional",
      items: [

        {
          titulo: "Sitio Institucional",
          descripcion:
            "Volver al sitio principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     GESTIÓN ACADÉMICA
  ===================================================== */

  gestion_academica: [

    {
      seccion: "Centro Académico",
      items: [

        {
          titulo: "Campus de Formación",
          descripcion:
            "Acceder al portal general de cursos y recorridos académicos.",
          url: "../../portal-cursos.html",
          estado: "nuevo"
        },

        {
          titulo: "Administración Campus",
          descripcion:
            "Gestionar cursos, propuestas formativas y configuración académica.",
          url: "../../campus-admin/dashboard/dashboard.html",
          estado: "nuevo"
        },

        {
          titulo: "Escuela para Padres",
          descripcion:
            "Acceder al programa de orientación familiar y sus ocho encuentros.",
          url: "../../escuela-panel-v2.html",
          estado: "disponible"
        },

        {
          titulo: "Administración Escuela",
          descripcion:
            "Gestionar participantes, encuentros, certificados y configuración.",
          url: "../../escuela-admin/dashboard/dashboard.html",
          estado: "disponible"
        },

        {
          titulo: "Participantes Escuela",
          descripcion:
            "Consultar y administrar los participantes registrados.",
          url: "../../escuela-admin/participantes/participantes.html",
          estado: "disponible"
        },

        {
          titulo: "Alta de Participantes",
          descripcion:
            "Registrar nuevos participantes en Escuela para Padres FALCO®.",
          url: "../../escuela-admin/alta/alta-participante.html",
          estado: "disponible"
        },

        {
          titulo: "Certificados",
          descripcion:
            "Gestionar certificados y constancias académicas.",
          url: "../../escuela-admin/certificados/certificados.html",
          estado: "disponible"
        },

        {
          titulo: "Programa Premium",
          descripcion:
            "Consultar la propuesta formativa premium del Sistema FALCO®.",
          url: "../../programa-premium.html",
          estado: "disponible"
        },

        {
          titulo: "Biblioteca FALCO®",
          descripcion:
            "Acceder a recursos y materiales académicos disponibles.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Sitio institucional",
      items: [

        {
          titulo: "Sitio Institucional",
          descripcion:
            "Volver al sitio principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     SECRETARÍA ADMINISTRATIVA
  ===================================================== */

  secretaria: [

    {
      seccion: "Gestión administrativa",
      items: [

        {
          titulo: "Mesa de Entrada",
          descripcion:
            "Recepcionar y organizar documentación, presentaciones y trámites administrativos.",
          url: "../../panel-mesa-entrada.html",
          estado: "disponible"
        },

        {
          titulo: "Documentación de Periciados",
          descripcion:
            "Consultar documentación adjunta, DNI y archivos complementarios registrados.",
          url: "../../admin-adjuntos-periciados.html",
          estado: "disponible"
        },

        {
          titulo: "Gestión de Admisiones",
          descripcion:
            "Consultar solicitudes, perfiles y documentación recibida.",
          url: "../../admin-admisiones.html",
          estado: "disponible"
        },

        {
          titulo: "Postulaciones Profesionales",
          descripcion:
            "Consultar antecedentes y postulaciones profesionales registradas.",
          url: "../../panel-postulaciones.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Formación y participantes",
      items: [

        {
          titulo: "Administración Campus",
          descripcion:
            "Gestionar cursos, propuestas formativas y configuración académica.",
          url: "../../campus-admin/dashboard/dashboard.html",
          estado: "nuevo"
        },

        {
          titulo: "Administración Escuela",
          descripcion:
            "Gestionar participantes, encuentros, certificados y configuración.",
          url: "../../escuela-admin/dashboard/dashboard.html",
          estado: "disponible"
        },

        {
          titulo: "Participantes Escuela",
          descripcion:
            "Consultar y administrar los participantes registrados.",
          url: "../../escuela-admin/participantes/participantes.html",
          estado: "disponible"
        },

        {
          titulo: "Alta de Participantes",
          descripcion:
            "Registrar nuevos participantes en Escuela para Padres FALCO®.",
          url: "../../escuela-admin/alta/alta-participante.html",
          estado: "disponible"
        },

        {
          titulo: "Certificados",
          descripcion:
            "Gestionar certificados y constancias académicas.",
          url: "../../escuela-admin/certificados/certificados.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Comunidad y agenda",
      items: [

        {
          titulo: "Solicitudes Institucionales",
          descripcion:
            "Consultar y organizar solicitudes recibidas desde FALCO® Comunidad.",
          url: "../../comunidad-admin/solicitudes/solicitudes.html",
          estado: "disponible"
        },

        {
          titulo: "Instituciones",
          descripcion:
            "Consultar y actualizar instituciones vinculadas al Sistema FALCO®.",
          url: "../../comunidad-admin/instituciones/instituciones.html",
          estado: "disponible"
        },

        {
          titulo: "Agenda Comunidad",
          descripcion:
            "Consultar y administrar actividades, eventos y compromisos institucionales.",
          url: "../../comunidad-admin/agenda/agenda.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Recursos y sitio institucional",
      items: [

        {
          titulo: "Biblioteca FALCO®",
          descripcion:
            "Acceder a recursos y materiales institucionales autorizados.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Sitio Institucional",
          descripcion:
            "Volver al sitio principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        }

      ]
    }

  ],


  /* =====================================================
     BIBLIOTECA
  ===================================================== */

  biblioteca: [

    {
      seccion: "Biblioteca",
      items: [

        {
          titulo: "Biblioteca Profesional",
          descripcion:
            "Acceder a recursos, escritos, modelos y materiales habilitados.",
          url: "../../biblioteca-falco.html",
          estado: "disponible"
        },

        {
          titulo: "Método FALCO®",
          descripcion:
            "Consultar materiales vinculados con la metodología FALCO®.",
          url: "../../metodo-falco.html",
          estado: "disponible"
        }

      ]
    },


    {
      seccion: "Sitio institucional",
      items: [

        {
          titulo: "Sitio Institucional",
          descripcion:
            "Volver al sitio principal del Sistema FALCO®.",
          url: "../../index.html",
          estado: "disponible"
        }

      ]
    }

  ]

};