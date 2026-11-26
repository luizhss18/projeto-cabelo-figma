import { HeadThumb } from "../components/Head3D";
import { Button, Eyebrow } from "../components/ui";
import { go } from "../lib/store";

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <Eyebrow>Sobre a Hairstyle</Eyebrow>
      <div className="mt-6 grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">Ajudar você a visualizar seu próximo estilo antes de transformar seu cabelo.</h1>
          <div className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-ink/65">
            <p>Muita gente procura referências na internet, tenta reproduzir o visual e se frustra com o resultado. A Hairstyle nasceu para resolver isso.</p>
            <p>Com modelos 3D de manequins e cabelos, você testa cortes, comprimentos, cores e texturas considerando as proporções do seu rosto, e ainda recebe orientações de cuidados e produtos.</p>
          </div>
          <div className="mt-8 flex gap-3"><Button onClick={() => go("simulador")}>Começar simulação</Button><Button variant="outline" onClick={() => go("contato")}>Fale conosco</Button></div>
        </div>
        <div className="rounded-[2rem] bg-ink p-6">
          <HeadThumb hair={{ cut: "repicado", length: 3, color: "#8a4dff", texture: "ondulado", style: "natural", face: "oval" }} yaw={-20} className="mx-auto aspect-[5/6] w-full max-w-sm object-contain" />
        </div>
      </div>
      <div className="mt-20 grid gap-4 md:grid-cols-3">
        {[["Visualizar", "Ver antes reduz a incerteza e o arrependimento."], ["Personalizar", "Cada rosto e cada fio pedem possibilidades próprias."], ["Transformar", "A mudança acontece com mais confiança, no salão ou em casa."]].map(([t, d], i) => (
          <div key={t} className="rounded-3xl border border-ink/10 p-7"><div className="font-mono text-xs text-violet">0{i + 1}</div><h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{t}</h3><p className="mt-2 text-sm text-ink/60">{d}</p></div>
        ))}
      </div>
    </div>
  );
}
