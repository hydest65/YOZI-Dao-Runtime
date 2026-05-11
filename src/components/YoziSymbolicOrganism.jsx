import { useEffect, useRef } from "react";

const BAGUA = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
const SYMBOLS = [
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">",
  "/",
  "\\",
  "|",
  "::",
  "=>",
  "->",
  "0",
  "1",
  "dao",
  "qi",
  "void",
  "inner",
  "branch",
  "runtime",
  "kernel",
  "breath",
  "fate",
  "道",
  "枝",
  "玄",
  "息",
  "观",
  "空",
  "象",
];
const HERMIT_LINES = [
  "> breath.sync = true",
  "> observe(sand)",
  "> stillness.log()",
  "> rake(void)",
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const pick = (items, index) => items[index % items.length];

function createGarden(width, height) {
  const compact = width < 720;
  const cx = width * (compact ? 0.5 : 0.57);
  const cy = height * (compact ? 0.68 : 0.6);
  const radius = Math.min(width, height) * (compact ? 0.26 : 0.34);
  const glyphs = [];
  let id = 0;

  glyphs.push({
    id: id++,
    label: "道",
    x: cx,
    y: cy,
    tx: cx,
    ty: cy,
    size: compact ? 22 : 27,
    born: 0.08,
    phase: 0,
    anchor: true,
  });

  BAGUA.forEach((label, index) => {
    const angle = -Math.PI / 2 + (index / BAGUA.length) * Math.PI * 2;
    const orbit = radius * 0.92;
    glyphs.push({
      id: id++,
      label,
      x: cx + Math.cos(angle) * orbit * 0.22,
      y: cy + Math.sin(angle) * orbit * 0.14,
      tx: cx + Math.cos(angle) * orbit,
      ty: cy + Math.sin(angle) * orbit * 0.68,
      size: compact ? 21 : 27,
      born: 0.18 + index * 0.055,
      phase: index * 0.83,
      anchor: true,
    });
  });

  const rings = compact ? [0.32, 0.54, 0.75] : [0.26, 0.44, 0.62, 0.8];
  rings.forEach((ring, ringIndex) => {
    const count = compact ? 8 + ringIndex * 2 : 10 + ringIndex * 4;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + ringIndex * 0.38;
      const jitter = Math.sin(i * 2.17 + ringIndex) * radius * 0.025;
      const rx = radius * ring + jitter;
      const ry = radius * ring * 0.48 + jitter * 0.55;
      glyphs.push({
        id: id++,
        label: pick(SYMBOLS, i * 5 + ringIndex * 9),
        x: cx + Math.cos(angle) * rx * 0.14,
        y: cy + Math.sin(angle) * ry * 0.12,
        tx: cx + Math.cos(angle) * rx,
        ty: cy + Math.sin(angle) * ry,
        size: compact ? 10 + ringIndex : 11 + ringIndex * 0.7,
        born: 0.35 + ringIndex * 0.12 + i * 0.012,
        phase: i * 0.47 + ringIndex,
        anchor: false,
      });
    }
  });

  return { cx, cy, radius, glyphs };
}

