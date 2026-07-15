const STORAGE_KEY = "guo-xuantong-portfolio-v3";
const CONTENT_REVISION = 7;
const canvas = document.querySelector("#exhibition-canvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const editorAccess = new URLSearchParams(window.location.search).get("edit") === "1";

function mountEditorInterface() {
  if (!editorAccess) return;
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="editor-toolbar" aria-label="页面编辑工具">
      <button id="toggle-edit" type="button">编辑页面</button>
      <button id="save-content" class="editor-only" type="button">保存</button>
      <button id="export-data" class="editor-only" type="button">导出数据</button>
      <label class="toolbar-file editor-only">导入数据<input id="import-data" type="file" accept="application/json"></label>
    </aside>
    <div class="save-status" id="save-status" role="status" aria-live="polite"></div>
    <dialog class="project-dialog" id="project-dialog">
      <form id="project-form" method="dialog">
        <div class="dialog-heading">
          <div><p class="section-index">PROJECT EDITOR</p><h2 id="project-form-title">添加项目</h2></div>
          <button class="dialog-close" type="button" aria-label="关闭">X</button>
        </div>
        <input id="project-id" type="hidden">
        <label>项目名称<input id="project-name" type="text" required maxlength="80"></label>
        <label>项目分类<select id="project-category"><option>AI影像</option><option>网页设计</option><option>开源项目</option><option>数字展览</option><option>内容增长</option><option>品牌叙事</option></select></label>
        <label>项目介绍<textarea id="project-description" rows="5" maxlength="600"></textarea></label>
        <label>项目链接<input id="project-url" type="url" placeholder="https://"></label>
        <label>项目图片<input id="project-image" type="file" accept="image/png,image/jpeg,image/webp"></label>
        <div class="image-preview" id="image-preview">暂无图片</div>
        <div class="dialog-actions">
          <button class="danger-button" id="delete-project" type="button">删除项目</button>
          <button class="secondary-button" id="cancel-project" type="button">取消</button>
          <button class="primary-button" type="submit">保存项目</button>
        </div>
      </form>
    </dialog>
    <dialog class="annotation-dialog" id="annotation-dialog">
      <form id="annotation-form" method="dialog">
        <div class="dialog-heading">
          <div><p class="section-index">IMAGE NOTE</p><h2>图片标注</h2></div>
          <button class="dialog-close annotation-close" type="button" aria-label="关闭">X</button>
        </div>
        <label>标注内容<textarea id="annotation-text" rows="6" maxlength="500" placeholder="写下这张图片的背景、判断、结果或希望访客注意的细节"></textarea></label>
        <div class="dialog-actions">
          <button class="secondary-button annotation-cancel" type="button">取消</button>
          <button class="primary-button" type="submit">保存标注</button>
        </div>
      </form>
    </dialog>
  `);
}

mountEditorInterface();

const defaultProjects = [
  {
    id: "research-growth",
    title: "科研教育内容增长体系",
    category: "科研内容增长",
    description: "面向国际学生群体搭建科研项目内容增长、用户洞察、选题策划与商业化传播体系。",
    url: "",
    image: "",
  },
  {
    id: "international-growth",
    title: "国际组织与联合国项目增长",
    category: "国际组织",
    description: "完成账号冷启动、视觉体系重构、内容矩阵搭建与精准用户转化。",
    url: "",
    image: "",
  },
  {
    id: "quantum-exhibition",
    title: "AI × 量子数字展厅",
    category: "AI创意项目",
    description: "将AI视频生成、量子概念可视化、数字艺术与科学内容叙事整合为展览体验。",
    url: "",
    image: "",
  },
  {
    id: "agent-workflow-design",
    title: "AI工具工作流设计案例",
    category: "AI工作流",
    description: "借Superpowers的产品叙事、插件结构与agent workflow概念，转译为作品集中的AI工具方法论案例。",
    url: "https://github.com/obra/superpowers",
    image: "",
  },
];

let width = 0;
let height = 0;
let particles = [];
let editMode = false;
let currentImage = "";
let activeAnnotation = null;
const mediaPositions = new Map();
let state = loadState();

function normalizeMedia(media = {}) {
  return Object.fromEntries(
    Object.entries(media).map(([key, value]) => [
      key,
      (Array.isArray(value) ? value : value ? [value] : [])
        .filter(Boolean)
        .map((item) => (
          typeof item === "string"
            ? { src: item, note: "" }
            : { src: item.src || item.image || "", note: item.note || "" }
        ))
        .filter((item) => item.src),
    ]),
  );
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mergeDefaultProjects(projects = []) {
  const savedProjects = Array.isArray(projects) ? projects : [];
  const savedIds = new Set(savedProjects.map((project) => project.id));
  return [
    ...savedProjects,
    ...defaultProjects.filter((project) => !savedIds.has(project.id)),
  ];
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      content: saved?.content || {},
      projects: Array.isArray(saved?.projects) && saved.projects.length ? mergeDefaultProjects(saved.projects) : defaultProjects,
      media: normalizeMedia(saved?.media),
      contentRevision: saved?.contentRevision || 0,
    };
  } catch {
    return { content: {}, projects: defaultProjects, media: {}, contentRevision: CONTENT_REVISION };
  }
}

function migrateRevisedContent() {
  if (state.contentRevision >= CONTENT_REVISION) return;
  [
    "hero-kicker", "hero-line-1", "hero-line-2", "hero-line-3", "hero-subhead", "hero-description",
    "hero-tag-1", "hero-tag-2", "hero-tag-3", "hero-tag-4",
    "about-p1", "about-p2", "about-p3", "timeline-5-title", "timeline-5-copy", "skills-title", "skills-intro",
    "skill-1-title", "skill-1-1", "skill-2-title", "skill-2-1", "skill-3-title", "skill-3-1",
    "skill-4-title", "skill-4-1", "skill-5-title", "skill-5-1", "metrics-title",
    "metric-1-label", "metric-2-label", "metric-3-label", "metric-4-label",
    "project-1-bg", "project-1-work-title", "project-1-work", "project-2-work",
    "project-1-result-1", "project-1-result-2", "project-1-result-3", "project-1-result-4",
    "project-3-direction", "project-3-role", "project-3-bg",
    "statement-p1", "statement-p2", "statement-p3",
  ].forEach((id) => delete state.content[id]);
  state.contentRevision = CONTENT_REVISION;
  saveState(false);
}

function saveState(showMessage = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (showMessage) showStatus("已保存到当前浏览器");
  } catch {
    showStatus("图片或内容过大，浏览器存储空间不足");
  }
}

function showStatus(message) {
  const status = document.querySelector("#save-status");
  if (!status) return;
  status.textContent = message;
  status.classList.add("is-visible");
  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => status.classList.remove("is-visible"), 2200);
}

function restoreEditableContent() {
  document.querySelectorAll("[data-edit-id]").forEach((element) => {
    const saved = state.content[element.dataset.editId];
    if (typeof saved === "string") element.innerHTML = saved;
  });
}

function captureEditableContent() {
  document.querySelectorAll("[data-edit-id]").forEach((element) => {
    state.content[element.dataset.editId] = element.innerHTML;
  });
}

function renderCaseMedia() {
  document.querySelectorAll("[data-media-id]").forEach((container) => {
    const mediaId = container.dataset.mediaId;
    const images = state.media[mediaId] || [];
    container.querySelector(".media-carousel")?.remove();
    container.classList.toggle("has-image", images.length > 0);
    container.style.backgroundImage = "";
    if (!images.length) return;

    const carousel = document.createElement("div");
    carousel.className = "media-carousel";
    carousel.setAttribute("aria-label", "Project image gallery");
    carousel.innerHTML = `
      <div class="media-track">
        ${images
          .map(
            (image, index) => `
              <figure class="media-slide" data-media-index="${index}" tabindex="0" role="button" aria-label="查看第 ${index + 1} 张图片标注">
                <img src="${image.src}" alt="Project image ${index + 1}">
              </figure>
            `,
          )
          .join("")}
      </div>
      ${
        images.length > 1
          ? `
            <button class="media-nav media-prev" type="button" aria-label="Previous image">&#8592;</button>
            <button class="media-nav media-next" type="button" aria-label="Next image">&#8594;</button>
            <div class="media-dots" aria-hidden="true">
              ${images.map((_, index) => `<button type="button" data-media-page="${index}"></button>`).join("")}
            </div>
          `
          : ""
      }
      <aside class="media-annotation" aria-live="polite">
        <p class="media-annotation-index">IMAGE 01 / ${String(images.length).padStart(2, "0")}</p>
        <p class="media-annotation-text">${escapeHtml(images[0].note || "点击图片查看标注")}</p>
        <button class="media-annotation-edit editor-only" type="button">编辑这张图的标注</button>
      </aside>
      <button class="media-remove editor-only" type="button">删除当前图片</button>
    `;

    const placeholder = container.querySelector(".project-media-placeholder");
    container.insertBefore(carousel, placeholder);
    const track = carousel.querySelector(".media-track");
    const dots = [...carousel.querySelectorAll("[data-media-page]")];
    const slides = [...carousel.querySelectorAll(".media-slide")];
    const annotation = carousel.querySelector(".media-annotation");
    const annotationIndex = carousel.querySelector(".media-annotation-index");
    const annotationText = carousel.querySelector(".media-annotation-text");
    let index = Math.min(mediaPositions.get(mediaId) || 0, images.length - 1);
    let pointerDown = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let suppressClick = false;

    const updateDots = () => {
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-current", slideIndex === index));
      annotationIndex.textContent = `IMAGE ${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
      annotationText.textContent = images[index].note || "该图片暂无标注";
    };
    const goTo = (nextIndex, smooth = true) => {
      index = Math.max(0, Math.min(images.length - 1, nextIndex));
      mediaPositions.set(mediaId, index);
      track.scrollTo({ left: index * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
      updateDots();
    };

    carousel.querySelector(".media-prev")?.addEventListener("click", () => goTo(index - 1));
    carousel.querySelector(".media-next")?.addEventListener("click", () => goTo(index + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => goTo(Number(dot.dataset.mediaPage))));
    slides.forEach((slide) => {
      const showNote = () => {
        if (dragging || suppressClick) return;
        goTo(Number(slide.dataset.mediaIndex), false);
        carousel.classList.add("is-annotation-open");
      };
      slide.addEventListener("click", showNote);
      slide.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showNote();
        }
      });
    });
    annotation.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      carousel.classList.add("is-annotation-open");
    });
    track.addEventListener("scroll", () => {
      if (!track.clientWidth) return;
      index = Math.round(track.scrollLeft / track.clientWidth);
      mediaPositions.set(mediaId, index);
      updateDots();
    }, { passive: true });
    track.addEventListener("pointerdown", (event) => {
      pointerDown = true;
      dragging = false;
      startX = event.clientX;
      startY = event.clientY;
      startScroll = track.scrollLeft;
    });
    track.addEventListener("pointermove", (event) => {
      if (!pointerDown) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!dragging && Math.abs(dx) > Math.abs(dy) + 5) {
        dragging = true;
        track.setPointerCapture(event.pointerId);
      }
      if (!dragging) return;
      event.preventDefault();
      track.scrollLeft = startScroll - dx;
    });
    const finishDrag = (event) => {
      if (!pointerDown) return;
      pointerDown = false;
      const wasDragging = dragging;
      if (wasDragging && track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      goTo(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
      dragging = false;
      if (wasDragging) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 180);
      }
    };
    track.addEventListener("pointerup", finishDrag);
    track.addEventListener("pointercancel", finishDrag);
    carousel.querySelector(".media-remove").addEventListener("click", () => {
      state.media[mediaId].splice(index, 1);
      mediaPositions.set(mediaId, Math.max(0, index - 1));
      saveState();
      renderCaseMedia();
    });
    carousel.querySelector(".media-annotation-edit").addEventListener("click", () => {
      openAnnotationEditor(mediaId, index);
    });

    requestAnimationFrame(() => goTo(index, false));
  });
}

