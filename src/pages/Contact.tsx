import { useState } from "react";
import { Mail, MessageCircle, Phone, Clock, User, Check } from "lucide-react";
import { Button, Card, Field, PageHead } from "../components/ui";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <PageHead eyebrow="Suporte Hairstyle" title="Fale com a gente." sub="Dúvidas, sugestões ou parcerias. Respondemos em até 1 dia útil." />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-8">
          {sent ? (
            <div className="grid min-h-80 place-items-center text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-violet text-white"><Check /></span>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">Mensagem enviada.</h2>
                <p className="mt-2 text-ink/60">Nossa equipe retorna em breve por e-mail.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Enviar outra</Button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <Field label="Nome" icon={<User />} placeholder="Seu nome" required />
              <Field label="E-mail" type="email" icon={<Mail />} placeholder="voce@email.com" required />
              <Field label="Mensagem" textarea placeholder="Como podemos ajudar?" required />
              <Button size="lg" type="submit" className="w-full sm:w-auto">Enviar mensagem</Button>
            </form>
          )}
        </Card>
        <div className="space-y-4">
          <Card className="bg-ink! text-white">
            <div className="font-mono text-xs uppercase tracking-wider text-lilac">Suporte Hairstyle</div>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight">Estamos por aqui para ajudar.</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-white/60"><Clock size={15} />Seg a sex, 9h às 18h</div>
          </Card>
          {[[Mail, "E-mail", "suporte@hairstyle.app"], [MessageCircle, "Chat ao vivo", "Disponível no app"], [Phone, "WhatsApp comercial", "(11) 4002-8922"]].map(([I, t, d]) => {
            const Ic = I as typeof Mail;
            return (
              <div key={t as string} className="flex items-center gap-4 rounded-3xl border border-ink/8 p-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-lilac-soft text-violet"><Ic size={20} /></span>
                <div><div className="font-medium">{t as string}</div><div className="text-sm text-ink/55">{d as string}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
