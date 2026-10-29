# PixOps 101

**Image Processing Fundamentals: an interactive walkthrough of Pillow and OpenCV operations.**

I built PixOps 101 from **Module 2 of the *Introduction to Computer Vision and Image Processing* course** (IBM Skills Network, CV0101EN). It covers the operations from that module's labs, one page each:

| Labs | Topic | Operations |
| --- | --- | --- |
| 2.1.1, 2.1.2 | Images with Pillow and OpenCV | Grayscale, color channels, quantization |
| 2.2.1, 2.2.2 | Basic image manipulation | Copy vs. alias, flip and rotate by 90°, cropping, changing pixels |
| 2.3.2 | Histograms and intensity transformations | Histogram, negative, brightness and contrast, histogram equalization, thresholding |
| 2.4.1, 2.4.2 | Geometric transformations | Scaling, translation, rotation, array arithmetic, SVD |
| 2.5.1, 2.5.2 | Spatial filtering | Mean filter, Gaussian blur, sharpening, Sobel edges, median filter |

## How each page works

1. **The operation**: what it does, in one paragraph.
2. **The code**: the Python call from the lab. Hover or tap any underlined part for a tooltip explaining it. The highlighted values are editable in place, with a reset button. Where Pillow and OpenCV write the operation differently, tabs switch between them and the output follows the tab. Run shows the result.
3. **The output**: charts, kernels or matrices, on the pages where they add something. Simpler operations finish at step 2.

The image has its own panel. Use the built-in sample scene or upload your own; it is cropped to 256 × 256 and never leaves the browser. The image math is reimplemented in plain JavaScript, so everything runs live with no server or Python install.

Styled with Carbon Design System v11 tokens (White and Gray 100 themes), with light and dark modes.

## Project layout

```
src/shell.html       markup and CSS (Carbon tokens, layout, components); /*JS*/ marks where the script goes
src/js/helpers.js    image math (convolution, warps, resize, quantize, SVD) and chart drawing
src/js/ops.js        the operations: text, code templates, code explanations, run functions
src/js/overrides.js  Pillow / OpenCV variants of the operations that differ between libraries
src/js/app.js        wizard, side nav, tooltips, editable code, image panel, theme toggle
build.py             concatenates everything into one self-contained page
docs/index.html      the built page (GitHub Pages can serve this folder)
```

## Build

```
python3 build.py
```

Then open `docs/index.html` in a browser. To publish with GitHub Pages, set the source to the `docs/` folder on the `main` branch.

## Code templates

In `ops.js`, a code template marks explained tokens and editable values:

- `«text»` is a token explained by its entry in `TIPS`
- `«text|explanation»` is a token with its own explanation
- `‹key›` is an editable value bound to the operation's state (`op.s[key]`)

## Credits

The operations, their order and the Python calls follow the Module 2 labs of *Introduction to Computer Vision and Image Processing* by the IBM Skills Network (lab authors Joseph Santarcangelo and Nayef Abou Tayoun). The lab notebooks and their images are not included here. The explanations, sample image and JavaScript implementation in this repository are original to this project.
