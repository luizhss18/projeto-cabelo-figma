import { ArrowRight, Info } from "lucide-react";
import { HeadThumb } from "../components/Head3D";
import { Badge, Button, Card, Chip, Eyebrow } from "../components/ui";
import { FACES, LENGTHS, TEXTURES } from "../lib/data";
import { go, useApp } from "../lib/store";

export default function Face() {
  const { hair, setHair } = useApp();
  const face = FACES.find((f) => f.id === hair.face)!;
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <Eyebrow>Etapa 01 · Conheça seu perfil</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Explore estilos considerando suas características.</h1>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-6">
          <div className="absolute inset-0 grain-grid opacity-70" />
          <div className="relative mx-auto aspect-[5/6] max-w-[440px]">
            <HeadThumb hair={{ ...hair }} yaw={0} className="absolute inset-0 h-full w-full object-contain" />
            <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full" fill="none">
              {[38, 56, 74].map((y) => <line key={y} x1="14" x2="86" y1={y} y2={y} stroke="#B78CFF" strokeWidth=".25" strokeDasharray="1.5 1.5" />)}
              <line x1="50" x2="50" y1="14" y2="100" stroke="#B78CFF" strokeWidth=".25" strokeDasharray="1.5 1.5" />
              <ellipse cx="50" cy="56" rx="26" ry="36" stroke="#6C3BFF" strokeWidth=".5" />
              <line x1="24" x2="76" y1="56" y2="56" stroke="#fff" strokeWidth=".35" />
              {[24, 76].map((x) => <circle key={x} cx={x} cy="56" r="1.2" fill="#B78CFF" />)}
            </svg>
            <Tag className="left-0 top-[26%]" k="Testa" />
            <Tag className="right-0 top-[45%]" k="Maçãs do rosto" />
            <Tag className="left-0 top-[66%]" k="Mandíbula" />
          </div>
          <div className="relative mt-4 flex items-center justify-between text-white">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-lilac">Proporção largura : altura</div>
              <div className="font-display text-3xl font-semibold tracking-tight">{face.ratio}</div>
            </div>
            <Badge tone="light">Formato {face.name}</Badge>
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <h3 className="font-display text-xl font-semibold tracking-tight">Formato do rosto</h3>
            <p className="mt-1 text-sm text-ink/60">{face.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FACES.map((f) => <Chip key={f.id} selected={hair.face === f.id} onClick={() => setHair({ ...hair, face: f.id })}>{f.name}</Chip>)}
            </div>
          </Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <h3 className="font-display text-lg font-semibold tracking-tight">Tipo de cabelo</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {TEXTURES.map((t) => <Chip key={t.id} selected={hair.texture === t.id} onClick={() => setHair({ ...hair, texture: t.id })}>{t.name}</Chip>)}
              </div>
            </Card>
            <Card>
              <h3 className="font-display text-lg font-semibold tracking-tight">Comprimento atual</h3>
              <div className="mt-5">
                <input type="range" min={0} max={4} value={hair.length} onChange={(e) => setHair({ ...hair, length: +e.target.value })} className="w-full accent-violet" aria-label="Comprimento atual" />
                <div className="mt-2 text-sm font-medium">{LENGTHS[hair.length]}</div>
              </div>
            </Card>
          </div>
          <Card>
            <h3 className="font-display text-lg font-semibold tracking-tight">Proporções</h3>
            <div className="mt-4 space-y-3">
              {[["Testa", 70], ["Maçãs do rosto", 84], ["Mandíbula", face.id === "quadrado" ? 88 : face.id === "coracao" ? 52 : 68]].map(([l, v]) => (
                <div key={l as string}>
                  <div className="mb-1.5 flex justify-between text-xs text-ink/60"><span>{l}</span><span className="font-mono">{v}%</span></div>
                  <div className="h-1.5 rounded-full bg-ink/8"><div className="h-full rounded-full bg-gradient-to-r from-violet to-lilac" style={{ width: `${v}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>
          <div className="flex items-start gap-3 rounded-2xl bg-lilac-soft/60 p-4 text-sm text-ink/70">
            <Info size={18} className="mt-0.5 shrink-0 text-violet" />
            Essas informações ajudam a visualizar diferentes cortes no modelo 3D. São uma referência visual e não um diagnóstico ou garantia de resultado.
          </div>
          <Button size="lg" className="w-full" iconRight={<ArrowRight size={18} />} onClick={() => go("simulador")}>Explorar estilos no simulador</Button>
        </div>
      </div>
    </div>
  );
}

const Tag = ({ k, className }: { k: string; className: string }) => (
  <span className={`absolute rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/80 backdrop-blur ${className}`}>{k}</span>
);
