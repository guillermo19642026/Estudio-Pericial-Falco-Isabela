/* =========================================================
   FALCO IDENTITY™
   CORE v1.1
========================================================= */

const FalcoIdentity = {

  estado: null,

  elementos: {
    status: null,
    data: null,
    actions: null,
    logout: null
  },


  async init() {
    console.log(
      "FALCO Identity™ v1.1 Ready"
    );

    this.obtenerElementos();
    this.vincularEventos();

    try {
      if (
        !window
          .FalcoIdentityFirebase
          ?.resolverIdentidad
      ) {
        throw new Error(
          "El adaptador Firebase de Identity no está disponible."
        );
      }

      this.estado =
        await window
          .FalcoIdentityFirebase
          .resolverIdentidad();

      this.publicarAPI();
      this.renderizar();

      console.log(
        "Identidad resuelta:",
        this.estado
      );

    } catch (error) {
      console.error(
        "No se pudo resolver la identidad:",
        error
      );

      this.mostrarError(
        error.message
      );
    }
  },


  obtenerElementos() {
    this.elementos.status =
      document.getElementById(
        "identityStatus"
      );

    this.elementos.data =
      document.getElementById(
        "identityData"
      );

    this.elementos.actions =
      document.getElementById(
        "identityActions"
      );

    this.elementos.logout =
      document.getElementById(
        "identityLogout"
      );
  },


  vincularEventos() {
    this.elementos.logout
      ?.addEventListener(
        "click",
        () => {
          this.cerrarSesion();
        }
      );
  },


  publicarAPI() {
    window.FalcoIdentity = {

      getState: () =>
        this.estado
          ? structuredClone(
              this.estado
            )
          : null,

      isAuthenticated: () =>
        Boolean(
          this.estado
            ?.autenticado
        ),

      getUser: () =>
        this.estado
          ?.usuario || null,

      getProfile: () =>
        this.estado
          ?.perfil || null,

      getRole: () =>
        this.estado
          ?.rol || "invitado",

      hasRole: roles => {
        const permitidos =
          Array.isArray(roles)
            ? roles
            : [roles];

        return permitidos
          .map(rol =>
            String(rol)
              .trim()
              .toLowerCase()
          )
          .includes(
            this.estado
              ?.rol
          );
      },

      logout: () =>
        this.cerrarSesion()

    };
  },


  renderizar() {
    const {
      status,
      data,
      actions
    } = this.elementos;

    if (
      !status ||
      !data
    ) {
      return;
    }

    status.classList.remove(
      "is-success",
      "is-error"
    );

    if (
      !this.estado
        ?.autenticado
    ) {
      status.textContent =
        "No hay una sesión iniciada.";

      status.classList.add(
        "is-error"
      );

      data.hidden = true;

      if (actions) {
        actions.hidden = true;
      }

      return;
    }

    status.textContent =
      "Identidad verificada correctamente.";

    status.classList.add(
      "is-success"
    );

    document.getElementById(
      "identityUid"
    ).textContent =
      this.estado.usuario.uid;

    document.getElementById(
      "identityEmail"
    ).textContent =
      this.estado.usuario.email ||
      "Sin correo";

    document.getElementById(
      "identityRole"
    ).textContent =
      this.estado.rol;

    data.hidden = false;

    if (actions) {
      actions.hidden = false;
    }
  },


  async cerrarSesion() {
    const boton =
      this.elementos.logout;

    try {
      if (
        !window
          .FalcoIdentityFirebase
          ?.cerrarSesion
      ) {
        throw new Error(
          "La función para cerrar sesión no está disponible."
        );
      }

      if (boton) {
        boton.disabled = true;
        boton.textContent =
          "Cerrando sesión...";
      }

      await window
        .FalcoIdentityFirebase
        .cerrarSesion();

      this.estado = {
        autenticado: false,
        usuario: null,
        perfil: null,
        rol: "invitado"
      };

      this.publicarAPI();
      this.renderizar();

      console.log(
        "Sesión cerrada correctamente."
      );

    } catch (error) {
      console.error(
        "No se pudo cerrar la sesión:",
        error
      );

      this.mostrarError(
        error.message
      );

    } finally {
      if (boton) {
        boton.disabled = false;
        boton.textContent =
          "Cerrar sesión";
      }
    }
  },


  mostrarError(mensaje) {
    const status =
      this.elementos.status;

    if (!status) {
      return;
    }

    status.textContent =
      mensaje ||
      "No se pudo verificar la identidad.";

    status.classList.remove(
      "is-success"
    );

    status.classList.add(
      "is-error"
    );
  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => {
    FalcoIdentity.init();
  }
);