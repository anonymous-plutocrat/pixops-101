/* ================= landing page (Overview) ================= */
const HOME_TOOLS = [
  ["Programming language", "Python", "", "The language every exercise is written in. Each line does one step, like loading an image or changing it."],
  ["Library for numbers", "NumPy", "np", "Stores an image as a grid of numbers (an array), so you can do maths on every pixel at once."],
  ["Image library", "Pillow", "PIL", "Beginner-friendly. Open an image, call a method on it, like image.rotate(45), and get a new image back."],
  ["Computer vision library", "OpenCV", "cv2", "A bigger toolbox. Its functions take an array and return a new one, like cv2.flip(image, 1)."],
];
const HOME_LIBS = [
  ["Load an image", 'Image.open("image.png")', 'cv2.imread("image.png")'],
  ["What you get back", "An Image object; np.array(image) turns it into an array", "A NumPy array of shape (rows, cols, 3)"],
  ["Channel order", "R, G, B", "B, G, R"],
  ["Show it with Matplotlib", "Works as it is", "Convert with cv2.cvtColor first, or red and blue swap"],
  ["Good at", "Quick edits, built-in filters, drawing and text", "A larger toolbox: warps, filters, thresholds, fast array maths"],
];
const HOME_HOW = [
  ["1", "The operation", "A short explanation of what the operation does and when you would use it."],
  ["2", "The code", "The Python call from the lab. Hover or tap any underlined part to see what it does. Values in the code are editable: change one, press Run, and the image updates. Where Pillow and OpenCV differ, tabs switch between them."],
  ["3", "The output", "Charts, kernels or matrices that explain the result, on the pages where they add something. Simpler operations finish at step 2."],
];
const HOME_TIPS = [
  "The image panel on the right always shows the input, and the output after you run the code. Hover it to read pixel values.",
  "The reset icon beside each block of code puts its values back to the lab's originals. The reset icon in the top bar starts the page over.",
  "Use the sample city scene, or upload your own picture from the image panel. It is cropped to 256 × 256 and never leaves your device.",
];
const ICON_HEART = '<svg class="i" viewBox="0 0 20 20" role="img" aria-label="love" style="color:#da1e28"><path d="M10 17.5 8.9 16.5C4.6 12.7 1.75 10.1 1.75 6.9 1.75 4.3 3.8 2.25 6.4 2.25c1.45 0 2.85.68 3.6 1.75.75-1.07 2.15-1.75 3.6-1.75 2.6 0 4.65 2.05 4.65 4.65 0 3.2-2.85 5.8-7.15 9.6z"/></svg>';
const ICON_CURSOR = '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 2.5v14l3.6-3.4 2.3 5.1 1.9-.9-2.3-5h5z"/></svg>';
const ICON_LOCK = '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M6 8V6a4 4 0 1 1 8 0v2h1.5v10h-11V8zm1.5 0h5V6a2.5 2.5 0 0 0-5 0z"/></svg>';
const ICON_CODE = '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6 3 10l4 4M13 6l4 4-4 4"/></svg>';
const ICON_PERSON = '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="6.5" r="3"/><path d="M4 17c.6-3.2 3-5 6-5s5.4 1.8 6 5"/></svg>';

/* sticky bottom dock in the middle column: the call to action (overview only) and the credit footer */
function buildDock(cta) {
  const dock = el("div", "dock");
  if (cta) {
    const row = el("aside", "dock-in dock-cta"); row.setAttribute("aria-label", "Get started");
    row.appendChild(el("p", "", "Nothing to install: everything runs in your browser."));
    const go = el("a", "btn btn-primary", `Start the first exercise ${ICON.arrowR}`); go.href = "#" + OPS[0].id; row.appendChild(go);
    dock.appendChild(row);
  }
  const f = el("footer", "dock-in dock-foot");
  f.innerHTML = `<p class="made">Made with ${ICON_HEART} by <strong>Favour Mokwenye</strong></p>
    <nav aria-label="Favour Mokwenye's profiles" class="profiles">
      <a class="flink" href="https://github.com/anonymous-plutocrat" target="_blank" rel="noopener">${ICON_CODE} GitHub</a>
      <a class="flink" href="https://www.linkedin.com/in/favourmokwenye/" target="_blank" rel="noopener">${ICON_PERSON} LinkedIn</a>
    </nav>`;
  dock.appendChild(f);
  return dock;
}

