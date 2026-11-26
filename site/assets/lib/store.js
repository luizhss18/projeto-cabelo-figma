import { DEFAULT_HAIR, SEED_LOOKS } from "./data.js"

const page = new Map()
const app = {
  user: null,
  hair: { ...DEFAULT_HAIR },
  looks: [...SEED_LOOKS],
  compare: [{ ...DEFAULT_HAIR }, { ...SEED_LOOKS[1].hair }],
  login: (name, email) => {
    app.user = { name, email }
  },
  logout: () => {
    app.user = null
  },
  setHair: (value) => {
    app.hair = typeof value === "function" ? value(app.hair) : value
  },
  setCompare: (value) => {
    app.compare = value
  },
  saveLook: (name) => {
    app.looks = [
      {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        name,
        date: "Agora",
        hair: { ...app.hair },
      },
      ...app.looks,
    ]
  },
}

export const appState = () => app
export const resetPage = () => page.clear()
export function pageValue(key, initial) {
  if (!page.has(key)) page.set(key, initial)
  return page.get(key)
}
export const pageSetter = (key) => (value) => {
  page.set(key, typeof value === "function" ? value(page.get(key)) : value)
}

export function go(route) {
  window.location.hash = "/" + route
  window.scrollTo({ top: 0 })
}
