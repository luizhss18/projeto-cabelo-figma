import { useState } from "react";
import { Mail, Plus, ArrowRight } from "lucide-react";
import { Avatar, Badge, Button, Chip, CutCard, Field, Logo, Modal, ModelControls, PageHead, ProductCard, Tabs } from "../components/ui";
import { DEFAULT_HAIR, PRODUCTS } from "../lib/data";

const Block = ({ title, children, dark }: { title: string; children: React.ReactNode; dark?: boolean }) => (
  <section className="border-t border-ink/10 py-10">
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">{title}</h2>
      <div className={dark ? "rounded-3xl bg-ink p-8" : ""}>{children}</div>
    </div>
  </section>
);

export default function System() {
  const [tab, setTab] = useState("a");
  const [chip, setChip] = useState(true);
  const [modal, setModal] = useState(false);
  const [yaw, setYaw] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [auto, setAuto] = useState(false);
  const base = window.location.pathname;
  return (
    <div>
      <PageHead eyebrow="Design system" title="Hairstyle UI." sub="Componentes, cores e tipografia que sustentam toda a plataforma." />
      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <Block title="Logotipo">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid h-40 place-items-center rounded-3xl border border-ink/10"><Logo size={40} /></div>
            <div className="grid h-40 place-items-center rounded-3xl bg-ink"><Logo tone="light" size={40} /></div>
          </div>
        </Block>
        <Block title="Cores">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[["Grafite", "#111111"], ["Roxo", "#6C3BFF"], ["Lilás", "#B78CFF"], ["Névoa", "#F5F5F5"], ["Branco", "#FFFFFF"]].map(([n, h]) => (
              <div key={h}><div className="h-24 rounded-2xl border border-ink/10" style={{ background: h }} /><div className="mt-2 text-sm font-medium">{n}</div><div className="font-mono text-xs text-ink/50">{h}</div></div>
            ))}
          </div>
        </Block>
        <Block title="Tipografia">
          <div className="space-y-3">
            <div className="font-display text-6xl font-semibold tracking-[-0.04em]">Bricolage Grotesque</div>
            <p className="text-lg text-ink/70">Geist para textos de interface, leitura e formulários.</p>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet">Geist Mono · rótulos e dados</p>
          </div>
        </Block>
        <Block title="Botões">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primário</Button><Button variant="dark">Escuro</Button><Button variant="outline">Contorno</Button><Button variant="ghost">Ghost</Button>
            <Button icon={<Plus size={16} />} size="sm">Pequeno</Button><Button size="lg" iconRight={<ArrowRight size={18} />}>Grande</Button><Button disabled>Desabilitado</Button>
          </div>
        </Block>
        <Block title="Inputs">
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="E-mail" icon={<Mail />} placeholder="voce@email.com" />
            <Field label="Com erro" error="Campo obrigatório." defaultValue="" />
          </div>
        </Block>
        <Block title="Chips, badges e tabs">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2"><Chip selected={chip} onClick={() => setChip(!chip)}>Selecionado</Chip><Chip>Padrão</Chip><Badge>Novo</Badge><Badge tone="soft">Tendência</Badge><Badge tone="dark">Pro</Badge></div>
            <Tabs value={tab} onChange={setTab} items={[{ id: "a", label: "Corte" }, { id: "b", label: "Cor" }, { id: "c", label: "Textura" }]} className="max-w-sm" />
            <Tabs variant="pill" value={tab} onChange={setTab} items={[{ id: "a", label: "Corte" }, { id: "b", label: "Cor" }, { id: "c", label: "Textura" }]} className="w-fit" />
          </div>
        </Block>
        <Block title="Avatares e modal">
          <div className="flex flex-wrap items-center gap-4"><Avatar name="Marina" size={32} /><Avatar name="Rafael" size={48} /><Avatar name="Bia" size={64} /><Button variant="outline" onClick={() => setModal(true)}>Abrir modal</Button></div>
          <Modal open={modal} onClose={() => setModal(false)} title="Salvar visual"><p className="text-ink/60">Modal com fundo desfocado e fechamento por Esc.</p><Button className="mt-5 w-full" onClick={() => setModal(false)}>Confirmar</Button></Modal>
        </Block>
        <Block title="Cards de corte e produto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CutCard hair={DEFAULT_HAIR} title="Repicado" desc="Camadas" selected />
            <CutCard hair={{ ...DEFAULT_HAIR, cut: "degrade", length: 1 }} title="Degradê" desc="Padrão" />
            <div className="lg:col-span-2"><ProductCard p={PRODUCTS[1]} /></div>
          </div>
        </Block>
        <Block title="Controles 3D" dark>
          <div className="flex justify-center"><ModelControls yaw={yaw} setYaw={setYaw} zoom={zoom} setZoom={setZoom} auto={auto} setAuto={setAuto} /></div>
        </Block>
        <Block title="Responsivo">
          <div className="flex flex-wrap items-start gap-8">
            {[["Tablet · 820", 820, 1024, "simulador"], ["Mobile · 390", 390, 780, "simulador"], ["Mobile · 390", 390, 780, "inicio"]].map(([l, w, h, r], i) => (
              <figure key={i}>
                <div className="overflow-hidden rounded-[2rem] border-[6px] border-ink bg-white" style={{ width: (w as number) * 0.55 + 12, height: (h as number) * 0.55 + 12 }}>
                  <iframe title={`${l} ${r}`} src={`${base}#/${r}`} loading="lazy" style={{ width: w as number, height: h as number, transform: "scale(.55)", transformOrigin: "0 0", border: 0 }} />
                </div>
                <figcaption className="mt-3 font-mono text-xs uppercase tracking-wider text-ink/50">{l as string} · {r as string}</figcaption>
              </figure>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
