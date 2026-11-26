import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import {
  ArrowRight,
  ScanFace,
  Scissors,
  Sliders,
  Eye,
  Frown,
  Sparkles,
  Check,
  ArrowUpRight,
  Sparkle,
} from "../lib/icons.js"
import { Head3D, HeadThumb } from "../components/Head3D.js"
import { Badge, Button, Eyebrow, ProductCard, cx } from "../components/ui.js"
import { go } from "../lib/store.js"
import { CUTS, PRODUCTS } from "../lib/data.js"
const HERO = {
  cut: "repicado",
  length: 3,
  color: "#3d2418",
  texture: "ondulado",
  style: "natural",
  face: "oval",
}
export default function Landing() {
  const yaw = pageValue("yaw", -28)
  const setYaw = pageSetter("yaw")
  return html`<div>
      
      <section class="relative overflow-hidden bg-ink text-white">
        <div class="absolute inset-0 grain-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]"></div>
        <div class="absolute -right-40 top-0 size-[720px] rounded-full bg-violet/30 blur-[140px]"></div>
        <div class="relative mx-auto grid max-w-7xl items-center gap-6 px-5 pb-16 pt-14 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
          <div class="rise">
            ${Badge({ tone: "light", children: html`${Sparkles({ size: 12 })}Simulador 3D capilar` })}
            <h1 class="mt-6 font-display text-[clamp(2.8rem,7vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Descubra seu próximo visual <span class="bg-gradient-to-r from-violet to-lilac bg-clip-text text-transparent">antes de mudar.</span>
            </h1>
            <p class="mt-7 max-w-lg text-lg leading-relaxed text-white/65">Explore cortes, cores e estilos em 3D e encontre novas possibilidades para o seu cabelo.</p>
            <div class="mt-9 flex flex-wrap gap-3">
              ${Button({ size: "lg", iconRight: ArrowRight({ size: 18 }), onClick: () => go("simulador"), children: html`Começar simulação` })}
              ${Button({ size: "lg", variant: "outline-light", onClick: () => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" }), children: html`Como funciona` })}
            </div>
            <div class="mt-12 flex gap-10 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-wider text-white/45">
              <div><div class="font-display text-3xl normal-case tracking-tight text-white">120+</div>cortes e estilos</div>
              <div><div class="font-display text-3xl normal-case tracking-tight text-white">40</div>cores e tons</div>
              <div><div class="font-display text-3xl normal-case tracking-tight text-white">360°</div>visão completa</div>
            </div>
          </div>

          <div class="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[620px]">
            <div class="absolute inset-x-8 bottom-6 h-16 rounded-[50%] bg-violet/40 blur-3xl"></div>
            ${Head3D({ hair: HERO, yaw: yaw, onYaw: setYaw, autoRotate: true, className: "absolute inset-0" })}
            <div class="pointer-events-none absolute inset-x-[22%] top-[10%] bottom-[16%]">
              <div class="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-lilac to-transparent"${attr("style", { animation: "scan 4.5s ease-in-out infinite" })}></div>
            </div>
            ${Float({ className: "left-0 top-[12%] sm:-left-4", label: "Corte", value: "Repicado m\u00E9dio", icon: Scissors({ size: 14 }) })}
            ${Float({ className: "right-0 top-[30%] sm:-right-2", label: "Cor", value: "Castanho 04", dot: "#3d2418", delay: "1s" })}
            ${Float({ className: "left-2 bottom-[22%] sm:-left-6", label: "Formato do rosto", value: "Oval \u00B7 1 : 1.32", icon: ScanFace({ size: 14 }), delay: "2s" })}
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Arraste para girar</div>
          </div>
        </div>
      </section>

      
      <section class="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        ${Eyebrow({ children: html`O problema` })}
        <h2 class="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Já imaginou mudar o cabelo e o resultado não ser o que você esperava?</h2>
        <div class="mt-14 grid gap-4 md:grid-cols-4">
          ${Step({ n: "01", title: "Refer\u00EAncia", text: "Voc\u00EA encontra o corte perfeito na internet.", hair: { cut: "longo", length: 4, color: "#d9b36c", texture: "ondulado", style: "natural", face: "oval" } })}
          ${Step({ n: "02", title: "Expectativa", text: "Imagina o mesmo resultado em voc\u00EA.", hair: { cut: "longo", length: 4, color: "#d9b36c", texture: "ondulado", style: "natural", face: "oval" }, glow: true })}
          ${Step({ n: "03", title: "Resultado", text: "Cabelo, rosto e textura s\u00E3o diferentes.", hair: { cut: "curto", length: 1, color: "#8a5a3a", texture: "crespo", style: "franja", face: "redondo" }, bad: true })}
          ${Step({ n: "04", title: "Frustra\u00E7\u00E3o", text: "Meses esperando o cabelo crescer de novo.", icon: Frown({ size: 44, strokeWidth: 1.2 }) })}
        </div>
      </section>

      
      <section class="bg-mist py-24 md:py-32">
        <div class="mx-auto max-w-7xl px-5 md:px-8">
          <div class="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              ${Eyebrow({ children: html`A solução` })}
              <h2 class="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Veja antes. Escolha antes. <span class="text-violet">Mude com mais confiança.</span></h2>
            </div>
            <p class="max-w-md text-lg text-ink/60 lg:justify-self-end">A Hairstyle usa modelos 3D para você testar cortes, cores e texturas considerando as proporções do seu rosto. Teste antes de transformar.</p>
          </div>
          <div class="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            ${[CUTS[4], CUTS[2], CUTS[3], CUTS[0]].map(
              (
                c,
                i,
              ) => html`<div${attr("data-key", c.id)}${attr("class", cx("overflow-hidden rounded-3xl bg-white", i % 2 && "md:translate-y-8"))}>
                <div class="aspect-[5/6] bg-gradient-to-b from-lilac-soft to-white">
                  ${HeadThumb({ hair: { ...HERO, cut: c.id, length: c.length, color: ["#3d2418", "#d9b36c", "#1a1416", "#8a4dff"][i], texture: ["ondulado", "liso", "liso", "cacheado"][i] }, yaw: -30 + i * 14, className: "h-full w-full object-contain" })}
                </div>
                <div class="flex items-center justify-between p-4">
                  <span class="font-display text-lg font-medium tracking-tight">${c.name}</span>
                  <span class="grid size-6 place-items-center rounded-full bg-violet text-white">${Check({ size: 13 })}</span>
                </div>
              </div>`,
            )}
          </div>
        </div>
      </section>

      
      <section id="como-funciona" class="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        ${Eyebrow({ children: html`Como funciona` })}
        <h2 class="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Quatro passos até o seu próximo visual.</h2>
        <div class="mt-14 grid border-t border-ink/10 md:grid-cols-4">
          ${[
            [
              ScanFace,
              "01",
              "Conheça seu perfil",
              "Informe características do cabelo e do formato do rosto.",
            ],
            [
              Scissors,
              "02",
              "Escolha seu estilo",
              "Explore cortes, cores, comprimentos e texturas.",
            ],
            [
              Sliders,
              "03",
              "Personalize",
              "Combine diferentes características do cabelo.",
            ],
            [
              Eye,
              "04",
              "Visualize",
              "Veja o resultado em um modelo 3D e compare possibilidades.",
            ],
          ].map(([Icon, n, t, d], i) => {
            const I = Icon
            return html`<div${attr("data-key", n)}${attr("class", cx("group relative py-10 md:px-7", i > 0 && "md:border-l md:border-ink/10", "border-b border-ink/10 md:border-b-0"))}>
                <div class="flex items-center justify-between">
                  <span class="grid size-14 place-items-center rounded-2xl bg-ink text-white transition group-hover:bg-violet">${I({ size: 24, strokeWidth: 1.5 })}</span>
                  <span class="font-mono text-sm text-ink/35">${n}</span>
                </div>
                <h3 class="mt-8 font-display text-2xl font-semibold tracking-tight">${t}</h3>
                <p class="mt-2 text-[15px] leading-relaxed text-ink/60">${d}</p>
              </div>`
          })}
        </div>
      </section>

      
      <section class="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div class="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:p-14 lg:grid-cols-2">
          <div>
            ${Eyebrow({ light: true, children: html`Explore seu estilo` })}
            <h2 class="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-5xl">Encontre um estilo que combina com você.</h2>
            <p class="mt-5 max-w-md text-white/60">Cortes, cores, comprimentos, texturas e penteados em um catálogo feito para experimentar.</p>
            <div class="mt-8 flex flex-wrap gap-3">
              ${Button({ variant: "light", iconRight: ArrowUpRight({ size: 16 }), onClick: () => go("estilos"), children: html`Ver estilos` })}
              ${Button({ variant: "outline-light", onClick: () => go("rosto"), children: html`Personalizar rosto` })}
            </div>
          </div>
          <div class="flex justify-center -space-x-10">
            ${[0, 1, 2].map(
              (
                i,
              ) => html`<div${attr("data-key", i)}${attr("class", cx("w-36 overflow-hidden rounded-3xl border border-white/10 bg-graphite sm:w-44", i === 1 && "z-10 -translate-y-4 scale-110"))}>
                ${HeadThumb({ hair: { ...HERO, cut: ["longo", "repicado", "degrade"][i], color: ["#8a4dff", "#3d2418", "#d9b36c"][i], length: [4, 3, 1][i] }, yaw: [-50, -20, 25][i], className: "aspect-[5/6] w-full object-contain" })}
              </div>`,
            )}
          </div>
        </div>
      </section>

      
      <section class="bg-mist py-24 md:py-28">
        <div class="mx-auto max-w-7xl px-5 md:px-8">
          <div class="flex flex-wrap items-end justify-between gap-6">
            <div>
              ${Eyebrow({ children: html`Cuidados capilares` })}
              <h2 class="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] md:text-5xl">Seu cabelo também precisa de cuidados.</h2>
            </div>
            ${Button({ variant: "dark", iconRight: ArrowRight({ size: 16 }), onClick: () => go("cuidados"), children: html`Ver rotina` })}
          </div>
          <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            ${PRODUCTS.slice(0, 3).map((p) => ProductCard({ p: p }))}
          </div>
        </div>
      </section>

      
      <section class="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div class="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] border border-ink/10 p-8 md:p-14">
          <div class="max-w-xl">
            ${Badge({ tone: "soft", children: html`Para profissionais` })}
            <h2 class="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">Uma nova forma de apresentar possibilidades aos seus clientes.</h2>
          </div>
          ${Button({ size: "lg", onClick: () => go("profissionais"), iconRight: ArrowRight({ size: 18 }), children: html`Conhecer a plataforma` })}
        </div>
      </section>

      
      <section class="relative overflow-hidden bg-gradient-to-br from-violet to-[#8a5cff] py-24 text-center text-white">
        ${Sparkle({ className: "absolute left-[12%] top-[22%] text-white/30", size: 36 })}
        ${Sparkle({ className: "absolute right-[14%] bottom-[20%] text-white/30", size: 56 })}
        <div class="relative mx-auto max-w-3xl px-5">
          <h2 class="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">Ajudamos você a visualizar seu próximo estilo antes de transformar seu cabelo.</h2>
          ${Button({ size: "lg", variant: "light", className: "mt-10", onClick: () => go("simulador"), children: html`Experimentar agora` })}
        </div>
      </section>
    </div>`
}
function Float({ label, value, icon, dot, className, delay = "0s" }) {
  return html`<div${attr("class", cx("floaty absolute flex items-center gap-2.5 rounded-2xl border border-white/12 bg-ink/65 px-3.5 py-2.5 backdrop-blur-xl", className))}${attr("style", { animationDelay: delay })}>
      <span class="grid size-7 place-items-center rounded-full bg-violet/30 text-lilac">${
        dot
          ? html`<span class="size-3.5 rounded-full border border-white/40"${attr("style", { background: dot })}></span>`
          : icon
      }</span>
      <div>
        <div class="font-mono text-[10px] uppercase tracking-wider text-white/45">${label}</div>
        <div class="text-[13px] font-medium">${value}</div>
      </div>
    </div>`
}
function Step({ n, title, text, hair, bad, glow, icon }) {
  return html`<div class="relative">
      <div${attr("class", cx("relative aspect-[4/5] overflow-hidden rounded-3xl border", bad ? "border-ink/10 bg-ink/5 grayscale-[.6]" : glow ? "border-violet/40 bg-lilac-soft" : "border-ink/10 bg-mist", !hair && "grid place-items-center bg-ink text-lilac"))}>
        ${
          hair
            ? HeadThumb({
                hair: hair,
                yaw: bad ? 30 : -25,
                className: cx(
                  "h-full w-full object-contain",
                  bad && "opacity-80",
                ),
              })
            : icon
        }
        ${glow && html`<span class="absolute right-3 top-3">${Sparkles({ size: 18, className: "text-violet" })}</span>`}
        <span class="absolute left-3 top-3 font-mono text-xs text-ink/40">${n}</span>
      </div>
      <h3 class="mt-4 font-display text-xl font-semibold tracking-tight">${title}</h3>
      <p class="text-sm text-ink/60">${text}</p>
      ${n !== "04" && ArrowRight({ className: "absolute -right-3.5 top-1/3 z-10 hidden size-6 rounded-full bg-white p-1 text-violet shadow md:block" })}
    </div>`
}