function openAnnotationEditor(mediaId, index) {
  if (!editorAccess || !editMode) return;
  const image = state.media[mediaId]?.[index];
  if (!image) return;
  activeAnnotation = { mediaId, index };
  document.querySelector("#annotation-text").value = image.note || "";
  document.querySelector("#annotation-dialog").showModal();
}

function closeAnnotationEditor() {
  document.querySelector("#annotation-dialog")?.close();
  activeAnnotation = null;
}

function saveAnnotation(event) {
  event.preventDefault();
  if (!activeAnnotation) return;
  const { mediaId, index } = activeAnnotation;
  const image = state.media[mediaId]?.[index];
  if (!image) return;
  image.note = document.querySelector("#annotation-text").value.trim();
  saveState();
  renderCaseMedia();
  closeAnnotationEditor();
}

function setupAboutFlowerMotion() {
  const poster = document.querySelector(".about-flower-poster");
  const liquidCanvas = poster?.querySelector(".about-flower-liquid-canvas");
  if (!poster || !liquidCanvas || reduceMotion) return;

  const image = new Image();
  image.src = "assets/about-flower-poster.png";
  const liquidCtx = liquidCanvas.getContext("2d", { willReadFrequently: true });
  const workCanvas = document.createElement("canvas");
  const workCtx = workCanvas.getContext("2d", { willReadFrequently: true });
  const renderWidth = 368;
  const renderHeight = 460;
  const collageRects = [
    { x: 0.16, y: 0.13, w: 0.49, h: 0.32 },
    { x: 0.57, y: 0.57, w: 0.3, h: 0.28 },
  ];
  let source = null;
  let mask = null;
  let isVisible = true;
  let lastFrame = 0;

  const inEllipse = (x, y, cx, cy, rx, ry, rotate = 0) => {
    const cos = Math.cos(rotate);
    const sin = Math.sin(rotate);
    const dx = x - cx;
    const dy = y - cy;
    const px = dx * cos + dy * sin;
    const py = -dx * sin + dy * cos;
    return (px * px) / (rx * rx) + (py * py) / (ry * ry) <= 1;
  };

  const inCollage = (x, y) => collageRects.some((rect) => (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  ));

  const buildMask = () => {
    mask = new Uint8ClampedArray(renderWidth * renderHeight);
    const data = source.data;
    for (let y = 0; y < renderHeight; y += 1) {
      const ny = y / renderHeight;
      for (let x = 0; x < renderWidth; x += 1) {
        const nx = x / renderWidth;
        const index = y * renderWidth + x;
        const pixel = index * 4;
        const r = data[pixel];
        const g = data[pixel + 1];
        const b = data[pixel + 2];
        const a = data[pixel + 3];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max - min;
        const flowerZone =
          inEllipse(nx, ny, 0.62, 0.28, 0.35, 0.18, -0.25) ||
          inEllipse(nx, ny, 0.55, 0.45, 0.38, 0.22, 0.08) ||
          inEllipse(nx, ny, 0.38, 0.62, 0.33, 0.21, -0.2) ||
          inEllipse(nx, ny, 0.69, 0.72, 0.28, 0.16, 0.25) ||
          inEllipse(nx, ny, 0.5, 0.83, 0.15, 0.28, 0.08);
        const vividPetal = saturation > 42 && (r > 112 || b > 104) && max > 118;
        if (a > 80 && flowerZone && vividPetal && !inCollage(nx, ny)) {
          const edgeFade = Math.min(1, Math.max(0, (saturation - 42) / 58));
          mask[index] = Math.round(130 + 105 * edgeFade);
        }
      }
    }
  };

  const drawLiquidFrame = (now) => {
    if (!source || !mask) return;
    if (now - lastFrame < 42) {
      requestAnimationFrame(drawLiquidFrame);
      return;
    }
    lastFrame = now;
    if (!isVisible) {
      requestAnimationFrame(drawLiquidFrame);
      return;
    }

    const output = liquidCtx.createImageData(renderWidth, renderHeight);
    const src = source.data;
    const dst = output.data;
    const time = now * 0.00032;

    for (let y = 0; y < renderHeight; y += 1) {
      const ny = y / renderHeight;
      for (let x = 0; x < renderWidth; x += 1) {
        const i = y * renderWidth + x;
        const alpha = mask[i];
        if (!alpha) continue;
        const nx = x / renderWidth;
        const waveA = Math.sin(ny * 28 + time * 2.1) * 2.2;
        const waveB = Math.cos(nx * 35 - time * 1.7) * 1.6;
        const ripple = Math.sin((nx + ny) * 42 + time * 2.4) * 0.9;
        const sx = Math.max(0, Math.min(renderWidth - 1, Math.round(x + waveA + ripple)));
        const sy = Math.max(0, Math.min(renderHeight - 1, Math.round(y + waveB - ripple)));
        const sp = (sy * renderWidth + sx) * 4;
        const dp = i * 4;
        dst[dp] = src[sp];
        dst[dp + 1] = src[sp + 1];
        dst[dp + 2] = src[sp + 2];
        dst[dp + 3] = Math.min(220, alpha);
      }
    }

    liquidCtx.putImageData(output, 0, 0);
    requestAnimationFrame(drawLiquidFrame);
  };

  const observer = new IntersectionObserver((entries) => {
    isVisible = entries.some((entry) => entry.isIntersecting);
  }, { threshold: 0.05 });
  observer.observe(poster);

  image.addEventListener("load", () => {
    liquidCanvas.width = renderWidth;
    liquidCanvas.height = renderHeight;
    workCanvas.width = renderWidth;
    workCanvas.height = renderHeight;
    workCtx.drawImage(image, 0, 0, renderWidth, renderHeight);
    source = workCtx.getImageData(0, 0, renderWidth, renderHeight);
    buildMask();
    requestAnimationFrame(drawLiquidFrame);
  });
}

