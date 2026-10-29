/* ================= app ================= */
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
const ICON = {
  arrowR: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3.5 10 4.5l4.8 4.8H2v1.4h12.8L10 15.5l1 1 6.5-6.5z"/></svg>',
  arrowL: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M9 3.5l1 1-4.8 4.8H18v1.4H5.2l4.8 4.8-1 1L2.5 10z"/></svg>',
  arrowD: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 11l-1-1-4.8 4.8V2H9.3v12.8L4.5 10l-1 1 6.5 6.5z"/></svg>',
  play: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 3.2v13.6L17 10z"/></svg>',
  info: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zm.9 13.25H9.1V8.5h1.8zM10 7.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z"/></svg>',
  check: '<svg class="i chk" viewBox="0 0 20 20" aria-hidden="true"><path d="M8 13.6 4.4 10l-1 1L8 15.6l9-9-1-1z"/></svg>',
  reset: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M10.6 2.5a7.5 7.5 0 1 1-7.42 8.6l1.48-.22A6 6 0 1 0 6 5.9h2.5v1.5h-5v-5H5v2.25A7.48 7.48 0 0 1 10.6 2.5z"/></svg>',
  chevD: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13.2 4.3 7.5l1-1L10 11.2l4.7-4.7 1 1z"/></svg>',
  done: '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 1.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z"/><path d="M8.75 12.6 6.2 10.05l-1 1 3.55 3.55 6.05-6.05-1-1z"/></svg>',
  current: '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 1.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z"/><circle cx="10" cy="10" r="4.25"/></svg>',
  moon: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M8.2 2.1a8 8 0 1 0 9.7 9.7 6.6 6.6 0 0 1-9.7-9.7z"/></svg>',
  sun: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6"/><path d="M9.25 1h1.5v3h-1.5zM9.25 16h1.5v3h-1.5zM1 9.25h3v1.5H1zM16 9.25h3v1.5h-3z"/><g transform="rotate(45 10 10)"><path d="M9.25 1h1.5v3h-1.5zM9.25 16h1.5v3h-1.5zM1 9.25h3v1.5H1zM16 9.25h3v1.5h-3z"/></g></svg>',
};
let EXEC = 0, SRC, GRAY, SVD = null, cur = null, LIB = store.get("pixelops-lib") === "cv" ? "cv" : "pil";

OPS.forEach(op => {
  op.s = {}; op.step = 1; op.byKey = {};
  op.controls.forEach(c => { if ("key" in c && !(c.key in op.s)) { op.s[c.key] = c.value; op.byKey[c.key] = c; } else if ("key" in c) op.byKey[c.key + "@" + c.name] = c; });
  op.defaults = { ...op.s };
});
const groupOf = op => GROUPS.find(g => g.id === op.group);
GROUPS.forEach((g, gi) => OPS.filter(o => o.group === g.id).forEach((o, oi) => { o.num = `${gi + 1}.${oi + 1}`; }));
const ctlFor = (op, key) => op.controls.find(c => c.key === key && (!c.show || c.show(op.s))) || op.byKey[key];

/* ---------- theme ---------- */
const sysDark = matchMedia("(prefers-color-scheme: dark)");
function effectiveDark() { const t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : sysDark.matches; }
function paintThemeBtn() { const dark = effectiveDark(), b = $("themeBtn"); b.innerHTML = dark ? ICON.sun : ICON.moon; b.setAttribute("aria-label", dark ? "Switch to the light theme" : "Switch to the dark theme"); b.title = b.getAttribute("aria-label"); }
{ const saved = store.get("pixelops-theme"); if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved); }
function startOver(op) { hideTip(); resetOp(op); op.step = 1; op.ran2 = op.ran3 = 0; open(op); }
$("pageReset").innerHTML = ICON.reset;
$("pageReset").addEventListener("click", () => cur && startOver(cur));
[["pointerenter", 1], ["focus", 1], ["pointerleave", 0], ["blur", 0]].forEach(([ev, on]) => $("pageReset").addEventListener(ev, () => on ? showTip($("pageReset"), "<span>Start this page over: back to step 1 with the lab's original values</span>") : hideTip(60)));
$("themeBtn").addEventListener("click", () => { const next = effectiveDark() ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); store.set("pixelops-theme", next); });

