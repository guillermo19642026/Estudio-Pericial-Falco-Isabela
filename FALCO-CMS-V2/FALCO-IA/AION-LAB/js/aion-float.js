/* ==========================================================
   AION FLOAT™
   Sistema FALCO®
   Versión reutilizable
========================================================== */

const AionFloat = {

    container: null,
    being: null,
    eyes: null,

    blinkTimer: null,
    idleTimer: null,

    init() {

        if (document.querySelector(".aion-float")) return;

        this.create();

        this.startBlink();

        this.startIdle();

        this.bind();

        console.log("AION FLOAT™ Ready");

    },

    create() {

        this.container = document.createElement("div");

        this.container.className = "aion-float";

        this.container.innerHTML = `

<div class="aion-float-label">

AION Engine™

</div>

<div class="aion-float-being">

<div class="aion-float-halo"></div>

<div class="aion-float-sphere">

<div class="aion-float-eyes">

<span class="aion-float-eye"></span>

<span class="aion-float-eye"></span>

</div>

</div>

</div>

`;

        document.body.appendChild(this.container);

        this.being = this.container.querySelector(".aion-float-being");

        this.eyes = this.container.querySelector(".aion-float-eyes");

    },

    bind() {

        document.addEventListener("mousemove", e => {

            const rect = this.being.getBoundingClientRect();

            const cx = rect.left + rect.width / 2;

            const cy = rect.top + rect.height / 2;

            let dx = (e.clientX - cx) * .05;

            let dy = (e.clientY - cy) * .05;

            dx = Math.max(-5, Math.min(5, dx));

            dy = Math.max(-5, Math.min(5, dy));

            this.eyes.style.transform =
                `translate(-50%,-50%) translate(${dx}px,${dy}px)`;

        });

        this.container.addEventListener("mouseenter", () => {

            this.being.classList.add("is-thinking");

        });

        this.container.addEventListener("mouseleave", () => {

            this.being.classList.remove("is-thinking");

        });

        this.container.addEventListener("click", () => {

            this.speak();

        });

    },

    speak() {

        this.being.classList.add("is-speaking");

        clearTimeout(this.speakingTimeout);

        this.speakingTimeout = setTimeout(() => {

            this.being.classList.remove("is-speaking");

        }, 1800);

    },

    blink() {

        this.being.classList.add("is-blinking");

        setTimeout(() => {

            this.being.classList.remove("is-blinking");

        }, 120);

    },

    startBlink() {

        this.blinkTimer = setInterval(() => {

            if (Math.random() > .55)

                this.blink();

        }, 2800);

    },

    startIdle() {

        this.idleTimer = setInterval(() => {

            const x = (Math.random() * 10) - 5;

            const y = (Math.random() * 8) - 4;

            this.eyes.style.transform =
                `translate(-50%,-50%) translate(${x}px,${y}px)`;

        }, 6000);

    }

};

document.addEventListener("DOMContentLoaded", () => {

    AionFloat.init();

});