/* =========================
   AION STATES ENGINE®
========================= */

const AionStates = {

    current: "gold",

    states: {

        gold: {
            name: "Reposo",
            core: "#d4af37",
            particle: "#d4af37",
            glow: "rgba(212,175,55,"
        },

        blue: {
            name: "Analizando",
            core: "#5aaaff",
            particle: "#5aaaff",
            glow: "rgba(90,170,255,"
        },

        green: {
            name: "Conocimiento",
            core: "#5affaa",
            particle: "#5affaa",
            glow: "rgba(90,255,170,"
        },

        violet: {
            name: "Creando",
            core: "#be78ff",
            particle: "#be78ff",
            glow: "rgba(190,120,255,"
        },

        white: {
            name: "Respuesta",
            core: "#fff6d2",
            particle: "#fff6d2",
            glow: "rgba(255,250,235,"
        }

    },

    set(state){

        if(this.states[state]){
            this.current = state;
        }

    },

    get(){

        return this.states[this.current];

    }

};