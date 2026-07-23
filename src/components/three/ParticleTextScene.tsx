"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  DEFAULT_THEME,
  PARTICLE_THEMES,
  THEME_KEYS,
  type ThemeKey,
} from "@/data/themes";

const TEXT = "DevClub";

const MAX_HOME_RADIUS = 45;


const PERFORMANCE_BREAKPOINT = 768;
const LAYOUT_BREAKPOINT = 1024;
const DESKTOP_PARTICLES = 10000;
const MOBILE_PARTICLES = 4000;

/** Acima deste tempo de pressão, o clique vira charge em vez de pulse. */
const CHARGE_THRESHOLD_MS = 200;

const BLOOM = { strength: 0.6, radius: 0.4, threshold: 0.85 };

const PARTICLE_SIZE = 0.85;

const MAX_PARTICLE_BRIGHTNESS = 0.38;

const FRAMING = {
  desktop: { widthFraction: 0.42, centerFraction: 0.71 },
  mobile: { widthFraction: 0.68, centerFraction: 0.5 },
};

const INTRO_FRAMING = {
  desktop: { widthFraction: 0.54, centerFraction: 0.5 },
  mobile: { widthFraction: 0.82, centerFraction: 0.5 },
};

const INTRO_SCATTER_RADIUS = 180;
const INTRO_ANTICIPATION_SECONDS = 0.4;
const INTRO_CONVERGE_SECONDS = 1.25;
const INTRO_HOLD_SECONDS = 1.25;
const INTRO_REFRAME_SECONDS = 0.95;
const INTRO_REVEAL_LEAD_SECONDS = 0.45;
const INTRO_LERP_SCALE = 1.15;
const INTRO_PULSE_SCALE = 0.93;
const INTRO_OPACITY_START = 0.22;

const TAP_SLOP_PX = 12;

const DOUBLE_TAP_MS = 320;

const TILT_LIMIT_DEG = 12;

interface SampledPoint {
  x: number;
  y: number;
}

interface SampleResult {
  points: SampledPoint[];
  halfWidth: number;
  halfHeight: number;
  count: number;
  fontUsed: string;
}

const FONT_WEIGHT = 700;
const FONT_SIZE = 200;
const MIN_VIABLE_POINTS = 2000;


function sampleTextPoints(
  text: string,
  fontFamily: string,
  targetRadius: number,
): SampleResult {
  const empty: SampleResult = {
    points: [], halfWidth: 0, halfHeight: 0, count: 0, fontUsed: "",
  };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return empty;

  const requested = `${FONT_WEIGHT} ${FONT_SIZE}px ${fontFamily}`;
  ctx.font = requested;
  const font = ctx.font.includes(`${FONT_SIZE}px`)
    ? requested
    : `${FONT_WEIGHT} ${FONT_SIZE}px sans-serif`;
  ctx.font = font;

  const measured = ctx.measureText(text).width;
  if (!Number.isFinite(measured) || measured < FONT_SIZE) return empty;

  const width = Math.ceil(measured) + 40;
  const height = Math.ceil(FONT_SIZE * 1.6);
  canvas.width = width;
  canvas.height = height;

  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, width / 2, height / 2);

  const pixels = ctx.getImageData(0, 0, width, height).data;
  const points: SampledPoint[] = [];
  const step = 2;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (pixels[(y * width + x) * 4 + 3] > 128) points.push({ x, y });
    }
  }
  if (points.length === 0) return empty;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  let maxDistance = 0;
  for (const p of points) {
    const distance = Math.hypot(p.x - centerX, p.y - centerY);
    if (distance > maxDistance) maxDistance = distance;
  }
  const scale = targetRadius / maxDistance;

  return {
    points: points.map((p) => ({
      x: (p.x - centerX) * scale,
      y: -(p.y - centerY) * scale,
    })),
    halfWidth: ((maxX - minX) / 2) * scale,
    halfHeight: ((maxY - minY) / 2) * scale,
    count: points.length,
    fontUsed: font,
  };
}

async function ensureFontLoaded(fontFamily: string, text: string) {
  const spec = `${FONT_WEIGHT} ${FONT_SIZE}px ${fontFamily}`;
  try {
    await document.fonts.load(spec, text);
  } catch {
  }
  await document.fonts.ready;
}

interface ParticleTextSceneProps {
  className?: string;
  playIntro?: boolean;
  onRevealStart?: () => void;
}

