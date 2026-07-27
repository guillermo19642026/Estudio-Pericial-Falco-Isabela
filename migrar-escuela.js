/* =========================================================
   ESCUELA PARA PADRES FALCO®
   MIGRACIÓN INICIAL A FIRESTORE
   Ejecutar una sola vez
========================================================= */

import {
    db
} from "./firebase-config.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const encuentros = {

    1: {

        titulo:
            "Comprender la adolescencia",

        descripcion:
            "Una introducción a los cambios físicos, emocionales, psicológicos y vinculares propios de la adolescencia.",

        introduccion:
            "Este encuentro propone comprender los principales cambios físicos, emocionales, sociales y vinculares que atraviesan los adolescentes, reconociendo sus nuevas necesidades evolutivas.",

        objetivos: [
            "Comprender los cambios propios de la adolescencia.",
            "Reconocer las nuevas necesidades emocionales y vinculares.",
            "Incorporar herramientas para acompañar esta etapa."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: true,

        videoUrl:
            "https://youtu.be/WCho7jEDE04",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo1/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo1/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo1/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo1/recursos.pdf",

        encuesta: true

    },


    2: {

        titulo:
            "Comunicación efectiva",

        descripcion:
            "Herramientas para escuchar, comprender y construir una comunicación familiar más clara y respetuosa.",

        introduccion:
            "Este encuentro aborda herramientas para mejorar la comunicación con los adolescentes mediante la escucha activa, las preguntas abiertas y el diálogo respetuoso.",

        objetivos: [
            "Fortalecer la escucha activa.",
            "Favorecer conversaciones familiares respetuosas.",
            "Reconocer formas de comunicación que dificultan el vínculo."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: true,

        videoUrl:
            "https://youtu.be/OKk_VZ9UIG8",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo2/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo2/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo2/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo2/recursos.pdf",

        encuesta: true

    },


    3: {

        titulo:
            "Emociones y autoestima",

        descripcion:
            "Recursos para acompañar la expresión emocional y favorecer una autoestima saludable durante la adolescencia.",

        introduccion:
            "Este encuentro propone comprender la vida emocional de los adolescentes y acompañar la construcción de una autoestima saludable.",

        objetivos: [
            "Reconocer y validar las emociones adolescentes.",
            "Favorecer el reconocimiento de fortalezas personales.",
            "Acompañar la construcción de una autoestima saludable."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: true,

        videoUrl:
            "https://youtu.be/dyOhU4rP8Do",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo3/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo3/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo3/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo3/recursos.pdf",

        encuesta: true

    },


    4: {

        titulo:
            "Identidad y pertenencia",

        descripcion:
            "Un recorrido por la construcción de la identidad, los grupos de pertenencia y la necesidad de autonomía.",

        introduccion:
            "Este encuentro aborda la construcción de la identidad adolescente, la influencia del grupo de pares y la búsqueda progresiva de autonomía.",

        objetivos: [
            "Comprender el proceso de construcción de identidad.",
            "Analizar la importancia del grupo de pertenencia.",
            "Acompañar la autonomía progresiva."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: false,

        videoUrl:
            "",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo4/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo4/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo4/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo4/recursos.pdf",

        encuesta: true

    },


    5: {

        titulo:
            "Redes sociales y tecnología",

        descripcion:
            "Orientaciones para acompañar el uso de pantallas, redes sociales y entornos digitales de manera responsable.",

        introduccion:
            "Este encuentro ofrece criterios para acompañar el uso de pantallas, redes sociales y tecnologías, promoviendo acuerdos familiares y prevención de riesgos digitales.",

        objetivos: [
            "Comprender el lugar de la tecnología en la adolescencia.",
            "Promover un uso saludable de pantallas y redes.",
            "Prevenir riesgos en los entornos digitales."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: false,

        videoUrl:
            "",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo5/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo5/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo5/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo5/recursos.pdf",

        encuesta: true

    },


    6: {

        titulo:
            "Límites saludables",

        descripcion:
            "Criterios para establecer límites claros, consistentes y respetuosos sin deteriorar el vínculo familiar.",

        introduccion:
            "Este encuentro trabaja la construcción de límites saludables mediante normas claras, autoridad respetuosa y consecuencias educativas.",

        objetivos: [
            "Diferenciar límites de autoritarismo.",
            "Establecer normas familiares claras y consistentes.",
            "Aplicar consecuencias educativas y respetuosas."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: false,

        videoUrl:
            "",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo6/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo6/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo6/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo6/recursos.pdf",

        encuesta: true

    },


    7: {

        titulo:
            "Salud mental adolescente",

        descripcion:
            "Indicadores para reconocer cambios emocionales, situaciones de riesgo y momentos en los que conviene consultar.",

        introduccion:
            "Este encuentro brinda orientación para reconocer factores protectores, señales de alerta y situaciones en las que resulta conveniente solicitar ayuda profesional.",

        objetivos: [
            "Reconocer factores protectores de la salud mental.",
            "Identificar señales de alerta.",
            "Comprender cuándo solicitar ayuda profesional."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: false,

        videoUrl:
            "",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo7/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo7/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo7/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo7/recursos.pdf",

        encuesta: true

    },


    8: {

        titulo:
            "Proyecto de vida y cierre",

        descripcion:
            "Integración de los aprendizajes y acompañamiento del adolescente en la construcción de su proyecto personal.",

        introduccion:
            "Este encuentro integra los aprendizajes del recorrido y propone herramientas para acompañar intereses, fortalezas, autonomía y proyecto de vida.",

        objetivos: [
            "Reconocer intereses y fortalezas personales.",
            "Acompañar la construcción del proyecto de vida.",
            "Integrar los aprendizajes del recorrido formativo."
        ],

        duracion:
            "2 horas y 30 minutos",

        estado:
            "publicado",

        video: false,

        videoUrl:
            "",

        cuadernillo: true,

        cuadernilloUrl:
            "escuela/modulo8/cuadernillo.pdf",

        actividad: true,

        actividadUrl:
            "escuela/modulo8/actividad.pdf",

        presentacion: true,

        presentacionUrl:
            "escuela/modulo8/presentacion.pptx",

        recursos: true,

        recursosUrl:
            "escuela/modulo8/recursos.pdf",

        encuesta: true

    }

};


async function migrarEscuela(){

    const confirmar = window.confirm(
        "¿Deseás cargar los 8 encuentros en Firestore?"
    );

    if(!confirmar){

        console.log(
            "Migración cancelada."
        );

        return;

    }

    try{

        console.log(
            "Iniciando migración de encuentros..."
        );

        for(
            const [numero, datos]
            of Object.entries(encuentros)
        ){

            const referencia = doc(
                db,
                "escuela_encuentros",
                `modulo${numero}`
            );

            await setDoc(
                referencia,
                datos,
                {
                    merge: true
                }
            );

            console.log(
                `Módulo ${numero} migrado correctamente.`
            );

        }

        console.log(
            "Escuela para Padres FALCO® migrada correctamente."
        );

        alert(
            "Los 8 encuentros fueron cargados correctamente."
        );

    }catch(error){

        console.error(
            "Error durante la migración:",
            error
        );

        alert(
            "No se pudo completar la migración. Revisá la consola."
        );

    }

}


migrarEscuela();