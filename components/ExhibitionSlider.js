(() => {
  const sliders = [...document.querySelectorAll("[data-exhibition-slider]")];
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const viewport = slider.querySelector(".exhibition-viewport");
    const slides = [...slider.querySelectorAll("[data-slider-slide]")];
    const dots = [...slider.querySelectorAll("[data-slider-dot]")];
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");
    let active = 0;
    let pointerDown = false;
    let startX = 0;
    let startScroll = 0;
    let raf = 0;

    const clamp = (value) => Math.max(0, Math.min(slides.length - 1, value));

    const sync = (index = active, smooth = true) => {
      active = clamp(index);
      const target = slides[active];
      if (!target) return;

      const viewportRect = viewport.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const delta = targetRect.left - viewportRect.left - (viewportRect.width - targetRect.width) / 2;

      viewport.scrollTo({
        left: viewport.scrollLeft + delta,
        behavior: smooth ? "smooth" : "auto",
      });

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === active);
        slide.setAttribute("aria-current", slideIndex === active ? "true" : "false");
      });

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    };

    const updateFromScroll = () => {
      raf = 0;
      const viewportRect = viewport.getBoundingClientRect();
      const center = viewportRect.left + viewportRect.width / 2;
      let closest = 0;
      let distance = Infinity;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const nextDistance = Math.abs(center - slideCenter);
        if (nextDistance < distance) {
          closest = index;
          distance = nextDistance;
        }
      });

      if (closest !== active) sync(closest, false);
    };

    viewport.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(updateFromScroll);
    }, { passive: true });

    viewport.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      viewport.scrollLeft += event.deltaY;
    }, { passive: false });

    viewport.addEventListener("pointerdown", (event) => {
      pointerDown = true;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      viewport.setPointerCapture?.(event.pointerId);
      slider.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!pointerDown) return;
      viewport.scrollLeft = startScroll - (event.clientX - startX);
    });

    const stopDrag = (event) => {
      if (!pointerDown) return;
      pointerDown = false;
      viewport.releasePointerCapture?.(event.pointerId);
      slider.classList.remove("is-dragging");
      updateFromScroll();
      sync(active);
    };

    viewport.addEventListener("pointerup", stopDrag);
    viewport.addEventListener("pointercancel", stopDrag);
    viewport.addEventListener("pointerleave", stopDrag);

    prev?.addEventListener("click", () => sync(active - 1));
    next?.addEventListener("click", () => sync(active + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => sync(index));
    });

    slides.forEach((slide, index) => {
      slide.addEventListener("click", (event) => {
        if (index !== active) {
          event.preventDefault();
          sync(index);
        }
      });
    });

    sync(0, false);
  });
})();
