import { useState } from "react";
import { Mail, Lock, User, ArrowLeft, ShieldCheck, Check } from "lucide-react";
import { Head3D } from "../components/Head3D";
import { Button, Field, Logo } from "../components/ui";
import { go, useApp } from "../lib/store";
import type { Hair } from "../lib/head";

const H: Hair = { cut: "longo", length: 3, color: "#8a4dff", texture: "cacheado", style: "natural", face: "oval" };

export default function Auth({ mode }: { mode: "entrar" | "cadastro" | "recuperar" }) {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [conf, setConf] = useState("");
  const [sent, setSent] = useState(false);
  const mismatch = mode === "cadastro" && conf.length > 0 && conf !== pass;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "recuperar") return setSent(true);
    if (mismatch) return;
    login(name.split(" ")[0] || "Marina", email || "marina@email.com");
    go("dashboard");
  };

  return (
    <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-14">
        <form onSubmit={submit} className="rise w-full max-w-sm">
          <Logo size={22} />
          {mode === "recuperar" && (
            <button type="button" onClick={() => go("entrar")} className="mt-8 flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink"><ArrowLeft size={15} />Voltar</button>
          )}
          <h1 className="mt-8 font-display text-4xl font-semibold leading-none tracking-[-0.035em]">
            {mode === "entrar" ? "Bem-vinda de volta." : mode === "cadastro" ? "Crie sua conta." : sent ? "Verifique seu e-mail." : "Recuperar senha."}
          </h1>
          <p className="mt-3 text-ink/60">
            {mode === "entrar" ? "Entre para continuar de onde parou." : mode === "cadastro" ? "Leva menos de um minuto. Seu cabelo agradece." : sent ? `Enviamos um link de redefinição para ${email || "seu e-mail"}.` : "Informe seu e-mail e enviaremos um link para criar uma nova senha."}
          </p>

          {!sent && (
            <div className="mt-8 space-y-4">
              {mode === "cadastro" && <Field label="Nome" icon={<User />} placeholder="Como devemos te chamar?" value={name} onChange={(e) => setName(e.target.value)} required />}
              <Field label="E-mail" type="email" icon={<Mail />} placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {mode !== "recuperar" && <Field label="Senha" type="password" icon={<Lock />} placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} required minLength={6} hint={mode === "cadastro" ? "Mínimo de 6 caracteres." : undefined} />}
              {mode === "cadastro" && <Field label="Confirmar senha" type="password" icon={<Lock />} placeholder="••••••••" value={conf} onChange={(e) => setConf(e.target.value)} required error={mismatch ? "As senhas não coincidem." : undefined} />}
            </div>
          )}

          {mode === "entrar" && <button type="button" onClick={() => go("recuperar")} className="mt-3 text-sm font-medium text-violet hover:underline">Esqueci minha senha</button>}

          {sent ? (
            <Button type="button" size="lg" className="mt-8 w-full" onClick={() => go("entrar")}>Voltar para o login</Button>
          ) : (
            <Button type="submit" size="lg" className="mt-7 w-full">{mode === "entrar" ? "Entrar" : mode === "cadastro" ? "Criar conta" : "Enviar link"}</Button>
          )}

          {mode === "cadastro" && <p className="mt-4 flex items-center gap-2 text-xs text-ink/50"><ShieldCheck size={15} className="text-violet" />Seus dados são protegidos e nunca compartilhados.</p>}

          <p className="mt-8 text-sm text-ink/60">
            {mode === "cadastro" ? (<>Já tem conta? <button type="button" onClick={() => go("entrar")} className="font-medium text-violet hover:underline">Entrar</button></>) : (<>Novo por aqui? <button type="button" onClick={() => go("cadastro")} className="font-medium text-violet hover:underline">Criar uma conta</button></>)}
          </p>
        </form>
      </div>

      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0 grain-grid opacity-70" />
        <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/35 blur-[120px]" />
        <Head3D hair={H} yaw={-20} autoRotate className="absolute inset-x-0 top-8 bottom-40" />
        <div className="absolute inset-x-12 bottom-12 text-white">
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight">Teste antes de transformar.</p>
          <ul className="mt-5 space-y-2 text-sm text-white/65">
            {["Salve seus visuais favoritos", "Compare cortes lado a lado", "Receba uma rotina de cuidados"].map((t) => <li key={t} className="flex items-center gap-2"><Check size={15} className="text-lilac" />{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
