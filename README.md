# Pixel Ops

An interactive walkthrough of 22 image-processing operations from the computer vision labs 2.1–2.5 (Pillow and OpenCV). Each operation is a short wizard:

1. **The operation**: what it does, in one paragraph.
2. **The code**: the Python call from the lab. Hover or tap any underlined part for a tooltip; the highlighted values are editable in place, with a reset button. Where Pillow and OpenCV differ, tabs switch between them and the output follows.
3. **The output**: charts, kernels or matrices where they add something (some operations finish at step 2).

The image sits in its own panel. You can use the built-in sample scene or upload your own; it is cropped to 256 × 256 and never leaves the browser. The image math is reimplemented in plain JavaScript, so everything runs live with no server.

Styled with Carbon Design System v11 tokens (White and Gray 100 themes), with light and dark modes.

## Layout

```
src/shell.html       markup and CSS (Carbon tokens, layout, components); /*JS*/ marks where the script goes
src/js/helpers.js    image math (convolution, warps, resize, quantize, SVD) and chart drawing
src/js/ops.js        the 22 operations: text, code templates, code explanations, run functions
src/js/overrides.js  Pillow / OpenCV variants of the operations that differ between libraries
src/js/app.js        wizard, side nav, tooltips, editable code, image panel, theme toggle
build.py             concatenates everything into one self-contained page
docs/index.html      built page (GitHub Pages can serve this folder)
```

## Build

```
python3 build.py
```

Then open `docs/index.html` in a browser. To publish with GitHub Pages, set the source to the `docs/` folder on the main branch.

## Code templates

In `ops.js`, a code template marks explained tokens and editable values:

- `«text»` is a token explained by its entry in `TIPS`
- `«text|explanation»` is a token with its own explanation
- `‹key›` is an editable value bound to the operation's state (`op.s[key]`)
