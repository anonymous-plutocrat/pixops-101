/* ================= Pillow / OpenCV variants ================= */
Object.assign(TIPS, {
  "ImageOps.invert": "Pillow function that reverses every intensity: each value v becomes 255 − v.",
  "Image.open": "Pillow function that loads an image file. Pillow keeps channels in R, G, B order.",
  "plt.imshow": "Matplotlib function that displays an array. It assumes R, G, B order.",
  "cv2.imread": "OpenCV function that loads an image file as a NumPy array in B, G, R order.",
  ".resize": "Pillow method that returns a resized copy. It takes the new size in pixels as (width, height).",
  "resample=": "How new pixel values are estimated when the grid changes size.",
  "ImageFilter.Kernel": "Pillow filter built from your own weights. It only accepts 3 × 3 or 5 × 5 kernels.",
  ".flatten": "Turns the 2-D kernel into a flat list, which is the form ImageFilter.Kernel expects.",
  "ImageFilter.GaussianBlur": "Pillow's Gaussian blur. It takes a radius and sizes the kernel automatically.",
  "radius=": "How far the blur reaches. For GaussianBlur it plays the role of sigma.",
  "ImageFilter.EDGE_ENHANCE": "Pillow's built-in filter that boosts edges so they stand out more before edge detection.",
  "ImageFilter.FIND_EDGES": "Pillow's built-in edge filter: center 8, all neighbors −1. Flat areas become black, edges bright.",
  "ImageFilter.MedianFilter": "Pillow's median filter: each pixel becomes the median of a size × size neighborhood.",
  "size=": "The neighborhood is size × size pixels. It must be odd.",
  "ImageFilter.BoxBlur": "Pillow's mean filter: the average of a square box of neighbors.",
  "cv2.rectangle": "OpenCV function that draws a rectangle directly into the array.",
  "pt1=": "The top-left corner as (x, y).",
  "pt2=": "The bottom-right corner as (x, y).",
  "Image.fromarray": "Converts a NumPy array back into a Pillow image.",
});
const RESAMPLE = { NEAREST: "NEAREST", LINEAR: "BILINEAR", CUBIC: "BICUBIC" };
const PIL_EE = [-1, -1, -1, -1, 10, -1, -1, -1, -1].map(v => v / 2), PIL_FE = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
const noiseLines = "«noise» = «np.random.normal»(«0|The mean of the noise.», ‹sig›, («rows», «cols», «3|One noise value per channel.»))\n«noisy_image» = «image» + «noise»\n";
const isPil = s => s.lib === "pil";

