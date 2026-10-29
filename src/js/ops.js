/* ================= code explanations ================= */
const TIPS = {
  "image": "The input image. In Pillow it is an Image object; in OpenCV it is a NumPy array of shape (rows, cols, 3), with channels in B, G, R order.",
  "new_image": "A new variable for the result, so the original image is left unchanged.",
  "image_gray": "A new variable holding the one-channel grayscale image.",
  "img_gray": "The grayscale input. Edge detection works on intensity, so color is dropped first.",
  "ImageOps.grayscale": "Pillow function that converts a color image to grayscale (mode \"L\") with the weights 0.299 R + 0.587 G + 0.114 B.",
  "cv2.cvtColor": "OpenCV function that converts an image from one color space to another.",
  "cv2.COLOR_BGR2GRAY": "Conversion code: from OpenCV's B, G, R color order to a single grayscale channel.",
  ".mean": "NumPy method that averages values along an axis.",
  "axis=2": "Axis 2 is the channel axis, so each pixel's R, G and B are averaged with equal weight.",
  ".astype(np.uint8)": "Converts the values to 8-bit unsigned integers (0 to 255), the type images are stored in. Values outside that range wrap around.",
  ".astype(int)": "Converts to ordinary integers first, so the arithmetic can go above 255 or below 0 without wrapping.",
  ".copy": "Makes an independent copy, so later changes to it don't affect the original.",
  "np.copy": "NumPy function that returns an independent copy of an array.",
  "np.array": "Converts a Pillow image into a NumPy array of pixel values.",
  "id": "Returns an object's identity in memory. Equal ids mean both names point to the same array.",
  "A": "The first name for the image array.",
  "B": "A second name. Whether it shares memory with A depends on how it was created.",
  ".quantize": "Pillow method that reduces the image to a small palette, choosing the colors with median cut.",
  "colors=": "How many colors the new palette may use.",
  "image_q": "The quantized image, stored in palette mode.",
  ".transpose": "Pillow method that flips or rotates an image in steps of 90°. Pixels are only moved, never changed.",
  "cv2.flip": "OpenCV function that mirrors an image. The second argument picks the axis.",
  "cv2.rotate": "OpenCV function that rotates an image by exactly 90°, 180° or 270°.",
  "cv2.transpose": "OpenCV function that swaps rows and columns, mirroring the image across its main diagonal.",
  "crop": "The cut-out part of the image.",
  ".crop": "Pillow method that cuts out a box given as (left, upper, right, lower).",
  "array": "The image as a NumPy array.",
  "array_sq": "A copy of the array that will be edited.",
  "image_draw": "A copy of the image to draw on.",
  "ImageDraw.Draw": "Creates a drawing object. Everything drawn with it is written straight into the image you pass in.",
  "im=": "The image the drawing object writes into.",
  ".rectangle": "Draws a rectangle. xy is the box [left, upper, right, lower].",
  "xy=": "The rectangle's corners as [left, upper, right, lower].",
  "fill=\"red\"": "Fills the rectangle with solid red.",
  ".paste": "Pillow method that copies one image onto another. It changes the target image in place.",
  "box=": "Where to paste: the (left, upper) corner of the pasted image.",
  "Image.FLIP_LEFT_RIGHT": "Mirror left to right.",
  "hist": "An array of 256 counts, one for each intensity value.",
  "cv2.calcHist": "OpenCV function that counts how many pixels fall into each intensity bin.",
  "None": "No mask, so every pixel is counted.",
  "256": "The number of bins: one for each possible intensity, 0 to 255.",
  "0, 256": "The range of values to count. The upper bound is not included, so this covers 0 to 255.",
  "for": "Loop over the three channels.",
  "enumerate": "Gives each item together with its position: 0 blue, 1 green, 2 red.",
  "img_neg": "The negative image.",
  "cv2.convertScaleAbs": "OpenCV function that computes |alpha · pixel + beta|, then clips to 0–255 and converts to 8-bit.",
  "cv2.equalizeHist": "OpenCV function that remaps intensities through the cumulative histogram so they spread over 0–255. It works on one-channel images.",
  "ret": "The threshold that was actually used. With Otsu's method, this is the value it chose.",
  "otsu": "The thresholded image.",
  "cv2.threshold": "OpenCV function that compares every pixel with a threshold and sets it to one of two values.",
  "cv2.resize": "OpenCV function that changes an image's size.",
  "None ": "dsize. None means the output size is worked out from fx and fy instead.",
  "fx=": "Scale factor for the width.",
  "fy=": "Scale factor for the height.",
  "interpolation=": "How new pixel values are estimated when the grid changes size.",
  "M": "The 2 × 3 affine matrix. Its left 2 × 2 part rotates or scales, its last column shifts.",
  "np.float32": "Builds the matrix as 32-bit floats, the type warpAffine expects.",
  "cv2.warpAffine": "OpenCV function that applies the matrix M: for every output pixel it finds where it came from in the input and blends the nearest pixels.",
  "cols": "The image width in pixels (number of columns).",
  "rows": "The image height in pixels (number of rows).",
  "(cols, rows)": "The output size as (width, height). Here it matches the input, so anything moved past the edge is cut off.",
  "cv2.getRotationMatrix2D": "OpenCV function that builds the 2 × 3 matrix for a rotation about a center point, with optional scaling.",
  "center=": "The point the image turns around, as (x, y). Here it is the middle of the image.",
  "angle=": "Rotation in degrees. Positive values turn counter-clockwise.",
  "scale=": "Zoom applied together with the rotation. 1 keeps the original size.",
  ".rotate": "Pillow's own rotate method. It also turns counter-clockwise and fills the corners with black.",
  "np.clip": "Limits every value to a range, here 0 to 255, instead of letting it wrap around.",
  "noise": "An array of random values with the same shape as the image.",
  "np.random.normal": "NumPy function that draws random numbers from a normal (Gaussian) distribution.",
  "U": "Left singular vectors: one column pattern per layer.",
  "s": "The singular values, largest first. Each says how much its layer contributes.",
  "V": "Right singular vectors: one row pattern per layer.",
  "np.linalg.svd": "NumPy function that factors a matrix into U · diag(s) · V.",
  "full_matrices=True": "Return the complete square U and V matrices.",
  "S": "The singular values placed on the diagonal of a matrix, so they can be multiplied.",
  "np.diag": "Builds a diagonal matrix from a list of values.",
  "@": "Matrix multiplication.",
  "image_k": "The rank-k approximation of the image.",
  "kernel": "The small grid of weights that slides over the image.",
  "np.ones": "Makes an array filled with ones: every neighbor gets the same weight.",
  "noisy_image": "The image with random noise added, to show what filtering removes.",
  "image_filtered": "The filtered result.",
  "cv2.filter2D": "OpenCV function that slides the kernel over every pixel and replaces it with the weighted sum of its neighborhood, on each channel separately.",
  "src=": "The input image.",
  "ddepth=-1": "Output depth. −1 keeps the same 8-bit type as the input.",
  "kernel=": "The kernel to apply.",
  "cv2.GaussianBlur": "OpenCV function that smooths the image with a Gaussian kernel.",
  "sigmaX=": "Standard deviation of the Gaussian across the width.",
  "sigmaY=": "Standard deviation of the Gaussian down the height.",
  "np.array ": "Writes the kernel out by hand as a 3 × 3 array.",
  "sharpened": "The sharpened image.",
  "-1": "ddepth: −1 keeps the input's 8-bit depth.",
  ".filter": "Pillow method that applies a filter to every channel.",
  "ImageFilter.SHARPEN": "Pillow's built-in 3 × 3 sharpening kernel: center 32, neighbors −2, divided by 16.",
  "grad_x": "The horizontal gradient: how fast intensity changes from left to right.",
  "grad_y": "The vertical gradient: how fast intensity changes from top to bottom.",
  "grad": "The combined edge strength.",
  "cv2.Sobel": "OpenCV function that estimates the image derivative with a Sobel kernel.",
  "ddepth=cv2.CV_16S": "Signed 16-bit output, so negative gradients are kept instead of being clipped to 0.",
  "ksize=3": "Use the 3 × 3 Sobel kernel.",
  "abs_grad_x": "The horizontal gradient as 8-bit absolute values.",
  "abs_grad_y": "The vertical gradient as 8-bit absolute values.",
  "cv2.addWeighted": "OpenCV function that blends two images: a · w1 + b · w2 + gamma.",
  "0.5": "Weight of 0.5, so both directions count equally.",
  "filtered_image": "The filtered result.",
  "cv2.medianBlur": "OpenCV function that replaces each pixel with the median of its square neighborhood. The size must be odd.",
  "cv2.blur": "OpenCV function for a plain mean filter: the average of a box of neighbors.",
};

