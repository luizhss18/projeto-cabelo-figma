import { useState } from "react";
import { Bookmark, GitCompare, Scissors, Ruler, Palette, Waves, Shirt, ScanFace, Check } from "lucide-react";
import { Head3D } from "../components/Head3D";
import { Badge, Button, CutCard, Field, Modal, ModelControls, Tabs, cx } from "../components/ui";
import { COLORS, CUTS, LENGTHS, STYLES, TEXTURES, colorName, cutName, faceName, textureName } from "../lib/data";
import { go, useApp } from "../lib/store";
import type { Hair } from "../lib/head";

type Tab = "corte" | "comprimento" | "cor" | "textura" | "estilo";

export default function Simulator() {
  const { hair, setHair, saveLook, setCompare, compare } = useApp();
  const [tab, setTab] = useState<Tab>("corte");
  const [yaw, setYaw] = useState(-25);
  const [zoom, setZoom] = useState(1);
  const [auto, setAuto] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("Meu novo visual");
  const [saved, setSaved] = useState(false);
  const set = (p: Partial<Hair>) => setHair((h) => ({ ...h, ...p }));

  const tabs = [
    { id: "corte" as Tab, label: "Corte", icon: <Scissors size={15} /> },
    { id: "comprimento" as Tab, label: "Comprimento", icon: <Ruler size={15} /> },
    { id: "cor" as Tab, label: "Cor", icon: <Palette size={15} /> },
    { id: "textura" as Tab, label: "Textura", icon: <Waves size={15} /> },
    { id: "estilo" as Tab, label: "Estilo", icon: <Shirt size={15} /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col lg:grid lg:h-[calc(100vh-68px)] lg:grid-cols-[1fr_430px]">
      {/* STAGE */}
      <section className="relative h-[58vh] min-h-[400px] overflow-hidden bg-ink lg:h-auto">
        <div className="absolute inset-0 grain-grid opacity-80 [mask-image:radial-gradient(ellipse_at_50%_45%,black,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[120px]" />
        <Head3D hair={hair} yaw={yaw} zoom={zoom} autoRotate={auto} onYaw={setYaw} className="absolute inset-0" />

        <div className="absolute left-4 top-4 flex flex-col gap-2 sm:left-6 sm:top-6">
          <Badge tone="light"><span className="size-1.5 rounded-full bg-lilac" />Modelo 3D · arraste para girar</Badge>
        </div>

        <div className="absolute right-4 top-4 hidden w-60 rounded-2xl border border-white/12 bg-ink/60 p-4 text-white backdrop-blur-xl sm:block sm:right-6 sm:top-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-lilac"><ScanFace size={13} />Seu perfil</div>
          <dl className="mt-3 space-y-2 text-[13px]">
            <Row k="Formato do rosto" v={faceName(hair.face)} />
            <Row k="Tipo de cabelo" v={`${textureName(hair.texture)} · ${["1", "2", "3", "4"][TEXTURES.findIndex((t) => t.id === hair.texture)]}`} />
          </dl>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
            {[cutName(hair.cut), LENGTHS[hair.length], colorName(hair.color)].map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/85">{t}</span>
            ))}
          </div>
          <button onClick={() => go("rosto")} className="mt-3 text-xs text-lilac hover:underline">Ajustar características →</button>
        </div>

        <div className="absolute inset-x-0 bottom-4 flex justify-center px-3 sm:bottom-6">
          <ModelControls yaw={yaw} setYaw={setYaw} zoom={zoom} setZoom={setZoom} auto={auto} setAuto={setAuto} />
        </div>
      </section>

      {/* PANEL */}
      <aside className="flex min-h-0 flex-col border-l border-ink/8 bg-white">
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Personalizar</h2>
            <Badge tone="soft">Passo 3 de 4</Badge>
          </div>
          <Tabs items={tabs} value={tab} onChange={setTab} className="mt-4 -mx-5 px-3" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {tab === "corte" && (
            <div className="grid grid-cols-2 gap-3">
              {CUTS.map((c) => (
                <CutCard key={c.id} hair={{ ...hair, cut: c.id, length: c.length }} title={c.name} desc={c.desc} selected={hair.cut === c.id} onClick={() => set({ cut: c.id, length: c.length })} />
              ))}
            </div>
          )}
          {tab === "comprimento" && (
            <div>
              <p className="text-sm text-ink/55">Ajuste o comprimento dos fios nas laterais e na nuca.</p>
              <div className="mt-6 px-1">
                <input type="range" min={0} max={4} step={1} value={hair.length} onChange={(e) => set({ length: +e.target.value })} aria-label="Comprimento" className="w-full accent-violet" />
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase text-ink/40">{LENGTHS.map((l) => <span key={l}>{l.slice(0, 4)}</span>)}</div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <CutCard key={i} hair={{ ...hair, length: i }} title={LENGTHS[i]} selected={hair.length === i} onClick={() => set({ length: i })} />
                ))}
              </div>
            </div>
          )}
          {tab === "cor" && (
            <div className="space-y-6">
              {["Naturais", "Fantasia"].map((g) => (
                <div key={g}>
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink/45">{g === "Fantasia" ? "Tons fantasia" : g}</div>
                  <div className="grid grid-cols-3 gap-3">
                    {COLORS.filter((c) => c.group === g).map((c) => {
                      const on = hair.color === c.hex;
                      return (
                        <button key={c.hex} onClick={() => set({ color: c.hex })} aria-pressed={on} className={cx("rounded-2xl border p-2 text-left transition", on ? "border-violet ring-4 ring-violet/15" : "border-ink/10 hover:border-ink/30")}>
                          <span className="relative block h-14 rounded-xl" style={{ background: `linear-gradient(135deg, ${c.hex}, ${c.hex}cc 60%, #ffffff55)` }}>
                            {on && <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-white text-violet"><Check size={12} /></span>}
                          </span>
                          <span className="mt-2 block px-1 text-xs font-medium">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <label className="flex items-center justify-between rounded-2xl border border-dashed border-ink/20 p-3 text-sm">
                Cor personalizada
                <input type="color" value={hair.color} onChange={(e) => set({ color: e.target.value })} className="h-9 w-14 cursor-pointer rounded-lg border-0 bg-transparent" />
              </label>
            </div>
          )}
          {tab === "textura" && (
            <div className="grid grid-cols-2 gap-3">
              {TEXTURES.map((t) => <CutCard key={t.id} hair={{ ...hair, texture: t.id }} title={t.name} desc={t.desc} selected={hair.texture === t.id} onClick={() => set({ texture: t.id })} />)}
            </div>
          )}
          {tab === "estilo" && (
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((t) => <CutCard key={t.id} hair={{ ...hair, style: t.id }} yaw={t.id === "coque" || t.id === "rabo" ? 150 : -28} title={t.name} desc={t.desc} selected={hair.style === t.id} onClick={() => set({ style: t.id })} />)}
            </div>
          )}
        </div>

        <div className="border-t border-ink/8 bg-white p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-ink/55">
            <span>{cutName(hair.cut)} · {LENGTHS[hair.length]} · {textureName(hair.texture)}</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border border-ink/15" style={{ background: hair.color }} />{colorName(hair.color)}</span>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" icon={<Bookmark size={17} />} onClick={() => { setSaved(false); setSaveOpen(true); }}>Salvar visual</Button>
            <Button variant="outline" icon={<GitCompare size={17} />} onClick={() => { setCompare([{ ...hair }, compare[1]]); go("comparar"); }}>Comparar</Button>
          </div>
        </div>
      </aside>

      <Modal open={saveOpen} onClose={() => setSaveOpen(false)} title={saved ? "Visual salvo" : "Salvar visual"}>
        {saved ? (
          <div>
            <p className="text-ink/60">“{name}” foi adicionado aos seus estilos salvos.</p>
            <div className="mt-6 flex gap-2">
              <Button className="flex-1" onClick={() => go("perfil")}>Ver meus estilos</Button>
              <Button variant="outline" onClick={() => setSaveOpen(false)}>Continuar</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); saveLook(name); setSaved(true); }}>
            <Field label="Nome do visual" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <Button type="submit" className="mt-5 w-full">Salvar</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-3"><dt className="text-white/50">{k}</dt><dd className="font-medium">{v}</dd></div>
);
