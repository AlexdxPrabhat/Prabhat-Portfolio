import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";
import { useGSAP, revealUp, revealText } from "../../lib/motion";
import { profile, socials } from "../../constants";
import MagneticButton from "../ui/MagneticButton";

const fields = [
  { name: "user_name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "user_email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text" },
];

const inputClass =
  "peer w-full border-b border-line bg-transparent pb-3 pt-6 text-lg text-paper outline-none transition-colors placeholder-transparent focus:border-accent";
const labelClass =
  "pointer-events-none absolute left-0 top-6 text-lg text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

const Contact = () => {
  const root = useRef(null);
  const form = useRef(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      revealUp(".ct-eyebrow", { trigger: root.current });
      revealText(root.current.querySelector(".ct-title"), { trigger: root.current, stagger: 0.1 });
      revealUp(".ct-reveal", { trigger: ".ct-body", stagger: 0.08 });
    },
    { scope: root }
  );

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);
    emailjs
      .sendForm("service_hvs2wow", "template_d3irp0d", form.current, "A99nGvsBJ7kR5FVzQ")
      .then(
        () => {
          form.current.reset();
          toast.success("Message sent. I'll get back to you soon.");
        },
        (error) => {
          console.error("Error sending message:", error);
          toast.error("Couldn't send that. Please try again or email me directly.");
        }
      )
      .finally(() => setSending(false));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" ref={root} className="section overflow-hidden">
      <div className="container-x relative">
        <p className="ct-eyebrow eyebrow invisible">
          <span className="tabular-nums">(07)</span> Contact
        </p>
        <h2 className="ct-title display invisible mt-6 text-[clamp(3.25rem,11vw,11rem)]">
          Let&apos;s build something <span className="font-serif font-normal italic text-accent">that works.</span>
        </h2>

        <div className="ct-body mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="ct-reveal invisible max-w-md text-lg leading-relaxed text-paper/70">
              Have a role, a project or an idea in mind? Drop a line and I&apos;ll get back to you.
            </p>
            <div className="ct-reveal invisible mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton
                href={`mailto:${profile.email}`}
                data-cursor="Write"
                className="h-14 rounded-full bg-accent px-7 font-semibold text-ink"
              >
                {profile.email}
              </MagneticButton>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="grid h-14 w-14 place-items-center rounded-full border border-line transition-colors hover:border-paper/40"
              >
                {copied ? <FiCheck aria-hidden="true" className="text-accent" /> : <FiCopy aria-hidden="true" />}
              </button>
            </div>
            <ul className="ct-reveal invisible mt-12 border-t border-line">
              {socials.map((s) => (
                <li key={s.label} className="border-b border-line">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 text-lg transition-[padding] duration-500 ease-expo hover:px-2"
                  >
                    {s.label}
                    <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form ref={form} onSubmit={sendEmail} className="ct-reveal invisible flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
            {fields.map((f) => (
              <div key={f.name} className="relative">
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  required
                  placeholder={f.label}
                  className={inputClass}
                />
                <label htmlFor={f.name} className={labelClass}>
                  {f.label}
                </label>
              </div>
            ))}
            <div className="relative">
              <textarea id="message" name="message" rows="4" required placeholder="Message" className={`${inputClass} resize-none`} />
              <label htmlFor="message" className={labelClass}>
                Tell me about your project
              </label>
            </div>
            <MagneticButton
              type="submit"
              disabled={sending}
              data-cursor="Send"
              className="mt-2 h-16 w-full rounded-full bg-paper text-base font-semibold text-ink disabled:opacity-60 sm:w-auto sm:self-start sm:px-10"
            >
              {sending ? "Sending…" : "Send message"} <FiArrowUpRight aria-hidden="true" />
            </MagneticButton>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
