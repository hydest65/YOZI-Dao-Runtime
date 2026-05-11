import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

type Mountain = {
  x: number;
  baseY: number;
  height: number;
  width: number;
  depth: number;
  seed: number;
};

type Particle = Point & {
  symbol: string;
  size: number;
  speed: number;
  alpha: number;
  phase: number;
};

type Crane = {
  x: number;
  y: number;
  scale: number;
  speed: number;
  phase: number;
};

type SceneState = {
  mountains: Mountain[];
  particles: Particle[];
  cranes: Crane[];
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const SCENE = {
  motion: {
    mountainDrift: 0.06,
    mistDrift: 0.075,
    roadFlow: 0.22,
    craneSpeed: 0.018,
    particleDrift: 0.035,
    walkSpeed: 1.6,
  },
  density: {
    mountainColumnsDesktop: 34,
    mountainColumnsMobile: 18,
    airParticlesDesktop: 82,
    airParticlesMobile: 42,
    roadSymbolsDesktop: 58,
    roadSymbolsMobile: 34,
  },
  opacity: {
    mountainBack: 0.09,
    mountainFront: 0.18,
    mist: 0.12,
    road: 0.28,
    traveler: 0.72,
    particle: 0.34,
    crane: 0.42,
  },
  scale: {
    travelerDesktop: 1,
    travelerMobile: 0.72,
    sceneBreath: 0.008,
  },
};

const CODE_SYMBOLS = [
  "0",
  "1",
  "::",
  "/",
  "\\",
  "|",
  "=>",
  "->",
  "{}",
  "[]",
  "dao",
  "qi",
  "void",
  "road",
  "kernel",
  "breath",
  "道",
  "枝",
  "玄",
  "息",
  "空",
  "云",
  "山",
];

const ROAD_SYMBOLS = ["dao", "road", "->", "::", "qi", "0", "1", "息", "行", "void"];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const pick = <T,>(items: T[], index: number) => items[index % items.length];

function createScene(width: number, height: number): SceneState {
  const compact = width < 720;
  const mountainCount = compact ? 7 : 10;
  const particles = Array.from({ length: compact ? SCENE.density.airParticlesMobile : SCENE.density.airParticlesDesktop }, (_, index) => ({
    x: (index * 137.5) % width,
    y: height * 0.14 + ((index * 91.7) % (height * 0.7)),
    symbol: pick(CODE_SYMBOLS, index * 5),
    size: compact ? 9 + (index % 3) : 10 + (index % 4),
    speed: 0.2 + (index % 7) * 0.035,
    alpha: 0.08 + (index % 5) * 0.018,
    phase: index * 0.71,
  }));

  const mountains = Array.from({ length: mountainCount }, (_, index) => {
    const depth = index / Math.max(1, mountainCount - 1);
    return {
      x: lerp(width * -0.05, width * 1.05, index / Math.max(1, mountainCount - 1)),
      baseY: height * lerp(0.72, 0.82, depth),
      height: height * lerp(compact ? 0.28 : 0.42, compact ? 0.52 : 0.74, 1 - Math.abs(depth - 0.5)),
      width: width * lerp(0.24, 0.38, (index % 4) / 3),
      depth,
      seed: index * 2.31,
    };
  });

  const cranes = Array.from({ length: compact ? 3 : 5 }, (_, index) => ({
    x: width * (0.12 + index * 0.21),
    y: height * (0.18 + (index % 3) * 0.065),
    scale: compact ? 0.62 + index * 0.04 : 0.78 + index * 0.06,
    speed: SCENE.motion.craneSpeed * (0.72 + index * 0.12),
    phase: index * 1.8,
  }));

  return { mountains, particles, cranes };
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  alpha: number,
  fill = "#2b261d"
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawMountain(ctx: CanvasRenderingContext2D, mountain: Mountain, time: number, compact: boolean) {
  const columnCount = compact ? SCENE.density.mountainColumnsMobile : SCENE.density.mountainColumnsDesktop;
  const peakX = mountain.x + Math.sin(mountain.seed) * mountain.width * 0.08;
  const peakY = mountain.baseY - mountain.height;
  const ink = lerp(SCENE.opacity.mountainBack, SCENE.opacity.mountainFront, mountain.depth);

  for (let i = 0; i < columnCount; i += 1) {
    const t = i / Math.max(1, columnCount - 1);
    const x = mountain.x - mountain.width * 0.5 + t * mountain.width;
    const side = 1 - Math.abs(t - 0.5) * 2;
    const ridge = Math.sin(t * Math.PI + mountain.seed) * mountain.height * 0.12;
    const top = lerp(mountain.baseY, peakY + ridge, side);
    const density = Math.floor(lerp(2, 10, side));

    for (let j = 0; j < density; j += 1) {
      const y = lerp(mountain.baseY, top, j / Math.max(1, density - 1));
      const drift = Math.sin(time * SCENE.motion.mountainDrift + j * 0.7 + mountain.seed) * 2.2;
      const symbol = pick(CODE_SYMBOLS, i * 3 + j + Math.floor(mountain.seed));
      drawText(ctx, symbol, x + drift, y, compact ? 8 : 10, ink * (0.38 + side * 0.5));
    }
  }

  ctx.save();
  ctx.globalAlpha = ink * 0.52;
  ctx.strokeStyle = "#2b261d";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(mountain.x - mountain.width * 0.5, mountain.baseY);
  ctx.quadraticCurveTo(peakX, peakY, mountain.x + mountain.width * 0.5, mountain.baseY);
  ctx.stroke();
  ctx.restore();
}

function drawMist(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, compact: boolean) {
  const bands = compact ? 5 : 7;

  for (let i = 0; i < bands; i += 1) {
    const y = height * (0.18 + i * 0.1);
    const drift = ((time * 10 * SCENE.motion.mistDrift + i * 80) % (width * 1.2)) - width * 0.1;
    const gradient = ctx.createLinearGradient(drift - width * 0.28, y, drift + width * 0.34, y);
    gradient.addColorStop(0, "rgba(246,243,235,0)");
    gradient.addColorStop(0.5, `rgba(88,80,67,${SCENE.opacity.mist * (0.7 - i * 0.04)})`);
    gradient.addColorStop(1, "rgba(246,243,235,0)");

    ctx.save();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = compact ? 12 : 18;
    ctx.beginPath();
    ctx.moveTo(drift - width * 0.3, y);
    ctx.bezierCurveTo(drift, y - 18, drift + width * 0.2, y + 18, drift + width * 0.52, y);
    ctx.stroke();
    ctx.restore();
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, compact: boolean) {
  const cloudCount = compact ? 4 : 6;

  for (let i = 0; i < cloudCount; i += 1) {
    const x = (width * (0.1 + i * 0.22) + Math.sin(time * 0.14 + i) * 28) % (width + 160);
    const y = height * (0.16 + (i % 3) * 0.08);
    const size = compact ? 44 : 70;
    const alpha = 0.08 + (i % 2) * 0.025;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#4c4437";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.bezierCurveTo(x - size * 0.45, y - size * 0.18, x - size * 0.18, y + size * 0.12, x + size * 0.2, y);
    ctx.bezierCurveTo(x + size * 0.46, y - size * 0.16, x + size * 0.62, y + size * 0.08, x + size, y);
    ctx.stroke();

    for (let j = 0; j < 6; j += 1) {
      drawText(ctx, pick(CODE_SYMBOLS, i * 11 + j), x - size * 0.55 + j * size * 0.22, y + Math.sin(j) * 8, 9, 0.5);
    }
    ctx.restore();
  }
}

function drawCrane(ctx: CanvasRenderingContext2D, crane: Crane, width: number, time: number) {
  const x = (crane.x + time * crane.speed * width * 0.32) % (width + 120) - 60;
  const y = crane.y + Math.sin(time * 0.45 + crane.phase) * 12;
  const wing = Math.sin(time * 1.2 + crane.phase) * 5;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(crane.scale, crane.scale);
  ctx.globalAlpha = SCENE.opacity.crane;
  ctx.strokeStyle = "#2d281f";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.quadraticCurveTo(-5, -8 - wing, 0, 0);
  ctx.quadraticCurveTo(7, -8 + wing, 18, -2);
  ctx.moveTo(0, 0);
  ctx.lineTo(7, 5);
  ctx.stroke();
  drawText(ctx, ">", 24, -3, 10, 0.62);
  drawText(ctx, "::", -22, 1, 8, 0.5);
  ctx.restore();
}

function drawRoad(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, compact: boolean) {
  const horizon = height * (compact ? 0.47 : 0.46);
  const near = height * 0.88;
  const centerX = width * 0.5;
  const bend = Math.sin(time * 0.08) * width * 0.025;
  const symbolCount = compact ? SCENE.density.roadSymbolsMobile : SCENE.density.roadSymbolsDesktop;

  ctx.save();
  ctx.strokeStyle = `rgba(42,36,27,${SCENE.opacity.road * 0.48})`;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(centerX - width * 0.02, horizon);
  ctx.bezierCurveTo(centerX - width * 0.12 + bend, height * 0.58, centerX - width * 0.2, height * 0.72, centerX - width * 0.34, near);
  ctx.moveTo(centerX + width * 0.02, horizon);
  ctx.bezierCurveTo(centerX + width * 0.1 + bend, height * 0.58, centerX + width * 0.18, height * 0.72, centerX + width * 0.34, near);
  ctx.stroke();

  for (let i = 0; i < symbolCount; i += 1) {
    const progress = ((i / symbolCount + time * SCENE.motion.roadFlow * 0.025) % 1) ** 1.9;
    const y = lerp(horizon, near, progress);
    const roadWidth = lerp(width * 0.04, width * 0.56, progress);
    const side = i % 2 === 0 ? -1 : 1;
    const x = centerX + side * roadWidth * (0.16 + (i % 5) * 0.08) + Math.sin(progress * 9 + time) * 4;
    const size = lerp(compact ? 7 : 8, compact ? 13 : 16, progress);
    const alpha = lerp(0.08, SCENE.opacity.road, progress);
    drawText(ctx, pick(ROAD_SYMBOLS, i), x, y, size, alpha);
  }
  ctx.restore();
}

function drawTraveler(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, compact: boolean) {
  const x = width * 0.5;
  const y = height * (compact ? 0.72 : 0.75);
  const scale = (compact ? SCENE.scale.travelerMobile : SCENE.scale.travelerDesktop) * Math.min(width, height) * 0.055;
  const step = Math.sin(time * SCENE.motion.walkSpeed);
  const robe = Math.sin(time * SCENE.motion.walkSpeed - 0.8);

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.globalAlpha = SCENE.opacity.traveler;
  ctx.strokeStyle = "#171510";
  ctx.fillStyle = "#171510";
  ctx.lineWidth = 0.04;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Tiny robe-like silhouette: intentionally abstract and small against the landscape.
  ctx.beginPath();
  ctx.arc(0, -1.55, 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-0.28, -1.18);
  ctx.quadraticCurveTo(0, -1.38, 0.3, -1.18);
  ctx.lineTo(0.22 + robe * 0.08, -0.18);
  ctx.quadraticCurveTo(0, -0.03, -0.24 - robe * 0.06, -0.18);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-0.08, -0.18);
  ctx.lineTo(-0.28 + step * 0.12, 0.2);
  ctx.moveTo(0.08, -0.18);
  ctx.lineTo(0.28 - step * 0.12, 0.2);
  ctx.moveTo(-0.34, -0.86);
  ctx.lineTo(-0.52 - robe * 0.12, -0.55);
  ctx.moveTo(0.34, -0.86);
  ctx.lineTo(0.52 + robe * 0.08, -0.62);
  ctx.stroke();

  drawText(ctx, "人", 0, 0.52, 0.34, 0.7, "#171510");
  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], width: number, time: number, pointer: PointerState) {
  particles.forEach((particle, index) => {
    let x = (particle.x + time * particle.speed * 10 * SCENE.motion.particleDrift) % (width + 40) - 20;
    let y = particle.y + Math.sin(time * 0.22 + particle.phase) * 10;

    if (pointer.active) {
      x += (pointer.x - width * 0.5) * 0.006 * ((index % 3) - 1);
      y += (pointer.y - y) * 0.004;
    }

    drawText(ctx, particle.symbol, x, y, particle.size, particle.alpha * SCENE.opacity.particle);
  });
}

export function YoziHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });

    if (!canvas || !ctx) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;
    let width = 0;
    let height = 0;
    let scene = createScene(1, 1);
    let animationFrame = 0;
    const startedAt = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      scene = createScene(width, height);
    };

    const updateScroll = () => {
      scrollRef.current = clamp(window.scrollY / Math.max(1, window.innerHeight), 0, 1);
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        active: true,
      };
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
    };

    const render = (now: number) => {
      const time = reducedMotion ? 14 : (now - startedAt) / 1000;
      const compact = width < 720;
      const scrollDepth = scrollRef.current;
      const breath = reducedMotion ? 0 : Math.sin(time * 0.18) * SCENE.scale.sceneBreath;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width * 0.5, height * 0.58);
      ctx.scale(1 + breath - scrollDepth * 0.018, 1 + breath - scrollDepth * 0.018);
      ctx.translate(-width * 0.5, -height * 0.58);

      drawMist(ctx, width, height, time, compact);
      scene.mountains.forEach((mountain) => drawMountain(ctx, mountain, time + scrollDepth * 4, compact));
      drawClouds(ctx, width, height, time, compact);
      scene.cranes.forEach((crane) => drawCrane(ctx, crane, width, time));
      drawRoad(ctx, width, height, time, compact);
      drawTraveler(ctx, width, height, time, compact);
      drawParticles(ctx, scene.particles, width, time, pointerRef.current);
      ctx.restore();

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    const updateMotionPreference = () => {
      reducedMotion = mediaQuery.matches;
      cancelAnimationFrame(animationFrame);
      render(performance.now());
      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    resize();
    updateScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", clearPointer);
    mediaQuery.addEventListener("change", updateMotionPreference);

    render(performance.now());
    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  return (
    <section className="relative isolate flex min-h-screen overflow-hidden bg-[#f6f3eb]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(255,255,255,0.28),rgba(246,243,235,0.1)_42%,rgba(246,243,235,0.82)_86%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 text-[11px] tracking-[0.32em] text-[#514a3b]/70 sm:px-8">
        <span>YOZI</span>
        <span className="hidden sm:inline">悠枝堂.RUNTIME</span>
      </div>

      <div className="relative z-10 flex w-full items-center px-5 pb-28 pt-28 sm:px-8 lg:px-14">
        <div className="max-w-5xl">
          <p className="mb-5 text-xs uppercase tracking-[0.46em] text-[#746a55]">
            yozi.runtime.boot()
          </p>
          <h1 className="max-w-4xl text-balance font-serif text-[clamp(3.3rem,8vw,8.4rem)] leading-[0.86] tracking-normal text-[#15130f]">
            YOZI Dao Runtime
          </h1>
          <p className="mt-8 max-w-2xl text-balance text-xl leading-8 text-[#3a352c] sm:text-2xl sm:leading-9">
            Cultivate the Invisible System
          </p>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[#514a3b]/55">
        <span className="text-[10px] uppercase tracking-[0.34em]">descend</span>
        <ChevronDown aria-hidden="true" size={18} strokeWidth={1.4} />
      </div>
    </section>
  );
}
