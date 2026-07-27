/* ==========================================================
   SISTEMA FALCO®
   CENTRO DE ADMINISTRACIÓN
   ENCUENTROS
========================================================== */

import { db } from "../../firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



const EncuentrosAdmin = {

    encuentros: [],

    encuentroActual: null,

    async init() {

    await this.cargarDatos();

    this.render();

    this.actualizarResumen();

    this.inicializarEventos();

    console.log("Encuentros Admin™ Ready");

},











async cargarDatos() {

    const snapshot = await getDocs(
        collection(db, "escuela_encuentros")
    );

    this.encuentros = snapshot.docs.map(documento => ({

        id: Number(documento.id.replace("modulo", "")),

        ...documento.data()

    }));

},

        render(){

        const contenedor=document.getElementById("contenedorEncuentros");

        if(!contenedor)return;

        contenedor.innerHTML=this.encuentros
            .map(encuentro=>this.crearTarjeta(encuentro))
            .join("");

    },

    crearTarjeta(encuentro){

        return `

        <article
            class="encuentro-card"
            data-id="${encuentro.id}"
        >

            <div class="encuentro-header">

                <div class="encuentro-numero">
                    Encuentro ${encuentro.id}
                </div>

                <h3 class="encuentro-titulo">
                    ${encuentro.titulo}
                </h3>

                <p class="encuentro-descripcion">
                    ${encuentro.descripcion || "Sin descripción."}
                </p>

                <span class="encuentro-estado ${encuentro.estado}">
                    ${encuentro.estado==="publicado"
                        ? "Publicado"
                        : "Borrador"}
                </span>

            </div>

            <div class="encuentro-contenido">

                ${this.item("Video",encuentro.video)}

                ${this.item("Cuadernillo",encuentro.cuadernillo)}

                ${this.item("Actividad",encuentro.actividad)}

                ${this.item("Presentación",encuentro.presentacion)}

                ${this.item("Recursos",encuentro.recursos)}

                ${this.item("Encuesta",encuentro.encuesta)}

            </div>

            <div class="encuentro-footer">

                <button
                    class="encuentro-boton"
                    data-id="${encuentro.id}"
                >
                    Administrar
                </button>

            </div>

        </article>

        `;

    },

    item(nombre,estado){

        return `

        <div class="encuentro-item">

            <span class="encuentro-item-label">
                ${nombre}
            </span>

            <span class="encuentro-item-estado">

                ${estado
                    ? "✔ Configurado"
                    : "— Pendiente"}

            </span>

        </div>

        `;

    },

    actualizarResumen(){

        document.getElementById("totalEncuentros").textContent=
            this.encuentros.length;

        document.getElementById("encuentrosPublicados").textContent=
            this.encuentros.filter(e=>e.estado==="publicado").length;

        document.getElementById("encuentrosBorrador").textContent=
            this.encuentros.filter(e=>e.estado==="borrador").length;

        document.getElementById("encuentrosConfigurados").textContent=
            this.encuentros.filter(e=>

                e.video &&
                e.cuadernillo &&
                e.actividad &&
                e.presentacion &&
                e.recursos &&
                e.encuesta

            ).length;

    },

        inicializarEventos(){

        document.addEventListener("click",(e)=>{

            const boton=e.target.closest(".encuentro-boton");

            if(boton){

                const id=Number(boton.dataset.id);

                this.abrirModal(id);

            }

            if(e.target.matches("[data-modal-cerrar]")){

                this.cerrarModal();

            }

        });

    },





abrirModal(id) {

    const encuentro = this.encuentros.find(e => e.id === id);

    if (!encuentro) return;

    this.encuentroActual = encuentro;

    const modal = document.getElementById("modalEncuentro");

    if (!modal) return;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    document.getElementById("modalEncuentroTitulo").textContent =
        `Encuentro ${encuentro.id}`;

    document.getElementById("modalEncuentroContenido").innerHTML = `

        <div class="encuentro-admin-secciones">

            <!-- DATOS GENERALES -->

            <section class="encuentro-admin-bloque">

                <h3>Datos generales</h3>

                <div class="encuentro-admin-grid">

                    <div class="encuentro-admin-campo">

                        <label for="encuentroTitulo">
                            Título
                        </label>

                        <input
                            id="encuentroTitulo"
                            type="text"
                            value="${encuentro.titulo || ""}"
                        >

                    </div>

                    <div class="encuentro-admin-campo">

                        <label for="encuentroEstado">
                            Estado
                        </label>

                        <select id="encuentroEstado">

                            <option
                                value="publicado"
                                ${encuentro.estado === "publicado" ? "selected" : ""}
                            >
                                Publicado
                            </option>

                            <option
                                value="borrador"
                                ${encuentro.estado === "borrador" ? "selected" : ""}
                            >
                                Borrador
                            </option>

                        </select>

                    </div>

                </div>

                <div class="encuentro-admin-campo">

                    <label for="encuentroDescripcion">
                        Descripción
                    </label>

                    <textarea
                        id="encuentroDescripcion"
                        rows="4"
                    >${encuentro.descripcion || ""}</textarea>

                </div>

            </section>


            <!-- CONTENIDO PRINCIPAL -->

            <section class="encuentro-admin-bloque">

                <h3>Contenido principal</h3>

                <div class="encuentro-admin-grid">

                    <div class="encuentro-admin-campo">

                        <label for="encuentroVideoUrl">
                            URL del video
                        </label>

                        <input
                            id="encuentroVideoUrl"
                            type="url"
                            placeholder="https://www.youtube.com/..."
                            value="${encuentro.videoUrl || ""}"
                        >

                    </div>

                    <div class="encuentro-admin-campo">

                        <label for="encuentroDuracion">
                            Duración
                        </label>

                        <input
                            id="encuentroDuracion"
                            type="text"
                            placeholder="Ejemplo: 25 minutos"
                            value="${encuentro.duracion || ""}"
                        >

                    </div>

                </div>

                <div class="encuentro-admin-campo">

                    <label for="encuentroIntroduccion">
                        Texto introductorio
                    </label>

                    <textarea
                        id="encuentroIntroduccion"
                        rows="4"
                    >${encuentro.introduccion || ""}</textarea>

                </div>

                <div class="encuentro-admin-campo">

                    <label for="encuentroObjetivos">
                        Objetivos
                    </label>

                    <textarea
                        id="encuentroObjetivos"
                        rows="4"
                        placeholder="Escribí un objetivo por línea."
                    >${encuentro.objetivos || ""}</textarea>

                </div>

            </section>




            <!-- RECURSOS -->

<section class="encuentro-admin-bloque">

    <h3>Recursos del encuentro</h3>

    <div class="encuentro-admin-campo">

        <label for="encuentroCuadernilloUrl">
            URL del cuadernillo
        </label>

        <input
            id="encuentroCuadernilloUrl"
            type="url"
            placeholder="Enlace al PDF"
            value="${encuentro.cuadernilloUrl || ""}"
        >

    </div>

    <div class="encuentro-admin-campo">

        <label for="encuentroActividadUrl">
            URL de la actividad
        </label>

        <input
            id="encuentroActividadUrl"
            type="url"
            placeholder="Enlace a la actividad"
            value="${encuentro.actividadUrl || ""}"
        >

    </div>

    <div class="encuentro-admin-campo">

        <label for="encuentroPresentacionUrl">
            URL de la presentación
        </label>

        <input
            id="encuentroPresentacionUrl"
            type="url"
            placeholder="Enlace a la presentación"
            value="${encuentro.presentacionUrl || ""}"
        >

    </div>


<div class="encuentro-admin-campo">

    <label for="encuentroRecursosUrl">
        URL de recursos adicionales
    </label>

    <input
        id="encuentroRecursosUrl"
        type="url"
        placeholder="Enlace a recursos adicionales"
        value="${encuentro.recursosUrl || ""}"
    >

</div>



    <div class="encuentro-admin-grid">

                    ${this.crearControlRecurso(
                        "encuentroVideo",
                        "Video",
                        encuentro.video
                    )}

                    ${this.crearControlRecurso(
                        "encuentroCuadernillo",
                        "Cuadernillo",
                        encuentro.cuadernillo
                    )}

                    ${this.crearControlRecurso(
                        "encuentroActividad",
                        "Actividad",
                        encuentro.actividad
                    )}

                    ${this.crearControlRecurso(
                        "encuentroPresentacion",
                        "Presentación",
                        encuentro.presentacion
                    )}

                    ${this.crearControlRecurso(
                        "encuentroRecursos",
                        "Recursos adicionales",
                        encuentro.recursos
                    )}

                    ${this.crearControlRecurso(
                        "encuentroEncuesta",
                        "Encuesta",
                        encuentro.encuesta
                    )}

                </div>

            </section>

        </div>

    `;

},



crearControlRecurso(id, nombre, activo) {

    return `

        <label class="encuentro-switch" for="${id}">

            <span>
                ${nombre}
            </span>

            <input
                id="${id}"
                type="checkbox"
                ${activo ? "checked" : ""}
            >

        </label>

    `;

},





    cerrarModal(){

        const modal=document.getElementById("modalEncuentro");

        if(!modal)return;

        modal.hidden=true;

        modal.setAttribute("aria-hidden","true");

        this.encuentroActual=null;

    },





async guardarCambios() {

    if (!this.encuentroActual) return;

    const idActual = this.encuentroActual.id;

    const datosActualizados = {

        titulo:
            document.getElementById("encuentroTitulo").value.trim(),

        descripcion:
            document.getElementById("encuentroDescripcion").value.trim(),

        estado:
            document.getElementById("encuentroEstado").value,

        videoUrl:
            document.getElementById("encuentroVideoUrl").value.trim(),


cuadernilloUrl:
    document.getElementById("encuentroCuadernilloUrl").value.trim(),

actividadUrl:
    document.getElementById("encuentroActividadUrl").value.trim(),

presentacionUrl:
    document.getElementById("encuentroPresentacionUrl").value.trim(),


    recursosUrl:
    document.getElementById("encuentroRecursosUrl").value.trim(),


        duracion:
            document.getElementById("encuentroDuracion").value.trim(),

        introduccion:
            document.getElementById("encuentroIntroduccion").value.trim(),

        objetivos:
            document.getElementById("encuentroObjetivos").value.trim(),

        video:
            document.getElementById("encuentroVideo").checked,

        cuadernillo:
            document.getElementById("encuentroCuadernillo").checked,

        actividad:
            document.getElementById("encuentroActividad").checked,

        presentacion:
            document.getElementById("encuentroPresentacion").checked,

        recursos:
            document.getElementById("encuentroRecursos").checked,

        encuesta:
            document.getElementById("encuentroEncuesta").checked

    };

    await updateDoc(
        doc(
            db,
            "escuela_encuentros",
            `modulo${idActual}`
        ),
        datosActualizados
    );

    Object.assign(
        this.encuentroActual,
        datosActualizados
    );

    this.render();

    this.actualizarResumen();

    this.cerrarModal();

    console.log(
        `Encuentro ${idActual} actualizado`
    );

}

};

document.addEventListener("DOMContentLoaded",()=>{

    EncuentrosAdmin.init();

    const guardar = document.getElementById("btnGuardarModal");

    if(guardar){

        guardar.addEventListener("click",()=>{

            EncuentrosAdmin.guardarCambios();

        });

    }

});