function setupQuantumMap() {
  const map = document.querySelector(".quantum-map");
  if (!map) return;
  const orbs = [...map.querySelectorAll(".quantum-orb")];
  let pointerDown = false;

  const lightNearestOrb = (event) => {
    const rect = map.getBoundingClientRect();
    let nearest = null;
    let nearestDistance = 42;
    orbs.forEach((orb) => {
      const x = rect.left + (parseFloat(orb.style.getPropertyValue("--x")) / 100) * rect.width;
      const y = rect.top + (parseFloat(orb.style.getPropertyValue("--y")) / 100) * rect.height;
      const distance = Math.hypot(event.clientX - x, event.clientY - y);
      if (distance < nearestDistance) {
        nearest = orb;
        nearestDistance = distance;
      }
    });
    nearest?.classList.add("is-locked");
  };

  orbs.forEach((orb) => {
    orb.addEventListener("click", () => orb.classList.toggle("is-locked"));
  });
  map.addEventListener("pointerdown", () => {
    pointerDown = true;
  });
  map.addEventListener("pointermove", (event) => {
    if (pointerDown) lightNearestOrb(event);
  });
  window.addEventListener("pointerup", () => {
    pointerDown = false;
  });
  window.addEventListener("pointercancel", () => {
    pointerDown = false;
  });
}

