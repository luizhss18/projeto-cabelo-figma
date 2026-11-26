import { html, attr } from "../lib/dom.js"
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  ShieldCheck,
  Check,
} from "../lib/icons.js"
import { Head3D } from "../components/Head3D.js"
import { Button, Field, Logo } from "../components/ui.js"
import { go, appState, pageValue, pageSetter } from "../lib/store.js"
const H = {
  cut: "longo",
  length: 3,
  color: "#8a4dff",
  texture: "cacheado",
  style: "natural",
  face: "oval",
}
export default function Auth({ mode }) {
  const { login } = appState()
  const recoveryEmail = pageValue("recoveryEmail", "")
  const setRecoveryEmail = pageSetter("recoveryEmail")
  const sent = pageValue("sent", false)
  const setSent = pageSetter("sent")
  const mismatch = pageValue("mismatch", false)
  const setMismatch = pageSetter("mismatch")
  const passwordsDiffer = (form) => {
    const confirm = form.elements.namedItem("confirm")?.value
    return Boolean(
      confirm && confirm !== form.elements.namedItem("password")?.value,
    )
  }
  const checkPasswords = (e) => setMismatch(passwordsDiffer(e.target.form))
  const submit = (e) => {
    e.preventDefault()
    const form = e.target
    const email = form.elements.namedItem("email").value
    if (mode === "recuperar") {
      setRecoveryEmail(email)
      setSent(true)
      return
    }
    if (mode === "cadastro" && passwordsDiffer(form)) {
      setMismatch(true)
      form.elements.namedItem("confirm").focus()
      return
    }
    const name = form.elements.namedItem("name")?.value.trim().split(/\s+/)[0]
    login(name || "Marina", email)
    go("dashboard")
  }
  return html`<div class="grid min-h-[calc(100vh-68px)] lg:grid-cols-2">
      <div class="flex items-center justify-center px-5 py-14">
        <form${attr("onSubmit", submit)} class="rise w-full max-w-sm">
          ${Logo({ size: 22 })}
          ${mode === "recuperar" && html`<button type="button"${attr("onClick", () => go("entrar"))} class="mt-8 flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink">${ArrowLeft({ size: 15 })}Voltar</button>`}
          <h1 class="mt-8 font-display text-4xl font-semibold leading-none tracking-[-0.035em]">
            ${
              mode === "entrar"
                ? "Bem-vinda de volta."
                : mode === "cadastro"
                  ? "Crie sua conta."
                  : sent
                    ? "Solicitação simulada."
                    : "Recuperar senha."
            }
          </h1>
          <p class="mt-3 text-ink/60">
            ${
              mode === "entrar"
                ? "Entre para continuar de onde parou."
                : mode === "cadastro"
                  ? "Leva menos de um minuto. Seu cabelo agradece."
                  : sent
                    ? `Nenhum e-mail foi enviado para ${recoveryEmail}.`
                    : "Informe seu e-mail para testar o fluxo de recuperação de senha."
            }
          </p>

          ${
            !sent &&
            html`<div class="mt-8 space-y-4">
              ${mode === "cadastro" && Field({ label: "Nome", name: "name", icon: User({}), placeholder: "Como devemos te chamar?", required: true })}
              ${Field({ label: "E-mail", name: "email", type: "email", icon: Mail({}), placeholder: "voce@email.com", required: true })}
              ${mode !== "recuperar" && Field({ label: "Senha", name: "password", type: "password", icon: Lock({}), placeholder: "••••••••", onChange: mode === "cadastro" ? checkPasswords : undefined, required: true, minLength: 6, hint: mode === "cadastro" ? "Mínimo de 6 caracteres." : undefined })}
              ${mode === "cadastro" && Field({ label: "Confirmar senha", name: "confirm", type: "password", icon: Lock({}), placeholder: "••••••••", onChange: checkPasswords, required: true, "aria-invalid": mismatch, error: mismatch ? "As senhas não coincidem." : undefined })}
            </div>`
          }

          ${mode === "entrar" && html`<button type="button"${attr("onClick", () => go("recuperar"))} class="mt-3 text-sm font-medium text-violet hover:underline">Esqueci minha senha</button>`}

          ${
            sent
              ? Button({
                  type: "button",
                  size: "lg",
                  className: "mt-8 w-full",
                  onClick: () => go("entrar"),
                  children: html`Voltar para o login`,
                })
              : Button({
                  type: "submit",
                  size: "lg",
                  className: "mt-7 w-full",
                  children: html`${
                    mode === "entrar"
                      ? "Entrar"
                      : mode === "cadastro"
                        ? "Criar conta"
                        : "Enviar link"
                  }`,
                })
          }

          ${mode !== "recuperar" && html`<p class="mt-4 flex items-center gap-2 text-xs text-ink/50">${ShieldCheck({ size: 15, className: "text-violet" })}Modo demonstração. Não use uma senha real.</p>`}

          <p class="mt-8 text-sm text-ink/60">
            ${
              mode === "cadastro"
                ? html`Já tem conta? <button type="button"${attr("onClick", () => go("entrar"))} class="font-medium text-violet hover:underline">Entrar</button>`
                : html`Novo por aqui? <button type="button"${attr("onClick", () => go("cadastro"))} class="font-medium text-violet hover:underline">Criar uma conta</button>`
            }
          </p>
        </form>
      </div>

      <div class="relative hidden overflow-hidden bg-ink lg:block">
        <div class="absolute inset-0 grain-grid opacity-70"></div>
        <div class="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/35 blur-[120px]"></div>
        ${Head3D({ hair: H, yaw: -20, autoRotate: true, className: "absolute inset-x-0 top-8 bottom-40" })}
        <div class="absolute inset-x-12 bottom-12 text-white">
          <p class="font-display text-3xl font-semibold leading-tight tracking-tight">Teste antes de transformar.</p>
          <ul class="mt-5 space-y-2 text-sm text-white/65">
            ${["Salve seus visuais favoritos", "Compare cortes lado a lado", "Receba uma rotina de cuidados"].map((t) => html`<li${attr("data-key", t)} class="flex items-center gap-2">${Check({ size: 15, className: "text-lilac" })}${t}</li>`)}
          </ul>
        </div>
      </div>
    </div>`
}
