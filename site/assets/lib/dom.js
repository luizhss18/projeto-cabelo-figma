const markup = Symbol("markup")
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  )

const serialize = (value) => {
  if (value == null || typeof value === "boolean") return ""
  if (Array.isArray(value)) return value.map(serialize).join("")
  return value[markup] ?? escape(value)
}

export function html(strings, ...values) {
  return {
    [markup]: strings.reduce(
      (out, part, i) => out + part + serialize(values[i]),
      "",
    ),
  }
}

const names = {
  className: "class",
  defaultValue: "value",
  minLength: "minlength",
  autoFocus: "autofocus",
}
const events = {
  onClick: "click",
  onChange: "input",
  onSubmit: "submit",
  onClose: "close",
  onYaw: "yaw",
}
const handlers = []

export function attr(name, value) {
  if (value == null) return ""
  if (events[name]) {
    return typeof value === "function"
      ? {
          [markup]: ` data-action-${events[name]}="${handlers.push(value) - 1}"`,
        }
      : ""
  }
  if (name === "style") {
    value = Object.entries(value)
      .map(([key, val]) => {
        const property = key.replace(
          /[A-Z]/g,
          (letter) => "-" + letter.toLowerCase(),
        )
        const unit =
          typeof val === "number" && /^(width|height|font-size)$/.test(property)
            ? "px"
            : ""
        return `${property}:${val}${unit}`
      })
      .join(";")
  }
  name = names[name] ?? name
  if (typeof value === "boolean" && !/^(aria-|data-)/.test(name)) {
    return value ? { [markup]: ` ${name}` } : ""
  }
  return { [markup]: ` ${name}="${escape(value)}"` }
}

export function attrs(values) {
  return Object.entries(values).map(([key, value]) => attr(key, value))
}

export function resetActions() {
  handlers.length = 0
}

export function runAction(element, type, value) {
  const id = element?.getAttribute(`data-action-${type}`)
  if (id == null || !handlers[id]) return false
  handlers[id](value)
  return true
}

function matches(old, next) {
  if (!old || old.nodeType !== next.nodeType || old.nodeName !== next.nodeName)
    return false
  if (old.nodeType !== Node.ELEMENT_NODE) return true
  return (
    old.getAttribute("data-key") === next.getAttribute("data-key") &&
    old.hasAttribute("data-model") === next.hasAttribute("data-model") &&
    old.hasAttribute("data-thumb") === next.hasAttribute("data-thumb")
  )
}

// Keep native inputs, the scrollable panels, and WebGL canvases mounted during edits.
function updateChildren(parent, incoming) {
  let current = parent.firstChild
  for (const next of [...incoming.childNodes]) {
    if (!matches(current, next)) {
      const key =
        next.nodeType === Node.ELEMENT_NODE && next.getAttribute("data-key")
      const existing =
        key == null || key === false
          ? null
          : [...parent.children].find((node) => matches(node, next))
      if (!existing) {
        parent.insertBefore(next, current)
        continue
      }
      if (existing !== current) parent.insertBefore(existing, current)
      current = existing
    }

    if (
      current.nodeType === Node.TEXT_NODE ||
      current.nodeType === Node.COMMENT_NODE
    ) {
      if (current.data !== next.data) current.data = next.data
    } else {
      for (const attribute of [...current.attributes]) {
        if (
          !next.hasAttribute(attribute.name) &&
          !(attribute.name === "src" && current.hasAttribute("data-thumb"))
        ) {
          current.removeAttribute(attribute.name)
        }
      }
      for (const attribute of next.attributes) {
        if (current.getAttribute(attribute.name) !== attribute.value) {
          current.setAttribute(attribute.name, attribute.value)
        }
      }
      if (!current.hasAttribute("data-model")) updateChildren(current, next)
      if (
        current instanceof HTMLInputElement &&
        next.hasAttribute("value") &&
        current.value !== next.value
      ) {
        current.value = next.value
      }
    }
    current = current.nextSibling
  }
  while (current) {
    const next = current.nextSibling
    current.remove()
    current = next
  }
}

export function renderInto(root, view, replace = false) {
  const template = document.createElement("template")
  template.innerHTML = serialize(view)
  if (replace) root.replaceChildren(template.content)
  else updateChildren(root, template.content)
}
