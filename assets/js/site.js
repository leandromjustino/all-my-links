(() => {
  const CONFIG = {
    youtube: "https://www.youtube.com/@leandromjustino",
    instagram: "https://www.instagram.com/leandromjustino/"
  };

  document.querySelectorAll("[data-social]").forEach((link) => {
    const key = link.dataset.social;
    if (CONFIG[key]) link.href = CONFIG[key];
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const navWrap = document.querySelector("[data-nav-wrap]");

  if (menuButton && navWrap) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navWrap.classList.toggle("open", !isOpen);
      document.body.classList.toggle("no-scroll", !isOpen);
    });

    navWrap.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        navWrap.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  document.querySelectorAll("[data-video-placeholder]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#") event.preventDefault();
    });
  });

  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    const parent = img.closest(".portrait-frame, .editorial-image, .donate-portrait");
    const showFallback = () => parent?.classList.add("image-missing");
    img.addEventListener("error", showFallback);
    if (img.complete && img.naturalWidth === 0) showFallback();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
    }
  }

  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