/* ================= operations ================= */
const fmtPx = (img, x, y) => { const i = (y * img.w + x) * img.c; return img.c === 1 ? String(img.d[i]) : `(${img.d[i]}, ${img.d[i + 1]}, ${img.d[i + 2]})`; };
const FLIPS = {
  FLIP_LEFT_RIGHT: { f: (x, y) => [N - 1 - x, y], cv: "«cv2.flip»(«image», «1|Flip code 1: mirror around the vertical axis, left to right.»)" },
  FLIP_TOP_BOTTOM: { f: (x, y) => [x, N - 1 - y], cv: "«cv2.flip»(«image», «0|Flip code 0: mirror around the horizontal axis, top to bottom.»)" },
  ROTATE_90: { f: (x, y) => [N - 1 - y, x], cv: "«cv2.rotate»(«image», «cv2.ROTATE_90_COUNTERCLOCKWISE|Turn 90° counter-clockwise, the same direction as Pillow's ROTATE_90.»)" },
  ROTATE_180: { f: (x, y) => [N - 1 - x, N - 1 - y], cv: "«cv2.rotate»(«image», «cv2.ROTATE_180|Turn 180°.»)" },
  ROTATE_270: { f: (x, y) => [y, N - 1 - x], cv: "«cv2.rotate»(«image», «cv2.ROTATE_90_CLOCKWISE|Turn 90° clockwise, which equals 270° counter-clockwise.»)" },
  TRANSPOSE: { f: (x, y) => [y, x], cv: "«cv2.transpose»(«image»)" },
  TRANSVERSE: { f: (x, y) => [N - 1 - y, N - 1 - x], cv: "«cv2.flip»(«cv2.transpose»(«image»), «-1|Flip code −1: mirror around both axes.»)" },
};
const FLIP_TIPS = {
  FLIP_LEFT_RIGHT: "mirrors left to right.", FLIP_TOP_BOTTOM: "mirrors top to bottom.", ROTATE_90: "turns 90° counter-clockwise.", ROTATE_180: "turns 180°.",
  ROTATE_270: "turns 270° counter-clockwise (90° clockwise).", TRANSPOSE: "swaps rows and columns, mirroring across the top-left to bottom-right diagonal.", TRANSVERSE: "mirrors across the other diagonal, top-right to bottom-left.",
};
const SHARP = { custom: [-1, -1, -1, -1, 9, -1, -1, -1, -1], pil: [-2, -2, -2, -2, 32, -2, -2, -2, -2].map(v => v / 16) };
const SOBX = [-1, 0, 1, -2, 0, 2, -1, 0, 1], SOBY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
const num = v => String(+(+v).toFixed(2));
const BOX = [
  { type: "range", key: "u", name: "upper", label: "first row", tip: "upper: the first row kept. Rows are counted from the top, starting at 0.", min: 0, max: 252, step: 1, value: 40 },
  { type: "range", key: "lo", name: "lower", label: "row to stop at", tip: "lower: slicing stops before this row, so it is not included.", min: 4, max: 256, step: 1, value: 150 },
  { type: "range", key: "l", name: "left", label: "first column", tip: "left: the first column kept, counted from the left edge.", min: 0, max: 252, step: 1, value: 64 },
  { type: "range", key: "r", name: "right", label: "column to stop at", tip: "right: slicing stops before this column, so it is not included.", min: 4, max: 256, step: 1, value: 176 },
];
const fixBox = s => { s.u = Math.min(s.u, 252); s.l = Math.min(s.l, 252); if (s.lo < s.u + 4) s.lo = s.u + 4; if (s.r < s.l + 4) s.r = s.l + 4; };

const GROUPS = [
  { id: "pixels", lab: "Labs 2.1.1 and 2.1.2", title: "Pixels and channels" },
  { id: "manipulation", lab: "Labs 2.2.1 and 2.2.2", title: "Basic manipulation" },
  { id: "intensity", lab: "Lab 2.3.2", title: "Histograms and intensity" },
  { id: "geometry", lab: "Labs 2.4.1 and 2.4.2", title: "Geometry and math" },
  { id: "filtering", lab: "Labs 2.5.1 and 2.5.2", title: "Spatial filtering" },
];

