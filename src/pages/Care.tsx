import { useState } from "react";
import { Droplets, Sun, Wind, Sparkles, Check, Moon } from "lucide-react";
import { Badge, Button, Card, Chip, Eyebrow, ProductCard, Tabs } from "../components/ui";
import { PRODUCTS, TEXTURES } from "../lib/data";
import { go, useApp } from "../lib/store";

const ROUTINE = [
  { d: "Seg", t: "Lavar", i: Droplets, n: "Shampoo Equilíbrio + condicionador" },
  { d: "Qua", t: "Hidratar", i: Sparkles, n: "Máscara de hidratação profunda, 10 min" },
  { d: "Sex", t: "Lavar", i: Droplets, n: "Shampoo + leave-in de definição" },
  { d: "Dom", t: "Descanso", i: Moon, n: "Finalizar com óleo nas pontas" },
];
const TIPS = [
  [Sun, "Proteja do sol e do calor", "Use protetor térmico antes de secador e chapinha."],
  [Wind, "Seque com delicadeza", "Prefira toalha de microfibra e evite torcer os fios."],
  [Droplets, "Água morna, não quente", "Água muito quente resseca e opaca a fibra capilar."],
];

export default function Care() {
  const { hair, setHair } = useApp();
  const [f, setF] = useState("Todos");
  const cats = ["Todos", "Limpeza", "Tratamento", "Finalização", "Proteção"];
  const list = PRODUCTS.filter((p) => f === "Todos" || p.cat === f);
  const t = TEXTURES.find((x) => x.id === hair.texture)!;
  return (
    <div>
      <div className="bg-mist">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <Eyebrow>Cuidados capilares</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Seu cabelo também precisa de cuidados.</h1>
          <p className="mt-5 max-w-xl text-lg text-ink/60">Informe o tipo do seu cabelo e encontre produtos e rotinas relacionados às suas características.</p>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            <Card className="bg-ink! text-white">
              <Badge tone="light">Meu tipo de cabelo</Badge>
              <div className="mt-5 font-display text-5xl font-semibold tracking-tight">{t.name}</div>
              <div className="font-mono text-xs uppercase tracking-wider text-lilac">{t.desc}</div>
              <div className="mt-6 flex flex-wrap gap-2">
                {TEXTURES.map((x) => <Chip key={x.id} dark selected={hair.texture === x.id} onClick={() => setHair({ ...hair, texture: x.id })}>{x.name}</Chip>)}
              </div>
              <ul className="mt-7 space-y-2.5 text-sm text-white/70">
                {["Hidratação semanal", "Finalização com leave-in", "Proteção térmica sempre"].map((x) => <li key={x} className="flex items-center gap-2"><Check size={15} className="text-lilac" />{x}</li>)}
              </ul>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold tracking-tight">Rotina de cuidados</h3>
                <Badge>Semana</Badge>
              </div>
              <div className="mt-5 divide-y divide-ink/8">
                {ROUTINE.map((r) => (
                  <div key={r.d} className="flex items-center gap-4 py-3.5">
                    <span className="w-10 font-mono text-xs uppercase text-ink/40">{r.d}</span>
                    <span className="grid size-10 place-items-center rounded-xl bg-lilac-soft text-violet"><r.i size={18} /></span>
                    <div><div className="text-[15px] font-medium">{r.t}</div><div className="text-sm text-ink/55">{r.n}</div></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>Produtos recomendados</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Selecionados para cabelo {t.name.toLowerCase()}</h2>
          </div>
          <Tabs variant="pill" value={f} onChange={setF} items={cats.map((c) => ({ id: c, label: c }))} />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        <div className="mt-24">
          <Eyebrow>Dicas</Eyebrow>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {TIPS.map(([I, h, d]) => {
              const Ic = I as typeof Sun;
              return (
                <div key={h as string} className="rounded-3xl border border-ink/8 p-6">
                  <Ic size={22} className="text-violet" />
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{h as string}</h3>
                  <p className="mt-2 text-sm text-ink/60">{d as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center"><Button onClick={() => go("simulador")}>Testar um novo visual</Button></div>
        </div>
      </div>
    </div>
  );
}