/* ---------- side nav ---------- */
{ const ov = el("div", "nav-group nav-home"), a = el("a", "", '<span>Overview</span>'); a.href = "#overview"; a.id = "homeLink"; ov.appendChild(a); $("navList").appendChild(ov); }
const GROUP_ICON = {
  pixels: '<rect x="2.5" y="2.5" width="6.5" height="6.5"/><rect x="11" y="2.5" width="6.5" height="6.5"/><rect x="2.5" y="11" width="6.5" height="6.5"/><rect x="11" y="11" width="6.5" height="6.5" fill="currentColor"/>',
  manipulation: '<path d="M5.5 1.5v13h13"/><path d="M1.5 5.5h13v13"/>',
  intensity: '<path d="M2 18h16"/><rect x="3.5" y="10" width="3" height="8"/><rect x="8.5" y="4" width="3" height="14"/><rect x="13.5" y="12.5" width="3" height="5.5"/>',
  geometry: '<path d="M16.5 10a6.5 6.5 0 1 1-2-4.7"/><path d="M15 1.8v3.8h-3.8"/><path d="M7 13l3-6 3 6z"/>',
  filtering: '<path d="M2.5 3.5h15l-6 7.5v5.5l-3 1.5v-7z"/>',
};
const navGroups = [];
GROUPS.forEach((g, gi) => {
  const box = el("div", "nav-group"), ol = el("ol"), id = "navg-" + g.id;
  const head = el("button", "nav-cat"); head.type = "button"; head.setAttribute("aria-controls", id);
  head.innerHTML = `<svg class="gi" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${GROUP_ICON[g.id] || ""}</svg><span class="nav-cat-t"><span class="h">${esc(g.title)}</span><span class="s">Exercise ${gi + 1}</span></span>${ICON.chevD}`;
  ol.id = id; box.append(head, ol);
  OPS.filter(o => o.group === g.id).forEach(o => { const li = el("li"), a = el("a", "", `<span><span class="num">${o.num}</span>${esc(o.title)}</span>${ICON.check}`); a.href = "#" + o.id; li.appendChild(a); ol.appendChild(li); o.menuLink = a; });
  head.addEventListener("click", () => expandGroup(head.getAttribute("aria-expanded") === "true" ? null : g.id));
  navGroups.push({ g, head, ol, box }); $("navList").appendChild(box);
});
/* accordion: one topic open at a time */
function expandGroup(gid) { navGroups.forEach(n => { const on = n.g.id === gid; n.head.setAttribute("aria-expanded", on); n.ol.hidden = !on; n.box.classList.toggle("open", on); n.box.classList.toggle("current", !!cur && cur.group === n.g.id); }); }
expandGroup(null);
const setMenu = open => { $("nav").classList.toggle("open", open); $("overlay").classList.toggle("open", open); $("menuBtn").setAttribute("aria-expanded", open); };
$("menuBtn").addEventListener("click", () => setMenu(!$("nav").classList.contains("open")));
$("overlay").addEventListener("click", () => setMenu(false));
$("nav").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- code rendering ---------- */
function fmtParam(op, key) { const v = op.s[key]; return op.codeFmt && op.codeFmt[key] ? op.codeFmt[key](v, op.s) : String(v); }
function tipParam(op, key) { const c = ctlFor(op, key); return op.tipFor && op.tipFor[key] ? op.tipFor[key](op.s) : (c && c.tip) || ""; }
function renderCode(pre, op, ro) {
  const tpl = ro && op.code3 ? op.code3(op.s) : op.code(op.s); pre.textContent = "";
  const re = /«([^»|]*)(?:\|([^»]*))?»|‹(\w+)›/g;
  tpl.split("\n").forEach((line, li) => {
    if (li) pre.append("\n");
    let last = 0, inC = false;
    const plain = t => { if (!t) return; if (inC) { pre.appendChild(el("span", "cm")).textContent = t; return; } const k = t.indexOf("#"); if (k < 0) { pre.append(t); return; } pre.append(t.slice(0, k)); inC = true; pre.appendChild(el("span", "cm")).textContent = t.slice(k); };
    line.replace(re, (m, text, tip, key, off) => {
      plain(line.slice(last, off)); last = off + m.length;
      let sp;
      if (key) { pre.appendChild(paramField(op, key, inC)); return m; }
      else { const t = tip ?? TIPS[text] ?? TIPS[text.trim()]; sp = el("span", t ? "tk" : ""); sp.textContent = text.replace(/ +$/, ""); if (t) { sp.dataset.tip = t; sp.setAttribute("role", "button"); } }
      if (inC) sp.classList.add("cm");
      if (sp.classList.contains("tk") || sp.classList.contains("pm")) sp.tabIndex = 0;
      pre.appendChild(sp); return m;
    });
    plain(line.slice(last));
  });
  if (op.hlKey) highlight(op.hlKey);
}
/* ---------- editable parameter fields inside the code ---------- */
function validate(c, text) {
  const t = String(text).trim(), v = Number(t), f = x => c.fmt ? c.fmt(x).replace(/ × \d+$/, "").replace("%", "") : String(x);
  const odd = c.step === 2 && c.min % 2 === 1, whole = c.step >= 1;
  const msg = `Enter ${odd ? "an odd" : whole ? "a whole" : "a"} number from ${f(c.min)} to ${f(c.max)}.`;
  if (t === "" || !isFinite(v) || v < c.min || v > c.max) return { ok: false, msg };
  if (whole && (!Number.isInteger(v) || (v - c.min) % c.step !== 0)) return { ok: false, msg };
  return { ok: true, v };
}
function paramTipHtml(op, key, err, ro) {
  const c = ctlFor(op, key) || {};
  const how = ro ? "To change it, edit the code in step 2." : c.type === "range" ? `Click and type a new value, from ${esc(c.fmt ? c.fmt(c.min) : c.min)} to ${esc(c.fmt ? c.fmt(c.max) : c.max)}.` : "Click to pick another value.";
  return `<span class="k">${esc(c.name || key)} = ${esc(fmtParam(op, key))}</span><span>${esc(tipParam(op, key) || c.label || "")}</span>` + (err ? `<span class="err">${esc(err)}</span>` : `<span class="note">${how}</span>`);
}
function paramField(op, key, inComment) {
  const c = ctlFor(op, key), wrap = el("span", "pm" + (inComment ? " cm" : "")); wrap.dataset.key = key;
  if (c && c.type === "range") {
    const inp = el("input", "pm-in"); inp.type = "text"; inp.value = fmtParam(op, key); inp.dataset.key = key;
    inp.inputMode = c.step >= 1 && c.min >= 0 ? "numeric" : "decimal"; inp.spellcheck = false; inp.autocomplete = "off";
    inp.setAttribute("aria-label", `${c.name || key}, ${c.label}`);
    const size = () => { inp.style.width = `calc(${Math.max(1, inp.value.length)}ch + 15px)`; }; size();
    inp.addEventListener("input", () => {
      size(); const r = validate(c, inp.value);
      wrap.classList.toggle("bad", !r.ok); inp.setAttribute("aria-invalid", !r.ok);
      if (r.ok) { op.s[key] = r.v; update(op, true, inp); }
      showTip(inp, paramTipHtml(op, key, r.ok ? null : r.msg));
    });
    const commit = () => { if (wrap.classList.contains("bad")) { wrap.classList.remove("bad"); } hideTip(); update(op, true); };
    inp.addEventListener("change", commit);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } if (e.key === "Escape") { inp.value = fmtParam(op, key); wrap.classList.remove("bad"); inp.blur(); } });
    inp.addEventListener("blur", () => { if (wrap.classList.contains("bad")) { wrap.classList.remove("bad"); update(op, true); } });
    wrap.appendChild(inp);
  } else if (c) {
    const sel = el("select", "pm-sel"); sel.dataset.key = key; sel.setAttribute("aria-label", `${c.name || key}, ${c.label}`);
    c.options.forEach(([val]) => { const o = el("option"); o.value = String(val); o.textContent = op.codeFmt && op.codeFmt[key] ? op.codeFmt[key](val, op.s) : String(val); sel.appendChild(o); });
    sel.value = String(op.s[key]);
    const fit = () => { sel.style.width = `calc(${sel.options[sel.selectedIndex].textContent.length}ch + 30px)`; }; fit();
    sel.addEventListener("change", () => { const host = sel.closest("pre"), opt = c.options.find(([v]) => String(v) === sel.value); op.s[key] = opt[0]; hideTip(); update(op, true); const again = host && host.querySelector(`.pm-sel[data-key="${key}"]`); again && again.focus(); });
    wrap.appendChild(sel); wrap.insertAdjacentHTML("beforeend", '<svg class="i chev" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13.2 4.3 7.5l1-1L10 11.2l4.7-4.7 1 1z"/></svg>');
  } else wrap.textContent = fmtParam(op, key);
  return wrap;
}