function setupInternationalMap() {
  const map = document.querySelector(".international-crowd");
  if (!map) return;
  const people = [...map.querySelectorAll(".country-person")];
  const status = map.querySelector(".country-network-status");
  let pointerDown = false;

  const activate = (person) => {
    people.forEach((item) => item.classList.toggle("is-active", item === person));
    if (status) status.textContent = `${person.dataset.country} / GLOBAL TALENT NETWORK`;
  };

  const activateNearest = (event) => {
    let nearest = null;
    let nearestDistance = 72;
    people.forEach((person) => {
      const rect = person.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
      if (distance < nearestDistance) {
        nearest = person;
        nearestDistance = distance;
      }
    });
    if (nearest) activate(nearest);
  };

  people.forEach((person) => {
    person.addEventListener("click", (event) => {
      event.stopPropagation();
      activate(person);
    });
  });
  map.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    activateNearest(event);
  });
  map.addEventListener("pointermove", (event) => {
    if (pointerDown) activateNearest(event);
  });
  window.addEventListener("pointerup", () => {
    pointerDown = false;
  });
  window.addEventListener("pointercancel", () => {
    pointerDown = false;
  });
}

function setupSectionReveal() {
  if (document.documentElement.classList.contains("portfolio-motion-enabled")) return;
  if (reduceMotion) return;
  document.documentElement.classList.add("js-reveal");
  const targets = [
    ".section-heading-row",
    ".domains-visual-stage",
    ".domain-card",
    ".timeline-item",
    ".capability-card",
    ".metric",
    ".creative-tile",
    ".project-story-copy",
    ".project-media",
    ".statement-panel",
    ".contact-layout",
  ];
  const elements = document.querySelectorAll(targets.join(","));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
  elements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
    observer.observe(element);
  });
  const revealVisible = () => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.08 && rect.bottom > 0) {
        element.classList.add("is-visible");
        observer.unobserve(element);
      }
    });
  };
  requestAnimationFrame(revealVisible);
  window.setTimeout(revealVisible, 800);
}

