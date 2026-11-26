import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { Check, Bookmark } from "../lib/icons.js"
import { Head3D } from "../components/Head3D.js"
import { Badge, Button, Chip, Modal, cx } from "../components/ui.js"
import {
  COLORS,
  CUTS,
  LENGTHS,
  TEXTURES,
  colorName,
  cutName,
  textureName,
} from "../lib/data.js"
import { go, appState } from "../lib/store.js"
export default function Compare() {
  const { compare, setCompare, setHair, saveLook } = appState()
  const chosen = pageValue("chosen", null)
  const setChosen = pageSetter("chosen")
  const saved = pageValue("saved", false)
  const setSaved = pageSetter("saved")
  const yaw = pageValue("yaw", -25)
  const setYaw = pageSetter("yaw")
  const upd = (i, p) =>
    setCompare(
      i === 0
        ? [{ ...compare[0], ...p }, compare[1]]
        : [compare[0], { ...compare[1], ...p }],
    )
  const choose = (i) => {
    setChosen(i)
    setHair(compare[i])
  }
  return html`<div class="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <div>
          ${Badge({ children: html`Comparação` })}
          <h1 class="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] md:text-6xl">Veja antes. Escolha melhor.</h1>
        </div>
        ${Button({ variant: "outline", onClick: () => setYaw(yaw + 90), children: html`Girar os dois modelos` })}
      </div>

      <div class="relative mt-10 grid gap-4 md:grid-cols-2">
        ${[0, 1].map((i) => {
          const h = compare[i]
          return html`<section${attr("data-key", i)}${attr("class", cx("overflow-hidden rounded-[2rem] border-2 transition", chosen === i ? "border-violet" : "border-transparent"))}>
              <div class="relative h-[420px] bg-ink md:h-[500px]">
                <div class="absolute inset-0 grain-grid opacity-60"></div>
                <div class="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[100px]"></div>
                ${Head3D({ hair: h, yaw: yaw, onYaw: setYaw, className: "absolute inset-0" })}
                <div class="absolute left-5 top-5 flex items-center gap-2">
                  ${Badge({ tone: "light", children: html`Visual 0${i + 1}` })}
                  ${chosen === i && Badge({ children: html`${Check({ size: 12 })}Escolhido` })}
                </div>
              </div>
              <div class="space-y-5 bg-white p-6">
                <dl class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                  ${[
                    ["Corte", cutName(h.cut)],
                    ["Cor", colorName(h.color)],
                    ["Comprimento", LENGTHS[h.length]],
                    ["Textura", textureName(h.texture)],
                  ].map(
                    ([k, v]) =>
                      html`<div${attr("data-key", k)}><dt class="font-mono text-[10px] uppercase tracking-wider text-ink/40">${k}</dt><dd class="mt-1 font-medium">${v}</dd></div>`,
                  )}
                </dl>
                ${Row({ label: "Corte", children: html`${CUTS.map((c) => Chip({ selected: h.cut === c.id, onClick: () => upd(i, { cut: c.id, length: c.length }), children: html`${c.name}` }))}` })}
                ${Row({
                  label: "Cor",
                  children: html`
                  <div class="flex flex-wrap gap-2">
                    ${COLORS.map((c) => html`<button${attr("data-key", c.hex)}${attr("aria-label", c.name)}${attr("aria-pressed", h.color === c.hex)}${attr("onClick", () => upd(i, { color: c.hex }))}${attr("class", cx("size-8 rounded-full border-2 transition", h.color === c.hex ? "border-violet ring-2 ring-violet/30" : "border-white shadow-[0_0_0_1px_rgba(0,0,0,.12)]"))}${attr("style", { background: c.hex })}></button>`)}
                  </div>
                `,
                })}
                ${Row({ label: "Comprimento", children: html`<input type="range"${attr("min", 0)}${attr("max", 4)}${attr("value", h.length)}${attr("onChange", (e) => upd(i, { length: +e.target.value }))} class="w-full accent-violet" aria-label="Comprimento">` })}
                ${Row({ label: "Textura", children: html`${TEXTURES.map((t) => Chip({ selected: h.texture === t.id, onClick: () => upd(i, { texture: t.id }), children: html`${t.name}` }))}` })}
                ${Button({ className: "w-full", variant: chosen === i ? "dark" : "primary", onClick: () => choose(i), children: html`Escolher este visual` })}
              </div>
            </section>`
        })}
        <div class="pointer-events-none absolute left-1/2 top-[210px] z-10 hidden size-12 -translate-x-1/2 place-items-center rounded-full bg-white font-mono text-xs font-medium shadow-xl md:grid">VS</div>
      </div>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        ${Button({
          size: "lg",
          variant: "dark",
          icon: Bookmark({ size: 18 }),
          onClick: () => {
            saveLook(
              `Comparação: ${cutName(compare[0].cut)} × ${cutName(compare[1].cut)}`,
            )
            setSaved(true)
          },
          children: html`Salvar comparação`,
        })}
        ${Button({ size: "lg", variant: "outline", onClick: () => go("simulador"), children: html`Voltar ao simulador` })}
      </div>
      ${Modal({
        open: saved,
        onClose: () => setSaved(false),
        title: "Compara\u00E7\u00E3o salva",
        children: html`
        <p class="text-ink/60">Você pode rever os dois visuais no seu perfil quando quiser.</p>
        ${Button({ className: "mt-6 w-full", onClick: () => go("perfil"), children: html`Ir para meu perfil` })}
      `,
      })}
    </div>`
}
const Row = ({ label, children }) =>
  html`<div><div class="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink/40">${label}</div><div class="flex flex-wrap gap-2">${children}</div></div>`