const OPS = [
/* ---------- pixels ---------- */
{ id: "grayscale", group: "pixels", title: "Grayscale", pixelwise: true,
  text: "A grayscale image keeps one number per pixel: how much light it carries. Both libraries compute it as a weighted sum, 0.299 R + 0.587 G + 0.114 B, giving green the most weight because our eyes are most sensitive to it. The array drops from three channels to one, so its shape goes from (256, 256, 3) to (256, 256).",
  look: "Hover the two images to compare a color pixel with its gray value. Then switch to a plain average and watch the red car and the blue sky change brightness.",
  panes: ["Input · RGB", "Output · grayscale"],
  controls: [{ type: "chips", key: "w", name: "weights", label: "how channels are combined", tip: "The library functions always use the weighted sum. The plain average is shown for comparison.", value: "luma", options: [["luma", "0.299 · 0.587 · 0.114"], ["avg", "Plain average"]] }],
  code: s => s.w === "luma"
    ? "«image_gray» = «ImageOps.grayscale»(«image»)   # Pillow\n«image_gray» = «cv2.cvtColor»(«image», «cv2.COLOR_BGR2GRAY»)   # OpenCV"
    : "«image_gray» = «image»«.mean»(«axis=2»)«.astype(np.uint8)»   # equal weights, for comparison",
  run(s, v) { v.show(0, SRC); v.show(1, s.w === "luma" ? GRAY : toGray(SRC, true)); } },

{ id: "channels", group: "pixels", title: "Color channels", pixelwise: true,
  text: "A color image is three grayscale layers stacked together: red, green and blue. Setting two of them to zero leaves only the third, and the bright areas show where that color is strong. OpenCV loads images in B, G, R order, so channel 0 is blue, and plotting an image without converting it swaps red and blue.",
  look: "Bright areas in the output are where the kept color is strong. Try each channel, then Plotted as BGR to see the classic OpenCV color mix-up.",
  panes: ["Input", "Output"],
  controls: [{ type: "chips", key: "ch", name: "channel", label: "which color to keep", tip: "Which channel survives. The other two are set to 0.", value: "red", options: [["red", "Red"], ["green", "Green"], ["blue", "Blue"], ["bgr", "Plotted as BGR"]] }],
  code: s => {
    if (s.ch === "bgr") return "«image» = «cv2.imread|OpenCV function that loads an image file as a NumPy array in B, G, R order.»(«\"image.png\"|The file to load.»)\n«plt.imshow|Matplotlib function that displays an array. It assumes R, G, B order.»(«image»)   # red and blue appear swapped";
    const name = { red: "image_red", green: "image_green", blue: "image_blue" }[s.ch], keep = { red: 2, green: 1, blue: 0 }[s.ch], names = ["blue", "green", "red"];
    const nt = `A copy that will keep only the ${s.ch} channel.`, lines = [`«${name}|${nt}» = «image»«.copy»()`];
    [0, 1, 2].filter(c => c !== keep).forEach(c => lines.push(`«${name}|${nt}»«[:, :, ${c}]|Every row, every column, channel ${c}. In OpenCV's B, G, R order that is ${names[c]}.» = «0|Setting the whole channel to 0 removes that color.»   # ${names[c]}`));
    return lines.join("\n");
  },
  run(s, v) {
    const o = clone(SRC);
    for (let p = 0; p < N * N; p++) { const j = p * 3; if (s.ch === "bgr") { o.d[j] = SRC.d[j + 2]; o.d[j + 2] = SRC.d[j]; } else { const keep = { red: 0, green: 1, blue: 2 }[s.ch]; for (let c = 0; c < 3; c++) if (c !== keep) o.d[j + c] = 0; } }
    v.show(0, SRC); v.show(1, o);
  } },

{ id: "quantize", group: "pixels", title: "Quantization", pixelwise: true,
  text: "Quantization reduces how many distinct colors an image uses. Pillow's quantize() splits all the colors into groups (median cut) and replaces every pixel with the average color of its group.",
  look: "With few colors the smooth sky breaks into bands. Drag colors down to 2 and back up to see how quickly the image recovers.",
  panes: ["Input", "Output"],
  controls: [{ type: "range", key: "k", name: "colors", label: "palette size", tip: "How many colors the palette may hold. Fewer colors means a smaller file and more visible banding.", min: 2, max: 64, step: 1, value: 8 }],
  code: s => "«image_q» = «image»«.quantize»(«colors=»‹k›)",
  run(s, v) { const q = quantize(SRC, s.k); v.show(0, SRC); v.show(1, q.img, `${q.colors} colors`); } },

/* ---------- manipulation ---------- */
{ id: "copy", group: "manipulation", title: "Copy or alias", pixelwise: true,
  text: "Assigning an array to a new name does not copy it. Both names point to the same pixels in memory, so changing one changes the other. This is called aliasing. Calling copy() makes an independent array that keeps the original values.",
  look: "The image panel now shows A and B. Run the extra line below to set A to zero, then check whether B went black too. Switch B to A.copy() in step 2 and run it again.",
  panes: ["A", "B"],
  controls: [
    { type: "chips", key: "mode", name: "B", label: "how B is made", tip: "B = A gives a second name for the same array. B = A.copy() makes a separate array.", value: "alias", options: [["alias", "B = A"], ["copy", "B = A.copy()"]] },
    { type: "buttons", where: "output", label: "Change A", items: [["Run A[:, :, :] = 0", s => s.zeroed = true], ["Undo that line", s => s.zeroed = false]] },
  ],
  code: s => `«A» = «np.array»(«image»)\n«B» = ‹mode›\n${s.zeroed ? "«A[:, :, :] = 0|Sets every pixel in every channel of A to 0 (black).»\n" : ""}«id»(«A») == «id»(«B»)   # ${s.mode === "alias" ? "True" : "False"}`,
  codeFmt: { mode: v => v === "alias" ? "A" : "A.copy()" },
  run(s, v) { const black = mk(N, N, 3); v.show(0, s.zeroed ? black : SRC); v.show(1, s.zeroed && s.mode === "alias" ? black : SRC); } },

{ id: "flip", group: "manipulation", title: "Flip and rotate by 90°",
  text: "Flipping and right-angle rotation only move pixels to new positions, so no values change and nothing is lost. Pillow does all of these with transpose(); OpenCV uses flip() with an axis code and rotate().",
  look: "Watch where the car and the striped tower end up. ROTATE_90 turns counter-clockwise; TRANSPOSE mirrors across the diagonal.",
  panes: ["Input", "Output"],
  controls: [{ type: "chips", key: "t", name: "method", label: "which transpose", tip: "", wide: true, value: "FLIP_LEFT_RIGHT", options: Object.keys(FLIPS).map(k => [k, k]) }],
  code: s => `«new_image» = «image»«.transpose»(‹t›)   # Pillow\n«new_image» = ${FLIPS[s.t].cv}   # OpenCV`,
  codeFmt: { t: v => "Image." + v },
  tipFor: { t: s => `Image.${s.t} ${FLIP_TIPS[s.t]}` },
  run(s, v) { const o = mk(N, N, 3), f = FLIPS[s.t].f; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const [sx, sy] = f(x, y), i = (y * N + x) * 3, j = (sy * N + sx) * 3; o.d[i] = SRC.d[j]; o.d[i + 1] = SRC.d[j + 1]; o.d[i + 2] = SRC.d[j + 2]; } v.show(0, SRC); v.show(1, o); } },

