import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildHead, disposeGroup, renderThumb, setupLights, type Hair } from "../lib/head";

type Props = {
  hair: Hair;
  yaw?: number;
  zoom?: number;
  autoRotate?: boolean;
  onYaw?: (deg: number) => void;
  className?: string;
};

export function Head3D({ hair, yaw = -25, zoom = 1, autoRotate = false, onYaw, className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const st = useRef({ yaw: yaw, target: yaw, zoom, autoRotate, hair, dragging: false, group: null as THREE.Group | null, scene: null as THREE.Scene | null });
  st.current.autoRotate = autoRotate;
  st.current.zoom = zoom;

  useEffect(() => {
    st.current.target = yaw;
  }, [yaw]);

  useEffect(() => {
    const s = st.current;
    if (!s.scene) return;
    if (s.group) {
      s.scene.remove(s.group);
      disposeGroup(s.group);
    }
    s.group = buildHead(hair);
    s.group.rotation.y = (s.yaw * Math.PI) / 180;
    s.scene.add(s.group);
  }, [hair]);

  useEffect(() => {
    const el = host.current!;
    const s = st.current;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
    const scene = new THREE.Scene();
    s.scene = scene;
    setupLights(scene);
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    const group = buildHead(s.hair);
    s.group = group;
    scene.add(group);

    const resize = () => {
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 400;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let lastX = 0;
    const dom = renderer.domElement;
    const down = (e: PointerEvent) => {
      s.dragging = true;
      lastX = e.clientX;
      dom.setPointerCapture(e.pointerId);
      dom.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.target += (e.clientX - lastX) * 0.6;
      lastX = e.clientX;
      onYawRef.current?.(s.target);
    };
    const up = () => {
      s.dragging = false;
      dom.style.cursor = "grab";
    };
    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    dom.addEventListener("pointerup", up);
    dom.addEventListener("pointercancel", up);

    let raf = 0;
    let dist = 7.4;
    const loop = () => {
      if (s.autoRotate && !s.dragging) s.target += 0.22;
      s.yaw += (s.target - s.yaw) * 0.12;
      if (s.group) s.group.rotation.y = (s.yaw * Math.PI) / 180;
      dist += (7.4 / s.zoom - dist) * 0.12;
      cam.position.set(0, 0.6, dist);
      cam.lookAt(0, 0.3, 0);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (s.group) disposeGroup(s.group);
      s.scene = null;
      renderer.dispose();
      renderer.forceContextLoss();
      dom.remove();
    };
  }, []);

  const onYawRef = useRef(onYaw);
  onYawRef.current = onYaw;
  st.current.hair = hair;

  return <div ref={host} className={className} />;
}

export function HeadThumb({ hair, yaw = -28, className = "" }: { hair: Hair; yaw?: number; className?: string }) {
  const [src, setSrc] = useState<string>("");
  const key = JSON.stringify([hair, yaw]);
  useEffect(() => {
    let ok = true;
    const id = requestAnimationFrame(() => {
      if (ok) setSrc(renderThumb(hair, yaw));
    });
    return () => {
      ok = false;
      cancelAnimationFrame(id);
    };
  }, [key]);
  return src ? <img src={src} alt="Modelo 3D de cabelo" className={className} draggable={false} /> : <div className={className} />;
}
