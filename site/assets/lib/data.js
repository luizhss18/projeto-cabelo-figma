export const DEFAULT_HAIR = {
  cut: "repicado",
  length: 3,
  color: "#4a2c20",
  texture: "ondulado",
  style: "natural",
  face: "oval",
}
export const CUTS = [
  { id: "curto", name: "Curto", desc: "Prático e leve", length: 1 },
  { id: "medio", name: "Médio", desc: "Na altura do queixo", length: 2 },
  { id: "longo", name: "Longo", desc: "Até os ombros", length: 3 },
  { id: "degrade", name: "Degradê", desc: "Laterais suaves", length: 1 },
  { id: "repicado", name: "Repicado", desc: "Camadas em movimento", length: 3 },
  { id: "classico", name: "Clássico", desc: "Atemporal e limpo", length: 1 },
]
export const LENGTHS = ["Curtíssimo", "Curto", "Médio", "Longo", "Extralongo"]
export const COLORS = [
  { name: "Preto", hex: "#1a1416", group: "Naturais" },
  { name: "Castanho", hex: "#4a2c20", group: "Naturais" },
  { name: "Castanho claro", hex: "#8a5a3a", group: "Naturais" },
  { name: "Loiro", hex: "#d9b36c", group: "Naturais" },
  { name: "Platinado", hex: "#e7e0d2", group: "Naturais" },
  { name: "Ruivo", hex: "#a8431f", group: "Naturais" },
  { name: "Violeta", hex: "#8a4dff", group: "Fantasia" },
  { name: "Lilás", hex: "#c9a6ff", group: "Fantasia" },
  { name: "Rosa", hex: "#ff6fb5", group: "Fantasia" },
  { name: "Azul", hex: "#3b8cff", group: "Fantasia" },
  { name: "Verde", hex: "#20c997", group: "Fantasia" },
]
export const TEXTURES = [
  { id: "liso", name: "Liso", desc: "Tipo 1" },
  { id: "ondulado", name: "Ondulado", desc: "Tipo 2" },
  { id: "cacheado", name: "Cacheado", desc: "Tipo 3" },
  { id: "crespo", name: "Crespo", desc: "Tipo 4" },
]
export const STYLES = [
  { id: "natural", name: "Solto", desc: "Natural" },
  { id: "franja", name: "Franja", desc: "Com franja" },
  { id: "coque", name: "Coque", desc: "Preso no alto" },
  { id: "rabo", name: "Rabo", desc: "Rabo baixo" },
]
export const FACES = [
  {
    id: "oval",
    name: "Oval",
    desc: "Proporções equilibradas entre testa e queixo.",
    ratio: "1 : 1.32",
  },
  {
    id: "redondo",
    name: "Redondo",
    desc: "Largura e altura próximas, contornos suaves.",
    ratio: "1 : 1.05",
  },
  {
    id: "quadrado",
    name: "Quadrado",
    desc: "Mandíbula marcada e testa larga.",
    ratio: "1 : 1.15",
  },
  {
    id: "coracao",
    name: "Coração",
    desc: "Testa mais larga com queixo estreito.",
    ratio: "1 : 1.25",
  },
  {
    id: "alongado",
    name: "Alongado",
    desc: "Rosto mais comprido do que largo.",
    ratio: "1 : 1.5",
  },
]
export const colorName = (hex) =>
  COLORS.find((c) => c.hex === hex)?.name ?? "Personalizada"
export const cutName = (id) => CUTS.find((c) => c.id === id)?.name ?? id
export const faceName = (id) => FACES.find((c) => c.id === id)?.name ?? id
export const textureName = (id) => TEXTURES.find((c) => c.id === id)?.name ?? id
export const SEED_LOOKS = [
  {
    id: "a",
    name: "Camadas de verão",
    date: "Hoje, 09:40",
    hair: { ...DEFAULT_HAIR },
  },
  {
    id: "b",
    name: "Loiro mel curto",
    date: "Ontem",
    hair: {
      cut: "curto",
      length: 1,
      color: "#d9b36c",
      texture: "liso",
      style: "franja",
      face: "oval",
    },
  },
  {
    id: "c",
    name: "Cachos violeta",
    date: "Há 3 dias",
    hair: {
      cut: "longo",
      length: 3,
      color: "#8a4dff",
      texture: "cacheado",
      style: "natural",
      face: "oval",
    },
  },
  {
    id: "d",
    name: "Degradê clássico",
    date: "Há 1 semana",
    hair: {
      cut: "degrade",
      length: 1,
      color: "#1a1416",
      texture: "liso",
      style: "natural",
      face: "oval",
    },
  },
  {
    id: "e",
    name: "Coque crespo",
    date: "Há 2 semanas",
    hair: {
      cut: "medio",
      length: 2,
      color: "#4a2c20",
      texture: "crespo",
      style: "coque",
      face: "oval",
    },
  },
  {
    id: "f",
    name: "Ruivo longo",
    date: "Há 1 mês",
    hair: {
      cut: "longo",
      length: 4,
      color: "#a8431f",
      texture: "ondulado",
      style: "natural",
      face: "oval",
    },
  },
]
export const PRODUCTS = [
  {
    id: 1,
    name: "Shampoo Equilíbrio",
    cat: "Limpeza",
    desc: "Limpeza suave que respeita a oleosidade natural.",
    use: "Use 2x por semana",
    hue: "#6c3bff",
    shape: "bottle",
  },
  {
    id: 2,
    name: "Máscara Hidratação Profunda",
    cat: "Tratamento",
    desc: "Reposição de água e maciez para fios ondulados.",
    use: "1x por semana, 10 min",
    hue: "#b78cff",
    shape: "jar",
  },
  {
    id: 3,
    name: "Leave-in Definição",
    cat: "Finalização",
    desc: "Define ondas e reduz o frizz sem pesar.",
    use: "Diariamente, fios úmidos",
    hue: "#111111",
    shape: "tube",
  },
  {
    id: 4,
    name: "Óleo Brilho Seda",
    cat: "Finalização",
    desc: "Toque final com brilho e proteção térmica.",
    use: "Poucas gotas nas pontas",
    hue: "#d9b36c",
    shape: "dropper",
  },
  {
    id: 5,
    name: "Condicionador Nutri",
    cat: "Limpeza",
    desc: "Desembaraça e sela as cutículas após o shampoo.",
    use: "Após cada lavagem",
    hue: "#8a4dff",
    shape: "bottle",
  },
  {
    id: 6,
    name: "Protetor Térmico",
    cat: "Proteção",
    desc: "Barreira contra calor de até 230°C.",
    use: "Antes de secador e chapinha",
    hue: "#3b3a44",
    shape: "spray",
  },
]
