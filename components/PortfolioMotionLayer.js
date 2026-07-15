(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = [...document.querySelectorAll("main > section[data-motion-section]")];

  if (!sections.length) return;

  root.classList.add("portfolio-motion-enabled");

  const revealItems = new Set();
  const parallaxItems = [];

  sections.forEach((section) => {
    section.querySelectorAll("[data-motion-content], [data-reveal]").forEach((item) => {
      revealItems.add(item);
    });

    section.querySelectorAll("[data-stagger]").forEach((group) => {
      [...group.children].forEach((child, index) => {
        child.classList.add("motion-card");
        child.dataset.reveal = "stagger-item";
        child.style.setProperty("--motion-delay", `${Math.min(index * 85, 510)}ms`);
        revealItems.add(child);
      });
    });

    section.querySelectorAll("[data-reveal='title']").forEach((title) => {
      title.classList.add("motion-title");
    });

    section.querySelectorAll("[data-reveal='media']").forEach((media) => {
      media.classList.add("motion-media");
      revealItems.add(media);
    });

    section.querySelectorAll("[data-parallax-card]").forEach((item) => {
      parallaxItems.push(item);
    });
  });

  const showAll = () => {
    sections.forEach((section) => section.classList.add("is-motion-visible"));
    revealItems.forEach((item) => item.classList.add("is-motion-visible"));
  };

  const revealVisibleItems = () => {
    const viewportHeight = Math.max(window.innerHeight, 1);

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.98 && rect.bottom > 0) {
        section.classList.add("is-motion-visible");
      }
    });

    revealItems.forEach((item) => {
      if (item.classList.contains("is-motion-visible")) return;
      const rect = item.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.96 && rect.bottom > viewportHeight * 0.02) {
        item.classList.add("is-motion-visible");
      }
    });
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-motion-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.04,
    rootMargin: "0px 0px -8% 0px",
  });

  const itemObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-motion-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -6% 0px",
  });

  sections.forEach((section) => sectionObserver.observe(section));
  revealItems.forEach((item) => itemObserver.observe(item));

  let frameRequested = false;

  const updateParallax = () => {
    const viewportHeight = Math.max(window.innerHeight, 1);

    revealVisibleItems();

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;

      const center = rect.top + rect.height / 2;
      const normalized = Math.max(-1, Math.min(1, (center - viewportHeight / 2) / viewportHeight));
      const y = normalized * -10;
      const scale = 1 + (1 - Math.abs(normalized)) * 0.008;

      item.style.setProperty("--motion-parallax-y", `${y.toFixed(2)}px`);
      item.style.setProperty("--motion-parallax-scale", scale.toFixed(4));
    });

    frameRequested = false;
  };

  const requestParallax = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateParallax);
  };

  requestParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);

  requestAnimationFrame(revealVisibleItems);
})();