{ id: "crop", group: "manipulation", title: "Cropping", region: true,
  text: "Cropping keeps a rectangle and throws away the rest. On an array it is plain slicing, rows first and then columns. Pillow's crop() takes the same box, but in the order (left, upper, right, lower).",
  look: "The output is enlarged to fit its frame. Drag across the input image to draw a new box, or fine-tune it with the four values.",
  panes: ["Input · drag to select", "Output"],
  controls: BOX,
  code: s => "«crop» = «image»[‹u›:‹lo›, ‹l›:‹r›]   # array slicing: rows, then columns\n«crop» = «image»«.crop»((‹l›, ‹u›, ‹r›, ‹lo›))   # Pillow",
  run(s, v) { fixBox(s); const o = mk(s.r - s.l, s.lo - s.u, 3); for (let y = s.u; y < s.lo; y++) for (let x = s.l; x < s.r; x++) { const i = ((y - s.u) * o.w + (x - s.l)) * 3, j = (y * N + x) * 3; o.d[i] = SRC.d[j]; o.d[i + 1] = SRC.d[j + 1]; o.d[i + 2] = SRC.d[j + 2]; } v.show(0, SRC); v.box(s); v.show(1, o); } },

{ id: "pixels-edit", group: "manipulation", title: "Changing pixels", region: true, pixelwise: true,
  text: "Indexing can also write pixels. You can zero out channels inside a box, draw a filled shape with ImageDraw, or paste one image on top of another. These change the image in place, so the code works on a copy.",
  look: "Drag across the input to move the box. Hover inside the box to see the changed values.",
  panes: ["Input · drag to select", "Output"],
  controls: [{ type: "chips", key: "m", name: "operation", label: "what to do inside the box", tip: "Which edit to apply inside the box.", wide: true, value: "zero", options: [["zero", "Zero green and blue"], ["rect", "Draw a red rectangle"], ["paste", "Paste a mirrored crop"]] }, ...BOX],
  code: s => ({
    zero: "«array_sq» = «np.copy»(«array»)\n«array_sq»[‹u›:‹lo›, ‹l›:‹r›, «1:3|Channels 1 and 2. In a Pillow (R, G, B) array that is green and blue, so only red is left.»] = «0|Writes 0 into those channels for every pixel in the box.»",
    rect: "«image_draw» = «image»«.copy»()\n«ImageDraw.Draw»(«im=»«image_draw»)«.rectangle»(«xy=»[‹l›, ‹u›, ‹r›, ‹lo›], «fill=\"red\"»)",
    paste: "«crop» = «image»«.crop»((‹l›, ‹u›, ‹r›, ‹lo›))«.transpose»(«Image.FLIP_LEFT_RIGHT»)\n«new_image» = «image»«.copy»()\n«new_image»«.paste»(«crop», «box=»(‹l›, ‹u›))",
  })[s.m],
  run(s, v) {
    fixBox(s); const o = clone(SRC);
    for (let y = s.u; y < s.lo; y++) for (let x = s.l; x < s.r; x++) {
      const i = (y * N + x) * 3;
      if (s.m === "zero") { o.d[i + 1] = 0; o.d[i + 2] = 0; }
      else if (s.m === "rect") { o.d[i] = 255; o.d[i + 1] = 0; o.d[i + 2] = 0; }
      else { const j = (y * N + (s.r - 1 - (x - s.l))) * 3; o.d[i] = SRC.d[j]; o.d[i + 1] = SRC.d[j + 1]; o.d[i + 2] = SRC.d[j + 2]; }
    }
    v.show(0, SRC); v.box(s); v.show(1, o);
  } },

/* ---------- intensity ---------- */
{ id: "histogram", group: "intensity", title: "Histogram", single: true,
  text: "A histogram counts how many pixels have each intensity from 0 to 255. Its peaks show which tones dominate: dark images pile up on the left, bright ones on the right. A color image has one histogram per channel.",
  look: "Hover the chart to read the count for any intensity. The tall hump on the left is the dark buildings and road; the spread to the right is the sky.",
  panes: ["Input"], extras: [["hist", "Pixel count by intensity", true]],
  controls: [{ type: "chips", key: "m", name: "channels", label: "which histogram", tip: "One gray histogram, or one per color channel.", value: "gray", options: [["gray", "Grayscale"], ["rgb", "Red, green, blue"]] }],
  code: s => s.m === "gray"
    ? "«hist» = «cv2.calcHist»([«image_gray»], [«0|The channel to count. A grayscale image only has channel 0.»], «None», [«256»], [«0, 256»])"
    : "«for» «i|The channel index: 0 blue, 1 green, 2 red.», «col|The channel's name, used as the line color.» «in|Loop keyword.» «enumerate»((«'blue'|Channel 0 in OpenCV's B, G, R order.», «'green'|Channel 1.», «'red'|Channel 2.»)):\n    «hist» = «cv2.calcHist»([«image»], [«i|Which channel to count this time round the loop.»], «None», [«256»], [«0, 256»])",
  run(s, v) {
    if (s.m === "gray") { v.show(0, GRAY); drawHist(v.ex.hist, [{ h: hist(GRAY), color: css("--fg") }]); }
    else { v.show(0, SRC); drawHist(v.ex.hist, [["--ch-r", 0], ["--ch-g", 1], ["--ch-b", 2]].map(([c, ch]) => ({ h: hist(SRC, ch), color: css(c), mode: "line" }))); }
  } },

{ id: "negative", group: "intensity", title: "Image negative", pixelwise: true,
  text: "The negative reverses every intensity with s = 255 − r. Dark becomes bright and bright becomes dark, while mid-grays barely move. In medical images such as mammograms, the reversed version can make small bright details easier to examine.",
  look: "The curve shows the mapping: input r along the bottom, output s up the side. The histogram is the same shape, flipped left to right.",
  panes: ["Input · grayscale", "Output"], extras: [["curve", "s = T(r)"], ["hist", "Histogram · before (gray) and after (black)", true]],
  controls: [],
  code: () => "«img_neg» = «255|The highest value an 8-bit pixel can hold: L − 1, with L = 256 levels.» «-|Subtracts every pixel from 255, so 0 becomes 255 and 255 becomes 0.» «image»",
  run(s, v) { const lut = makeLut(r => 255 - r), o = applyLut(GRAY, lut); v.show(0, GRAY); v.show(1, o); drawCurve(v.ex.curve, lut); drawHist(v.ex.hist, [{ h: hist(GRAY), color: css("--faint") }, { h: hist(o), color: css("--fg"), mode: "line" }]); } },

