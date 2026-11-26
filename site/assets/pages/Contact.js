import { html, attr } from "../lib/dom.js"
import { pageValue, pageSetter } from "../lib/store.js"
import { Mail, MessageCircle, Phone, Clock, User, Check } from "../lib/icons.js"
import { Button, Card, Field, PageHead } from "../components/ui.js"
export default function Contact() {
  const sent = pageValue("sent", false)
  const setSent = pageSetter("sent")
  return html`<div>
      ${PageHead({ eyebrow: "Suporte Hairstyle", title: "Fale com a gente.", sub: "D\u00FAvidas, sugest\u00F5es ou parcerias. Respondemos em at\u00E9 1 dia \u00FAtil." })}
      <div class="mx-auto grid max-w-7xl gap-8 px-5 pb-24 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        ${Card({
          className: "p-8",
          children: html`
          ${
            sent
              ? html`<div class="grid min-h-80 place-items-center text-center">
              <div>
                <span class="mx-auto grid size-14 place-items-center rounded-full bg-violet text-white">${Check({})}</span>
                <h2 class="mt-5 font-display text-3xl font-semibold tracking-tight">Envio simulado.</h2>
                <p class="mt-2 text-ink/60">A mensagem não foi enviada. Este formulário é demonstrativo.</p>
                ${Button({ variant: "outline", className: "mt-6", onClick: () => setSent(false), children: html`Enviar outra` })}
              </div>
            </div>`
              : html`<form class="space-y-5"${attr("onSubmit", (e) => {
                  e.preventDefault()
                  setSent(true)
                })}>
              ${Field({ label: "Nome", icon: User({}), placeholder: "Seu nome", required: true })}
              ${Field({ label: "E-mail", type: "email", icon: Mail({}), placeholder: "voce@email.com", required: true })}
              ${Field({ label: "Mensagem", textarea: true, placeholder: "Como podemos ajudar?", required: true })}
              ${Button({ size: "lg", type: "submit", className: "w-full sm:w-auto", children: html`Enviar mensagem` })}
            </form>`
          }
        `,
        })}
        <div class="space-y-4">
          ${Card({
            className: "bg-ink! text-white",
            children: html`
            <div class="font-mono text-xs uppercase tracking-wider text-lilac">Suporte Hairstyle</div>
            <p class="mt-3 font-display text-2xl font-semibold tracking-tight">Estamos por aqui para ajudar.</p>
            <div class="mt-5 flex items-center gap-2 text-sm text-white/60">${Clock({ size: 15 })}Seg a sex, 9h às 18h</div>
          `,
          })}
          ${[
            [Mail, "E-mail", "suporte@hairstyle.app"],
            [MessageCircle, "Chat ao vivo", "Disponível no app"],
            [Phone, "WhatsApp comercial", "(11) 4002-8922"],
          ].map(([I, t, d]) => {
            const Ic = I
            return html`<div${attr("data-key", t)} class="flex items-center gap-4 rounded-3xl border border-ink/8 p-5">
                <span class="grid size-12 place-items-center rounded-2xl bg-lilac-soft text-violet">${Ic({ size: 20 })}</span>
                <div><div class="font-medium">${t}</div><div class="text-sm text-ink/55">${d}</div></div>
              </div>`
          })}
        </div>
      </div>
    </div>`
}
