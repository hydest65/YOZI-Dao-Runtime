# Project Memory

This document captures the current state of the YOZI Dao Runtime homepage so future work can resume quickly.

## What Exists Now

The project is a Vite React app using TypeScript, Tailwind CSS, and Canvas 2D.

Main files:

- `src/App.tsx`
- `src/components/YoziHero.tsx`
- `src/main.tsx`
- `src/styles.css`

The hero page presents:

- `YOZI Dao Runtime`
- `Cultivate the Invisible System`
- `yozi.runtime.boot()`

## Current Hero Direction

The current first working version is a symbolic ink-landscape travel scene.

It should communicate:

- Chinese cultivation atmosphere.
- Ink-wash mountain spaciousness.
- Abstract code-based visual language.
- `天地之大，人之渺小`: vast heaven and earth, tiny human traveler.

All scene elements are drawn procedurally with Canvas and typography-like marks. No images, WebGL, Bagua diagram, cyberpunk neon, or fantasy game splash styling.

## Scene Architecture

`YoziHero` owns the hero layout and a Canvas scene layer. The Canvas renderer is organized around these layers:

1. background mist
2. mountain layer
3. cloud layer
4. crane layer
5. road/code-flow layer
6. tiny traveler layer
7. foreground drifting particles
8. React/Tailwind text overlay

The scene exposes tunable constants in `SCENE`:

- `motion`
- `density`
- `opacity`
- `scale`

## Visual Elements

- Mountains are built from vertical code symbols, punctuation, Chinese characters, and sparse outline strokes.
- Road is a long perspective path with flowing text fragments.
- Traveler is intentionally tiny and abstract, with a minimal walking cycle and robe-like trailing motion.
- Cranes are reduced to light strokes and small typographic marks.
- Clouds and mist use sparse curves, particles, and gradients.
- Atmospheric particles drift slowly and respond subtly to pointer movement.

## Validation History

Completed checks:

- `npm install`
- `npm run typecheck`
- `npm run build`
- Browser desktop screenshot inspection
- Browser mobile screenshot inspection at `390x844`
- Console error check: none observed

## Known Refinement Areas

- Mobile composition is working but visually dense.
- Mountain peaks and symbols can be tuned to sit more gracefully around the title.
- The traveler/road animation is structurally present; robe and stride details can be refined.
- Ink-wash tone can be softened with better opacity, particle spacing, and mist layering.

## GitHub

Repository:

```text
https://github.com/hydest65/YOZI-Dao-Runtime
```

Latest direction commit should mention the TypeScript symbolic landscape hero.
