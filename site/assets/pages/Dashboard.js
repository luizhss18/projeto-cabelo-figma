import { html, attr } from "../lib/dom.js"
import { Plus, Bookmark, Droplets, Heart, ArrowRight } from "../lib/icons.js"
import { HeadThumb } from "../components/Head3D.js"
import { Badge, Button, Eyebrow } from "../components/ui.js"
import { CUTS, colorName, cutName } from "../lib/data.js"
import { go, appState } from "../lib/store.js"
export default function Dashboard() {
  const { user, looks, setHair } = appState()
  const name = user?.name ?? "Marina"
  const cards = [
    {
      t: "Novo visual",
      d: "Abra o simulador 3D",
      i: Plus,
      to: "simulador",
      dark: true,
    },
    {
      t: "Meus estilos",
      d: `${looks.length} salvos`,
      i: Bookmark,
      to: "perfil",
    },
    {
      t: "Cuidados capilares",
      d: "Rotina e produtos",
      i: Droplets,
      to: "cuidados",
    },
    { t: "Favoritos", d: "12 inspirações", i: Heart, to: "perfil" },
  ]
  return html`<div class="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      ${Eyebrow({ children: html`Dashboard` })}
      <h1 class="mt-3 font-display text-4xl font-semibold tracking-[-0.035em] md:text-6xl">Olá, ${name}!</h1>
      <p class="mt-3 text-xl text-ink/55">Qual estilo você quer experimentar hoje?</p>

      <div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        ${cards.map(
          (
            c,
          ) => html`<button${attr("data-key", c.t)}${attr("onClick", () => go(c.to))}${attr("class", `group flex aspect-[4/3] flex-col justify-between rounded-3xl p-5 text-left transition hover:-translate-y-1 ${c.dark ? "bg-violet text-white" : "border border-ink/10 bg-white"}`)}>
            <span${attr("class", `grid size-11 place-items-center rounded-full ${c.dark ? "bg-white/20" : "bg-lilac-soft text-violet"}`)}><c.i${attr("size", 20)}></c.i></span>
            <div>
              <div class="font-display text-xl font-semibold tracking-tight">${c.t}</div>
              <div${attr("class", `text-sm ${c.dark ? "text-white/75" : "text-ink/50"}`)}>${c.d}</div>
            </div>
          </button>`,
        )}
      </div>

      <section class="mt-16">
        <div class="flex items-end justify-between">
          <h2 class="font-display text-2xl font-semibold tracking-tight md:text-3xl">Continue de onde parou</h2>
          <button${attr("onClick", () => go("perfil"))} class="text-sm font-medium text-violet hover:underline">Ver histórico</button>
        </div>
        <div class="mt-6 flex gap-4 overflow-x-auto pb-2">
          ${looks.slice(0, 5).map(
            (l) => html`<button${attr("data-key", l.id)}${attr(
              "onClick",
              () => {
                setHair(l.hair)
                go("simulador")
              },
            )} class="group w-48 shrink-0 text-left">
              <div class="overflow-hidden rounded-3xl bg-gradient-to-b from-lilac-soft to-mist">
                ${HeadThumb({ hair: l.hair, className: "aspect-[5/6] w-full object-contain transition group-hover:scale-105" })}
              </div>
              <div class="mt-3 font-medium">${l.name}</div>
              <div class="text-xs text-ink/50">${cutName(l.hair.cut)} · ${colorName(l.hair.color)} · ${l.date}</div>
            </button>`,
          )}
        </div>
      </section>

      <section class="mt-16 overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:p-12">
        <div class="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            ${Badge({ tone: "light", children: html`Em destaque` })}
            <h2 class="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">Explore novas possibilidades</h2>
            <p class="mt-4 text-white/60">Tendências da estação prontas para testar no seu modelo.</p>
            ${Button({ className: "mt-7", variant: "light", iconRight: ArrowRight({ size: 16 }), onClick: () => go("estilos"), children: html`Explorar estilos` })}
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${[CUTS[4], CUTS[3], CUTS[2]].map(
              (c, i) => html`<button${attr("data-key", c.id)}${attr(
                "onClick",
                () => {
                  setHair({ ...looks[0].hair, cut: c.id, length: c.length })
                  go("simulador")
                },
              )} class="overflow-hidden rounded-2xl bg-graphite text-left transition hover:bg-white/10">
                ${HeadThumb({ hair: { ...looks[0].hair, cut: c.id, length: c.length, color: ["#8a4dff", "#1a1416", "#d9b36c"][i] }, className: "aspect-[5/6] w-full object-contain" })}
                <div class="px-3 pb-3 text-sm font-medium">${c.name}</div>
              </button>`,
            )}
          </div>
        </div>
      </section>
    </div>`
}
