import { html, attr } from "../lib/dom.js"
import {
  ArrowRight,
  BadgeCheck,
  Scissors,
  Palette,
  Box,
  Save,
  Share2,
  Users,
} from "../lib/icons.js"
import { HeadThumb } from "../components/Head3D.js"
import { Badge, Button, Eyebrow } from "../components/ui.js"
import { go } from "../lib/store.js"
const A = {
  cut: "longo",
  length: 4,
  color: "#d9b36c",
  texture: "ondulado",
  style: "natural",
  face: "oval",
}
const FEATS = [
  [
    BadgeCheck,
    "Criar perfil profissional",
    "Apresente seu trabalho, especialidades e agenda.",
  ],
  [
    Scissors,
    "Apresentar cortes",
    "Mostre opções no modelo 3D durante o atendimento.",
  ],
  [
    Palette,
    "Testar cores",
    "Simule coloração antes de misturar a primeira mecha.",
  ],
  [
    Box,
    "Utilizar modelos 3D",
    "Gire, amplie e analise cada ângulo com o cliente.",
  ],
  [Save, "Salvar resultados", "Guarde o visual aprovado na ficha do cliente."],
  [
    Share2,
    "Compartilhar o visual",
    "Envie o resultado escolhido para o cliente.",
  ],
]
export default function Pro() {
  return html`<div>
      <section class="relative overflow-hidden bg-ink text-white">
        <div class="absolute inset-0 grain-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div class="absolute -left-32 top-10 size-[500px] rounded-full bg-violet/30 blur-[130px]"></div>
        <div class="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          ${Badge({ tone: "light", children: html`${Users({ size: 12 })}Cabeleireiros · Barbeiros · Salões · Escolas` })}
          <h1 class="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">Uma nova forma de apresentar possibilidades aos seus clientes.</h1>
          <p class="mt-6 max-w-xl text-lg text-white/65">Alinhe expectativas antes da tesoura. A Hairstyle transforma a conversa no balcão em uma decisão visual.</p>
          ${Button({ size: "lg", className: "mt-9", iconRight: ArrowRight({ size: 18 }), onClick: () => go("contato"), children: html`Conhecer a plataforma profissional` })}
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-5 py-24 md:px-8">
        ${Eyebrow({ children: html`No atendimento` })}
        <h2 class="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-[-0.035em] md:text-5xl">Do que o cliente imagina ao que você executa.</h2>
        <div class="mt-14 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          ${Stage({
            n: "01",
            t: "Cliente imagina",
            d: "Traz uma refer\u00EAncia e uma ideia do resultado.",
            children: html`
            <div class="grid h-full place-items-center rounded-2xl bg-mist p-6 text-center text-sm text-ink/55">
              <div class="w-full max-w-[180px] rounded-xl border border-dashed border-ink/25 p-4">“Quero algo assim, mas mais leve...”</div>
            </div>
          `,
          })}
          ${Arrow({})}
          ${Stage({
            n: "02",
            t: "Hairstyle visualiza",
            d: "Modelo 3D com as caracter\u00EDsticas reais do cliente.",
            hl: true,
            children: html`
            <div class="rounded-2xl bg-gradient-to-b from-lilac-soft to-white">${HeadThumb({ hair: A, className: "mx-auto aspect-[5/6] h-56 object-contain" })}</div>
          `,
          })}
          ${Arrow({})}
          ${Stage({
            n: "03",
            t: "Profissional executa",
            d: "Com o visual aprovado e salvo na ficha.",
            children: html`
            <div class="grid h-full place-items-center rounded-2xl bg-ink p-6 text-white">
              <div class="text-center">${Scissors({ className: "mx-auto text-lilac", size: 40, strokeWidth: 1.3 })}<div class="mt-3 font-mono text-xs uppercase tracking-wider text-white/60">Visual aprovado</div></div>
            </div>
          `,
          })}
        </div>
      </section>

      <section class="bg-mist py-24">
        <div class="mx-auto max-w-7xl px-5 md:px-8">
          ${Eyebrow({ children: html`Recursos` })}
          <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            ${FEATS.map(([I, t, d]) => {
              const Ic = I
              return html`<div${attr("data-key", t)} class="group rounded-3xl bg-white p-7 transition hover:-translate-y-1">
                  <span class="grid size-12 place-items-center rounded-2xl bg-ink text-white transition group-hover:bg-violet">${Ic({ size: 21, strokeWidth: 1.5 })}</span>
                  <h3 class="mt-6 font-display text-xl font-semibold tracking-tight">${t}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-ink/60">${d}</p>
                </div>`
            })}
          </div>
          <div class="mt-12 flex justify-center">${Button({ size: "lg", onClick: () => go("contato"), children: html`Conhecer a plataforma profissional` })}</div>
        </div>
      </section>
    </div>`
}
const Stage = ({
  n,
  t,
  d,
  children,
  hl,
}) => html`<div${attr("class", `flex flex-col rounded-3xl border p-4 ${hl ? "border-violet/40 shadow-[0_24px_50px_-28px_rgba(108,59,255,.6)]" : "border-ink/10"}`)}>
    <div class="min-h-[14rem] flex-1">${children}</div>
    <div class="px-2 pb-2 pt-5"><div class="font-mono text-xs text-violet">${n}</div><h3 class="font-display text-xl font-semibold tracking-tight">${t}</h3><p class="text-sm text-ink/55">${d}</p></div>
  </div>`
const Arrow = () =>
  html`<div class="grid place-items-center text-violet max-md:rotate-90">${ArrowRight({ size: 28, strokeWidth: 1.5 })}</div>`
