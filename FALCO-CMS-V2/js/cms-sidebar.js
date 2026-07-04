function marcarActivoSidebar() {
  const paginaActual = window.location.pathname.split("/").pop();

  document.querySelectorAll(".cms-v2-nav a").forEach(link => {
    const destino = link.getAttribute("href");

    if (destino === paginaActual) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

marcarActivoSidebar();