{ id: "brightness", group: "intensity", title: "Brightness and contrast", pixelwise: true,
  text: "The transform g = α·f + β changes contrast and brightness: α scales the intensities apart, β shifts them all up or down. convertScaleAbs takes the absolute value before clipping to 0–255, so results that go negative come back as positive values instead of black.",
  look: "The curve is the mapping from input to output. A steeper line means more contrast; a higher line means brighter. Try the three examples from the lab.",
  panes: ["Input · grayscale", "Output"], extras: [["curve", "s = T(r)"], ["hist", "Histogram · before (gray) and after (black)", true]],
  controls: [
    { type: "presets", label: "Examples from the lab", wide: true, items: [["Brighter: α 1, β 100", { a: 1, b: 100 }], ["More contrast: α 2, β 0", { a: 2, b: 0 }], ["Both: α 3, β −200", { a: 3, b: -200 }]] },
    { type: "range", key: "a", name: "alpha", label: "contrast", tip: "alpha multiplies every pixel. Above 1 spreads the tones apart (more contrast); below 1 squeezes them together.", min: 0, max: 3, step: 0.1, value: 1, fmt: v => v.toFixed(1) },
    { type: "range", key: "b", name: "beta", label: "brightness", tip: "beta is added to every pixel after scaling. Positive values brighten, negative values darken.", min: -200, max: 200, step: 5, value: 100 },
  ],
  code: s => "«new_image» = «cv2.convertScaleAbs»(«image», «alpha=|Contrast factor.»‹a›, «beta=|Brightness offset.»‹b›)",
  run(s, v) { const lut = makeLut(r => Math.abs(s.a * r + s.b)), o = applyLut(GRAY, lut); v.show(0, GRAY); v.show(1, o); drawCurve(v.ex.curve, lut); drawHist(v.ex.hist, [{ h: hist(GRAY), color: css("--faint") }, { h: hist(o), color: css("--fg"), mode: "line" }]); } },

{ id: "equalize", group: "intensity", title: "Histogram equalization", pixelwise: true,
  text: "Histogram equalization raises contrast automatically by spreading the intensities across the full 0–255 range. Each level is mapped through the cumulative histogram, which pulls crowded tones apart.",
  look: "The input is a washed-out copy of the image. Compare the two histograms: the gray one is squeezed into the middle, the black one is spread across the whole range.",
  panes: ["Input · grayscale", "Output"], extras: [["curve", "s = T(r)"], ["hist", "Histogram · before (gray) and after (black)", true]],
  controls: [{ type: "chips", key: "src", name: "image", label: "which input", tip: "The image passed in. The washed-out copy only uses values from about 92 to 174, which makes the effect easy to see.", value: "low", options: [["low", "Washed-out copy"], ["orig", "Original grayscale"]] }],
  code: () => "«new_image» = «cv2.equalizeHist»(‹src›)",
  codeFmt: { src: v => v === "low" ? "low_contrast" : "image_gray" },
  run(s, v) {
    const inp = s.src === "low" ? applyLut(GRAY, makeLut(r => 92 + r * 0.32)) : GRAY, h = hist(inp);
    let cdf = 0, min = 0; const c = new Float64Array(256); for (let i = 0; i < 256; i++) { cdf += h[i]; c[i] = cdf; if (!min && cdf) min = cdf; }
    const lut = makeLut(r => Math.round((c[r] - min) * 255 / (N * N - min || 1))), o = applyLut(inp, lut);
    v.show(0, inp); v.show(1, o); drawCurve(v.ex.curve, lut); drawHist(v.ex.hist, [{ h, color: css("--faint") }, { h: hist(o), color: css("--fg"), mode: "line" }]);
  } },

{ id: "threshold", group: "intensity", title: "Thresholding", pixelwise: true,
  text: "Thresholding splits a grayscale image into two levels. Pixels above the threshold get the maximum value and the rest become 0, which is the simplest way to separate an object from its background. TRUNC caps bright pixels at the threshold instead, and Otsu's method picks the threshold for you from the histogram.",
  look: "The dashed line on the histogram is the threshold. Everything to its right turns white. Pick OTSU to see where the automatic method puts it.",
  panes: ["Input · grayscale", "Output"], extras: [["hist", "Input histogram and threshold", true]],
  controls: [
    { type: "chips", key: "t", name: "type", label: "threshold type", tip: "", value: "BINARY", options: [["BINARY", "BINARY"], ["BINARY_INV", "BINARY_INV"], ["TRUNC", "TRUNC"], ["OTSU", "OTSU"]] },
    { type: "range", key: "T", name: "thresh", label: "threshold", tip: "thresh: pixels greater than this value pass. Ignored when OTSU is used.", min: 0, max: 255, step: 1, value: 90, disabled: s => s.t === "OTSU" },
  ],
  code: s => s.t === "OTSU"
    ? `«ret», «otsu» = «cv2.threshold»(«image», «0|Ignored: Otsu's method computes its own threshold.», «255|maxval: the value given to pixels above the threshold.», ‹t›)   # ret = ${s._otsu ?? ""}`
    : "«ret», «new_image» = «cv2.threshold»(«image», ‹T›, «255|maxval: the value given to pixels above the threshold.», ‹t›)",
  codeFmt: { t: v => "cv2.THRESH_" + v },
  tipFor: { t: s => ({ BINARY: "THRESH_BINARY: above the threshold becomes 255, everything else 0.", BINARY_INV: "THRESH_BINARY_INV: the reverse, above becomes 0 and everything else 255.", TRUNC: "THRESH_TRUNC: values above the threshold are cut down to it; darker pixels are unchanged.", OTSU: "THRESH_OTSU: picks the threshold that best separates the histogram into two groups, then applies BINARY." })[s.t] },
  run(s, v) {
    const h = hist(GRAY), T = s.t === "OTSU" ? (s._otsu = otsu(h)) : s.T;
    const lut = makeLut(r => s.t === "TRUNC" ? Math.min(r, T) : s.t === "BINARY_INV" ? (r > T ? 0 : 255) : (r > T ? 255 : 0));
    v.show(0, GRAY); v.show(1, applyLut(GRAY, lut)); drawHist(v.ex.hist, [{ h, color: css("--fg") }], { line: T });
  } },

