import { useState } from "react";
import { ArrowRight, ScanFace, Scissors, Sliders, Eye, Frown, Sparkles, Check, ArrowUpRight, Sparkle } from "lucide-react";
import { Head3D, HeadThumb } from "../components/Head3D";
import { Badge, Button, Eyebrow, ProductCard, cx } from "../components/ui";
import { go } from "../lib/store";
import { CUTS, PRODUCTS } from "../lib/data";
import type { Hair } from "../lib/head";

const HERO: Hair = { cut: "repicado", length: 3, color: "#3d2418", texture: "ondulado", style: "natural", face: "oval" };

export default function Landing() {
  const [yaw, setYaw] = useState(-28);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 grain-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
        <div className="absolute -right-40 top-0 size-[720px] rounded-full bg-violet/30 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 pb-16 pt-14 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
          <div className="rise">
            <Badge tone="light"><Sparkles size={12} />Simulador 3D capilar</Badge>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Descubra seu próximo visual <span className="bg-gradient-to-r from-violet to-lilac bg-clip-text text-transparent">antes de mudar.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/65">Explore cortes, cores e estilos em 3D e encontre novas possibilidades para o seu cabelo.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" iconRight={<ArrowRight size={18} />} onClick={() => go("simulador")}>Começar simulação</Button>
              <Button size="lg" variant="outline-light" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>Como funciona</Button>
            </div>
            <div className="mt-12 flex gap-10 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-wider text-white/45">
              <div><div className="font-display text-3xl normal-case tracking-tight text-white">120+</div>cortes e estilos</div>
              <div><div className="font-display text-3xl normal-case tracking-tight text-white">40</div>cores e tons</div>
              <div><div className="font-display text-3xl normal-case tracking-tight text-white">360°</div>visão completa</div>
            </div>
          </div>

          <div className="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[620px]">
            <div className="absolute inset-x-8 bottom-6 h-16 rounded-[50%] bg-violet/40 blur-3xl" />
            <Head3D hair={HERO} yaw={yaw} onYaw={setYaw} autoRotate className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-[22%] top-[10%] bottom-[16%]">
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-lilac to-transparent" style={{ animation: "scan 4.5s ease-in-out infinite" }} />
            </div>
            <Float className="left-0 top-[12%] sm:-left-4" label="Corte" value="Repicado médio" icon={<Scissors size={14} />} />
            <Float className="right-0 top-[30%] sm:-right-2" label="Cor" value="Castanho 04" dot="#3d2418" delay="1s" />
            <Float className="left-2 bottom-[22%] sm:-left-6" label="Formato do rosto" value="Oval · 1 : 1.32" icon={<ScanFace size={14} />} delay="2s" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Arraste para girar</div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Eyebrow>O problema</Eyebrow>
        <h2 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Já imaginou mudar o cabelo e o resultado não ser o que você esperava?</h2>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          <Step n="01" title="Referência" text="Você encontra o corte perfeito na internet." hair={{ cut: "longo", length: 4, color: "#d9b36c", texture: "ondulado", style: "natural", face: "oval" }} />
          <Step n="02" title="Expectativa" text="Imagina o mesmo resultado em você." hair={{ cut: "longo", length: 4, color: "#d9b36c", texture: "ondulado", style: "natural", face: "oval" }} glow />
          <Step n="03" title="Resultado" text="Cabelo, rosto e textura são diferentes." hair={{ cut: "curto", length: 1, color: "#8a5a3a", texture: "crespo", style: "franja", face: "redondo" }} bad />
          <Step n="04" title="Frustração" text="Meses esperando o cabelo crescer de novo." icon={<Frown size={44} strokeWidth={1.2} />} />
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="bg-mist py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>A solução</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Veja antes. Escolha antes. <span className="text-violet">Mude com mais confiança.</span></h2>
            </div>
            <p className="max-w-md text-lg text-ink/60 lg:justify-self-end">A Hairstyle usa modelos 3D para você testar cortes, cores e texturas considerando as proporções do seu rosto. Teste antes de transformar.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[CUTS[4], CUTS[2], CUTS[3], CUTS[0]].map((c, i) => (
              <div key={c.id} className={cx("overflow-hidden rounded-3xl bg-white", i % 2 && "md:translate-y-8")}>
                <div className="aspect-[5/6] bg-gradient-to-b from-lilac-soft to-white">
                  <HeadThumb hair={{ ...HERO, cut: c.id, length: c.length, color: ["#3d2418", "#d9b36c", "#1a1416", "#8a4dff"][i], texture: (["ondulado", "liso", "liso", "cacheado"] as const)[i] }} yaw={-30 + i * 14} className="h-full w-full object-contain" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="font-display text-lg font-medium tracking-tight">{c.name}</span>
                  <span className="grid size-6 place-items-center rounded-full bg-violet text-white"><Check size={13} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Eyebrow>Como funciona</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Quatro passos até o seu próximo visual.</h2>
        <div className="mt-14 grid border-t border-ink/10 md:grid-cols-4">
          {[
            [ScanFace, "01", "Conheça seu perfil", "Informe características do cabelo e do formato do rosto."],
            [Scissors, "02", "Escolha seu estilo", "Explore cortes, cores, comprimentos e texturas."],
            [Sliders, "03", "Personalize", "Combine diferentes características do cabelo."],
            [Eye, "04", "Visualize", "Veja o resultado em um modelo 3D e compare possibilidades."],
          ].map(([Icon, n, t, d], i) => {
            const I = Icon as typeof Eye;
            return (
              <div key={n as string} className={cx("group relative py-10 md:px-7", i > 0 && "md:border-l md:border-ink/10", "border-b border-ink/10 md:border-b-0")}>
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-ink text-white transition group-hover:bg-violet"><I size={24} strokeWidth={1.5} /></span>
                  <span className="font-mono text-sm text-ink/35">{n as string}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">{t as string}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ESTILOS CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:p-14 lg:grid-cols-2">
          <div>
            <Eyebrow light>Explore seu estilo</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-5xl">Encontre um estilo que combina com você.</h2>
            <p className="mt-5 max-w-md text-white/60">Cortes, cores, comprimentos, texturas e penteados em um catálogo feito para experimentar.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="light" iconRight={<ArrowUpRight size={16} />} onClick={() => go("estilos")}>Ver estilos</Button>
              <Button variant="outline-light" onClick={() => go("rosto")}>Personalizar rosto</Button>
            </div>
          </div>
          <div className="flex justify-center -space-x-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className={cx("w-36 overflow-hidden rounded-3xl border border-white/10 bg-graphite sm:w-44", i === 1 && "z-10 -translate-y-4 scale-110")}>
                <HeadThumb hair={{ ...HERO, cut: (["longo", "repicado", "degrade"] as const)[i], color: ["#8a4dff", "#3d2418", "#d9b36c"][i], length: [4, 3, 1][i] }} yaw={[-50, -20, 25][i]} className="aspect-[5/6] w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUIDADOS */}
      <section className="bg-mist py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Cuidados capilares</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] md:text-5xl">Seu cabelo também precisa de cuidados.</h2>
            </div>
            <Button variant="dark" iconRight={<ArrowRight size={16} />} onClick={() => go("cuidados")}>Ver rotina</Button>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* PROFISSIONAIS */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] border border-ink/10 p-8 md:p-14">
          <div className="max-w-xl">
            <Badge tone="soft">Para profissionais</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">Uma nova forma de apresentar possibilidades aos seus clientes.</h2>
          </div>
          <Button size="lg" onClick={() => go("profissionais")} iconRight={<ArrowRight size={18} />}>Conhecer a plataforma</Button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet to-[#8a5cff] py-24 text-center text-white">
        <Sparkle className="absolute left-[12%] top-[22%] text-white/30" size={36} />
        <Sparkle className="absolute right-[14%] bottom-[20%] text-white/30" size={56} />
        <div className="relative mx-auto max-w-3xl px-5">
          <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">Ajudamos você a visualizar seu próximo estilo antes de transformar seu cabelo.</h2>
          <Button size="lg" variant="light" className="mt-10" onClick={() => go("simulador")}>Experimentar agora</Button>
        </div>
      </section>
    </div>
  );
}

function Float({ label, value, icon, dot, className, delay = "0s" }: { label: string; value: string; icon?: React.ReactNode; dot?: string; className: string; delay?: string }) {
  return (
    <div className={cx("floaty absolute flex items-center gap-2.5 rounded-2xl border border-white/12 bg-ink/65 px-3.5 py-2.5 backdrop-blur-xl", className)} style={{ animationDelay: delay }}>
      <span className="grid size-7 place-items-center rounded-full bg-violet/30 text-lilac">{dot ? <span className="size-3.5 rounded-full border border-white/40" style={{ background: dot }} /> : icon}</span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">{label}</div>
        <div className="text-[13px] font-medium">{value}</div>
      </div>
    </div>
  );
}

function Step({ n, title, text, hair, bad, glow, icon }: { n: string; title: string; text: string; hair?: Hair; bad?: boolean; glow?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className={cx("relative aspect-[4/5] overflow-hidden rounded-3xl border", bad ? "border-ink/10 bg-ink/5 grayscale-[.6]" : glow ? "border-violet/40 bg-lilac-soft" : "border-ink/10 bg-mist", !hair && "grid place-items-center bg-ink text-lilac")}>
        {hair ? <HeadThumb hair={hair} yaw={bad ? 30 : -25} className={cx("h-full w-full object-contain", bad && "opacity-80")} /> : icon}
        {glow && <span className="absolute right-3 top-3"><Sparkles size={18} className="text-violet" /></span>}
        <span className="absolute left-3 top-3 font-mono text-xs text-ink/40">{n}</span>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-ink/60">{text}</p>
      {n !== "04" && <ArrowRight className="absolute -right-3.5 top-1/3 z-10 hidden size-6 rounded-full bg-white p-1 text-violet shadow md:block" />}
    </div>
  );
}
