import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CinematicCaseGallery.css";

type CaseItem = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  description: string;
};

export default function CinematicCaseGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const cases = useMemo<CaseItem[]>(
    () => [
      {
        id: "01",
        title: "AI CONTENT",
        subtitle: "Growth System",
        tag: "Strategy / Operation / AIGC",
        image: "/assets/case-ai-growth.jpg",
        description: "为高信任、长决策周期的科研教育产品设计内容增长与用户转化系统。",
      },
      {
        id: "02",
        title: "QUANTUM",
        subtitle: "Gallery Project",
        tag: "AI Video / Digital Exhibition",
        image: "/assets/case-quantum.jpg",
        description: "将抽象量子概念转译为具有空间感、节奏感和沉浸感的数字展览内容。",
      },
      {
        id: "03",
        title: "RESEARCH",
        subtitle: "Operations",
        tag: "Research / Conversion / Topic Design",
        image: "/assets/case-research.jpg",
        description: "把高信息密度的科研项目重组为国际学生能够理解、相信并行动的内容叙事。",
      },
      {
        id: "04",
        title: "BRAND",
        subtitle: "Strategy",
        tag: "Creative Direction / Brand System",
        image: "/assets/case-brand.jpg",
        description: "连接未来技术、品牌判断和编辑设计，建立冷静且可识别的视觉表达系统。",
      },
      {
        id: "05",
        title: "DIGITAL",
        subtitle: "Storytelling",
        tag: "Narrative / Experience / Future Media",
        image: "/assets/case-storytelling.jpg",
        description: "以数字媒介组织信息、情绪与空间，让复杂主题成为可感知的体验。",
      },
    ],
    [],
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.9999);
      section.style.setProperty("--ccg-scroll", progress.toFixed(4));
      section.style.setProperty("--ccg-shell-scale", String(0.96 + Math.min(progress * 0.08, 0.04)));
      setActive(Math.floor(progress * cases.length));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [cases.length]);

  const current = cases[active];

  const selectCase = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const travel = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: sectionTop + travel * ((index + 0.12) / cases.length),
      behavior: "smooth",
    });
    setActive(index);
  };

  return (
    <section ref={sectionRef} className="ccg-gallery" aria-labelledby="ccg-editorial-title">
      <div className="ccg-sticky">
        <div className="ccg-preview-shell">
          <div className="ccg-browser-bar">
            <div className="ccg-browser-dots" aria-hidden="true"><span /><span /><span /></div>
            <div className="ccg-browser-url">archive.guoxuantong/case-{current.id}</div>
            <div className="ccg-browser-status"><span />LIVE</div>
          </div>

          <div key={current.id} className="ccg-preview is-changing" aria-live="polite">
            <div className="ccg-preview-copy">
              <p className="ccg-kicker">{current.tag}</p>
              <h2>{current.title}<br /><em>{current.subtitle}</em></h2>
              <p className="ccg-description">{current.description}</p>
              <div
                className="ccg-progress"
                aria-hidden="true"
                style={{ "--ccg-active": (active + 1) / cases.length } as React.CSSProperties}
              />
            </div>
            <figure className="ccg-image-wrap">
              <img className="ccg-image" src={current.image} alt={`${current.title} ${current.subtitle}`} />
              <figcaption className="ccg-number">{current.id}</figcaption>
            </figure>
          </div>
        </div>

        <div className="ccg-editorial-panel">
          <header className="ccg-editorial-header">
            <div>
              <p className="ccg-eyebrow">SELECTED WORKS / CINEMATIC INDEX</p>
              <h2 id="ccg-editorial-title">AI CONTENT<br />GROWTH DESIGN</h2>
            </div>
            <span className="ccg-portfolio-pill">EDITORIAL PORTFOLIO</span>
          </header>

          <div className="ccg-editorial-meta">
            <div className="ccg-avatar-orb" aria-hidden="true"><span>GX</span></div>
            <div>
              <p className="ccg-meta-title">AI Content Growth Strategist / Research Communication</p>
              <p className="ccg-meta-description">观察用户与平台，解码内容动机，再将研究、技术和品牌转化为可传播的数字系统。</p>
            </div>
          </div>

          <div className="ccg-case-grid" role="tablist" aria-label="Cinematic cases">
            {cases.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={`ccg-case-card${index === active ? " is-active" : ""}`}
                onClick={() => selectCase(index)}
              >
                <span>{item.id}</span>
                <strong>{item.title}</strong>
                <p>{item.tag}</p>
              </button>
            ))}
          </div>

          <div className="ccg-moving-type" aria-hidden="true">
            <span>AI STRATEGY / DIGITAL STORYTELLING / RESEARCH OPERATIONS / BRAND SYSTEM / FUTURE MEDIA / AI STRATEGY / DIGITAL STORYTELLING / RESEARCH OPERATIONS / BRAND SYSTEM / FUTURE MEDIA / </span>
          </div>
        </div>
      </div>
    </section>
  );
}
