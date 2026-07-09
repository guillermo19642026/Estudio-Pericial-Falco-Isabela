/* =========================================================
   AION EXPERIENCE™ v1.0
========================================================= */

window.AION_DISABLE_AUTO = true;

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

const pulse = document.getElementById("pulse");
const reveal = document.getElementById("aionReveal");

const texts = [

    "No toda presencia necesita un rostro.",

    "Algunas simplemente están."

];

function showText(text){

    title.classList.remove("show");

    setTimeout(()=>{

        title.textContent = text;

        title.classList.add("show");

    },400);

}

function hideText(){

    title.classList.remove("show");

}

function showSubtitle(text){

    subtitle.textContent = text;

    subtitle.classList.add("show");

}

function startExperience(){

    /* ACTO 0 */

    showText(texts[0]);

    /* ACTO 1 */

    setTimeout(()=>{

        showText(texts[1]);

    },5000);

    /* ACTO 2 */

    setTimeout(()=>{

        hideText();

        pulse.classList.add("expand");

    },10000);

    /* ACTO 3 */

    setTimeout(()=>{

        reveal.classList.add("show");

    },11800);

    /* ACTO 4 */

    setTimeout(()=>{

        title.textContent="AION™";

        title.classList.add("show");

        showSubtitle("Living Presence Engine™");

    },14500);

}

window.addEventListener("load",startExperience);