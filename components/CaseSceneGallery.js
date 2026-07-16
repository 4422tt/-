(() => {
  const root = document.querySelector("#case-scene-gallery-root");
  if (!root) return;

  const STORAGE_KEY = "guo-xuantong-portfolio-v3";
  const editorAccess = new URLSearchParams(window.location.search).get("edit") === "1";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const readPortfolioState = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  };

  const writePortfolioState = (nextState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const getStoredMedia = (mediaId) => {
    const state = readPortfolioState();
    const media = state.media || {};
    return Array.isArray(media[mediaId]) ? media[mediaId] : [];
  };

  const getSlideImage = (slide) => {
    const media = getStoredMedia(slide.mediaId);
    return media.length ? media[media.length - 1].src : slide.image;
  };

  const projectSlides = [
    {
      title: "Paid Research Product Content System",
      tag: "Scientific Research / Xiaohongshu",
      mediaId: "research-growth-system",
      image: "assets/research-growth-poster.png",
      copy: "把科研产品从课题名转译为申请价值、导师背书、成果可见性和咨询转化路径。",
      href: "#data-room",
    },
    {
      title: "UN Internship Content System",
      tag: "International Organizations",
      mediaId: "un-internship-system",
      image: "assets/international-crowd-poster.png",
      copy: "展示联合国实习账号数据、内容策略、用户定位与转化路径：用户购买的不是目的地，而是国际组织履历与未来路径。",
      href: "#data-room",
    },
    {
      title: "KOS Persona Lab",
      tag: "Research Worker / Digital Life",
      mediaId: "kos-persona-lab",
      image: "public/images/cetus-research/kos-digital-life/kos-digital-life-01.png",
      copy: "用两种人格化账号测试用户对科研、AI、前沿科技与申请焦虑的接受方式。",
      href: "#project-3-evidence-live",
    },
    {
      title: "AI Quantum Exhibition",
      tag: "AI Creative / Digital Exhibition",
      mediaId: "quantum-exhibition",
      image: "assets/quantum-star-map.png",
      copy: "把抽象量子概念转译成可观看、可进入、可记住的数字展览叙事。",
      href: "#quantum-exhibition",
    },
  ];

  const dataEvidenceCards = [
    {
      title: "Research Account Evidence",
      eyebrow: "科研项目",
      tag: "RESEARCH GROWTH",
      mediaId: "evidence-research-account",
      image: "assets/research-growth-poster.png",
      metrics: ["内容选题与封面测试", "蓝V / KOL账号运营", "科研课题包装"],
      insight: "用热点切入建立注意力，再用申请价值、导师背书和可见成果完成信任转化。",
    },
    {
      title: "UN Internship Evidence",
      tag: "UN CONTENT SYSTEM",
      mediaId: "evidence-un-account",
      image: "assets/international-crowd-poster.png",
      metrics: ["账号冷启动", "用户定位重构", "内容 → 咨询 → 转化"],
      insight: "从旅游化视觉转向国际组织履历、身份想象和职业路径，让用户更快理解项目价值。",
    },
  ];

  const defaultMetrics = [
    { id: "topic-tests", label: "内容选题与封面测试", value: "100", suffix: "+", copy: "围绕科研、AI、国际组织方向持续验证内容表达" },
    { id: "account-ops", label: "蓝V + KOL账号运营", value: "1+2", suffix: "", copy: "覆盖品牌账号与达人账号的内容节奏和增长承接" },
    { id: "research-packaging", label: "科研课题包装", value: "多系列", suffix: "", copy: "把专业课题拆成申请、就业、背景提升可理解价值" },
    { id: "ai-workflow", label: "AI-assisted content workflow", value: "AI", suffix: "", copy: "用 AI 辅助选题、脚本、视觉、视频创意和复盘效率" },
  ];

  const normalizeMetric = (metric, index) => {
    if (Array.isArray(metric)) {
      const [label, value, suffix, copy] = metric;
      return { id: `metric-${index + 1}`, label, value, suffix, copy };
    }
    return {
      id: metric?.id || `metric-${index + 1}`,
      label: metric?.label || "Metric",
      value: metric?.value || "0",
      suffix: metric?.suffix || "",
      copy: metric?.copy || "",
    };
  };

  const getMetrics = () => {
    const state = readPortfolioState();
    const saved = Array.isArray(state.caseMetrics) && state.caseMetrics.length
      ? state.caseMetrics
      : defaultMetrics;
    return saved.map(normalizeMetric);
  };

  let metrics = getMetrics();

  const expertise = [
    ["01", "AI 内容增长 / 科研传播 / 未来媒体", "Position"],
    ["02", "资本市场、科技新闻、高校科研趋势", "Signals"],
    ["03", "国际生理解、收藏、咨询与转化", "Demand"],
  ];

  const capabilities = [
    ["01", "趋势选题", "股市热点 / 科技新闻 / 高校动态 → 科研课题内容"],
    ["02", "内容增长", "小红书标题、封面、评论区、朋友圈、公众号长文"],
    ["03", "AI工作流", "AI辅助选题、文案、视觉、网页、视频创意"],
    ["04", "科研产品转译", "把复杂课题讲成申请、就业、背景提升价值"],
  ];

  const trendRows = [
    ["半导体 / CPO / PCB", "电子信息 / 通信工程 / AI芯片", "把产业链热点转译为可申请、可就业、可展示成果的科研方向。"],
    ["脑机接口 / Neuralink / Brain2Qwerty", "神经科学 / 生物医学工程 / 信号处理", "用技术新闻建立兴趣，再把热点落到专业方向和课题选择。"],
    ["医学AI / 基因组", "智能医学 / 生物信息 / 药物发现", "把复杂医学技术拆成国际生能理解的科研价值和未来路径。"],
  ];

  const trendServiceRows = [
    {
      number: "01",
      signal: "半导体 / CPO / PCB",
      topic: "电子信息 / 通信工程 / AI芯片",
      value: "把产业链热点转译为可申请、可就业、可展示成果的科研方向。",
    },
    {
      number: "02",
      signal: "脑机接口 / Neuralink / Brain2Qwerty",
      topic: "神经科学 / 生物医学工程 / 信号处理",
      value: "用技术新闻建立兴趣，再把热点落到专业方向和课题选择。",
    },
    {
      number: "03",
      signal: "医学AI / 基因组 / 多组学",
      topic: "智能医学 / 生物信息 / 药物发现",
      value: "把复杂医学技术拆成国际生能理解的科研价值和未来路径。",
    },
    {
      number: "04",
      signal: "AI Agent / 自动化工作流",
      topic: "人机协作 / 数据分析 / 内容系统",
      value: "把AI工具从噱头转译为具体的学习、研究和内容生产能力。",
    },
  ];

  const caseCards = [
    {
      title: "Paid Research Product Content System",
      tag: "Research Product Growth",
      lines: [
        ["Context", "科研产品信息密度高，用户真正关心的是申请价值和可见成果。"],
        ["Strategy", "用热点切入、专业方向建立价值感，再用导师背书和成果转化信任。"],
        ["Output", "选题矩阵、封面系统、咨询承接话术和复盘表。"],
        ["Result", "让复杂科研项目变成可理解、可收藏、可咨询的内容系统。"],
      ],
    },
    {
      title: "International Organization Content System",
      tag: "Official Account / Persona Account",
      lines: [
        ["Context", "国际组织产品需要同时处理权威感、履历想象与用户的低信任阈值。"],
        ["Strategy", "用蓝V承接权威和投放，用KOS降低机构感并做兴趣教育。"],
        ["Output", "官方账号层、人格化账号层与国际组织内容转化路径。"],
        ["Result", "把地点想象转译为国际组织履历、身份与未来路径。"],
      ],
    },
    {
      title: "KOS Persona Lab",
      tag: "Persona System / Content Testing",
      lines: [
        ["Context", "用户对科研内容的接受度会随着叙事角色和机构感变化。"],
        ["Strategy", "用科研民工与数字生命两种人设测试可信度、兴趣与前沿技术表达。"],
        ["Output", "真人科研叙事、AI未来科技选题与低机构感内容样本。"],
        ["Result", "识别不同用户对科研、AI和申请焦虑的内容接受方式。"],
      ],
    },
    {
      title: "AI Quantum Exhibition",
      tag: "AI Creative / Digital Exhibition",
      lines: [
        ["Context", "量子概念抽象，公共传播需要可感知的视觉入口。"],
        ["Strategy", "用 AI 视频和图像生成，把科学概念转化为沉浸式展厅内容。"],
        ["Output", "概念视觉、AI影像、展厅叙事和未来媒体风格实验。"],
        ["Result", "展示 AI 内容增长之外的数字叙事与科技美学能力。"],
      ],
    },
  ];

  const contentLibraryCategories = [
    ["all", "All samples"],
    ["research-trends", "Research Trends"],
    ["application-anxiety", "Application Anxiety"],
    ["kos-persona", "KOS Persona"],
    ["visual-hooks", "Visual Hooks"],
  ];

  const proofCards = [
    {
      mediaId: "library-public-health",
      title: "Public Health Research",
      category: "research-trends",
      categoryLabel: "Research Trends",
      image: "public/images/cetus-research/research-bluev/research-bluev-04.png",
      metric: "48 likes / precise niche signal",
      insight: "小众但精准，命中海外申研与申博用户对公共卫生方向、学术身份和专业稀缺感的需求。",
    },
    {
      mediaId: "library-bci",
      title: "Brain-Computer Interface",
      category: "research-trends",
      categoryLabel: "Research Trends",
      image: "public/images/cetus-research/research-bluev/research-bluev-05.png",
      metric: "584 likes / strong click signal",
      insight: "前沿科技关键词能拉高点击和咨询，但用户认知更高，也更考验后端专业承接。",
    },
    {
      mediaId: "library-ai-chip",
      title: "AI Chip & Frontier Research",
      category: "research-trends",
      categoryLabel: "Research Trends",
      image: "public/images/cetus-research/kos-digital-life/kos-digital-life-02.png",
      metric: "Frontier topic testing",
      insight: "把芯片与未来技术转译成可理解的科研路径，让用户感到方向具有长期价值。",
    },
    {
      mediaId: "library-application-anxiety",
      title: "Psychology Application Path",
      category: "application-anxiety",
      categoryLabel: "Application Anxiety",
      image: "public/images/cetus-research/research-bluev/research-bluev-06.png",
      metric: "54 likes / planning intent",
      insight: "把专业选择、背景提升和申请窗口放进同一叙事，回应用户对路径不确定性的焦虑。",
    },
    {
      mediaId: "library-un-internship",
      title: "UN Internship Narrative",
      category: "application-anxiety",
      categoryLabel: "Application Anxiety",
      image: "public/images/cetus-research/un-bluev/un-bluev-01.png",
      metric: "140 likes / 43 saves / 33 comments",
      insight: "国际组织内容卖的不是地点，而是履历想象、国际身份和未来路径感。",
    },
    {
      mediaId: "library-kos-research",
      title: "KOS Research Persona",
      category: "kos-persona",
      categoryLabel: "KOS Persona",
      image: "public/images/cetus-research/kos-research-worker/kos-research-worker-03.png",
      metric: "7,477 likes on leading post",
      insight: "真人化表达降低机构感，让科研产品更像真实经验分享，而不是硬广。",
    },
    {
      mediaId: "library-kos-un",
      title: "UN Persona Narrative",
      category: "kos-persona",
      categoryLabel: "KOS Persona",
      image: "public/images/cetus-research/kos-un/kos-un-02.png",
      metric: "Identity-driven interest",
      insight: "用个人视角讲职业路径和履历价值，让高门槛国际组织信息更容易进入用户语境。",
    },
    {
      mediaId: "library-visual-hook",
      title: "Biochemistry Visual Hook",
      category: "visual-hooks",
      categoryLabel: "Visual Hooks",
      image: "public/images/cetus-research/research-bluev/research-bluev-11.png",
      metric: "212 likes / cover-level stop signal",
      insight: "高对比标题、真实实验场景和清晰信息层级，共同完成首屏停留与方向识别。",
    },
  ];

  const renderGalleryEditPanel = () => `
    <div class="gallery-edit-panel" aria-label="Gallery edit controls">
      <button type="button" data-gallery-edit-entry>${editorAccess ? "添加照片" : "进入编辑模式"}</button>
      <span>${editorAccess ? "可给每张项目卡添加多张图片，当前卡片会显示最新一张。" : "打开编辑模式后，可直接给项目展厅添加图片。"}</span>
      <em data-gallery-edit-status></em>
    </div>
  `;

  const projectTagSets = [
    ["Paid Acquisition", "Lead Evidence", "Research Product"],
    ["Official Layer", "Persona Layer", "UN / NGO"],
    ["KOS Research Worker", "KOS Digital Life", "Persona Testing"],
    ["AI Visual", "Concept Translation", "Exhibition Narrative"],
  ];

  const renderProjectTags = (index) => {
    const tags = projectTagSets[index % projectTagSets.length];
    return tags.map((tag) => `<em>${tag}</em>`).join("");
  };

  const renderProjectGalleryActions = (slide) => {
    const mediaCount = getStoredMedia(slide.mediaId).length;
    return `
      <div class="gallery-edit-actions" aria-label="${slide.title} image controls">
        <button type="button" data-gallery-upload="${slide.mediaId}">Add image</button>
        <button type="button" data-gallery-clear="${slide.mediaId}">Reset</button>
        <small data-gallery-count>${mediaCount ? `Added ${mediaCount}` : "Default cover"}</small>
      </div>
    `;
  };

  const renderProjectStage = (slides) => {
    const visualSlides = slides.slice(0, 3);
    const cardSlides = slides.slice(0, 4);

    return `
      <div class="project-stage" data-project-stage>
        <div class="project-stage-status" aria-label="Project stage status">
          <span>Bounded showcase</span>
          <span>Archive / ${String(cardSlides.length).padStart(2, "0")}</span>
        </div>
        <div class="project-visual-grid" aria-label="Project visual previews">
          ${visualSlides.map((slide, index) => {
            const mediaCount = getStoredMedia(slide.mediaId).length;
            return `
              <article class="project-visual-card${index === 0 ? " is-featured" : ""}${mediaCount ? " has-custom-media" : ""}" data-project-stage-item data-gallery-media-id="${slide.mediaId}">
                <figure>
                  <img src="${getSlideImage(slide)}" alt="${slide.title}" data-gallery-image>
                </figure>
                <div class="project-visual-caption">
                  <span>${slide.tag}</span>
                  <strong>${slide.title}</strong>
                </div>
                ${renderProjectGalleryActions(slide)}
              </article>
            `;
          }).join("")}
        </div>
        <div class="project-stage-card-grid" aria-label="Project case summaries">
          ${cardSlides.map((slide, index) => {
            const mediaCount = getStoredMedia(slide.mediaId).length;
            return `
              <article class="project-evidence-card${index === 0 ? " is-highlight" : ""}${mediaCount ? " has-custom-media" : ""}" data-project-stage-item data-gallery-media-id="${slide.mediaId}">
                <span class="project-card-type">${slide.tag}</span>
                <h3>${slide.title}</h3>
                <p>${slide.copy}</p>
                <div class="project-card-tags" aria-label="${slide.title} tags">
                  ${renderProjectTags(index)}
                </div>
                ${renderProjectGalleryActions(slide)}
              </article>
            `;
          }).join("")}
        </div>
        <div class="project-stage-progress" aria-hidden="true">
          <span class="project-progress-track"><i data-project-progress></i></span>
        </div>
      </div>
    `;
  };

  const renderMetricEditPanel = () => editorAccess ? `
    <div class="metric-edit-panel" aria-label="Metric edit controls">
      <button type="button" data-metric-add>添加数据</button>
      <span>每张数据卡都可以编辑数字、单位、标题和说明。</span>
      <em data-metric-status></em>
    </div>
  ` : "";

  const renderMetrics = () => metrics.map((metric, index) => `
    <article class="case-kpi-card" data-metric-card="${metric.id}">
      <strong class="case-data-value"><span data-case-count="${metric.value}" data-case-suffix="">${metric.value}</span><em>${metric.suffix}</em></strong>
      <span>${metric.label}</span>
      <p>${metric.copy}</p>
      ${editorAccess ? `
        <div class="metric-edit-actions">
          <button type="button" data-metric-edit="${index}">编辑数据</button>
          <button type="button" data-metric-delete="${index}">删除</button>
        </div>
      ` : ""}
    </article>
  `).join("");

  const getEvidenceImages = (card) => {
    const media = getStoredMedia(card.mediaId);
    return media.length ? media : [{ src: card.image, alt: card.title }];
  };

  const renderEvidenceRollImages = (images, title) => images.map((image, index) => `
    <img
      src="${image.src}"
      alt="${image.alt || title}"
      class="${index === 0 ? "is-active" : ""}"
      data-gallery-image
      data-evidence-roll-image
    >
  `).join("");

  const renderDataEvidence = () => dataEvidenceCards.map((card) => {
    const mediaCount = getStoredMedia(card.mediaId).length;
    const evidenceImages = getEvidenceImages(card);
    return `
      <article class="data-evidence-card${mediaCount ? " has-custom-media" : ""}" data-gallery-media-id="${card.mediaId}">
        <figure class="evidence-roll-frame" data-evidence-roll>
          <div class="evidence-roll-track" data-evidence-roll-track>
            ${renderEvidenceRollImages(evidenceImages, card.title)}
          </div>
          <button class="evidence-roll-arrow evidence-roll-prev" type="button" data-evidence-roll-prev aria-label="Previous screenshot">‹</button>
          <button class="evidence-roll-arrow evidence-roll-next" type="button" data-evidence-roll-next aria-label="Next screenshot">›</button>
          <span class="evidence-roll-count" data-evidence-roll-count>1 / ${evidenceImages.length}</span>
        </figure>
        <div class="data-evidence-copy">
          ${card.eyebrow ? `<small class="data-evidence-project">${card.eyebrow}</small>` : ""}
          <span>${card.tag}</span>
          <h3>${card.title}</h3>
          <ul>
            ${card.metrics.map((metric) => `<li>${metric}</li>`).join("")}
          </ul>
          <p>${card.insight}</p>
        </div>
        <div class="gallery-edit-actions" aria-label="${card.title} image controls">
          <button type="button" data-gallery-upload="${card.mediaId}">添加截图</button>
          <button type="button" data-gallery-clear="${card.mediaId}">恢复默认</button>
          <small data-gallery-count>${mediaCount ? `已添加 ${mediaCount} 张` : "默认截图"}</small>
        </div>
      </article>
    `;
  }).join("");

  const renderExpertise = () => expertise.map(([number, text, label]) => `
    <article class="profile-fact">
      <span>${number}</span>
      <strong>${text}</strong>
      <p>${label}</p>
    </article>
  `).join("");

  const renderCapabilities = () => capabilities.map(([number, title, copy], index) => `
    <article class="capability-card${index === 0 ? " is-active" : ""}" data-capability-card tabindex="0" role="button" aria-pressed="${index === 0 ? "true" : "false"}">
      <span class="capability-tab"><em>${number}</em><strong>${title}</strong></span>
      <h3>${title}</h3>
      <p>${copy}</p>
    </article>
  `).join("");

  const renderTrendRows = () => trendServiceRows.map((row) => `
    <article class="trend-service-row" data-trend-row>
      <span class="trend-row-number">${row.number}</span>
      <div class="trend-row-cell">
        <span>TECH SIGNAL</span>
        <strong>${row.signal}</strong>
      </div>
      <div class="trend-row-cell">
        <span>ACADEMIC TRANSLATION</span>
        <strong>${row.topic}</strong>
      </div>
      <div class="trend-row-value">
        <span>STUDENT VALUE</span>
        <p>${row.value}</p>
      </div>
    </article>
  `).join("");

  const renderCaseCards = () => caseCards.map((card) => `
    <article class="strategy-case-card">
      <span>${card.tag}</span>
      <h3>${card.title}</h3>
      <dl>
        ${card.lines.map(([label, copy]) => `<div><dt>${label}</dt><dd>${copy}</dd></div>`).join("")}
      </dl>
    </article>
  `).join("");

  const renderContentLibraryFilters = () => contentLibraryCategories.map(([value, label], index) => `
    <button
      type="button"
      role="tab"
      aria-selected="${index === 0 ? "true" : "false"}"
      data-library-filter="${value}"
    >${label}</button>
  `).join("");

  const renderProofGallery = () => proofCards.map((card, index) => {
    const media = getStoredMedia(card.mediaId);
    const mediaCount = media.length;
    return `
      <article
        class="content-library-card${index === 0 ? " is-featured" : ""}${mediaCount ? " has-custom-media" : ""}"
        data-gallery-media-id="${card.mediaId}"
        data-library-category="${card.category}"
      >
        <figure>
          <img src="${mediaCount ? media[mediaCount - 1].src : card.image}" alt="${card.title}" data-gallery-image>
          <figcaption>${card.categoryLabel}</figcaption>
        </figure>
        <div class="content-library-copy">
          <span>${card.categoryLabel}</span>
          <h3>${card.title}</h3>
          <strong>${card.metric}</strong>
          <p>${card.insight}</p>
        </div>
        <div class="gallery-edit-actions" aria-label="${card.title} image controls">
          <button type="button" data-gallery-upload="${card.mediaId}">替换样本</button>
          <button type="button" data-gallery-clear="${card.mediaId}">恢复默认</button>
          <small data-gallery-count>${mediaCount ? `已添加 ${mediaCount} 张` : "精选内容样本"}</small>
        </div>
      </article>
    `;
  }).join("");

  root.innerHTML = `
    <div class="case-study-gallery${editorAccess ? " is-gallery-editing" : ""}" aria-label="Light editorial portfolio sections">
      <a class="gallery-edit-floating" href="${editorAccess ? "#projects" : "?edit=1#projects"}">${editorAccess ? "编辑模式：添加照片 / 数据" : "进入编辑模式"}</a>
      <section class="light-case-section project-showcase" id="projects" aria-labelledby="projects-showcase-title" data-cinematic-word="PROJECTS">
        <div class="light-section-shell">
          <div class="light-section-heading">
            <p class="light-section-label">03 / DIGITAL EXHIBITION & CASES</p>
            <h2 id="projects-showcase-title">Projects as<br>Curated Evidence</h2>
            <div class="projects-heading-copy" aria-label="Profile statement">
              <p>我关注 AI 内容增长、科研传播策略与内容系统搭建，把复杂项目转译成用户愿意停留、理解并行动的数字内容。</p>
              <p>我的方法不是单篇内容创作，而是从用户洞察、选题结构、视觉表达、投放测试到转化承接的完整增长链路。</p>
              <p>在科研教育、国际组织项目与 AI 创意内容之间，我持续寻找技术、内容与商业之间更清晰的连接方式。</p>
            </div>
          </div>
          <div class="project-showcase-panel">
            ${renderGalleryEditPanel()}
            ${renderProjectStage(projectSlides)}
            <input class="gallery-media-input" type="file" accept="image/png,image/jpeg,image/webp" multiple data-gallery-media-input hidden>
          </div>
          <div class="strategy-case-grid" aria-label="Case study cards">
            ${renderCaseCards()}
          </div>
        </div>
      </section>

      <section class="light-case-section capabilities-showcase" id="capabilities" aria-labelledby="capabilities-title" data-cinematic-word="SYSTEMS">
        <div class="light-section-shell">
          <div class="light-section-heading compact-heading">
            <p class="light-section-label">04 / CAPABILITIES</p>
            <h2 id="capabilities-title">How I Build<br>Content Systems</h2>
            <p>能力不是孤立技能，而是从趋势判断、内容结构、AI 工具到科研产品价值转译的组合系统。</p>
          </div>
          <div class="capability-grid">
            ${renderCapabilities()}
          </div>
        </div>
      </section>

      <section class="light-case-section trend-radar-showcase" id="trend-radar" aria-labelledby="trend-radar-title" data-cinematic-word="TREND RADAR">
        <div class="light-section-shell trend-radar-shell">
          <div class="trend-radar-hero" data-trend-header>
            <div>
              <p class="light-section-label">05 / TREND RADAR</p>
              <h2 id="trend-radar-title">Trend Radar</h2>
            </div>
            <div class="trend-radar-copy">
              <p class="trend-radar-kicker">Market signals, translated into academic opportunities.</p>
              <p>把市场热点、科技新闻和高校科研趋势，转译成学生能理解、愿意收藏、可以行动的内容入口。</p>
            </div>
          </div>
          <div class="trend-radar-board trend-service-list" data-trend-list>
            ${renderTrendRows()}
          </div>
        </div>
      </section>

      <section class="light-case-section metrics-showcase" id="impact" aria-labelledby="metrics-showcase-title" data-cinematic-word="MEASURED GROWTH">
        <div class="light-section-shell">
          <div class="light-section-heading compact-heading">
            <p class="light-section-label">06 / MEASURED GROWTH</p>
            <h2 id="metrics-showcase-title">Measured Growth</h2>
            <p>数据不是装饰，而是内容策略是否真实产生影响的证据。这里保留稳妥、可解释、可继续补充的结果表达。</p>
          </div>
          ${renderMetricEditPanel()}
          <div class="case-kpi-grid">
            ${renderMetrics()}
          </div>
          <div class="metric-context-card">
            <span>Capability Keywords</span>
            <p>选题策略 / 封面系统 / 账号定位 / 用户画像 / 自然流量获客 / 转化承接</p>
          </div>
        </div>
      </section>

      <section class="light-case-section data-room-showcase" id="data-room" aria-labelledby="data-room-title" data-cinematic-word="DATA ROOM">
        <div class="light-section-shell">
          <div class="light-section-heading compact-heading">
            <p class="light-section-label">07 / DATA ROOM</p>
            <h2 id="data-room-title">Growth Evidence</h2>
            <p>把账号截图、投放反馈和客资结果整理成可被阅读的证据室：每张图旁边保留指标、场景和策略判断。</p>
          </div>
          <div class="cetus-live-evidence" id="project-1-evidence-live"></div>
          <div class="cetus-live-evidence" id="project-2-evidence-live"></div>
          <div class="cetus-live-evidence" id="project-3-evidence-live"></div>
        </div>
      </section>

      <section class="light-case-section content-library-showcase" id="proof-gallery" aria-labelledby="proof-gallery-title" data-cinematic-word="CONTENT LIBRARY">
        <div class="light-section-shell">
          <div class="content-library-heading">
            <p class="light-section-label">08 / CONTENT INTELLIGENCE</p>
            <h2 id="proof-gallery-title">Best-performing<br>Content Library</h2>
            <h3>爆款内容样本库</h3>
            <p>这里展示的不是普通截图，而是跑得更好的内容样本：它们分别验证了前沿科研、申请焦虑、人设化表达和视觉包装在小红书内容增长中的作用。</p>
          </div>
          <div class="content-library-filters" role="tablist" aria-label="内容样本分类">
            ${renderContentLibraryFilters()}
          </div>
          <div class="content-library-grid" aria-live="polite">
            ${renderProofGallery()}
          </div>
        </div>
      </section>

      <section class="light-case-section profile-showcase" id="profile-archive" aria-labelledby="profile-showcase-title" data-cinematic-word="PROFILE">
        <div class="light-section-shell profile-grid">
          <div class="profile-title">
            <p class="light-section-label">09 / ABOUT</p>
            <h2 id="profile-showcase-title">AI Content<br>Growth Strategist</h2>
            <span>Based in Hangzhou. Moving across Hong Kong & Japan.</span>
          </div>
          <div class="profile-copy-card">
            <p>我毕业于汉语言文学专业，但我的职业路径并没有停留在文字本身。</p>
            <p>我擅长把资本市场、科技新闻、高校科研趋势，转译成国际生能理解、愿意收藏、愿意咨询的内容。</p>
            <p>从商业运营、内容增长到 AI 创意项目，我逐渐形成了一套以用户洞察为核心的工作方式：观察用户真实需求，拆解内容背后的情绪、身份与商业动机，再将复杂信息转化为可理解、可传播、可转化的数字内容。</p>
            <p>我习惯把看似混乱的内容现象拆成用户、情绪、身份、场景和商业链路。对我来说，内容不是单纯的发布动作，而是一套从注意力、信任到行动的系统。</p>
            <div class="profile-facts">
              ${renderExpertise()}
            </div>
          </div>
        </div>
      </section>

      <section class="light-case-section contact-showcase" id="contact" aria-labelledby="contact-showcase-title" data-cinematic-word="CONTACT">
        <div class="light-section-shell contact-grid">
          <div>
            <p class="light-section-label">10 / CONTACT</p>
            <h2 id="contact-showcase-title">Let's Build Future-Facing Content Systems</h2>
            <p>Interested in AI content growth, research communication, tech trend translation or future media? Let's connect.</p>
          </div>
          <div class="contact-card-grid">
            <a href="mailto:15944075696@139.com" class="contact-card">Email <span>15944075696@139.com</span></a>
            <a href="#contact" class="contact-card">WeChat <span>Heyits42</span></a>
            <a href="#contact" class="contact-card">Xiaohongshu <span>→</span></a>
          </div>
        </div>
      </section>
    </div>
  `;

  const showGalleryStatus = (message) => {
    const status = root.querySelector("[data-gallery-edit-status]");
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(showGalleryStatus.timer);
    showGalleryStatus.timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2600);
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });

  const prepareGalleryImage = async (file) => ({
    src: await readFileAsDataUrl(file),
    note: "",
    alt: file.name,
    addedAt: new Date().toISOString(),
  });

  const updateSlideVisual = (mediaId) => {
    const slide = root.querySelector(`[data-gallery-media-id="${mediaId}"]`);
    const slideConfig = projectSlides.find((item) => item.mediaId === mediaId);
    if (!slide || !slideConfig) return;

    const media = getStoredMedia(mediaId);
    const image = slide.querySelector("[data-gallery-image]");
    const count = slide.querySelector("[data-gallery-count]");

    slide.classList.toggle("has-custom-media", media.length > 0);
    if (image) image.src = media.length ? media[media.length - 1].src : slideConfig.image;
    if (count) count.textContent = media.length ? `已添加 ${media.length} 张` : "默认封面";
  };

  const updateEvidenceRoll = (card, direction = 0) => {
    const images = [...card.querySelectorAll("[data-evidence-roll-image]")];
    if (!images.length) return;

    const currentIndex = Number(card.dataset.evidenceRollIndex || 0);
    const nextIndex = (currentIndex + direction + images.length) % images.length;
    const track = card.querySelector("[data-evidence-roll-track]");
    const count = card.querySelector("[data-evidence-roll-count]");

    card.dataset.evidenceRollIndex = String(nextIndex);
    if (track) track.style.transform = `translateX(${-nextIndex * 100}%)`;
    images.forEach((image, index) => image.classList.toggle("is-active", index === nextIndex));
    if (count) count.textContent = `${nextIndex + 1} / ${images.length}`;
  };

  const updateGalleryVisual = (mediaId) => {
    const targets = [...root.querySelectorAll(`[data-gallery-media-id="${mediaId}"]`)];
    const proofConfig = proofCards.find((item) => item.mediaId === mediaId);
    const config = projectSlides.find((item) => item.mediaId === mediaId)
      || dataEvidenceCards.find((item) => item.mediaId === mediaId)
      || proofConfig;
    if (!targets.length || !config) return;

    const media = getStoredMedia(mediaId);
    targets.forEach((target) => {
      const image = target.querySelector("[data-gallery-image]");
      const count = target.querySelector("[data-gallery-count]");
      const rollTrack = target.querySelector("[data-evidence-roll-track]");
      target.classList.toggle("has-custom-media", media.length > 0);

      if (rollTrack) {
        const images = getEvidenceImages(config);
        rollTrack.innerHTML = renderEvidenceRollImages(images, config.title);
        target.dataset.evidenceRollIndex = "0";
        updateEvidenceRoll(target);
      } else if (image) {
        image.src = media.length ? media[media.length - 1].src : config.image;
      }

      if (count) count.textContent = media.length ? `已添加 ${media.length} 张` : "预留图片位";
    });
  };

  const setupEvidenceRolls = () => {
    root.querySelectorAll(".data-evidence-card").forEach((card) => {
      updateEvidenceRoll(card);

      card.querySelector("[data-evidence-roll-prev]")?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        updateEvidenceRoll(card, -1);
      });

      card.querySelector("[data-evidence-roll-next]")?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        updateEvidenceRoll(card, 1);
      });

      card.querySelector("[data-evidence-roll]")?.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaX) < 8 && Math.abs(event.deltaY) < 8) return;
        event.preventDefault();
        updateEvidenceRoll(card, event.deltaX > 0 || event.deltaY > 0 ? 1 : -1);
      }, { passive: false });
    });
  };

  const setupExhibitionSliders = () => {
    const sliders = [...root.querySelectorAll("[data-exhibition-slider]")];

    sliders.forEach((slider) => {
      const viewport = slider.querySelector(".exhibition-viewport");
      const slides = [...slider.querySelectorAll("[data-slider-slide]")];
      const prev = slider.querySelector("[data-slider-prev]");
      const next = slider.querySelector("[data-slider-next]");
      const dots = [...slider.querySelectorAll("[data-slider-dot]")];
      if (!viewport || !slides.length) return;

      let activeIndex = 0;
      let pointerStartX = 0;
      let pointerStartScroll = 0;
      let dragging = false;

      const setActive = (index, scroll = false) => {
        activeIndex = Math.max(0, Math.min(index, slides.length - 1));
        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
          slide.setAttribute("aria-current", slideIndex === activeIndex ? "true" : "false");
        });
        dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === activeIndex));
        if (scroll) {
          slides[activeIndex].scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      };

      const syncActiveFromScroll = () => {
        const viewportRect = viewport.getBoundingClientRect();
        const center = viewportRect.left + viewportRect.width / 2;
        let closestIndex = activeIndex;
        let closestDistance = Number.POSITIVE_INFINITY;

        slides.forEach((slide, index) => {
          const rect = slide.getBoundingClientRect();
          const distance = Math.abs(center - (rect.left + rect.width / 2));
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== activeIndex) setActive(closestIndex);
      };

      prev?.addEventListener("click", (event) => {
        event.preventDefault();
        setActive(activeIndex - 1, true);
      });

      next?.addEventListener("click", (event) => {
        event.preventDefault();
        setActive(activeIndex + 1, true);
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", (event) => {
          event.preventDefault();
          setActive(index, true);
        });
      });

      viewport.addEventListener("scroll", () => {
        window.clearTimeout(viewport.sliderScrollTimer);
        viewport.sliderScrollTimer = window.setTimeout(syncActiveFromScroll, 70);
      }, { passive: true });

      viewport.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        viewport.scrollBy({ left: event.deltaY, behavior: reduceMotion ? "auto" : "smooth" });
      }, { passive: false });

      viewport.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) return;
        dragging = true;
        pointerStartX = event.clientX;
        pointerStartScroll = viewport.scrollLeft;
        slider.classList.add("is-dragging");
        viewport.setPointerCapture?.(event.pointerId);
      });

      viewport.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        viewport.scrollLeft = pointerStartScroll - (event.clientX - pointerStartX);
      });

      const endDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        slider.classList.remove("is-dragging");
        viewport.releasePointerCapture?.(event.pointerId);
        syncActiveFromScroll();
      };

      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);

      setActive(0);
      requestAnimationFrame(syncActiveFromScroll);
    });
  };

  const setupCapabilityCards = () => {
    const cards = Array.from(root.querySelectorAll("[data-capability-card]"));
    if (!cards.length) return;

    const setActive = (activeCard) => {
      cards.forEach((card) => {
        const isActive = card === activeCard;
        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    cards.forEach((card) => {
      card.addEventListener("click", () => setActive(card));
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setActive(card);
      });
    });
  };

  const setupContentLibraryFilters = () => {
    const buttons = Array.from(root.querySelectorAll("[data-library-filter]"));
    const cards = Array.from(root.querySelectorAll("[data-library-category]"));
    if (!buttons.length || !cards.length) return;

    const applyFilter = (category) => {
      buttons.forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.libraryFilter === category));
      });

      const visibleCards = [];
      cards.forEach((card) => {
        const visible = category === "all" || card.dataset.libraryCategory === category;
        card.hidden = !visible;
        if (visible) visibleCards.push(card);
      });

      if (!reduceMotion) {
        visibleCards.forEach((card, index) => {
          card.animate(
            [
              { opacity: 0, transform: "translate3d(0, 12px, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: 360,
              delay: index * 45,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            },
          );
        });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.libraryFilter || "all"));
    });
  };

  const setupGalleryEditing = () => {
    const input = root.querySelector("[data-gallery-media-input]");
    const entry = root.querySelector("[data-gallery-edit-entry]");
    let activeMediaId = "";

    entry?.addEventListener("click", () => {
      if (!editorAccess) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("edit", "1");
        nextUrl.hash = "projects";
        window.location.href = nextUrl.toString();
        return;
      }

      const activeUpload = root.querySelector(".exhibition-slide.is-active [data-gallery-upload]")
        || root.querySelector("[data-gallery-upload]");
      activeUpload?.click();
    });

    root.querySelectorAll("[data-gallery-upload]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!editorAccess) return;
        activeMediaId = button.dataset.galleryUpload;
        input?.click();
      });
    });

    root.querySelectorAll("[data-gallery-clear]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!editorAccess) return;

        const mediaId = button.dataset.galleryClear;
        const state = readPortfolioState();
        state.media = state.media || {};
        state.media[mediaId] = [];
        writePortfolioState(state);
        updateGalleryVisual(mediaId);
        showGalleryStatus("已恢复默认封面");
      });
    });

    input?.addEventListener("change", async (event) => {
      const files = [...event.target.files].filter((file) => file.type.startsWith("image/"));
      if (!files.length || !activeMediaId) return;

      if (files.some((file) => file.size > 20 * 1024 * 1024)) {
        showGalleryStatus("单张图片请控制在 20MB 以内");
        event.target.value = "";
        return;
      }

      try {
        const prepared = [];
        for (const file of files) prepared.push(await prepareGalleryImage(file));

        const state = readPortfolioState();
        state.media = state.media || {};
        const existing = Array.isArray(state.media[activeMediaId]) ? state.media[activeMediaId] : [];
        state.media[activeMediaId] = [...existing, ...prepared];
        writePortfolioState(state);
        updateGalleryVisual(activeMediaId);
        showGalleryStatus(`已添加 ${prepared.length} 张图片`);
      } catch {
        showGalleryStatus("图片处理失败，请换一张图片重试");
      } finally {
        event.target.value = "";
      }
    });
  };

  const showMetricStatus = (message) => {
    const status = root.querySelector("[data-metric-status]");
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(showMetricStatus.timer);
    showMetricStatus.timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2600);
  };

  const saveMetrics = (nextMetrics) => {
    const state = readPortfolioState();
    state.caseMetrics = nextMetrics.map(normalizeMetric);
    writePortfolioState(state);
    metrics = getMetrics();
  };

  const refreshMetrics = () => {
    const grid = root.querySelector(".case-kpi-grid");
    if (!grid) return;
    grid.innerHTML = renderMetrics();
    setupMetricEditing();
  };

  const editMetric = (index) => {
    const current = metrics[index];
    if (!current) return;

    const label = window.prompt("数据标题", current.label);
    if (label === null) return;
    const value = window.prompt("数字", current.value);
    if (value === null) return;
    const suffix = window.prompt("单位 / 后缀", current.suffix);
    if (suffix === null) return;
    const copy = window.prompt("说明文字", current.copy);
    if (copy === null) return;

    const nextMetrics = [...metrics];
    nextMetrics[index] = {
      ...current,
      label: label.trim() || current.label,
      value: value.trim() || current.value,
      suffix: suffix.trim(),
      copy: copy.trim() || current.copy,
    };
    saveMetrics(nextMetrics);
    refreshMetrics();
    showMetricStatus("数据已更新");
  };

  const addMetric = () => {
    const label = window.prompt("数据标题", "新数据");
    if (label === null) return;
    const value = window.prompt("数字", "0");
    if (value === null) return;
    const suffix = window.prompt("单位 / 后缀", "");
    if (suffix === null) return;
    const copy = window.prompt("说明文字", "补充说明");
    if (copy === null) return;

    saveMetrics([
      ...metrics,
      {
        id: `metric-${Date.now()}`,
        label: label.trim() || "新数据",
        value: value.trim() || "0",
        suffix: suffix.trim(),
        copy: copy.trim() || "补充说明",
      },
    ]);
    refreshMetrics();
    showMetricStatus("已添加数据");
  };

  function setupMetricEditing() {
    if (!editorAccess) return;

    root.querySelectorAll("[data-metric-edit]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        editMetric(Number(button.dataset.metricEdit));
      });
    });

    root.querySelectorAll("[data-metric-delete]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const index = Number(button.dataset.metricDelete);
        if (metrics.length <= 1) {
          showMetricStatus("至少保留一张数据卡");
          return;
        }
        if (!window.confirm("删除这张数据卡吗？")) return;
        saveMetrics(metrics.filter((_, metricIndex) => metricIndex !== index));
        refreshMetrics();
        showMetricStatus("已删除数据卡");
      });
    });

    root.querySelector("[data-metric-add]")?.addEventListener("click", (event) => {
      event.preventDefault();
      addMetric();
    });
  }

  setupGalleryEditing();
  setupMetricEditing();
  setupEvidenceRolls();
  setupExhibitionSliders();
  setupCapabilityCards();
  setupContentLibraryFilters();

  const scrollToRequestedHash = () => {
    if (!window.location.hash) return;
    const target = root.querySelector(window.location.hash);
    if (!target) return;
    target.classList.add("is-visible");
    [80, 420, 900].forEach((delay) => {
      window.setTimeout(() => target.scrollIntoView({ block: "start" }), delay);
    });
  };

  scrollToRequestedHash();
  window.addEventListener("hashchange", scrollToRequestedHash);
  window.addEventListener("load", scrollToRequestedHash, { once: true });

  const countNodes = [...root.querySelectorAll("[data-case-count]")];

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { threshold: 0.18 })
    : null;

  root.querySelectorAll(".light-case-section").forEach((section) => {
    if (section.matches(".project-showcase, .proof-gallery-showcase")) {
      section.classList.add("is-visible");
      return;
    }
    if (revealObserver) revealObserver.observe(section);
    else section.classList.add("is-visible");
  });

  const animateCount = (node) => {
    if (node.dataset.counted === "true") return;
    node.dataset.counted = "true";
    const rawTarget = node.dataset.caseCount || "0";
    const target = Number(rawTarget);
    const suffix = node.dataset.caseSuffix || "";

    if (reduceMotion || !Number.isFinite(target)) {
      node.textContent = `${rawTarget}${suffix}`;
      return;
    }

    const start = performance.now();
    const duration = 850;
    const decimals = String(target).includes(".") ? 1 : 0;

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else node.textContent = `${target}${suffix}`;
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    countNodes.forEach((node) => counterObserver.observe(node));
  } else {
    countNodes.forEach(animateCount);
  }
})();
