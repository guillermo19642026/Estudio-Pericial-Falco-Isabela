/* =========================
   RESPONSE ENGINE™
========================= */

window.ResponseEngine={

    build(investigation){

        const node=investigation.mainNode;

        if(!node){

            return{

                title:"Sin resultados",

                html:"<p>No se encontró conocimiento relacionado.</p>",

                sources:[]

            };

        }

        return{

            title:node.titulo,

            html:`

<h3>Definición</h3>

<p>${node.descripcion}</p>

<h3>Aplicación</h3>

<p>

Esta respuesta fue construida utilizando el
Corpus FALCO® y podrá enriquecerse con nuevas
Unidades de Conocimiento.

</p>

<h3>Estado</h3>

<p>

${node.estado}

</p>

`,

            sources:investigation.sources

        };

    }

};