/* ---------- Carbon tooltip ---------- */
const tipEl = el("div", "tip"); tipEl.id = "tip"; tipEl.setAttribute("role", "tooltip"); tipEl.hidden = true; document.body.appendChild(tipEl);
let tipFor = null, tipTimer = 0;
function showTip(target, html) {
  clearTimeout(tipTimer);
  if (tipFor && tipFor !== target) tipFor.removeAttribute("aria-describedby");
  tipEl.innerHTML = html + '<span class="caret" aria-hidden="true"></span>'; tipEl.hidden = false; tipFor = target; target.setAttribute("aria-describedby", "tip");
  const r = target.getBoundingClientRect(), tw = tipEl.offsetWidth, th = tipEl.offsetHeight, top = 48 + (parseFloat(getComputedStyle(document.body, "::before").height) || 0);
  let x = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, innerWidth - tw - 8));
  const above = r.top - th - 10 > top; const y = above ? r.top - th - 10 : r.bottom + 10;
  tipEl.style.left = x + "px"; tipEl.style.top = y + "px"; tipEl.classList.toggle("below", !above);
  tipEl.style.setProperty("--cx", Math.max(10, Math.min(r.left + r.width / 2 - x, tw - 10)) + "px");
}
function hideTip(delay) { clearTimeout(tipTimer); tipTimer = setTimeout(() => { tipEl.hidden = true; if (tipFor) tipFor.removeAttribute("aria-describedby"); tipFor = null; }, delay || 0); }
addEventListener("scroll", () => { if (tipFor && !tipFor.matches(":focus")) hideTip(); }, true);
document.addEventListener("pointerdown", e => { if (tipFor && !e.target.closest(".code, .tbtn")) hideTip(); });
function tipHtmlFor(t) {
  if (t.classList.contains("pm")) return paramTipHtml(cur, t.dataset.key, null, t.classList.contains("ro"));
  return `<span class="k">${esc(t.textContent)}</span><span>${esc(t.dataset.tip)}</span>`;
}
function highlight(key) {
  if (!cur || !cur.dom) return; cur.hlKey = key;
  cur.dom.code.querySelectorAll(".pm").forEach(p => p.classList.toggle("hl", p.dataset.key === key));
  cur.dom.card.querySelectorAll(".ctl").forEach(c => c.classList.toggle("hl", !!key && c.dataset.key === key));
}