const OVERRIDES = {
  grayscale: { libs: true,
    code: s => s.w === "avg"
      ? (isPil(s) ? "«image_gray» = «np.array»(«image»)«.mean»(«axis=2»)«.astype(np.uint8)»   # equal weights, for comparison" : "«image_gray» = «image»«.mean»(«axis=2»)«.astype(np.uint8)»   # equal weights, for comparison")
      : (isPil(s) ? "«image_gray» = «ImageOps.grayscale»(«image»)" : "«image_gray» = «cv2.cvtColor»(«image», «cv2.COLOR_BGR2GRAY»)") },

  channels: { libs: true,
    code: s => {
      const pil = isPil(s);
      if (s.ch === "bgr") return pil
        ? "«image» = «Image.open»(«\"image.png\"|The file to load.»)\n«plt.imshow»(«image»)   # Pillow keeps R, G, B order, so the colors are correct"
        : "«image» = «cv2.imread»(«\"image.png\"|The file to load.»)\n«plt.imshow»(«image»)   # still B, G, R, so red and blue appear swapped";
      const order = pil ? ["red", "green", "blue"] : ["blue", "green", "red"], keep = order.indexOf(s.ch);
      const name = `image_${s.ch}`, nt = `A copy that will keep only the ${s.ch} channel.`;
      const lines = [pil ? `«${name}|${nt}» = «np.array»(«image»)` : `«${name}|${nt}» = «image»«.copy»()`];
      [0, 1, 2].filter(c => c !== keep).forEach(c => lines.push(`«${name}|${nt}»«[:, :, ${c}]|Every row, every column, channel ${c}. In ${pil ? "Pillow's R, G, B" : "OpenCV's B, G, R"} order that is ${order[c]}.» = «0|Setting the whole channel to 0 removes that color.»   # ${order[c]}`));
      return lines.join("\n");
    },
    run(s, v) {
      const o = clone(SRC);
      if (!(s.ch === "bgr" && isPil(s))) for (let p = 0; p < N * N; p++) { const j = p * 3; if (s.ch === "bgr") { o.d[j] = SRC.d[j + 2]; o.d[j + 2] = SRC.d[j]; } else { const keep = { red: 0, green: 1, blue: 2 }[s.ch]; for (let c = 0; c < 3; c++) if (c !== keep) o.d[j + c] = 0; } }
      v.show(0, SRC); v.show(1, o);
    } },

  flip: { libs: true,
    code: s => isPil(s) ? "«new_image» = «image»«.transpose»(‹t›)" : `«new_image» = ${FLIPS[s.t].cv}   # ‹t›`,
    codeFmt: { t: (v, s) => isPil(s) ? "Image." + v : v } },

  crop: { libs: true,
    code: s => isPil(s) ? "«crop» = «image»«.crop»((‹l›, ‹u›, ‹r›, ‹lo›))   # (left, upper, right, lower)" : "«crop» = «image»[‹u›:‹lo›, ‹l›:‹r›]   # rows first, then columns" },

  "pixels-edit": { libs: true,
    code: s => {
      const pil = isPil(s);
      if (s.m === "zero") return pil
        ? "«array_sq» = «np.array»(«image»)\n«array_sq»[‹u›:‹lo›, ‹l›:‹r›, «1:3|Channels 1 and 2: green and blue in Pillow's R, G, B order, so only red is left.»] = «0|Writes 0 into those channels for every pixel in the box.»"
        : "«array_sq» = «image»«.copy»()\n«array_sq»[‹u›:‹lo›, ‹l›:‹r›, «0:2|Channels 0 and 1: blue and green in OpenCV's B, G, R order, so only red is left.»] = «0|Writes 0 into those channels for every pixel in the box.»";
      if (s.m === "rect") return pil
        ? "«image_draw» = «image»«.copy»()\n«ImageDraw.Draw»(«im=»«image_draw»)«.rectangle»(«xy=»[‹l›, ‹u›, ‹r›, ‹lo›], «fill=\"red\"»)"
        : "«image_draw» = «image»«.copy»()\n«cv2.rectangle»(«image_draw», «pt1=»(‹l›, ‹u›), «pt2=»(‹r›, ‹lo›), «color=(0, 0, 255)|Red, written in B, G, R order.», «thickness=-1|A negative thickness fills the rectangle instead of drawing only its outline.»)";
      return pil
        ? "«crop» = «image»«.crop»((‹l›, ‹u›, ‹r›, ‹lo›))«.transpose»(«Image.FLIP_LEFT_RIGHT»)\n«new_image» = «image»«.copy»()\n«new_image»«.paste»(«crop», «box=»(‹l›, ‹u›))"
        : "«new_image» = «image»«.copy»()\n«new_image»[‹u›:‹lo›, ‹l›:‹r›] = «image»[‹u›:‹lo›, ‹l›:‹r›]«[:, ::-1]|Reverses the column order, which mirrors the crop left to right.»";
    } },

  negative: { libs: true,
    code: s => isPil(s) ? "«img_neg» = «ImageOps.invert»(«image»)" : "«img_neg» = «255|The highest value an 8-bit pixel can hold: L − 1, with L = 256 levels.» «-|Subtracts every pixel from 255, so 0 becomes 255 and 255 becomes 0.» «image»" },

  scaling: { libs: true,
    controls: [
      { type: "range", key: "fx", name: "fx", label: "width factor", tip: "fx multiplies the width. 2 doubles it, 0.5 halves it.", min: 0.25, max: 4, step: 0.25, value: 2, fmt: v => v.toFixed(2) },
      { type: "range", key: "fy", name: "fy", label: "height factor", tip: "fy multiplies the height.", min: 0.25, max: 4, step: 0.25, value: 1, fmt: v => v.toFixed(2) },
      { type: "chips", key: "i", name: "interpolation", label: "how new pixels are made", tip: "", wide: true, value: "CUBIC", options: [["NEAREST", "Nearest"], ["LINEAR", "Linear"], ["CUBIC", "Cubic"]] },
    ],
    code: s => {
      const nw = Math.max(1, Math.round(N * s.fx)), nh = Math.max(1, Math.round(N * s.fy));
      return isPil(s)
        ? `«new_image» = «image»«.resize»((«${nw}|New width in pixels. Pillow takes sizes, not factors: 256 × fx = ${nw}.», «${nh}|New height in pixels: 256 × fy = ${nh}.»), «resample=»‹i›)`
        : "«new_image» = «cv2.resize»(«image», «None |dsize. None means the output size is worked out from fx and fy instead.», «fx=»‹fx›, «fy=»‹fy›, «interpolation=»‹i›)";
    },
    codeFmt: { i: (v, s) => isPil(s) ? "Image." + RESAMPLE[v] : "cv2.INTER_" + v, fx: num, fy: num },
    tipFor: { i: s => { const n = isPil(s) ? "Image." + RESAMPLE[s.i] : "cv2.INTER_" + s.i; return n + ({ NEAREST: " copies the single closest source pixel. Fast, but blocky when enlarging.", LINEAR: " blends the 4 nearest pixels by distance.", CUBIC: " fits a smooth curve through the 16 nearest pixels. Slower, smoothest when enlarging." })[s.i]; } } },

  rotation: { libs: true,
    controls: [
      { type: "range", key: "a", name: "angle", label: "degrees", tip: "angle: rotation in degrees. Positive turns counter-clockwise.", min: -180, max: 180, step: 1, value: 45 },
      { type: "range", key: "sc", name: "scale", label: "zoom", tip: "scale: zoom applied with the rotation. 1 keeps the size; 0.7 makes room for the corners.", min: 0.25, max: 2, step: 0.05, value: 1, fmt: v => v.toFixed(2), show: s => !isPil(s) },
    ],
    look: "The corners clip and the uncovered areas turn black. In OpenCV, lower the scale to fit the whole rotated image inside the frame; Pillow's rotate() has no scale, but rotate(angle, expand=True) grows the canvas instead.",
    code: s => isPil(s) ? "«new_image» = «image»«.rotate»(‹a›)" : "«M» = «cv2.getRotationMatrix2D»(«center=»(«cols // 2 - 1|x of the center: the middle column.», «rows // 2 - 1|y of the center: the middle row.»), «angle=»‹a›, «scale=»‹sc›)\n«new_image» = «cv2.warpAffine»(«image», «M», «(cols, rows)»)",
    run(s, v) {
      const sc = isPil(s) ? 1 : s.sc, t = s.a * Math.PI / 180, al = sc * Math.cos(t), be = sc * Math.sin(t), cx = isPil(s) ? N / 2 : N / 2 - 1, cy = cx;
      const M = [al, be, (1 - al) * cx - be * cy, -be, al, be * cx + (1 - al) * cy];
      v.show(0, SRC); v.show(1, warp(SRC, M, N, N)); renderMatrix(v.ex.matrix, M, 3);
    } },

  mean: { libs: true,
    controls: [
      { type: "range", key: "sig", name: "noise σ", label: "noise strength", tip: "The standard deviation of the noise added before filtering.", min: 0, max: 40, step: 1, value: 15 },
      { type: "range", key: "k", name: "k", label: "kernel size", tip: "The kernel is k × k pixels. Bigger averages over more neighbors.", min: 3, max: 11, step: 2, value: 5, fmt: v => `${v} × ${v}`, show: s => !isPil(s) },
      { type: "chips", key: "kp", name: "k", label: "kernel size", tip: "Pillow's ImageFilter.Kernel only accepts 3 × 3 or 5 × 5 kernels.", value: 5, options: [[3, "3 × 3"], [5, "5 × 5"]], show: s => isPil(s) },
    ],
    code: s => { const k = isPil(s) ? s.kp : s.k, key = isPil(s) ? "kp" : "k"; return noiseLines + `«kernel» = «np.ones»((‹${key}›, ‹${key}›)) / «${k * k}|Dividing by the number of weights (k × k) makes them add up to 1, so the overall brightness stays the same.»\n` + (isPil(s) ? `«image_filtered» = «noisy_image»«.filter»(«ImageFilter.Kernel»((‹kp›, ‹kp›), «kernel»«.flatten»()))` : "«image_filtered» = «cv2.filter2D»(«src=»«noisy_image», «ddepth=-1», «kernel=»«kernel»)"); },
    run(s, v) { const kk = isPil(s) ? s.kp : s.k, noisy = addNoise(SRC, s.sig, 3), k = new Array(kk * kk).fill(1 / (kk * kk)); v.show(0, noisy); v.show(1, fromF(noisy, conv(noisy, k, kk, kk))); renderKernels(v.ex.kernel, [{ k, kw: kk, kh: kk, dec: 3, label: `Kernel · each weight is 1/${kk * kk}` }]); } },

  gaussian: { libs: true,
    controls: [
      { type: "range", key: "k", name: "ksize", label: "kernel size", tip: "ksize: the kernel's width and height. It must be odd.", min: 3, max: 15, step: 2, value: 11, fmt: v => `${v} × ${v}`, show: s => !isPil(s) },
      { type: "range", key: "sg", name: "sigma", label: "spread", tip: "The standard deviation of the Gaussian. Bigger spreads the weight further and blurs more. Pillow calls it radius.", min: 0.5, max: 10, step: 0.5, value: 4, fmt: v => v.toFixed(1) },
    ],
    code: s => isPil(s) ? "«image_filtered» = «noisy_image»«.filter»(«ImageFilter.GaussianBlur»(«radius=»‹sg›))" : "«image_filtered» = «cv2.GaussianBlur»(«noisy_image», (‹k›, ‹k›), «sigmaX=»‹sg›, «sigmaY=»‹sg›)",
    run(s, v) {
      const k = isPil(s) ? 2 * Math.ceil(3 * s.sg) + 1 : s.k, noisy = addNoise(SRC, 15, 3), g = gaussKernel(k, s.sg);
      v.show(0, noisy); v.show(1, fromF(noisy, convSep(noisy, g)));
      if (k <= 15) { const k2 = []; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) k2.push(g[j] * g[i]); renderKernels(v.ex.kernel, [{ k: k2, kw: k, kh: k, dec: 3, label: isPil(s) ? `Kernel Pillow builds for radius ${s.sg} (${k} × ${k})` : "Kernel weights (darker counts more)" }]); }
      else v.ex.kernel.innerHTML = `<p class="hint">Pillow sizes the kernel from the radius: about 6 × radius, here ${k} × ${k}. Too large to draw as a grid.</p>`;
    } },

  sharpen: { libs: true,
    controls: [{ type: "chips", key: "k", name: "kernel", label: "which kernel", tip: "", value: "custom", options: [["custom", "Lab kernel"], ["pil", "ImageFilter.SHARPEN"]], show: s => isPil(s) }],
    code: s => !isPil(s)
      ? "«kernel» = «np.array |Writes the kernel out by hand.»([[«-1|Each neighbor is subtracted once.», -1, -1],\n                   [-1,  «9|The center pixel counts 9 times. 9 − 8 neighbors = 1, so flat areas are unchanged.», -1],\n                   [-1, -1, -1]])\n«sharpened» = «cv2.filter2D»(«image», «-1», «kernel»)"
      : s.k === "custom"
      ? "«kernel» = «ImageFilter.Kernel»((3, 3), [«-1|Each neighbor is subtracted once.», -1, -1,\n                                   -1,  «9|The center pixel counts 9 times. 9 − 8 neighbors = 1, so flat areas are unchanged.», -1,\n                                   -1, -1, -1])\n«sharpened» = «image»«.filter»(«kernel»)"
      : "«sharpened» = «image»«.filter»(«ImageFilter.SHARPEN»)",
    run(s, v) { const k = isPil(s) ? SHARP[s.k] : SHARP.custom; v.show(0, SRC); v.show(1, fromF(SRC, conv(SRC, k, 3, 3))); renderKernels(v.ex.kernel, [{ k, kw: 3, kh: 3, dec: 3, label: "Kernel" }]); } },

  sobel: { libs: true,
    look: "With OpenCV, the dx and dy views show mid-gray for no change, and white or black for change in opposite directions. Pillow's FIND_EDGES has no direction: every edge comes out bright on black.",
    controls: [{ type: "chips", key: "d", name: "direction", label: "which gradient", tip: "", value: "mag", options: [["x", "dx = 1"], ["y", "dy = 1"], ["mag", "Combined"]], show: s => !isPil(s) }],
    code: s => isPil(s) ? "«img_gray» = «img_gray»«.filter»(«ImageFilter.EDGE_ENHANCE»)\n«img_gray» = «img_gray»«.filter»(«ImageFilter.FIND_EDGES»)" : OPS.find(o => o.id === "sobel")._cvCode(s),
    run(s, v) {
      if (!isPil(s)) return OPS.find(o => o.id === "sobel")._cvRun(s, v);
      const ee = fromF(GRAY, conv(GRAY, PIL_EE, 3, 3)), fe = fromF(ee, conv(ee, PIL_FE, 3, 3));
      v.show(0, GRAY); v.show(1, fe);
      renderKernels(v.ex.kernel, [{ k: PIL_EE, kw: 3, kh: 3, dec: 1, label: "EDGE_ENHANCE" }, { k: PIL_FE, kw: 3, kh: 3, label: "FIND_EDGES" }]);
    } },

  median: { libs: true,
    code: s => isPil(s)
      ? (s.f === "median" ? "«filtered_image» = «image»«.filter»(«ImageFilter.MedianFilter»(«size=»‹k›))" : `«filtered_image» = «image»«.filter»(«ImageFilter.BoxBlur»(«radius=»«${(s.k - 1) / 2}|BoxBlur takes a radius: a ${s.k} × ${s.k} box has radius ${(s.k - 1) / 2}.»))`)
      : (s.f === "median" ? "«filtered_image» = «cv2.medianBlur»(«image», ‹k›)" : "«filtered_image» = «cv2.blur»(«image», (‹k›, ‹k›))") },
};
const LIB_LABEL = { quantize: "Pillow", copy: "NumPy", histogram: "OpenCV", brightness: "OpenCV", equalize: "OpenCV", threshold: "OpenCV", translation: "OpenCV", arrays: "NumPy", svd: "NumPy" };
{ const sob = OPS.find(o => o.id === "sobel"); sob._cvCode = sob.code; sob._cvRun = sob.run; }
OPS.forEach(op => { if (OVERRIDES[op.id]) Object.assign(op, OVERRIDES[op.id]); op.libLabel = LIB_LABEL[op.id] || "Python"; });

