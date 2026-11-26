import { attr, html } from "../lib/dom.js"
import { drawHead } from "../lib/webgl.js"

export function Head3D({
  hair,
  yaw = -25,
  zoom = 1,
  autoRotate = false,
  onYaw,
  className = "",
}) {
  return html`<div${attr("class", className)}
    ${attr("data-model", JSON.stringify({ hair, yaw, zoom, autoRotate }))}
    ${attr("onYaw", onYaw)}></div>`
}

export function HeadThumb({ hair, yaw = -28, className = "" }) {
  return html`<img${attr("class", className)}${attr("data-thumb", JSON.stringify({ hair, yaw }))}
    alt="Modelo de cabelo" width="300" height="360" draggable="false">`
}

const models = new Map()
const thumbnails = new Map()
const drawnThumbs = new WeakMap()
const observedThumbs = new Set()
const queue = new Set()
let animationFrame = 0
let notifyYaw

function wake() {
  if (!animationFrame) animationFrame = requestAnimationFrame(frame)
}

const resize = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    const state = models.get(target)
    if (state) state.dirty = true
  }
  wake()
})

const observe = new IntersectionObserver(
  (entries) => {
    for (const { target, isIntersecting } of entries) {
      if (models.has(target)) models.get(target).visible = isIntersecting
      else if (isIntersecting) {
        observe.unobserve(target)
        observedThumbs.delete(target)
        queue.add(target)
      }
    }
    wake()
  },
  { rootMargin: "240px" },
)

function attach(host, input) {
  const canvas = document.createElement("canvas")
  canvas.className = "model-canvas"
  canvas.setAttribute("role", "img")
  canvas.setAttribute("aria-label", "Modelo de cabelo interativo")
  host.append(canvas)
  const state = {
    ...input,
    target: input.yaw,
    angle: input.yaw,
    scale: input.zoom,
    seen: host.dataset.model,
    canvas,
    ctx: canvas.getContext("2d"),
    visible: true,
    dirty: true,
    drag: null,
  }
  models.set(host, state)
  resize.observe(host)
  observe.observe(host)
  canvas.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return
    state.drag = event.clientX
    canvas.setPointerCapture(event.pointerId)
    canvas.classList.add("is-dragging")
  })
  canvas.addEventListener("pointermove", (event) => {
    if (state.drag === null || !event.isPrimary) return
    state.target += (event.clientX - state.drag) * 0.6
    state.drag = event.clientX
    notifyYaw(host, state.target)
    wake()
  })
  canvas.addEventListener("lostpointercapture", () => {
    state.drag = null
    canvas.classList.remove("is-dragging")
    wake()
  })
}

export function syncModels(root, onYaw) {
  notifyYaw = onYaw
  for (const host of models.keys()) {
    if (root.contains(host)) continue
    models.delete(host)
    resize.unobserve(host)
    observe.unobserve(host)
  }
  for (const host of root.querySelectorAll("[data-model]")) {
    const state = models.get(host)
    if (state?.seen === host.dataset.model) continue
    const next = JSON.parse(host.dataset.model)
    if (!state) attach(host, next)
    else {
      if (next.yaw !== state.yaw) state.target = next.yaw
      Object.assign(state, next, { dirty: true, seen: host.dataset.model })
    }
  }
  for (const image of observedThumbs) {
    if (root.contains(image)) continue
    observe.unobserve(image)
    observedThumbs.delete(image)
  }
  for (const image of root.querySelectorAll("[data-thumb]")) {
    if (
      drawnThumbs.get(image) === image.dataset.thumb ||
      observedThumbs.has(image)
    )
      continue
    observedThumbs.add(image)
    observe.observe(image)
  }
  wake()
}

function paintThumb(image) {
  if (!image.isConnected || drawnThumbs.get(image) === image.dataset.thumb)
    return
  const key = image.dataset.thumb
  const { hair, yaw } = JSON.parse(key)
  let src = thumbnails.get(key)
  if (!src) {
    src = drawHead(hair, yaw, 1, 300, 360).toDataURL()
    thumbnails.set(key, src)
    if (thumbnails.size > 64) thumbnails.delete(thumbnails.keys().next().value)
  }
  image.src = src
  drawnThumbs.set(image, key)
}

let lastFrame = 0
function frame(time) {
  animationFrame = 0
  const elapsed = Math.min(time - lastFrame, 32)
  lastFrame = time
  let nextFrame = false
  for (const [host, model] of models) {
    if (!model.visible || !host.clientWidth || !host.clientHeight) continue
    const rotating = model.autoRotate && model.drag === null
    if (rotating) model.target += 0.0132 * elapsed
    const moving =
      Math.abs(model.target - model.angle) > 0.05 ||
      Math.abs(model.zoom - model.scale) > 0.001
    if (!rotating && !moving && !model.dirty) continue
    model.angle += (model.target - model.angle) * 0.12
    model.scale += (model.zoom - model.scale) * 0.12
    const density = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = Math.round(host.clientWidth * density)
    const height = Math.round(host.clientHeight * density)
    if (model.canvas.width !== width) model.canvas.width = width
    if (model.canvas.height !== height) model.canvas.height = height
    const image = drawHead(model.hair, model.angle, model.scale, width, height)
    model.ctx.clearRect(0, 0, width, height)
    model.ctx.drawImage(image, 0, 0)
    model.dirty = false
    nextFrame ||= rotating || moving
  }

  // Limit thumbnail work per frame so the interactive canvas stays responsive.
  for (const image of [...queue].slice(0, 2)) {
    queue.delete(image)
    paintThumb(image)
  }
  if (nextFrame || queue.size) wake()
}
