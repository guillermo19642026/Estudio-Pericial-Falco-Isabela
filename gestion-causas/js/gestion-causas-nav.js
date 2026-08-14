document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const navLinks =
    document.querySelectorAll(
      ".gc-nav__link"
    );

  if (!navLinks.length) {
    return;
  }

  const currentUrl =
    new URL(window.location.href);

  navLinks.forEach((link) => {
    link.classList.remove(
      "is-active"
    );
  });

  const activeLink =
    [...navLinks].find((link) => {
      const linkUrl =
        new URL(
          link.href,
          window.location.href
        );

      return (
        linkUrl.pathname ===
          currentUrl.pathname &&
        linkUrl.search ===
          currentUrl.search
      );
    });

  activeLink?.classList.add(
    "is-active"
  );

  console.log(
    "Gestión de Causas FALCO® Navegación Ready"
  );
});