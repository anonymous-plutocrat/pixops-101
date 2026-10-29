/* ================= image helpers ================= */
const N = 256;
const mk = (w, h, c) => ({ w, h, c, d: new Uint8ClampedArray(w * h * c) });
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gaussR(r) { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
function fromID(id) { const o = mk(id.width, id.height, 3); for (let i = 0, j = 0; i < id.data.length; i += 4, j += 3) { o.d[j] = id.data[i]; o.d[j + 1] = id.data[i + 1]; o.d[j + 2] = id.data[i + 2]; } return o; }
function toID(img) {
  const id = new ImageData(img.w, img.h), s = img.d, t = id.data;
  for (let p = 0, n = img.w * img.h; p < n; p++) { const i = p * 4; if (img.c === 1) { t[i] = t[i + 1] = t[i + 2] = s[p]; } else { const j = p * 3; t[i] = s[j]; t[i + 1] = s[j + 1]; t[i + 2] = s[j + 2]; } t[i + 3] = 255; }
  return id;
}
function toGray(img, avg) {
  if (img.c === 1) return img;
  const o = mk(img.w, img.h, 1), s = img.d;
  for (let p = 0, n = img.w * img.h; p < n; p++) { const j = p * 3; o.d[p] = avg ? (s[j] + s[j + 1] + s[j + 2]) / 3 : 0.299 * s[j] + 0.587 * s[j + 1] + 0.114 * s[j + 2]; }
  return o;
}
function clone(img) { return { w: img.w, h: img.h, c: img.c, d: new Uint8ClampedArray(img.d) }; }
function applyLut(img, lut) { const o = mk(img.w, img.h, img.c); for (let i = 0; i < img.d.length; i++) o.d[i] = lut[img.d[i]]; return o; }
function makeLut(f) { const l = new Uint8ClampedArray(256); for (let r = 0; r < 256; r++) l[r] = f(r); return l; }
function hist(img, ch) { const h = new Uint32Array(256), c = img.c; for (let i = ch || 0; i < img.d.length; i += c) h[img.d[i]]++; return h; }
const refl = (i, n) => { while (i < 0 || i >= n) { if (i < 0) i = -i; if (i >= n) i = 2 * n - 2 - i; } return i; };
const clampI = (i, n) => i < 0 ? 0 : i >= n ? n - 1 : i;

function conv(img, k, kw, kh) {
  const { w, h, c } = img, out = new Float32Array(w * h * c), ax = kw >> 1, ay = kh >> 1, d = img.d;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let ch = 0; ch < c; ch++) {
    let s = 0, ki = 0;
    for (let j = 0; j < kh; j++) { const row = refl(y + j - ay, h) * w; for (let i = 0; i < kw; i++, ki++) s += k[ki] * d[(row + refl(x + i - ax, w)) * c + ch]; }
    out[(y * w + x) * c + ch] = s;
  }
  return out;
}
function convSep(img, k) {
  const { w, h, c } = img, a = k.length >> 1, tmp = new Float32Array(w * h * c), out = new Float32Array(w * h * c), d = img.d;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let ch = 0; ch < c; ch++) { let s = 0; for (let i = 0; i < k.length; i++) s += k[i] * d[(y * w + refl(x + i - a, w)) * c + ch]; tmp[(y * w + x) * c + ch] = s; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let ch = 0; ch < c; ch++) { let s = 0; for (let i = 0; i < k.length; i++) s += k[i] * tmp[(refl(y + i - a, h) * w + x) * c + ch]; out[(y * w + x) * c + ch] = s; }
  return out;
}
function fromF(img, f) { const o = mk(img.w, img.h, img.c); for (let i = 0; i < f.length; i++) o.d[i] = Math.round(f[i]); return o; }
function gaussKernel(k, sigma) {
  if (sigma <= 0) sigma = 0.3 * ((k - 1) * 0.5 - 1) + 0.8;
  const g = new Float64Array(k), m = (k - 1) / 2; let s = 0;
  for (let i = 0; i < k; i++) { g[i] = Math.exp(-((i - m) ** 2) / (2 * sigma * sigma)); s += g[i]; }
  for (let i = 0; i < k; i++) g[i] /= s;
  return g;
}
function addNoise(img, sigma, seed) { const r = rng(seed), o = mk(img.w, img.h, img.c); for (let i = 0; i < img.d.length; i++) o.d[i] = img.d[i] + gaussR(r) * sigma; return o; }
function saltPepper(img, amount, seed) { const r = rng(seed), o = clone(img); for (let p = 0; p < img.w * img.h; p++) { const u = r(); if (u < amount / 2) o.d[p] = 0; else if (u < amount) o.d[p] = 255; } return o; }
function otsu(h) {
  let total = 0, sum = 0; for (let i = 0; i < 256; i++) { total += h[i]; sum += i * h[i]; }
  let wB = 0, sumB = 0, best = 0, T = 0;
  for (let t = 0; t < 256; t++) { wB += h[t]; if (!wB) continue; const wF = total - wB; if (!wF) break; sumB += t * h[t]; const mB = sumB / wB, mF = (sum - sumB) / wF, v = wB * wF * (mB - mF) ** 2; if (v > best) { best = v; T = t; } }
  return T;
}
function medianFilter(img, k) {
  const { w, h } = img, o = mk(w, h, 1), a = k >> 1, buf = new Uint8Array(k * k), mid = (k * k) >> 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let n = 0; for (let j = -a; j <= a; j++) { const row = refl(y + j, h) * w; for (let i = -a; i <= a; i++) buf[n++] = img.d[row + refl(x + i, w)]; }
    buf.sort(); o.d[y * w + x] = buf[mid];
  }
  return o;
}
/* inverse-mapped affine warp, bilinear, constant black border (cv2.warpAffine defaults) */
function warp(img, M, ow, oh) {
  const [a, b, e, c, d, f] = M, det = a * d - b * c, ia = d / det, ib = -b / det, ic = -c / det, id = a / det;
  const o = mk(ow, oh, img.c), { w, h } = img, C = img.c;
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
    const X = x - e, Y = y - f, sx = ia * X + ib * Y, sy = ic * X + id * Y;
    const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0;
    for (let ch = 0; ch < C; ch++) {
      let v = 0;
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const xx = x0 + i, yy = y0 + j; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; v += (i ? fx : 1 - fx) * (j ? fy : 1 - fy) * img.d[(yy * w + xx) * C + ch]; }
      o.d[(y * ow + x) * C + ch] = Math.round(v);
    }
  }
  return o;
}
function cubicW(t) { const A = -0.75; t = Math.abs(t); return t <= 1 ? ((A + 2) * t - (A + 3)) * t * t + 1 : t < 2 ? ((A * t - 5 * A) * t + 8 * A) * t - 4 * A : 0; }
function resize(img, nw, nh, mode) {
  const { w, h, c } = img, o = mk(nw, nh, c), sx = w / nw, sy = h / nh;
  for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
    const oi = (y * nw + x) * c;
    if (mode === "NEAREST") { const xs = Math.min(Math.floor(x * sx), w - 1), ys = Math.min(Math.floor(y * sy), h - 1); for (let ch = 0; ch < c; ch++) o.d[oi + ch] = img.d[(ys * w + xs) * c + ch]; continue; }
    const fx = (x + 0.5) * sx - 0.5, fy = (y + 0.5) * sy - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    for (let ch = 0; ch < c; ch++) {
      let v = 0;
      if (mode === "LINEAR") { for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) v += (i ? tx : 1 - tx) * (j ? ty : 1 - ty) * img.d[(clampI(y0 + j, h) * w + clampI(x0 + i, w)) * c + ch]; }
      else { for (let j = -1; j < 3; j++) { const wy = cubicW(ty - j), row = clampI(y0 + j, h) * w; for (let i = -1; i < 3; i++) v += wy * cubicW(tx - i) * img.d[(row + clampI(x0 + i, w)) * c + ch]; } }
      o.d[oi + ch] = Math.round(v);
    }
  }
  return o;
}
/* median-cut quantization, like Image.quantize() on RGB images */
function quantize(img, k) {
  const n = img.w * img.h, d = img.d; let idx = new Uint32Array(n); for (let i = 0; i < n; i++) idx[i] = i;
  const boxes = [{ s: 0, e: n }];
  const info = b => { let mn = [255, 255, 255], mx = [0, 0, 0]; for (let i = b.s; i < b.e; i++) { const j = idx[i] * 3; for (let ch = 0; ch < 3; ch++) { const v = d[j + ch]; if (v < mn[ch]) mn[ch] = v; if (v > mx[ch]) mx[ch] = v; } } let ch = 0; for (let q = 1; q < 3; q++) if (mx[q] - mn[q] > mx[ch] - mn[ch]) ch = q; b.ch = ch; b.range = mx[ch] - mn[ch]; };
  info(boxes[0]);
  while (boxes.length < k) {
    let bi = -1; for (let i = 0; i < boxes.length; i++) if (boxes[i].e - boxes[i].s > 1 && boxes[i].range > 0 && (bi < 0 || boxes[i].range * (boxes[i].e - boxes[i].s) > boxes[bi].range * (boxes[bi].e - boxes[bi].s))) bi = i;
    if (bi < 0) break;
    const b = boxes[bi], ch = b.ch, sub = Array.from(idx.subarray(b.s, b.e)).sort((p, q) => d[p * 3 + ch] - d[q * 3 + ch]);
    idx.set(sub, b.s); const m = b.s + ((b.e - b.s) >> 1);
    const b2 = { s: m, e: b.e }; b.e = m; info(b); info(b2); boxes.push(b2);
  }
  const o = mk(img.w, img.h, 3);
  for (const b of boxes) { const s = [0, 0, 0]; for (let i = b.s; i < b.e; i++) for (let ch = 0; ch < 3; ch++) s[ch] += d[idx[i] * 3 + ch]; const cnt = b.e - b.s; for (let i = b.s; i < b.e; i++) for (let ch = 0; ch < 3; ch++) o.d[idx[i] * 3 + ch] = s[ch] / cnt; }
  return { img: o, colors: boxes.length };
}
/* SVD of a square grayscale image via Jacobi on AᵀA */
function svdPrep(g) {
  const n = g.w, A = new Float64Array(n * n); for (let i = 0; i < n * n; i++) A[i] = g.d[i];
  const B = new Float64Array(n * n);
  for (let i = 0; i < n; i++) for (let j = i; j < n; j++) { let s = 0; for (let r = 0; r < n; r++) s += A[r * n + i] * A[r * n + j]; B[i * n + j] = B[j * n + i] = s; }
  const V = new Float64Array(n * n); for (let i = 0; i < n; i++) V[i * n + i] = 1;
  for (let sweep = 0; sweep < 12; sweep++) {
    let off = 0;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      const bpq = B[p * n + q]; if (Math.abs(bpq) < 1e-12 * (Math.abs(B[p * n + p]) + Math.abs(B[q * n + q]) + 1e-300)) continue;
      off += bpq * bpq;
      const th = (B[q * n + q] - B[p * n + p]) / (2 * bpq), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const kp = B[k * n + p], kq = B[k * n + q]; B[k * n + p] = c * kp - s * kq; B[k * n + q] = s * kp + c * kq; }
      for (let k = 0; k < n; k++) { const pk = B[p * n + k], qk = B[q * n + k]; B[p * n + k] = c * pk - s * qk; B[q * n + k] = s * pk + c * qk; }
      for (let k = 0; k < n; k++) { const kp = V[k * n + p], kq = V[k * n + q]; V[k * n + p] = c * kp - s * kq; V[k * n + q] = s * kp + c * kq; }
    }
    if (off < 1e-6) break;
  }
  const order = [...Array(n).keys()].sort((a, b) => B[b * n + b] - B[a * n + a]);
  const sig = order.map(i => Math.sqrt(Math.max(B[i * n + i], 0)));
  const Vs = new Float64Array(n * n); order.forEach((src, dst) => { for (let k = 0; k < n; k++) Vs[k * n + dst] = V[k * n + src]; });
  const AV = new Float64Array(n * n);
  for (let r = 0; r < n; r++) for (let i = 0; i < n; i++) { let s = 0; for (let k = 0; k < n; k++) s += A[r * n + k] * Vs[k * n + i]; AV[r * n + i] = s; }
  return { n, sig, V: Vs, AV };
}
function svdRecon(P, k) { const { n, V, AV } = P, o = mk(n, n, 1); for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += AV[r * n + i] * V[c * n + i]; o.d[r * n + c] = Math.round(s); } return o; }
function down2(g) { const w = g.w >> 1, o = mk(w, w, 1); for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const i = 2 * y * g.w + 2 * x; o.d[y * w + x] = (g.d[i] + g.d[i + 1] + g.d[i + g.w] + g.d[i + g.w + 1]) / 4; } return o; }

