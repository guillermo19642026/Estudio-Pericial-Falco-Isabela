/* =========================================================
   PORTAL INSTITUCIONAL — SISTEMA FALCO®
   Archivo: portal-institucional/js/portal-config.js

   Configuración inicial del Portal.

   Por el momento:
   - No utiliza Firebase.
   - No valida sesiones.
   - No cambia roles reales.
   - No modifica módulos existentes.

   Más adelante este archivo centralizará rutas,
   permisos, roles y configuración institucional.
========================================================= */

"use strict";


window.FALCO_PORTAL_CONFIG = {

  portal: {
    name: "Portal Institucional",
    systemName: "Sistema FALCO®",
    version: "1.0.0",
    environment: "development"
  },


  user: {
    id: null,
    name: "Isabela Falco",
    initials: "IF",
    role: "admin",
    roleLabel: "Administradora general",
    authenticated: false
  },


  roles: {

    admin: {
      label: "Administración general",
      description: "Acceso completo a los módulos del sistema."
    },

    profesional: {
      label: "Profesional",
      description:
        "Acceso a periciados, expedientes y documentación asignada."
    },

    perito: {
      label: "Perito",
      description:
        "Acceso a funciones profesionales autorizadas."
    },

    periciado: {
      label: "Periciado",
      description:
        "Acceso exclusivo a formularios y documentación propia."
    },

    alumno: {
      label: "Alumno",
      description:
        "Acceso a cursos, materiales y certificados habilitados."
    },

    biblioteca: {
      label: "Biblioteca",
      description:
        "Acceso a recursos técnicos y académicos autorizados."
    },

    institucion: {
      label: "Institución",
      description:
        "Acceso futuro a programas y proyectos institucionales."
    }

  },


  modules: {

    centroProfesional: {
      id: "centro-profesional",
      name: "Centro Profesional",
      path: "../profesional-login.html",
      enabled: true,
      roles: [
        "admin",
        "profesional",
        "perito"
      ]
    },

    periciados: {
      id: "plataforma-periciados",
      name: "Plataforma de Periciados",
      path: "../login.html",
      enabled: true,
      roles: [
        "admin",
        "profesional",
        "perito",
        "periciado"
      ]
    },

    admision: {
      id: "falco-admision",
      name: "FALCO® Admisión",
      path: "../FALCO-ADMISION/index.html",
      enabled: true,
      roles: [
        "admin",
        "profesional"
      ]
    },

    comunidad: {
      id: "falco-comunidad",
      name: "FALCO® Comunidad",
      path: "../comunidad-admin/dashboard/dashboard.html",
      enabled: true,
      roles: [
        "admin",
        "institucion"
      ]
    },

    campus: {
      id: "campus-formacion",
      name: "Campus de Formación",
      path: "../portal-cursos.html",
      enabled: true,
      roles: [
        "admin",
        "alumno",
        "profesional"
      ]
    },

    escuela: {
      id: "escuela-padres",
      name: "Escuela para Padres",
      path: "../escuela-login.html",
      enabled: true,
      roles: [
        "admin",
        "alumno"
      ]
    },

    biblioteca: {
      id: "biblioteca-falco",
      name: "Biblioteca FALCO®",
      path: "../biblioteca-login.html",
      enabled: true,
      roles: [
        "admin",
        "profesional",
        "perito",
        "alumno",
        "biblioteca"
      ]
    },

    evaluaciones: {
      id: "evaluaciones",
      name: "Evaluaciones",
      path: "../dashboard.html",
      enabled: true,
      roles: [
        "admin",
        "profesional",
        "perito"
      ]
    },

    configuracion: {
      id: "configuracion",
      name: "Configuración",
      path: null,
      enabled: false,
      roles: [
        "admin"
      ]
    }

  },


  adminAccess: {

    escuela: {
      name: "Administración Escuela",
      path: "../escuela-admin/login/login.html"
    },

   campus: {
  name: "Administración Campus",
  path: "../campus-admin/dashboard/dashboard.html"
},

    cms: {
      name: "Centro de Contenidos",
      path: "../FALCO-CMS-V2/cms-dashboard.html"
    },

    admisiones: {
      name: "Gestión de Admisiones",
      path: "../admin-admisiones.html"
    }

  },


  integrations: {

    firebaseAuthentication: false,
    firestoreRoles: false,
    routeProtection: false,
    centralizedSession: false,
    comunidadFirestore: false

  }

};


Object.freeze(
  window.FALCO_PORTAL_CONFIG.portal
);


console.info(
  "Portal FALCO®: configuración inicial cargada.",
  window.FALCO_PORTAL_CONFIG
);