/* ---------- controls (Carbon slider, content switcher, select) ---------- */
function buildControls(op, where) {
  const wrap = el("div", "params" + (where === "output" ? " bare" : "")), ui = [];
  op.controls.filter(c => (c.where || "code") === where).forEach((c, ci) => {
    const wide = c.wide || (c.type === "chips" && c.options.reduce((n, o) => n + String(o[1]).length, 0) > 26);
    const box = el("div", "ctl" + (wide ? " wide" : "")); if (c.key) box.dataset.key = c.key;
    const id = `${op.id}-${c.key || "b" + ci}-${ci}`;
    const lab = el("label", "lbl"); lab.htmlFor = id;
    lab.innerHTML = c.name ? `<code>${esc(c.name)}</code> · ${esc(c.label)}` : esc(c.label);
    box.appendChild(lab);
    if (c.type === "range") {
      const row = el("div", "slider"), r = el("input"), out = el("output");
      Object.assign(r, { type: "range", id, min: c.min, max: c.max, step: c.step });
      const fmt = v => c.fmt ? c.fmt(v) : String(v);
      row.append(el("span", "mm", esc(fmt(c.min))), r, el("span", "mm", esc(fmt(c.max))), out); out.htmlFor = id;
      r.addEventListener("input", () => { op.s[c.key] = +r.value; update(op); });
      box.appendChild(row);
      ui.push({ c, box, sync: () => { r.value = op.s[c.key]; out.textContent = fmt(op.s[c.key]); r.style.setProperty("--p", ((op.s[c.key] - c.min) / (c.max - c.min) * 100) + "%"); r.disabled = c.disabled ? c.disabled(op.s) : false; } });
    } else if (c.type === "chips" && c.options.length > 4) {
      const s = el("div", "select"), sel = el("select"); sel.id = id;
      c.options.forEach(([val, l]) => { const o = el("option", "", esc(l)); o.value = val; sel.appendChild(o); });
      sel.addEventListener("change", () => { op.s[c.key] = sel.value; update(op); });
      s.append(sel); s.insertAdjacentHTML("beforeend", ICON.chevD); box.appendChild(s);
      ui.push({ c, box, sync: () => { sel.value = op.s[c.key]; } });
    } else if (c.type === "chips") {
      const sw = el("div", "switcher"); sw.setAttribute("role", "group"); sw.id = id;
      const btns = c.options.map(([val, l]) => { const b = el("button", "", esc(l)); b.type = "button"; b.addEventListener("click", () => { op.s[c.key] = val; update(op); }); sw.appendChild(b); return [val, b]; });
      box.appendChild(sw); lab.removeAttribute("for"); sw.setAttribute("aria-label", c.name || c.label);
      ui.push({ c, box, sync: () => btns.forEach(([val, b]) => b.setAttribute("aria-pressed", op.s[c.key] === val)) });
    } else {
      const row = el("div", "actions"); lab.removeAttribute("for");
      c.items.forEach(([l, act], k) => { const b = el("button", "btn btn-sm " + (c.type === "buttons" && k === 0 ? "btn-primary" : "btn-secondary"), esc(l)); b.type = "button"; b.addEventListener("click", () => { typeof act === "function" ? act(op.s) : Object.assign(op.s, act); update(op); }); row.appendChild(b); });
      box.appendChild(row); ui.push({ c, box, sync: () => {} });
    }
    box.addEventListener("pointerenter", () => { if (c.key) highlight(c.key); });
    box.addEventListener("pointerleave", () => highlight(null));
    box.addEventListener("focusin", () => { if (c.key) highlight(c.key); });
    wrap.appendChild(box);
  });
  return { wrap, ui };
}

