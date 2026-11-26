import { useState } from "react";
import { Check, Bookmark } from "lucide-react";
import { Head3D } from "../components/Head3D";
import { Badge, Button, Chip, Modal, cx } from "../components/ui";
import { COLORS, CUTS, LENGTHS, TEXTURES, colorName, cutName, textureName } from "../lib/data";
import { go, useApp } from "../lib/store";
import type { Hair } from "../lib/head";

export default function Compare() {
  const { compare, setCompare, setHair, saveLook } = useApp();
  const [chosen, setChosen] = useState<0 | 1 | null>(null);
  const [saved, setSaved] = useState(false);
  const [yaw, setYaw] = useState(-25);
  const upd = (i: 0 | 1, p: Partial<Hair>) => setCompare(i === 0 ? [{ ...compare[0], ...p }, compare[1]] : [compare[0], { ...compare[1], ...p }]);

  const choose = (i: 0 | 1) => {
    setChosen(i);
    setHair(compare[i]);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Badge>Comparação</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] md:text-6xl">Veja antes. Escolha melhor.</h1>
        </div>
        <Button variant="outline" onClick={() => setYaw(yaw + 90)}>Girar os dois modelos</Button>
      </div>

      <div className="relative mt-10 grid gap-4 md:grid-cols-2">
        {([0, 1] as const).map((i) => {
          const h = compare[i];
          return (
            <section key={i} className={cx("overflow-hidden rounded-[2rem] border-2 transition", chosen === i ? "border-violet" : "border-transparent")}>
              <div className="relative h-[420px] bg-ink md:h-[500px]">
                <div className="absolute inset-0 grain-grid opacity-60" />
                <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[100px]" />
                <Head3D hair={h} yaw={yaw} onYaw={setYaw} className="absolute inset-0" />
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  <Badge tone="light">Visual 0{i + 1}</Badge>
                  {chosen === i && <Badge><Check size={12} />Escolhido</Badge>}
                </div>
              </div>
              <div className="space-y-5 bg-white p-6">
                <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                  {[["Corte", cutName(h.cut)], ["Cor", colorName(h.color)], ["Comprimento", LENGTHS[h.length]], ["Textura", textureName(h.texture)]].map(([k, v]) => (
                    <div key={k}><dt className="font-mono text-[10px] uppercase tracking-wider text-ink/40">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>
                  ))}
                </dl>
                <Row label="Corte">{CUTS.map((c) => <Chip key={c.id} selected={h.cut === c.id} onClick={() => upd(i, { cut: c.id, length: c.length })}>{c.name}</Chip>)}</Row>
                <Row label="Cor">
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => <button key={c.hex} aria-label={c.name} aria-pressed={h.color === c.hex} onClick={() => upd(i, { color: c.hex })} className={cx("size-8 rounded-full border-2 transition", h.color === c.hex ? "border-violet ring-2 ring-violet/30" : "border-white shadow-[0_0_0_1px_rgba(0,0,0,.12)]")} style={{ background: c.hex }} />)}
                  </div>
                </Row>
                <Row label="Comprimento"><input type="range" min={0} max={4} value={h.length} onChange={(e) => upd(i, { length: +e.target.value })} className="w-full accent-violet" aria-label="Comprimento" /></Row>
                <Row label="Textura">{TEXTURES.map((t) => <Chip key={t.id} selected={h.texture === t.id} onClick={() => upd(i, { texture: t.id })}>{t.name}</Chip>)}</Row>
                <Button className="w-full" variant={chosen === i ? "dark" : "primary"} onClick={() => choose(i)}>Escolher este visual</Button>
              </div>
            </section>
          );
        })}
        <div className="pointer-events-none absolute left-1/2 top-[210px] z-10 hidden size-12 -translate-x-1/2 place-items-center rounded-full bg-white font-mono text-xs font-medium shadow-xl md:grid">VS</div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="dark" icon={<Bookmark size={18} />} onClick={() => { saveLook(`Comparação: ${cutName(compare[0].cut)} × ${cutName(compare[1].cut)}`); setSaved(true); }}>Salvar comparação</Button>
        <Button size="lg" variant="outline" onClick={() => go("simulador")}>Voltar ao simulador</Button>
      </div>
      <Modal open={saved} onClose={() => setSaved(false)} title="Comparação salva">
        <p className="text-ink/60">Você pode rever os dois visuais no seu perfil quando quiser.</p>
        <Button className="mt-6 w-full" onClick={() => go("perfil")}>Ir para meu perfil</Button>
      </Modal>
    </div>
  );
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink/40">{label}</div><div className="flex flex-wrap gap-2">{children}</div></div>
);
