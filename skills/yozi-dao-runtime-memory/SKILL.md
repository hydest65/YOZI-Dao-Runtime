---
name: yozi-dao-runtime-memory
description: Project memory for the YOZI Dao Runtime homepage. Use when continuing work on the YOZI homepage, TypeScript hero component, symbolic ink-landscape traveler scene, code-formed mountains, long road animation, cranes, mist, React + Tailwind implementation, or when the user asks to recall prior design and engineering decisions for this project.
---

# YOZI Dao Runtime Memory

Use this skill to resume work on the YOZI Dao Runtime homepage without rediscovering the prior implementation.

## Project Shape

- Workspace: `D:\Users\Hydest\Documents\GitHub\YOZI Dao Runtime`
- Stack: Vite, React, TypeScript, Tailwind CSS, Canvas 2D.
- Main app files:
  - `src/App.tsx`
  - `src/components/YoziHero.tsx`
  - `src/main.tsx`
  - `src/styles.css`
  - `vite.config.js`
- Primary local URL: `http://localhost:5173`
- Useful commands:
  - `npm run dev -- --port 5173`
  - `npm run typecheck`
  - `npm run build`

## Current Homepage

The homepage hero presents:

- Title: `YOZI Dao Runtime`
- Subtitle: `Cultivate the Invisible System`
- Boot text: `yozi.runtime.boot()`

The visual style should remain poetic, restrained, warm, premium, and spacious: Chinese ink-wash cultivation atmosphere plus code-metaphysics interface.

Avoid:

- Bagua diagram.
- Cyberpunk neon.
- Generic Matrix rain.
- Heavy realistic illustration.
- Fantasy game splash style.
- Large DOM particle systems or WebGL unless truly needed.

## Current Hero Scene

`YoziHero` renders a first working version of a symbolic ink-landscape travel scene:

- A tiny abstract cultivator-like traveler walks forward on a long perspective road.
- The traveler is intentionally small to express `天地之大，人之渺小`.
- Tall mountains are formed from vertical code symbols, punctuation, Chinese characters, and sparse contour strokes.
- The road is formed from flowing text fragments and code symbols.
- Mist and clouds drift slowly.
- Cranes glide in minimal typographic/stroke form.
- Atmospheric particles float and respond subtly to pointer movement.
- Reduced motion is respected.

## Architecture

The component uses a single Canvas layer plus React/Tailwind overlay text.

Scene functions in `src/components/YoziHero.tsx`:

- `createScene`
- `drawMountain`
- `drawMist`
- `drawClouds`
- `drawCrane`
- `drawRoad`
- `drawTraveler`
- `drawParticles`

Tunable constants live in `SCENE`:

- `motion`
- `density`
- `opacity`
- `scale`

Keep this constant object as the first place to tune visual tone before changing drawing logic.

## Validation History

- `npm install` completed successfully after network access was allowed.
- `npm run typecheck` passes.
- `npm run build` passes.
- Browser verification on `http://localhost:5173` showed:
  - Correct title: `YOZI Dao Runtime`
  - No console errors.
  - Desktop composition works as a first architecture pass.
  - Mobile `390x844` works but is visually dense and should be refined later.

## Future Work Rules

- Keep the animation Canvas-based and lightweight.
- Preserve `prefers-reduced-motion`.
- Treat the scene as a hero background; text must remain readable.
- Keep the person tiny relative to the mountains and road.
- Verify desktop and mobile screenshots after visual placement changes.
- Refine composition and tone in later passes rather than overloading the first working version.
