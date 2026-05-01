(function () {
  function closeMenu(header, button, nav) {
    header.classList.remove("mobile-nav-open");
    button.setAttribute("aria-expanded", "false");
    nav.setAttribute("aria-hidden", "true");
  }

  function openMenu(header, button, nav) {
    header.classList.add("mobile-nav-open");
    button.setAttribute("aria-expanded", "true");
    nav.setAttribute("aria-hidden", "false");
  }

  function initMobileNav() {
    const header = document.querySelector(".site-header");
    const button = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav-links");

    if (!header || !button || !nav) {
      return;
    }

    closeMenu(header, button, nav);

    button.addEventListener("click", function () {
      const isOpen = header.classList.contains("mobile-nav-open");
      if (isOpen) {
        closeMenu(header, button, nav);
      } else {
        openMenu(header, button, nav);
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(header, button, nav);
      });
    });

    document.addEventListener("click", function (event) {
      if (window.innerWidth > 980) {
        return;
      }
      if (!header.contains(event.target)) {
        closeMenu(header, button, nav);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) {
        header.classList.remove("mobile-nav-open");
        button.setAttribute("aria-expanded", "false");
        nav.removeAttribute("aria-hidden");
        return;
      }
      if (!header.classList.contains("mobile-nav-open")) {
        nav.setAttribute("aria-hidden", "true");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }
})();
