import * as THREE from "three";

export type Hair = {
  cut: "curto" | "medio" | "longo" | "degrade" | "repicado" | "classico";
  length: number; // 0..4
  color: string;
  texture: "liso" | "ondulado" | "cacheado" | "crespo";
  style: "natural" | "coque" | "rabo" | "franja";
  face: "oval" | "redondo" | "quadrado" | "coracao" | "alongado";
};

const FACE: Record<Hair["face"], [number, number, number]> = {
  oval: [0.86, 1.08, 0.74],
  redondo: [0.98, 1.0, 0.95],
  quadrado: [0.94, 1.0, 0.92],
  coracao: [0.9, 1.04, 0.66],
  alongado: [0.8, 1.2, 0.78],
};
const LEN_H = [0, 0.45, 1.0, 1.75, 2.45];
const VOL = [1, 1.03, 1.08, 1.17];
const BUMPS = [0, 110, 260, 480];
const BUMP_R = [0, 0.1, 0.13, 0.16];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildHead(h: Hair) {
  const g = new THREE.Group();
  const [fx, fy, jaw] = FACE[h.face];
  const skin = new THREE.MeshStandardMaterial({ color: 0xe9e5f0, roughness: 0.5, metalness: 0.04 });
  const hairMat = new THREE.MeshStandardMaterial({
    color: h.color,
    roughness: 0.32,
    metalness: 0.12,
    side: THREE.DoubleSide,
  });
  const tex = ["liso", "ondulado", "cacheado", "crespo"].indexOf(h.texture);
  const vol = VOL[tex];
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, p: [number, number, number], s: [number, number, number] = [1, 1, 1], r: [number, number, number] = [0, 0, 0]) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...p);
    m.scale.set(...s);
    m.rotation.set(...r);
    g.add(m);
    return m;
  };

  add(new THREE.SphereGeometry(1, 64, 48), skin, [0, 0.2, 0], [fx, fy, 0.98]);
  add(new THREE.SphereGeometry(1, 48, 32), skin, [0, -0.42, 0.14], [fx * 0.8, 0.62, 0.8 + jaw * 0.1]);
  add(new THREE.SphereGeometry(1, 24, 16), skin, [0, 0.0, 0.95], [0.1, 0.24, 0.13], [0.25, 0, 0]);
  add(new THREE.SphereGeometry(1, 24, 16), skin, [0, -0.15, 1.0], [0.13, 0.08, 0.1]);
  for (const s of [-1, 1]) add(new THREE.SphereGeometry(1, 20, 16), skin, [s * fx * 0.98, 0.12, -0.02], [0.08, 0.24, 0.14]);
  add(new THREE.CylinderGeometry(0.34, 0.4, 1.2, 32), skin, [0, -1.0, -0.05]);
  add(new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), skin, [0, -1.55, -0.05], [1.75, 0.6, 0.85]);

  // hair cap
  const capLen = h.cut === "degrade" ? 0.5 : h.cut === "classico" ? 0.52 : 0.56;
  const capTilt = h.cut === "degrade" ? -0.22 : -0.45;
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 0.3, -0.1);
  capGroup.rotation.x = capTilt;
  capGroup.scale.set(fx * 1.03 * vol, fy * 1.0 * vol, 1.02 * vol);
  g.add(capGroup);
  const capGeo = new THREE.SphereGeometry(1.07, 56, 36, 0, Math.PI * 2, 0, Math.PI * capLen);
  capGroup.add(new THREE.Mesh(capGeo, hairMat));

  const rand = rng(11);
  const n = BUMPS[tex];
  if (n) {
    const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(BUMP_R[tex], 10, 8), hairMat, n);
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const th = Math.acos(1 - rand() * (1 - Math.cos(Math.PI * capLen - 0.1)));
      const ph = rand() * Math.PI * 2;
      const r = 1.08;
      m.makeTranslation(r * Math.sin(th) * Math.cos(ph), r * Math.cos(th), r * Math.sin(th) * Math.sin(ph));
      inst.setMatrixAt(i, m);
    }
    capGroup.add(inst);
  }

  // side / back curtain
  let len = LEN_H[h.length];
  if (h.cut === "degrade") len = 0.5;
  if (h.cut === "classico") len = Math.min(len, 0.5) || 0.4;
  if (h.cut === "curto") len = Math.min(len, 0.55);
  const arcStart = h.style === "franja" ? 0.8 : 0.95;
  if (len > 0) {
    const fade = h.cut === "degrade";
    const mat = fade ? new THREE.MeshStandardMaterial({ color: h.color, roughness: 0.6, transparent: true, opacity: 0.55, side: THREE.DoubleSide }) : hairMat;
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.0, len > 1.5 ? 0.78 : 0.92, len, 48, 1, true, arcStart, Math.PI * 2 - arcStart * 2), mat);
    cyl.scale.set(fx * 1.04 * vol, 1, 1.0 * vol);
    cyl.position.set(0, 0.45 - len / 2, -0.12);
    g.add(cyl);
    if (n && !fade) {
      const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(BUMP_R[tex] * 1.1, 10, 8), hairMat, Math.round(n * 0.6 * Math.min(1, len / 1.2)));
      const m = new THREE.Matrix4();
      for (let i = 0; i < inst.count; i++) {
        const a = arcStart + rand() * (Math.PI * 2 - arcStart * 2);
        const y = 0.45 - rand() * len;
        m.makeTranslation(Math.sin(a) * fx * 1.06 * vol, y, Math.cos(a) * 1.02 * vol - 0.12);
        inst.setMatrixAt(i, m);
      }
      g.add(inst);
    }
    if (h.cut === "repicado" && len > 0.9) {
      const cone = new THREE.InstancedMesh(new THREE.ConeGeometry(0.075, 0.34, 8), hairMat, 40);
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0));
      for (let i = 0; i < 40; i++) {
        const a = arcStart + (i / 39) * (Math.PI * 2 - arcStart * 2);
        const rb = len > 1.5 ? 0.78 : 0.92;
        m.compose(new THREE.Vector3(Math.sin(a) * rb * fx * 1.04 * vol, 0.45 - len - 0.08 - (i % 3) * 0.06, Math.cos(a) * rb * vol - 0.12), q, new THREE.Vector3(1, 1 + (i % 3) * 0.5, 1));
        cone.setMatrixAt(i, m);
      }
      g.add(cone);
    }
  }

  if (h.cut === "degrade") add(new THREE.SphereGeometry(1, 40, 28), hairMat, [0, 1.2, -0.02], [0.72 * fx, 0.42 + h.length * 0.06, 0.88]);
  if (h.cut === "classico") add(new THREE.SphereGeometry(1, 40, 28), hairMat, [fx * 0.22, 1.1, 0.42], [0.62, 0.26, 0.5], [0.4, 0, -0.35]);

  if (h.style === "coque") add(new THREE.SphereGeometry(0.44, 32, 24), hairMat, [0, 1.3, -0.72]);
  if (h.style === "rabo") add(new THREE.CapsuleGeometry(0.2, 1.5, 8, 20), hairMat, [0, -0.15, -1.15], [1, 1, 1], [-0.12, 0, 0]);
  if (h.style === "franja") add(new THREE.SphereGeometry(1, 40, 24), hairMat, [0, 0.82, 0.62], [fx * 0.98, 0.3, 0.5], [0.35, 0, 0]);

  g.traverse((o) => {
    (o as THREE.Mesh).castShadow = false;
  });
  return g;
}

