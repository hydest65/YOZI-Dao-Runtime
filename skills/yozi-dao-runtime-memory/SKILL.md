---
name: yozi-dao-runtime-memory
description: Project memory for the YOZI Dao Runtime homepage. Use when continuing work on the YOZI homepage, symbolic sand garden animation, Code Hermit figure, React + Tailwind implementation, or when the user asks to recall prior design and engineering decisions for this project.
---

# YOZI Dao Runtime Memory

Use this skill to resume work on the YOZI Dao Runtime homepage without rediscovering the prior implementation.

## Project Shape

- Workspace: `D:\Users\Hydest\Documents\GitHub\YOZI Dao Runtime`
- Stack: Vite, React, Tailwind CSS, Canvas 2D.
- Main app files:
  - `src/App.jsx`
  - `src/components/YoziSymbolicOrganism.jsx`
  - `src/styles.css`
  - `vite.config.js`
- Primary local URL: `http://localhost:5173`
- Useful commands:
  - `npm run dev -- --port 5173`
  - `npm run build`

## Current Homepage

The homepage is a minimal hero for:

- Title: `YOZI Dao Runtime`
- Subtitle: `Cultivate the Invisible System`
- Boot text: `yozi.runtime.boot()`

The visual style should remain poetic, restrained, warm, and premium: Song dynasty minimalism plus a code-metaphysics interface. Avoid cyberpunk neon, Matrix rain, noisy particles, concrete imagery, mountains, temples, fantasy costumes, anime styling, or cute cartoon treatments.

## Symbol Sand Garden

`YoziSymbolicOrganism` renders a lightweight Canvas animation:

- Symbolic center near lower middle.
- Rake-like ellipses and sparse horizontal sand paths.
- Text/code symbols as glyph stones rather than circles.
- Eight-direction Bagua-inspired orientation.
- Subtle breathing via opacity and scale.
- Pointer interaction that gently repels or leans nearby nodes.
- Scroll dispersal into a sparse symbol field.
- `prefers-reduced-motion` support.

Important symbols include:

`☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷ { } [ ] ( ) < > / \ | :: => -> 0 1 dao qi void inner branch runtime kernel breath fate 道 枝 玄 息 观 空 象`

## Code Hermit

A small secondary figure was added inside the same Canvas layer:

- Minimal ASCII/SVG-style line figure.
- Seated near the symbolic sand garden, anchored close to the center field.
- No robes, face details, religious costume, fantasy design, or realistic illustration.
- Made from simple Canvas lines and code-like marks such as `::` and `>_`.
- Includes a small terminal and a small cup.
- Gentle breathing motion.
- Head subtly turns toward the cursor.
- Occasionally shows one tiny terminal line:
  - `> breath.sync = true`
  - `> observe(sand)`
  - `> stillness.log()`
  - `> cultivation.progress += 0.01`

Keep it secondary to the symbolic garden.

## Responsive Notes

Mobile layout was checked at `390x844`. Keep the symbolic center low enough to avoid colliding with the subtitle:

- Compact center Y: about `height * 0.68`
- Compact radius: about `min(width, height) * 0.26`

Desktop and mobile browser checks had no console errors.

## Validation History

- `npm install` completed successfully after network access was allowed.
- `npm run build` passes.
- Browser verification on `http://localhost:5173` showed:
  - Correct title: `YOZI Dao Runtime`
  - No console errors.
  - Desktop composition works.
  - Mobile composition adjusted after detecting subtitle overlap.

## Future Work Rules

- Keep the animation Canvas-based and lightweight.
- Do not introduce heavy image assets, WebGL, large DOM particle systems, or blur-heavy effects.
- Preserve `prefers-reduced-motion`.
- Treat the animation as a background; hero text must remain readable.
- When changing visual placement, verify both desktop and mobile screenshots.