function setupNavigationMotion() {
  const header = document.querySelector(".site-header");
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  if (!header || !links.length) return;

  const visibleTarget = (selector) => {
    const target = document.querySelector(selector);
    if (!target || !target.getClientRects().length) return null;
    return target;
  };

  const getTargetForLink = (link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return null;
    return visibleTarget(href)
      || (href === "#domains" ? visibleTarget("#editorial-portfolio") : null)
      || (href === "#profile-archive" ? visibleTarget("#projects") : null);
  };

  const setActiveLink = (activeLink) => {
    links.forEach((link) => link.classList.toggle("is-active", link === activeLink));
  };

  const observedPairs = links
    .map((link) => ({ link, target: getTargetForLink(link) }))
    .filter((item) => item.target);

  let navRaf = 0;
  const updateActiveFromViewport = () => {
    navRaf = 0;
    const probe = window.innerHeight * 0.46;
    const current = observedPairs.find(({ target }) => {
      const rect = target.getBoundingClientRect();
      return rect.top <= probe && rect.bottom >= probe;
    }) || observedPairs.find(({ target }) => target.getBoundingClientRect().top > 0);
    if (current) setActiveLink(current.link);
  };

  const requestActiveUpdate = () => {
    if (navRaf) return;
    navRaf = requestAnimationFrame(updateActiveFromViewport);
  };

  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    requestActiveUpdate();
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = getTargetForLink(link);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      setActiveLink(link);
      const href = link.getAttribute("href");
      if (href) history.replaceState(null, "", href);
    });
  });

  if ("IntersectionObserver" in window) {
    const observed = new Map();
    observedPairs.forEach(({ link, target }) => observed.set(target, link));

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visibleEntries.length) return;
      const link = observed.get(visibleEntries[0].target);
      if (link) setActiveLink(link);
    }, { rootMargin: "-42% 0px -48% 0px", threshold: [0.08, 0.22, 0.44] });

    observed.forEach((_, target) => observer.observe(target));
  }

  updateHeaderState();
  requestActiveUpdate();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