/* ---------- image panel ---------- */
function buildStage(op) {
  const fr = $("frames"); fr.innerHTML = ""; fr.classList.toggle("single", !!op.single);
  const v = { cv: [], caps: [], imgs: [], panes: [], frames: [], ex: {} };
  op.panes.forEach((label, i) => {
    const pane = el("figure", "pane"), frame = el("div", "frame" + (op.nativeOut && i === 1 ? " tl" : "")), cv = el("canvas");
    cv.setAttribute("role", "img"); cv.setAttribute("aria-label", label); frame.appendChild(cv);
    if (i === 1) frame.appendChild(el("div", "wait", "Run the code in step 2 to see the output"));
    const cap = el("figcaption", "cap"), d = el("span", "d"); cap.append(el("span", "", esc(label)), d);
    pane.append(frame, cap); fr.appendChild(pane);
    v.cv.push(cv); v.caps.push(d); v.panes.push(pane); v.frames.push(frame);
  });
  v.show = (i, img, note) => {
    const cv = v.cv[i]; cv.width = img.w; cv.height = img.h; cv.getContext("2d").putImageData(toID(img), 0, 0); v.imgs[i] = img;
    if (op.nativeOut && i === 1) { cv.style.width = (img.w / N * 100) + "%"; cv.style.height = "auto"; }
    else { const m = Math.max(img.w, img.h); cv.style.width = (img.w / m * 100) + "%"; cv.style.height = (img.h / m * 100) + "%"; }
    v.caps[i].textContent = (note ? note + " · " : "") + `${img.w} × ${img.h}`;
  };
  v.box = s => { const x = v.cv[0].getContext("2d"), w = s.r - s.l - 1, h = s.lo - s.u - 1; x.lineWidth = 3; x.strokeStyle = "#000"; x.strokeRect(s.l + 0.5, s.u + 0.5, w, h); x.lineWidth = 1; x.strokeStyle = "#fff"; x.strokeRect(s.l + 0.5, s.u + 0.5, w, h); };
  const ro = $("readout"), idle = op.single ? "Hover the histogram in step 3 to read pixel counts." : "Hover an image to read pixel values.";
  ro.textContent = idle;
  v.cv.forEach((cv, i) => {
    cv.addEventListener("pointermove", e => {
      const img = v.imgs[i]; if (!img || (i === 1 && op.step < 3)) return; const r = cv.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / r.width * img.w), y = Math.floor((e.clientY - r.top) / r.height * img.h);
      if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
      let t = `x ${x}, y ${y}\n${op.panes[i].split(" · ")[0]}: ${fmtPx(img, x, y)}`;
      if (op.pixelwise && op.step >= 3 && v.imgs[1] && v.imgs[1].w === v.imgs[0].w && v.imgs[1].h === v.imgs[0].h) t = `x ${x}, y ${y}\n${fmtPx(v.imgs[0], x, y)}  →  ${fmtPx(v.imgs[1], x, y)}`;
      ro.textContent = t;
    });
    cv.addEventListener("pointerleave", () => { ro.textContent = idle; });
  });
  if (op.region) {
    const fr0 = v.frames[0], cv = v.cv[0]; fr0.classList.add("drag"); let start = null;
    const pt = e => { const r = cv.getBoundingClientRect(); return [Math.round(Math.min(N, Math.max(0, (e.clientX - r.left) / r.width * N))), Math.round(Math.min(N, Math.max(0, (e.clientY - r.top) / r.height * N)))]; };
    fr0.addEventListener("pointerdown", e => { start = pt(e); fr0.setPointerCapture(e.pointerId); e.preventDefault(); });
    fr0.addEventListener("pointermove", e => { if (!start) return; const p = pt(e), l = Math.min(start[0], p[0]), r = Math.max(start[0], p[0]), u = Math.min(start[1], p[1]), lo = Math.max(start[1], p[1]); if (r - l >= 4 && lo - u >= 4) { Object.assign(op.s, { l, r, u, lo }); update(op); } });
    const end = () => { start = null; }; fr0.addEventListener("pointerup", end); fr0.addEventListener("pointercancel", end);
  }
  return v;
}

/* ---------- wizard ---------- */
function stepEl(n, title, total) {
  const s = el("section", "step"); s.dataset.n = n;
  const ic = el("div", "step-ic"), body = el("div", "step-body"), lab = el("div", "step-label");
  lab.append(el("span", "eyebrow", `Step ${n} of ${total}`), el("h2", "", title)); body.appendChild(lab);
  s.append(ic, body); return [s, body, ic];
}
function buildTabs(op) {
  const bar = el("div", "tabs");
  if (op.libs) {
    bar.setAttribute("role", "tablist"); bar.setAttribute("aria-label", "Library");
    const tabs = [["pil", "Pillow"], ["cv", "OpenCV"]].map(([id, l]) => { const t = el("button", "tab", l); t.type = "button"; t.setAttribute("role", "tab"); t.dataset.lib = id; t.addEventListener("click", () => setLib(id)); bar.appendChild(t); return t; });
    bar.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); setLib(LIB === "pil" ? "cv" : "pil"); bar.querySelector(`[data-lib="${LIB}"]`).focus(); } });
    bar.appendChild(el("span", "tabs-note", "Same operation, two libraries"));
    return { bar, sync: () => tabs.forEach(t => { const on = t.dataset.lib === LIB; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; }) };
  }
  const t = el("span", "tab static", esc(op.libLabel)); t.setAttribute("aria-selected", "true"); bar.appendChild(t);
  bar.appendChild(el("span", "tabs-note", op.libLabel === "NumPy" ? "Plain NumPy, works with both libraries" : `${op.libLabel} only in the lab`));
  return { bar, sync: () => {} };
}
function setLib(id) { LIB = id; store.set("pixelops-lib", id); if (cur) { cur.hlKey = null; hideTip(); update(cur, true); } }
const isDefault = op => Object.keys(op.defaults).every(k => op.s[k] === op.defaults[k]) && !op.s.zeroed;
function resetOp(op) { Object.keys(op.s).forEach(k => { if (k !== "lib" && !(k in op.defaults)) delete op.s[k]; }); Object.assign(op.s, op.defaults); update(op, true); }

