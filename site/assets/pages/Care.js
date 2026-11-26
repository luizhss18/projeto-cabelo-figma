import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { Droplets, Sun, Wind, Sparkles, Check, Moon } from "../lib/icons.js"
import {
  Badge,
  Button,
  Card,
  Chip,
  Eyebrow,
  ProductCard,
  Tabs,
} from "../components/ui.js"
import { PRODUCTS, TEXTURES } from "../lib/data.js"
import { go, appState } from "../lib/store.js"
const ROUTINE = [
  {
    d: "Seg",
    t: "Lavar",
    i: Droplets,
    n: "Shampoo Equilíbrio + condicionador",
  },
  {
    d: "Qua",
    t: "Hidratar",
    i: Sparkles,
    n: "Máscara de hidratação profunda, 10 min",
  },
  { d: "Sex", t: "Lavar", i: Droplets, n: "Shampoo + leave-in de definição" },
  { d: "Dom", t: "Descanso", i: Moon, n: "Finalizar com óleo nas pontas" },
]
const TIPS = [
  [
    Sun,
    "Proteja do sol e do calor",
    "Use protetor térmico antes de secador e chapinha.",
  ],
  [
    Wind,
    "Seque com delicadeza",
    "Prefira toalha de microfibra e evite torcer os fios.",
  ],
  [
    Droplets,
    "Água morna, não quente",
    "Água muito quente resseca e opaca a fibra capilar.",
  ],
]
export default function Care() {
  const { hair, setHair } = appState()
  const f = pageValue("f", "Todos")
  const setF = pageSetter("f")
  const cats = ["Todos", "Limpeza", "Tratamento", "Finalização", "Proteção"]
  const list = PRODUCTS.filter((p) => f === "Todos" || p.cat === f)
  const t = TEXTURES.find((x) => x.id === hair.texture)
  return html`<div>
      <div class="bg-mist">
        <div class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          ${Eyebrow({ children: html`Cuidados capilares` })}
          <h1 class="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Seu cabelo também precisa de cuidados.</h1>
          <p class="mt-5 max-w-xl text-lg text-ink/60">Informe o tipo do seu cabelo e encontre produtos e rotinas relacionados às suas características.</p>

          <div class="mt-12 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            ${Card({
              className: "bg-ink! text-white",
              children: html`
              ${Badge({ tone: "light", children: html`Meu tipo de cabelo` })}
              <div class="mt-5 font-display text-5xl font-semibold tracking-tight">${t.name}</div>
              <div class="font-mono text-xs uppercase tracking-wider text-lilac">${t.desc}</div>
              <div class="mt-6 flex flex-wrap gap-2">
                ${TEXTURES.map((x) => Chip({ dark: true, selected: hair.texture === x.id, onClick: () => setHair({ ...hair, texture: x.id }), children: html`${x.name}` }))}
              </div>
              <ul class="mt-7 space-y-2.5 text-sm text-white/70">
                ${["Hidratação semanal", "Finalização com leave-in", "Proteção térmica sempre"].map((x) => html`<li${attr("data-key", x)} class="flex items-center gap-2">${Check({ size: 15, className: "text-lilac" })}${x}</li>`)}
              </ul>
            `,
            })}
            ${Card({
              children: html`
              <div class="flex items-center justify-between">
                <h3 class="font-display text-xl font-semibold tracking-tight">Rotina de cuidados</h3>
                ${Badge({ children: html`Semana` })}
              </div>
              <div class="mt-5 divide-y divide-ink/8">
                ${ROUTINE.map(
                  (
                    r,
                  ) => html`<div${attr("data-key", r.d)} class="flex items-center gap-4 py-3.5">
                    <span class="w-10 font-mono text-xs uppercase text-ink/40">${r.d}</span>
                    <span class="grid size-10 place-items-center rounded-xl bg-lilac-soft text-violet"><r.i${attr("size", 18)}></r.i></span>
                    <div><div class="text-[15px] font-medium">${r.t}</div><div class="text-sm text-ink/55">${r.n}</div></div>
                  </div>`,
                )}
              </div>
            `,
            })}
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            ${Eyebrow({ children: html`Produtos recomendados` })}
            <h2 class="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Selecionados para cabelo ${t.name.toLowerCase()}</h2>
          </div>
          ${Tabs({ variant: "pill", value: f, onChange: setF, items: cats.map((c) => ({ id: c, label: c })) })}
        </div>
        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          ${list.map((p) => ProductCard({ p: p }))}
        </div>

        <div class="mt-24">
          ${Eyebrow({ children: html`Dicas` })}
          <div class="mt-6 grid gap-5 md:grid-cols-3">
            ${TIPS.map(([I, h, d]) => {
              const Ic = I
              return html`<div${attr("data-key", h)} class="rounded-3xl border border-ink/8 p-6">
                  ${Ic({ size: 22, className: "text-violet" })}
                  <h3 class="mt-5 font-display text-xl font-semibold tracking-tight">${h}</h3>
                  <p class="mt-2 text-sm text-ink/60">${d}</p>
                </div>`
            })}
          </div>
          <div class="mt-10 flex justify-center">${Button({ onClick: () => go("simulador"), children: html`Testar um novo visual` })}</div>
        </div>
      </div>
    </div>`
}
