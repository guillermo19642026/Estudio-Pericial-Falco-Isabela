/* =========================================================
   FALCO® EXPEDIENTE DIGITAL PERICIAL
   EXPEDIENTE VIEWER™ v1.2
   Centro Profesional FALCO®
========================================================= */

const FalcoExpedienteViewer = {

  expediente: null,
  datos: {},
  documentos: {},

  modulos: [

    { id:"datos-personales", titulo:"Datos personales" },
    { id:"datos-judiciales", titulo:"Datos judiciales" },
    { id:"relato-del-hecho", titulo:"Relato del hecho" },
    { id:"grupo-familiar", titulo:"Grupo familiar" },
    { id:"area-afectiva", titulo:"Área afectiva" },
    { id:"area-social-recreativa", titulo:"Área social y recreativa" },
    { id:"educacion", titulo:"Educación y formación" },
    { id:"historia-laboral", titulo:"Historia laboral" },
    { id:"trabajo-actual", titulo:"Trabajo actual" },
    { id:"tratamientos", titulo:"Tratamientos" },
    { id:"antecedentes-salud", titulo:"Antecedentes de salud" },
    { id:"habitos-calidad-vida", titulo:"Hábitos y calidad de vida" },
    { id:"impacto-actual", titulo:"Impacto actual" },
    { id:"documentacion", titulo:"Documentación" },
    { id:"observaciones-finales", titulo:"Observaciones finales" },
    { id:"consentimiento-informado", titulo:"Consentimiento informado" }

  ],



/* =========================================================
   INICIALIZACIÓN
========================================================= */

async init(){

    console.log(
        "FALCO Expediente Viewer™ v1.2 Ready"
    );

    this.vincularEventos();

    const expedienteId =
        new URLSearchParams(
            window.location.search
        ).get("id");

    if(!expedienteId){

        this.mostrarError(
            "No se recibió el identificador del expediente."
        );

        return;

    }

    await this.cargarExpediente(expedienteId);

},



/* =========================================================
   CARGAR EXPEDIENTE
========================================================= */

async cargarExpediente(id){

    try{

        if(
            !window.FalcoExpedienteLoader
            ?.obtenerExpediente
        ){

            throw new Error(
                "No se encontró FalcoExpedienteLoader."
            );

        }

        this.expediente =
            await window
                .FalcoExpedienteLoader
                .obtenerExpediente(id);

        console.log(
            "Expediente cargado:",
            this.expediente
        );

        this.datos =
            this.expediente.datos || {};

        this.documentos =
            this.expediente.documentos || {};

        this.render();

    }

    catch(error){

        console.error(error);

        this.mostrarError(
            error.message
        );

    }

},



/* =========================================================
   RENDER GENERAL
========================================================= */

render(){

    this.renderPortada();

    this.renderIndice();

    this.renderCapitulos();

    this.renderAnexos();

    document
        .getElementById("estadoCarga")
        ?.setAttribute("hidden",true);

    document
        .getElementById("expediente")
        ?.removeAttribute("hidden");

},



/* =========================================================
   UTILIDADES
========================================================= */

obtenerModulo(id){

    if(this.datos[id] !== undefined){

        return this.datos[id];

    }

    const alias={

        "relato-del-hecho":[
            "relato-hecho",
            "relato"
        ],

        "area-afectiva":[
            "área-afectiva"
        ],

        "area-social-recreativa":[
            "area-social-y-recreativa",
            "área-social-recreativa"
        ],

        "educacion":[
            "educacion-formacion",
            "educación"
        ],

        "antecedentes-salud":[
            "antecedentes-de-salud"
        ],

        "habitos-calidad-vida":[
            "habitos-y-calidad-de-vida",
            "hábitos-calidad-vida"
        ],

        "observaciones-finales":[
            "observaciones"
        ],

        "consentimiento-informado":[
            "consentimiento"
        ]

    };

    const lista =
        alias[id] || [];

    for(const item of lista){

        if(
            this.datos[item] !== undefined
        ){

            return this.datos[item];

        }

    }

    return null;

},



esCampoTecnico(campo){

    return [

        "usuarioUID",
        "usuarioEmail",
        "creadoEn",
        "actualizadoEn",
        "timestamp",
        "version",
        "docId"

    ].includes(campo);

},



tieneContenido(valor){

    if(
        valor===null ||
        valor===undefined ||
        valor===""

    ){

        return false;

    }

    if(Array.isArray(valor)){

        return valor.some(v=>
            this.tieneContenido(v)
        );

    }

    if(typeof valor==="object"){

        return Object.entries(valor)

            .filter(
                ([k])=>
                !this.esCampoTecnico(k)
            )

            .some(
                ([,v])=>
                this.tieneContenido(v)
            );

    }

    return true;

},



formatearEtiqueta(texto){

    return String(texto)

        .replaceAll("_"," ")

        .replaceAll("-"," ")

        .replace(

            /([a-z])([A-Z])/g,

            "$1 $2"

        )

        .replace(

            /\b\w/g,

            l=>l.toUpperCase()

        );

},



formatearValor(valor){

    if(
        valor &&
        typeof valor.toDate==="function"
    ){

        return valor
            .toDate()
            .toLocaleString("es-AR");

    }

    return String(valor ?? "");

},



escaparHtml(texto){

    return String(texto ?? "")

        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

},

/* =========================================================
   PORTADA DEL EXPEDIENTE
========================================================= */

renderPortada(){

    const personales =
        this.obtenerModulo(
            "datos-personales"
        ) || {};

    const judiciales =
        this.obtenerModulo(
            "datos-judiciales"
        ) || {};

    const nombre =
        personales.nombreApellido ||
        personales.nombreCompleto ||
        personales.nombreYApellido ||
        personales.nombre ||
        this.expediente?.nombreApellido ||
        this.expediente?.usuarioEmail ||
        "Periciado sin identificar";

    const dni =
        personales.dni ||
        personales.numeroDni ||
        personales.documento ||
        this.expediente?.dni ||
        "Sin DNI registrado";

    const numeroExpediente =
        judiciales.expediente ||
        judiciales.numeroExpediente ||
        judiciales.numeroCausa ||
        judiciales.causa ||
        this.expediente?.numeroExpediente ||
        "Sin número de expediente";

    const caratula =
        judiciales.caratula ||
        judiciales.carátula ||
        this.expediente?.caratula ||
        "Sin carátula registrada";

    const tribunal =
        judiciales.tribunal ||
        judiciales.juzgado ||
        judiciales.organismo ||
        judiciales.dependencia ||
        this.expediente?.tribunal ||
        "Sin organismo registrado";

    const completados =
        Array.isArray(
            this.expediente?.completados
        )
            ? this.expediente.completados.length
            : this.contarModulosCompletados();

    const totalModulos =
        this.modulos.length;

    const finalizado =
        this.expediente?.estado === "finalizada" ||
        this.expediente?.estado === "finalizado" ||
        completados >= totalModulos;

    const estado =
        finalizado
            ? "Expediente completo"
            : `En proceso · ${completados}/${totalModulos} módulos`;

    const fecha =
        this.obtenerFechaExpediente();

    this.asignarTexto(
        "portadaPericiado",
        nombre
    );

    this.asignarTexto(
        "portadaDni",
        dni
    );

    this.asignarTexto(
        "portadaExpediente",
        numeroExpediente
    );

    this.asignarTexto(
        "portadaCaratula",
        caratula
    );

    this.asignarTexto(
        "portadaTribunal",
        tribunal
    );

    this.asignarTexto(
        "portadaEstado",
        estado
    );

    this.asignarTexto(
        "portadaFecha",
        fecha
    );

    this.asignarTexto(
        "portadaVersion",
        "FALCO® Expediente Digital v1.2"
    );

},



/* =========================================================
   ÍNDICE DE CAPÍTULOS
========================================================= */

renderIndice(){

    const indice =
        document.getElementById(
            "indiceCapitulos"
        );

    if(!indice){

        console.warn(
            "No se encontró #indiceCapitulos."
        );

        return;

    }

    indice.innerHTML =
        this.modulos
            .map(
                (modulo, posicion) => {

                    const contenido =
                        this.obtenerModulo(
                            modulo.id
                        );

                    const completo =
                        this.tieneContenido(
                            contenido
                        );

                    const numero =
                        String(
                            posicion + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    return `
                        <li class="indice-item">

                            <a
                                href="#capitulo-${posicion + 1}"
                                class="indice-enlace"
                            >

                                <span class="indice-numero">
                                    ${numero}
                                </span>

                                <span class="indice-titulo">
                                    ${this.escaparHtml(
                                        modulo.titulo
                                    )}
                                </span>

                            </a>

                            <span
                                class="
                                    indice-estado
                                    ${
                                        completo
                                            ? "indice-estado-completo"
                                            : "indice-estado-vacio"
                                    }
                                "
                            >
                                ${
                                    completo
                                        ? "Completo"
                                        : "Sin información"
                                }
                            </span>

                        </li>
                    `;

                }
            )
            .join("");

},



/* =========================================================
   CAPÍTULOS DEL EXPEDIENTE
========================================================= */

renderCapitulos(){

    const contenedor =
        document.getElementById(
            "capitulos"
        );

    if(!contenedor){

        console.warn(
            "No se encontró #capitulos."
        );

        return;

    }

    contenedor.innerHTML =
        this.modulos
            .map(
                (modulo, posicion) => {

                    const contenido =
                        this.obtenerModulo(
                            modulo.id
                        );

                    const numero =
                        String(
                            posicion + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    const completo =
                        this.tieneContenido(
                            contenido
                        );

                    return `
                        <section
                            class="
                                pagina
                                capitulo
                                ${
                                    completo
                                        ? "capitulo-completo"
                                        : "capitulo-vacio"
                                }
                            "
                            id="capitulo-${posicion + 1}"
                            data-modulo="${this.escaparHtml(
                                modulo.id
                            )}"
                        >

                            <header class="capitulo-encabezado">

                                <span class="capitulo-numero">
                                    CAPÍTULO ${numero}
                                </span>

                                <span
                                    class="
                                        capitulo-estado
                                        ${
                                            completo
                                                ? "capitulo-estado-completo"
                                                : "capitulo-estado-vacio"
                                        }
                                    "
                                >
                                    ${
                                        completo
                                            ? "Información registrada"
                                            : "Sin información"
                                    }
                                </span>

                            </header>

                            <h2 class="capitulo-titulo">
                                ${this.escaparHtml(
                                    modulo.titulo
                                )}
                            </h2>

                            <div class="capitulo-contenido">

                                ${this.renderContenido(
                                    contenido,
                                    {
                                        nivel: 0,
                                        clavePadre: modulo.id
                                    }
                                )}

                            </div>

                        </section>
                    `;

                }
            )
            .join("");

},



/* =========================================================
   CONTAR MÓDULOS COMPLETADOS
========================================================= */

contarModulosCompletados(){

    return this.modulos.reduce(
        (total, modulo) => {

            const contenido =
                this.obtenerModulo(
                    modulo.id
                );

            return this.tieneContenido(
                contenido
            )
                ? total + 1
                : total;

        },
        0
    );

},



/* =========================================================
   FECHA DEL EXPEDIENTE
========================================================= */

obtenerFechaExpediente(){

    const fecha =
        this.expediente?.ultimaActualizacion ||
        this.expediente?.actualizadoEn ||
        this.expediente?.creadoEn ||
        new Date();

    const fechaNormalizada =
        this.convertirAFecha(
            fecha
        );

    if(!fechaNormalizada){

        return new Date()
            .toLocaleDateString(
                "es-AR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

    }

    return fechaNormalizada
        .toLocaleDateString(
            "es-AR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

},



/* =========================================================
   CONVERTIR FECHAS
========================================================= */

convertirAFecha(valor){

    if(!valor){

        return null;

    }

    if(valor instanceof Date){

        return valor;

    }

    if(
        typeof valor.toDate === "function"
    ){

        return valor.toDate();

    }

    if(
        typeof valor === "object" &&
        typeof valor.seconds === "number"
    ){

        return new Date(
            valor.seconds * 1000
        );

    }

    if(
        typeof valor === "string" ||
        typeof valor === "number"
    ){

        const fecha =
            new Date(valor);

        if(
            !Number.isNaN(
                fecha.getTime()
            )
        ){

            return fecha;

        }

    }

    return null;

},



/* =========================================================
   ASIGNAR TEXTO
========================================================= */

asignarTexto(id, valor){

    const elemento =
        document.getElementById(id);

    if(!elemento){

        return;

    }

    elemento.textContent =
        String(
            valor ?? ""
        );

},

/* =========================================================
   RENDER DE CONTENIDO
========================================================= */

renderContenido(valor, opciones = {}){

    const {
        nivel = 0,
        clavePadre = ""
    } = opciones;

    if(!this.tieneContenido(valor)){

        return `
            <div class="campo-vacio">
                No se registró información en este módulo.
            </div>
        `;

    }

    /* ===========================================
       ARRAY
    =========================================== */

    if(Array.isArray(valor)){

        if(valor.length===0){

            return `
                <div class="campo-vacio">
                    Sin registros.
                </div>
            `;

        }

        return `
            <div class="lista-expediente">

                ${valor.map(
                    (item,index)=>`

                        <section class="bloque-array">

                            <header class="bloque-array-header">

                                Registro ${index+1}

                            </header>

                            <div class="bloque-array-body">

                                ${this.renderContenido(
                                    item,
                                    {
                                        nivel:nivel+1,
                                        clavePadre
                                    }
                                )}

                            </div>

                        </section>

                    `
                ).join("")}

            </div>
        `;

    }

    /* ===========================================
       OBJETO
    =========================================== */

    if(
        typeof valor==="object" &&
        valor!==null
    ){

        const campos =
            Object.entries(valor)

            .filter(
                ([clave])=>
                    !this.esCampoTecnico(clave)
            );

        if(!campos.length){

            return `
                <div class="campo-vacio">
                    Sin información.
                </div>
            `;

        }

        return campos.map(

            ([clave,contenido])=>`

                <div class="campo-expediente">

                    <div class="campo-etiqueta">

                        ${this.escaparHtml(
                            this.formatearEtiqueta(clave)
                        )}

                    </div>

                    <div class="campo-valor">

                        ${this.renderContenido(

                            contenido,

                            {
                                nivel:nivel+1,
                                clavePadre:clave
                            }

                        )}

                    </div>

                </div>

            `

        ).join("");

    }

    /* ===========================================
       BOOLEAN
    =========================================== */

    if(typeof valor==="boolean"){

        return `

            <span class="valor-boolean">

                ${valor ? "Sí" : "No"}

            </span>

        `;

    }

    /* ===========================================
       NUMBER
    =========================================== */

    if(typeof valor==="number"){

        return `

            <span>

                ${valor}

            </span>

        `;

    }

    /* ===========================================
       STRING
    =========================================== */

    const texto =
        this.formatearValor(valor);

    if(
        texto.startsWith("http://") ||
        texto.startsWith("https://")
    ){

        return `

            <a

                href="${this.escaparHtml(texto)}"

                target="_blank"

                rel="noopener noreferrer"

                class="enlace-expediente"

            >

                ${this.escaparHtml(texto)}

            </a>

        `;

    }

    if(texto.length>180){

        return `

            <div class="texto-largo">

                ${this.escaparHtml(texto)}

            </div>

        `;

    }

    return `

        <span>

            ${this.escaparHtml(texto)}

        </span>

    `;

},

/* =========================================================
   DETECTAR ENLACES
========================================================= */

esEnlace(valor){

    if(typeof valor !== "string"){

        return false;

    }

    const texto =
        valor.trim().toLowerCase();

    return (
        texto.startsWith("http://") ||
        texto.startsWith("https://")
    );

},



/* =========================================================
   DETECTAR ARCHIVOS PDF
========================================================= */

esPdf(valor){

    if(typeof valor !== "string"){

        return false;

    }

    const texto =
        valor
            .trim()
            .toLowerCase()
            .split("?")[0]
            .split("#")[0];

    return texto.endsWith(".pdf");

},



/* =========================================================
   DETECTAR IMÁGENES
========================================================= */

esImagen(valor){

    if(typeof valor !== "string"){

        return false;

    }

    const texto =
        valor
            .trim()
            .toLowerCase()
            .split("?")[0]
            .split("#")[0];

    return [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".bmp",
        ".svg"

    ].some(
        extension =>
            texto.endsWith(extension)
    );

},



/* =========================================================
   OBTENER NOMBRE DE ARCHIVO
========================================================= */

obtenerNombreArchivo(url){

    if(typeof url !== "string"){

        return "Documento adjunto";

    }

    try{

        const urlObjeto =
            new URL(url);

        const segmentos =
            urlObjeto.pathname
                .split("/")
                .filter(Boolean);

        const nombre =
            segmentos[
                segmentos.length - 1
            ];

        if(!nombre){

            return "Documento adjunto";

        }

        return decodeURIComponent(
            nombre
        );

    }

    catch(error){

        const partes =
            url
                .split("/")
                .filter(Boolean);

        return decodeURIComponent(
            partes[
                partes.length - 1
            ] ||
            "Documento adjunto"
        );

    }

},



/* =========================================================
   NORMALIZAR CLAVE
========================================================= */

normalizarClave(clave){

    return String(
        clave ?? ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /([a-z0-9])([A-Z])/g,
            "$1-$2"
        )
        .replace(
            /[_\s]+/g,
            "-"
        )
        .replace(
            /-+/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        )
        .toLowerCase();

},



/* =========================================================
   BUSCAR VALOR POR POSIBLES CLAVES
========================================================= */

obtenerPrimerValor(
    objeto,
    posiblesClaves,
    valorPredeterminado = ""
){

    if(
        !objeto ||
        typeof objeto !== "object"
    ){

        return valorPredeterminado;

    }

    const entradas =
        Object.entries(objeto);

    for(
        const claveBuscada
        of posiblesClaves
    ){

        const claveNormalizada =
            this.normalizarClave(
                claveBuscada
            );

        const coincidencia =
            entradas.find(
                ([clave]) =>
                    this.normalizarClave(
                        clave
                    ) === claveNormalizada
            );

        if(
            coincidencia &&
            this.tieneContenido(
                coincidencia[1]
            )
        ){

            return coincidencia[1];

        }

    }

    return valorPredeterminado;

},



/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

normalizarTexto(valor){

    if(
        valor === null ||
        valor === undefined
    ){

        return "";

    }

    return String(valor)
        .replace(
            /\r\n/g,
            "\n"
        )
        .replace(
            /\r/g,
            "\n"
        )
        .trim();

},



/* =========================================================
   FORMATEAR FECHA Y HORA
========================================================= */

formatearFechaHora(valor){

    const fecha =
        this.convertirAFecha(
            valor
        );

    if(!fecha){

        return "";

    }

    return fecha.toLocaleString(
        "es-AR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

},



/* =========================================================
   COMPROBAR OBJETO SIMPLE
========================================================= */

esObjetoSimple(valor){

    return Boolean(
        valor &&
        typeof valor === "object" &&
        !Array.isArray(valor) &&
        !(valor instanceof Date) &&
        typeof valor.toDate !== "function"
    );

},



/* =========================================================
   OBTENER ENTRADAS VISIBLES
========================================================= */

obtenerEntradasVisibles(objeto){

    if(!this.esObjetoSimple(objeto)){

        return [];

    }

    return Object.entries(objeto)
        .filter(
            ([clave, valor]) =>
                !this.esCampoTecnico(
                    clave
                ) &&
                this.tieneContenido(
                    valor
                )
        );

},



/* =========================================================
   EVITAR HTML VACÍO
========================================================= */

asegurarContenidoHtml(html){

    const contenido =
        String(
            html ?? ""
        ).trim();

    if(contenido){

        return contenido;

    }

    return `
        <div class="campo-vacio">
            Sin información registrada.
        </div>
    `;

},

/* =========================================================
   RENDER DE DOCUMENTACIÓN ADJUNTA
========================================================= */

renderAnexos(){

    const contenedor =
        document.querySelector(
            "#capitulo-14 .capitulo-contenido"
        );

    if(!contenedor){

        console.warn(
            "No se encontró el capítulo de documentación."
        );

        return;

    }

    const archivos =
        this.extraerArchivos(
            this.documentos
        );

    if(!archivos.length){

        return;

    }

    const grupos =
        this.agruparArchivos(
            archivos
        );

    const html = `

        <section class="anexos-expediente">

            <header class="anexos-encabezado">

                <h3>
                    Documentación adjunta
                </h3>

                <p>
                    Archivos incorporados al expediente digital pericial.
                </p>

            </header>

            ${Object.entries(grupos)
                .map(
                    ([categoria, items]) =>
                        this.renderGrupoAnexos(
                            categoria,
                            items
                        )
                )
                .join("")}

        </section>
    `;

    contenedor.insertAdjacentHTML(
        "beforeend",
        html
    );

},



/* =========================================================
   EXTRAER ARCHIVOS
========================================================= */

extraerArchivos(origen){

    const archivos = [];

    const recorrer = (
        valor,
        categoria = "otros",
        ruta = []
    ) => {

        if(
            valor === null ||
            valor === undefined
        ){

            return;

        }

        if(Array.isArray(valor)){

            valor.forEach(
                (item, indice) => {

                    recorrer(
                        item,
                        categoria,
                        [
                            ...ruta,
                            indice
                        ]
                    );

                }
            );

            return;

        }

        if(
            typeof valor === "string"
        ){

            if(this.esEnlace(valor)){

                archivos.push(
                    this.crearArchivoNormalizado(
                        {
                            url: valor
                        },
                        categoria,
                        ruta
                    )
                );

            }

            return;

        }

        if(
            typeof valor !== "object"
        ){

            return;

        }

        const url =
            this.obtenerPrimerValor(
                valor,
                [
                    "url",
                    "secure_url",
                    "secureUrl",
                    "downloadURL",
                    "downloadUrl",
                    "archivoUrl",
                    "documentoUrl",
                    "fileUrl",
                    "src"
                ],
                ""
            );

        if(
            typeof url === "string" &&
            this.esEnlace(url)
        ){

            archivos.push(
                this.crearArchivoNormalizado(
                    valor,
                    categoria,
                    ruta
                )
            );

            return;

        }

        Object.entries(valor)
            .filter(
                ([clave]) =>
                    !this.esCampoTecnico(
                        clave
                    )
            )
            .forEach(
                ([clave, contenido]) => {

                    recorrer(
                        contenido,
                        clave,
                        [
                            ...ruta,
                            clave
                        ]
                    );

                }
            );

    };

    recorrer(
        origen,
        "documentacion",
        []
    );

    return archivos
        .filter(
            archivo =>
                archivo &&
                archivo.url
        )
        .filter(
            (
                archivo,
                indice,
                lista
            ) =>
                lista.findIndex(
                    otro =>
                        otro.url === archivo.url
                ) === indice
        );

},



/* =========================================================
   NORMALIZAR ARCHIVO
========================================================= */

crearArchivoNormalizado(
    archivo,
    categoria,
    ruta = []
){

    const url =
        this.obtenerPrimerValor(
            archivo,
            [
                "url",
                "secure_url",
                "secureUrl",
                "downloadURL",
                "downloadUrl",
                "archivoUrl",
                "documentoUrl",
                "fileUrl",
                "src"
            ],
            ""
        );

    const nombre =
        this.obtenerPrimerValor(
            archivo,
            [
                "nombre",
                "filename",
                "fileName",
                "nombreArchivo",
                "titulo",
                "title"
            ],
            this.obtenerNombreArchivo(
                url
            )
        );

    const tipo =
        this.obtenerPrimerValor(
            archivo,
            [
                "tipo",
                "mimeType",
                "mime_type",
                "formato",
                "contentType"
            ],
            ""
        );

    const fecha =
        this.obtenerPrimerValor(
            archivo,
            [
                "fecha",
                "creadoEn",
                "actualizadoEn",
                "uploadedAt",
                "fechaCarga"
            ],
            null
        );

    return {

        categoria:
            this.normalizarCategoriaDocumento(
                categoria,
                ruta
            ),

        nombre:
            this.normalizarTexto(
                nombre
            ) ||
            "Documento adjunto",

        url:
            String(
                url || ""
            ).trim(),

        tipo:
            String(
                tipo || ""
            ).trim(),

        fecha,

        ruta

    };

},



/* =========================================================
   NORMALIZAR CATEGORÍA DOCUMENTAL
========================================================= */

normalizarCategoriaDocumento(
    categoria,
    ruta = []
){

    const texto =
        this.normalizarClave(
            [
                categoria,
                ...ruta
            ].join("-")
        );

    if(
        texto.includes("dni") &&
        texto.includes("frente")
    ){

        return "dni-frente";

    }

    if(
        texto.includes("dni") &&
        (
            texto.includes("dorso") ||
            texto.includes("reverso")
        )
    ){

        return "dni-dorso";

    }

    if(
        texto.includes("dni") ||
        texto.includes("documento-identidad")
    ){

        return "dni";

    }

    if(
        texto.includes("consentimiento")
    ){

        return "consentimiento";

    }

    if(
        texto.includes("constancia") &&
        texto.includes("tratamiento")
    ){

        return "constancias-tratamiento";

    }

    if(
        texto.includes("certificado")
    ){

        return "certificados";

    }

    if(
        texto.includes("historia-clinica")
    ){

        return "historia-clinica";

    }

    if(
        texto.includes("estudio") &&
        texto.includes("medico")
    ){

        return "estudios-medicos";

    }

    if(
        texto.includes("documentacion-complementaria") ||
        texto.includes("documentos-complementarios")
    ){

        return "documentacion-complementaria";

    }

    return this.normalizarClave(
        categoria
    ) || "otros";

},



/* =========================================================
   AGRUPAR ARCHIVOS
========================================================= */

agruparArchivos(archivos){

    return archivos.reduce(
        (grupos, archivo) => {

            const categoria =
                archivo.categoria ||
                "otros";

            if(!grupos[categoria]){

                grupos[categoria] = [];

            }

            grupos[categoria].push(
                archivo
            );

            return grupos;

        },
        {}
    );

},



/* =========================================================
   RENDER DE GRUPO DOCUMENTAL
========================================================= */

renderGrupoAnexos(
    categoria,
    archivos
){

    if(
        !Array.isArray(archivos) ||
        !archivos.length
    ){

        return "";

    }

    return `

        <section
            class="grupo-anexo"
            data-categoria="${this.escaparHtml(
                categoria
            )}"
        >

            <h4 class="grupo-anexo-titulo">

                ${this.escaparHtml(
                    this.obtenerTituloCategoria(
                        categoria
                    )
                )}

            </h4>

            <div class="galeria-anexos">

                ${archivos
                    .map(
                        archivo =>
                            this.renderArchivo(
                                archivo
                            )
                    )
                    .join("")}

            </div>

        </section>
    `;

},



/* =========================================================
   TÍTULOS DE CATEGORÍAS
========================================================= */

obtenerTituloCategoria(categoria){

    const titulos = {

        "dni":
            "Documento Nacional de Identidad",

        "dni-frente":
            "Documento Nacional de Identidad — Frente",

        "dni-dorso":
            "Documento Nacional de Identidad — Dorso",

        "certificados":
            "Certificados",

        "constancias-tratamiento":
            "Constancias de tratamiento",

        "consentimiento":
            "Consentimiento informado",

        "historia-clinica":
            "Historia clínica",

        "estudios-medicos":
            "Estudios médicos",

        "documentacion-complementaria":
            "Documentación complementaria",

        "otros":
            "Otros documentos"

    };

    return (
        titulos[categoria] ||
        this.formatearEtiqueta(
            categoria
        )
    );

},



/* =========================================================
   RENDER DE ARCHIVO
========================================================= */

renderArchivo(archivo){

    const url =
        String(
            archivo?.url || ""
        ).trim();

    if(!url){

        return "";

    }

    const nombre =
        archivo.nombre ||
        this.obtenerNombreArchivo(
            url
        );

    const tipo =
        String(
            archivo.tipo || ""
        ).toLowerCase();

    const urlLimpia =
        url
            .toLowerCase()
            .split("?")[0]
            .split("#")[0];

    const pdf =
        tipo.includes("pdf") ||
        urlLimpia.endsWith(".pdf");

    const imagen =
        tipo.startsWith("image/") ||
        this.esImagen(
            url
        );

    const fecha =
        archivo.fecha
            ? this.formatearFechaHora(
                archivo.fecha
            )
            : "";

    if(pdf){

        return this.renderArchivoPdf(
            archivo,
            nombre,
            fecha
        );

    }

    if(imagen){

        return this.renderArchivoImagen(
            archivo,
            nombre,
            fecha
        );

    }

    return this.renderArchivoGenerico(
        archivo,
        nombre,
        fecha
    );

},



/* =========================================================
   RENDER PDF
========================================================= */

renderArchivoPdf(
    archivo,
    nombre,
    fecha
){

    return `

        <article class="anexo-item anexo-item-pdf">

            <div class="anexo-pdf">

                <span class="anexo-pdf-icono">
                    PDF
                </span>

                <strong class="anexo-nombre">

                    ${this.escaparHtml(
                        nombre
                    )}

                </strong>

                ${
                    fecha
                        ? `
                            <small class="anexo-fecha">
                                ${this.escaparHtml(
                                    fecha
                                )}
                            </small>
                        `
                        : ""
                }

                <a
                    href="${this.escaparHtml(
                        archivo.url
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="anexo-enlace"
                >
                    Abrir documento
                </a>

            </div>

        </article>
    `;

},



/* =========================================================
   RENDER IMAGEN
========================================================= */

renderArchivoImagen(
    archivo,
    nombre,
    fecha
){

    return `

        <figure class="anexo-item anexo-item-imagen">

            <a
                href="${this.escaparHtml(
                    archivo.url
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="anexo-imagen-enlace"
                title="Abrir imagen en tamaño completo"
            >

                <img
                    src="${this.escaparHtml(
                        archivo.url
                    )}"
                    alt="${this.escaparHtml(
                        nombre
                    )}"
                    class="anexo-imagen"
                    loading="lazy"
                >

            </a>

            <figcaption class="anexo-descripcion">

                <strong class="anexo-nombre">

                    ${this.escaparHtml(
                        nombre
                    )}

                </strong>

                ${
                    fecha
                        ? `
                            <span class="anexo-fecha">
                                ${this.escaparHtml(
                                    fecha
                                )}
                            </span>
                        `
                        : ""
                }

            </figcaption>

        </figure>
    `;

},



/* =========================================================
   RENDER ARCHIVO GENÉRICO
========================================================= */

renderArchivoGenerico(
    archivo,
    nombre,
    fecha
){

    return `

        <article class="anexo-item anexo-item-generico">

            <div class="anexo-generico-icono">
                ARCHIVO
            </div>

            <strong class="anexo-nombre">

                ${this.escaparHtml(
                    nombre
                )}

            </strong>

            ${
                fecha
                    ? `
                        <small class="anexo-fecha">
                            ${this.escaparHtml(
                                fecha
                            )}
                        </small>
                    `
                    : ""
            }

            <a
                href="${this.escaparHtml(
                    archivo.url
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="anexo-enlace"
            >
                Abrir archivo
            </a>

        </article>
    `;

},

/* =========================================================
   EVENTOS DEL VIEWER
========================================================= */

vincularEventos(){

    document
        .getElementById(
            "botonVolver"
        )
        ?.addEventListener(
            "click",
            () => {

                this.volverCentroProfesional();

            }
        );

    document
        .getElementById(
            "botonImprimir"
        )
        ?.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

    document.addEventListener(
        "keydown",
        evento => {

            if(
                evento.key === "Escape"
            ){

                const modalAbierto =
                    document.querySelector(
                        ".modal-anexo.is-open"
                    );

                if(modalAbierto){

                    modalAbierto.remove();

                }

            }

        }
    );

},



/* =========================================================
   VOLVER AL CENTRO PROFESIONAL
========================================================= */

volverCentroProfesional(){

    const urlAnterior =
        document.referrer;

    if(
        urlAnterior &&
        urlAnterior !== window.location.href
    ){

        try{

            const origenAnterior =
                new URL(
                    urlAnterior
                ).origin;

            if(
                origenAnterior ===
                window.location.origin
            ){

                window.history.back();

                return;

            }

        }

        catch(error){

            console.warn(
                "No se pudo interpretar la URL anterior:",
                error
            );

        }

    }

    window.location.href =
        "index.html";

},



/* =========================================================
   MOSTRAR ESTADO DE CARGA
========================================================= */

mostrarCarga(
    mensaje =
        "Cargando expediente digital…"
){

    const estadoCarga =
        document.getElementById(
            "estadoCarga"
        );

    const expediente =
        document.getElementById(
            "expediente"
        );

    if(expediente){

        expediente.hidden = true;

    }

    if(!estadoCarga){

        return;

    }

    estadoCarga.hidden = false;

    estadoCarga.innerHTML = `

        <div class="estado-carga-contenido">

            <div
                class="estado-carga-spinner"
                aria-hidden="true"
            ></div>

            <p>
                ${this.escaparHtml(
                    mensaje
                )}
            </p>

        </div>
    `;

},



/* =========================================================
   OCULTAR ESTADO DE CARGA
========================================================= */

ocultarCarga(){

    const estadoCarga =
        document.getElementById(
            "estadoCarga"
        );

    const expediente =
        document.getElementById(
            "expediente"
        );

    if(estadoCarga){

        estadoCarga.hidden = true;

    }

    if(expediente){

        expediente.hidden = false;

    }

},



/* =========================================================
   MOSTRAR ERROR
========================================================= */

mostrarError(mensaje){

    const estadoCarga =
        document.getElementById(
            "estadoCarga"
        );

    const expediente =
        document.getElementById(
            "expediente"
        );

    if(expediente){

        expediente.hidden = true;

    }

    if(!estadoCarga){

        console.error(
            mensaje ||
            "Ocurrió un error inesperado."
        );

        return;

    }

    estadoCarga.hidden = false;

    estadoCarga.innerHTML = `

        <section
            class="estado-error"
            role="alert"
        >

            <span
                class="estado-error-icono"
                aria-hidden="true"
            >
                !
            </span>

            <h2>
                No se pudo abrir el expediente
            </h2>

            <p>
                ${this.escaparHtml(
                    mensaje ||
                    "Ocurrió un error inesperado."
                )}
            </p>

            <div class="estado-error-acciones">

                <button
                    type="button"
                    id="reintentarExpediente"
                >
                    Reintentar
                </button>

                <button
                    type="button"
                    id="volverDesdeError"
                >
                    ← Volver al Centro Profesional
                </button>

            </div>

        </section>
    `;

    document
        .getElementById(
            "reintentarExpediente"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.reload();

            }
        );

    document
        .getElementById(
            "volverDesdeError"
        )
        ?.addEventListener(
            "click",
            () => {

                this.volverCentroProfesional();

            }
        );

},



/* =========================================================
   VALIDAR EXPEDIENTE
========================================================= */

validarExpediente(expediente){

    if(
        !expediente ||
        typeof expediente !== "object"
    ){

        throw new Error(
            "El expediente recibido no es válido."
        );

    }

    return true;

},



/* =========================================================
   LIMPIAR VIEWER
========================================================= */

limpiar(){

    this.expediente = null;

    this.datos = {};

    this.documentos = {};

    const indice =
        document.getElementById(
            "indiceCapitulos"
        );

    const capitulos =
        document.getElementById(
            "capitulos"
        );

    if(indice){

        indice.innerHTML = "";

    }

    if(capitulos){

        capitulos.innerHTML = "";

    }

},



/* =========================================================
   INFORMACIÓN DE DEPURACIÓN
========================================================= */

obtenerEstado(){

    return {

        version:
            "1.2",

        expedienteCargado:
            Boolean(
                this.expediente
            ),

        expedienteId:
            this.expediente?.id ||
            null,

        estado:
            this.expediente?.estado ||
            null,

        modulosTotales:
            this.modulos.length,

        modulosCompletados:
            this.contarModulosCompletados(),

        documentosDetectados:
            this.extraerArchivos(
                this.documentos
            ).length

    };

}

};



/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoExpedienteViewer =
    FalcoExpedienteViewer;



/* =========================================================
   INICIALIZACIÓN AUTOMÁTICA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoExpedienteViewer
            .mostrarCarga();

        FalcoExpedienteViewer
            .init();

    }
);