export function ParticleTextScene({
  className,
  playIntro = false,
  onRevealStart,
}: ParticleTextSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hintVisible, setHintVisible] = useState(!playIntro);
  const dismissHintRef = useRef(() => setHintVisible(false));
  const revealHintRef = useRef(() => setHintVisible(true));
  const onRevealStartRef = useRef(onRevealStart);

  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
  }, [onRevealStart]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let disposeScene: (() => void) | null = null;

    const init = async () => {
      const fontFamily =
        getComputedStyle(mount).fontFamily || "system-ui, sans-serif";
      await ensureFontLoaded(fontFamily, TEXT);
      if (disposed || !mountRef.current) return;

      const isLowPower = window.innerWidth < PERFORMANCE_BREAKPOINT;
      const particleCount = isLowPower ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
      const usesStackedLayout = () => window.innerWidth < LAYOUT_BREAKPOINT;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let width = mount.clientWidth;
      let height = mount.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1500);
      camera.position.z = 90;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.04;
      controls.rotateSpeed = 0.3;
      controls.minDistance = 30;
      controls.maxDistance = 300;
      controls.enablePan = false;
      controls.autoRotate = false;
      controls.enabled = !usesStackedLayout();
      controls.minAzimuthAngle = THREE.MathUtils.degToRad(-40);
      controls.maxAzimuthAngle = THREE.MathUtils.degToRad(40);
      controls.minPolarAngle = THREE.MathUtils.degToRad(70);
      controls.maxPolarAngle = THREE.MathUtils.degToRad(110);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = isLowPower
        ? null
        : new UnrealBloomPass(
            new THREE.Vector2(width, height),
            BLOOM.strength,
            BLOOM.radius,
            BLOOM.threshold,
          );
      if (bloomPass) composer.addPass(bloomPass);
      composer.addPass(new OutputPass());

      let sample = sampleTextPoints(TEXT, fontFamily, MAX_HOME_RADIUS);
      if (sample.count < MIN_VIABLE_POINTS) {
        sample = sampleTextPoints(TEXT, "sans-serif", MAX_HOME_RADIUS);
      }
      if (sample.count === 0 || disposed) return;
      const sampled = sample.points;
      sampled.sort((a, b) => a.x - b.x);

      let time = 0;
      let disintegrationStartTime = 0;
      let disintegrationEnabled = true;
      let positionLerpScale = 1;
      let shockwaves: Array<{
        t0: number;
        amplitude: number;
        speed: number;
        width: number;
        decay: number;
      }> = [];

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const targetPositions = new Float32Array(particleCount * 3);
      const disintegrationOffsets = new Float32Array(particleCount * 3);

      function getHomePosition(particleIndex: number) {
        const pointIndex = Math.floor(
          (particleIndex / particleCount) * sampled.length,
        );
        const point = sampled[Math.min(pointIndex, sampled.length - 1)];
        const jitter = 0.6;
        return new THREE.Vector3(
          point.x + (Math.random() - 0.5) * jitter,
          point.y + (Math.random() - 0.5) * jitter,
          (Math.random() - 0.5) * 3,
        );
      }

      let currentTheme: ThemeKey = DEFAULT_THEME;
      const paletteFor = (key: ThemeKey) =>
        PARTICLE_THEMES[key].palette.map((hex) => new THREE.Color(hex));
      let palette = paletteFor(currentTheme);

      function getAttributesForParticle(i: number, colorList: THREE.Color[]) {
        const t = i / particleCount;
        const colorProgress =
          (t * colorList.length * 1.5 + time * 0.05) % colorList.length;
        const colorIndex1 = Math.floor(colorProgress);
        const colorIndex2 = (colorIndex1 + 1) % colorList.length;
        const blendFactor = colorProgress - colorIndex1;
        const baseColor = new THREE.Color().lerpColors(
          colorList[colorIndex1],
          colorList[colorIndex2],
          blendFactor,
        );
        const color = baseColor.clone().multiplyScalar(0.65 + Math.random() * 0.55);
        const size = 0.65 + Math.random() * 0.6;
        return { color, size };
      }

      function createParticleTexture() {
        const canvas = document.createElement("canvas");
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const center = size / 2;
        const radius = size * 0.5;

        const gradient = ctx.createRadialGradient(
          center, center, 0,
          center, center, radius,
        );
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.25, "rgba(255,255,255,0.85)");
        gradient.addColorStop(0.6, "rgba(255,255,255,0.25)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      }

      const introEnabled = playIntro && !prefersReducedMotion;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const home = getHomePosition(i);
        if (introEnabled) {
          const scatterPhi = Math.random() * Math.PI * 2;
          const scatterTheta = Math.acos(2 * Math.random() - 1);
          const scatterRadius = INTRO_SCATTER_RADIUS * (0.55 + Math.random() * 0.45);
          positions[i3] = Math.sin(scatterTheta) * Math.cos(scatterPhi) * scatterRadius;
          positions[i3 + 1] = Math.sin(scatterTheta) * Math.sin(scatterPhi) * scatterRadius;
          positions[i3 + 2] = Math.cos(scatterTheta) * scatterRadius * 0.6;
        } else {
          positions[i3] = home.x;
          positions[i3 + 1] = home.y;
          positions[i3 + 2] = home.z;
        }
        targetPositions[i3] = home.x;
        targetPositions[i3 + 1] = home.y;
        targetPositions[i3 + 2] = home.z;

        const { color, size } = getAttributesForParticle(i, palette);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        sizes[i] = size;

        const offsetStrength = 30 + Math.random() * 40;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.acos(2 * Math.random() - 1);
        disintegrationOffsets[i3] = Math.sin(theta) * Math.cos(phi) * offsetStrength;
        disintegrationOffsets[i3 + 1] = Math.sin(theta) * Math.sin(phi) * offsetStrength;
        disintegrationOffsets[i3 + 2] = Math.cos(theta) * offsetStrength * 0.5;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("targetPosition", new THREE.BufferAttribute(targetPositions, 3));
      geometry.setAttribute("disintegrationOffset", new THREE.BufferAttribute(disintegrationOffsets, 3));

      const particleTexture = createParticleTexture();
      const material = new THREE.PointsMaterial({
        size: PARTICLE_SIZE,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        alphaTest: 0.01,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const applyBloomForTheme = (key: ThemeKey) => {
        if (!bloomPass) return;
        const bloom = PARTICLE_THEMES[key].bloom;
        bloomPass.strength = bloom.strength;
        bloomPass.radius = bloom.radius;
        bloomPass.threshold = bloom.threshold;
      };
    
      const applyTheme = (key: ThemeKey) => {
        currentTheme = key;
        palette = paletteFor(key);
        applyBloomForTheme(key);
        document.documentElement.setAttribute("data-theme", key);

        const col = geometry.attributes.color.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const { color } = getAttributesForParticle(i, palette);
          col[i * 3] = color.r;
          col[i * 3 + 1] = color.g;
          col[i * 3 + 2] = color.b;
        }
        geometry.attributes.color.needsUpdate = true;
      };
      applyTheme(currentTheme);

      const framingState = { progress: introEnabled ? 0 : 1 };
      const introState = {
        lerpScale: 0,
        cloudScale: 1,
        opacity: INTRO_OPACITY_START,
      };
      disintegrationEnabled = !introEnabled;
      positionLerpScale = introEnabled ? 0 : 1;

      const applyIntroState = () => {
        positionLerpScale = introState.lerpScale;
        points.scale.setScalar(introState.cloudScale);
        material.opacity = introState.opacity;
      };

      if (introEnabled) applyIntroState();

      const applyFraming = () => {
        const stacked = usesStackedLayout();
        const target = stacked ? FRAMING.mobile : FRAMING.desktop;
        const start = stacked ? INTRO_FRAMING.mobile : INTRO_FRAMING.desktop;
        const blend = framingState.progress;

        const widthFraction = THREE.MathUtils.lerp(
          start.widthFraction,
          target.widthFraction,
          blend,
        );
        const centerFraction = THREE.MathUtils.lerp(
          start.centerFraction,
          target.centerFraction,
          blend,
        );

        controls.enabled = !stacked && blend === 1;
        const vFov = THREE.MathUtils.degToRad(60);
        const aspect = width / height;

        const forWidth =
          sample.halfWidth / (widthFraction * Math.tan(vFov / 2) * aspect);
        const forHeight = sample.halfHeight / (0.34 * Math.tan(vFov / 2));
        const distance = Math.max(forWidth, forHeight);

        camera.position.setLength(distance);
        camera.updateProjectionMatrix();

        const shiftPx = (centerFraction - 0.5) * width;
        if (Math.abs(shiftPx) < 0.5) {
          camera.clearViewOffset();
          camera.updateProjectionMatrix();
        } else {
          camera.setViewOffset(width, height, -shiftPx, 0, width, height);
        }
      };
      applyFraming();

      const onResize = () => {
        if (!mountRef.current) return;
        width = mountRef.current.clientWidth;
        height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        renderer.setSize(width, height);
        composer.setSize(width, height);
        applyFraming();
      };
      window.addEventListener("resize", onResize);

      function triggerShockwave(
        opts: { amplitude?: number; speed?: number; width?: number; decay?: number } = {},
      ) {
        const { amplitude = 12, speed = 28, width: w = 6, decay = 1.25 } = opts;
        shockwaves.push({ t0: time, amplitude, speed, width: w, decay });
        if (shockwaves.length > 6) shockwaves.shift();
      }

      let lastThemeCycleAt = 0;
    
      const cycleTheme = () => {
        const now = performance.now();
        if (now - lastThemeCycleAt < 500) return;
        lastThemeCycleAt = now;

        const nextIndex = (THEME_KEYS.indexOf(currentTheme) + 1) % THEME_KEYS.length;
        applyTheme(THEME_KEYS[nextIndex]);
      };

      let chargeStart: number | null = null;
      let pointerStart = { x: 0, y: 0 };
      let lastTapAt = 0;

      const onPointerDown = (event: PointerEvent) => {
        chargeStart = performance.now();
        pointerStart = { x: event.clientX, y: event.clientY };
        dismissHintRef.current();        
        if (event.pointerType === "touch") void requestTiltPermission();
      };

      const onPointerUp = (event: PointerEvent) => {
        if (chargeStart === null) return;
        const heldMs = performance.now() - chargeStart;
        chargeStart = null;

        const moved = Math.hypot(
          event.clientX - pointerStart.x,
          event.clientY - pointerStart.y,
        );
        if (moved > TAP_SLOP_PX) return;
        
        const now = performance.now();
        if (event.pointerType === "touch" && now - lastTapAt < DOUBLE_TAP_MS) {
          lastTapAt = 0;
          cycleTheme();
          return;
        }
        lastTapAt = now;

        if (heldMs < CHARGE_THRESHOLD_MS) {
          triggerShockwave({ amplitude: 12, speed: 28, width: 6, decay: 1.25 });
          return;
        }
        const heldSec = Math.min(heldMs / 1000, 2.0);
        triggerShockwave({
          amplitude: 10 + heldSec * 15,
          width: 5 + heldSec * 4,
          speed: 28 + heldSec * 6,
          decay: 1.35,
        });
      };

      const onPointerCancel = () => {
        chargeStart = null;
      };

      const canvasEl = renderer.domElement;
      canvasEl.addEventListener("pointerdown", onPointerDown);
      canvasEl.addEventListener("pointerup", onPointerUp);
      canvasEl.addEventListener("pointercancel", onPointerCancel);
      canvasEl.addEventListener("pointerleave", onPointerCancel);
      canvasEl.addEventListener("dblclick", cycleTheme);

      let tiltTargetX = 0;
      let tiltTargetY = 0;
      let tiltX = 0;
      let tiltY = 0;
      let tiltListenerAttached = false;
      let tiltPermissionAsked = false;

      const onDeviceOrientation = (event: DeviceOrientationEvent) => {
        if (event.beta === null || event.gamma === null) return;
        const limit = THREE.MathUtils.degToRad(TILT_LIMIT_DEG);
        tiltTargetY = THREE.MathUtils.clamp(event.gamma / 45, -1, 1) * limit;
        tiltTargetX = THREE.MathUtils.clamp((event.beta - 45) / 45, -1, 1) * limit;
      };

      const attachTiltListener = () => {
        if (tiltListenerAttached) return;
        tiltListenerAttached = true;
        window.addEventListener("deviceorientation", onDeviceOrientation);
      };

      async function requestTiltPermission() {
        if (tiltPermissionAsked) return;
        tiltPermissionAsked = true;

        if (typeof DeviceOrientationEvent === "undefined") return;
        const requestPermission = (
          DeviceOrientationEvent as unknown as {
            requestPermission?: () => Promise<PermissionState>;
          }
        ).requestPermission;

        if (typeof requestPermission !== "function") {
          attachTiltListener();
          return;
        }
        try {
          const state = await requestPermission();
          if (state === "granted") attachTiltListener();
        } catch {
        }
      }

      if (usesStackedLayout() && typeof DeviceOrientationEvent !== "undefined") {
        const needsPrompt =
          typeof (
            DeviceOrientationEvent as unknown as { requestPermission?: unknown }
          ).requestPermission === "function";
        if (!needsPrompt) attachTiltListener();
      }

      let raf = 0;
      const tempTargets = new Float32Array(targetPositions.length);
      const BREATH_RADIANS = THREE.MathUtils.degToRad(10);

      function updateParticles() {
        const pos = geometry.attributes.position.array as Float32Array;
        const tgt = geometry.attributes.targetPosition.array as Float32Array;
        const col = geometry.attributes.color.array as Float32Array;
        const sz = geometry.attributes.size.array as Float32Array;
      
        tempTargets.set(tgt);
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const nextI3 = ((i + 1) % particleCount) * 3;
          const flowFactor =
            Math.sin(time * 0.4 + (i / particleCount) * Math.PI * 10) * 0.005;
          tgt[i3] += (tempTargets[nextI3] - tempTargets[i3]) * flowFactor;
          tgt[i3 + 1] += (tempTargets[nextI3 + 1] - tempTargets[i3 + 1]) * flowFactor;
          tgt[i3 + 2] += (tempTargets[nextI3 + 2] - tempTargets[i3 + 2]) * flowFactor;
        }

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const homeX = tgt[i3];
          const homeY = tgt[i3 + 1];
          const homeZ = tgt[i3 + 2];

          const disintegrationCycleTime = 10.0;
          const particleCycleOffset = (i / particleCount) * disintegrationCycleTime * 0.5;
          const cycleTime = disintegrationEnabled ? time - disintegrationStartTime : 0;
          const cycleProgress =
            ((cycleTime * 0.6 + particleCycleOffset) % disintegrationCycleTime) /
            disintegrationCycleTime;

          let disAmt = 0;
          const stableEnd = 0.5;
          const disFull = stableEnd + 0.15;
          const holdEnd = disFull + 0.1;
          if (cycleProgress < stableEnd) disAmt = 0;
          else if (cycleProgress < disFull) disAmt = (cycleProgress - stableEnd) / (disFull - stableEnd);
          else if (cycleProgress < holdEnd) disAmt = 1.0;
          else disAmt = 1.0 - (cycleProgress - holdEnd) / (1.0 - holdEnd);
          disAmt = Math.sin(disAmt * Math.PI * 0.5);

          let addX = 0, addY = 0, addZ = 0;
          const dist = Math.sqrt(homeX * homeX + homeY * homeY + homeZ * homeZ) + 1e-6;
          for (let w = 0; w < shockwaves.length; w++) {
            const sw = shockwaves[w];
            const elapsed = Math.max(0, time - sw.t0);
            const R = sw.speed * elapsed;
            const sigma = sw.width;
            const decayFactor = Math.exp(-sw.decay * elapsed);
            const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sigma * sigma));
            const amp = sw.amplitude * g * decayFactor;
            addX += (homeX / dist) * amp;
            addY += (homeY / dist) * amp;
            addZ += (homeZ / dist) * amp * 0.6;
          }

          let curTargetX = homeX + addX;
          let curTargetY = homeY + addY;
          let curTargetZ = homeZ + addZ;

          let lerp = 0.085;
          if (disAmt > 0.001) {
            curTargetX += disintegrationOffsets[i3] * disAmt;
            curTargetY += disintegrationOffsets[i3 + 1] * disAmt;
            curTargetZ += disintegrationOffsets[i3 + 2] * disAmt;
            lerp = 0.045 + disAmt * 0.02;
          }

          const appliedLerp = lerp * positionLerpScale;
          pos[i3] += (curTargetX - pos[i3]) * appliedLerp;
          pos[i3 + 1] += (curTargetY - pos[i3 + 1]) * appliedLerp;
          pos[i3 + 2] += (curTargetZ - pos[i3 + 2]) * appliedLerp;

          const { color: baseColor, size } = getAttributesForParticle(i, palette);
          let bright =
            (0.45 + Math.sin((i / particleCount) * Math.PI * 7 + time * 1.3) * 0.22) *
            (1 - disAmt * 0.75);
          bright *= 0.85 + Math.sin(time * 7 + i * 0.5) * 0.15;
          if (bright > MAX_PARTICLE_BRIGHTNESS) bright = MAX_PARTICLE_BRIGHTNESS;

          col[i3] = baseColor.r * bright;
          col[i3 + 1] = baseColor.g * bright;
          col[i3 + 2] = baseColor.b * bright;

          let curSize = size * (1 - disAmt * 0.9);
          curSize *= 0.8 + Math.sin(time * 5 + i * 0.3) * 0.2;
          sz[i] = Math.max(0.05, curSize);
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.targetPosition.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;

        if (shockwaves.length) {
          shockwaves = shockwaves.filter((sw) => {
            const elapsed = time - sw.t0;
            const R = sw.speed * elapsed;
            const expiredByRadius = R - MAX_HOME_RADIUS > 6 * sw.width;
            const expiredByTime = elapsed > 12;
            return !(expiredByRadius || expiredByTime);
          });
        }
      }

      let introTimeline: gsap.core.Timeline | null = null;
      let introStarted = false;
      let introFailsafe = 0;

      const settleIntro = () => {
        introState.lerpScale = 1;
        introState.cloudScale = 1;
        introState.opacity = 1;
        applyIntroState();
        framingState.progress = 1;
        applyFraming();
        onRevealStartRef.current?.();
        revealHintRef.current();
        disintegrationStartTime = time;
        disintegrationEnabled = true;
        positionLerpScale = 1;
      };

      const startIntroSequence = () => {
        window.clearTimeout(introFailsafe);
        introTimeline = gsap.timeline();
        introTimeline
          .to(introState, {
            cloudScale: INTRO_PULSE_SCALE,
            opacity: 0.68,
            duration: INTRO_ANTICIPATION_SECONDS * 0.62,
            ease: "sine.inOut",
            onUpdate: applyIntroState,
          })
          .to(introState, {
            cloudScale: 1,
            duration: INTRO_ANTICIPATION_SECONDS * 0.38,
            ease: "sine.out",
            onUpdate: applyIntroState,
          })
          .to(introState, {
            lerpScale: INTRO_LERP_SCALE,
            opacity: 1,
            duration: INTRO_CONVERGE_SECONDS,
            ease: "power2.inOut",
            onUpdate: applyIntroState,
          })
          .to(framingState, {
            progress: 1,
            duration: INTRO_REFRAME_SECONDS,
            ease: "power3.inOut",
            delay: INTRO_HOLD_SECONDS,
            onUpdate: applyFraming,
          })
          .add(
            () => onRevealStartRef.current?.(),
            `-=${INTRO_REVEAL_LEAD_SECONDS}`,
          )
          .add(() => {
            revealHintRef.current();
            disintegrationStartTime = time;
            disintegrationEnabled = true;
            positionLerpScale = 1;
          });
      };

      function animate() {
        raf = requestAnimationFrame(animate);
        time += 0.02;
        controls.update();

        tiltX += (tiltTargetX - tiltX) * 0.05;
        tiltY += (tiltTargetY - tiltY) * 0.05;

        // A respiração continua sendo a base; o tilt apenas soma sobre ela.
        points.rotation.y = Math.sin(time * 0.25) * BREATH_RADIANS + tiltY;
        points.rotation.x = tiltX;

        updateParticles();
        composer.render();

        if (introEnabled && !introStarted) {
          introStarted = true;
          startIntroSequence();
        }
      }

      if (prefersReducedMotion) {
        controls.enabled = false;
        composer.render();
      } else {
        raf = requestAnimationFrame(animate);
        if (introEnabled) {
          introFailsafe = window.setTimeout(() => {
            if (introStarted) return;
            introStarted = true;
            settleIntro();
          }, 5200);
        }
      }

      disposeScene = () => {
        window.clearTimeout(introFailsafe);
        introTimeline?.kill();
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        canvasEl.removeEventListener("pointerdown", onPointerDown);
        canvasEl.removeEventListener("pointerup", onPointerUp);
        canvasEl.removeEventListener("pointercancel", onPointerCancel);
        canvasEl.removeEventListener("pointerleave", onPointerCancel);
        canvasEl.removeEventListener("dblclick", cycleTheme);
        window.removeEventListener("deviceorientation", onDeviceOrientation);
        controls.dispose();
        geometry.dispose();
        particleTexture.dispose();
        material.dispose();
        bloomPass?.dispose();
        composer.dispose();
        renderer.dispose();
        scene.clear();
        if (canvasEl.parentNode) canvasEl.parentNode.removeChild(canvasEl);
      };
    };

    void init();

    return () => {
      disposed = true;
      disposeScene?.();
    };
  }, [playIntro]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div ref={mountRef} className="absolute inset-0" />
      <p
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[11px] tracking-wide text-gray-500 transition-opacity duration-700 lg:bottom-6 lg:left-[71%]"
        style={{ opacity: hintVisible ? 1 : 0 }}
      >
        <span className="lg:hidden">toque · segure · toque duas vezes</span>
        <span className="hidden lg:inline">clique · segure · dê dois cliques</span>
      </p>
    </div>
  );
}