function setupCinematicScrollScenes() {
  if (reduceMotion) return;

  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const transitionSections = [...document.querySelectorAll(".light-case-section[data-cinematic-word]:not(.project-showcase):not(.capabilities-showcase):not(.proof-gallery-showcase):not(.content-library-showcase):not(.data-room-showcase)")];

  root.classList.add("is-cinematic-scroll");

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (from, to, progress) => from + (to - from) * progress;
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);
  let ticking = false;

  const updateHero = () => {
    if (!hero) return;

    const progress = clamp(window.scrollY / (window.innerHeight * 0.8));
    const eased = easeOut(progress);
    hero.style.setProperty("--hero-title-shift", `${lerp(0, -190, eased).toFixed(1)}px`);
    hero.style.setProperty("--hero-title-scale", lerp(1, 0.82, eased).toFixed(4));
    hero.style.setProperty("--hero-title-opacity", clamp(1 - progress * 1.16).toFixed(4));
    hero.style.setProperty("--hero-copy-opacity", clamp(1 - Math.max(0, progress - 0.18) * 1.32).toFixed(4));
    hero.style.setProperty("--hero-copy-y", `${lerp(0, -34, progress).toFixed(1)}px`);
    hero.style.setProperty("--hero-media-scale", lerp(1.12, 1, eased).toFixed(4));
    hero.style.setProperty("--hero-media-y", `${lerp(0, 54, progress).toFixed(1)}px`);
    hero.style.setProperty("--hero-art-opacity", lerp(0.9, 0.64, progress).toFixed(4));
    hero.style.setProperty("--hero-cue-opacity", clamp(1 - progress * 1.75).toFixed(4));
    hero.style.setProperty("--hero-cue-y", `${lerp(0, 18, progress).toFixed(1)}px`);
  };

  const updateTransitionWords = () => {
    const viewportHeight = Math.max(window.innerHeight, 1);

    transitionSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -viewportHeight * 0.45 || rect.top > viewportHeight * 1.45) return;

      const progress = clamp((viewportHeight - rect.top) / (viewportHeight * 0.96));
      const eased = easeOut(progress);
      section.style.setProperty("--transition-word-shift", `${lerp(-180, 160, eased).toFixed(1)}px`);
      section.style.setProperty("--transition-shell-y", `${lerp(44, 0, eased).toFixed(1)}px`);
      section.style.setProperty("--transition-shell-opacity", lerp(0.38, 1, eased).toFixed(4));
    });
  };

  const update = () => {
    ticking = false;
    updateHero();
    updateTransitionWords();
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function setupGsapEditorialScenes() {
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1025px)", () => {
    const projectSection = document.querySelector(".project-showcase");
    const proofSection = document.querySelector(".proof-gallery-showcase");
    const trendSection = document.querySelector(".trend-radar-showcase");
    const animations = [];

    const buildCardFocus = (timeline, items, options = {}) => {
      const last = Math.max(1, items.length - 1);
      const range = options.range ?? 0.18;
      const dimOpacity = options.dimOpacity ?? 0.56;
      const dimScale = options.dimScale ?? 0.94;
      const dimBlur = options.dimBlur ?? 3;
      const imageActiveScale = options.imageActiveScale ?? 1.035;
      const imageDimScale = options.imageDimScale ?? 1.08;
      const yOffset = options.yOffset || ((index) => (index % 2 ? 18 : -8));

      items.forEach((item, index) => {
        const center = index / last;
        const dimY = yOffset(index);
        const inAt = Math.max(0, center - range);
        const outAt = Math.min(0.96, center + range * 0.72);

        gsap.set(item.card, {
          opacity: index === 0 ? 1 : dimOpacity,
          scale: index === 0 ? 1 : dimScale,
          y: index === 0 ? 0 : dimY,
          filter: index === 0 ? "blur(0px)" : `blur(${dimBlur}px)`,
          force3D: true,
        });
        if (item.copy) {
          gsap.set(item.copy, {
            opacity: index === 0 ? 1 : 0.62,
            y: index === 0 ? 0 : 16,
            force3D: true,
          });
        }
        if (item.image) {
          gsap.set(item.image, {
            scale: index === 0 ? imageActiveScale : imageDimScale,
            xPercent: index === 0 ? 0 : (index % 2 ? -1.8 : 1.8),
            force3D: true,
          });
        }

        timeline.to(item.card, {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: range,
          ease: "none",
        }, inAt);
        if (item.copy) {
          timeline.to(item.copy, {
            opacity: 1,
            y: 0,
            duration: range,
            ease: "none",
          }, inAt);
        }
        if (item.image) {
          timeline.to(item.image, {
            scale: imageActiveScale,
            xPercent: 0,
            duration: range,
            ease: "none",
          }, inAt);
        }

        if (index < items.length - 1) {
          timeline.to(item.card, {
            opacity: dimOpacity,
            scale: dimScale,
            y: dimY,
            filter: `blur(${dimBlur}px)`,
            duration: range,
            ease: "none",
          }, outAt);
          if (item.copy) {
            timeline.to(item.copy, {
              opacity: 0.62,
              y: 16,
              duration: range,
              ease: "none",
            }, outAt);
          }
          if (item.image) {
            timeline.to(item.image, {
              scale: imageDimScale,
              xPercent: index % 2 ? 1.4 : -1.4,
              duration: range,
              ease: "none",
            }, outAt);
          }
        }
      });
    };

    if (trendSection) {
      const trendHeader = trendSection.querySelector("[data-trend-header]");
      const trendRows = [...trendSection.querySelectorAll("[data-trend-row]")];

      if (trendHeader && trendRows.length) {
        gsap.set(trendHeader, {
          opacity: 0,
          y: 40,
          force3D: true,
        });
        gsap.set(trendRows, {
          opacity: 0,
          y: 26,
          force3D: true,
        });

        const trendTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: trendSection,
            start: "top 72%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });

        trendTimeline
          .to(trendHeader, {
            opacity: 1,
            y: 0,
            duration: 0.72,
          })
          .to(trendRows, {
            opacity: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.08,
          }, "-=0.34");

        const setActiveTrendRow = (activeRow) => {
          trendRows.forEach((row) => {
            row.classList.toggle("is-active", row === activeRow);
          });
        };

        trendRows.forEach((row) => {
          const trigger = ScrollTrigger.create({
            trigger: row,
            start: "top 62%",
            end: "bottom 42%",
            onEnter: () => setActiveTrendRow(row),
            onEnterBack: () => setActiveTrendRow(row),
          });
          animations.push(trigger);
        });

        animations.push(trendTimeline);
      }
    }

    if (projectSection) {
      const stage = projectSection.querySelector("[data-project-stage]");
      const stageItems = stage ? [...stage.querySelectorAll("[data-project-stage-item]")] : [];
      const progress = stage?.querySelector("[data-project-progress]");

      if (stage && stageItems.length) {
        gsap.set(projectSection, {
          "--transition-word-shift": "-120px",
          "--transition-shell-opacity": 1,
          "--transition-shell-y": "0px",
        });
        gsap.set(stage, {
          opacity: 0,
          y: 40,
          force3D: true,
        });
        gsap.set(stageItems, {
          opacity: 0,
          y: 24,
          scale: 0.98,
          force3D: true,
        });
        if (progress) {
          gsap.set(progress, {
            scaleX: 0,
            transformOrigin: "left center",
          });
        }

        const projectTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: projectSection,
            start: "top 72%",
            end: "bottom 24%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        projectTimeline
          .to(projectSection, {
            "--transition-word-shift": "120px",
            duration: 1,
            ease: "none",
          }, 0)
          .to(stage, {
            opacity: 1,
            y: 0,
            duration: 0.34,
          }, 0.04)
          .to(stageItems, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.52,
            stagger: 0.075,
          }, 0.12);

        if (progress) {
          projectTimeline.to(progress, {
            scaleX: 1,
            duration: 0.82,
            ease: "none",
          }, 0.1);
        }

        animations.push(projectTimeline);
      }
    }

    if (proofSection) {
      const track = proofSection.querySelector(".proof-gallery-grid");
      const cards = [...proofSection.querySelectorAll(".proof-card")];
      const shell = proofSection.querySelector(".light-section-shell");
      const proofNote = proofSection.querySelector(".light-section-heading.compact-heading > p");

      if (track && cards.length && shell) {
        const proofItems = cards.map((card) => ({
          card,
          image: card.querySelector("img"),
          copy: card.querySelector(".proof-copy"),
        }));

        gsap.set(proofSection, { "--transition-word-shift": "-150px" });
        gsap.set(track, {
          x: () => Math.min(160, shell.clientWidth * 0.12),
          force3D: true,
        });
        gsap.set(proofNote, { opacity: 0.72, y: 10 });

        const proofTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: proofSection,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: shell,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const getProofTravel = () => Math.max(0, track.scrollWidth - shell.clientWidth + Math.min(180, shell.clientWidth * 0.14));

        proofTimeline
          .to(proofSection, {
            "--transition-word-shift": "190px",
            duration: 1,
          }, 0)
          .to(track, {
            x: () => -getProofTravel(),
            duration: 1,
          }, 0)
          .to(proofNote, {
            opacity: 1,
            y: -10,
            duration: 0.28,
          }, 0.05);

        buildCardFocus(proofTimeline, proofItems, {
          range: 0.17,
          dimOpacity: 0.58,
          dimScale: 0.94,
          dimBlur: 4,
          imageActiveScale: 1.025,
          imageDimScale: 1.06,
          yOffset: (index) => [-18, 10, -6, 16, -12, 8][index % 6],
        });

        animations.push(proofTimeline);
      }
    }

    return () => animations.forEach((animation) => animation.scrollTrigger?.kill());
  });
}