function open(op) {
  document.body.classList.remove("landing"); $("homeLink").classList.remove("on"); $("homeLink").removeAttribute("aria-current");
  cur = op; op.hlKey = null;
  const i = OPS.indexOf(op), g = groupOf(op), wz = $("wizard"); wz.innerHTML = "";
  document.title = op.title + " · PixOps 101";
  $("crumb").textContent = `${g.title} / ${op.title}`;
  expandGroup(op.group);
  OPS.forEach(o => { o.menuLink.classList.toggle("on", o === op); o.menuLink.classList.toggle("done", o.step >= 3); if (o === op) o.menuLink.setAttribute("aria-current", "page"); else o.menuLink.removeAttribute("aria-current"); });

  const head = el("header", "wz-head"); head.append(el("span", "eyebrow", `Exercise ${op.num} · ${esc(g.lab)}`), el("h1", "", esc(op.title))); wz.appendChild(head);
  const steps = el("div", "steps"); wz.appendChild(steps);

  /* step 3 only when it adds something: charts and kernels, or an extra line of code to run */
  const three = !!op.run3 || !!(op.extras && op.extras.length), total = three ? 3 : 2;
  const [s1, b1, i1] = stepEl(1, "The operation", total);
  b1.appendChild(el("p", "", esc(op.text)));
  const next1 = el("button", "btn btn-primary", `Show the code ${ICON.arrowD}`); next1.type = "button"; b1.appendChild(next1);

  const [s2, b2, i2] = stepEl(2, "The code", total);
  b2.appendChild(el("p", "helper", (op.libs ? "Pillow and OpenCV write this differently, so switch tabs to compare. " : "") + "Hover or tap any underlined part of the code to see what it does. The blue values are editable: click one and type a new value, or use the controls below."));
  const card = el("div", "snippet"), tabs = buildTabs(op), pre = el("pre", "code");
  pre.setAttribute("aria-label", "Code"); if (op.libs) pre.setAttribute("role", "tabpanel");
  const rb = el("button", "tbtn", ICON.reset); rb.type = "button"; rb.setAttribute("aria-label", "Reset the code to its original values");
  rb.addEventListener("click", () => { hideTip(); resetOp(op); });
  rb.addEventListener("pointerenter", () => showTip(rb, '<span>Reset the code to its original values</span>')); rb.addEventListener("pointerleave", () => hideTip(80));
  rb.addEventListener("focus", () => showTip(rb, '<span>Reset the code to its original values</span>')); rb.addEventListener("blur", () => hideTip());
  tabs.bar.appendChild(rb);
  const pc = buildControls(op, "code");
  const foot2 = el("div", "cell-foot"), next2 = el("button", "btn btn-primary", `Run ${ICON.play}`), st2 = el("span", "cell-status");
  next2.type = "button"; foot2.append(next2, st2);
  card.append(tabs.bar, pre, foot2, pc.wrap); b2.appendChild(card);

  const [s3, b3, i3] = stepEl(3, "The output", total);
  b3.appendChild(el("p", "", esc(op.look)));
  const extras = el("div", "extras"); b3.appendChild(extras);
  const card3 = el("div", "snippet"), bar3 = el("div", "tabs"), lab3 = el("span", "tab static"), pre3 = el("pre", "code");
  lab3.setAttribute("aria-selected", "true"); bar3.append(lab3, el("span", "tabs-note", "The code that produced this output")); pre3.setAttribute("aria-label", "Code that produced the output");
  const rb3 = el("button", "tbtn", ICON.reset); rb3.type = "button"; rb3.setAttribute("aria-label", op.reset3 ? "Undo this cell" : "Reset the code to its original values"); bar3.appendChild(rb3);
  const foot3 = el("div", "cell-foot"), run3 = el("button", "btn btn-primary", `Run ${ICON.play}`), st3 = el("span", "cell-status");
  run3.type = "button"; foot3.append(run3, st3);
  card3.append(bar3, pre3, foot3);
  const oc = buildControls(op, "output"); if (oc.ui.length) { oc.wrap.classList.remove("bare"); card3.appendChild(oc.wrap); }
  const tipOn = (b, t) => { b.addEventListener("pointerenter", () => showTip(b, `<span>${t}</span>`)); b.addEventListener("focus", () => showTip(b, `<span>${t}</span>`)); b.addEventListener("pointerleave", () => hideTip(60)); b.addEventListener("blur", () => hideTip()); };
  tipOn(rb3, op.reset3 ? "Undo this cell: put A back to the original image" : "Reset the code to its original values");
  rb3.addEventListener("click", () => { hideTip(); if (op.reset3) { op.reset3(op.s); op.ran3 = 0; update(op, true); } else resetOp(op); });
  run3.addEventListener("click", () => { if (op.run3) op.run3(op.s); op.ran3 = ++EXEC; op.ran2 = op.ran2 || EXEC; update(op, true); });
  b3.insertBefore(card3, extras); card3.hidden = !op.run3;
  const nav = el("div", "nextrow");
  if (i > 0) { const p = OPS[i - 1], a = el("a", "btn btn-ghost nav-prev", `${ICON.arrowL} ${esc(p.title)}`); a.href = "#" + p.id; a.style.gap = "8px"; nav.appendChild(a); }
  if (i < OPS.length - 1) { const n = OPS[i + 1], a = el("a", "btn btn-primary nav-next", `Next: ${esc(n.title)} ${ICON.arrowR}`); a.href = "#" + n.id; nav.appendChild(a); }
  const res = el("div", "result"); res.append(el("span", "eyebrow", "Output · shown in the image panel"), el("p", "", esc(op.look)));
  if (three) b3.appendChild(nav); else { res.appendChild(nav); b2.appendChild(res); }
  steps.append(s1, s2, s3);
  wz.appendChild(buildDock(false));

  op.dom = { three, res, params: pc.wrap, params3: oc.wrap, code: pre, code3: pre3, lab3, card, tabs, reset: rb, reset3: rb3, st2, st3, ui: [...pc.ui, ...oc.ui], steps: [s1, s2, s3], icons: [i1, i2, i3], btns: [next1, next2] };
  op.v = buildStage(op);
  (op.extras || []).forEach(([kind, label, grow]) => {
    if (kind === "kernel") { const n = el("div", "kgrids"); extras.appendChild(n); op.v.ex.kernel = n; return; }
    const box = el("div", "extra" + (grow ? " grow" : "")); if (label) box.appendChild(el("span", "lbl", esc(label)));
    const node = kind === "hist" || kind === "sigma" ? el("canvas") : kind === "curve" ? el("canvas", "sq") : el("div", kind);
    if (node.tagName === "CANVAS") node.setAttribute("role", "img"), node.setAttribute("aria-label", label || kind);
    box.appendChild(node); extras.appendChild(box); op.v.ex[kind] = node;
  });
  if (op.v.ex.hist) {
    const hc = op.v.ex.hist, ro = $("readout");
    hc.addEventListener("pointermove", e => { const H = hc._hist; if (!H) return; const r = hc.getBoundingClientRect(), bin = Math.round(Math.min(255, Math.max(0, (e.clientX - r.left - H.l) / (H.r - H.l) * 255))); const names = op.id === "histogram" ? ["red", "green", "blue"] : ["before", "after"]; ro.textContent = `intensity ${bin}\n` + H.series.map((s, k) => (H.series.length > 1 ? names[k] + " " : "") + s.h[bin].toLocaleString() + " px").join("   "); });
  }

  [pre, pre3].forEach(pre => {
  const tokenOf = e => e.target.closest(".tk, .pm");
  pre.addEventListener("pointerover", e => { const t = tokenOf(e); if (!t) return; if (t.classList.contains("pm")) highlight(t.dataset.key); const anchor = t.querySelector("input, select") || t; if (tipFor && tipFor.matches(":focus") && tipFor !== anchor) return; showTip(anchor, tipHtmlFor(t)); });
  pre.addEventListener("pointerout", e => { const t = tokenOf(e); if (!t || t.contains(e.relatedTarget)) return; if (t.classList.contains("pm")) highlight(null); if (!(tipFor && tipFor.matches(":focus"))) hideTip(120); });
  pre.addEventListener("focusin", e => { const t = tokenOf(e); if (!t) return; if (t.classList.contains("pm")) highlight(t.dataset.key); showTip(e.target, tipHtmlFor(t)); });
  pre.addEventListener("focusout", e => { const t = tokenOf(e); if (t && t.classList.contains("pm")) highlight(null); hideTip(80); });
  pre.addEventListener("click", e => { const t = e.target.closest(".tk"); if (!t) return; if (tipFor === t && !tipEl.hidden) hideTip(); else showTip(t, tipHtmlFor(t)); });
  pre.addEventListener("keydown", e => { const t = e.target.closest(".tk"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showTip(t, tipHtmlFor(t)); } if (e.key === "Escape") hideTip(); });
  });

  next1.addEventListener("click", () => reveal(op, 2));
  next2.addEventListener("click", () => { op.ran2 = ++EXEC; reveal(op, 3); });
  applyStep(op, false);
  update(op, true);
  window.scrollTo({ top: 0 });
}
function applyStep(op, animate) {
  const { steps, icons, btns } = op.dom;
  steps[1].hidden = op.step < 2; steps[2].hidden = op.step < 3 || !op.dom.three; op.dom.res.hidden = op.dom.three || op.step < 3;
  btns[0].hidden = op.step >= 2;
  steps.forEach((s, k) => s.classList.toggle("tail", !s.hidden && !!steps[k + 1] && steps[k + 1].hidden));
  steps.forEach((s, k) => { const n = k + 1, done = n < op.step || (n === 3 && op.step >= 3); s.classList.toggle("complete", n < op.step); icons[k].innerHTML = done ? ICON.done : ICON.current; icons[k].setAttribute("aria-label", done ? "Complete" : "Current"); });
  op.v.panes[1] && op.v.panes[1].classList.toggle("pending", op.step < 3);
  $("stageHint").textContent = op.single ? "Input" : op.step >= 3 ? "Input and output" : "Input";
  op.menuLink.classList.toggle("done", op.step >= 3);
  if (animate) { const s = op.step === 3 && !op.dom.three ? op.dom.res : steps[op.step - 1]; if (!reduceMotion) { s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); } requestAnimationFrame(() => scrollToStep(s)); }
}
/* bring a step's heading to the top of the visible area, below the header and, on phones, below the pinned image panel */
function scrollToStep(s) {
  const stage = $("stage"), pinned = getComputedStyle(stage).order === "-1";
  const offset = (pinned ? stage.getBoundingClientRect().bottom : document.querySelector(".hdr").getBoundingClientRect().bottom) + 16;
  window.scrollTo({ top: Math.max(0, s.getBoundingClientRect().top + window.scrollY - offset), behavior: reduceMotion ? "auto" : "smooth" });
}
function reveal(op, n) { op.step = Math.max(op.step, n); applyStep(op, true); update(op, true); }

