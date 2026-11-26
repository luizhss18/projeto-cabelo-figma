import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Check, X, RotateCcw, RotateCw, ZoomIn, ZoomOut, Pause, Play } from "lucide-react";
import { HeadThumb } from "./Head3D";
import type { Hair } from "../lib/head";

export const cx = (...a: (string | number | false | undefined | null)[]) => a.filter(Boolean).join(" ");

/* ---------- Logo ---------- */
export function Logo({ tone = "dark", size = 22 }: { tone?: "dark" | "light"; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5" style={{ fontSize: size }}>
      <svg width="1.35em" height="1.35em" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="hs-g" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6C3BFF" />
            <stop offset="1" stopColor="#B78CFF" />
          </linearGradient>
        </defs>
        <path d="M9.5 3c-3.6 8.5 3.4 11 0 26" stroke="url(#hs-g)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M22.5 3c-3.6 8.5 3.4 11 0 26" stroke="url(#hs-g)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M9.5 16.5c4.4-3.4 8.6 3.4 13 0" stroke={tone === "dark" ? "#111" : "#fff"} strokeWidth="3.4" strokeLinecap="round" />
      </svg>
      <span className={cx("font-display font-semibold tracking-[-0.03em] leading-none", tone === "dark" ? "text-ink" : "text-white")}>
        Hair<span className="font-light text-violet" style={tone === "light" ? { color: "#B78CFF" } : {}}>style</span>
      </span>
    </span>
  );
}

/* ---------- Button ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "dark" | "outline" | "ghost" | "light" | "outline-light"; size?: "sm" | "md" | "lg"; icon?: ReactNode; iconRight?: ReactNode };
export function Button({ variant = "primary", size = "md", icon, iconRight, className, children, ...p }: BtnProps) {
  const v = {
    primary: "bg-violet text-white hover:bg-violet-deep shadow-[0_8px_24px_-10px_rgba(108,59,255,.8)]",
    dark: "bg-ink text-white hover:bg-graphite",
    outline: "border border-ink/15 text-ink hover:border-ink/40 bg-white",
    ghost: "text-ink hover:bg-ink/5",
    light: "bg-white text-ink hover:bg-lilac-soft",
    "outline-light": "border border-white/25 text-white hover:bg-white/10",
  }[variant];
  const s = { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-[15px]", lg: "h-14 px-7 text-base" }[size];
  return (
    <button {...p} className={cx("inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all active:scale-[.98] disabled:opacity-50", v, s, className)}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

/* ---------- Inputs ---------- */
export function Field({ label, hint, icon, error, textarea, ...p }: { label: string; hint?: string; icon?: ReactNode; error?: string; textarea?: boolean } & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const base = cx("w-full rounded-xl border bg-white px-4 text-[15px] outline-none transition placeholder:text-ink/35 focus:border-violet focus:ring-4 focus:ring-violet/10", error ? "border-red-400" : "border-ink/12", !!icon && "pl-11");
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <span className="relative block">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 [&>svg]:size-[18px]">{icon}</span>}
        {textarea ? <textarea {...(p as TextareaHTMLAttributes<HTMLTextAreaElement>)} className={cx(base, "min-h-32 py-3")} /> : <input {...(p as InputHTMLAttributes<HTMLInputElement>)} className={cx(base, "h-12")} />}
      </span>
      {(hint || error) && <span className={cx("mt-1.5 block text-xs", error ? "text-red-500" : "text-ink/50")}>{error || hint}</span>}
    </label>
  );
}

