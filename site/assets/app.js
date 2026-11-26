import { html, renderInto, resetActions, runAction } from "./lib/dom.js"
import { resetPage } from "./lib/store.js"
import { syncModels } from "./components/Head3D.js"
import { Footer, Header } from "./components/Shell.js"
import Landing from "./pages/Landing.js"
import Simulator from "./pages/Simulator.js"
import Face from "./pages/Face.js"
import Explore from "./pages/Explore.js"
import Care from "./pages/Care.js"
import Profile from "./pages/Profile.js"
import Auth from "./pages/Auth.js"
import Pro from "./pages/Pro.js"
import Contact from "./pages/Contact.js"
import Dashboard from "./pages/Dashboard.js"
import Compare from "./pages/Compare.js"
import System from "./pages/System.js"
import About from "./pages/About.js"

const root = document.getElementById("root")
const pages = {
  inicio: Landing,
  simulador: Simulator,
  rosto: Face,
  estilos: Explore,
  cuidados: Care,
  perfil: Profile,
  entrar: () => Auth({ mode: "entrar" }),
  cadastro: () => Auth({ mode: "cadastro" }),
  recuperar: () => Auth({ mode: "recuperar" }),
  profissionais: Pro,
  contato: Contact,
  dashboard: Dashboard,
  comparar: Compare,
  sistema: System,
  sobre: About,
}
const fullscreen = new Set(["simulador", "entrar", "cadastro", "recuperar"])
let currentRoute
let modalTrigger

function render() {
  const requested =
    window.location.hash.replace(/^#\/?/, "").split("?")[0] ||
    root.dataset.initialPage
  const route = Object.hasOwn(pages, requested) ? requested : "inicio"
  const changed = currentRoute !== route
  const previousDialog = root.querySelector("[role=dialog]")
  const previousFocus = document.activeElement
  if (changed) {
    resetPage()
    currentRoute = route
  }

  resetActions()
  renderInto(
    root,
    html`
    <div class="min-h-screen bg-white">
      ${Header({ route, dark: route === "inicio" || route === "profissionais" })}
      <main>${pages[route]()}</main>
      ${!fullscreen.has(route) && Footer()}
    </div>
  `,
    changed,
  )

  const dialog = root.querySelector("[role=dialog]")
  if (dialog && (!previousDialog || !dialog.contains(document.activeElement))) {
    if (!previousDialog) modalTrigger = previousFocus
    const focusTarget =
      dialog.querySelector("[autofocus]") ?? dialog.querySelector("button")
    focusTarget?.focus({ preventScroll: true })
  } else if (!dialog && previousDialog) {
    if (!changed && modalTrigger?.isConnected)
      modalTrigger.focus({ preventScroll: true })
    modalTrigger = null
  }

  syncModels(root, (host, yaw) => {
    if (runAction(host, "yaw", yaw)) render()
  })
}

for (const type of ["click", "input", "submit"]) {
  root.addEventListener(type, (event) => {
    const target = event.target.closest(`[data-action-${type}]`)
    if (runAction(target, type, event)) render()
  })
}

document.addEventListener("keydown", (event) => {
  const dialog = root.querySelector("[role=dialog]")
  if (!dialog) return
  if (event.key === "Escape" && runAction(dialog, "close")) {
    event.preventDefault()
    render()
  }
  if (event.key !== "Tab") return
  const focusable = [
    ...dialog.querySelectorAll(
      "button:not(:disabled), input:not(:disabled), a[href], textarea:not(:disabled)",
    ),
  ]
  const edge = event.shiftKey ? focusable.at(0) : focusable.at(-1)
  if (document.activeElement === edge) {
    event.preventDefault()
    ;(event.shiftKey ? focusable.at(-1) : focusable.at(0))?.focus()
  }
})

window.addEventListener("hashchange", render)
render()