/* elements slide up a little and fade in as they scroll into view */
function revealOnScroll(nodes) {
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  nodes.forEach(n => { n.classList.add("rv"); io.observe(n); });
}
/* text resolves from random characters into the real words, left to right */
function decipher(node, dur) {
  if (reduceMotion || !node || node.dataset.dc) return;
  node.dataset.dc = "1";
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=<>/", W = 10;
  const parts = [], walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); let total = 0;
  while (walk.nextNode()) parts.push(walk.currentNode);
  const segs = parts.map(t => { const txt = t.nodeValue, wrap = document.createElement("span"), d = el("span"), sc = el("span", "dc-scr"), r = el("span", "dc-rest");
    wrap.append(d, sc, r); t.replaceWith(wrap); const seg = { txt, wrap, d, sc, r, o: total }; total += txt.length; return seg; });
  node.setAttribute("aria-busy", "true");
  const t0 = performance.now(); let last = 0;
  const frame = now => {
    const k = Math.min(1, (now - t0) / dur), pos = Math.floor(k * (total + W));
    if (now - last > 40 || k === 1) { last = now;
      segs.forEach(g => { const a = Math.max(0, Math.min(g.txt.length, pos - W - g.o)), b = Math.max(0, Math.min(g.txt.length, pos - g.o));
        g.d.textContent = g.txt.slice(0, a);
        g.sc.textContent = [...g.txt.slice(a, b)].map(c => c === " " ? " " : CH[Math.random() * CH.length | 0]).join("");
        g.r.textContent = g.txt.slice(b); });
    }
    if (k < 1) requestAnimationFrame(frame);
    else { segs.forEach(g => g.wrap.replaceWith(document.createTextNode(g.txt))); node.normalize(); node.removeAttribute("aria-busy"); delete node.dataset.dc; }
  };
  segs.forEach(g => { g.d.textContent = ""; g.r.textContent = g.txt; });
  requestAnimationFrame(frame);
}

/* image starts as big blocks and sharpens in steps until it is the full photo */
function pixelReveal(img, dur) {
  if (reduceMotion || !img) return;
  const box = img.parentNode, cv = el("canvas", "px-veil"); cv.setAttribute("aria-hidden", "true"); box.appendChild(cv);
  const run = () => {
    const W = Math.max(1, Math.round(img.clientWidth * (devicePixelRatio || 1))), H = Math.max(1, Math.round(img.clientHeight * (devicePixelRatio || 1)));
    cv.width = W; cv.height = H; const x = cv.getContext("2d"), small = document.createElement("canvas"), sx = small.getContext("2d");
    const STEPS = 14, t0 = performance.now(); let last = -1;
    const draw = n => { /* n blocks across, from 4 up to the image's own resolution */
      const bw = Math.max(1, Math.round(n)), bh = Math.max(1, Math.round(n * H / W));
      small.width = bw; small.height = bh; sx.imageSmoothingEnabled = true; sx.drawImage(img, 0, 0, bw, bh);
      x.imageSmoothingEnabled = false; x.clearRect(0, 0, W, H); x.drawImage(small, 0, 0, W, H);
    };
    const frame = now => {
      if (!cv.isConnected) return;
      const k = Math.min(1, (now - t0) / dur), step = Math.min(STEPS, Math.floor(k * STEPS));
      if (step !== last) { last = step; draw(4 * Math.pow(img.naturalWidth / 4, step / STEPS)); }
      if (k < 1) requestAnimationFrame(frame); else { cv.classList.add("gone"); setTimeout(() => cv.remove(), 600); }
    };
    draw(4); requestAnimationFrame(frame);
  };
  const start = () => whenLoaded(() => img.complete ? run() : img.addEventListener("load", run, { once: true }));
  if (!("IntersectionObserver" in window)) return start();
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); start(); } }, { threshold: 0.2 });
  io.observe(box);
}