Object.assign(OPS.find(o => o.id === "copy"), {
  controls: [{ type: "chips", key: "mode", name: "B", label: "how B is made", tip: "B = A gives a second name for the same array. B = A.copy() makes a separate array.", value: "alias", options: [["alias", "B = A"], ["copy", "B = A.copy()"]] }],
  look: "The image panel now shows A and B side by side. Run the cell below: it adds one line that sets every pixel of A to zero. Then look at B. Did it go black too? Try again with B = A.copy() in step 2.",
  code: s => `«A» = «np.array»(«image»)\n«B» = ‹mode›\n«id»(«A») == «id»(«B»)   # ${s.mode === "alias" ? "True: one array, two names" : "False: two separate arrays"}`,
  code3: s => `«A» = «np.array»(«image»)\n«B» = ‹mode›\n«A[:, :, :] = 0|Sets every pixel in every channel of A to 0 (black).»\n«id»(«A») == «id»(«B»)   # ${s.mode === "alias" ? "True" : "False"}`,
  run3: s => { s.zeroed = true; },
  reset3: s => { s.zeroed = false; },
  waitMsg: "B still shows the original image",
  ranMsg: s => s.mode === "alias" ? "A is all zeros, and so is B: they are the same array" : "A is all zeros, B kept its pixels: it is a copy",
});
