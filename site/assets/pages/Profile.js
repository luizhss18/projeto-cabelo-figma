import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { Pencil, Check, Clock, Heart, Droplets } from "../lib/icons.js"
import { HeadThumb } from "../components/Head3D.js"
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Field,
  Tabs,
} from "../components/ui.js"
import {
  TEXTURES,
  colorName,
  cutName,
  faceName,
  textureName,
} from "../lib/data.js"
import { go, appState } from "../lib/store.js"
export default function Profile() {
  const { user, hair, looks, setHair } = appState()
  const tab = pageValue("tab", "salvos")
  const setTab = pageSetter("tab")
  const edit = pageValue("edit", false)
  const setEdit = pageSetter("edit")
  const name = pageValue("name", user?.name ?? "Marina Duarte")
  const setName = pageSetter("name")
  const email = pageValue("email", user?.email ?? "marina@email.com")
  const setEmail = pageSetter("email")
  const prefs = pageValue("prefs", ["Cores naturais", "Baixa manutenção"])
  const setPrefs = pageSetter("prefs")
  const allPrefs = [
    "Cores naturais",
    "Tons fantasia",
    "Baixa manutenção",
    "Cabelo longo",
    "Corte curto",
  ]
  const open = (h) => {
    setHair(h)
    go("simulador")
  }
  return html`<div class="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div class="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
          ${Card({
            children: html`
            <div class="flex items-center gap-4">
              ${Avatar({ name: name, size: 64 })}
              <div class="min-w-0">
                <h1 class="truncate font-display text-2xl font-semibold tracking-tight">${name}</h1>
                <p class="truncate text-sm text-ink/55">${email}</p>
              </div>
            </div>
            ${
              edit
                ? html`<div class="mt-6 space-y-4">
                ${Field({ label: "Nome", value: name, onChange: (e) => setName(e.target.value) })}
                ${Field({ label: "E-mail", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })}
                ${Field({ label: "Senha", type: "password", placeholder: "••••••••••", hint: "Alteração de senha indisponível na demonstração.", disabled: true })}
                <div>
                  <div class="mb-2 text-sm font-medium text-ink/80">Tipo de cabelo</div>
                  <div class="flex flex-wrap gap-2">${TEXTURES.map((t) => Chip({ selected: hair.texture === t.id, onClick: () => setHair({ ...hair, texture: t.id }), children: html`${t.name}` }))}</div>
                </div>
                <div>
                  <div class="mb-2 text-sm font-medium text-ink/80">Preferências</div>
                  <div class="flex flex-wrap gap-2">${allPrefs.map((p) => Chip({ selected: prefs.includes(p), onClick: () => setPrefs((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p])), children: html`${p}` }))}</div>
                </div>
                ${Button({ className: "w-full", icon: Check({ size: 16 }), onClick: () => setEdit(false), children: html`Salvar alterações` })}
              </div>`
                : html`
                <dl class="mt-6 divide-y divide-ink/8 text-sm">
                  ${[
                    ["Senha", "••••••••••"],
                    ["Tipo de cabelo", textureName(hair.texture)],
                    ["Formato do rosto", faceName(hair.face)],
                    [
                      "Características",
                      `${cutName(hair.cut)} · ${colorName(hair.color)}`,
                    ],
                  ].map(
                    ([k, v]) =>
                      html`<div${attr("data-key", k)} class="flex justify-between py-3"><dt class="text-ink/50">${k}</dt><dd class="font-medium">${v}</dd></div>`,
                  )}
                </dl>
                <div class="mt-4 flex flex-wrap gap-2">${prefs.map((p) => Badge({ tone: "soft", children: html`${p}` }))}</div>
                ${Button({ variant: "outline", className: "mt-6 w-full", icon: Pencil({ size: 15 }), onClick: () => setEdit(true), children: html`Editar perfil` })}
              `
            }
          `,
          })}
        </aside>

        <section aria-label="Estilos salvos e rotina capilar">
          ${Tabs({
            value: tab,
            onChange: setTab,
            items: [
              { id: "salvos", label: "Meus estilos salvos" },
              { id: "historico", label: "Histórico de simulações" },
              { id: "favoritos", label: "Favoritos" },
              { id: "rotina", label: "Minha rotina capilar" },
            ],
          })}

          ${
            (tab === "salvos" || tab === "favoritos") &&
            html`<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              ${(tab === "favoritos"
                ? looks.filter((_, i) => i % 2 === 0)
                : looks
              ).map(
                (
                  l,
                ) => html`<button${attr("data-key", l.id)}${attr("onClick", () => open(l.hair))} class="group overflow-hidden rounded-3xl border border-ink/8 bg-white text-left transition hover:-translate-y-1">
                  <div class="relative bg-gradient-to-b from-lilac-soft to-mist">
                    ${HeadThumb({ hair: l.hair, className: "aspect-[5/6] w-full object-contain" })}
                    ${Heart({ size: 18, className: "absolute right-3 top-3 fill-violet text-violet" })}
                  </div>
                  <div class="p-4"><div class="font-medium">${l.name}</div><div class="text-xs text-ink/50">${cutName(l.hair.cut)} · ${colorName(l.hair.color)}</div></div>
                </button>`,
              )}
            </div>`
          }

          ${
            tab === "historico" &&
            html`<ol class="mt-8 divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white">
              ${looks.map(
                (l) => html`<li${attr("data-key", l.id)}>
                  <button${attr("onClick", () => open(l.hair))} class="flex w-full items-center gap-4 p-4 text-left hover:bg-mist">
                    ${HeadThumb({ hair: l.hair, className: "size-16 rounded-2xl bg-lilac-soft object-contain" })}
                    <div class="flex-1"><div class="font-medium">${l.name}</div><div class="text-sm text-ink/50">${cutName(l.hair.cut)} · ${textureName(l.hair.texture)} · ${colorName(l.hair.color)}</div></div>
                    <span class="flex items-center gap-1.5 text-xs text-ink/45">${Clock({ size: 13 })}${l.date}</span>
                  </button>
                </li>`,
              )}
            </ol>`
          }

          ${
            tab === "rotina" &&
            html`<div class="mt-8 grid gap-4 md:grid-cols-2">
              ${[
                ["Lavagem", "2x por semana com shampoo Equilíbrio"],
                ["Hidratação", "Máscara profunda toda quarta"],
                ["Finalização", "Leave-in e óleo nas pontas"],
                ["Proteção", "Protetor térmico antes do calor"],
              ].map(([t, d]) =>
                Card({
                  children: html`${Droplets({ className: "text-violet", size: 20 })}<h3 class="mt-4 font-display text-xl font-semibold tracking-tight">${t}</h3><p class="mt-1 text-sm text-ink/60">${d}</p>`,
                }),
              )}
              ${Button({ className: "md:col-span-2", variant: "dark", onClick: () => go("cuidados"), children: html`Ajustar rotina em Cuidados` })}
            </div>`
          }
        </section>
      </div>
    </div>`
}
