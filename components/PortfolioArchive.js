(() => {
  const root = document.querySelector("#case-scene-gallery-root");
  const data = window.PORTFOLIO_ARCHIVE_DATA;
  if (!root || !data) return;

  const MEDIA_KEY = "guo-xuantong-portfolio-archive-media";
  const editorAccess = new URLSearchParams(window.location.search).get("edit") === "1";

  const readMedia = () => {
    if (!editorAccess) return {};
    try {
      return JSON.parse(localStorage.getItem(MEDIA_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const mediaState = readMedia();

  const saveMedia = () => {
    try {
      localStorage.setItem(MEDIA_KEY, JSON.stringify(mediaState));
      return true;
    } catch {
      return false;
    }
  };

  const project01Metrics = [
    ["Ad Spend", "投放金额", "¥79,558.51", "¥9,397.74"],
    ["Impressions", "曝光量", "661,885", "79,486"],
    ["Clicks", "点击量", "32,158", "4,839"],
    ["CTR", "点击率", "4.86%", "6.09%"],
    ["Average CPC", "平均点击成本", "¥2.47", "¥1.94"],
    ["PM Inquiries", "私信咨询", "325", "46"],
    ["Leads", "有效留资", "148", "24"],
    ["Lead Cost", "单条留资成本", "¥537.56", "¥391.57"],
  ];

  const comparisons = [
    ["CTR", "点击率", "4.86%", "6.09%"],
    ["CPC", "平均点击成本", "¥2.47", "¥1.94"],
    ["Lead Cost", "单条留资成本", "¥537.56", "¥391.57"],
  ];

  const bilingualLabel = (english, chinese) => `
    <span class="archive-label-en">${english}</span>
    <small class="archive-label-cn">${chinese}</small>
  `;

  const renderParagraphs = (items, prefix) => items
    .map((item, index) => `<p data-edit-id="${prefix}-${index + 1}">${item}</p>`)
    .join("");

  const renderSectionHeading = (eyebrow, eyebrowCn, title, translation, id) => `
    <header class="archive-section-heading">
      <p>${bilingualLabel(eyebrow, eyebrowCn)}</p>
      <h2 id="${id}">${title}</h2>
      <p class="archive-title-cn">${translation}</p>
    </header>
  `;

  const renderMeta = (project) => `
    <dl class="archive-meta" aria-label="Project information">
      <div><dt>${bilingualLabel("ROLE", "我的职责")}</dt><dd>${project.meta.role}</dd></div>
      <div><dt>${bilingualLabel("PERIOD", "项目时间")}</dt><dd>${project.meta.period}</dd></div>
      <div><dt>${bilingualLabel("SCOPE", "项目范围")}</dt><dd>${project.meta.scope}</dd></div>
      <div><dt>${bilingualLabel("TOOLS", "使用工具")}</dt><dd>${project.meta.tools}</dd></div>
    </dl>
  `;

  const renderSlotMedia = (slot = {}) => {
    if (!slot.id) return "";
    const files = mediaState[slot.id] || [];
    const placeholderSources = slot.placeholders || (slot.placeholder ? [slot.placeholder] : []);
    const fallbackMedia = placeholderSources.map((src) => ({
      src,
      type: /\.(mp4|webm|mov)(?:[?#]|$)/i.test(src) ? "video/mp4" : "image/placeholder",
      placeholder: true,
    }));
    const media = files.length ? files : fallbackMedia;
    if (!media.length) return "";
    return media.map((file, index) => {
      if (file.type?.startsWith("video")) {
        return `<video src="${file.src}" muted autoplay loop playsinline controls preload="metadata" aria-label="${slot.title} ${index + 1}"></video>`;
      }
      const mobileSrc = file.placeholder
        ? file.src.replace(/^assets\//, "assets/mobile/").replace(/\.(png|jpe?g)([?#].*)?$/i, ".jpg$2")
        : file.src;
      const fetchPriority = file.placeholder && index < 2 ? "high" : "auto";
      const loading = file.placeholder ? "eager" : "lazy";
      return `<picture><source media="(max-width: 760px)" srcset="${mobileSrc}"><img src="${file.src}" alt="${slot.title} ${index + 1}" loading="${loading}" decoding="async" fetchpriority="${fetchPriority}"></picture>`;
    }).join("");
  };

  const renderSlot = (slot = {}) => {
    if (!slot.id) return "";
    const uploadedFiles = mediaState[slot.id] || [];
    const hasUploadedMedia = uploadedFiles.length > 0;
    const placeholderSources = slot.placeholders || (slot.placeholder ? [slot.placeholder] : []);
    const hasPlaceholder = placeholderSources.length > 0;
    const hasMedia = hasUploadedMedia || hasPlaceholder;
    return `
      <article class="asset-slot${hasMedia ? " has-media" : ""}${hasPlaceholder && !hasUploadedMedia ? " has-placeholder" : ""}" data-slot-id="${slot.id}">
        <div class="asset-slot-media" data-slot-media>${renderSlotMedia(slot)}</div>
        <div class="asset-slot-copy">
          <span>${slot.id}</span>
          <h4>${slot.title}</h4>
          ${slot.cnTitle ? `<b class="asset-slot-cn-title">${slot.cnTitle}</b>` : ""}
          <p>${slot.content}</p>
          <dl>
            <div><dt>${bilingualLabel("RATIO", "素材比例")}</dt><dd>${slot.ratio}</dd></div>
            <div><dt>${bilingualLabel("USE", "素材用途")}</dt><dd>${slot.note}</dd></div>
            <div><dt>${bilingualLabel("CHECK", "发布前检查")}</dt><dd>${slot.privacy}</dd></div>
          </dl>
          <small>${hasUploadedMedia ? `${uploadedFiles.length} Asset${uploadedFiles.length > 1 ? "s" : ""} Added / 已添加 ${uploadedFiles.length} 份素材` : (hasPlaceholder ? `${placeholderSources.length} Curated Asset${placeholderSources.length > 1 ? "s" : ""} / 已归档素材` : "Asset Pending / 待补素材")}</small>
        </div>
        ${editorAccess ? `
          <div class="asset-slot-actions">
            <button type="button" data-slot-upload="${slot.id}" data-slot-multiple="${slot.multiple ? "1" : "0"}" data-slot-video="${slot.video ? "1" : "0"}">Add asset / 添加素材</button>
            ${hasUploadedMedia ? `<button type="button" data-slot-clear="${slot.id}">Clear / 清空</button>` : ""}
          </div>
        ` : ""}
      </article>
    `;
  };

  const renderFlow = (items, className = "") => `
    <div class="archive-flow ${className}">
      ${items.map((item, index) => `
        <div><span>${String(index + 1).padStart(2, "0")}</span><strong>${item[0]}</strong><small>${item[1] || ""}</small></div>
      `).join('<i aria-hidden="true">→</i>')}
    </div>
  `;

  const renderProjectOneEvidence = () => `
    <section class="archive-evidence" aria-labelledby="p1-evidence-title">
      <header class="archive-subhead">
        <span>${bilingualLabel("EVIDENCE / RESULT", "证据 / 结果")}</span>
        <h3 id="p1-evidence-title">Paid acquisition, compared over time.</h3>
        <p class="archive-subhead-cn">对比长期投放和近期优化结果。</p>
      </header>
      <div class="metric-periods" aria-label="Metric periods">
        <p><strong>${bilingualLabel("LONG-TERM", "长期累计数据")}</strong>2026.01.09–2026.07.08</p>
        <p><strong>${bilingualLabel("OPTIMIZATION WINDOW", "近期优化阶段")}</strong>2026.06.01–2026.07.08</p>
      </div>
      <div class="archive-metric-table">
        ${project01Metrics.map(([label, labelCn, longValue, recentValue]) => `
          <article><span>${bilingualLabel(label, labelCn)}</span><strong>${longValue}</strong><em>${recentValue}</em></article>
        `).join("")}
      </div>
      <div class="comparison-grid">
        ${comparisons.map(([label, labelCn, before, after]) => `
          <article><span>${bilingualLabel(label, labelCn)}</span><p><del>${before}</del><i>→</i><strong>${after}</strong></p></article>
        `).join("")}
      </div>
      ${renderFlow([
        ["Topic", "选题信号"], ["Content", "内容转译"], ["Paid Click", "付费点击"],
        ["Private Message", "私信意向"], ["Lead", "有效留资"], ["Sales Feedback", "销售反馈与迭代"],
      ], "content-lead-flow")}
    </section>
  `;

  const renderProjectTwoSystem = () => `
    <section class="archive-evidence two-layer-system" aria-labelledby="two-layer-title">
      <header class="archive-subhead"><span>${bilingualLabel("SYSTEM MAP", "系统结构")}</span><h3 id="two-layer-title">Two layers, one user need.</h3><p class="archive-subhead-cn">两种账号层级，共同服务一个用户需求。</p></header>
      ${renderFlow([
        ["OFFICIAL LAYER", "官方层：权威背书 / 产品解释 / 付费投放 / 咨询承接"],
        ["SHARED USER NEED", "共同需求：国际履历 / 实习路径 / 申请背景 / 身份想象"],
        ["PERSONA LAYER", "人设层：真人叙事 / 兴趣教育 / 软信任 / 降低距离"],
      ])}
      <div class="qualitative-labels"><span>QUALITATIVE SIGNAL / 定性信号</span><span>CONTENT ROLE / 内容作用</span><span>AUDIENCE STAGE / 用户阶段</span></div>
    </section>
  `;

  const renderProjectThreeComparison = () => {
    const rows = [
      ["人设", "真实科研从业者", "AI与前沿科技观察者"],
      ["语气", "经验感、接地气", "冷感、趋势化"],
      ["内容入口", "科研日常、申请焦虑", "AI、脑科学、数字生命"],
      ["作用", "降低机构距离", "测试前沿选题吸引力"],
      ["核心信号", "信任", "兴趣与点击"],
    ];
    return `
      <section class="archive-evidence persona-comparison" aria-labelledby="persona-comparison-title">
        <header class="archive-subhead"><span>${bilingualLabel("EXPERIMENT VARIABLES", "实验变量")}</span><h3 id="persona-comparison-title">Two personas, two distances.</h3><p class="archive-subhead-cn">两种人设，对应两种与用户沟通的距离。</p></header>
        <div class="comparison-table" role="table" aria-label="KOS persona comparison">
          <div role="row"><strong role="columnheader">维度</strong><strong role="columnheader">KOS科研民工</strong><strong role="columnheader">KOS数字生命</strong></div>
          ${rows.map((row) => `<div role="row"><span role="cell">${row[0]}</span><p role="cell">${row[1]}</p><p role="cell">${row[2]}</p></div>`).join("")}
        </div>
      </section>
    `;
  };

  const renderNarrativeVideoStage = (slot = {}) => {
    const uploaded = mediaState[slot.id] || [];
    const defaultVideos = [
      "assets/cetus/ai-narrative/ai-video-candidate-04.mp4",
      "assets/cetus/ai-narrative/ai-video-digital-exhibition-02.mp4",
    ].map((src) => ({ src, type: "video/mp4" }));
    const media = (uploaded.length ? uploaded : defaultVideos).slice(0, 2);
    const hasUploadedMedia = uploaded.length > 0;

    return `
      <div class="narrative-video-stage" data-slot-id="${slot.id}">
        <div class="narrative-video-stage-grid">
          ${media.map((file, index) => `
            <figure class="narrative-video-frame narrative-video-frame--${index + 1}">
              <video src="${file.src}" muted autoplay loop playsinline controls preload="metadata" aria-label="AI Video Digital Exhibition ${index + 1}"></video>
              <figcaption><span>0${index + 1}</span><b>${index === 0 ? "Narrative study" : "Visual study"}</b></figcaption>
            </figure>
          `).join("")}
        </div>
        <p class="narrative-video-stage-note">${hasUploadedMedia ? `${uploaded.length} VIDEOS ADDED / \u5df2\u6dfb\u52a0\u89c6\u9891\u7d20\u6750` : "DUAL-SCREEN STUDY / \u53cc\u89c6\9891\u5c55\u89c8\u7d20\u6750"}</p>
        ${editorAccess ? `
          <div class="narrative-video-stage-actions">
            <button type="button" data-slot-upload="${slot.id}" data-slot-multiple="1" data-slot-video="1">Replace videos / \u66ff\u6362\u89c6\u9891</button>
            ${hasUploadedMedia ? `<button type="button" data-slot-clear="${slot.id}">Use default / \u6062\u590d\u9ed8\u8ba4</button>` : ""}
          </div>
        ` : ""}
      </div>
    `;
  };

  const renderNarrativeLab = (project) => {
    const [hero] = project.slots;
    return `
      <section class="archive-project archive-narrative-lab" id="${project.id}" aria-labelledby="${project.id}-title">
        <div class="archive-project-shell">
          <header class="archive-project-heading narrative-lab-heading">
            <p>${bilingualLabel("PROJECT 04 / AI NARRATIVE LAB", "项目04 / AI视觉叙事实验室")}</p>
            <h2 id="${project.id}-title" data-edit-id="${project.id}-title">${project.title}</h2>
            <p class="archive-title-cn archive-project-cn-title">${project.cnTitle}</p>
            <div><strong>${project.subtitle}</strong><span>${project.subtitleCn}</span></div>
          </header>

          <section class="narrative-lab-main-case narrative-lab-main-case--dual" aria-labelledby="ai-video-case-title">
            <div class="narrative-case-copy">
              <p>${bilingualLabel("PROJECT 01 / AI VIDEO DIGITAL EXHIBITION", "\u4e3b\u9879\u76ee / AI\u89c6\u9891\u6570\u5b57\u5c55\u5385")}</p>
              <h3 id="ai-video-case-title">AI Video<br />Digital Exhibition</h3>
              <b>\u4ee5\u53cc\u5f71\u50cf\u7ec4\u7ec7\u6982\u5ff5\u3001\u573a\u666f\u4e0e\u60c5\u7eea</b>
              <p class="narrative-statement">Two moving images, one exhibition surface.<span>\u901a\u8fc7\u5e76\u7f6e\u7684\u4e24\u6bb5 AI \u5f71\u50cf\uff0c\u5c55\u793a\u62bd\u8c61\u4e3b\u9898\u5982\u4f55\u88ab\u8f6c\u6362\u6210\u53ef\u8fdb\u5165\u3001\u53ef\u611f\u77e5\u7684\u6570\u5b57\u53d9\u4e8b\u3002</span></p>
            </div>
            <div class="narrative-case-media">${renderNarrativeVideoStage(hero)}</div>
          </section>

          ${renderMeta({
            ...project,
            meta: {
              ...project.meta,
              scope: "\u89c6\u9891\u53d9\u4e8b / \u6570\u5b57\u5c55\u89c8 / \u89c6\u89c9\u4f53\u9a8c\u7f16\u6392",
            },
          })}


          <aside class="narrative-philosophy">
            <span>${bilingualLabel("CREATIVE PHILOSOPHY", "创作理念")}</span>
            <div>
              <p>AI is not only a production tool. It is a new medium for imagination. My practice focuses on connecting technology, science, stories, and human experiences.</p>
              <p class="narrative-cn-copy">AI 不只是生产工具。它是一种新的创造媒介。我关注技术、科学、故事与人的体验之间，如何建立新的连接。</p>
            </div>
          </aside>
        </div>
      </section>
    `;
  };

  const renderProject = (project) => `
    <section class="archive-project${project.number === "04" ? " is-film" : ""}" id="${project.id}" aria-labelledby="${project.id}-title">
      <div class="archive-project-shell">
        <header class="archive-project-heading">
          <p>${bilingualLabel(`PROJECT ${project.number}`, `项目 ${project.number}`)}</p>
          <h2 id="${project.id}-title" data-edit-id="${project.id}-title">${project.title}</h2>
          <p class="archive-title-cn archive-project-cn-title">${project.cnTitle}</p>
          <div><strong>${project.subtitle}</strong><span>${project.subtitleCn}</span></div>
        </header>
        ${renderMeta(project)}
        <div class="project-narrative-grid">
          <article><span>${bilingualLabel("PROBLEM", "项目问题")}</span>${renderParagraphs(project.problem, `${project.id}-problem`)}</article>
          <article><span>${bilingualLabel("HYPOTHESIS", "我的判断")}</span>${renderParagraphs(project.hypothesis, `${project.id}-hypothesis`)}</article>
          <article class="is-wide"><span>${bilingualLabel("WHAT I DID", "具体工作")}</span><p>${project.actionIntro}</p><ul>${project.actions.map((item) => `<li>${item}</li>`).join("")}</ul></article>
        </div>
        ${project.number === "01" ? renderProjectOneEvidence() : ""}
        ${project.number === "02" ? renderProjectTwoSystem() : ""}
        ${project.number === "03" ? renderProjectThreeComparison() : ""}
        <section class="archive-assets" aria-labelledby="${project.id}-assets-title">
          <header class="archive-subhead"><span>${bilingualLabel("ASSET SLOTS", "素材位置")}</span><h3 id="${project.id}-assets-title">Evidence waiting for the right material.</h3><p class="archive-subhead-cn">为每一条判断补上对应的真实素材。</p></header>
          <div class="asset-slot-grid">${project.slots.map(renderSlot).join("")}</div>
        </section>
        <aside class="archive-insight">
          <span>${bilingualLabel("INSIGHT", "核心结论")}</span>
          <div>${renderParagraphs(project.insight, `${project.id}-insight`)}</div>
        </aside>
        ${project.anonymousCase ? `<aside class="anonymous-case"><span>${bilingualLabel("ANONYMOUS CASE", "匿名案例")}</span><p>${project.anonymousCase}</p></aside>` : ""}
      </div>
    </section>
  `;

  const projectIndex = data.projects.map((project) => `
    <a class="archive-index-row" href="#${project.id}">
      <span>${project.number}</span>
      <div><strong>${project.title}</strong><b>${project.cnTitle}</b><small>${project.keywords.join(" / ")}</small><em>${project.cnKeywords.join(" / ")}</em></div>
      <i aria-hidden="true">↘</i>
    </a>
  `).join("");

  root.innerHTML = `
    <main class="portfolio-archive">
      ${editorAccess ? `<div class="archive-editor-note"><strong>EDIT MODE</strong><span>点击图片槽位的 Add asset 补充真实素材。</span></div>` : ""}
      <section class="archive-operating" id="editorial-portfolio" aria-labelledby="operating-title">
        <div class="archive-operating-stage">
          <div class="archive-section-shell">
            <article class="operating-feature-card">
              <div class="operating-feature-copy">
                <div class="operating-kicker"><span>OBSERVE 观察</span><i>/</i><span>DECODE 拆解</span><i>/</i><span>TRANSLATE 转译</span><i>/</i><span>PROVE 验证</span><i>/</i><span>ITERATE 迭代</span></div>
                <p class="operating-feature-label">OPERATING SYSTEM<span>内容工作方法</span></p>
                <p class="operating-feature-title">OPERATING <span>SYSTEM</span></p>
                <p class="operating-feature-cn">从观察、拆解、转译、验证到迭代，把内容信号组织成可验证的增长系统。</p>
                <p class="operating-feature-en">Content systems, not isolated posts.<span>不是单篇发布，而是一套连续的内容增长系统。</span></p>
              </div>
              <figure class="operating-feature-visual">
                <img src="assets/statement-feed-poster.png" alt="内容传播与信息判断视觉海报" decoding="async" />
                <figcaption><span>01 / SYSTEM MAP</span><small>内容传播与信息判断视觉海报</small></figcaption>
              </figure>
            </article>
            <div class="operating-divider" aria-hidden="true"></div>
            <div class="operating-lower-heading">
              ${renderSectionHeading("OPERATING SYSTEM", "内容工作方法", "How I move from signal to evidence.", data.sectionTranslations.operating, "operating-title")}
              <aside class="operating-identity" aria-label="Profile identity">
                <b>GX</b>
                <p><strong>郭宣潼 / GUO XUANTONG</strong><span>AI Content Growth Strategist<br />AI 内容增长策略师</span><span>Research Communication / Future Media<br />科研传播 / 未来媒体</span></p>
              </aside>
            </div>
            <div class="operating-line">${data.methods.map(([number, title, titleCn, copy]) => `<article style="--method-index:${Number(number) - 1}"><span>${number}</span><h3>${title}</h3><b>${titleCn}</b><p>${copy}</p></article>`).join("")}</div>
            <nav class="operating-stage-index" aria-label="Archive index">
              <a class="is-current" href="#editorial-portfolio"><span>01</span><strong>OPERATING</strong><b>内容系统</b></a>
              <a href="#measured-signals"><span>02</span><strong>SIGNALS</strong><b>可验证数据</b></a>
              <a href="#project-index"><span>03</span><strong>PROJECTS</strong><b>项目索引</b></a>
              <a href="#project-01"><span>04</span><strong>RESEARCH</strong><b>科研案例</b></a>
              <a href="#project-04"><span>05</span><strong>NARRATIVE</strong><b>AI 叙事</b></a>
            </nav>
          </div>
        </div>
      </section>

      <section class="archive-signals" id="measured-signals" aria-labelledby="signals-title">
        <div class="archive-section-shell">
          ${renderSectionHeading("MEASURED SIGNALS", "可验证数据", "Evidence, before explanation.", data.sectionTranslations.signals, "signals-title")}
          <div class="signal-grid">${data.signals.map(([value, label, labelCn]) => `<article><strong>${value}</strong><span>${bilingualLabel(label, labelCn)}</span></article>`).join("")}</div>
        </div>
      </section>

      <section class="archive-index" id="project-index" aria-labelledby="index-title">
        <div class="archive-section-shell">
          ${renderSectionHeading("PROJECT INDEX", "项目索引", "Four systems, one practice.", data.sectionTranslations.index, "index-title")}
          <nav class="archive-index-list" aria-label="Project index">${projectIndex}</nav>
        </div>
      </section>

      <div id="projects">${data.projects.map((project) => project.number === "04" ? renderNarrativeLab(project) : renderProject(project)).join("")}</div>

      <section class="archive-contact" id="contact" aria-labelledby="archive-contact-title">
        <div class="archive-section-shell">
          <p>${bilingualLabel("CONTACT", "联系方式")}</p>
          <h2 id="archive-contact-title">Let's build future-facing content systems.</h2>
          <p class="archive-title-cn">${data.sectionTranslations.contact}</p>
          <div class="archive-contact-links">
            <a href="mailto:15944075696@139.com">Email<span>15944075696@139.com</span></a>
            <a href="#contact">WeChat<span>Heyits42</span></a>
            <a href="https://www.xiaohongshu.com/" target="_blank" rel="noreferrer">Xiaohongshu<span>小红书</span></a>
          </div>
        </div>
      </section>
      <input type="file" data-archive-file-input hidden>
    </main>
  `;

  const syncPreview = (slotId) => {
    const preview = root.querySelector(`[data-slot-preview="${slotId}"]`);
    const first = mediaState[slotId]?.[0];
    if (!preview || !first) return;
    preview.innerHTML = first.type?.startsWith("video")
      ? `<video src="${first.src}" muted preload="metadata"></video>`
      : `<img src="${first.src}" alt="">`;
  };

  Object.keys(mediaState).forEach(syncPreview);

  const operatingSection = root.querySelector(".archive-operating");
  if (operatingSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      operatingSection.classList.add("is-operating-visible");
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(operatingSection);
  } else {
    operatingSection?.classList.add("is-operating-visible");
  }

  if (editorAccess) {
    const input = root.querySelector("[data-archive-file-input]");
    let activeSlot = null;

    root.querySelectorAll("[data-slot-upload]").forEach((button) => {
      button.addEventListener("click", () => {
        activeSlot = button.dataset.slotUpload;
        input.multiple = button.dataset.slotMultiple === "1";
        input.accept = button.dataset.slotVideo === "1" ? "video/mp4,video/webm,image/*" : "image/png,image/jpeg,image/webp";
        input.click();
      });
    });

    root.querySelectorAll("[data-slot-clear]").forEach((button) => {
      button.addEventListener("click", () => {
        delete mediaState[button.dataset.slotClear];
        saveMedia();
        window.location.reload();
      });
    });

    input.addEventListener("change", async () => {
      if (!activeSlot || !input.files?.length) return;
      const files = [...input.files];
      const stored = [];
      for (const file of files) {
        const src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        stored.push({ src, type: file.type, name: file.name });
      }
      mediaState[activeSlot] = input.multiple ? stored : stored.slice(0, 1);
      if (!saveMedia()) {
        window.alert("素材体积超过浏览器本地存储限制。请压缩图片，或按占位路径直接替换项目文件。" );
        return;
      }
      window.location.reload();
    });
  }
})();