export function setupLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xb78cff, 3.2);
  rim.position.set(-4, 2, -3);
  const fill = new THREE.DirectionalLight(0x6c3bff, 0.9);
  fill.position.set(-3, -1, 4);
  scene.add(key, rim, fill);
}

export function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose();
  });
}

let shared: THREE.WebGLRenderer | null = null;
const cache = new Map<string, string>();

export function renderThumb(h: Hair, yawDeg = -28): string {
  const key = JSON.stringify([h, yawDeg]);
  const hit = cache.get(key);
  if (hit) return hit;
  if (!shared) {
    shared = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    shared.setSize(300, 360, false);
    shared.setPixelRatio(1);
    shared.outputColorSpace = THREE.SRGBColorSpace;
  }
  const scene = new THREE.Scene();
  setupLights(scene);
  const head = buildHead(h);
  head.rotation.y = (yawDeg * Math.PI) / 180;
  scene.add(head);
  const cam = new THREE.PerspectiveCamera(30, 300 / 360, 0.1, 50);
  cam.position.set(0, 0.55, 7.4);
  cam.lookAt(0, 0.3, 0);
  shared.render(scene, cam);
  const url = shared.domElement.toDataURL("image/png");
  disposeGroup(head);
  cache.set(key, url);
  return url;
}
