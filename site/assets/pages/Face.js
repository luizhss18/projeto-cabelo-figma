import { html, attr } from "../lib/dom.js"
import { ArrowRight, Info } from "../lib/icons.js"
import { HeadThumb } from "../components/Head3D.js"
import { Badge, Button, Card, Chip, Eyebrow } from "../components/ui.js"
import { FACES, LENGTHS, TEXTURES } from "../lib/data.js"
import { go, appState } from "../lib/store.js"
export default function Face() {
  const { hair, setHair } = appState()
  const face = FACES.find((f) => f.id === hair.face)
  return html`<div class="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      ${Eyebrow({ children: html`Etapa 01 · Conheça seu perfil` })}
      <h1 class="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Explore estilos considerando suas características.</h1>
      <div class="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div class="relative overflow-hidden rounded-[2rem] bg-ink p-6">
          <div class="absolute inset-0 grain-grid opacity-70"></div>
          <div class="relative mx-auto aspect-[5/6] max-w-[440px]">
            ${HeadThumb({ hair: { ...hair }, yaw: 0, className: "absolute inset-0 h-full w-full object-contain" })}
            <svg viewBox="0 0 100 120" class="absolute inset-0 h-full w-full" fill="none">
              ${[38, 56, 74].map((y) => html`<line${attr("data-key", y)} x1="14" x2="86"${attr("y1", y)}${attr("y2", y)} stroke="#B78CFF" stroke-width=".25" stroke-dasharray="1.5 1.5"></line>`)}
              <line x1="50" x2="50" y1="14" y2="100" stroke="#B78CFF" stroke-width=".25" stroke-dasharray="1.5 1.5"></line>
              <ellipse cx="50" cy="56" rx="26" ry="36" stroke="#6C3BFF" stroke-width=".5"></ellipse>
              <line x1="24" x2="76" y1="56" y2="56" stroke="#fff" stroke-width=".35"></line>
              ${[24, 76].map((x) => html`<circle${attr("data-key", x)}${attr("cx", x)} cy="56" r="1.2" fill="#B78CFF"></circle>`)}
            </svg>
            ${Tag({ className: "left-0 top-[26%]", k: "Testa" })}
            ${Tag({ className: "right-0 top-[45%]", k: "Ma\u00E7\u00E3s do rosto" })}
            ${Tag({ className: "left-0 top-[66%]", k: "Mand\u00EDbula" })}
          </div>
          <div class="relative mt-4 flex items-center justify-between text-white">
            <div>
              <div class="font-mono text-[11px] uppercase tracking-wider text-lilac">Proporção largura : altura</div>
              <div class="font-display text-3xl font-semibold tracking-tight">${face.ratio}</div>
            </div>
            ${Badge({ tone: "light", children: html`Formato ${face.name}` })}
          </div>
        </div>

        <div class="space-y-5">
          ${Card({
            children: html`
            <h3 class="font-display text-xl font-semibold tracking-tight">Formato do rosto</h3>
            <p class="mt-1 text-sm text-ink/60">${face.desc}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              ${FACES.map((f) => Chip({ selected: hair.face === f.id, onClick: () => setHair({ ...hair, face: f.id }), children: html`${f.name}` }))}
            </div>
          `,
          })}
          <div class="grid gap-5 sm:grid-cols-2">
            ${Card({
              children: html`
              <h3 class="font-display text-lg font-semibold tracking-tight">Tipo de cabelo</h3>
              <div class="mt-4 flex flex-wrap gap-2">
                ${TEXTURES.map((t) => Chip({ selected: hair.texture === t.id, onClick: () => setHair({ ...hair, texture: t.id }), children: html`${t.name}` }))}
              </div>
            `,
            })}
            ${Card({
              children: html`
              <h3 class="font-display text-lg font-semibold tracking-tight">Comprimento atual</h3>
              <div class="mt-5">
                <input type="range"${attr("min", 0)}${attr("max", 4)}${attr("value", hair.length)}${attr("onChange", (e) => setHair({ ...hair, length: +e.target.value }))} class="w-full accent-violet" aria-label="Comprimento atual">
                <div class="mt-2 text-sm font-medium">${LENGTHS[hair.length]}</div>
              </div>
            `,
            })}
          </div>
          ${Card({
            children: html`
            <h3 class="font-display text-lg font-semibold tracking-tight">Proporções</h3>
            <div class="mt-4 space-y-3">
              ${[
                ["Testa", 70],
                ["Maçãs do rosto", 84],
                [
                  "Mandíbula",
                  face.id === "quadrado" ? 88 : face.id === "coracao" ? 52 : 68,
                ],
              ].map(
                ([l, v]) => html`<div${attr("data-key", l)}>
                  <div class="mb-1.5 flex justify-between text-xs text-ink/60"><span>${l}</span><span class="font-mono">${v}%</span></div>
                  <div class="h-1.5 rounded-full bg-ink/8"><div class="h-full rounded-full bg-gradient-to-r from-violet to-lilac"${attr("style", { width: `${v}%` })}></div></div>
                </div>`,
              )}
            </div>
          `,
          })}
          <div class="flex items-start gap-3 rounded-2xl bg-lilac-soft/60 p-4 text-sm text-ink/70">
            ${Info({ size: 18, className: "mt-0.5 shrink-0 text-violet" })}
            Essas informações ajudam a visualizar diferentes cortes no modelo 3D. São uma referência visual e não um diagnóstico ou garantia de resultado.
          </div>
          ${Button({ size: "lg", className: "w-full", iconRight: ArrowRight({ size: 18 }), onClick: () => go("simulador"), children: html`Explorar estilos no simulador` })}
        </div>
      </div>
    </div>`
}
const Tag = ({ k, className }) =>
  html`<span${attr("class", `absolute rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/80 backdrop-blur ${className}`)}>${k}</span>`
