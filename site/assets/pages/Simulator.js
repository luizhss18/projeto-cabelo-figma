import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import {
  Bookmark,
  GitCompare,
  Scissors,
  Ruler,
  Palette,
  Waves,
  Shirt,
  ScanFace,
  Check,
} from "../lib/icons.js"
import { Head3D } from "../components/Head3D.js"
import {
  Badge,
  Button,
  CutCard,
  Field,
  Modal,
  ModelControls,
  Tabs,
  cx,
} from "../components/ui.js"
import {
  COLORS,
  CUTS,
  LENGTHS,
  STYLES,
  TEXTURES,
  colorName,
  cutName,
  faceName,
  textureName,
} from "../lib/data.js"
import { go, appState } from "../lib/store.js"
export default function Simulator() {
  const { hair, setHair, saveLook, setCompare, compare } = appState()
  const tab = pageValue("tab", "corte")
  const setTab = pageSetter("tab")
  const yaw = pageValue("yaw", -25)
  const setYaw = pageSetter("yaw")
  const zoom = pageValue("zoom", 1)
  const setZoom = pageSetter("zoom")
  const auto = pageValue("auto", false)
  const setAuto = pageSetter("auto")
  const saveOpen = pageValue("saveOpen", false)
  const setSaveOpen = pageSetter("saveOpen")
  const name = pageValue("name", "Meu novo visual")
  const setName = pageSetter("name")
  const saved = pageValue("saved", false)
  const setSaved = pageSetter("saved")
  const set = (p) => setHair((h) => ({ ...h, ...p }))
  const tabs = [
    { id: "corte", label: "Corte", icon: Scissors({ size: 15 }) },
    { id: "comprimento", label: "Comprimento", icon: Ruler({ size: 15 }) },
    { id: "cor", label: "Cor", icon: Palette({ size: 15 }) },
    { id: "textura", label: "Textura", icon: Waves({ size: 15 }) },
    { id: "estilo", label: "Estilo", icon: Shirt({ size: 15 }) },
  ]
  return html`<div class="flex min-h-[calc(100vh-68px)] flex-col lg:grid lg:h-[calc(100vh-68px)] lg:grid-cols-[1fr_430px]">
      
      <section class="relative h-[58vh] min-h-[400px] overflow-hidden bg-ink lg:h-auto">
        <div class="absolute inset-0 grain-grid opacity-80 [mask-image:radial-gradient(ellipse_at_50%_45%,black,transparent_75%)]"></div>
        <div class="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[120px]"></div>
        ${Head3D({ hair: hair, yaw: yaw, zoom: zoom, autoRotate: auto, onYaw: setYaw, className: "absolute inset-0" })}

        <div class="absolute left-4 top-4 flex flex-col gap-2 sm:left-6 sm:top-6">
          ${Badge({ tone: "light", children: html`<span class="size-1.5 rounded-full bg-lilac"></span>Modelo 3D · arraste para girar` })}
        </div>

        <div class="absolute right-4 top-4 hidden w-60 rounded-2xl border border-white/12 bg-ink/60 p-4 text-white backdrop-blur-xl sm:block sm:right-6 sm:top-6">
          <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-lilac">${ScanFace({ size: 13 })}Seu perfil</div>
          <dl class="mt-3 space-y-2 text-[13px]">
            ${Row({ k: "Formato do rosto", v: faceName(hair.face) })}
            ${Row({ k: "Tipo de cabelo", v: `${textureName(hair.texture)} · ${["1", "2", "3", "4"][TEXTURES.findIndex((t) => t.id === hair.texture)]}` })}
          </dl>
          <div class="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
            ${[cutName(hair.cut), LENGTHS[hair.length], colorName(hair.color)].map((t) => html`<span${attr("data-key", t)} class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/85">${t}</span>`)}
          </div>
          <button${attr("onClick", () => go("rosto"))} class="mt-3 text-xs text-lilac hover:underline">Ajustar características →</button>
        </div>

        <div class="absolute inset-x-0 bottom-4 flex justify-center px-3 sm:bottom-6">
          ${ModelControls({ yaw: yaw, setYaw: setYaw, zoom: zoom, setZoom: setZoom, auto: auto, setAuto: setAuto })}
        </div>
      </section>

      
      <aside class="flex min-h-0 flex-col border-l border-ink/8 bg-white">
        <div class="px-5 pt-5">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-2xl font-semibold tracking-tight">Personalizar</h2>
            ${Badge({ tone: "soft", children: html`Passo 3 de 4` })}
          </div>
          ${Tabs({ items: tabs, value: tab, onChange: setTab, className: "mt-4 -mx-5 px-3" })}
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          ${
            tab === "corte" &&
            html`<div class="grid grid-cols-2 gap-3">
              ${CUTS.map((c) => CutCard({ hair: { ...hair, cut: c.id, length: c.length }, title: c.name, desc: c.desc, selected: hair.cut === c.id, onClick: () => set({ cut: c.id, length: c.length }) }))}
            </div>`
          }
          ${
            tab === "comprimento" &&
            html`<div>
              <p class="text-sm text-ink/55">Ajuste o comprimento dos fios nas laterais e na nuca.</p>
              <div class="mt-6 px-1">
                <input type="range"${attr("min", 0)}${attr("max", 4)}${attr("step", 1)}${attr("value", hair.length)}${attr("onChange", (e) => set({ length: +e.target.value }))} aria-label="Comprimento" class="w-full accent-violet">
                <div class="mt-2 flex justify-between font-mono text-[10px] uppercase text-ink/40">${LENGTHS.map((l) => html`<span${attr("data-key", l)}>${l.slice(0, 4)}</span>`)}</div>
              </div>
              <div class="mt-6 grid grid-cols-2 gap-3">
                ${[0, 1, 2, 3, 4].map((i) => CutCard({ hair: { ...hair, length: i }, title: LENGTHS[i], selected: hair.length === i, onClick: () => set({ length: i }) }))}
              </div>
            </div>`
          }
          ${
            tab === "cor" &&
            html`<div class="space-y-6">
              ${["Naturais", "Fantasia"].map(
                (g) => html`<div${attr("data-key", g)}>
                  <div class="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink/45">${
                    g === "Fantasia" ? "Tons fantasia" : g
                  }</div>
                  <div class="grid grid-cols-3 gap-3">
                    ${COLORS.filter((c) => c.group === g).map((c) => {
                      const on = hair.color === c.hex
                      return html`<button${attr("data-key", c.hex)}${attr("onClick", () => set({ color: c.hex }))}${attr("aria-pressed", on)}${attr("class", cx("rounded-2xl border p-2 text-left transition", on ? "border-violet ring-4 ring-violet/15" : "border-ink/10 hover:border-ink/30"))}>
                          <span class="relative block h-14 rounded-xl"${attr("style", { background: `linear-gradient(135deg, ${c.hex}, ${c.hex}cc 60%, #ffffff55)` })}>
                            ${on && html`<span class="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-white text-violet">${Check({ size: 12 })}</span>`}
                          </span>
                          <span class="mt-2 block px-1 text-xs font-medium">${c.name}</span>
                        </button>`
                    })}
                  </div>
                </div>`,
              )}
              <label class="flex items-center justify-between rounded-2xl border border-dashed border-ink/20 p-3 text-sm">
                Cor personalizada
                <input type="color"${attr("value", hair.color)}${attr("onChange", (e) => set({ color: e.target.value }))} class="h-9 w-14 cursor-pointer rounded-lg border-0 bg-transparent">
              </label>
            </div>`
          }
          ${
            tab === "textura" &&
            html`<div class="grid grid-cols-2 gap-3">
              ${TEXTURES.map((t) => CutCard({ hair: { ...hair, texture: t.id }, title: t.name, desc: t.desc, selected: hair.texture === t.id, onClick: () => set({ texture: t.id }) }))}
            </div>`
          }
          ${
            tab === "estilo" &&
            html`<div class="grid grid-cols-2 gap-3">
              ${STYLES.map((t) => CutCard({ hair: { ...hair, style: t.id }, yaw: t.id === "coque" || t.id === "rabo" ? 150 : -28, title: t.name, desc: t.desc, selected: hair.style === t.id, onClick: () => set({ style: t.id }) }))}
            </div>`
          }
        </div>

        <div class="border-t border-ink/8 bg-white p-5">
          <div class="mb-3 flex items-center justify-between text-xs text-ink/55">
            <span>${cutName(hair.cut)} · ${LENGTHS[hair.length]} · ${textureName(hair.texture)}</span>
            <span class="flex items-center gap-1.5"><span class="size-3 rounded-full border border-ink/15"${attr("style", { background: hair.color })}></span>${colorName(hair.color)}</span>
          </div>
          <div class="flex gap-2">
            ${Button({
              className: "flex-1",
              icon: Bookmark({ size: 17 }),
              onClick: () => {
                setSaved(false)
                setSaveOpen(true)
              },
              children: html`Salvar visual`,
            })}
            ${Button({
              variant: "outline",
              icon: GitCompare({ size: 17 }),
              onClick: () => {
                setCompare([{ ...hair }, compare[1]])
                go("comparar")
              },
              children: html`Comparar`,
            })}
          </div>
        </div>
      </aside>

      ${Modal({
        open: saveOpen,
        onClose: () => setSaveOpen(false),
        title: saved ? "Visual salvo" : "Salvar visual",
        children: html`
        ${
          saved
            ? html`<div>
            <p class="text-ink/60">“${name}” foi adicionado aos seus estilos salvos.</p>
            <div class="mt-6 flex gap-2">
              ${Button({ className: "flex-1", onClick: () => go("perfil"), children: html`Ver meus estilos` })}
              ${Button({ variant: "outline", onClick: () => setSaveOpen(false), children: html`Continuar` })}
            </div>
          </div>`
            : html`<form${attr("onSubmit", (e) => {
                e.preventDefault()
                saveLook(name)
                setSaved(true)
              })}>
            ${Field({ label: "Nome do visual", value: name, onChange: (e) => setName(e.target.value), autoFocus: true })}
            ${Button({ type: "submit", className: "mt-5 w-full", children: html`Salvar` })}
          </form>`
        }
      `,
      })}
    </div>`
}
const Row = ({ k, v }) =>
  html`<div class="flex justify-between gap-3"><dt class="text-white/50">${k}</dt><dd class="font-medium">${v}</dd></div>`