let pend = false;
function update(op, now, editing) {
  if (op !== cur) return;
  const go = () => {
    pend = false;
    if (op.libs) op.s.lib = LIB;
    try { op.run(op.s, op.v); } catch (e) { console.error(e); $("readout").textContent = "This step hit an error: " + e.message; }
    const host = editing && editing.closest("pre");
    [op.dom.code, op.dom.code3].forEach(p => {
      if (p === host) p.querySelectorAll(`.pm-in[data-key="${editing.dataset.key}"]`).forEach(x => { if (x !== editing) { x.value = editing.value; x.style.width = editing.style.width; x.closest(".pm").classList.remove("bad"); } });
      else renderCode(p, op, p === op.dom.code3);
    });
    op.dom.st2.textContent = op.ran2 ? `Ran [${op.ran2}] · the output updates live as you edit` : "Not run yet";
    op.dom.st3.textContent = op.run3 ? (op.ran3 ? `Ran [${op.ran3}] · ${op.ranMsg ? op.ranMsg(op.s) : "done"}` : "Not run yet · " + (op.waitMsg || "")) : `Ran [${op.ran3 || op.ran2 || 1}] · this is the code behind the output`;
    op.dom.reset3.disabled = op.reset3 ? !op.ran3 : isDefault(op); op.dom.lab3.textContent = op.libs ? (LIB === "pil" ? "Pillow" : "OpenCV") : op.libLabel;
    op.dom.tabs.sync(); op.dom.reset.disabled = isDefault(op);
    /* a choice already editable as a dropdown in the code doesn't get a second control below it */
    op.dom.ui.forEach(u => { u.sync(); u.box.hidden = (u.c.show && !u.c.show(op.s)) || (u.c.type === "chips" && !!op.dom.code.querySelector(`.pm-sel[data-key="${u.c.key}"]`)); });
    [op.dom.params, op.dom.params3].forEach(w => { if (w) w.hidden = ![...w.children].some(ch => !ch.hidden); });
  };
  if (now) return go();
  if (pend) return; pend = true; requestAnimationFrame(go);
}

