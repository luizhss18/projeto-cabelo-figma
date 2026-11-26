const PI = Math.PI
const TAU = PI * 2
const { sin, cos, hypot } = Math
const FACE = {
  oval: [0.86, 1.08, 0.74],
  redondo: [0.98, 1, 0.95],
  quadrado: [0.94, 1, 0.92],
  coracao: [0.9, 1.04, 0.66],
  alongado: [0.8, 1.2, 0.78],
}
const LENGTH = [0, 0.45, 1, 1.75, 2.45]
const VOLUME = [1, 1.03, 1.08, 1.17]
const CURLS = [0, 110, 260, 480]
const CURL_RADIUS = [0, 0.1, 0.13, 0.16]

function randomSource(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function color(hex) {
  return [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
}

function transform(position, scale, tilt = 0, roll = 0) {
  const [px, py, pz] = position
  const [sx, sy, sz] = scale
  const cx = cos(tilt),
    snx = sin(tilt),
    cz = cos(roll),
    snz = sin(roll)
  return ([x, y, z], normal = false) => {
    x = normal ? x / sx : x * sx
    y = normal ? y / sy : y * sy
    z = normal ? z / sz : z * sz
    const a = x * cz - y * snz
    const b = x * snz + y * cz
    return [
      a + (normal ? 0 : px),
      b * cx - z * snx + (normal ? 0 : py),
      b * snx + z * cx + (normal ? 0 : pz),
    ]
  }
}

export function buildGeometry(hair) {
  const vertices = []
  const indices = []
  const [fx, fy, jaw] = FACE[hair.face]
  const skin = color("#e9e5f0")
  const pigment = color(hair.color)
  const texture = ["liso", "ondulado", "cacheado", "crespo"].indexOf(
    hair.texture,
  )
  const vol = VOLUME[texture]
  const n = CURLS[texture]
  const radius = CURL_RADIUS[texture]

  function surface(sample, columns, rows, material, specular, frame, group) {
    const start = vertices.length / 10
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= columns; col++) {
        const [point, normal] = sample(col / columns, row / rows)
        const local = frame(point)
        const localNormal = frame(normal, true)
        const p = group ? group(local) : local
        const normal3 = group ? group(localNormal, true) : localNormal
        const mag = hypot(...normal3)
        vertices.push(
          ...p,
          ...normal3.map((axis) => axis / mag),
          ...material,
          specular,
        )
        if (col < columns && row < rows) {
          const a = start + row * (columns + 1) + col
          const b = a + 1
          const c = a + columns + 1
          indices.push(a, c, b, b, c, c + 1)
        }
      }
    }
  }

  function globe(
    material,
    specular,
    at,
    scale,
    {
      tilt = 0,
      roll = 0,
      end = PI,
      slices = 40,
      rows = 24,
      group,
      capsule = 0,
    } = {},
  ) {
    surface(
      (u, v) => {
        const theta = v * end
        const normal = [
          sin(u * TAU) * sin(theta),
          cos(theta),
          cos(u * TAU) * sin(theta),
        ]
        const p = [...normal]
        if (capsule) p[1] += (Math.sign(cos(theta)) * capsule) / 2
        return [p, normal]
      },
      slices,
      rows,
      material,
      specular,
      transform(at, scale, tilt, roll),
      group,
    )
  }

  function curtain(
    material,
    specular,
    at,
    scale,
    top,
    bottom,
    { start = 0, arc = TAU, tilt = 0, slices = 48 } = {},
  ) {
    surface(
      (u, v) => {
        const a = start + u * arc
        const r = top + (bottom - top) * v
        return [
          [sin(a) * r, 0.5 - v, cos(a) * r],
          [sin(a), bottom - top, cos(a)],
        ]
      },
      slices,
      1,
      material,
      specular,
      transform(at, scale, tilt),
    )
  }

  globe(skin, 0.25, [0, 0.2, 0], [fx, fy, 0.98])
  globe(skin, 0.25, [0, -0.42, 0.14], [fx * 0.8, 0.62, 0.8 + jaw * 0.1])
  globe(skin, 0.25, [0, 0, 0.95], [0.1, 0.24, 0.13], {
    tilt: 0.25,
    slices: 24,
    rows: 16,
  })
  globe(skin, 0.25, [0, -0.15, 1], [0.13, 0.08, 0.1], { slices: 24, rows: 16 })
  for (const sign of [-1, 1]) {
    globe(skin, 0.25, [sign * fx * 0.98, 0.12, -0.02], [0.08, 0.24, 0.14], {
      slices: 20,
      rows: 16,
    })
  }
  curtain(skin, 0.25, [0, -1, -0.05], [1, 1.2, 1], 0.34, 0.4)
  globe(skin, 0.25, [0, -1.55, -0.05], [1.75, 0.6, 0.85], { end: PI / 2 })

  const fade = hair.cut === "degrade"
  const classic = hair.cut === "classico"
  const capAngle = PI * (fade ? 0.5 : classic ? 0.52 : 0.56)
  const cap = transform(
    [0, 0.3, -0.1],
    [fx * 1.03 * vol, fy * vol, 1.02 * vol],
    fade ? -0.22 : -0.45,
  )
  const uniform = (r) => [r, r, r]
  globe(pigment, 1, [0, 0, 0], uniform(1.07), { end: capAngle, group: cap })

  const rand = randomSource(11)
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - rand() * (1 - cos(capAngle - 0.1)))
    const phi = rand() * TAU
    globe(
      pigment,
      1,
      [
        1.08 * sin(theta) * cos(phi),
        1.08 * cos(theta),
        1.08 * sin(theta) * sin(phi),
      ],
      uniform(radius),
      { slices: 8, rows: 6, group: cap },
    )
  }

  let length = LENGTH[hair.length]
  if (fade) length = 0.5
  if (classic) length = Math.min(length, 0.5) || 0.4
  if (hair.cut === "curto") length = Math.min(length, 0.55)
  const start = hair.style === "franja" ? 0.8 : 0.95
  const arc = TAU - start * 2
  if (length > 0) {
    const bottom = length > 1.5 ? 0.78 : 0.92
    const side = fade
      ? pigment.map((value, i) => value * 0.65 + skin[i] * 0.35)
      : pigment
    curtain(
      side,
      fade ? 0.4 : 1,
      [0, 0.45 - length / 2, -0.12],
      [fx * 1.04 * vol, length, vol],
      1,
      bottom,
      { start, arc },
    )
    if (!fade) {
      for (
        let i = 0;
        i < Math.round(n * 0.6 * Math.min(1, length / 1.2));
        i++
      ) {
        const a = start + rand() * arc
        const y = 0.45 - rand() * length
        globe(
          pigment,
          1,
          [sin(a) * fx * 1.06 * vol, y, cos(a) * 1.02 * vol - 0.12],
          uniform(radius * 1.1),
          { slices: 8, rows: 6 },
        )
      }
    }
    if (hair.cut === "repicado" && length > 0.9) {
      for (let i = 0; i < 40; i++) {
        const a = start + (i * arc) / 39
        curtain(
          pigment,
          1,
          [
            sin(a) * bottom * fx * 1.04 * vol,
            0.37 - length - (i % 3) * 0.06,
            cos(a) * bottom * vol - 0.12,
          ],
          [1, 0.34 * (1 + (i % 3) * 0.5), 1],
          0.075,
          0,
          { slices: 8 },
        )
      }
    }
  }

  if (fade)
    globe(pigment, 1, [0, 1.2, -0.02], [
      0.72 * fx,
      0.42 + hair.length * 0.06,
      0.88,
    ])
  if (classic)
    globe(pigment, 1, [fx * 0.22, 1.1, 0.42], [0.62, 0.26, 0.5], {
      tilt: 0.4,
      roll: -0.35,
    })
  if (hair.style === "coque") globe(pigment, 1, [0, 1.3, -0.72], uniform(0.44))
  if (hair.style === "rabo")
    globe(pigment, 1, [0, -0.15, -1.15], uniform(0.2), {
      tilt: -0.12,
      capsule: 7.5,
    })
  if (hair.style === "franja")
    globe(pigment, 1, [0, 0.82, 0.62], [fx * 0.98, 0.3, 0.5], { tilt: 0.35 })

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  }
}
