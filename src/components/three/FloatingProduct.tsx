"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type FloatingProductProps = {
  /** Product photo on a plain light background (Shopify CDN, CORS-enabled). */
  src: string;
  /** "dark" adds a particle ring and tunes shadow/reflection for dark sections. */
  tone?: "light" | "dark";
  /** 0–1 scroll progress of the host section (optional, read every frame). */
  progressRef?: React.RefObject<number>;
  /** Render one still frame and stop (reduced motion). */
  still?: boolean;
  /** Fired when WebGL or the image is unavailable. */
  onError?: () => void;
  /** Fired once the cut-out product is on screen. */
  onReady?: () => void;
  className?: string;
};

const MAX_TEX = 1024;
const LAYERS = 14; // stacked cut-outs give the photo real thickness
const DEPTH = 0.085; // total thickness in world units

/** Request a right-sized image from Shopify's CDN. */
function sized(src: string, width: number) {
  try {
    const u = new URL(src);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return src;
  }
}

/**
 * Removes the studio background by flood-filling from the image border:
 * only near-white pixels connected to the edge become transparent, so white
 * parts inside the product (soles, laces) survive. Edges get a soft feather.
 */
function cutOut(img: HTMLImageElement): HTMLCanvasElement {
  const scale = Math.min(1, MAX_TEX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;

  // Background reference = average of the four corners
  const corner = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return [px[i], px[i + 1], px[i + 2]];
  };
  const cs = [corner(0, 0), corner(w - 1, 0), corner(0, h - 1), corner(w - 1, h - 1)];
  const bg = [0, 1, 2].map((k) => cs.reduce((s, c) => s + c[k], 0) / 4);

  const dist = (i: number) => {
    const dr = px[i] - bg[0];
    const dg = px[i + 1] - bg[1];
    const db = px[i + 2] - bg[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };
  const TOL = 34; // colour distance still counted as background
  const SOFT = 22; // extra band that becomes partially transparent

  const visited = new Uint8Array(w * h);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    const p = y * w + x;
    if (visited[p]) return;
    visited[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  const alpha = new Float32Array(w * h).fill(1);
  while (stack.length) {
    const p = stack.pop()!;
    const d = dist(p * 4);
    if (d > TOL + SOFT) continue; // product pixel: stop here
    // Fully background inside TOL, partial in the soft band
    alpha[p] = d <= TOL ? 0 : (d - TOL) / SOFT;
    if (d > TOL) continue; // don't spread through the soft edge
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  // Light 3x3 feather on the alpha edge
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      const a = alpha[p];
      if (a === 0 || a === 1) {
        // only touch pixels sitting on an edge
        const n = alpha[p - 1] + alpha[p + 1] + alpha[p - w] + alpha[p + w];
        if ((a === 1 && n === 4) || (a === 0 && n === 0)) {
          px[p * 4 + 3] = a * 255;
          continue;
        }
      }
      let s = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += alpha[p + dy * w + dx];
      px[p * 4 + 3] = Math.round((s / 9) * 255);
    }
  }
  ctx.putImageData(data, 0, 0);
  return canvas;
}

/** Bounding box of opaque pixels (so the product, not the photo, is centred). */
function opaqueBounds(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const { width: w, height: h } = canvas;
  const px = ctx.getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (px[(y * w + x) * 4 + 3] > 40) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 <= x0 || y1 <= y0) return { x0: 0, y0: 0, x1: w, y1: h };
  return { x0, y0, x1, y1 };
}

/**
 * The product photo, cut out and given depth, floating in 3D: it leans
 * toward the cursor, can be dragged to turn, bobs gently, and casts a soft
 * shadow and reflection. Renders only while on screen.
 */
