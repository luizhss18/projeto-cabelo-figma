import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { Menu, X, LayoutGrid, User, LogOut } from "../lib/icons.js"
import { Avatar, Button, Logo, cx } from "./ui.js"
import { go, appState } from "../lib/store.js"
const NAV = [
  ["inicio", "Início"],
  ["simulador", "Simulador"],
  ["estilos", "Estilos"],
  ["cuidados", "Cuidados"],
  ["profissionais", "Para profissionais"],
  ["sobre", "Sobre"],
]
export function Header({ route, dark }) {
  const open = pageValue("open", false)
  const setOpen = pageSetter("open")
  const menu = pageValue("menu", false)
  const setMenu = pageSetter("menu")
  const { user, logout } = appState()
  const nav = (r) => {
    setOpen(false)
    setMenu(false)
    go(r)
  }
  return html`<header${attr("class", cx("sticky top-0 z-50 border-b backdrop-blur-xl", dark ? "border-white/8 bg-ink/80 text-white" : "border-ink/8 bg-white/85 text-ink"))}>
      <div class="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <button${attr("onClick", () => nav(user ? "dashboard" : "inicio"))} aria-label="Hairstyle — início">
          ${Logo({ tone: dark ? "light" : "dark", size: 21 })}
        </button>
        <nav class="hidden items-center gap-1 lg:flex" aria-label="Principal">
          ${NAV.map(
            ([
              id,
              l,
            ]) => html`<button${attr("data-key", id)}${attr("onClick", () => nav(id))}${attr("class", cx("rounded-full px-3.5 py-2 text-[14px] transition", route === id ? (dark ? "bg-white/10 text-white" : "bg-ink/6 text-ink") : dark ? "text-white/65 hover:text-white" : "text-ink/60 hover:text-ink"))}>
              ${l}
            </button>`,
          )}
        </nav>
        <div class="flex items-center gap-2">
          ${
            user
              ? html`<div class="relative">
              <button${attr("onClick", () => setMenu(!menu))} aria-label="Conta" class="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-ink/5">
                ${Avatar({ name: user.name, size: 34 })}
                <span class="hidden text-sm font-medium sm:block">${user.name}</span>
              </button>
              ${
                menu &&
                html`<div class="absolute right-0 top-12 w-52 rounded-2xl border border-ink/10 bg-white p-2 text-ink shadow-xl">
                  <button${attr("onClick", () => nav("dashboard"))} class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-mist">${LayoutGrid({ size: 16 })}Dashboard</button>
                  <button${attr("onClick", () => nav("perfil"))} class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-mist">${User({ size: 16 })}Meu perfil</button>
                  <button${attr("onClick", () => {
                    logout()
                    nav("inicio")
                  })} class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-mist">${LogOut({ size: 16 })}Sair</button>
                </div>`
              }
            </div>`
              : html`
              <button${attr("onClick", () => nav("entrar"))}${attr("class", cx("hidden rounded-full px-4 py-2 text-sm font-medium sm:block", dark ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-ink"))}>Entrar</button>
              ${Button({ size: "sm", onClick: () => nav("simulador"), className: "hidden sm:inline-flex", children: html`Experimentar agora` })}
            `
          }
          <button${attr("class", cx("grid size-10 place-items-center rounded-full lg:hidden", dark ? "hover:bg-white/10" : "hover:bg-ink/5"))} aria-label="Menu"${attr("onClick", () => setOpen(!open))}>
            ${open ? X({ size: 20 }) : Menu({ size: 20 })}
          </button>
        </div>
      </div>
      ${
        open &&
        html`<div${attr("class", cx("border-t px-5 pb-6 pt-3 lg:hidden", dark ? "border-white/8 bg-ink" : "border-ink/8 bg-white"))}>
          ${NAV.map(([id, l]) => html`<button${attr("data-key", id)}${attr("onClick", () => nav(id))} class="block w-full border-b border-current/10 py-3.5 text-left font-display text-xl font-medium tracking-tight">${l}</button>`)}
          <div class="mt-5 flex gap-2">
            ${!user && Button({ variant: dark ? "outline-light" : "outline", className: "flex-1", onClick: () => nav("entrar"), children: html`Entrar` })}
            ${Button({ className: "flex-1", onClick: () => nav("simulador"), children: html`Experimentar agora` })}
          </div>
        </div>`
      }
    </header>`
}
export function Footer() {
  const links = [
    ["inicio", "Início"],
    ["simulador", "Simulador"],
    ["estilos", "Estilos"],
    ["cuidados", "Cuidados"],
    ["profissionais", "Profissionais"],
    ["sobre", "Sobre"],
    ["contato", "Contato"],
  ]
  return html`<footer class="bg-ink text-white">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          ${Logo({ tone: "light", size: 26 })}
          <p class="mt-5 max-w-xs font-display text-2xl leading-tight tracking-tight text-white/90">Seu cabelo.<br>Suas possibilidades.</p>
          <div class="mt-6 flex gap-2">
            ${["IG", "TT", "YT", "IN"].map((s) => html`<a${attr("data-key", s)} href="#/contato"${attr("aria-label", s)} class="grid size-10 place-items-center rounded-full border border-white/15 font-mono text-xs text-white/70 transition hover:border-lilac hover:text-lilac">${s}</a>`)}
          </div>
        </div>
        <div>
          <div class="font-mono text-xs uppercase tracking-[0.18em] text-lilac">Navegação</div>
          <ul class="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px] text-white/70">
            ${links.map(([id, l]) => html`<li${attr("data-key", id)}><button${attr("onClick", () => go(id))} class="hover:text-white">${l}</button></li>`)}
          </ul>
        </div>
        <div>
          <div class="font-mono text-xs uppercase tracking-[0.18em] text-lilac">Novidades</div>
          <p class="mt-5 text-sm text-white/60">Veja antes. Escolha melhor. Transforme seu estilo.</p>
          <form class="mt-4 flex gap-2"${attr("onSubmit", (e) => e.preventDefault())}>
            <input aria-label="E-mail" placeholder="seu@email.com" class="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm outline-none placeholder:text-white/35 focus:border-lilac">
            ${Button({ size: "md", children: html`Assinar` })}
          </form>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-white/45 md:px-8">
          <span>© 2026 Hairstyle Tecnologia Capilar Ltda.</span>
          <div class="flex gap-6">
            <a href="#/contato" class="hover:text-white">Política de privacidade</a>
            <a href="#/contato" class="hover:text-white">Termos de uso</a>
          </div>
        </div>
      </div>
    </footer>`
}
