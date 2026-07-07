/* =========================
   AION CORE ENGINE®
========================= */

const AionCore = {

    status: "idle",

    init(){
        this.status = "idle";
        AionStates.set("gold");
    },

    idle(){
        this.status = "idle";
        AionStates.set("gold");
    },

    thinking(){
        this.status = "thinking";
        AionStates.set("blue");
    },

    success(){
        this.status = "success";
        AionStates.set("green");
    },

    creating(){
        this.status = "creating";
        AionStates.set("violet");
    },

    speaking(){
        this.status = "speaking";
        AionStates.set("white");
    },

    getStatus(){
        return this.status;
    }

};