/* ---------- geometry ---------- */
{ id: "scaling", group: "geometry", title: "Scaling", nativeOut: true,
  text: "Resizing changes how many pixels the image has. Shrinking throws detail away, and enlarging has to invent new pixels by interpolation. Nearest neighbor copies the closest pixel; linear and cubic blend the neighbors for smoother results.",
  look: "The output is drawn at the same pixel size as the input, so anything wider or taller than 256 is cut off at the frame. Set fx to 4 and compare INTER_NEAREST with INTER_CUBIC.",
  panes: ["Input", "Output · same pixel size"],
  controls: [
    { type: "range", key: "fx", name: "fx", label: "width factor", tip: "fx multiplies the width. 2 doubles it, 0.5 halves it.", min: 0.25, max: 4, step: 0.25, value: 2, fmt: v => v.toFixed(2) },
    { type: "range", key: "fy", name: "fy", label: "height factor", tip: "fy multiplies the height.", min: 0.25, max: 4, step: 0.25, value: 1, fmt: v => v.toFixed(2) },
    { type: "chips", key: "i", name: "interpolation", label: "how new pixels are made", tip: "", wide: true, value: "CUBIC", options: [["NEAREST", "INTER_NEAREST"], ["LINEAR", "INTER_LINEAR"], ["CUBIC", "INTER_CUBIC"]] },
  ],
  code: s => "«new_image» = «cv2.resize»(«image», «None |dsize. None means the output size is worked out from fx and fy instead.», «fx=»‹fx›, «fy=»‹fy›, «interpolation=»‹i›)",
  codeFmt: { i: v => "cv2.INTER_" + v, fx: num, fy: num },
  tipFor: { i: s => ({ NEAREST: "INTER_NEAREST copies the single closest source pixel. Fast, but blocky when enlarging.", LINEAR: "INTER_LINEAR blends the 4 nearest pixels by distance.", CUBIC: "INTER_CUBIC fits a smooth curve through the 16 nearest pixels. Slower, smoothest when enlarging." })[s.i] },
  run(s, v) { const nw = Math.max(1, Math.round(N * s.fx)), nh = Math.max(1, Math.round(N * s.fy)); v.show(0, SRC); v.show(1, resize(SRC, nw, nh, s.i)); } },

{ id: "translation", group: "geometry", title: "Translation",
  text: "Translation shifts the image by tx pixels across and ty pixels down. OpenCV writes the shift as a 2 × 3 matrix M and applies it with warpAffine. The area the image leaves behind fills with black, and anything pushed past the edge is cut off.",
  look: "The matrix below shows M with your values in its last column. Negative values move the image left or up.",
  panes: ["Input", "Output"], extras: [["matrix", "M"]],
  controls: [
    { type: "range", key: "tx", name: "tx", label: "shift right", tip: "tx: horizontal shift in pixels. Positive moves the image right.", min: -128, max: 128, step: 1, value: 60 },
    { type: "range", key: "ty", name: "ty", label: "shift down", tip: "ty: vertical shift in pixels. Positive moves the image down.", min: -128, max: 128, step: 1, value: 30 },
  ],
  code: s => "«M» = «np.float32»([[«1|Row 1 of the identity part: x is kept as it is.», «0|No y in the new x: the image is not sheared or rotated.», ‹tx›], [«0|No x in the new y.», «1|Row 2 of the identity part: y is kept as it is.», ‹ty›]])\n«new_image» = «cv2.warpAffine»(«image», «M», «(cols, rows)»)",
  run(s, v) { const M = [1, 0, s.tx, 0, 1, s.ty]; v.show(0, SRC); v.show(1, warp(SRC, M, N, N)); renderMatrix(v.ex.matrix, M, 0); } },

{ id: "rotation", group: "geometry", title: "Rotation",
  text: "getRotationMatrix2D builds the matrix for a rotation about a center point, with an optional scale. Positive angles turn the image counter-clockwise. warpAffine then looks up where each output pixel came from and blends the nearest input pixels.",
  look: "The corners clip and the uncovered areas turn black. Lower the scale to fit the whole rotated image inside the frame.",
  panes: ["Input", "Output"], extras: [["matrix", "M"]],
  controls: [
    { type: "range", key: "a", name: "angle", label: "degrees", tip: "angle: rotation in degrees. Positive turns counter-clockwise.", min: -180, max: 180, step: 1, value: 45 },
    { type: "range", key: "sc", name: "scale", label: "zoom", tip: "scale: zoom applied with the rotation. 1 keeps the size; 0.7 makes room for the corners.", min: 0.25, max: 2, step: 0.05, value: 1, fmt: v => v.toFixed(2) },
  ],
  code: s => "«M» = «cv2.getRotationMatrix2D»(«center=»(«cols // 2 - 1|x of the center: the middle column.», «rows // 2 - 1|y of the center: the middle row.»), «angle=»‹a›, «scale=»‹sc›)\n«new_image» = «cv2.warpAffine»(«image», «M», «(cols, rows)»)",
  codeFmt: { sc: num },
  run(s, v) {
    const t = s.a * Math.PI / 180, al = s.sc * Math.cos(t), be = s.sc * Math.sin(t), cx = N / 2 - 1, cy = N / 2 - 1;
    const M = [al, be, (1 - al) * cx - be * cy, -be, al, be * cx + (1 - al) * cy];
    v.show(0, SRC); v.show(1, warp(SRC, M, N, N)); renderMatrix(v.ex.matrix, M, 3);
  } },

{ id: "arrays", group: "geometry", title: "Array arithmetic", pixelwise: true,
  text: "An image is an array, so arithmetic works on every pixel at once. With NumPy's uint8 type, a value past 255 wraps around to 0 instead of stopping at 255, and a value below 0 wraps to 255. Clipping to 0–255 keeps bright areas bright.",
  look: "With wrap-around, the brightest parts (windows, sun, lane markings) turn dark. Switch to clipping and hover a bright pixel to compare.",
  panes: ["Input", "Output"],
  controls: [
    { type: "chips", key: "op", name: "operation", label: "what to do", tip: "", value: "add", options: [["add", "Add a constant"], ["mul", "Multiply"], ["noise", "Add noise"]] },
    { type: "chips", key: "ov", name: "overflow", label: "past 0 or 255", tip: "", value: "wrap", options: [["wrap", "uint8 wraps around"], ["clip", "Clip to 0–255"]] },
    { type: "range", key: "add", name: "value", label: "constant", tip: "The number added to every pixel in every channel.", min: -128, max: 128, step: 1, value: 20, show: s => s.op === "add" },
    { type: "range", key: "mul", name: "factor", label: "multiplier", tip: "Every pixel is multiplied by this number.", min: 0, max: 10, step: 0.5, value: 1.5, fmt: v => v.toFixed(1), show: s => s.op === "mul" },
    { type: "range", key: "sig", name: "scale", label: "noise σ", tip: "The standard deviation of the noise: how far a typical random value is from 0.", min: 0, max: 60, step: 1, value: 20, show: s => s.op === "noise" },
  ],
  code: s => {
    const w = s.ov === "wrap";
    if (s.op === "add") return w ? "«new_image» = «image» «+|Adds the value to every element. With uint8, results past 255 wrap around to 0.» ‹add›" : "«new_image» = «np.clip»(«image»«.astype(int)» + ‹add›, «0|Lower limit: anything below 0 becomes 0.», «255|Upper limit: anything above 255 becomes 255.»)«.astype(np.uint8)»";
    if (s.op === "mul") return w ? "«new_image» = (‹mul› «*|Multiplies every element.» «image»)«.astype(np.uint8)»" : "«new_image» = «np.clip»(‹mul› * «image», «0|Lower limit.», «255|Upper limit: anything above 255 becomes 255.»)«.astype(np.uint8)»";
    return "«noise» = «np.random.normal»(«0|The mean of the noise: on average it adds nothing.», ‹sig›, («rows», «cols», «3|One noise value per channel.»))" + (w ? "«.astype(np.uint8)»\n«new_image» = «image» + «noise»" : "\n«new_image» = «np.clip»(«image» + «noise», «0|Lower limit: anything below 0 becomes 0.», «255|Upper limit: anything above 255 becomes 255.»)«.astype(np.uint8)»");
  },
  codeFmt: { mul: num },
  tipFor: { op: () => "Which arithmetic to apply to every pixel.", ov: s => s.ov === "wrap" ? "uint8 arithmetic is modulo 256: 250 + 20 gives 14, and 10 − 20 gives 246." : "np.clip limits results to 0–255: 250 + 20 gives 255, and 10 − 20 gives 0." },
  run(s, v) {
    const o = mk(N, N, 3), r = rng(5), w = s.ov === "wrap";
    for (let i = 0; i < SRC.d.length; i++) {
      const x = SRC.d[i]; let y;
      if (s.op === "add") y = x + s.add; else if (s.op === "mul") y = Math.trunc(s.mul * x); else { const n = gaussR(r) * s.sig; y = w ? x + Math.trunc(n) : x + n; }
      o.d[i] = w ? (((Math.round(y) % 256) + 256) % 256) : y;
    }
    v.show(0, SRC); v.show(1, o);
  } },

