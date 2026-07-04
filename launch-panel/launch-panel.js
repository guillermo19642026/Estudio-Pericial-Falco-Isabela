document.addEventListener("DOMContentLoaded", () => {

    const modules=document.querySelectorAll(".launch-status div");

    const led=document.querySelector(".launch-led");

    const status=document.querySelector(".launch-system-status");

    if(!modules.length) return;

    modules.forEach(m=>m.classList.remove("launch-active"));

    let i=0;

    function boot(){

        if(i<modules.length){

            modules[i].classList.add("launch-active");

            i++;

            setTimeout(boot,280);

        }else{

            led.classList.add("online");

            status.innerHTML=''

            status.innerHTML='<span class="launch-led online"></span>Sistema operativo';

            startLoop();

        }

    }

    function startLoop(){

        let current=0;

        setInterval(()=>{

            modules.forEach(m=>m.classList.remove("launch-active"));

            modules[current].classList.add("launch-active");

            current++;

            if(current>=modules.length){

                current=0;

            }

        },1800);

    }

    setTimeout(boot,500);

});