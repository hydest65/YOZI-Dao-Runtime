import { useEffect, useRef } from "react";
import * as THREE from "three";
import calligraphyWuji from "../assets/calligraphy_wuji_reference.png";
import inkSceneBackground from "../assets/ink_scene_background.png";
import sealTitle from "../assets/seal_title_reference.png";
import sealYou from "../assets/seal_you_reference.png";
import { DaoistWalker } from "./DaoistWalker";

const INK_CLOUD_DENSITY = 1.0;

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDensity;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.52;
    mat2 rot = mat2(0.82, -0.57, 0.57, 0.82);

    for (int i = 0; i < 6; i++) {
      value += amp * noise(p);
      p = rot * p * 2.05 + 13.7;
      amp *= 0.48;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    float topFade = smoothstep(0.02, 0.14, uv.y);
    float bottomFade = 1.0 - smoothstep(0.84, 1.0, uv.y);
    float sideFade = smoothstep(0.0, 0.08, uv.x) * (1.0 - smoothstep(0.94, 1.0, uv.x));

    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float wind = time * 0.12;
    vec2 flow = vec2(p.x - wind, p.y);

    float warpA = fbm(flow * vec2(0.82, 1.05) + vec2(time * 0.02, 4.0));
    float warpB = fbm(flow * vec2(1.35, 0.92) + vec2(-time * 0.015, 12.0));
    vec2 warped = flow + (vec2(warpA, warpB) - 0.5) * 0.34;

    float broad = fbm(warped * vec2(0.9, 0.72));
    float mid = fbm(warped * vec2(1.8, 1.25) + vec2(-time * 0.045, time * 0.015));
    float detail = fbm(warped * vec2(3.4, 2.2) + vec2(time * 0.06, 18.0));
    float dissolve = fbm(warped * vec2(1.1, 0.86) + vec2(-time * 0.032, 7.5));

    float lift = (broad - 0.5) * 0.18 + (mid - 0.5) * 0.08;
    float upperBand = exp(-pow((uv.y - 0.7 - lift) * 2.15, 2.0));
    float middleBand = exp(-pow((uv.y - 0.52 - lift * 0.55) * 2.9, 2.0));
    float trailBand = exp(-pow((uv.y - 0.36 - lift * 0.35) * 4.0, 2.0));

    float veil = smoothstep(0.12, 0.78, broad * 0.66 + mid * 0.28 + detail * 0.12);
    float inkCore = smoothstep(0.42, 0.9, mid * 0.68 + detail * 0.38);
    float broken = mix(0.18, 1.0, smoothstep(0.28, 0.92, dissolve));
    float openAir = mix(0.42, 1.0, smoothstep(0.18, 0.9, fbm(warped * vec2(2.8, 1.7) + vec2(-time * 0.05, 41.0))));
    float volume = smoothstep(0.18, 0.86, veil * 0.54 + inkCore * 0.52 + broad * 0.18);
    float density = (veil * 0.54 * upperBand + inkCore * 0.68 * middleBand + detail * 0.18 * trailBand);
    density *= mix(0.72, 1.12, volume);
    density *= topFade * bottomFade * sideFade * broken * openAir * uDensity;

    float edgeMatte = smoothstep(0.018, 0.26, density);
    float bodyFill = smoothstep(0.18, 0.62, density);
    float alpha = clamp(edgeMatte * 0.18 + bodyFill * 0.32 + density * 0.58, 0.0, 0.68);

    vec3 paperMist = vec3(1.0, 0.996, 0.965);
    vec3 edgeGrey = vec3(0.84, 0.835, 0.78);
    vec3 bodyWhite = vec3(0.98, 0.975, 0.935);
    vec3 undersideGrey = vec3(0.72, 0.72, 0.66);
    float underside = smoothstep(0.72, 0.24, uv.y);
    float selfShadow = smoothstep(0.18, 0.82, density) * (0.45 + 0.55 * underside);
    float topLight = smoothstep(0.28, 0.82, uv.y);
    vec3 color = mix(paperMist, edgeGrey, edgeMatte * (1.0 - bodyFill) * 0.42);
    color = mix(color, bodyWhite, bodyFill * 0.62);
    color = mix(color, undersideGrey, selfShadow * 0.12);
    color = mix(color, vec3(1.0, 0.995, 0.965), topLight * bodyFill * 0.18);

    float goldMask = smoothstep(0.82, 0.96, fbm(warped * vec2(9.0, 7.0) + vec2(time * 0.08, 33.0))) * inkCore * 0.12;
    color = mix(color, vec3(0.75, 0.58, 0.28), goldMask);

    gl_FragColor = vec4(color, alpha + goldMask * 0.08);
  }
`;

function LateralInkCloudField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uDensity: { value: INK_CLOUD_DENSITY },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let frame = 0;

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="lateral-ink-cloud" aria-hidden="true" />;
}

export function MysticParticleHero() {
  return (
    <section className="ink-hero relative isolate min-h-screen overflow-hidden bg-[#f3efe6] text-[#1c1b18]">
      <img className="scene-background absolute inset-0" src={inkSceneBackground} alt="" aria-hidden="true" />
      <LateralInkCloudField />
      <div className="paper-vignette pointer-events-none absolute inset-0" />

      <DaoistWalker />

      <header className="hero-nav pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-7 text-[0.68rem] uppercase tracking-[0.28em] text-[#22201c] sm:px-10 lg:px-16">
        <div className="hidden text-[#3b3831] md:block">NO.13 PORTFOLIO</div>
        <nav className="pointer-events-auto mx-auto flex max-w-full items-center gap-6 overflow-x-auto whitespace-nowrap md:mx-0 md:gap-14">
          <a href="#visual">VISUAL DESIGN</a>
          <a href="#aigc">AIGC</a>
          <a href="#coding">CODING</a>
          <a href="#experiment">EXPERIMENT</a>
        </nav>
        <div className="hidden items-center gap-7 md:flex">
          <span>ABOUT</span>
          <span className="menu-mark" aria-hidden="true" />
        </div>
      </header>

      <aside className="side-index pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 text-[#1f1d19] sm:left-10 md:block lg:left-16">
        <div className="side-item is-active">
          <span className="font-serif text-base tracking-[0.16em]">视觉</span>
          <span>VISUAL</span>
        </div>
        <div className="side-dot" />
        <div className="side-item">
          <span className="font-serif text-base tracking-[0.16em]">生成</span>
          <span>AIGC</span>
        </div>
        <div className="side-dot" />
        <div className="side-item">
          <span className="font-serif text-base tracking-[0.16em]">思考</span>
          <span>THINKING</span>
        </div>
        <div className="side-line" />
      </aside>

      <div className="title-block pointer-events-none absolute z-20">
        <img className="title-calligraphy-image" src={calligraphyWuji} alt="无籍" />
        <div className="title-side-copy font-serif" aria-hidden="true">
          <span className="title-vertical">天地无籍</span>
          <span className="title-vertical">身寄烟霞</span>
        </div>
        <img className="title-side-seal" src={sealTitle} alt="" aria-hidden="true" />
        <p className="title-english">BOUNDLESS</p>
        <img className="title-seal-image" src={sealYou} alt="" aria-hidden="true" />
      </div>

      <footer className="hero-footer pointer-events-none absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between text-[0.66rem] uppercase tracking-[0.28em] text-[#28251f] sm:bottom-8 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
        <div className="flex items-center gap-3">
          <span className="scroll-dot" aria-hidden="true" />
          <span>SCROLL TO EXPLORE</span>
        </div>
        <div className="footer-number">NUMBER · 13 / 2024</div>
      </footer>
    </section>
  );
}
