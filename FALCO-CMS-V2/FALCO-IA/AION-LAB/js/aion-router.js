/* =========================================================
   AION Router™ v1.2
   Director de contexto para Sistema FALCO®
   + Integración segura con AION Site Map™
========================================================= */

class AIONRouter {
  constructor() {
    this.path = window.location.pathname.toLowerCase();
    this.title = document.title || "";
  }

  getContext() {
    const page = this.detectPage();

    return {
      page: page.slug,
      title: page.title,
      knowledge: page.knowledge,
      greeting: page.greeting,
      role: page.role || "visitor",
      primaryAction: page.primaryAction || "orientar"
    };
  }

  detectPage() {
    /*
     * Las páginas específicas se mantienen exactamente
     * como estaban para no modificar lo que ya funciona.
     */

    if (this.isHome()) {
      return {
        slug: "home",
        title: "Sistema FALCO®",
        knowledge: "general",
        greeting:
          "Bienvenido al Sistema FALCO®. Puedo orientarte según lo que necesites.",
        primaryAction: "orientar"
      };
    }

    if (this.path.includes("ecosistema-falco")) {
      return {
        slug: "ecosistema-falco",
        title: "Ecosistema FALCO®",
        knowledge: "ecosistema-falco",
        greeting:
          "Bienvenido al Ecosistema FALCO®. Puedo orientarte hacia el acceso correspondiente según tu perfil.",
        primaryAction: "orientar"
      };
    }

    if (this.path.includes("cms-dashboard")) {
      return {
        slug: "cms-dashboard",
        title: "FALCO CMS®",
        knowledge: "cms-dashboard",
        greeting:
          "Estás en el panel de gestión de contenidos del Sistema FALCO®.",
        role: "admin",
        primaryAction: "gestionar"
      };
    }

    if (this.path.includes("adolescencia-hoy")) {
      return {
        slug: "adolescencia-hoy",
        title: "Adolescencia Hoy",
        knowledge: "adolescencia-hoy",
        greeting:
          "Estás consultando contenidos sobre adolescencia. Puedo orientarte sobre los principales temas abordados.",
        role: "familia",
        primaryAction: "informar"
      };
    }

    if (this.path.includes("cuanto-tarda-pericia-psicologica")) {
      return {
        slug: "cuanto-tarda-pericia-psicologica",
        title: "Tiempos de una Pericia Psicológica",
        knowledge: "cuanto-tarda-pericia-psicologica",
        greeting:
          "Puedo orientarte sobre la duración aproximada y las etapas de una evaluación pericial psicológica.",
        primaryAction: "informar"
      };
    }

    if (
      this.path.includes(
        "evaluacion-psicologica-judicial-buenos-aires"
      ) ||
      this.path.includes("evaluacion-psicologica-judicial")
    ) {
      return {
        slug: "evaluacion-psicologica-judicial-buenos-aires",
        title: "Evaluación Psicológica Judicial",
        knowledge: "evaluacion-psicologica-judicial-buenos-aires",
        greeting:
          "Estás consultando sobre evaluación psicológica judicial. Puedo orientarte sobre su finalidad, proceso y aplicación.",
        primaryAction: "informar"
      };
    }

    if (this.path.includes("escuela-para-padres")) {
      return {
        slug: "escuela-para-padres",
        title: "Escuela para Padres FALCO®",
        knowledge: "escuela-para-padres",
        greeting:
          "Bienvenido a la Escuela para Padres FALCO®. Puedo orientarte sobre el programa, sus contenidos y modalidad.",
        role: "familia",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("perito-psicologa-de-parte") ||
      this.path.includes("perito-de-parte")
    ) {
      return {
        slug: "perito-de-parte",
        title: "Perito de Parte",
        knowledge: "perito-de-parte",
        greeting:
          "Estás en la sección de Perito de Parte. Puedo orientarte sobre asistencia técnica para abogados y causas judiciales.",
        role: "abogado",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("impugnacion") ||
      this.path.includes("impugnaciones") ||
      this.path.includes("contrainformes")
    ) {
      return {
        slug: "impugnaciones",
        title: "Impugnaciones y Contrainformes",
        knowledge: "impugnaciones",
        greeting:
          "Estás en la sección de revisión técnica, impugnaciones o contrainformes. Puedo orientarte sobre cómo analizar una pericia.",
        role: "abogado",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("honorarios") ||
      this.path.includes("cuanto-cuesta")
    ) {
      return {
        slug: "honorarios",
        title: "Honorarios e Informes",
        knowledge: "honorarios",
        greeting:
          "Estás consultando información sobre honorarios. Puedo orientarte sobre presupuestos, informes y modalidades de intervención.",
        primaryAction: "orientar"
      };
    }

    if (this.path.includes("informe-pericial")) {
      return {
        slug: "informe-pericial",
        title: "Informe Pericial Psicológico",
        knowledge: "informe-pericial",
        greeting:
          "Estás en la sección de Informe Pericial. Puedo orientarte sobre qué incluye y para qué sirve.",
        primaryAction: "informar"
      };
    }

    if (
      this.path.includes("danio-psiquico") ||
      this.path.includes("daño-psiquico")
    ) {
      return {
        slug: "danio-psiquico",
        title: "Daño Psíquico",
        knowledge: "danio-psiquico",
        greeting:
          "Estás en la sección de Daño Psíquico. Puedo orientarte sobre nexo causal, secuelas y evaluación pericial.",
        primaryAction: "informar"
      };
    }

    if (this.path.includes("pericia-psicologica")) {
      return {
        slug: "pericia-psicologica",
        title: "Pericia Psicológica",
        knowledge: "pericia-psicologica",
        greeting:
          "Estás en la sección de Pericia Psicológica. Puedo orientarte sobre el proceso pericial.",
        primaryAction: "informar"
      };
    }

    if (
      this.path.includes("biblioteca-login") ||
      this.path.includes("biblioteca-profesional") ||
      this.path.includes("biblioteca-falco") ||
      this.path.includes("biblioteca")
    ) {
      return {
        slug: "biblioteca",
        title: "Biblioteca FALCO®",
        knowledge: "biblioteca",
        greeting:
          "Bienvenido a la Biblioteca FALCO®. Puedo orientarte sobre los recursos y las modalidades de acceso.",
        role: "biblioteca",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("talleres-y-cursos") ||
      this.path.includes("talleres-cursos") ||
      this.path.includes("cursos-profesionales") ||
      this.path.includes("formacion")
    ) {
      return {
        slug: "formacion",
        title: "Formación",
        knowledge: "formacion",
        greeting:
          "Puedo orientarte sobre los cursos, talleres y actividades de formación disponibles.",
        role: "profesional",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("escuela-login") ||
      this.path.includes("escuela-panel") ||
      this.path.includes("modulo1") ||
      this.path.includes("modulo2") ||
      this.path.includes("modulo3") ||
      this.path.includes("modulo4") ||
      this.path.includes("modulo5") ||
      this.path.includes("modulo6") ||
      this.path.includes("modulo7") ||
      this.path.includes("modulo8")
    ) {
      return {
        slug: "escuela",
        title: "Escuela para Padres FALCO®",
        knowledge: "escuela",
        greeting:
          "Bienvenido a la plataforma de la Escuela para Padres FALCO®. Puedo orientarte sobre el acceso y los contenidos del programa.",
        role: "alumno",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("tests-profesionales") ||
      this.path.includes("dashboard-periciado") ||
      this.path.includes("scl90") ||
      this.path.includes("bdi") ||
      this.path.includes("bai") ||
      this.path.includes("desesperanza")
    ) {
      return {
        slug: "tests",
        title: "Tests Psicométricos",
        knowledge: "tests",
        greeting:
          "Puedo orientarte sobre el acceso y el funcionamiento de la plataforma de evaluación psicométrica.",
        role: "periciado",
        primaryAction: "orientar"
      };
    }

    if (
      this.path.includes("contacto") ||
      this.path.includes("solicitar-turno") ||
      this.path.includes("consultas")
    ) {
      return {
        slug: "contacto",
        title: "Contacto",
        knowledge: "contacto",
        greeting:
          "Puedo ayudarte a encontrar el canal de contacto adecuado según tu consulta.",
        primaryAction: "contactar"
      };
    }

    /*
     * NUEVO:
     * Si ninguna ruta anterior coincide, consulta AION Site Map™.
     * Esto permite reconocer Servicios, Áreas, Recursos,
     * Sobre la Perito, FAQ y Área Profesional.
     */

    const siteMapPage = this.detectFromSiteMap();

    if (siteMapPage) {
      return siteMapPage;
    }

    /*
     * Respaldo final original.
     */

    return {
      slug: "general",
      title: "Sistema FALCO®",
      knowledge: "general",
      greeting:
        "Puedo orientarte dentro del Sistema FALCO® según lo que necesites.",
      role: "visitor",
      primaryAction: "orientar"
    };
  }

  detectFromSiteMap() {
    if (!window.AIONSiteMap) {
      return null;
    }

    const route = window.AIONSiteMap.getCurrent();

    if (!route || !route.slug || route.slug === "general") {
      return null;
    }

    const greetings = {
      servicios:
        "Estás en la sección de Servicios. Puedo orientarte sobre las intervenciones disponibles.",

      areas:
        "Estás consultando las áreas de intervención del Estudio Pericial Psicológico.",

      recursos:
        "Estás en la sección de Recursos. Puedo orientarte sobre los materiales disponibles.",

      "sobre-la-perito":
        "Puedo brindarte información sobre la trayectoria y el trabajo profesional de la perito.",

      faq:
        "Estás en la sección de preguntas frecuentes. Puedo ayudarte a encontrar la información que necesitás.",

      "area-profesional":
        "Bienvenido al Área Profesional. Puedo orientarte sobre los recursos y herramientas disponibles."
    };

    const actions = {
      servicios: "informar",
      areas: "informar",
      recursos: "orientar",
      "sobre-la-perito": "informar",
      faq: "orientar",
      "area-profesional": "orientar"
    };

    return {
      slug: route.slug,
      title: route.title || "Sistema FALCO®",
      knowledge: route.slug,
      greeting:
        greetings[route.slug] ||
        `Estás en la sección ${route.title || "del Sistema FALCO®"}. Puedo orientarte.`,
      role: route.role || "visitor",
      primaryAction: actions[route.slug] || "orientar"
    };
  }

  isHome() {
    return (
      this.path === "/" ||
      this.path.endsWith("/index.html") ||
      this.path.endsWith("index.html")
    );
  }
}

window.AIONRouter = AIONRouter;