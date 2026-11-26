import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { ArrowUpRight } from "../lib/icons.js"
import { HeadThumb } from "../components/Head3D.js"
import { Button, CutCard, PageHead, Tabs, cx } from "../components/ui.js"
import { COLORS, CUTS, LENGTHS, STYLES, TEXTURES } from "../lib/data.js"
import { go, appState } from "../lib/store.js"
const CATS = [
  {
    id: "cortes",
    label: "Cortes",
    sub: "6 formatos",
    apply: (h) => ({
      ...h,
      cut: "degrade",
      length: 1,
      color: "#1a1416",
      texture: "liso",
    }),
  },
  {
    id: "cores",
    label: "Cores",
    sub: "11 tons",
    apply: (h) => ({ ...h, color: "#8a4dff", cut: "longo", length: 3 }),
  },
  {
    id: "comprimentos",
    label: "Comprimentos",
    sub: "5 medidas",
    apply: (h) => ({ ...h, cut: "longo", length: 4, color: "#d9b36c" }),
  },
  {
    id: "texturas",
    label: "Texturas",
    sub: "4 tipos",
    apply: (h) => ({
      ...h,
      texture: "cacheado",
      cut: "medio",
      length: 2,
      color: "#4a2c20",
    }),
  },
  {
    id: "penteados",
    label: "Penteados",
    sub: "4 estilos",
    apply: (h) => ({
      ...h,
      style: "coque",
      cut: "medio",
      length: 2,
      color: "#a8431f",
      texture: "liso",
    }),
  },
]
export default function Explore() {
  const { hair, setHair } = appState()
  const cat = pageValue("cat", null)
  const setCat = pageSetter("cat")
  const base = { ...hair }
  const open = (c) => {
    setCat(c)
    setTimeout(
      () =>
        document
          .getElementById("catalogo")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    )
  }
  const pick = (p) => {
    setHair({ ...hair, ...p })
    go("simulador")
  }
  return html`<div>
      ${PageHead({ eyebrow: "Explore seu estilo", title: "Encontre um estilo que combina com voc\u00EA.", sub: "Escolha uma categoria e leve a inspira\u00E7\u00E3o direto para o simulador 3D." })}
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="grid gap-4 md:grid-cols-6">
          ${CATS.map(
            (
              c,
              i,
            ) => html`<button${attr("data-key", c.id)}${attr("onClick", () => open(c.id))}${attr("class", cx("group relative overflow-hidden rounded-3xl bg-ink text-left text-white transition hover:-translate-y-1", i < 2 ? "md:col-span-3" : "md:col-span-2", cat === c.id && "ring-4 ring-violet/40"))}>
              <div class="absolute -right-10 -top-10 size-56 rounded-full bg-violet/30 blur-3xl transition group-hover:bg-violet/50"></div>
              <div${attr("class", cx("relative flex items-end justify-between p-6", i < 2 ? "h-64" : "h-56"))}>
                <div class="self-end">
                  <div class="font-mono text-[11px] uppercase tracking-wider text-lilac">${c.sub}</div>
                  <div class="mt-1 font-display text-3xl font-semibold tracking-tight">${c.label}</div>
                  <span class="mt-4 inline-flex items-center gap-1 text-sm text-white/70 group-hover:text-white">Entrar ${ArrowUpRight({ size: 15 })}</span>
                </div>
                ${HeadThumb({ hair: c.apply(base), yaw: -35 + i * 10, className: cx("absolute bottom-0 right-2 object-contain transition group-hover:scale-105", i < 2 ? "h-[115%]" : "h-[105%]") })}
              </div>
            </button>`,
          )}
        </div>

        <div id="catalogo" class="scroll-mt-24 py-16">
          ${Tabs({ variant: "pill", value: cat ?? "cortes", onChange: (v) => setCat(v), items: CATS.map((c) => ({ id: c.id, label: c.label })), className: "w-fit max-w-full" })}
          <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            ${(cat ?? "cortes") === "cortes" && CUTS.map((c) => CutCard({ hair: { ...base, cut: c.id, length: c.length }, title: c.name, desc: c.desc, onClick: () => pick({ cut: c.id, length: c.length }) }))}
            ${cat === "cores" && COLORS.map((c) => CutCard({ hair: { ...base, color: c.hex }, title: c.name, desc: c.group, onClick: () => pick({ color: c.hex }) }))}
            ${cat === "comprimentos" && LENGTHS.map((l, i) => CutCard({ hair: { ...base, length: i }, title: l, onClick: () => pick({ length: i }) }))}
            ${cat === "texturas" && TEXTURES.map((t) => CutCard({ hair: { ...base, texture: t.id }, title: t.name, desc: t.desc, onClick: () => pick({ texture: t.id }) }))}
            ${cat === "penteados" && STYLES.map((t) => CutCard({ hair: { ...base, style: t.id }, yaw: t.id === "coque" || t.id === "rabo" ? 150 : -28, title: t.name, desc: t.desc, onClick: () => pick({ style: t.id }) }))}
          </div>
          <div class="mt-10 flex justify-center">
            ${Button({ variant: "dark", onClick: () => go("simulador"), children: html`Abrir simulador` })}
          </div>
        </div>
      </div>
    </div>`
}
