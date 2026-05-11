# Project Memory

This document captures the current state of the YOZI Dao Runtime homepage so future work can resume quickly.

## What Exists Now

The project is a Vite React app with Tailwind CSS. The homepage is implemented in `src/App.jsx`, and the main animation lives in `src/components/YoziSymbolicOrganism.jsx`.

The hero page presents:

- `YOZI Dao Runtime`
- `Cultivate the Invisible System`
- `yozi.runtime.boot()`

The animation is rendered with Canvas 2D, not images, WebGL, or a large DOM particle system.

## Main Animation

`YoziSymbolicOrganism` creates a Living Code Tree:

- A root node appears near the lower center.
- Branches grow from the root using text/code symbols.
- Nodes are glyphs, words, Bagua trigrams, and Chinese characters.
- Thin low-opacity lines connect parent and child nodes.
- After growth, the tree stabilizes into a loose eight-direction Bagua-inspired matrix.
- The organism breathes through subtle opacity and scale movement.
- Pointer movement gently affects nearby nodes.
- Scrolling disperses the organism into a sparse symbol field.
- Reduced motion users receive a stable composition.

Important symbol vocabulary:

```text
☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷
{ } [ ] ( ) < > / \ | :: => -> 0 1
dao qi void inner branch runtime kernel breath fate
道 枝 玄 息 观 空 象
```

## Code Hermit

A small "Code Hermit" sits below the tree root. It is drawn inside the same Canvas:

- Simple seated line figure.
- Minimal head with `::`.
- Tiny terminal marked `>_`.
- Small cup beside the figure.
- Gentle breathing motion.
- Head subtly turns toward the cursor.
- Occasionally shows one small terminal line:

```text
> breath.sync = true
> observe(branch)
> stillness.log()
> cultivation.progress += 0.01
```

It should remain secondary to the Living Code Tree.

## Responsive Adjustment

Mobile was checked at `390x844`. The tree root was moved lower on compact screens because the first mobile version overlapped the subtitle.

Current compact layout intent:

- Root sits lower than desktop.
- Spread is reduced.
- Hero text stays visually dominant and readable.

## Validation History

Completed checks:

- `npm install`
- `npm run build`
- Browser check at `http://localhost:5173`
- Desktop screenshot inspection
- Mobile screenshot inspection
- Console error check: none observed

## GitHub

Repository:

```text
https://github.com/hydest65/YOZI-Dao-Runtime
```

Initial commit:

```text
71fa2cd Create YOZI Dao Runtime homepage
```

## Local Skill Memory

A project memory skill exists at:

```text
skills/yozi-dao-runtime-memory/SKILL.md
```

It was also installed locally to:

```text
C:\Users\Hydest\.codex\skills\yozi-dao-runtime-memory
```
