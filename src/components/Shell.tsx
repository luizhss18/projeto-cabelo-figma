import { useState } from "react";
import { Menu, X, LayoutGrid, User, LogOut } from "lucide-react";
import { Avatar, Button, Logo, cx } from "./ui";
import { go, useApp } from "../lib/store";

const NAV = [
  ["inicio", "Início"],
  ["simulador", "Simulador"],
  ["estilos", "Estilos"],
  ["cuidados", "Cuidados"],
  ["profissionais", "Para profissionais"],
  ["sobre", "Sobre"],
] as const;

export function Header({ route, dark }: { route: string; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, logout } = useApp();
  const nav = (r: string) => {
    setOpen(false);
    setMenu(false);
    go(r);
  };
  return (
    <header className={cx("sticky top-0 z-50 border-b backdrop-blur-xl", dark ? "border-white/8 bg-ink/80 text-white" : "border-ink/8 bg-white/85 text-ink")}>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <button onClick={() => nav(user ? "dashboard" : "inicio")} aria-label="Hairstyle — início">
          <Logo tone={dark ? "light" : "dark"} size={21} />
        </button>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map(([id, l]) => (
            <button key={id} onClick={() => nav(id)} className={cx("rounded-full px-3.5 py-2 text-[14px] transition", route === id ? (dark ? "bg-white/10 text-white" : "bg-ink/6 text-ink") : dark ? "text-white/65 hover:text-white" : "text-ink/60 hover:text-ink")}>
              {l}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} aria-label="Conta" className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-ink/5">
                <Avatar name={user.name} size={34} />
                <span className="hidden text-sm font-medium sm:block">{user.name}</span>
              </button>
              {menu && (
                <div className="absolute right-0 top-12 w-52 rounded-2xl border border-ink/10 bg-white p-2 text-ink shadow-xl">
                  <button onClick={() => nav("dashboard")} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-mist"><LayoutGrid size={16} />Dashboard</button>
                  <button onClick={() => nav("perfil")} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-mist"><User size={16} />Meu perfil</button>
                  <button onClick={() => { logout(); nav("inicio"); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-mist"><LogOut size={16} />Sair</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => nav("entrar")} className={cx("hidden rounded-full px-4 py-2 text-sm font-medium sm:block", dark ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-ink")}>Entrar</button>
              <Button size="sm" onClick={() => nav("simulador")} className="hidden sm:inline-flex">Experimentar agora</Button>
            </>
          )}
          <button className={cx("grid size-10 place-items-center rounded-full lg:hidden", dark ? "hover:bg-white/10" : "hover:bg-ink/5")} aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className={cx("border-t px-5 pb-6 pt-3 lg:hidden", dark ? "border-white/8 bg-ink" : "border-ink/8 bg-white")}>
          {NAV.map(([id, l]) => (
            <button key={id} onClick={() => nav(id)} className="block w-full border-b border-current/10 py-3.5 text-left font-display text-xl font-medium tracking-tight">{l}</button>
          ))}
          <div className="mt-5 flex gap-2">
            {!user && <Button variant={dark ? "outline-light" : "outline"} className="flex-1" onClick={() => nav("entrar")}>Entrar</Button>}
            <Button className="flex-1" onClick={() => nav("simulador")}>Experimentar agora</Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const links = [["inicio", "Início"], ["simulador", "Simulador"], ["estilos", "Estilos"], ["cuidados", "Cuidados"], ["profissionais", "Profissionais"], ["sobre", "Sobre"], ["contato", "Contato"]];
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <Logo tone="light" size={26} />
          <p className="mt-5 max-w-xs font-display text-2xl leading-tight tracking-tight text-white/90">Seu cabelo.<br />Suas possibilidades.</p>
          <div className="mt-6 flex gap-2">
            {["IG", "TT", "YT", "IN"].map((s) => (
              <a key={s} href="#/contato" aria-label={s} className="grid size-10 place-items-center rounded-full border border-white/15 font-mono text-xs text-white/70 transition hover:border-lilac hover:text-lilac">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-lilac">Navegação</div>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px] text-white/70">
            {links.map(([id, l]) => (
              <li key={id}><button onClick={() => go(id)} className="hover:text-white">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-lilac">Novidades</div>
          <p className="mt-5 text-sm text-white/60">Veja antes. Escolha melhor. Transforme seu estilo.</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input aria-label="E-mail" placeholder="seu@email.com" className="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm outline-none placeholder:text-white/35 focus:border-lilac" />
            <Button size="md">Assinar</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-white/45 md:px-8">
          <span>© 2026 Hairstyle Tecnologia Capilar Ltda.</span>
          <div className="flex gap-6">
            <a href="#/contato" className="hover:text-white">Política de privacidade</a>
            <a href="#/contato" className="hover:text-white">Termos de uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