/* ---------- routing ---------- */
function route() { const id = location.hash.slice(1), op = OPS.find(o => o.id === id); if (op) { open(op); if (!IMG_CHOSEN && !$("modal")) showChoice(); } else { if ($("modal")) closeModal(); openHome(); } }
addEventListener("hashchange", route);

/* ---------- image source ---------- */
function setSource(img, name) {
  SRC = img; GRAY = toGray(img); SVD = null;
  $("srcName").textContent = name + " · 256 × 256"; $("srcName2").textContent = name;
  if (cur) update(cur, true); else if (document.body.classList.contains("landing") && openHome.refresh) openHome.refresh();
}
function onFile(e) {
  const f = e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f), im = new Image();
  const first = !IMG_CHOSEN;
  im.onload = () => {
    const c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d"), m = Math.min(im.width, im.height);
    x.drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, N, N);
    const name = f.name.length > 28 ? f.name.slice(0, 25) + "…" : f.name;
    setSource(fromID(x.getImageData(0, 0, N, N)), name);
    showReady({ name, w: im.naturalWidth, h: im.naturalHeight, im, first });
    URL.revokeObjectURL(url);
  };
  im.onerror = () => { const msg = "That file could not be read as an image. Try a PNG or JPEG."; $("srcName").textContent = msg; const p = document.querySelector("#modal .modal-p"); if (p) { p.textContent = msg; p.classList.add("err"); } };
  im.src = url; e.target.value = "";
}
$("file").addEventListener("change", onFile); $("file2").addEventListener("change", onFile); $("fileM").addEventListener("change", onFile);
document.querySelectorAll("[data-sample]").forEach(b => b.addEventListener("click", () => { setSource(SAMPLE, "Sample city scene"); setMenu(false); }));

const redraw = () => { paintThemeBtn(); if (cur) update(cur, true); };
sysDark.addEventListener("change", redraw);
new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(redraw, 150); });

/* ---------- preloader: logo and a bar that counts to 100 ---------- */
let LOADED = false; const onLoaded = [];
function whenLoaded(fn) { if (LOADED) fn(); else onLoaded.push(fn); }
{
  const pre = $("preload"), num = $("plNum"), bar = $("plBar"), t0 = performance.now(), MIN = reduceMotion ? 0 : 1400;
  let ready = false, shown = 0;
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 3000))]).then(() => { ready = true; });
  const finish = () => { pre.classList.add("done"); LOADED = true; setTimeout(() => pre.remove(), 500); onLoaded.splice(0).forEach(f => f()); };
  const tick = now => {
    const k = MIN ? Math.min(1, (now - t0) / MIN) : 1, target = ready ? 100 * (1 - Math.pow(1 - k, 3)) : Math.min(90, 100 * (1 - Math.pow(1 - k, 3)));
    shown = Math.max(shown, Math.round(target));
    num.textContent = shown; bar.style.width = shown + "%"; pre.setAttribute("aria-valuenow", shown);
    if (shown >= 100) setTimeout(finish, reduceMotion ? 0 : 180); else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
paintThemeBtn();
const SAMPLE = makeSample(); SRC = SAMPLE; GRAY = toGray(SRC);
route();