function openHome() {
  cur = null; hideTip();
  document.body.classList.add("landing");
  document.title = "PixOps 101";
  $("crumb").textContent = "Overview";
  OPS.forEach(o => { o.menuLink.classList.remove("on"); o.menuLink.classList.toggle("done", o.step >= 3); o.menuLink.removeAttribute("aria-current"); });
  expandGroup(null);
  $("homeLink").classList.add("on"); $("homeLink").setAttribute("aria-current", "page");
  $("frames").innerHTML = "";

  const wz = $("wizard"); wz.innerHTML = "";
  const page = el("div", "home");

  /* hero */
  const hero = el("section", "home-hero");
  hero.innerHTML = `<h1>PixOps 101</h1>
    <figure class="hero-media"><img class="hero-img" src="__HERO__" alt="A landscape built from coloured cubes, like pixels raised into 3D: blue water and green land">
      <figcaption class="hero-credit"><a href="https://unsplash.com/photos/background-pattern-Ue97JK9S0QE" target="_blank" rel="noopener">Image from Unsplash ${ICON.arrowR}</a></figcaption></figure>
    <p class="lead">Hi there, welcome to Image processing fundamentals, This is a visualizer i built to help me get conversant with basic image processing operations in Pillow and OpenCV. It takes you through a single operation one at a time. <br>It covers a total of ${OPS.length} operations from the Pillow and OpenCV labs: take your time, ensure to read what each one does, explore and edit its code, then run it and watch the image change.</p>`;
  page.appendChild(hero);

  /* what is a digital image */
  const grid = el("section", "home-sec"); grid.setAttribute("aria-labelledby", "home-grid-h");
  grid.innerHTML = `<h2 id="home-grid-h">What is a digital image?</h2>
    <p>A digital image is a grid of pixels. Each pixel stores numbers from 0 to 255 that say how bright it is. A grayscale image has one number per pixel; a color image has three, one each for red, green and blue. Pillow and OpenCV both give you that grid as a NumPy array, so most image processing is arithmetic on arrays.</p>`;
  const demo = el("div", "pixdemo"), left = el("div", "pixdemo-src"), cv = el("canvas"), right = el("div", "pixdemo-zoom");
  cv.width = cv.height = N; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "The current image. Move over it to choose the patch shown beside it.");
  const hint = el("p", "pixhint"); hint.setAttribute("aria-live", "polite");
  left.append(hint, cv);
  const cells = el("div", "pixgrid"), info = el("div", "pixinfo");
  const sw = el("div", "switcher"); sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "Values shown in the grid");
  let mode = "rgb";
  const modes = [["rgb", "Full color"], ["gray", "Gray"], ["r", "R"], ["g", "G"], ["b", "B"]].map(([m, l]) => { const b = el("button", "", l); b.type = "button"; b.addEventListener("click", () => { mode = m; syncMode(); fill(pos[0], pos[1], hl[0], hl[1]); }); sw.appendChild(b); return [m, b]; });
  const syncMode = () => modes.forEach(([m, b]) => b.setAttribute("aria-pressed", m === mode));
  right.append(sw, cells, info); demo.append(left, right); grid.appendChild(demo);
  const facts = el("dl", "facts");
  [["Shape", "(rows, columns, channels), for example (256, 256, 3). Grayscale drops the last number: (256, 256)."],
   ["Type", "uint8: whole numbers from 0 to 255. 0 is no light (black), 255 is full brightness."],
   ["Position", "(0, 0) is the top-left pixel. Rows count down, columns across: array[row, column]."]]
    .forEach(([k, v]) => { const d = el("div"); d.append(el("dt", "", k), el("dd", "", esc(v))); facts.appendChild(d); });
  grid.appendChild(facts);
  page.appendChild(grid);

  /* language and libraries */
  const libs = el("section", "home-sec"); libs.setAttribute("aria-labelledby", "home-libs-h");
  libs.innerHTML = `<div class="sec-head"><h2 id="home-libs-h">Programming language and libraries used</h2><span class="sub">Python, NumPy, Pillow and OpenCV. No experience needed.</span></div>
    <div class="tools">${HOME_TOOLS.map(([k, n, c, p]) => `<div class="tool"><span class="eyebrow">${esc(k)}</span><span class="tool-n">${esc(n)}${c ? ` <code>${esc(c)}</code>` : ""}</span><span class="tool-p">${esc(p)}</span></div>`).join("")}</div>
    <p>Pillow and OpenCV often do the same job with different code. Most exercises show both, so here is where they differ:</p>`;
  const tw = el("div", "table-wrap"), t = el("table", "dtable");
  t.innerHTML = `<thead><tr><th scope="col"></th><th scope="col">Pillow</th><th scope="col">OpenCV</th></tr></thead><tbody>${HOME_LIBS.map(([k, a, b], i) => { const f = v => i === 0 ? `<code>${esc(v)}</code>` : esc(v); return `<tr><th scope="row">${esc(k)}</th><td>${f(a)}</td><td>${f(b)}</td></tr>`; }).join("")}</tbody>`;
  tw.appendChild(t); libs.appendChild(tw);
  page.appendChild(libs);

  /* how each page works */
  const hw = el("section", "home-sec"); hw.id = "home-how"; hw.setAttribute("aria-labelledby", "home-how-h");
  hw.innerHTML = `<h2 id="home-how-h">How each exercise works</h2>`;
  const steps = el("ol", "howsteps");
  HOME_HOW.forEach(([n, h, p]) => { const li = el("li"); li.innerHTML = `<span class="hs-n" aria-hidden="true">${n}</span><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`; steps.appendChild(li); });
  hw.appendChild(steps);
  const tips = el("ul", "tips"); HOME_TIPS.forEach(x => tips.appendChild(el("li", "", esc(x)))); hw.appendChild(tips);
  page.appendChild(hw);

  /* what's inside */
  const inside = el("section", "home-sec"); inside.setAttribute("aria-labelledby", "home-in-h");
  inside.innerHTML = `<h2 id="home-in-h">What's inside</h2><p>${OPS.length} operations across the five lab topics of Module 2. Pick any topic to start there; your progress shows as a check mark in the menu.</p>`;
  const tiles = el("div", "tiles");
  GROUPS.forEach((g, gi) => {
    const ops = OPS.filter(o => o.group === g.id), a = el("a", "tile");
    a.href = "#" + ops[0].id; a.setAttribute("aria-label", `Exercise ${gi + 1}: ${g.title}`);
    a.innerHTML = `<span class="tile-top"><svg class="gi" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${GROUP_ICON[g.id] || ""}</svg><span class="eyebrow">Exercise ${gi + 1}</span></span><h3>${esc(g.title)}</h3><ul>${ops.map(o => `<li>${o.num}&nbsp; ${esc(o.title)}</li>`).join("")}</ul><span class="tile-go">${ICON.arrowR}</span>`;
    tiles.appendChild(a);
  });
  inside.appendChild(tiles);
  page.appendChild(inside);
  wz.appendChild(page);

  page.appendChild(el("p", "home-credit", "Built from Module 2 of IBM's Introduction to Computer Vision and Image Processing course (IBM Skills Network). The explanations, sample image and code are original to PixOps 101."));
  wz.appendChild(buildDock(true));
  /* scroll reveal */
  const rv = [...page.querySelectorAll(".home-sec > *, .home-credit")].filter(n => !n.classList.contains("tiles"));
  page.querySelectorAll(".tile").forEach((t, i) => { t.style.setProperty("--rvd", (i % 3) * 0.08 + "s"); rv.push(t); });
  revealOnScroll(rv);
  pixelReveal(hero.querySelector(".hero-img"), 5000);
  { /* the text deciphers over 5 seconds; after that the title deciphers again while the overview is open */
    const h1 = hero.querySelector("h1"), first = !openHome.played; openHome.played = true;
    whenLoaded(() => {
      if (first) decipher(hero.querySelector(".lead"), 5000);
      decipher(h1, first ? 5000 : 2500);
      /* then a 10 second pause, a 2.5 second decipher, and repeat */
      setTimeout(function loop() { if (!h1.isConnected) return; decipher(h1, 2500); setTimeout(loop, 2500 + 10000); }, (first ? 5000 : 2500) + 10000);
    });
  }
  window.scrollTo({ top: 0 });

  /* pixel demo behaviour */
  const P = 8;
  const drawSrc = (px, py) => {
    const x = cv.getContext("2d"); x.putImageData(toID(SRC), 0, 0);
    x.lineWidth = 2; x.strokeStyle = "#000"; x.strokeRect(px - 1, py - 1, P + 2, P + 2); x.strokeStyle = "#fff"; x.lineWidth = 1; x.strokeRect(px - 0.5, py - 0.5, P + 1, P + 1);
  };
  const MODE_TXT = { rgb: "Each cell shows the pixel's full color with all three values: red, green and blue, top to bottom.", gray: "Each cell shows the pixel's grayscale value, drawn in that shade of gray.", r: "Each cell shows the pixel's red value, 0 to 255, drawn in red.", g: "Each cell shows the pixel's green value, 0 to 255, drawn in green.", b: "Each cell shows the pixel's blue value, 0 to 255, drawn in blue." };
  let hl = [3, 3];
  const fill = (px, py, hx, hy) => {
    hl = [hx, hy]; cells.innerHTML = "";
    for (let y = 0; y < P; y++) for (let x = 0; x < P; x++) {
      const j = ((py + y) * N + px + x) * 3, r = SRC.d[j], g = SRC.d[j + 1], b = SRC.d[j + 2], gr = GRAY.d[(py + y) * N + px + x];
      const v = mode === "r" ? r : mode === "g" ? g : mode === "b" ? b : gr;
      const c = el("div", "pc" + (x === hx && y === hy ? " sel" : "") + (mode === "rgb" ? " full" : ""), mode === "rgb" ? `<span>${r}</span><span>${g}</span><span>${b}</span>` : String(v));
      c.style.background = mode === "rgb" ? `rgb(${r},${g},${b})` : mode === "r" ? `rgb(${v},0,0)` : mode === "g" ? `rgb(0,${v},0)` : mode === "b" ? `rgb(0,0,${v})` : `rgb(${v},${v},${v})`;
      const lum = mode === "rgb" ? 0.3 * r + 0.59 * g + 0.11 * b : mode === "r" ? v * 0.3 : mode === "g" ? v * 0.59 : mode === "b" ? v * 0.11 : v;
      c.style.color = lum > 120 ? "#161616" : "#ffffff";
      c.title = `row ${py + y}, column ${px + x}: R ${r}, G ${g}, B ${b}`;
      cells.appendChild(c);
    }
    const j = ((py + hy) * N + px + hx) * 3;
    info.innerHTML = `<span class="lbl">Highlighted pixel · row ${py + hy}, column ${px + hx}</span><code>R ${SRC.d[j]}  G ${SRC.d[j + 1]}  B ${SRC.d[j + 2]}</code><span class="lbl">${MODE_TXT[mode]}</span>`;
  };
  let pos = [200, 96], locked = false;
  const paintHint = () => {
    hint.classList.toggle("on", locked);
    hint.innerHTML = locked
      ? `${ICON_LOCK}<span><strong>Locked</strong> on the patch at row ${pos[1]}, column ${pos[0]}. Click the image again to unlock.</span>`
      : `${ICON_CURSOR}<span><strong>Move over the image</strong> to look at an 8 × 8 patch up close. Click once to lock it in place.</span>`;
  };
  const show = (px, py, hx = 3, hy = 3) => { pos = [px, py]; drawSrc(px, py); fill(px, py, hx, hy); };
  const at = e => { const r = cv.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * N), y = Math.floor((e.clientY - r.top) / r.height * N); return [Math.max(0, Math.min(N - P, x - P / 2)), Math.max(0, Math.min(N - P, y - P / 2))]; };
  cv.addEventListener("pointermove", e => { if (!locked && e.pointerType !== "touch") show(...at(e)); });
  cv.addEventListener("click", e => {
    const [px, py] = at(e);
    locked = !locked; if (locked) show(px, py); paintHint();
  });
  cv.tabIndex = 0; cv.addEventListener("keydown", e => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!d) return; e.preventDefault();
    const st = e.shiftKey ? 8 : 1; locked = true; show(Math.max(0, Math.min(N - P, pos[0] + d[0] * st)), Math.max(0, Math.min(N - P, pos[1] + d[1] * st))); paintHint();
  });
  cells.addEventListener("pointermove", e => { const c = e.target.closest(".pc"); if (!c) return; const i = [...cells.children].indexOf(c); fill(pos[0], pos[1], i % P, Math.floor(i / P)); });
  openHome.refresh = () => show(pos[0], pos[1]);
  syncMode(); show(pos[0], pos[1]); paintHint();
}

