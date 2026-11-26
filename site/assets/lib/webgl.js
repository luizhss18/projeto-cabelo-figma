import { buildGeometry } from "./head-geometry.js"

const vertex = `#version 300 es
  layout(location=0) in vec3 position;
  layout(location=1) in vec3 normal;
  layout(location=2) in vec4 material;
  uniform float yaw, distance, aspect;
  out vec3 worldNormal, worldPoint;
  out vec4 pigment;
  void main() {
    float c = cos(yaw), s = sin(yaw);
    mat3 rotation = mat3(c, 0., -s, 0., 1., 0., s, 0., c);
    worldPoint = rotation * position;
    worldNormal = rotation * normal;
    pigment = material;
    vec3 p = worldPoint - vec3(0., .6, distance);
    float pitch = atan(.3 / distance);
    float y = cos(pitch) * p.y - sin(pitch) * p.z;
    float z = sin(pitch) * p.y + cos(pitch) * p.z;
    float f = 3.73205;
    gl_Position = vec4(p.x * f / aspect, y * f, -z * 1.004 - .2, -z);
  }`

const fragment = `#version 300 es
  precision highp float;
  uniform float distance;
  in vec3 worldNormal, worldPoint;
  in vec4 pigment;
  out vec4 pixel;
  void main() {
    vec3 n = normalize(worldNormal) * (gl_FrontFacing ? 1. : -1.);
    vec3 key = normalize(vec3(3., 4., 5.));
    vec3 rim = normalize(vec3(-4., 2., -3.));
    vec3 fill = normalize(vec3(-3., -1., 4.));
    vec3 view = normalize(vec3(0., .6, distance) - worldPoint);
    vec3 light = vec3(.36)
      + max(dot(n, key), 0.) * .72
      + max(dot(n, rim), 0.) * vec3(.48, .26, .9)
      + max(dot(n, fill), 0.) * vec3(.09, .04, .22);
    float sheen = pow(max(dot(n, normalize(key + view)), 0.), mix(26., 48., pigment.a)) * .22
      + pow(max(dot(n, normalize(rim + view)), 0.), 26.) * .16;
    vec3 linear = pigment.rgb * light + sheen * mix(.15, 1., pigment.a);
    vec3 srgb = mix(12.92 * linear, 1.055 * pow(linear, vec3(1. / 2.4)) - .055,
      step(vec3(.0031308), linear));
    pixel = vec4(srgb, 1.);
  }`

function shader(gl, type, source) {
  const result = gl.createShader(type)
  gl.shaderSource(result, source)
  gl.compileShader(result)
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(result))
  }
  return result
}

function setup() {
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  })
  if (!gl) return null
  const program = gl.createProgram()
  const shaders = [
    shader(gl, gl.VERTEX_SHADER, vertex),
    shader(gl, gl.FRAGMENT_SHADER, fragment),
  ]
  shaders.forEach((value) => gl.attachShader(program, value))
  gl.linkProgram(program)
  shaders.forEach((value) => gl.deleteShader(value))
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program))
  gl.useProgram(program)
  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)
  const uniforms = ["yaw", "distance", "aspect"].map((name) =>
    gl.getUniformLocation(program, name),
  )
  const meshes = new Map()

  function mesh(hair) {
    const key = JSON.stringify(hair)
    if (meshes.has(key)) {
      const result = meshes.get(key)
      meshes.delete(key)
      meshes.set(key, result)
      return result
    }
    const geometry = buildGeometry(hair)
    const vao = gl.createVertexArray()
    const vertices = gl.createBuffer()
    const indices = gl.createBuffer()
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices)
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW)
    for (const [slot, size, offset] of [
      [0, 3, 0],
      [1, 3, 12],
      [2, 4, 24],
    ]) {
      gl.enableVertexAttribArray(slot)
      gl.vertexAttribPointer(slot, size, gl.FLOAT, false, 40, offset)
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW)
    const value = { vao, vertices, indices, count: geometry.indices.length }
    meshes.set(key, value)
    if (meshes.size > 16) {
      const oldest = meshes.keys().next().value
      const old = meshes.get(oldest)
      gl.deleteVertexArray(old.vao)
      gl.deleteBuffer(old.vertices)
      gl.deleteBuffer(old.indices)
      meshes.delete(oldest)
    }
    return value
  }

  return (hair, yaw, zoom, width, height) => {
    if (gl.isContextLost()) return null
    if (canvas.width !== width) canvas.width = width
    if (canvas.height !== height) canvas.height = height
    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const model = mesh(hair)
    gl.bindVertexArray(model.vao)
    gl.uniform1f(uniforms[0], (yaw * Math.PI) / 180)
    gl.uniform1f(uniforms[1], 7.4 / zoom)
    gl.uniform1f(uniforms[2], width / height)
    gl.drawElements(gl.TRIANGLES, model.count, gl.UNSIGNED_INT, 0)
    return canvas
  }
}

let renderer
let fallback

// A 2D silhouette keeps the selected cut and color visible if WebGL is unavailable.
function drawFallback(hair, yaw, zoom, width, height) {
  fallback ??= document.createElement("canvas")
  fallback.width = width
  fallback.height = height
  const ctx = fallback.getContext("2d")
  const scale = Math.min(height / 5.4, width / 3.6) * zoom
  const turn = Math.sin((yaw * Math.PI) / 180)
  ctx.translate(width / 2, height * 0.54)
  ctx.scale(scale, scale)
  const oval = (x, y, rx, ry, fill) => {
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
  }
  const face = ctx.createLinearGradient(-1, 0, 1, 0)
  face.addColorStop(0, "#afa0cf")
  face.addColorStop(0.55, "#f0eaf9")
  face.addColorStop(1, "#c9badc")
  const pigment = ctx.createLinearGradient(-1, 0, 1, 0)
  pigment.addColorStop(0, hair.color)
  pigment.addColorStop(0.55, `${hair.color}bb`)
  pigment.addColorStop(1, hair.color)
  const length = [0.6, 0.9, 1.1, 1.4, 1.65][hair.length]
  const widthByFace = {
    oval: 0.8,
    redondo: 0.92,
    quadrado: 0.9,
    coracao: 0.83,
    alongado: 0.75,
  }
  const faceWidth = widthByFace[hair.face] * (1 - Math.abs(turn) * 0.12)
  oval(0, -0.38 + length * 0.34, faceWidth + 0.15, length, pigment)
  oval(0, 1.2, 0.34, 0.57, face)
  oval(0, 1.56, 1.42, 0.24, face)
  oval(
    turn * 0.15,
    -0.12,
    faceWidth,
    hair.face === "alongado" ? 1.15 : 1.04,
    face,
  )
  oval(turn * 0.74, 0.03, 0.12, 0.2, face)
  oval(
    0,
    -0.93,
    faceWidth + 0.14,
    hair.style === "franja" ? 0.49 : 0.39,
    pigment,
  )
  if (hair.style === "coque") oval(turn * -0.6, -1.38, 0.4, 0.4, pigment)
  if (hair.style === "rabo") oval(turn * -0.75, 0.08, 0.23, 0.94, pigment)
  return fallback
}

export function drawHead(hair, yaw, zoom, width, height) {
  if (renderer === undefined) {
    try {
      renderer = setup()
    } catch (error) {
      console.warn("Renderização WebGL indisponível:", error.message)
      renderer = null
    }
  }
  return (
    renderer?.(hair, yaw, zoom, width, height) ??
    drawFallback(hair, yaw, zoom, width, height)
  )
}
