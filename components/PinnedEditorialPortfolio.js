(() => {
  const root = document.querySelector("#pinned-editorial-portfolio-root");
  if (!root) return;

  const cases = [
    {
      id: "01",
      title: "OPERATING",
      subtitle: "System",
      label: "OBSERVE / DECODE / TRANSLATE / PROVE / ITERATE",
      image: "public/assets/case-ai-growth.jpg",
      description: "从观察、拆解、设计与测试出发，把内容判断转化为可验证的增长结果。",
      accent: "Content systems, not isolated posts.",
    },
    {
      id: "02",
      title: "AI CONTENT",
      subtitle: "Growth",
      label: "SCIENTIFIC RESEARCH / CONTENT SYSTEM",
      image: "public/assets/case-research.jpg",
      description: "将高信息密度科研项目转译为国际学生能够理解、相信并行动的内容语言。",
      accent: "Scientific Research Content Growth",
    },
    {
      id: "03",
      title: "QUANTUM",
      subtitle: "Gallery",
      label: "AI VIDEO / DIGITAL EXHIBITION",
      image: "public/assets/case-quantum.jpg",
      description: "把抽象量子概念转化为具有节奏、空间感与沉浸感的数字展览内容。",
      accent: "Quantum Digital Exhibition",
    },
    {
      id: "04",
      title: "RESEARCH",
      subtitle: "Operations",
      label: "USER INSIGHT / CONVERSION / DISTRIBUTION",
      image: "public/assets/case-storytelling.jpg",
      description: "从申请场景、用户动机和平台反馈中建立科研传播与获客链路。",
      accent: "Research Operations",
    },
    {
      id: "05",
      title: "BRAND",
      subtitle: "Strategy",
      label: "POSITIONING / NARRATIVE / VISUAL SYSTEM",
      image: "public/assets/case-brand.jpg",
      description: "连接品牌判断、未来技术和编辑设计，建立冷静且可识别的内容系统。",
      accent: "Brand Strategy",
    },
  ];

  const methodItems = [
    ["01", "OBSERVE", "观察用户真实需求与具体使用场景。", "skill-1-title", "skill-1-1"],
    ["02", "DECODE", "拆解情绪、身份、申请焦虑与商业动机。", "skill-2-title", "skill-2-1"],
    ["03", "TRANSLATE", "把科研、AI 与国际组织转译成愿意停留的内容入口。", "skill-3-title", "skill-3-1"],
    ["04", "PROVE", "用点击、私信、留资与销售反馈验证内容是否成立。", "skill-4-title", "skill-4-1"],
    ["05", "ITERATE", "持续修正选题、视觉、人设与转化承接链路。", "skill-5-title", "skill-5-1"],
  ];

  const metricItems = [
    ["Commercial Operation", "424", "万", "门店节点销售额，区域排名第一", "metric-1-label"],
    ["Content Experiment", "10000", "+", "个人小红书账号两个月累计点赞量", "metric-2-label"],
  ];

  const supportingPanels = [
    ["02", "AI Content Growth", "从热点切入，从专业方向建立价值感，再从申请场景完成转化。", "Research translation / Topic design / Acquisition"],
    ["03", "Quantum Gallery", "Concept：量子概念可视化。Tool：AI视频生成、图像生成与后期剪辑。", "Digital exhibition / AI visual / Spatial narrative"],
    ["04", "Research Operations", "观察用户、平台与行业变化，建立选题、内容、咨询和转化之间的系统。", "User insight / Platform test / Conversion"],
    ["05", "Brand Strategy", "把定位、视觉与叙事组织为一致的品牌表达，而不是分散的发布动作。", "Positioning / Editorial system / Future media"],
  ];

  const methodMarkup = methodItems.map(([number, title, copy, titleId, copyId]) => `
    <article class="pep-method-item">
      <span>${number}</span>
      <h3 data-edit-id="${titleId}">${title}</h3>
      <p data-edit-id="${copyId}">${copy}</p>
    </article>
  `).join("");

  const metricMarkup = metricItems.map(([category, value, suffix, copy, editId]) => `
    <article class="pep-metric-item">
      <span>${category}</span>
      <strong data-counter="${value}" data-suffix="${suffix}">${Number(value).toLocaleString("en-US")}${suffix}</strong>
      <p data-edit-id="${editId}">${copy}</p>
    </article>
  `).join("");

  const evidenceMarkup = `
    <div class="pep-evidence-panel is-active" data-evidence="0">
      <div class="pep-method-grid">${methodMarkup}</div>
    </div>
    ${supportingPanels.map(([number, title, copy, meta], index) => `
      <div class="pep-evidence-panel pep-project-evidence" data-evidence="${index + 1}">
        <span class="pep-evidence-number">${number}</span>
        <div>
          <p class="pep-evidence-label">CASE NOTE / CURATED PRACTICE</p>
          <h3>${title}</h3>
          <p>${copy}</p>
          <span class="pep-evidence-meta">${meta}</span>
        </div>
      </div>
    `).join("")}
  `;

  root.innerHTML = `
    <section class="pep-stage" id="editorial-portfolio" aria-labelledby="pep-heading">
      <div class="pep-sticky">
        <div class="pep-preview-window">
          <div class="pep-browser-bar">
            <div class="pep-browser-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            <span class="pep-browser-url">archive.guoxuantong / case-01</span>
            <span class="pep-browser-status"><i></i> LIVE INDEX</span>
          </div>
          <div class="pep-preview" aria-live="polite">
            <div class="pep-preview-copy">
              <p class="pep-case-label"></p>
              <div class="pep-title-mask">
                <h2><span class="pep-title"></span><em class="pep-subtitle"></em></h2>
              </div>
              <p class="pep-description"></p>
              <span class="pep-accent-title"></span>
            </div>
            <figure class="pep-image-mask">
              <img class="pep-image" alt="">
              <figcaption class="pep-case-number"></figcaption>
            </figure>
          </div>
        </div>

        <div class="pep-editorial-panel">
          <div class="pep-editorial-heading">
            <div>
              <p class="pep-eyebrow" data-edit-id="skills-index">OPERATING SYSTEM</p>
              <h2 id="pep-heading"><span data-edit-id="skills-title">How I Turn Complex</span><br><em data-edit-id="metrics-title">Into Content Systems</em></h2>
            </div>
            <div class="pep-identity">
              <span class="pep-avatar" aria-hidden="true">GX</span>
              <div>
                <strong>郭宣潼 / GUO XUANTONG</strong>
                <p>AI Content Growth Strategist<br>Research Communication / Future Media</p>
              </div>
            </div>
          </div>

          <div class="pep-evidence">
            <p class="pep-system-intro" data-edit-id="skills-intro">How I turn complex research, AI and education products into content systems. 这不是通用方法论，而是我从用户判断走到内容证据的一套工作系统。</p>
            ${evidenceMarkup}
          </div>

          <div class="pep-card-stack" role="tablist" aria-label="Editorial portfolio cases">
            ${cases.map((item, index) => `
              <button class="pep-case-card${index === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-case-index="${index}">
                <span>${item.id}</span>
                <strong>${item.title}</strong>
                <small>${item.subtitle}</small>
              </button>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="pep-mobile-list">
        <header>
          <p>PINNED EDITORIAL PORTFOLIO</p>
          <h2>Operating System<br>& Curated Cases</h2>
        </header>
        ${cases.map((item, index) => `
          <article class="pep-mobile-case">
            <div>
              <span>${item.id} / ${item.label}</span>
              <h3>${item.title}<br><em>${item.subtitle}</em></h3>
              <p>${item.description}</p>
            </div>
            <img src="${item.image}" alt="${item.accent}">
            ${index === 0 ? `
              <div class="pep-mobile-methods">${methodMarkup}</div>
            ` : ""}
          </article>
        `).join("")}
      </div>
    </section>
  `;

  const stage = root.querySelector(".pep-stage");
  const sticky = root.querySelector(".pep-sticky");
  const preview = root.querySelector(".pep-preview");
  const title = root.querySelector(".pep-title");
  const subtitle = root.querySelector(".pep-subtitle");
  const label = root.querySelector(".pep-case-label");
  const description = root.querySelector(".pep-description");
  const accent = root.querySelector(".pep-accent-title");
  const image = root.querySelector(".pep-image");
  const number = root.querySelector(".pep-case-number");
  const url = root.querySelector(".pep-browser-url");
  const cards = [...root.querySelectorAll(".pep-case-card")];
  const evidencePanels = [...root.querySelectorAll(".pep-evidence-panel")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopQuery = window.matchMedia("(min-width: 769px)");

  let activeIndex = -1;
  let frameRequested = false;

  const renderCase = (index) => {
    const nextIndex = Math.max(0, Math.min(cases.length - 1, index));
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;
    const item = cases[nextIndex];

    preview.classList.remove("is-switching");
    void preview.offsetWidth;
    label.textContent = item.label;
    title.textContent = item.title;
    subtitle.textContent = item.subtitle;
    description.textContent = item.description;
    accent.textContent = item.accent;
    image.src = item.image;
    image.alt = item.accent;
    number.textContent = item.id;
    url.textContent = `archive.guoxuantong / case-${item.id}`;
    preview.classList.add("is-switching");

    cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === nextIndex;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-selected", String(isActive));
    });

    evidencePanels.forEach((panel, panelIndex) => {
      panel.classList.toggle("is-active", panelIndex === nextIndex);
    });
  };

  const updateStage = () => {
    if (!desktopQuery.matches) {
      frameRequested = false;
      return;
    }

    const rect = stage.getBoundingClientRect();
    const travel = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(Math.max(-rect.top / travel, 0), 0.9999);
    const index = Math.floor(progress * cases.length);
    const localProgress = (progress * cases.length) % 1;

    sticky.style.setProperty("--pep-progress", progress.toFixed(4));
    sticky.style.setProperty("--pep-local", localProgress.toFixed(4));
    renderCase(index);
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateStage);
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const stageTop = window.scrollY + stage.getBoundingClientRect().top;
      const travel = Math.max(0, stage.offsetHeight - window.innerHeight);
      const target = stageTop + travel * ((index + 0.08) / cases.length);
      window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
      renderCase(index);
    });
  });

  renderCase(0);
  updateStage();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  desktopQuery.addEventListener?.("change", requestUpdate);
})();