{ id: "svd", group: "geometry", title: "Matrix operations: SVD", pixelwise: true,
  text: "Singular value decomposition writes an image as a sum of simple layers, ordered by how much each contributes. Keeping only the first k layers rebuilds an approximation: a handful capture the large shapes, and later ones add fine detail. It runs here on a 128 × 128 grayscale copy.",
  look: "The bar chart shows each layer's singular value; the black bars are the ones you kept. Notice how fast they drop: most of the image lives in the first few.",
  panes: ["Input · 128 × 128", "Rank-k approximation"], extras: [["sigma", "Singular values (log scale), kept in black", true], ["stat", "Numbers stored"]],
  controls: [{ type: "range", key: "k", name: "k", label: "layers kept", tip: "k: how many layers (singular values) to keep, out of 128.", min: 1, max: 128, step: 1, value: 12 }],
  code: s => "«U», «s», «V» = «np.linalg.svd»(«image», «full_matrices=True»)\n«S» = «np.diag»(«s»)\n«image_k» = «U»[«:|All rows.», «:|Up to k: the first k columns.»‹k›] «@» «S»[:‹k›, :‹k›] «@» «V»[:‹k›, «:|All columns.»]",
  run(s, v) {
    const g = down2(GRAY); if (!SVD) SVD = svdPrep(g);
    v.show(0, g); v.show(1, svdRecon(SVD, s.k)); drawSigma(v.ex.sigma, SVD.sig, s.k);
    const kept = s.k * (2 * 128 + 1);
    v.ex.stat.innerHTML = `${kept.toLocaleString()} numbers <small>vs 16,384 pixels · ${Math.round(kept / 163.84)}%</small>`;
  } },

/* ---------- filtering ---------- */
{ id: "mean", group: "filtering", title: "Mean filter", pixelwise: true,
  text: "A mean filter replaces each pixel with the average of its neighborhood, defined by a kernel of equal weights. Averaging cancels random noise, but it also blurs edges, and a larger kernel does more of both.",
  look: "Raise the kernel size and watch the noise fade while the window edges soften. The grid shows the kernel: every cell has the same weight.",
  panes: ["Input + noise", "Filtered"], extras: [["kernel", ""]],
  controls: [
    { type: "range", key: "sig", name: "noise σ", label: "noise strength", tip: "The standard deviation of the noise added before filtering.", min: 0, max: 40, step: 1, value: 15 },
    { type: "range", key: "k", name: "k", label: "kernel size", tip: "The kernel is k × k pixels. Bigger averages over more neighbors.", min: 3, max: 11, step: 2, value: 5, fmt: v => `${v} × ${v}` },
  ],
  code: s => `«noise» = «np.random.normal»(«0|The mean of the noise.», ‹sig›, («rows», «cols», «3|One noise value per channel.»))\n«noisy_image» = «image» + «noise»\n«kernel» = «np.ones»((‹k›, ‹k›)) / «${s.k * s.k}|Dividing by the number of weights (k × k) makes them add up to 1, so the overall brightness stays the same.»\n«image_filtered» = «cv2.filter2D»(«src=»«noisy_image», «ddepth=-1», «kernel=»«kernel»)`,
  run(s, v) { const noisy = addNoise(SRC, s.sig, 3), k = new Array(s.k * s.k).fill(1 / (s.k * s.k)); v.show(0, noisy); v.show(1, fromF(noisy, conv(noisy, k, s.k, s.k))); renderKernels(v.ex.kernel, [{ k, kw: s.k, kh: s.k, dec: 3, label: `Kernel · each weight is 1/${s.k * s.k}` }]); } },

{ id: "gaussian", group: "filtering", title: "Gaussian blur", pixelwise: true,
  text: "A Gaussian kernel gives near neighbors more weight than distant ones, so it removes noise while blurring edges less than a plain average. Sigma sets how fast the weights fall off from the center, and the kernel size limits how far they reach.",
  look: "The kernel grid shows the weights: darker cells count more. A small sigma in a big kernel wastes the outer cells; a big sigma in a small kernel gets cut off.",
  panes: ["Input + noise", "Filtered"], extras: [["kernel", ""]],
  controls: [
    { type: "range", key: "k", name: "ksize", label: "kernel size", tip: "ksize: the kernel's width and height. It must be odd.", min: 3, max: 15, step: 2, value: 11, fmt: v => `${v} × ${v}` },
    { type: "range", key: "sg", name: "sigma", label: "spread", tip: "sigmaX and sigmaY: the standard deviation of the Gaussian. Bigger spreads the weight further and blurs more.", min: 0.5, max: 10, step: 0.5, value: 4, fmt: v => v.toFixed(1) },
  ],
  code: s => "«image_filtered» = «cv2.GaussianBlur»(«noisy_image», (‹k›, ‹k›), «sigmaX=»‹sg›, «sigmaY=»‹sg›)",
  codeFmt: { sg: num },
  run(s, v) {
    const noisy = addNoise(SRC, 15, 3), g = gaussKernel(s.k, s.sg), k2 = []; for (let j = 0; j < s.k; j++) for (let i = 0; i < s.k; i++) k2.push(g[j] * g[i]);
    v.show(0, noisy); v.show(1, fromF(noisy, convSep(noisy, g))); renderKernels(v.ex.kernel, [{ k: k2, kw: s.k, kh: s.k, dec: 3, label: "Kernel weights (darker counts more)" }]);
  } },