/* ================= sample image ================= */
function makeSample() {
  const c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d"), r = rng(11);
  const g = x.createLinearGradient(0, 0, 0, 175); g.addColorStop(0, "#13204b"); g.addColorStop(0.55, "#c4566c"); g.addColorStop(1, "#f6c873");
  x.fillStyle = g; x.fillRect(0, 0, N, 180);
  x.fillStyle = "#ffffff"; for (let i = 0; i < 26; i++) x.fillRect(Math.floor(r() * N), Math.floor(r() * 55), 1, 1);
  x.fillStyle = "#ffe2a0"; x.beginPath(); x.arc(190, 126, 24, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#4a3e66"; for (let px = -6; px < N;) { const w = 10 + r() * 18, h = 28 + r() * 52; x.fillRect(px, 172 - h, w, h + 8); px += w - 2; }
  for (let bx = -6; bx < N;) {
    const w = 24 + r() * 30, h = 56 + r() * 92, top = 202 - h;
    x.fillStyle = "#1b1a2a"; x.fillRect(bx, top, w, h);
    for (let wy = top + 6; wy < 194; wy += 9) for (let wx = bx + 4; wx < bx + w - 5; wx += 7) if (r() < 0.45) { x.fillStyle = r() < 0.8 ? "#ffcd6b" : "#9cd2ff"; x.fillRect(wx, wy, 4, 5); }
    bx += w + 3;
  }
  x.fillStyle = "#2a2940"; x.fillRect(114, 46, 22, 156);
  x.fillStyle = "#dcdcec"; for (let sx = 115; sx < 136; sx += 3) x.fillRect(sx, 50, 1, 148);
  x.fillStyle = "#28282e"; x.fillRect(0, 202, N, 54);
  x.fillStyle = "#56565f"; x.fillRect(0, 202, N, 4);
  x.fillStyle = "#f2f2f2"; for (let lx = 4; lx < N; lx += 32) x.fillRect(lx, 232, 18, 3);
  x.fillStyle = "#e0473c"; x.beginPath(); x.roundRect(40, 214, 66, 16, 5); x.fill(); x.beginPath(); x.roundRect(54, 204, 36, 13, 5); x.fill();
  x.fillStyle = "#bfe4ff"; x.fillRect(58, 207, 12, 7); x.fillRect(73, 207, 13, 7);
  x.fillStyle = "#fff6bf"; x.fillRect(101, 218, 5, 4);
  x.fillStyle = "#0b0b0d"; [[56, 230], [92, 230]].forEach(([cx, cy]) => { x.beginPath(); x.arc(cx, cy, 6, 0, Math.PI * 2); x.fill(); });
  x.fillStyle = "#8a8a94"; [[56, 230], [92, 230]].forEach(([cx, cy]) => { x.beginPath(); x.arc(cx, cy, 2, 0, Math.PI * 2); x.fill(); });
  return fromID(x.getImageData(0, 0, N, N));
}

/* ================= chart drawing ================= */
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function prep(cv, hCss) {
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 300;
  cv.width = Math.round(w * dpr); cv.height = Math.round(hCss * dpr); cv.style.height = hCss + "px";
  const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, hCss);
  return [x, w, hCss];
}
function axisX(x, l, r, y) {
  x.fillStyle = css("--muted"); x.font = "11px " + css("--mono"); x.textBaseline = "top";
  [0, 64, 128, 192, 255].forEach((v, i, a) => { const px = l + (v / 255) * (r - l); x.textAlign = i === 0 ? "left" : i === a.length - 1 ? "right" : "center"; x.fillText(v, px, y + 4); });
}
/* series: [{h, color, mode:'area'|'line'}]; each normalized to its own peak */
function drawHist(cv, series, opt = {}) {
  const [x, w, h] = prep(cv, 120), l = 2, r = w - 2, top = 6, bot = h - 20;
  x.strokeStyle = css("--line"); x.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const yy = Math.round(top + (bot - top) * i / 4) + 0.5; x.beginPath(); x.moveTo(l, yy); x.lineTo(r, yy); x.stroke(); }
  for (const s of series) {
    let mx = 1; for (let i = 0; i < 256; i++) if (s.h[i] > mx) mx = s.h[i];
    const px = i => l + (i / 255) * (r - l), py = v => bot - (v / mx) * (bot - top);
    x.beginPath(); x.moveTo(px(0), bot);
    for (let i = 0; i < 256; i++) x.lineTo(px(i), py(s.h[i]));
    x.lineTo(px(255), bot); x.closePath();
    if (s.mode === "line") { x.strokeStyle = s.color; x.lineWidth = 1.25; x.stroke(); }
    else { x.globalAlpha = s.alpha ?? 1; x.fillStyle = s.color; x.fill(); x.globalAlpha = 1; }
  }
  if (opt.line != null) {
    const px = l + (opt.line / 255) * (r - l);
    x.strokeStyle = css("--fg"); x.setLineDash([4, 3]); x.lineWidth = 1.5; x.beginPath(); x.moveTo(px, top); x.lineTo(px, bot); x.stroke(); x.setLineDash([]);
    x.fillStyle = css("--fg"); x.font = "500 11px " + css("--mono"); x.textBaseline = "top"; x.textAlign = px > w - 60 ? "right" : "left"; x.fillText("T = " + opt.line, px + (px > w - 60 ? -5 : 5), top);
  }
  axisX(x, l, r, bot);
  cv._hist = { series, l, r };
}
function drawCurve(cv, lut) {
  const s = 120, dpr = window.devicePixelRatio || 1; cv.width = s * dpr; cv.height = s * dpr;
  const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, s, s);
  const p = 6, q = s - 6, map = v => p + (v / 255) * (q - p);
  x.fillStyle = css("--frame"); x.fillRect(p, p, q - p, q - p);
  x.strokeStyle = css("--faint"); x.setLineDash([3, 3]); x.beginPath(); x.moveTo(p, q); x.lineTo(q, p); x.stroke(); x.setLineDash([]);
  x.strokeStyle = css("--fg"); x.lineWidth = 2; x.beginPath();
  for (let r = 0; r < 256; r++) { const X = map(r), Y = q - (map(lut[r]) - p); r ? x.lineTo(X, Y) : x.moveTo(X, Y); }
  x.stroke();
}
function drawSigma(cv, sig, k) {
  const [x, w, h] = prep(cv, 120), l = 2, r = w - 2, top = 6, bot = h - 20, n = sig.length;
  const lg = v => Math.log10(Math.max(v, 1e-3)), lo = lg(sig[n - 1] || 1e-3), hi = lg(sig[0]);
  const bw = (r - l) / n;
  for (let i = 0; i < n; i++) { const y = bot - ((lg(sig[i]) - lo) / (hi - lo || 1)) * (bot - top); x.fillStyle = i < k ? css("--fg") : css("--faint"); x.fillRect(l + i * bw, y, Math.max(bw - 0.5, 0.6), bot - y); }
  x.fillStyle = css("--muted"); x.font = "11px " + css("--mono"); x.textBaseline = "top";
  x.textAlign = "left"; x.fillText("1", l, bot + 4); x.textAlign = "center"; x.fillText(String(k), Math.min(Math.max(l + (k - 0.5) * bw, 20), r - 20), bot + 4); x.textAlign = "right"; x.fillText(String(n), r, bot + 4);
}
function renderKernels(el, list) {
  el.innerHTML = "";
  for (const { k, kw, kh, dec, label } of list) {
    const box = document.createElement("div"); box.className = "extra";
    if (label) { const s = document.createElement("span"); s.className = "lbl"; s.textContent = label; box.appendChild(s); }
    const g = document.createElement("div"), tiny = kw > 7; g.className = "kgrid" + (tiny ? " tiny" : ""); g.style.gridTemplateColumns = `repeat(${kw}, auto)`;
    let mx = 0; for (const v of k) mx = Math.max(mx, Math.abs(v));
    k.forEach(v => {
      const c = document.createElement("div"), a = mx ? Math.abs(v) / mx : 0;
      c.style.background = `color-mix(in srgb, var(--fg) ${Math.round(8 + a * 80)}%, transparent)`;
      c.style.color = a > 0.5 ? "var(--bg)" : "var(--fg)";
      if (!tiny) c.textContent = Number.isInteger(v) ? v : v.toFixed(dec ?? 2).replace(/^(-?)0\./, "$1.");
      c.title = String(+v.toFixed(4)); g.appendChild(c);
    });
    box.appendChild(g); el.appendChild(box);
  }
}
function renderMatrix(el, M, dec) { el.innerHTML = M.map(v => `<span>${(+v.toFixed(dec)).toString()}</span>`).join(""); }