function setEditMode(enabled) {
  editMode = enabled;
  document.body.classList.toggle("is-editing", enabled);
  const toggle = document.querySelector("#toggle-edit");
  if (toggle) toggle.textContent = enabled ? "完成编辑" : "编辑页面";
  document.querySelectorAll("[data-edit-id]").forEach((element) => {
    element.contentEditable = enabled ? "true" : "false";
    element.spellcheck = false;
  });
  if (!enabled) {
    captureEditableContent();
    saveState();
  }
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.round(Math.min(120, width / 10)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 0.8 + 0.2,
    drift: Math.random() * 0.4 + 0.08,
    radius: Math.random() * 1.8 + 0.4,
  }));
}

function drawScene(time = 0) {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgb(8, 12, 12)");
  gradient.addColorStop(0.46, "rgb(9, 9, 7)");
  gradient.addColorStop(1, "rgb(22, 17, 10)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "rgba(247, 241, 231, 0.35)";
  const horizon = height * 0.72;
  for (let i = -10; i <= 10; i += 1) {
    ctx.beginPath();
    ctx.moveTo(width * 0.5, horizon);
    ctx.lineTo(width * 0.5 + i * width * 0.075, height);
    ctx.stroke();
  }
  for (let y = horizon; y < height; y += 34) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  particles.forEach((particle) => {
    particle.y -= particle.drift * particle.z;
    particle.x += Math.sin(time * 0.00018 + particle.y * 0.01) * 0.16;
    if (particle.y < -10) {
      particle.y = height + 10;
      particle.x = Math.random() * width;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(247, 241, 231, ${0.18 + particle.z * 0.34})`;
    ctx.arc(particle.x, particle.y, particle.radius * particle.z, 0, Math.PI * 2);
    ctx.fill();
  });

  if (!reduceMotion) requestAnimationFrame(drawScene);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  grid.innerHTML = state.projects
    .map((project, index) => {
      const imageStyle = project.image ? `style="background-image:url('${project.image}')"` : "";
      return `
        <button class="creative-tile ${project.image ? "has-image" : ""}" type="button" data-project-id="${escapeHtml(project.id)}" ${imageStyle}>
          <span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(project.category)}</span>
          <strong>${escapeHtml(project.title)}</strong>
          <em class="edit-project-label">编辑项目</em>
        </button>
      `;
    })
    .join("");
}

function openProject(project) {
  const overlay = document.querySelector(".project-overlay");
  const visual = document.querySelector("#overlay-visual");
  document.querySelector("#overlay-category").textContent = project.category;
  document.querySelector("#overlay-title").textContent = project.title;
  document.querySelector("#overlay-copy").textContent = project.description || "项目内容持续更新中。";
  const link = document.querySelector("#overlay-link");
  link.hidden = !project.url;
  link.href = project.url || "#";
  visual.style.backgroundImage = project.image
    ? `linear-gradient(90deg, rgba(5,5,4,.76), rgba(5,5,4,.16)), url("${project.image}")`
    : "";
  visual.classList.toggle("has-image", Boolean(project.image));
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
}

function closeProject() {
  const overlay = document.querySelector(".project-overlay");
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

function openProjectEditor(project = null) {
  const dialog = document.querySelector("#project-dialog");
  document.querySelector("#project-form-title").textContent = project ? "编辑项目" : "添加项目";
  document.querySelector("#project-id").value = project?.id || "";
  document.querySelector("#project-name").value = project?.title || "";
  document.querySelector("#project-category").value = project?.category || "AI影像";
  document.querySelector("#project-description").value = project?.description || "";
  document.querySelector("#project-url").value = project?.url || "";
  document.querySelector("#project-image").value = "";
  document.querySelector("#delete-project").hidden = !project;
  currentImage = project?.image || "";
  updateImagePreview();
  dialog.showModal();
}

function closeProjectEditor() {
  document.querySelector("#project-dialog").close();
}

function updateImagePreview() {
  const preview = document.querySelector("#image-preview");
  preview.innerHTML = currentImage ? `<img src="${currentImage}" alt="项目图片预览">` : "暂无图片";
}

function saveProject(event) {
  event.preventDefault();
  const id = document.querySelector("#project-id").value || `project-${Date.now()}`;
  const project = {
    id,
    title: document.querySelector("#project-name").value.trim(),
    category: document.querySelector("#project-category").value,
    description: document.querySelector("#project-description").value.trim(),
    url: document.querySelector("#project-url").value.trim(),
    image: currentImage,
  };
  const index = state.projects.findIndex((item) => item.id === id);
  if (index >= 0) state.projects[index] = project;
  else state.projects.push(project);
  saveState();
  renderProjects();
  closeProjectEditor();
}

function deleteCurrentProject() {
  const id = document.querySelector("#project-id").value;
  if (!id) return;
  state.projects = state.projects.filter((project) => project.id !== id);
  saveState();
  renderProjects();
  closeProjectEditor();
}

function exportData() {
  captureEditableContent();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "guo-xuantong-portfolio-data.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported.content || !Array.isArray(imported.projects)) throw new Error("invalid");
      state = {
        content: imported.content,
        projects: imported.projects,
        media: normalizeMedia(imported.media),
      };
      saveState();
      restoreEditableContent();
      renderProjects();
      renderCaseMedia();
      showStatus("数据导入成功");
    } catch {
      showStatus("无法读取该数据文件");
    }
  };
  reader.readAsText(file);
}

migrateRevisedContent();
restoreEditableContent();
renderProjects();
renderCaseMedia();
setupAboutFlowerMotion();
setupQuantumMap();
setupInternationalMap();
setupSectionReveal();
setupNavigationMotion();
setupCinematicScrollScenes();
setupGsapEditorialScenes();
resizeCanvas();
drawScene();
window.addEventListener("resize", resizeCanvas);

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.counter);
    const suffix = element.dataset.suffix || "";
    const start = performance.now();
    const duration = reduceMotion ? 1 : 1100;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
      element.textContent = `${new Intl.NumberFormat("zh-CN").format(value)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(element);
  });
}, { threshold: 0.35 });
document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

if (editorAccess) {
  document.querySelector("#toggle-edit").addEventListener("click", () => setEditMode(!editMode));
  document.querySelector("#save-content").addEventListener("click", () => {
    captureEditableContent();
    saveState();
  });
  document.querySelector("#export-data").addEventListener("click", exportData);
  document.querySelector("#import-data").addEventListener("change", (event) => {
    if (event.target.files[0]) importData(event.target.files[0]);
    event.target.value = "";
  });
}

const projectGrid = document.querySelector("#project-grid");
let projectGridStartX = 0;
let projectGridDragged = false;
let projectGridPointerDown = false;
projectGrid.addEventListener("pointerdown", (event) => {
  projectGridStartX = event.clientX;
  projectGridDragged = false;
  projectGridPointerDown = true;
});
projectGrid.addEventListener("pointermove", (event) => {
  if (projectGridPointerDown && Math.abs(event.clientX - projectGridStartX) > 8) projectGridDragged = true;
});
projectGrid.addEventListener("pointerup", () => {
  projectGridPointerDown = false;
});
projectGrid.addEventListener("pointercancel", () => {
  projectGridPointerDown = false;
});
projectGrid.addEventListener("click", (event) => {
  if (projectGridDragged) {
    projectGridDragged = false;
    return;
  }
  const card = event.target.closest("[data-project-id]");
  if (!card) return;
  const project = state.projects.find((item) => item.id === card.dataset.projectId);
  if (!project) return;
  if (editMode) openProjectEditor(project);
  else openProject(project);
});

document.querySelector(".overlay-close").addEventListener("click", closeProject);
document.querySelector(".project-overlay").addEventListener("click", (event) => {
  if (event.target.classList.contains("project-overlay")) closeProject();
});
if (editorAccess) {
  document.querySelector("#project-form").addEventListener("submit", saveProject);
  document.querySelector(".dialog-close").addEventListener("click", closeProjectEditor);
  document.querySelector("#cancel-project").addEventListener("click", closeProjectEditor);
  document.querySelector("#delete-project").addEventListener("click", deleteCurrentProject);
  document.querySelector("#project-image").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      showStatus("单张图片请控制在20MB以内");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      currentImage = reader.result;
      updateImagePreview();
    };
    reader.readAsDataURL(file);
  });
  document.querySelector("#annotation-form").addEventListener("submit", saveAnnotation);
  document.querySelector(".annotation-close").addEventListener("click", closeAnnotationEditor);
  document.querySelector(".annotation-cancel").addEventListener("click", closeAnnotationEditor);
}

