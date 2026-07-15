import { useEffect, useRef, useState } from "react";
import "./PinnedEditorialPortfolio.css";

type PortfolioCase = {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  image: string;
  description: string;
};

const cases: PortfolioCase[] = [
  {
    id: "01",
    title: "MEASURED",
    subtitle: "Growth System",
    label: "METHOD / EVIDENCE / ITERATION",
    image: "/assets/case-ai-growth.jpg",
    description: "从观察、拆解、设计与测试出发，把内容判断转化为可验证的增长结果。",
  },
  {
    id: "02",
    title: "AI CONTENT",
    subtitle: "Growth",
    label: "SCIENTIFIC RESEARCH / CONTENT SYSTEM",
    image: "/assets/case-research.jpg",
    description: "将高信息密度科研项目转译为国际学生能够理解、相信并行动的内容语言。",
  },
  {
    id: "03",
    title: "QUANTUM",
    subtitle: "Gallery",
    label: "AI VIDEO / DIGITAL EXHIBITION",
    image: "/assets/case-quantum.jpg",
    description: "把抽象量子概念转化为具有节奏、空间感与沉浸感的数字展览内容。",
  },
  {
    id: "04",
    title: "RESEARCH",
    subtitle: "Operations",
    label: "USER INSIGHT / CONVERSION / DISTRIBUTION",
    image: "/assets/case-storytelling.jpg",
    description: "从申请场景、用户动机和平台反馈中建立科研传播与获客链路。",
  },
  {
    id: "05",
    title: "BRAND",
    subtitle: "Strategy",
    label: "POSITIONING / NARRATIVE / VISUAL SYSTEM",
    image: "/assets/case-brand.jpg",
    description: "连接品牌判断、未来技术和编辑设计，建立冷静且可识别的内容系统。",
  },
];

export default function PinnedEditorialPortfolio() {
  const stageRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const stage = stageRef.current;
      if (!stage || window.innerWidth <= 768) return;
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 0.9999);
      setActiveIndex(Math.floor(progress * cases.length));
    };
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const current = cases[activeIndex];

  return (
    <section ref={stageRef} className="pep-stage" id="editorial-portfolio">
      <div className="pep-sticky">
        <div className="pep-preview-window">
          <div className="pep-browser-bar">
            <div className="pep-browser-dots"><span /><span /><span /></div>
            <span className="pep-browser-url">archive.guoxuantong / case-{current.id}</span>
            <span className="pep-browser-status"><i /> LIVE INDEX</span>
          </div>
          <div className="pep-preview is-switching">
            <div className="pep-preview-copy">
              <p className="pep-case-label">{current.label}</p>
              <div className="pep-title-mask">
                <h2><span>{current.title}</span><em>{current.subtitle}</em></h2>
              </div>
              <p className="pep-description">{current.description}</p>
            </div>
            <figure className="pep-image-mask">
              <img className="pep-image" src={current.image} alt={`${current.title} ${current.subtitle}`} />
              <figcaption className="pep-case-number">{current.id}</figcaption>
            </figure>
          </div>
        </div>

        <div className="pep-editorial-panel">
          <div className="pep-editorial-heading">
            <div>
              <p className="pep-eyebrow">04 / CORE CAPABILITIES + 05 / MEASURED GROWTH</p>
              <h2>How I Solve Problems<br /><em>Measured Growth</em></h2>
            </div>
            <div className="pep-identity">
              <span className="pep-avatar">GX</span>
              <div>
                <strong>郭宣潼 / GUO XUANTONG</strong>
                <p>AI Content Growth Strategist<br />Research Communication / Future Media</p>
              </div>
            </div>
          </div>

          <div className="pep-evidence">
            <div className="pep-project-evidence is-active">
              <span className="pep-evidence-number">{current.id}</span>
              <div>
                <p className="pep-evidence-label">CURATED PRACTICE / ACTIVE CASE</p>
                <h3>{current.title} {current.subtitle}</h3>
                <p>{current.description}</p>
              </div>
            </div>
          </div>

          <div className="pep-card-stack">
            {cases.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`pep-case-card${activeIndex === index ? " is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <span>{item.id}</span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