export default function FloatingProduct({
  src,
  tone = "light",
  progressRef,
  still = false,
  onError,
  onReady,
  className,
}: FloatingProductProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onError?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.4);
    camera.lookAt(0, -0.05, 0);

    const rig = new THREE.Group(); // bob + turn
    scene.add(rig);
    const disposables: { dispose: () => void }[] = [];
    let shadow: THREE.Mesh | null = null;
    let reflection: THREE.Mesh | null = null;
    let ring: THREE.Points | null = null;
    let floorY = -1.3;
    const offset = new THREE.Vector2(0, 0); // photo-plane centre vs product centre

    const uniforms = { uTime: { value: 0 }, uSheen: { value: 0 } };

    // ── Particle ring (dark tone only) ──
    if (tone === "dark") {
      const count = small ? 700 : 1600;
      const pos = new Float32Array(count * 3);
      const seed = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const r = 2.35 + (Math.random() - 0.5) * 0.5;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
        pos[i * 3 + 2] = Math.sin(a) * r;
        seed[i] = Math.random();
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      const m = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: uniforms.uTime },
        vertexShader: /* glsl */ `
          uniform float uTime; attribute float aSeed; varying float vA;
          void main(){
            vec3 p = position; p.y += sin(uTime * 0.8 + aSeed * 12.0) * 0.05;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 2.4 * (0.6 + aSeed) * (6.0 / -mv.z);
            vA = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 1.5 + aSeed * 30.0));
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          varying float vA;
          void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
            gl_FragColor = vec4(vec3(1.0), (1.0 - d * 2.0) * vA * 0.5); }`,
      });
      ring = new THREE.Points(g, m);
      ring.rotation.x = 1.2;
      ring.rotation.z = 0.25;
      scene.add(ring);
      disposables.push(g, m);
    }

    // ── Load photo → cut out → build layered product ──
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onerror = () => !disposed && onError?.();
    img.onload = () => {
      if (disposed) return;
      let canvas: HTMLCanvasElement;
      try {
        canvas = cutOut(img);
      } catch {
        onError?.(); // tainted canvas (no CORS) or OOM
        return;
      }
      const b = opaqueBounds(canvas);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      disposables.push(tex);

      // Size the product (not the whole photo) to fit the frame
      const pw = (b.x1 - b.x0) / canvas.width;
      const ph = (b.y1 - b.y0) / canvas.height;
      const aspect = (canvas.width * pw) / (canvas.height * ph);
      const fitW = 3.3;
      const fitH = 2.2;
      const prodW = Math.min(fitW, fitH * aspect);
      const prodH = prodW / aspect;
      const planeW = prodW / pw;
      const planeH = prodH / ph;
      // Offset so the product's own centre sits at the origin
      const cx = ((b.x0 + b.x1) / 2 / canvas.width - 0.5) * planeW;
      const cy = -((b.y0 + b.y1) / 2 / canvas.height - 0.5) * planeH;

      const geo = new THREE.PlaneGeometry(planeW, planeH);
      disposables.push(geo);
      const product = new THREE.Group();
      product.position.set(-cx, -cy, 0);
      offset.set(cx, cy);
      rig.add(product);

      // Back layers: opaque cut-outs, darker with depth → solid edge on turn
      for (let i = LAYERS - 1; i >= 1; i--) {
        const shade = 0.42 + 0.4 * (1 - i / LAYERS);
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          alphaTest: 0.5,
          color: new THREE.Color(shade, shade, shade),
          side: THREE.DoubleSide,
        });
        const layer = new THREE.Mesh(geo, mat);
        layer.position.z = -(i / (LAYERS - 1)) * DEPTH;
        product.add(layer);
        disposables.push(mat);
      }

      // Front layer: soft edges + a light sheen that sweeps as it turns
      const frontMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uMap: { value: tex }, uSheen: uniforms.uSheen, uTime: uniforms.uTime },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D uMap; uniform float uSheen; uniform float uTime;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(uMap, vUv);
            if (c.a < 0.02) discard;
            float pos = 0.5 + uSheen * 1.4;
            float band = 1.0 - smoothstep(0.0, 0.16, abs(vUv.x + (vUv.y - 0.5) * 0.35 - pos));
            vec3 col = c.rgb + band * 0.16;
            gl_FragColor = vec4(col, c.a);
            #include <colorspace_fragment>
          }`,
      });
      const front = new THREE.Mesh(geo, frontMat);
      front.position.z = 0.002;
      front.renderOrder = 2;
      product.add(front);
      disposables.push(frontMat);

      floorY = -prodH / 2 - 0.32;

      // Soft contact shadow
      const shGeo = new THREE.PlaneGeometry(prodW * 1.25, prodW * 0.38);
      const shMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uStrength: { value: tone === "dark" ? 0.75 : 0.32 } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uStrength; varying vec2 vUv;
          void main(){ vec2 d = (vUv - 0.5) * vec2(1.0, 1.0); float r = length(d) * 2.0;
            float a = (1.0 - smoothstep(0.0, 1.0, r)); gl_FragColor = vec4(vec3(0.0), a * a * uStrength); }`,
      });
      shadow = new THREE.Mesh(shGeo, shMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = floorY;
      scene.add(shadow);
      disposables.push(shGeo, shMat);

      // Mirror reflection fading into the floor
      const rMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uMap: { value: tex }, uStrength: { value: tone === "dark" ? 0.16 : 0.1 } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D uMap; uniform float uStrength; varying vec2 vUv;
          void main(){ vec4 c = texture2D(uMap, vec2(vUv.x, 1.0 - vUv.y));
            float fade = smoothstep(0.55, 1.0, vUv.y);
            gl_FragColor = vec4(c.rgb, c.a * fade * uStrength);
            #include <colorspace_fragment>
          }`,
      });
      reflection = new THREE.Mesh(geo, rMat);
      scene.add(reflection);
      disposables.push(rMat);

      renderFrame(0);
      onReady?.();
    };
    img.src = sized(src, MAX_TEX);

    // ── Sizing ──
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.position.z = w / h < 1 ? 6.4 / Math.max(w / h, 0.6) : 6.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ── Interaction: hover lean + drag to turn (springs back) ──
    const lean = new THREE.Vector2(0, 0); // target from pointer position
    let drag = 0; // extra yaw from dragging
    let dragVel = 0;
    let dragging = false;
    let lastX = 0;
    let hasPointer = false;

    const onMove = (e: PointerEvent) => {
      if (coarse) return;
      const r = host.getBoundingClientRect();
      const inside = e.clientY > r.top - 200 && e.clientY < r.bottom + 200;
      hasPointer = inside;
      if (!inside) return;
      lean.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      lean.clampLength(0, 1.2);
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      dragVel = 0;
      renderer.domElement.setPointerCapture?.(e.pointerId);
      host.style.cursor = "grabbing";
    };
    const onDrag = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragVel = dx * 0.006;
      drag = Math.max(-0.75, Math.min(0.75, drag + dragVel));
    };
    const onUp = () => {
      dragging = false;
      host.style.cursor = "";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onDrag);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointercancel", onUp);

    // ── Loop ──
    const clock = new THREE.Clock();
    let t = 0;
    let yaw = 0;
    let pitch = 0;
    let raf = 0;
    let running = false;

    function renderFrame(dt: number) {
      t += dt;
      const p = progressRef?.current ?? 0.5;
      if (!dragging) {
        dragVel *= 0.9;
        drag = Math.max(-0.75, Math.min(0.75, drag + dragVel));
        drag *= 0.97; // spring home
      }
      const idle = hasPointer ? 0 : Math.sin(t * 0.55) * 0.22;
      const targetYaw = (hasPointer ? lean.x * 0.42 : idle) + drag + (p - 0.5) * 0.5;
      const targetPitch = hasPointer ? lean.y * 0.18 : Math.sin(t * 0.4) * 0.05;
      yaw += (targetYaw - yaw) * Math.min(1, dt * 5 || 1);
      pitch += (targetPitch - pitch) * Math.min(1, dt * 5 || 1);

      const bob = still ? 0 : Math.sin(t * 1.2) * 0.07;
      rig.position.y = bob + 0.05;
      rig.rotation.set(pitch, yaw, Math.sin(t * 0.7) * 0.025);
      uniforms.uTime.value = t;
      uniforms.uSheen.value = yaw * 0.6;

      if (reflection) {
        // Mirror of the photo plane about the floor (plane centre is offset
        // from the product centre by the cut-out bounds)
        reflection.position.set(-offset.x, 2 * floorY - (rig.position.y - offset.y), 0);
        reflection.rotation.set(-pitch, yaw, -Math.sin(t * 0.7) * 0.025);
      }
      if (shadow) {
        const s = 1 - bob * 1.6;
        shadow.scale.set(s, s, 1);
        (shadow.material as THREE.ShaderMaterial).uniforms.uStrength.value =
          (tone === "dark" ? 0.75 : 0.32) * (1 - bob * 2.2);
      }
      if (ring) ring.rotation.y = t * 0.08 + p * 0.8;
      renderer.render(scene, camera);
    }

    const tick = () => {
      if (!running) return;
      renderFrame(Math.min(clock.getDelta(), 0.05));
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || still) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = false;
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { rootMargin: "100px" }
    );
    io.observe(host);
    const onVis = () => (document.hidden ? stop() : onScreen && start());
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      onError?.();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onDrag);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointercancel", onUp);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, tone, progressRef, still, onError, onReady]);

  return <div ref={hostRef} className={className} />;
}