let activeMediaId = "";
document.querySelectorAll("[data-upload-media]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    activeMediaId = button.dataset.uploadMedia;
    document.querySelector("#case-media-input").click();
  });
});

document.querySelectorAll("[data-media-id]").forEach((container) => {
  container.addEventListener("click", (event) => {
    if (!editorAccess) return;
    if (event.target.closest("button, .media-carousel")) return;
    if (!editMode) setEditMode(true);
    activeMediaId = container.dataset.mediaId;
    document.querySelector("#case-media-input").click();
  });
});

async function prepareMediaImage(file) {
  const bitmap = await createImageBitmap(file);
  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const imageCanvas = document.createElement("canvas");
  imageCanvas.width = Math.max(1, Math.round(bitmap.width * scale));
  imageCanvas.height = Math.max(1, Math.round(bitmap.height * scale));
  imageCanvas.getContext("2d").drawImage(bitmap, 0, 0, imageCanvas.width, imageCanvas.height);
  bitmap.close();
  return imageCanvas.toDataURL("image/webp", 0.84);
}

document.querySelector("#case-media-input").addEventListener("change", async (event) => {
  const files = [...event.target.files];
  if (!files.length || !activeMediaId) return;
  if (files.some((file) => file.size > 20 * 1024 * 1024)) {
    showStatus("单张图片请控制在20MB以内");
    event.target.value = "";
    return;
  }
  try {
    const mediaId = activeMediaId;
    const prepared = await Promise.all(files.map((item) => prepareMediaImage(item)));
    const images = prepared.map((src) => ({ src, note: "" }));
    state.media[mediaId] = [...(state.media[mediaId] || []), ...images];
    mediaPositions.set(mediaId, state.media[mediaId].length - images.length);
    saveState();
    renderCaseMedia();
    showStatus(`已添加 ${images.length} 张图片`);
  } catch {
    showStatus("图片处理失败，请换一张图片重试");
  }
  event.target.value = "";
});

document.addEventListener("input", (event) => {
  if (!editMode || !event.target.matches("[data-edit-id]")) return;
  window.clearTimeout(document.editSaveTimer);
  document.editSaveTimer = window.setTimeout(() => {
    captureEditableContent();
    saveState(false);
  }, 500);
});

document.addEventListener("click", (event) => {
  if (editMode && event.target.closest("a[data-edit-id]")) event.preventDefault();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeProject();
  if (document.querySelector("#project-dialog")?.open) closeProjectEditor();
});
