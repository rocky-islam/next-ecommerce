"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type KineticSculptureProps = {
  /** 0–1 scroll progress through the host section (read every frame). */
  progressRef?: React.RefObject<number>;
  /** Render one still frame and stop (reduced motion). */
  still?: boolean;
  /** Called if WebGL is unavailable so the host can show a fallback. */
  onError?: () => void;
  className?: string;
};

// Ashima Arts 3D simplex noise (MIT) — drives the liquid surface.
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform vec2 uPointer;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
${NOISE}

float field(vec3 p){
  float t = uTime;
  float n = snoise(p * uFreq + vec3(t * 0.22, t * 0.17, t * 0.11));
  n += 0.18 * snoise(p * uFreq * 1.9 - vec3(t * 0.16));
  // Soft bulge toward the cursor
  vec3 dir = normalize(vec3(uPointer * 1.4, 0.7));
  float bulge = pow(max(dot(normalize(p), dir), 0.0), 4.0) * length(uPointer) * 0.32;
  return n * uAmp + bulge;
}

vec3 displace(vec3 p){
  return p + normalize(p) * field(p);
}

void main(){
  vec3 p = position;
  vec3 n = normalize(p);
  vec3 t = normalize(abs(n.y) > 0.99 ? cross(n, vec3(1.0, 0.0, 0.0)) : cross(n, vec3(0.0, 1.0, 0.0)));
  vec3 b = normalize(cross(n, t));
  float eps = 0.012;
  vec3 P  = displace(p);
  vec3 P1 = displace(p + t * eps);
  vec3 P2 = displace(p + b * eps);
  vec3 dn = normalize(cross(P1 - P, P2 - P));
  if (dot(dn, n) < 0.0) dn = -dn;

  vDisp = field(p);
  vNormal = normalize(normalMatrix * dn);
  vec4 mv = modelViewMatrix * vec4(P, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  vec3 R = reflect(-V, N);
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 2.6);

  // Studio "environment": soft top light + two moving strip lights
  float top = smoothstep(-0.25, 0.95, R.y);
  float strip1 = smoothstep(0.86, 0.99, sin(R.x * 3.2 + uTime * 0.25) * 0.5 + 0.5);
  float strip2 = smoothstep(0.9, 1.0, sin(R.z * 4.0 - R.y * 2.0 - uTime * 0.18) * 0.5 + 0.5);
  vec3 col = mix(vec3(0.025), vec3(0.62), top * 0.55);
  col += vec3(0.95) * strip1 * 0.65 + vec3(0.8) * strip2 * 0.35;

  // Thin-film sheen on grazing angles
  vec3 film = 0.5 + 0.5 * cos(6.28318 * (fres * 1.1 + vDisp * 1.8 + vec3(0.0, 0.33, 0.67)));
  col += fres * mix(vec3(1.0), film, 0.6) * 0.85;

  // Brand accent: faint emerald bounce from below
  col += vec3(0.08, 0.42, 0.28) * smoothstep(0.1, -0.9, R.y) * 0.28;

  col = pow(col, vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Liquid-chrome kinetic sculpture (three.js). Renders only while visible,
 * follows the pointer, and morphs with section scroll progress.
 */
export default function KineticSculpture({
  progressRef,
  still = false,
  onError,
  className,
}: KineticSculptureProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !small,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      onError?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // ── Liquid sculpture ──
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.2 },
      uFreq: { value: 0.7 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };
    const geometry = new THREE.IcosahedronGeometry(1.25, small ? 36 : 72);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
    });
    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // ── Orbiting particle ring ──
    const count = small ? 900 : 2200;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.05 + (Math.random() - 0.5) * 0.55;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    ringGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const ringMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: uniforms.uTime, uSize: { value: small ? 2.2 : 2.6 } },
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uSize;
        attribute float aSeed; varying float vA;
        void main(){
          vec3 p = position;
          p.y += sin(uTime * 0.8 + aSeed * 12.0) * 0.06;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (0.6 + aSeed) * (6.0 / -mv.z);
          vA = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 1.6 + aSeed * 30.0));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(vec3(1.0), (1.0 - d * 2.0) * vA * 0.55);
        }`,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    ring.rotation.x = 1.15;
    ring.rotation.z = 0.3;
    scene.add(ring);

    // ── Sizing ──
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      // Keep the sculpture framed on narrow canvases
      camera.position.z = w / h < 1 ? 6.2 / Math.max(w / h, 0.62) : 6.2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ── Pointer (smoothed) ──
    const target = new THREE.Vector2(0, 0);
    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      );
      target.clampLength(0, 1.2);
    };
    const onLeave = () => target.set(0, 0);
    if (!coarse) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    // ── Loop (only while on screen and tab visible) ──
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let elapsed = 0;

    const renderFrame = (dt: number) => {
      elapsed += dt;
      const p = progressRef?.current ?? 0.5;
      uniforms.uTime.value = elapsed;
      uniforms.uPointer.value.lerp(target, 0.06);
      // Scroll shapes the form: calmer at the edges, most fluid mid-section
      uniforms.uAmp.value = 0.13 + Math.sin(Math.PI * Math.min(Math.max(p, 0), 1)) * 0.11;
      uniforms.uFreq.value = 0.62 + p * 0.28;
      blob.rotation.y = elapsed * 0.12 + p * 1.6 + uniforms.uPointer.value.x * 0.35;
      blob.rotation.x = Math.sin(elapsed * 0.2) * 0.15 - uniforms.uPointer.value.y * 0.3;
      ring.rotation.y = elapsed * 0.08 + p * 0.8;
      renderer.render(scene, camera);
    };

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

    if (still) {
      elapsed = 2.4;
      renderFrame(0);
    }

    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { rootMargin: "100px" }
    );
    io.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      onError?.();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef, still, onError]);

  return <div ref={hostRef} className={className} />;
}
