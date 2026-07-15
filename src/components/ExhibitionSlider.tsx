import { useEffect, useRef, useState } from "react";

export type ExhibitionSlide = {
  title: string;
  tag: string;
  image: string;
  description: string;
  href?: string;
};

type ExhibitionSliderProps = {
  slides: ExhibitionSlide[];
  ariaLabel?: string;
};

export default function ExhibitionSlider({ slides, ariaLabel = "Exhibition gallery" }: ExhibitionSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [active, setActive] = useState(0);

  const sync = (index: number, smooth = true) => {
    const viewport = viewportRef.current;
    const target = slideRefs.current[index];
    if (!viewport || !target) return;

    const viewportRect = viewport.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const delta = targetRect.left - viewportRect.left - (viewportRect.width - targetRect.width) / 2;

    viewport.scrollTo({
      left: viewport.scrollLeft + delta,
      behavior: smooth ? "smooth" : "auto",
    });
    setActive(index);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const viewportRect = viewport.getBoundingClientRect();
      const center = viewportRect.left + viewportRect.width / 2;
      let nextActive = 0;
      let nextDistance = Infinity;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(center - (rect.left + rect.width / 2));
        if (distance < nextDistance) {
          nextDistance = distance;
          nextActive = index;
        }
      });

      setActive(nextActive);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      viewport.scrollLeft += event.deltaY;
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("wheel", onWheel, { passive: false });
    sync(0, false);

    return () => {
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("wheel", onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="exhibition-slider" aria-label={ariaLabel}>
      <button className="exhibition-arrow exhibition-arrow-prev" type="button" aria-label="Previous project" onClick={() => sync(Math.max(active - 1, 0))}>
        ‹
      </button>
      <div className="exhibition-viewport" ref={viewportRef}>
        <div className="exhibition-track">
          {slides.map((slide, index) => (
            <a
              key={`${slide.title}-${index}`}
              className={`exhibition-slide${index === active ? " is-active" : ""}`}
              href={slide.href || "#"}
              aria-current={index === active}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              onClick={(event) => {
                if (index !== active) {
                  event.preventDefault();
                  sync(index);
                }
              }}
            >
              <img src={slide.image} alt={slide.title} />
              <div>
                <span>{slide.tag}</span>
                <h4>{slide.title}</h4>
                <p>{slide.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <button className="exhibition-arrow exhibition-arrow-next" type="button" aria-label="Next project" onClick={() => sync(Math.min(active + 1, slides.length - 1))}>
        ›
      </button>
      <div className="exhibition-dots" aria-label="Gallery navigation">
        {slides.map((slide, index) => (
          <button
            key={`${slide.title}-dot`}
            className={index === active ? "is-active" : ""}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => sync(index)}
          />
        ))}
      </div>
    </div>
  );
}
