/* =========================================================
   AION Site Map™ v1.1
   Mapa central de navegación del Sistema FALCO®

   Función:
   - Detectar la página actual.
   - Asignar el contexto correspondiente.
   - Indicar qué archivo JSON debe utilizar AION.

   Esta versión conserva las rutas existentes
   y agrega las páginas públicas específicas.
========================================================= */

window.AIONSiteMap = {

  routes: [

    /* =====================================================
       PÁGINAS ESPECÍFICAS
       Deben aparecer antes de las rutas generales.
    ===================================================== */


    /* -----------------------------------------------------
       PROGRAMA PREMIUM
    ----------------------------------------------------- */

    {
      match: [
        "programa-premium.html",
        "programa-premium",
        "aprendiendo-a-ser-padres"
      ],

      slug: "programa-premium",
      title: "Programa Formativo Premium",
      role: "visitor"
    },


    /* -----------------------------------------------------
       SUPERVISIÓN PROFESIONAL
    ----------------------------------------------------- */

    {
      match: [
        "supervision-peritos-psicologos.html",
        "supervision-peritos-psicologos",
        "supervision-profesional",
        "supervision-pericial"
      ],

      slug: "supervision-profesional",
      title: "Supervisión para Peritos Psicólogos",
      role: "profesional"
    },


    /* -----------------------------------------------------
       MÉTODO FALCO
    ----------------------------------------------------- */

    {
      match: [
        "metodo-falco.html",
        "metodo-falco"
      ],

      slug: "metodo-falco",
      title: "Método FALCO®",
      role: "visitor"
    },


    /* -----------------------------------------------------
       FALCO EXPERIENCE
    ----------------------------------------------------- */

    {
      match: [
        "falco-experience.html",
        "falco-experience",
        "experiencia-falco"
      ],

      slug: "falco-experience",
      title: "FALCO Experience™",
      role: "visitor"
    },


    /* -----------------------------------------------------
       PERICIA PSICOLÓGICA
    ----------------------------------------------------- */

    {
      match: [
        "pericia-psicologica-buenos-aires.html",
        "pericia-psicologica-buenos-aires",
        "pericia-psicologica"
      ],

      slug: "pericia-psicologica",
      title: "Pericia Psicológica",
      role: "visitor"
    },


    /* -----------------------------------------------------
       DAÑO PSÍQUICO
    ----------------------------------------------------- */

    {
      match: [
        "danio-psiquico-buenos-aires.html",
        "danio-psiquico-buenos-aires",
        "danio-psiquico",
        "daño-psiquico"
      ],

      slug: "danio-psiquico",
      title: "Daño Psíquico",
      role: "visitor"
    },


    /* -----------------------------------------------------
       INFORME PERICIAL
    ----------------------------------------------------- */

    {
      match: [
        "informe-pericial-psicologico.html",
        "informe-pericial-psicologico",
        "informe-pericial"
      ],

      slug: "informe-pericial",
      title: "Informe Pericial Psicológico",
      role: "visitor"
    },


    /* -----------------------------------------------------
       EVALUACIÓN PSICOLÓGICA JUDICIAL
    ----------------------------------------------------- */

    {
      match: [
        "evaluacion-psicologica-judicial.html",
        "evaluacion-psicologica-judicial"
      ],

      slug: "evaluacion-judicial",
      title: "Evaluación Psicológica Judicial",
      role: "visitor"
    },


    /* -----------------------------------------------------
       PERITO DE PARTE
    ----------------------------------------------------- */

    {
      match: [
        "perito-de-parte.html",
        "perito-de-parte"
      ],

      slug: "perito-de-parte",
      title: "Perito Psicóloga de Parte",
      role: "visitor"
    },


    /* -----------------------------------------------------
       IMPUGNACIÓN DE INFORMES
    ----------------------------------------------------- */

    {
      match: [
        "impugnacion-informes-psicologicos.html",
        "impugnacion-informes-psicologicos",
        "impugnacion-pericial",
        "impugnacion-informes"
      ],

      slug: "impugnacion-informes",
      title: "Impugnación de Informes Psicológicos",
      role: "visitor"
    },


    /* -----------------------------------------------------
       TALLERES Y CURSOS
    ----------------------------------------------------- */

    {
      match: [
        "talleres-y-cursos.html",
        "talleres-cursos-psicologia-buenos-aires.html",
        "talleres-cursos-psicologia-buenos-aires"
      ],

      slug: "formacion",
      title: "Talleres y Cursos",
      role: "visitor"
    },


    /* =====================================================
       FALCO ADMISIÓN
    ===================================================== */

    {
      match: [
        "/falco-admision/",
        "falco-admision/index.html",
        "falco-admision/perfil.html",
        "falco-admision/admision.html",
        "falco-admision/confirmacion.html"
      ],

      slug: "admision",
      title: "FALCO Admisión™",
      role: "visitor"
    },


    /* =====================================================
       ESCUELA PARA PADRES
    ===================================================== */

    {
      match: [
        "escuela-para-padres.html"
      ],

      slug: "escuela",
      title: "Escuela para Padres FALCO®",
      role: "visitor"
    },

    {
      match: [
        "escuela-login.html",
        "escuela-login",
        "escuela-panel",
        "panel-alumno"
      ],

      slug: "escuela",
      title: "Escuela para Padres FALCO®",
      role: "alumno"
    },


    /* =====================================================
       BIBLIOTECA FALCO
    ===================================================== */

    {
      match: [
        "biblioteca-login.html",
        "biblioteca-login",
        "biblioteca-falco",
        "biblioteca-profesional",
        "biblioteca-panel"
      ],

      slug: "biblioteca",
      title: "Biblioteca FALCO®",
      role: "biblioteca"
    },


    /* =====================================================
       ÁREA PROFESIONAL
    ===================================================== */

    {
      match: [
        "profesional-login.html",
        "profesional-login",
        "area-profesional",
        "centro-profesional",
        "dashboard-profesional"
      ],

      slug: "area-profesional",
      title: "Área Profesional",
      role: "profesional"
    },


    /* =====================================================
       ÁREA DE PERSONAS EVALUADAS
    ===================================================== */

    {
      match: [
        "dashboard-periciado",
        "ficha-periciado",
        "ficha-integral",
        "consentimiento-informado",
        "constancia-tratamiento"
      ],

      slug: "tests",
      title: "Evaluación Psicológica",
      role: "periciado"
    },

    {
      match: [
        "scl90",
        "scl-90",
        "bsi",
        "bdi",
        "bai",
        "desesperanza",
        "tests"
      ],

      slug: "tests",
      title: "Tests psicométricos",
      role: "periciado"
    },


    /* =====================================================
       LOGIN GENERAL DE PERSONAS EVALUADAS
    ===================================================== */

    {
      match: [
        "login.html"
      ],

      slug: "tests",
      title: "Acceso a la Evaluación",
      role: "periciado"
    },


    /* =====================================================
       SECCIONES GENERALES DEL SITIO
       Se conservan las rutas originales.
    ===================================================== */

    {
      match: [
        "servicios"
      ],

      slug: "servicios",
      title: "Servicios",
      role: "visitor"
    },

    {
      match: [
        "areas",
        "áreas"
      ],

      slug: "areas",
      title: "Áreas de intervención",
      role: "visitor"
    },

    {
      match: [
        "recursos"
      ],

      slug: "recursos",
      title: "Recursos",
      role: "visitor"
    },

    {
      match: [
        "formacion",
        "cursos"
      ],

      slug: "formacion",
      title: "Formación",
      role: "visitor"
    },

    {
      match: [
        "sobre-la-perito",
        "sobre-la-licenciada"
      ],

      slug: "sobre-la-perito",
      title: "Sobre la Perito",
      role: "visitor"
    },

    {
      match: [
        "contacto",
        "consultas",
        "solicitar-turno"
      ],

      slug: "contacto",
      title: "Consultas",
      role: "visitor"
    },

    {
      match: [
        "faq",
        "preguntas-frecuentes"
      ],

      slug: "faq",
      title: "Preguntas frecuentes",
      role: "visitor"
    },


    /* =====================================================
       PÁGINA PRINCIPAL
       Debe permanecer al final.
    ===================================================== */

    {
      match: [
        "index.html",
        "/"
      ],

      slug: "general",
      title: "Sistema FALCO®",
      role: "visitor"
    }

  ],


  /* =====================================================
     NORMALIZACIÓN DE RUTA
  ===================================================== */

  normalizePath(pathname = "") {

    return decodeURIComponent(pathname)
      .toLowerCase()
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/")
      .trim();
  },


  /* =====================================================
     DETECCIÓN DE RUTA
  ===================================================== */

  detect(pathname = window.location.pathname) {

    const path = this.normalizePath(pathname);

    const route = this.routes.find(item => {

      return item.match.some(term => {

        const normalizedTerm = this.normalizePath(term);

        if (normalizedTerm === "/") {

          return (
            path === "/" ||
            path === "" ||
            path.endsWith("/index.html")
          );

        }

        return path.includes(normalizedTerm);

      });

    });


    /* -----------------------------------------------------
       RESPUESTA SEGURA
    ----------------------------------------------------- */

    if (route) {

      return {
        slug: route.slug,
        title: route.title,
        role: route.role,
        pathname: path,
        matched: true
      };

    }


    /* -----------------------------------------------------
       FALLBACK GENERAL
       Conserva el comportamiento anterior.
    ----------------------------------------------------- */

    return {
      slug: "general",
      title: "Sistema FALCO®",
      role: "visitor",
      pathname: path,
      matched: false
    };

  },


  /* =====================================================
     CONTEXTO ACTUAL
  ===================================================== */

  getCurrent() {

    return this.detect(window.location.pathname);

  },


  /* =====================================================
     UTILIDAD DE DIAGNÓSTICO
  ===================================================== */

  debug() {

    const current = this.getCurrent();

    console.group("AION Site Map™");

    console.log("Ruta:", current.pathname);
    console.log("Contexto:", current.slug);
    console.log("Título:", current.title);
    console.log("Rol:", current.role);
    console.log("Coincidencia:", current.matched);

    console.groupEnd();

    return current;

  }

};


console.log("AION Site Map™ v1.1 Ready");