import { useEffect, useRef } from "react";

const BAGUA = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
const CODE_SYMBOLS = [
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
  "> observe(branch)",
  "> stillness.log()",
  "> cultivation.progress += 0.01",
];

const pick = (items, index) => items[index % items.length];
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function createNodes(width, height) {
  const compact = width < 720;
  const rootX = width * 0.5;
  const rootY = height * (compact ? 0.72 : 0.66);
  const depthCount = compact ? 4 : 5;
  const branchCount = compact ? 6 : 8;
  const spread = Math.min(width, height) * (compact ? 0.27 : 0.38);
  const nodes = [
    {
      id: 0,
      parent: -1,
      label: "道",
      born: 0,
      x: rootX,
      y: rootY,
      tx: rootX,
      ty: rootY,
      mx: rootX,
      my: rootY,
      size: compact ? 20 : 24,
      bagua: false,
      phase: 0,
    },
  ];

  let id = 1;
  for (let branch = 0; branch < branchCount; branch += 1) {
    const angle =
      -Math.PI / 2 +
      ((branch - (branchCount - 1) / 2) / Math.max(1, branchCount - 1)) *
        Math.PI *
        1.2;
    const matrixAngle = -Math.PI / 2 + (branch / branchCount) * Math.PI * 2;
    let parent = 0;

    for (let depth = 1; depth <= depthCount; depth += 1) {
      const bend = Math.sin(branch * 1.7 + depth * 0.9) * 0.24;
      const distance = (spread / depthCount) * depth;
      const x = rootX + Math.cos(angle + bend) * distance * (0.52 + depth * 0.1);
      const y = rootY + Math.sin(angle + bend) * distance;
      const ring = (spread / depthCount) * (depth + 1.2);
      const tx = rootX + Math.cos(matrixAngle) * ring;
      const ty = rootY + Math.sin(matrixAngle) * ring * 0.78;
      const isOuter = depth === depthCount;

      nodes.push({
        id,
        parent,
        label: isOuter ? pick(BAGUA, branch) : pick(CODE_SYMBOLS, branch * 7 + depth * 5),
        born: 0.1 + (depth / depthCount) * 0.5 + branch * 0.018,
        x,
        y,
        tx,
        ty,
        mx: tx,
        my: ty,
        size: isOuter ? (compact ? 22 : 27) : compact ? 11 + depth : 12 + depth * 0.8,
        bagua: isOuter,
        phase: branch * 0.8 + depth * 0.46,
      });

      parent = id;
      id += 1;

      if (!compact && depth > 1 && depth < depthCount && (branch + depth) % 2 === 0) {
        const sideAngle = angle + bend + (branch % 2 ? -0.72 : 0.72);
        const sideDistance = distance * 0.86;
        const sx = rootX + Math.cos(sideAngle) * sideDistance * 0.72;
        const sy = rootY + Math.sin(sideAngle) * sideDistance;
        const stx = rootX + Math.cos(matrixAngle + 0.22) * ring * 0.82;
        const sty = rootY + Math.sin(matrixAngle + 0.22) * ring * 0.64;

        nodes.push({
          id,
          parent,
          label: pick(CODE_SYMBOLS, branch * 11 + depth * 3),
          born: 0.24 + (depth / depthCount) * 0.46 + branch * 0.014,
          x: sx,
          y: sy,
          tx: stx,
          ty: sty,
          mx: stx,
          my: sty,
          size: 11,
          bagua: false,
          phase: branch * 0.9 + depth,
        });
        id += 1;
      }
    }
  }

  return nodes;
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
    let nodes = [];
    let frame = 0;
    let start = performance.now();
    let rafId = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = createNodes(width, height);
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

    const drawGlyph = (node, x, y, alpha, scale) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.font = `${node.bagua ? 500 : 400} ${node.size}px "Times New Roman", "Noto Serif CJK SC", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = node.bagua ? "#15130f" : "#373126";
      ctx.fillText(node.label, 0, 0);
      ctx.restore();
    };

    const drawCodeHermit = (root, elapsed, scroll) => {
      const compact = width < 720;
      const breath = reducedMotion ? 0 : Math.sin(elapsed * 1.2) * 1.6;
      const baseX = root.x;
      const baseY = root.y + (compact ? 52 : 64);
      const scale = compact ? 0.78 : 1;
      const pointer = pointerRef.current;
      const dx = pointer.x - baseX;
      const dy = pointer.y - baseY;
      const lean = pointer.active ? clamp(dx / 420, -0.16, 0.16) : 0;
      const headTurn = pointer.active ? clamp(dx / 260, -2.4, 2.4) : 0;
      const alpha = 0.56 - scroll * 0.2;
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
      ctx.moveTo(-43, 29);
      ctx.lineTo(43, 29);
      ctx.strokeStyle = `rgba(38, 32, 24, ${alpha * 0.32})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-47, 18);
      ctx.lineTo(-36, 18);
      ctx.quadraticCurveTo(-36, 27, -43, 27);
      ctx.quadraticCurveTo(-50, 27, -47, 18);
      ctx.strokeStyle = `rgba(38, 32, 24, ${alpha * 0.52})`;
      ctx.stroke();

      if (linePulse > 0.18 && scroll < 0.72) {
        ctx.globalAlpha = alpha * linePulse * (1 - scroll * 0.7);
        ctx.font = `${compact ? 11 : 12}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#4b4233";
        ctx.fillText(line, 45, -2);
      }

      ctx.restore();

      ctx.save();
      ctx.globalAlpha = (0.18 - scroll * 0.08) * (reducedMotion ? 1 : 0.8 + Math.sin(elapsed) * 0.2);
      ctx.strokeStyle = "#2d281f";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(root.x, root.y + 13);
      ctx.quadraticCurveTo(root.x - 8, root.y + 36, baseX - 6, baseY - 37);
      ctx.moveTo(root.x, root.y + 13);
      ctx.quadraticCurveTo(root.x + 8, root.y + 36, baseX + 7, baseY - 38);
      ctx.stroke();
      ctx.restore();
    };

    const render = (now) => {
      const elapsed = (now - start) / 1000;
      const growth = reducedMotion ? 1 : clamp(elapsed / 5.6, 0, 1);
      const matrix = reducedMotion ? 0.82 : clamp((elapsed - 5.1) / 5.8, 0, 0.82);
      const scroll = scrollRef.current;
      const breath = reducedMotion ? 0 : Math.sin(elapsed * 0.85) * 0.018;
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width * 0.5, height * 0.6);
      ctx.scale(1 + breath - scroll * 0.018, 1 + breath - scroll * 0.018);
      ctx.translate(-width * 0.5, -height * 0.6);

      const positions = nodes.map((node) => {
        const bornProgress = clamp((growth - node.born) / 0.18, 0, 1);
        const grown = easeOutCubic(bornProgress);
        const organize = easeOutCubic(matrix);
        const disperseAngle = node.phase + node.id * 0.31;
        const disperse = scroll * Math.min(width, height) * 0.42;
        const gx = nodes[0].x + (node.x - nodes[0].x) * grown;
        const gy = nodes[0].y + (node.y - nodes[0].y) * grown;
        let x = gx + (node.tx - gx) * organize + Math.cos(disperseAngle) * disperse;
        let y = gy + (node.ty - gy) * organize + Math.sin(disperseAngle) * disperse * 0.72;

        if (pointer.active && grown > 0) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = clamp(1 - distance / 150, 0, 1);
          if (influence > 0) {
            const direction = node.id % 3 === 0 ? -1 : 1;
            x += (dx / Math.max(distance, 1)) * influence * 22 * direction;
            y += (dy / Math.max(distance, 1)) * influence * 16 * direction;
          }
        }

        return {
          x,
          y,
          alpha: grown * (0.76 - scroll * 0.28 + Math.sin(elapsed + node.phase) * 0.045),
          scale: grown * (1 + Math.sin(elapsed * 0.7 + node.phase) * 0.025),
        };
      });

      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        if (node.parent < 0) {
          return;
        }
        const current = positions[node.id];
        const parent = positions[node.parent];
        if (!current || !parent) {
          return;
        }
        const alpha = Math.min(current.alpha, parent.alpha) * (0.22 - scroll * 0.09);
        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(current.x, current.y);
        ctx.strokeStyle = `rgba(44, 38, 28, ${clamp(alpha, 0, 0.22)})`;
        ctx.stroke();
      });

      positions.forEach((position, index) => {
        const node = nodes[index];
        drawGlyph(node, position.x, position.y, clamp(position.alpha, 0, 0.92), position.scale);
      });

      drawCodeHermit(positions[0], elapsed, scroll);

      ctx.globalAlpha = 0.18 - scroll * 0.08;
      ctx.strokeStyle = "#2d281f";
      ctx.lineWidth = 0.8;
      const root = positions[0];
      BAGUA.forEach((_, index) => {
        const angle = -Math.PI / 2 + (index / 8) * Math.PI * 2;
        const radius = Math.min(width, height) * 0.27;
        ctx.beginPath();
        ctx.moveTo(root.x, root.y);
        ctx.lineTo(root.x + Math.cos(angle) * radius, root.y + Math.sin(angle) * radius * 0.78);
        ctx.stroke();
      });
      ctx.restore();

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
