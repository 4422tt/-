(() => {
  const assetRoot = "public/images/cetus-research";

  const accountMatrix = [
    {
      id: "research-bluev",
      index: "01",
      name: "科研蓝V投流账号",
      type: "Paid acquisition",
      role: "权威背书、信任建立、付费获客与私信留资转化",
      image: `${assetRoot}/research-bluev/research-bluev-13.png`,
    },
    {
      id: "un-bluev",
      index: "02",
      name: "蓝V联合国投流",
      type: "High-ticket testing",
      role: "国际组织产品线、付费获客与高客单产品测试",
      image: `${assetRoot}/un-bluev/un-bluev-02.png`,
    },
    {
      id: "kos-research-worker",
      index: "03",
      name: "KOS科研民工",
      type: "Soft trust",
      role: "人格化科研表达、真实感叙事与软性信任建立",
      image: `${assetRoot}/kos-research-worker/kos-research-worker-01.png`,
    },
    {
      id: "kos-digital-life",
      index: "04",
      name: "KOS数字生命",
      type: "Frontier testing",
      role: "AI、未来科技与前沿科研选题的内容吸引力测试",
      image: `${assetRoot}/kos-digital-life/kos-digital-life-01.png`,
    },
    {
      id: "kos-un",
      index: "05",
      name: "KOS联合国",
      type: "Interest education",
      role: "国际组织叙事、个人账号式表达与用户兴趣教育",
      image: `${assetRoot}/kos-un/kos-un-01.png`,
    },
  ];

  const researchGroups = [
    {
      id: "paid-acquisition",
      eyebrow: "A / PAID ACQUISITION",
      title: "科研蓝V投流账号",
      role: "付费获客与转化效率",
      caption: "蓝V投流账号用于承接科研产品的权威背书、付费获客与私信留资转化。",
      editId: "evidence-research-bluev",
      images: [
        {
          src: `${assetRoot}/research-bluev/research-bluev-09.png`,
          title: "长期投放基线",
          note: "累计消耗、展现、点击与留资成本的汇总证据。",
          privacy: "sanitized-metrics",
        },
        {
          src: `${assetRoot}/research-bluev/research-bluev-08.png`,
          title: "近期优化窗口",
          note: "用于核验CTR提升、CPC下降与留资成本改善。",
          privacy: "sanitized-metrics",
        },
        {
          src: `${assetRoot}/research-bluev/research-bluev-13.png`,
          title: "账号内容诊断",
          note: "用账号表现与同类对比验证内容方向，不替代投放数据。",
        },
        {
          src: `${assetRoot}/research-bluev/research-bluev-01.png`,
          title: "AI科研素材",
          note: "从高校、专业与申请价值切入的投放素材样本。",
        },
        {
          src: `${assetRoot}/research-bluev/research-bluev-10.png`,
          title: "脑科学选题",
          note: "高认知选题用于测试用户对导师与课题含金量的关注。",
        },
      ],
    },
    {
      id: "research-persona",
      eyebrow: "B / PERSONA CONTENT",
      title: "KOS科研民工",
      role: "人格化科研叙事",
      caption: "KOS科研民工账号用于测试更真人化的科研表达，降低机构感，建立软信任。",
      editId: "evidence-kos-research-worker",
      images: [
        {
          src: `${assetRoot}/kos-research-worker/kos-research-worker-01.png`,
          title: "账号表现概览",
          note: "核验人格化账号的内容表现与阶段性增长。",
        },
        {
          src: `${assetRoot}/kos-research-worker/kos-research-worker-02.png`,
          title: "增长趋势",
          note: "观察发布节奏、互动变化与内容反馈。",
        },
      ],
    },
    {
      id: "frontier-research",
      eyebrow: "C / FRONTIER NARRATIVE",
      title: "KOS数字生命",
      role: "前沿科研选题测试",
      caption: "KOS数字生命账号用于测试AI、未来科技与前沿科研选题的内容吸引力。",
      editId: "evidence-kos-digital-life",
      images: [
        {
          src: `${assetRoot}/kos-digital-life/kos-digital-life-01.png`,
          title: "账号数据概览",
          note: "验证未来科技内容的受众兴趣与账号基础表现。",
        },
      ],
    },
  ];

  const internationalGroups = [
    {
      id: "un-paid",
      eyebrow: "A / UN BLUE-V",
      title: "蓝V联合国投流",
      role: "国际组织产品线付费测试",
      caption: "蓝V联合国投流账号用于测试国际组织高客单产品线的投放获客能力。",
      editId: "evidence-un-bluev",
      images: [
        {
          src: `${assetRoot}/un-bluev/un-bluev-02.png`,
          title: "投流内容矩阵",
          note: "用于观察不同主题封面与产品表达的点击反馈。",
        },
      ],
    },
    {
      id: "un-persona",
      eyebrow: "B / UN KOS",
      title: "KOS联合国",
      role: "人格化兴趣教育",
      caption: "KOS联合国账号用真人化叙事教育用户理解国际组织履历、实习路径与申请背景价值。",
      editId: "evidence-kos-un",
      images: [
        {
          src: `${assetRoot}/kos-un/kos-un-01.png`,
          title: "账号定位证据",
          note: "以个人账号式表达承接国际组织兴趣教育。",
        },
      ],
    },
  ];

  const researchSystemLayers = [
    {
      index: "A",
      label: "PAID ACQUISITION LAYER",
      title: "科研蓝V投流账号",
      function: "权威背书、付费获客、私信留资",
      proof: "用长期基线与近期优化窗口判断内容是否真正进入点击、咨询与留资链路。",
      image: researchGroups[0].images[0],
      editId: "evidence-research-bluev",
    },
    {
      index: "B",
      label: "CONTENT-MARKET FIT",
      title: "科研内容样本",
      function: "前沿选题、申请价值与导师背书",
      proof: "把课题名转译成用户能理解的方向价值，而不是只展示学术术语。",
      image: researchGroups[0].images[3],
      editId: "evidence-research-content",
    },
  ];

  const internationalSystemLayers = internationalGroups.map((group, index) => ({
    index: index === 0 ? "A" : "B",
    label: index === 0 ? "OFFICIAL ACCOUNT LAYER" : "PERSONA ACCOUNT LAYER",
    title: group.title,
    function: group.role,
    proof: group.caption,
    image: group.images[0],
    editId: group.editId,
  }));

  const personaSystemLayers = researchGroups.slice(1).map((group, index) => ({
    index: index === 0 ? "A" : "B",
    label: index === 0 ? "KOS RESEARCH WORKER" : "KOS DIGITAL LIFE",
    title: group.title,
    function: group.role,
    proof: group.caption,
    image: group.images[0],
    editId: group.editId,
  }));

  const longTermMetrics = [
    ["Ad Spend", "¥79,558.51", "累计投放"],
    ["Impressions", "661,885", "广告展现"],
    ["Clicks", "32,158", "有效点击"],
    ["CTR", "4.86%", "点击率"],
    ["Average CPC", "¥2.47", "平均点击成本"],
    ["PM Inquiries", "325", "私信进线"],
    ["Leads", "148", "私信留资"],
    ["Lead Cost", "¥537.56", "留资成本"],
  ];

  const recentMetrics = [
    ["Ad Spend", "¥9,397.74"],
    ["Impressions", "79,486"],
    ["Clicks", "4,839"],
    ["CTR", "6.09%"],
    ["Average CPC", "¥1.94"],
    ["PM Inquiries", "46"],
    ["Leads", "24"],
    ["Lead Cost", "¥391.57"],
  ];

  const comparisons = [
    ["CTR", "4.86%", "6.09%", "+1.23 pp"],
    ["Average CPC", "¥2.47", "¥1.94", "-21.5%"],
    ["Lead Cost", "¥537.56", "¥391.57", "-27.2%"],
  ];

  function ScreenshotCard(image, index) {
    const privacyClass = image.privacy ? ` is-${image.privacy}` : "";
    return `
      <button class="cetus-shot${privacyClass}" type="button" data-evidence-image="${image.src}" data-evidence-title="${image.title}" data-evidence-note="${image.note}">
        <span class="cetus-shot-media">
          <img src="${image.src}" alt="${image.title}" loading="lazy" decoding="async">
          ${image.privacy ? '<span class="cetus-privacy-note">Sensitive campaign details cropped</span>' : ""}
        </span>
        <span class="cetus-shot-copy">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${image.title}</strong>
          <small>${image.note}</small>
        </span>
      </button>
    `;
  }

  function EvidenceGallery(groups, options = {}) {
    const compactClass = options.compact ? " is-compact" : "";
    return `
      <section class="cetus-gallery${compactClass}" aria-label="${options.label || "Evidence gallery"}">
        <div class="cetus-gallery-intro">
          <p class="cetus-kicker">${options.eyebrow || "EVIDENCE GALLERY / 账号证据截图"}</p>
          <h3>${options.title || "Screenshots with a business function."}</h3>
          <p>${options.description || "每张截图都对应一个账号角色、测试目标或转化环节，不作为装饰性图片使用。"}</p>
        </div>
        <div class="cetus-gallery-groups">
          ${groups
            .map(
              (group) => `
                <article class="cetus-gallery-group" id="${group.id}">
                  <header>
                    <div>
                      <p class="cetus-kicker">${group.eyebrow}</p>
                      <h4>${group.title}</h4>
                    </div>
                    <p><strong>${group.role}</strong>${group.caption}</p>
                  </header>
                  <div class="cetus-shot-track">
                    ${group.images.map(ScreenshotCard).join("")}
                  </div>
                  <div class="cetus-added-media" data-media-id="${group.editId}">
                    <div class="project-media-placeholder">
                      <span>附加证据 / ADDITIONAL EVIDENCE</span>
                      <small>编辑模式下可继续添加属于此账号类别的截图</small>
                    </div>
                    <button class="media-upload editor-only" type="button" data-upload-media="${group.editId}">添加本类截图</button>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function AccountMatrix(accounts) {
    return `
      <section class="cetus-account-matrix" aria-labelledby="account-matrix-title">
        <header class="cetus-module-heading">
          <p class="cetus-kicker">ACCOUNT MATRIX / 账号矩阵</p>
          <h3 id="account-matrix-title">Blue-V authority meets KOS trust.</h3>
          <p>蓝V负责权威、投放和转化验证，KOS负责人格化表达、兴趣教育与软信任。五类账号承担不同业务功能，不以同一套内容重复分发。</p>
        </header>
        <div class="cetus-account-grid">
          ${accounts
            .map(
              (account) => `
                <a class="cetus-account-card" href="#${account.id}">
                  <span class="cetus-account-image"><img src="${account.image}" alt="" loading="lazy" decoding="async"></span>
                  <span class="cetus-account-meta">${account.index} / ${account.type}</span>
                  <strong>${account.name}</strong>
                  <small>${account.role}</small>
                </a>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function SystemBoard({ id, eyebrow, title, description, layers, insight }) {
    return `
      <section class="cetus-system-board" id="${id}" aria-labelledby="${id}-title">
        <header class="cetus-system-heading">
          <div>
            <p class="cetus-kicker">${eyebrow}</p>
            <h3 id="${id}-title">${title}</h3>
          </div>
          <p>${description}</p>
        </header>
        <div class="cetus-system-grid">
          ${layers.map((layer) => `
            <article class="cetus-system-card">
              <button
                class="cetus-system-shot"
                type="button"
                data-evidence-image="${layer.image.src}"
                data-evidence-title="${layer.image.title}"
                data-evidence-note="${layer.image.note}"
              >
                <img src="${layer.image.src}" alt="${layer.image.title}" loading="lazy" decoding="async">
                <span>${layer.index} / ${layer.label}</span>
              </button>
              <div class="cetus-system-copy">
                <p>${layer.function}</p>
                <h4>${layer.title}</h4>
                <small>${layer.proof}</small>
              </div>
              <div class="cetus-system-add cetus-added-media" data-media-id="${layer.editId}">
                <div class="project-media-placeholder">
                  <span>ADDITIONAL EVIDENCE</span>
                  <small>编辑模式下可添加同一账号或内容层的补充截图</small>
                </div>
                <button class="media-upload editor-only" type="button" data-upload-media="${layer.editId}">添加证据</button>
              </div>
            </article>
          `).join("")}
        </div>
        <aside class="cetus-system-insight">
          <span>SYSTEM INSIGHT</span>
          <p>${insight}</p>
        </aside>
      </section>
    `;
  }

  function metricCards(metrics, className = "") {
    return `
      <div class="cetus-metric-grid ${className}">
        ${metrics
          .map(
            ([label, value, note]) => `
              <article class="cetus-metric-card">
                <span>${label}</span>
                <strong>${value}</strong>
                ${note ? `<small>${note}</small>` : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function GrowthEvidence() {
    return `
      <section class="cetus-growth-evidence" aria-labelledby="growth-evidence-title">
        <header class="cetus-module-heading">
          <p class="cetus-kicker">GROWTH EVIDENCE / 投放转化证据层</p>
          <h3 id="growth-evidence-title">Paid acquisition, traced to private-message leads.</h3>
          <p>数据不是装饰，而是用于判断内容是否形成有效点击、咨询与留资的证据。以下结果不延伸为营收或GMV结论。</p>
        </header>

        <div class="cetus-dashboard">
          <section>
            <div class="cetus-dashboard-label">
              <span>01 / LONG-TERM BASELINE</span>
              <strong>2026.01.09 - 2026.07.08</strong>
            </div>
            ${metricCards(longTermMetrics)}
          </section>
          <section>
            <div class="cetus-dashboard-label">
              <span>02 / RECENT OPTIMIZATION</span>
              <strong>2026.06.01 - 2026.07.08</strong>
            </div>
            ${metricCards(recentMetrics, "is-recent")}
          </section>
        </div>

        <div class="cetus-comparison-grid" aria-label="Optimization comparison">
          ${comparisons
            .map(
              ([label, from, to, change]) => `
                <article>
                  <span>${label}</span>
                  <p><s>${from}</s><i aria-hidden="true">→</i><strong>${to}</strong></p>
                  <small>${change}</small>
                </article>
              `,
            )
            .join("")}
        </div>

        <aside class="cetus-growth-insight">
          <span>CONVERSION BOTTLENECK</span>
          <p data-edit-id="project-1-growth-insight">前沿科研内容能够带来更强点击和更高质量咨询，但也暴露出后端承接问题：高认知用户更关注导师真实性、课题含金量、成果路径和申请价值。因此，转化优化不能只停留在内容端，还需要联动产品分层、私域话术与销售承接。</p>
        </aside>

        <aside class="cetus-resume-proof">
          <span>RESUME SUMMARY</span>
          <p data-edit-id="project-1-resume-proof">负责留学科研与国际组织产品的小红书内容增长与投放转化，覆盖蓝V及KOS账号矩阵；通过前沿科研选题、账号定位与投放素材测试，累计投放约7.96万元，获得66.19万展现、3.22万点击、325条私信进线、148条留资；阶段性将点击率提升至6.09%，CPC降至1.94元，私信留资成本降至约392元。基于数据复盘进一步识别出“前沿科研内容获客强，但后端产品与销售承接不足”的转化瓶颈，形成内容、投放、私域与销售链路优化方案。</p>
        </aside>
      </section>
    `;
  }

  function EvidenceDialog() {
    return `
      <dialog class="cetus-evidence-dialog" aria-labelledby="cetus-dialog-title">
        <button type="button" class="cetus-dialog-close" aria-label="关闭图片">×</button>
        <img alt="">
        <div>
          <p class="cetus-kicker">EVIDENCE DETAIL</p>
          <h3 id="cetus-dialog-title"></h3>
          <p class="cetus-dialog-note"></p>
        </div>
      </dialog>
    `;
  }

  const projectOneAnchor = document.querySelector("#project-1-evidence-live")
    || document.querySelector("#project-1-evidence");
  if (projectOneAnchor) {
    projectOneAnchor.innerHTML = `
      ${GrowthEvidence()}
      ${SystemBoard({
        id: "paid-research-system-board",
        eyebrow: "PROJECT 01 / PAID RESEARCH PRODUCT CONTENT SYSTEM",
        title: "Paid evidence, not decorative reporting.",
        description: "科研产品内容系统不是一组截图，而是把权威表达、投放素材与私信留资组织在同一条可验证链路里。",
        layers: researchSystemLayers,
        insight: "科研蓝V负责权威与投放入口，前沿选题负责建立点击，申请价值、导师背书和成果路径负责把兴趣推向咨询。KOS账号在下一个人设实验室中单独呈现，避免同一证据重复出现。",
      })}
    `;
  }

  const projectTwoAnchor = document.querySelector("#project-2-evidence-live")
    || document.querySelector("#project-2-evidence");
  if (projectTwoAnchor) {
    projectTwoAnchor.innerHTML = SystemBoard({
      id: "international-organization-system-board",
      eyebrow: "PROJECT 02 / INTERNATIONAL ORGANIZATION CONTENT SYSTEM",
      title: "Authority meets persona.",
      description: "把国际组织内容拆成两个清晰层级，而不是把同一种内容重复发到不同账号。",
      layers: internationalSystemLayers,
      insight: "蓝V账号负责权威背书与投放承接，KOS账号负责人设化表达与软信任建立。两者共同构成国际组织产品线的内容转化系统。",
    });
  }

  const projectThreeAnchor = document.querySelector("#project-3-evidence-live");
  if (projectThreeAnchor) {
    projectThreeAnchor.innerHTML = SystemBoard({
      id: "kos-persona-lab-system-board",
      eyebrow: "PROJECT 03 / KOS PERSONA LAB",
      title: "Persona as research access.",
      description: "用不同人设测试科研、AI、前沿科技与申请焦虑在真实内容场景里的接受方式。",
      layers: personaSystemLayers,
      insight: "KOS账号不是单纯发布内容，而是用不同人设测试用户对科研、AI、国际组织和申请焦虑的接受方式。科研民工降低机构感，数字生命测试未来科技与前沿科研的兴趣阈值。",
    });
  }

  document.body.insertAdjacentHTML("beforeend", EvidenceDialog());
  const dialog = document.querySelector(".cetus-evidence-dialog");
  const dialogImage = dialog?.querySelector("img");
  const dialogTitle = dialog?.querySelector("h3");
  const dialogNote = dialog?.querySelector(".cetus-dialog-note");

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-evidence-image]");
    if (!trigger || !dialog) return;
    dialogImage.src = trigger.dataset.evidenceImage;
    dialogImage.alt = trigger.dataset.evidenceTitle;
    dialogTitle.textContent = trigger.dataset.evidenceTitle;
    dialogNote.textContent = trigger.dataset.evidenceNote;
    dialog.showModal();
  });

  dialog?.querySelector(".cetus-dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
