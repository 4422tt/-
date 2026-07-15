(() => {
  const root = document.querySelector("#cinematic-case-gallery-root");
  if (!root) return;

  const cases = [
    {
      id: "01",
      title: "AI CONTENT",
      subtitle: "Growth System",
      tag: "Strategy / Operation / AIGC",
      image: "public/assets/case-ai-growth.jpg",
      description: "为高信任、长决策周期的科研教育产品设计内容增长与用户转化系统。",
    },
    {
      id: "02",
      title: "QUANTUM",
      subtitle: "Gallery Project",
      tag: "AI Video / Digital Exhibition",
      image: "public/assets/case-quantum.jpg",
      description: "将抽象量子概念转译为具有空间感、节奏感和沉浸感的数字展览内容。",
    },
    {
      id: "03",
      title: "RESEARCH",
      subtitle: "Operations",
      tag: "Research / Conversion / Topic Design",
      image: "public/assets/case-research.jpg",
      description: "把高信息密度的科研项目重组为国际学生能够理解、相信并行动的内容叙事。",
    },
    {
      id: "04",
      title: "BRAND",
      subtitle: "Strategy",
      tag: "Creative Direction / Brand System",
      image: "public/assets/case-brand.jpg",
      description: "连接未来技术、品牌判断和编辑设计，建立冷静且可识别的视觉表达系统。",
    },
    {
      id: "05",
      title: "DIGITAL",
      subtitle: "Storytelling",
      tag: "Narrative / Experience / Future Media",
      image: "public/assets/case-storytelling.jpg",
      description: "以数字媒介组织信息、情绪与空间，让复杂主题成为可感知的体验。",
    },
  ];

  root.innerHTML = `
    <section class="ccg-gallery" aria-labelledby="ccg-editorial-title">
      <div class="ccg-sticky">
        <div class="ccg-preview-shell">
          <div class="ccg-browser-bar">
            <div class="ccg-browser-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="ccg-browser-url">archive.guoxuantong/case-01</div>
            <div class="ccg-browser-status"><span></span>LIVE</div>
          </div>
          <div class="ccg-preview" aria-live="polite">
            <div class="ccg-preview-copy">
              <p class="ccg-kicker"></p>
              <h2><span class="ccg-title"></span><br><em class="ccg-subtitle"></em></h2>
              <p class="ccg-description"></p>
              <div class="ccg-progress" aria-hidden="true"></div>
            </div>
            <figure class="ccg-image-wrap">
              <img class="ccg-image" alt="">
              <figcaption class="ccg-number"></figcaption>
            </figure>
          </div>
        </div>

        <div class="ccg-editorial-panel">
          <header class="ccg-editorial-header">
            <div>
              <p class="ccg-eyebrow">SELECTED WORKS / CINEMATIC INDEX</p>
              <h2 id="ccg-editorial-title">AI CONTENT<br>GROWTH DESIGN</h2>
            </div>
            <span class="ccg-portfolio-pill">EDITORIAL PORTFOLIO</span>
          </header>

          <div class="ccg-editorial-meta">
            <div class="ccg-avatar-orb" aria-hidden="true"><span>GX</span></div>
            <div>
              <p class="ccg-meta-title">AI Content Growth Strategist / Research Communication</p>
              <p class="ccg-meta-description">观察用户与平台，解码内容动机，再将研究、技术和品牌转化为可传播的数字系统。</p>
            </div>
          </div>

          <div class="ccg-case-grid" role="tablist" aria-label="Cinematic cases"></div>

          <div class="ccg-moving-type" aria-hidden="true">
            <span>AI STRATEGY / DIGITAL STORYTELLING / RESEARCH OPERATIONS / BRAND SYSTEM / FUTURE MEDIA / AI STRATEGY / DIGITAL STORYTELLING / RESEARCH OPERATIONS / BRAND SYSTEM / FUTURE MEDIA / </span>
          </div>
        </div>
      </div>
    </section>
  `;

  const section = root.querySelector(".ccg-gallery");
  const preview = root.querySelector(".ccg-preview");
  const shell = root.querySelector(".ccg-preview-shell");
  const url = root.querySelector(".ccg-browser-url");
  const kicker = root.querySelector(".ccg-kicker");
  const title = root.querySelector(".ccg-title");
  const subtitle = root.querySelector(".ccg-subtitle");
  const description = root.querySelector(".ccg-description");
  const image = root.querySelector(".ccg-image");
  const number = root.querySelector(".ccg-number");
  const progress = root.querySelector(".ccg-progress");
  const grid = root.querySelector(".ccg-case-grid");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeIndex = -1;
  let ticking = false;

  grid.innerHTML = cases.map((item, index) => `
    <button class="ccg-case-card" type="button" role="tab" aria-selected="false" data-index="${index}">
      <span>${item.id}</span>
      <strong>${item.title}</strong>
      <p>${item.tag}</p>
    </button>
  `).join("");

  const cards = [...grid.querySelectorAll(".ccg-case-card")];

  const renderCase = (index) => {
    const nextIndex = Math.max(0, Math.min(cases.length - 1, index));
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;
    const current = cases[nextIndex];

    preview.classList.remove("is-changing");
    void preview.offsetWidth;
    kicker.textContent = current.tag;
    title.textContent = current.title;
    subtitle.textContent = current.subtitle;
    description.textContent = current.description;
    image.src = current.image;
    image.alt = `${current.title} ${current.subtitle}`;
    number.textContent = current.id;
    url.textContent = `archive.guoxuantong/case-${current.id}`;
    preview.classList.add("is-changing");

    cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === nextIndex;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-selected", String(isActive));
    });
  };

  const updateFromScroll = () => {
    const rect = section.getBoundingClientRect();
    const total = Math.max(1, rect.height - window.innerHeight);
    const scrollProgress = Math.min(Math.max(-rect.top / total, 0), 0.9999);
    const nextIndex = Math.floor(scrollProgress * cases.length);
    section.style.setProperty("--ccg-scroll", scrollProgress.toFixed(4));
    progress.style.setProperty("--ccg-active", `${(nextIndex + 1) / cases.length}`);
    shell.style.setProperty("--ccg-shell-scale", String(0.96 + Math.min(scrollProgress * 0.08, 0.04)));
    renderCase(nextIndex);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFromScroll);
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const travel = Math.max(0, section.offsetHeight - window.innerHeight);
      const target = sectionTop + travel * ((index + 0.12) / cases.length);
      window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
      renderCase(index);
    });
  });

  renderCase(0);
  updateFromScroll();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();