{ id: "sharpen", group: "filtering", title: "Sharpening", pixelwise: true,
  text: "Sharpening adds the difference between a pixel and its neighbors back into the image, which exaggerates edges and fine texture. The kernel's weights add up to 1, so flat areas keep their brightness.",
  look: "Hover a window edge to see the values pushed apart. Pillow's SHARPEN uses the same idea with a gentler center weight.",
  panes: ["Input", "Sharpened"], extras: [["kernel", ""]],
  controls: [{ type: "chips", key: "k", name: "kernel", label: "which kernel", tip: "", value: "custom", options: [["custom", "Lab kernel (center 9)"], ["pil", "ImageFilter.SHARPEN"]] }],
  code: s => s.k === "custom"
    ? "«kernel» = «np.array |Writes the kernel out by hand.»([[«-1|Each neighbor is subtracted once.», -1, -1],\n                   [-1,  «9|The center pixel counts 9 times. 9 − 8 neighbors = 1, so flat areas are unchanged.», -1],\n                   [-1, -1, -1]])\n«sharpened» = «cv2.filter2D»(«image», «-1», «kernel»)"
    : "«sharpened» = «image»«.filter»(«ImageFilter.SHARPEN»)",
  tipFor: { k: s => s.k === "custom" ? "The 3 × 3 kernel used in the lab: center 9, all eight neighbors −1." : "Pillow's built-in SHARPEN: center 32, neighbors −2, divided by 16. A milder effect." },
  run(s, v) { const k = SHARP[s.k]; v.show(0, SRC); v.show(1, fromF(SRC, conv(SRC, k, 3, 3))); renderKernels(v.ex.kernel, [{ k, kw: 3, kh: 3, dec: 3, label: "Kernel" }]); } },

{ id: "sobel", group: "filtering", title: "Edges with Sobel", pixelwise: true,
  text: "Edges are where intensity changes quickly. The Sobel kernels estimate that change horizontally (dx) and vertically (dy), and combining the two shows edges in every direction.",
  look: "In the dx and dy views, mid-gray means no change, while white and black mean change in opposite directions. dx picks up the tower's vertical stripes; dy picks up the rooftops and the road.",
  panes: ["Input · grayscale", "Output"], extras: [["kernel", ""]],
  controls: [{ type: "chips", key: "d", name: "direction", label: "which gradient", tip: "", value: "mag", options: [["x", "dx = 1"], ["y", "dy = 1"], ["mag", "Combined"]] }],
  code: s => s.d === "x"
    ? "«grad_x» = «cv2.Sobel»(«src=»«img_gray», «ddepth=cv2.CV_16S», «dx=1|First derivative across the width: change from left to right.», «dy=0|No derivative down the height.», «ksize=3»)"
    : s.d === "y"
    ? "«grad_y» = «cv2.Sobel»(«src=»«img_gray», «ddepth=cv2.CV_16S», «dx=0|No derivative across the width.», «dy=1|First derivative down the height: change from top to bottom.», «ksize=3»)"
    : "«abs_grad_x» = «cv2.convertScaleAbs»(«grad_x»)\n«abs_grad_y» = «cv2.convertScaleAbs»(«grad_y»)\n«grad» = «cv2.addWeighted»(«abs_grad_x», «0.5», «abs_grad_y», «0.5», «0|gamma: a constant added at the end. 0 adds nothing.»)",
  tipFor: { d: s => ({ x: "dx = 1: the horizontal gradient, which highlights vertical edges.", y: "dy = 1: the vertical gradient, which highlights horizontal edges.", mag: "Both gradients as absolute values, averaged together." })[s.d] },
  run(s, v) {
    const gx = conv(GRAY, SOBX, 3, 3), gy = conv(GRAY, SOBY, 3, 3), o = mk(N, N, 1);
    if (s.d === "mag") for (let i = 0; i < o.d.length; i++) o.d[i] = Math.round(0.5 * Math.min(255, Math.abs(gx[i])) + 0.5 * Math.min(255, Math.abs(gy[i])));
    else { const g = s.d === "x" ? gx : gy; let m = 1; for (const val of g) m = Math.max(m, Math.abs(val)); for (let i = 0; i < o.d.length; i++) o.d[i] = 127.5 + 127.5 * g[i] / m; }
    v.show(0, GRAY); v.show(1, o);
    renderKernels(v.ex.kernel, s.d === "x" ? [{ k: SOBX, kw: 3, kh: 3, label: "dx kernel" }] : s.d === "y" ? [{ k: SOBY, kw: 3, kh: 3, label: "dy kernel" }] : [{ k: SOBX, kw: 3, kh: 3, label: "dx kernel" }, { k: SOBY, kw: 3, kh: 3, label: "dy kernel" }]);
  } },

{ id: "median", group: "filtering", title: "Median filter", pixelwise: true,
  text: "A median filter replaces each pixel with the median of its neighborhood instead of the mean. Isolated black and white specks (salt-and-pepper noise) are outliers, so the median ignores them and edges stay sharp.",
  look: "The specks vanish while the window edges stay crisp. Switch to the mean filter of the same size: the specks smear into gray blotches instead.",
  panes: ["Input + salt and pepper", "Filtered"],
  controls: [
    { type: "range", key: "amt", name: "noise", label: "share of pixels hit", tip: "The share of pixels set to pure black or white before filtering.", min: 0, max: 30, step: 1, value: 8, fmt: v => v + "%" },
    { type: "chips", key: "k", name: "ksize", label: "kernel size", tip: "ksize: the neighborhood is ksize × ksize. It must be odd.", value: 5, options: [[3, "3"], [5, "5"], [7, "7"]] },
    { type: "chips", key: "f", name: "filter", label: "median or mean", tip: "", value: "median", options: [["median", "Median"], ["mean", "Mean, same size"]] },
  ],
  code: s => s.f === "median" ? "«filtered_image» = «cv2.medianBlur»(«image», ‹k›)" : "«filtered_image» = «cv2.blur»(«image», (‹k›, ‹k›))",
  tipFor: { f: s => s.f === "median" ? "medianBlur: the middle value of the neighborhood. Extreme specks never end up in the middle." : "blur: the plain average. Every speck pulls the average up or down." },
  run(s, v) { const noisy = saltPepper(GRAY, s.amt / 100, 9); v.show(0, noisy); v.show(1, s.f === "median" ? medianFilter(noisy, s.k) : fromF(noisy, conv(noisy, new Array(s.k * s.k).fill(1 / (s.k * s.k)), s.k, s.k))); } },
];