export function YoziSymbolicOrganism() {
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let garden = createGarden(1, 1);
    let start = performance.now();
    let rafId = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      garden = createGarden(width, height);
    };

    const updateScroll = () => {
      scrollRef.current = clamp(window.scrollY / Math.max(1, window.innerHeight * 0.85), 0, 1);
    };

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const leavePointer = () => {
      pointerRef.current.active = false;
    };

    const drawRakeLine = (cx, cy, rx, ry, alpha, reveal, offset = 0) => {
      ctx.beginPath();
      const startAngle = -Math.PI * 0.86 + offset;
      const endAngle = startAngle + Math.PI * 2 * reveal;
      for (let step = 0; step <= 72; step += 1) {
        const t = step / 72;
        const angle = startAngle + (endAngle - startAngle) * t;
        const wave = Math.sin(angle * 3 + offset) * 2.2;
        const x = cx + Math.cos(angle) * (rx + wave);
        const y = cy + Math.sin(angle) * (ry + wave * 0.4);
        if (step === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = `rgba(43, 36, 26, ${alpha})`;
      ctx.stroke();
    };

    const drawSandGarden = (elapsed, growth, scroll, breath) => {
      const { cx, cy, radius } = garden;
      const reveal = reducedMotion ? 1 : easeOutCubic(clamp(growth / 0.72, 0, 1));
      const fieldDrift = scroll * Math.min(width, height) * 0.4;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + breath - scroll * 0.02, 1 + breath - scroll * 0.02);
      ctx.translate(-cx, -cy);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 0.8;

      const rings = width < 720 ? 5 : 7;
      for (let i = 0; i < rings; i += 1) {
        const ring = i + 1;
        const rx = radius * (0.18 + ring * 0.12) + Math.sin(elapsed * 0.22 + i) * 1.1;
        const ry = rx * (width < 720 ? 0.52 : 0.46);
        drawRakeLine(cx, cy, rx, ry, (0.09 - scroll * 0.035) * reveal, reveal, i * 0.11);
      }

      for (let lane = -2; lane <= 2; lane += 1) {
        ctx.beginPath();
        const y = cy + lane * radius * 0.13;
        const laneReveal = reveal * (1 - Math.abs(lane) * 0.08);
        const startX = cx - radius * 0.95;
        const endX = startX + radius * 1.9 * laneReveal;
        for (let step = 0; step <= 42; step += 1) {
          const t = step / 42;
          const x = startX + (endX - startX) * t + Math.cos(t * Math.PI * 2 + lane) * 1.1;
          const yy = y + Math.sin(t * Math.PI * 2.2 + elapsed * 0.2 + lane) * 3;
          if (step === 0) {
            ctx.moveTo(x, yy);
          } else {
            ctx.lineTo(x, yy);
          }
        }
        ctx.strokeStyle = `rgba(43, 36, 26, ${0.055 - scroll * 0.018})`;
        ctx.stroke();
      }

      BAGUA.forEach((_, index) => {
        const angle = -Math.PI / 2 + (index / 8) * Math.PI * 2;
        const start = radius * 0.14;
        const end = radius * 0.9 * reveal + fieldDrift * 0.28;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * start, cy + Math.sin(angle) * start * 0.5);
        ctx.lineTo(cx + Math.cos(angle) * end, cy + Math.sin(angle) * end * 0.68);
        ctx.strokeStyle = `rgba(43, 36, 26, ${0.075 - scroll * 0.02})`;
        ctx.stroke();
      });

      ctx.restore();
    };

    const drawGlyph = (glyph, x, y, alpha, scale, elapsed) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(glyph.anchor ? 0 : Math.sin(elapsed * 0.22 + glyph.phase) * 0.03);
      ctx.scale(scale, scale);
      ctx.font = `${glyph.anchor ? 500 : 400} ${glyph.size}px "Times New Roman", "Noto Serif CJK SC", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = glyph.anchor ? "#171510" : "#40382c";
      ctx.fillText(glyph.label, 0, 0);
      ctx.restore();
    };

    const drawCodeHermit = (elapsed, scroll) => {
      const compact = width < 720;
      const baseX = garden.cx + garden.radius * (compact ? -0.06 : 0.48);
      const baseY = garden.cy + garden.radius * (compact ? 0.78 : 0.52);
      const breath = reducedMotion ? 0 : Math.sin(elapsed * 1.2) * 1.5;
      const scale = compact ? 0.74 : 0.92;
      const pointer = pointerRef.current;
      const dx = pointer.x - baseX;
      const lean = pointer.active ? clamp(dx / 420, -0.16, 0.16) : 0;
      const headTurn = pointer.active ? clamp(dx / 260, -2.4, 2.4) : 0;
      const alpha = 0.54 - scroll * 0.2;
      const line = HERMIT_LINES[Math.floor(elapsed / 4.8) % HERMIT_LINES.length];
      const linePulse = reducedMotion ? 0.64 : Math.pow(Math.sin(elapsed * Math.PI / 4.8) * 0.5 + 0.5, 1.8);

      ctx.save();
      ctx.translate(baseX, baseY + breath);
      ctx.scale(scale, scale);
      ctx.rotate(lean * 0.12);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(38, 32, 24, ${alpha})`;
      ctx.fillStyle = `rgba(38, 32, 24, ${alpha})`;
      ctx.lineWidth = 1.15;

      ctx.beginPath();
      ctx.moveTo(-34, 28);
      ctx.quadraticCurveTo(-18, 17, -3, 27);
      ctx.quadraticCurveTo(15, 39, 34, 27);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-5, 7);
      ctx.quadraticCurveTo(-8, 18, -4, 28);
      ctx.moveTo(7, 8);
      ctx.quadraticCurveTo(12, 18, 8, 29);
      ctx.stroke();

      ctx.save();
      ctx.translate(headTurn, -11);
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '9px "Times New Roman", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("::", 0, 0.4);
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(-10, 12);
      ctx.lineTo(-24, 21);
      ctx.moveTo(12, 12);
      ctx.lineTo(25, 20);
      ctx.stroke();

      ctx.strokeRect(16, 11, 20, 12);
      ctx.font = '8px "Times New Roman", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(">_", 26, 17);

      ctx.beginPath();
      ctx.moveTo(-47, 18);
      ctx.lineTo(-36, 18);
      ctx.quadraticCurveTo(-36, 27, -43, 27);
      ctx.quadraticCurveTo(-50, 27, -47, 18);
      ctx.strokeStyle = `rgba(38, 32, 24, ${alpha * 0.52})`;
      ctx.stroke();

      if (linePulse > 0.18 && scroll < 0.72) {
        ctx.globalAlpha = alpha * linePulse * (1 - scroll * 0.7);
        ctx.font = `${compact ? 10 : 12}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#4b4233";
        ctx.fillText(line, 44, -2);
      }

      ctx.restore();
    };

    const render = (now) => {
      const elapsed = (now - start) / 1000;
      const growth = reducedMotion ? 1 : clamp(elapsed / 4.8, 0, 1);
      const scroll = scrollRef.current;
      const breath = reducedMotion ? 0 : Math.sin(elapsed * 0.75) * 0.014;
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);
      drawSandGarden(elapsed, growth, scroll, breath);

      garden.glyphs.forEach((glyph) => {
        const bornProgress = clamp((growth - glyph.born) / 0.2, 0, 1);
        const appear = easeOutCubic(bornProgress);
        const driftAngle = glyph.phase + glyph.id * 0.37;
        const disperse = scroll * Math.min(width, height) * 0.38;
        let x = garden.cx + (glyph.tx - garden.cx) * appear + Math.cos(driftAngle) * disperse;
        let y = garden.cy + (glyph.ty - garden.cy) * appear + Math.sin(driftAngle) * disperse * 0.68;

        if (pointer.active && appear > 0) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = clamp(1 - distance / 145, 0, 1);
          if (influence > 0) {
            const direction = glyph.id % 4 === 0 ? -1 : 1;
            x += (dx / Math.max(distance, 1)) * influence * 18 * direction;
            y += (dy / Math.max(distance, 1)) * influence * 12 * direction;
          }
        }

        const shimmer = reducedMotion ? 0 : Math.sin(elapsed * 0.72 + glyph.phase) * 0.04;
        const alpha = appear * (glyph.anchor ? 0.72 : 0.5) - scroll * 0.18 + shimmer;
        const scale = appear * (1 + (reducedMotion ? 0 : Math.sin(elapsed * 0.45 + glyph.phase) * 0.025));
        drawGlyph(glyph, x, y, clamp(alpha, 0, 0.88), scale, elapsed);
      });

      drawCodeHermit(elapsed, scroll);

      if (!reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    resize();
    updateScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", leavePointer);

    if (reducedMotion) {
      render(performance.now() + 8000);
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", leavePointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full bg-[#f6f3eb]"
    />
  );
}
