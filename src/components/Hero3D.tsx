"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Bachelors_Buddy — 3D shared-flat diorama (hero).
 * Rotating room with bed / desk / kitchen pods and three expense
 * rings (rent, food, bills). Auto-plays on first load, drag to
 * rotate, one still frame under prefers-reduced-motion, pauses
 * off-screen. Uses the `three` package already in package.json.
 */
export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 5.2, 8.8);
    camera.lookAt(0, 0.6, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffe0b3, 1.3);
    key.position.set(4, 8, 5);
    scene.add(key);

    const world = new THREE.Group();
    scene.add(world);

    const mat = (color: number, roughness = 0.7) =>
      new THREE.MeshStandardMaterial({ color, roughness });
    const box = (w: number, h: number, d: number, color: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
      m.position.set(x, y, z);
      world.add(m);
      return m;
    };

    // Floor + low back walls.
    box(6.4, 0.2, 4.6, 0x8a6d4b, 0, -0.1, 0);
    box(6.4, 1.4, 0.15, 0xf3e2c7, 0, 0.7, -2.3);
    box(0.15, 1.4, 4.6, 0xe8d3ae, -3.2, 0.7, 0);

    // Bed pod (left): frame + mattress + pillow.
    box(1.9, 0.35, 1.1, 0xea580c, -1.9, 0.28, -1.3);
    box(1.8, 0.22, 1.0, 0xfff7ed, -1.9, 0.55, -1.3);
    box(0.55, 0.14, 0.8, 0xfdba74, -2.5, 0.7, -1.3);
    // Desk pod (centre back): top + legs + laptop slab.
    box(1.6, 0.08, 0.8, 0x92400e, 0.3, 0.75, -1.7);
    box(0.08, 0.75, 0.08, 0x78350f, -0.4, 0.38, -1.7);
    box(0.08, 0.75, 0.08, 0x78350f, 1.0, 0.38, -1.7);
    box(0.7, 0.05, 0.5, 0x1e293b, 0.3, 0.82, -1.7);
    // Kitchen pod (right): counter + fridge + hob.
    box(1.5, 0.9, 0.9, 0x0f766e, 2.0, 0.45, -1.2);
    box(1.5, 0.06, 0.9, 0xf8fafc, 2.0, 0.93, -1.2);
    box(0.7, 1.5, 0.7, 0x94a3b8, 2.5, 0.75, 0.6);
    box(0.5, 0.04, 0.5, 0x334155, 1.7, 0.98, -1.2);

    // Three expense rings floating above the room: rent / food / bills.
    const rings: THREE.Mesh[] = [];
    const ringColors = [0xf97316, 0xf59e0b, 0xeab308];
    ringColors.forEach((c, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5 + i * 0.45, 0.07, 12, 64),
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.35, metalness: 0.4, emissive: c, emissiveIntensity: 0.25 })
      );
      ring.rotation.x = Math.PI / 2 - 0.35;
      ring.position.y = 2.4 + i * 0.35;
      world.add(ring);
      rings.push(ring);
      // A coin on each ring.
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24),
        new THREE.MeshStandardMaterial({ color: 0xffd34d, roughness: 0.25, metalness: 0.8 })
      );
      coin.position.set(1.5 + i * 0.45, 2.4 + i * 0.35, 0);
      coin.userData.ring = i;
      world.add(coin);
      rings.push(coin);
    });

    let rotY = 0;
    let targetRotY = 0;
    let dragging = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      targetRotY += (e.clientX - lastX) * 0.008;
      lastX = e.clientX;
    };
    const onUp = () => { dragging = false; };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const resize = () => {
      const w = canvas.clientWidth || 800;
      const h = canvas.clientHeight || 340;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    let visible = true;
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.02 });
    io.observe(canvas);

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = 0;
      const t = clock.getElapsedTime();
      if (!dragging) targetRotY += 0.0016;
      rotY += (targetRotY - rotY) * 0.08;
      world.rotation.y = rotY;
      rings.forEach((r, i) => {
        if (r.geometry instanceof THREE.TorusGeometry) r.rotation.z = t * (0.25 + i * 0.06);
      });
      renderer.render(scene, camera);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { clock.getDelta(); raf = requestAnimationFrame(frame); } };
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    if (reduced) frame();
    else kick();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas
        id="hero3d"
        ref={canvasRef}
        aria-label="3D shared flat: a rotating room with bed, desk and kitchen pods and three expense rings"
        className="h-[340px] w-full rounded-3xl border border-white/20 bg-gradient-to-b from-orange-950/40 to-transparent shadow-2xl"
      />
      <p className="mt-3 text-center text-sm text-[#2D2D2D]/75">
        Your flat in 3D — bed, desk, kitchen, and the three rings every flat shares: rent, food, bills. Drag to look around.
      </p>
      <p className="mt-1 text-center text-sm text-[#2D2D2D]/75">
        <a href="#features" className="underline underline-offset-4">↓ See how splitting works</a>
      </p>
    </div>
  );
}