/* ================= image choice before the first exercise ================= */
let IMG_CHOSEN = false, modalBack = null;
const ICON_X = '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 5l10 10M15 5 5 15"/></svg>';
const ICON_UP = '<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21V7M10 13l6-6 6 6M6 21v4h20v-4"/></svg>';
const ICON_OK = '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="currentColor"/><path d="M6.3 10.2 8.8 12.7 13.7 7.6" fill="none" stroke="var(--cds-ok-bg)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function closeModal() {
  const m = $("modal"); if (!m) return; m.remove(); document.body.classList.remove("modal-open");
  if (modalBack && document.contains(modalBack)) modalBack.focus(); modalBack = null;
}
function modalShell(id, eyebrow, title, onClose) {
  closeModal();
  modalBack = document.activeElement;
  const scrim = el("div", "modal-scrim"); scrim.id = "modal";
  const box = el("div", "modal"); box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", id + "-title");
  const head = el("div", "modal-head");
  head.innerHTML = `<div><span class="modal-eyebrow">${esc(eyebrow)}</span><h2 id="${id}-title">${esc(title)}</h2></div>`;
  const x = el("button", "modal-x", ICON_X); x.type = "button"; x.setAttribute("aria-label", "Close"); x.addEventListener("click", onClose); head.appendChild(x);
  const body = el("div", "modal-body"), foot = el("div", "modal-foot");
  box.append(head, body, foot); scrim.appendChild(box);
  scrim.addEventListener("keydown", e => {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab") return;
    const f = [...box.querySelectorAll("button, input, a[href]")].filter(n => !n.disabled && n.offsetParent !== null && !(n.type === "radio" && !n.checked));
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.body.appendChild(scrim); document.body.classList.add("modal-open"); hideTip(); setMenu(false);
  return { box, body, foot };
}
function showChoice() {
  const done = () => { IMG_CHOSEN = true; closeModal(); };
  const { body, foot } = modalShell("choose", "Before you start", "Choose an image to work with", done);
  body.innerHTML = `<p class="modal-p">Every exercise runs on the same image, so you can compare results from one page to the next. You can change it later from the image panel.</p>`;
  const group = el("div", "rtiles"); group.setAttribute("role", "radiogroup"); group.setAttribute("aria-label", "Image to use");
  const tile = (val, media, h, p, on) => {
    const l = el("label", "rtile"), r = el("input"); r.type = "radio"; r.name = "imgChoice"; r.value = val; r.checked = on;
    l.append(r); l.insertAdjacentHTML("beforeend", `<span class="rmark" aria-hidden="true"></span>`); l.appendChild(media);
    l.append(el("span", "rtile-h", esc(h)), el("span", "rtile-p", esc(p))); group.appendChild(l); return r;
  };
  const thumb = el("canvas", "rthumb"); thumb.width = thumb.height = N; thumb.getContext("2d").putImageData(toID(SAMPLE), 0, 0);
  const up = el("span", "rthumb rthumb-up", ICON_UP);
  const rs = tile("sample", thumb, "Use the sample image", "A city at dusk drawn for these exercises: strong edges, bright windows and a smooth sky. Already 256 × 256.", true);
  const ru = tile("upload", up, "Upload your own", "A colourful photo with plenty of detail works best. PNG or JPEG.", false);
  body.appendChild(group);
  body.insertAdjacentHTML("beforeend", `<div class="note-info">${ICON.info}<p><strong>Your photo will be resized.</strong> We crop the centre square and scale it to 256 × 256 pixels, the size every exercise is set up for. It stays on your device.</p></div>`);
  const back = el("button", "mbtn mbtn-secondary", "Back to overview"); back.type = "button";
  back.addEventListener("click", () => { closeModal(); location.hash = "#overview"; });
  const go = el("button", "mbtn mbtn-primary", "Continue with the sample"); go.type = "button";
  const sync = () => { go.textContent = ru.checked ? "Choose a photo" : "Continue with the sample"; };
  [rs, ru].forEach(r => r.addEventListener("change", sync));
  ru.addEventListener("click", () => { if (ru.checked) setTimeout(() => $("fileM").click(), 0); });
  go.addEventListener("click", () => { if (ru.checked) $("fileM").click(); else { if (SRC !== SAMPLE) setSource(SAMPLE, "Sample city scene"); done(); } });
  foot.append(back, go);
  go.focus();
}
function showReady(info) {
  const done = () => { IMG_CHOSEN = true; closeModal(); };
  const { body, foot } = modalShell("ready", info.first ? "Before you start" : "New image", "Your image is ready", done);
  body.innerHTML = `<div class="note-ok" role="status">${ICON_OK}<p><strong>Resized to 256 × 256 pixels.</strong> ${esc(info.name)} was ${info.w} × ${info.h}.</p></div>`;
  const cmp = el("div", "rcompare");
  const s = 192 / Math.max(info.w, info.h), ow = Math.round(info.w * s), oh = Math.round(info.h * s), m = Math.min(ow, oh);
  const oc = el("canvas"); oc.width = ow; oc.height = oh; const ox = oc.getContext("2d"); ox.drawImage(info.im, 0, 0, ow, oh);
  ox.lineWidth = 2; ox.strokeStyle = "#ffffff"; ox.strokeRect((ow - m) / 2 + 1, (oh - m) / 2 + 1, m - 2, m - 2);
  ox.setLineDash([4, 4]); ox.strokeStyle = "#0f62fe"; ox.strokeRect((ow - m) / 2 + 1, (oh - m) / 2 + 1, m - 2, m - 2);
  const rc = el("canvas"); rc.width = rc.height = N; rc.getContext("2d").putImageData(toID(SRC), 0, 0);
  const fig = (c, cap, cls) => { const f = el("figure", "rfig " + cls), w = el("div", "rbox"); w.appendChild(c); f.append(w, el("figcaption", "lbl", cap)); return f; };
  cmp.append(fig(oc, `Original · ${info.w} × ${info.h} · centre square marked`, "orig"), el("span", "rarrow", ICON.arrowR), fig(rc, "Resized · 256 × 256", "res"));
  body.appendChild(cmp);
  body.appendChild(el("p", "modal-p", "We kept the centre square of your photo and scaled it to 256 × 256 pixels. Every exercise is set up for this size, so results show instantly and the values in the code, like crop boxes and shifts, fit your image. It stays on your device, and you can switch images any time from the image panel."));
  const again = el("button", "mbtn mbtn-secondary", "Choose a different image"); again.type = "button";
  again.addEventListener("click", () => showChoice());
  const go = el("button", "mbtn mbtn-primary", cur ? (info.first ? "Start the exercises" : "Continue") : "Done"); go.type = "button";
  go.addEventListener("click", done);
  foot.append(again, go);
  go.focus();
}
