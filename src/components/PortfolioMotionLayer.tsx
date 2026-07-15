import { useEffect } from "react";
import "../styles/portfolio-motion.css";

export default function PortfolioMotionLayer() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[data-motion-section]"),
    );
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main > section[data-motion-section] [data-motion-content], main > section[data-motion-section] [data-reveal]",
      ),
    );
    const parallaxItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main > section[data-motion-section] [data-parallax-card]",
      ),
    );

    root.classList.add("portfolio-motion-enabled");

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        const item = child as HTMLElement;
        item.classList.add("motion-card");
        item.dataset.reveal = "stagger-item";
        item.style.setProperty("--motion-delay", `${Math.min(index * 85, 510)}ms`);
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-motion-visible"));
      revealItems.forEach((item) => item.classList.add("is-motion-visible"));
      return () => root.classList.remove("portfolio-motion-enabled");
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-motion-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -8% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    revealItems.forEach((item) => observer.observe(item));

    let frameRequested = false;
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

    const updateParallax = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      revealVisibleItems();
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const normalized = Math.max(
          -1,
          Math.min(1, (center - viewportHeight / 2) / viewportHeight),
        );
        item.style.setProperty("--motion-parallax-y", `${(normalized * -10).toFixed(2)}px`);
        item.style.setProperty(
          "--motion-parallax-scale",
          (1 + (1 - Math.abs(normalized)) * 0.008).toFixed(4),
        );
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

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("resize", requestParallax);
      root.classList.remove("portfolio-motion-enabled");
    };
  }, []);

  return null;
}
