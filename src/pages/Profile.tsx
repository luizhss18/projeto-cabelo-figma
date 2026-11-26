import { useState } from "react";
import { Pencil, Check, Clock, Heart, Droplets } from "lucide-react";
import { HeadThumb } from "../components/Head3D";
import { Avatar, Badge, Button, Card, Chip, Field, Tabs } from "../components/ui";
import { TEXTURES, colorName, cutName, faceName, textureName } from "../lib/data";
import { go, useApp } from "../lib/store";

type Tab = "salvos" | "historico" | "favoritos" | "rotina";

export default function Profile() {
  const { user, hair, looks, setHair } = useApp();
  const [tab, setTab] = useState<Tab>("salvos");
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name ?? "Marina Duarte");
  const [email, setEmail] = useState(user?.email ?? "marina@email.com");
  const [prefs, setPrefs] = useState(["Cores naturais", "Baixa manutenção"]);
  const allPrefs = ["Cores naturais", "Tons fantasia", "Baixa manutenção", "Cabelo longo", "Corte curto"];

  const open = (h: typeof hair) => { setHair(h); go("simulador"); };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <div className="flex items-center gap-4">
              <Avatar name={name} size={64} />
              <div className="min-w-0">
                <h1 className="truncate font-display text-2xl font-semibold tracking-tight">{name}</h1>
                <p className="truncate text-sm text-ink/55">{email}</p>
              </div>
            </div>
            {edit ? (
              <div className="mt-6 space-y-4">
                <Field label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
                <Field label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Field label="Senha" type="password" defaultValue="senhasegura" hint="Toque para alterar sua senha." />
                <div>
                  <div className="mb-2 text-sm font-medium text-ink/80">Tipo de cabelo</div>
                  <div className="flex flex-wrap gap-2">{TEXTURES.map((t) => <Chip key={t.id} selected={hair.texture === t.id} onClick={() => setHair({ ...hair, texture: t.id })}>{t.name}</Chip>)}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-ink/80">Preferências</div>
                  <div className="flex flex-wrap gap-2">{allPrefs.map((p) => <Chip key={p} selected={prefs.includes(p)} onClick={() => setPrefs((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))}>{p}</Chip>)}</div>
                </div>
                <Button className="w-full" icon={<Check size={16} />} onClick={() => setEdit(false)}>Salvar alterações</Button>
              </div>
            ) : (
              <>
                <dl className="mt-6 divide-y divide-ink/8 text-sm">
                  {[["Senha", "••••••••••"], ["Tipo de cabelo", textureName(hair.texture)], ["Formato do rosto", faceName(hair.face)], ["Características", `${cutName(hair.cut)} · ${colorName(hair.color)}`]].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3"><dt className="text-ink/50">{k}</dt><dd className="font-medium">{v}</dd></div>
                  ))}
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">{prefs.map((p) => <Badge key={p} tone="soft">{p}</Badge>)}</div>
                <Button variant="outline" className="mt-6 w-full" icon={<Pencil size={15} />} onClick={() => setEdit(true)}>Editar perfil</Button>
              </>
            )}
          </Card>
        </aside>

        <main>
          <Tabs value={tab} onChange={setTab} items={[{ id: "salvos", label: "Meus estilos salvos" }, { id: "historico", label: "Histórico de simulações" }, { id: "favoritos", label: "Favoritos" }, { id: "rotina", label: "Minha rotina capilar" }]} />

          {(tab === "salvos" || tab === "favoritos") && (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {(tab === "favoritos" ? looks.filter((_, i) => i % 2 === 0) : looks).map((l) => (
                <button key={l.id} onClick={() => open(l.hair)} className="group overflow-hidden rounded-3xl border border-ink/8 bg-white text-left transition hover:-translate-y-1">
                  <div className="relative bg-gradient-to-b from-lilac-soft to-mist">
                    <HeadThumb hair={l.hair} className="aspect-[5/6] w-full object-contain" />
                    <Heart size={18} className="absolute right-3 top-3 fill-violet text-violet" />
                  </div>
                  <div className="p-4"><div className="font-medium">{l.name}</div><div className="text-xs text-ink/50">{cutName(l.hair.cut)} · {colorName(l.hair.color)}</div></div>
                </button>
              ))}
            </div>
          )}

          {tab === "historico" && (
            <ol className="mt-8 divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white">
              {looks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => open(l.hair)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-mist">
                    <HeadThumb hair={l.hair} className="size-16 rounded-2xl bg-lilac-soft object-contain" />
                    <div className="flex-1"><div className="font-medium">{l.name}</div><div className="text-sm text-ink/50">{cutName(l.hair.cut)} · {textureName(l.hair.texture)} · {colorName(l.hair.color)}</div></div>
                    <span className="flex items-center gap-1.5 text-xs text-ink/45"><Clock size={13} />{l.date}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}

          {tab === "rotina" && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[["Lavagem", "2x por semana com shampoo Equilíbrio"], ["Hidratação", "Máscara profunda toda quarta"], ["Finalização", "Leave-in e óleo nas pontas"], ["Proteção", "Protetor térmico antes do calor"]].map(([t, d]) => (
                <Card key={t}><Droplets className="text-violet" size={20} /><h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{t}</h3><p className="mt-1 text-sm text-ink/60">{d}</p></Card>
              ))}
              <Button className="md:col-span-2" variant="dark" onClick={() => go("cuidados")}>Ajustar rotina em Cuidados</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
