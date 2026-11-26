import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { Mail, Plus, ArrowRight } from "../lib/icons.js"
import {
  Avatar,
  Badge,
  Button,
  Chip,
  CutCard,
  Field,
  Logo,
  Modal,
  ModelControls,
  PageHead,
  ProductCard,
  Tabs,
} from "../components/ui.js"
import { DEFAULT_HAIR, PRODUCTS } from "../lib/data.js"
const Block = ({
  title,
  children,
  dark,
}) => html`<section class="border-t border-ink/10 py-10">
    <div class="grid gap-6 lg:grid-cols-[200px_1fr]">
      <h2 class="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">${title}</h2>
      <div${attr("class", dark ? "rounded-3xl bg-ink p-8" : "")}>${children}</div>
    </div>
  </section>`
export default function System() {
  const tab = pageValue("tab", "a")
  const setTab = pageSetter("tab")
  const chip = pageValue("chip", true)
  const setChip = pageSetter("chip")
  const modal = pageValue("modal", false)
  const setModal = pageSetter("modal")
  const yaw = pageValue("yaw", 0)
  const setYaw = pageSetter("yaw")
  const zoom = pageValue("zoom", 1)
  const setZoom = pageSetter("zoom")
  const auto = pageValue("auto", false)
  const setAuto = pageSetter("auto")
  const base = window.location.pathname
  return html`<div>
      ${PageHead({ eyebrow: "Design system", title: "Hairstyle UI.", sub: "Componentes, cores e tipografia que sustentam toda a plataforma." })}
      <div class="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        ${Block({
          title: "Logotipo",
          children: html`
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid h-40 place-items-center rounded-3xl border border-ink/10">${Logo({ size: 40 })}</div>
            <div class="grid h-40 place-items-center rounded-3xl bg-ink">${Logo({ tone: "light", size: 40 })}</div>
          </div>
        `,
        })}
        ${Block({
          title: "Cores",
          children: html`
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
            ${[
              ["Grafite", "#111111"],
              ["Roxo", "#6C3BFF"],
              ["Lilás", "#B78CFF"],
              ["Névoa", "#F5F5F5"],
              ["Branco", "#FFFFFF"],
            ].map(
              ([n, h]) =>
                html`<div${attr("data-key", h)}><div class="h-24 rounded-2xl border border-ink/10"${attr("style", { background: h })}></div><div class="mt-2 text-sm font-medium">${n}</div><div class="font-mono text-xs text-ink/50">${h}</div></div>`,
            )}
          </div>
        `,
        })}
        ${Block({
          title: "Tipografia",
          children: html`
          <div class="space-y-3">
            <div class="font-display text-6xl font-semibold tracking-[-0.04em]">Bricolage Grotesque</div>
            <p class="text-lg text-ink/70">Geist para textos de interface, leitura e formulários.</p>
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-violet">Geist Mono · rótulos e dados</p>
          </div>
        `,
        })}
        ${Block({
          title: "Bot\u00F5es",
          children: html`
          <div class="flex flex-wrap items-center gap-3">
            ${Button({ children: html`Primário` })}${Button({ variant: "dark", children: html`Escuro` })}${Button({ variant: "outline", children: html`Contorno` })}${Button({ variant: "ghost", children: html`Ghost` })}
            ${Button({ icon: Plus({ size: 16 }), size: "sm", children: html`Pequeno` })}${Button({ size: "lg", iconRight: ArrowRight({ size: 18 }), children: html`Grande` })}${Button({ disabled: true, children: html`Desabilitado` })}
          </div>
        `,
        })}
        ${Block({
          title: "Inputs",
          children: html`
          <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
            ${Field({ label: "E-mail", icon: Mail({}), placeholder: "voce@email.com" })}
            ${Field({ label: "Com erro", error: "Campo obrigat\u00F3rio.", defaultValue: "" })}
          </div>
        `,
        })}
        ${Block({
          title: "Chips, badges e tabs",
          children: html`
          <div class="space-y-5">
            <div class="flex flex-wrap gap-2">${Chip({ selected: chip, onClick: () => setChip(!chip), children: html`Selecionado` })}${Chip({ children: html`Padrão` })}${Badge({ children: html`Novo` })}${Badge({ tone: "soft", children: html`Tendência` })}${Badge({ tone: "dark", children: html`Pro` })}</div>
            ${Tabs({
              value: tab,
              onChange: setTab,
              items: [
                { id: "a", label: "Corte" },
                { id: "b", label: "Cor" },
                { id: "c", label: "Textura" },
              ],
              className: "max-w-sm",
            })}
            ${Tabs({
              variant: "pill",
              value: tab,
              onChange: setTab,
              items: [
                { id: "a", label: "Corte" },
                { id: "b", label: "Cor" },
                { id: "c", label: "Textura" },
              ],
              className: "w-fit",
            })}
          </div>
        `,
        })}
        ${Block({
          title: "Avatares e modal",
          children: html`
          <div class="flex flex-wrap items-center gap-4">${Avatar({ name: "Marina", size: 32 })}${Avatar({ name: "Rafael", size: 48 })}${Avatar({ name: "Bia", size: 64 })}${Button({ variant: "outline", onClick: () => setModal(true), children: html`Abrir modal` })}</div>
          ${Modal({ open: modal, onClose: () => setModal(false), title: "Salvar visual", children: html`<p class="text-ink/60">Modal com fundo desfocado e fechamento por Esc.</p>${Button({ className: "mt-5 w-full", onClick: () => setModal(false), children: html`Confirmar` })}` })}
        `,
        })}
        ${Block({
          title: "Cards de corte e produto",
          children: html`
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            ${CutCard({ hair: DEFAULT_HAIR, title: "Repicado", desc: "Camadas", selected: true })}
            ${CutCard({ hair: { ...DEFAULT_HAIR, cut: "degrade", length: 1 }, title: "Degrad\u00EA", desc: "Padr\u00E3o" })}
            <div class="lg:col-span-2">${ProductCard({ p: PRODUCTS[1] })}</div>
          </div>
        `,
        })}
        ${Block({
          title: "Controles 3D",
          dark: true,
          children: html`
          <div class="flex justify-center">${ModelControls({ yaw: yaw, setYaw: setYaw, zoom: zoom, setZoom: setZoom, auto: auto, setAuto: setAuto })}</div>
        `,
        })}
        ${Block({
          title: "Responsivo",
          children: html`
          <div class="flex flex-wrap items-start gap-8">
            ${[
              ["Tablet · 820", 820, 1024, "simulador"],
              ["Mobile · 390", 390, 780, "simulador"],
              ["Mobile · 390", 390, 780, "inicio"],
            ].map(
              ([l, w, h, r], i) => html`<figure${attr("data-key", i)}>
                <div class="overflow-hidden rounded-[2rem] border-[6px] border-ink bg-white"${attr("style", { width: w * 0.55 + 12, height: h * 0.55 + 12 })}>
                  <iframe${attr("title", `${l} ${r}`)}${attr("src", `${base}#/${r}`)} loading="lazy"${attr("style", { width: w, height: h, transform: "scale(.55)", transformOrigin: "0 0", border: 0 })}></iframe>
                </div>
                <figcaption class="mt-3 font-mono text-xs uppercase tracking-wider text-ink/50">${l} · ${r}</figcaption>
              </figure>`,
            )}
          </div>
        `,
        })}
      </div>
    </div>`
}