/* ---------- Chips, badges, tabs ---------- */
export function Chip({ selected, children, onClick, dark }: { selected?: boolean; children: ReactNode; onClick?: () => void; dark?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cx(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm transition",
        selected ? "border-violet bg-violet text-white" : dark ? "border-white/15 text-white/75 hover:border-white/40" : "border-ink/12 bg-white text-ink/75 hover:border-ink/35",
      )}
    >
      {selected && <Check size={14} />}
      {children}
    </button>
  );
}
export function Badge({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "dark" | "soft" | "light" }) {
  const t = { violet: "bg-violet/10 text-violet", dark: "bg-ink text-white", soft: "bg-lilac-soft text-violet-deep", light: "bg-white/10 text-white/80 border border-white/15" }[tone];
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider", t)}>{children}</span>;
}
export function Tabs<T extends string>({ items, value, onChange, variant = "underline", className }: { items: { id: T; label: string; icon?: ReactNode }[]; value: T; onChange: (v: T) => void; variant?: "underline" | "pill"; className?: string }) {
  return (
    <div role="tablist" className={cx("flex gap-1 overflow-x-auto", variant === "underline" ? "border-b border-ink/10" : "rounded-full bg-ink/5 p-1", className)}>
      {items.map((i) => {
        const on = i.id === value;
        return (
          <button
            key={i.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(i.id)}
            className={cx(
              "flex shrink-0 items-center gap-2 text-sm font-medium transition",
              variant === "underline" ? cx("-mb-px border-b-2 px-4 py-3", on ? "border-violet text-ink" : "border-transparent text-ink/50 hover:text-ink") : cx("rounded-full px-4 py-2", on ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"),
            )}
          >
            {i.icon}
            {i.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Cards ---------- */
export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={cx("rounded-3xl border p-6", dark ? "border-white/10 bg-graphite text-white" : "border-ink/8 bg-white", className)}>{children}</div>;
}
export function CutCard({ hair, title, desc, selected, onClick, yaw }: { hair: Hair; title: string; desc?: string; selected?: boolean; onClick?: () => void; yaw?: number }) {
  return (
    <button onClick={onClick} aria-pressed={selected} className={cx("group relative overflow-hidden rounded-2xl border text-left transition", selected ? "border-violet ring-4 ring-violet/15" : "border-ink/10 hover:border-ink/30")}>
      <div className="aspect-[5/6] bg-gradient-to-b from-lilac-soft/70 to-mist">
        <HeadThumb hair={hair} yaw={yaw} className="h-full w-full object-contain transition group-hover:scale-105" />
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div>
          <div className="text-sm font-medium">{title}</div>
          {desc && <div className="text-xs text-ink/50">{desc}</div>}
        </div>
        {selected && <span className="grid size-5 place-items-center rounded-full bg-violet text-white"><Check size={12} /></span>}
      </div>
    </button>
  );
}
export function ProductArt({ shape, hue, className }: { shape: string; hue: string; className?: string }) {
  const light = hue === "#d9b36c" || hue === "#b78cff";
  const label = light ? "#111" : "#fff";
  return (
    <div className={cx("grid place-items-center bg-gradient-to-b from-mist to-lilac-soft/60", className)}>
      <svg viewBox="0 0 120 150" className="h-4/5 drop-shadow-[0_18px_18px_rgba(17,17,17,.15)]">
        {shape === "bottle" && (<><rect x="44" y="6" width="32" height="18" rx="5" fill="#111" /><rect x="50" y="22" width="20" height="10" fill={hue} opacity=".8" /><rect x="30" y="30" width="60" height="112" rx="18" fill={hue} /><rect x="38" y="62" width="44" height="48" rx="6" fill={label} opacity=".92" /><rect x="44" y="72" width="32" height="4" rx="2" fill={hue} /><rect x="44" y="82" width="22" height="3" rx="1.5" fill={hue} opacity=".5" /></>)}
        {shape === "jar" && (<><rect x="18" y="50" width="84" height="22" rx="8" fill="#111" /><rect x="22" y="70" width="76" height="72" rx="16" fill={hue} /><rect x="34" y="88" width="52" height="36" rx="6" fill={label} opacity=".92" /><rect x="42" y="98" width="36" height="4" rx="2" fill={hue} /></>)}
        {shape === "tube" && (<><path d="M38 12h44l6 118H32z" fill={hue} /><rect x="32" y="128" width="56" height="14" rx="3" fill="#b78cff" /><rect x="44" y="52" width="32" height="42" rx="5" fill={label} opacity=".9" /><rect x="49" y="62" width="22" height="4" rx="2" fill={hue} /></>)}
        {shape === "dropper" && (<><ellipse cx="60" cy="14" rx="14" ry="12" fill="#111" /><rect x="50" y="22" width="20" height="18" fill="#3b3a44" /><rect x="32" y="38" width="56" height="104" rx="14" fill={hue} opacity=".95" /><rect x="40" y="68" width="40" height="44" rx="5" fill="#111" /><rect x="46" y="78" width="28" height="4" rx="2" fill="#d9b36c" /></>)}
        {shape === "spray" && (<><rect x="42" y="4" width="36" height="14" rx="4" fill="#b78cff" /><rect x="52" y="16" width="16" height="16" fill="#111" /><rect x="34" y="30" width="52" height="112" rx="14" fill={hue} /><rect x="41" y="62" width="38" height="46" rx="5" fill={label} opacity=".92" /><rect x="47" y="72" width="26" height="4" rx="2" fill={hue} /></>)}
      </svg>
    </div>
  );
}
export function ProductCard({ p }: { p: { name: string; cat: string; desc: string; use: string; hue: string; shape: string } }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-ink/8 bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(17,17,17,.35)]">
      <ProductArt shape={p.shape} hue={p.hue} className="aspect-[4/3]" />
      <div className="p-5">
        <Badge tone="soft">{p.cat}</Badge>
        <h4 className="mt-3 font-display text-lg font-semibold tracking-tight">{p.name}</h4>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">{p.desc}</p>
        <div className="mt-4 flex items-center gap-2 border-t border-ink/8 pt-3 text-xs text-ink/70">
          <span className="size-1.5 rounded-full bg-violet" />
          {p.use}
        </div>
      </div>
    </article>
  );
}

/* ---------- Avatar / Modal ---------- */
export function Avatar({ name, size = 40, dark }: { name: string; size?: number; dark?: boolean }) {
  return (
    <span className={cx("grid shrink-0 place-items-center rounded-full font-display font-semibold", dark ? "bg-white/10 text-white" : "bg-gradient-to-br from-violet to-lilac text-white")} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="rise relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <button onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full hover:bg-ink/5"><X size={18} /></button>
        <h3 className="pr-8 font-display text-2xl font-semibold tracking-tight">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Model controls (3D) ---------- */
export function ModelControls({ yaw, setYaw, zoom, setZoom, auto, setAuto, dark = true }: { yaw: number; setYaw: (n: number) => void; zoom: number; setZoom: (n: number) => void; auto: boolean; setAuto: (b: boolean) => void; dark?: boolean }) {
  const views = [["Frente", -0], ["Lateral", 90], ["Costas", 180]] as const;
  const norm = ((yaw % 360) + 360) % 360;
  const active = (v: number) => Math.abs(((norm - v + 540) % 360) - 180) < 20;
  const btn = "grid size-9 place-items-center rounded-full transition text-white/80 hover:bg-white/15 hover:text-white";
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-1 rounded-full border p-1.5 backdrop-blur-xl", dark ? "border-white/12 bg-ink/60" : "border-ink/10 bg-white/80")}>
      <button className={btn} aria-label="Girar à esquerda" onClick={() => setYaw(yaw - 45)}><RotateCcw size={17} /></button>
      <div className="flex rounded-full bg-white/8 p-0.5">
        {views.map(([l, v]) => (
          <button key={l} onClick={() => setYaw(Math.round(yaw / 360) * 360 + v)} className={cx("h-8 rounded-full px-3 text-xs font-medium transition", active(v) ? "bg-white text-ink" : "text-white/70 hover:text-white")}>{l}</button>
        ))}
      </div>
      <button className={btn} aria-label="Girar à direita" onClick={() => setYaw(yaw + 45)}><RotateCw size={17} /></button>
      <span className="mx-1 h-5 w-px bg-white/15" />
      <button className={btn} aria-label="Diminuir zoom" onClick={() => setZoom(Math.max(0.7, +(zoom - 0.15).toFixed(2)))}><ZoomOut size={17} /></button>
      <span className="w-11 text-center font-mono text-xs text-white/70">{Math.round(zoom * 100)}%</span>
      <button className={btn} aria-label="Aumentar zoom" onClick={() => setZoom(Math.min(1.8, +(zoom + 0.15).toFixed(2)))}><ZoomIn size={17} /></button>
      <span className="mx-1 h-5 w-px bg-white/15" />
      <button className={cx(btn, auto && "bg-violet text-white")} aria-label="Rotação automática" aria-pressed={auto} onClick={() => setAuto(!auto)}>{auto ? <Pause size={16} /> : <Play size={16} />}</button>
    </div>
  );
}

/* ---------- Section primitives ---------- */
export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <div className={cx("font-mono text-xs uppercase tracking-[0.18em]", light ? "text-lilac" : "text-violet")}>{children}</div>;
}
export function PageHead({ eyebrow, title, sub, children }: { eyebrow: string; title: ReactNode; sub?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pt-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">{title}</h1>
          {sub && <p className="mt-5 max-w-xl text-lg text-ink/60">{sub}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
