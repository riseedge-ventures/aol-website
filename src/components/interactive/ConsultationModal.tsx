"use client";

import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL } from "@/config/site";
import { NETLIFY_FORM_NAME, NETLIFY_HONEYPOT_FIELD } from "@/content/enquiry-form";
import { SERVICES } from "@/content/services";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Field } from "../ui/Field";
import { Icon } from "../ui/Icon";
import { OPEN_CONSULTATION_EVENT } from "./consultation-events";

const CM_SERVICES = [
  ...SERVICES.map((s) => s.title),
  "You do not need to know which accounting service applies to your circumstances before contacting us.",
];
const MODAL_HASH = "#consultation";
const BODY_LOCK_CLASS = "aol-modal-open";

const NETLIFY_FORM_ATTRS = {
  "data-netlify": "true",
  "netlify-honeypot": NETLIFY_HONEYPOT_FIELD,
} as const;

type HistoryState = { aolConsultation?: boolean } | null;

function unlockBody() {
  document.body.classList.remove(BODY_LOCK_CLASS);
  document.body.style.removeProperty("overflow");
}

function lockBody() {
  document.body.classList.add(BODY_LOCK_CLASS);
}

function clearModalHash() {
  if (window.location.hash !== MODAL_HASH) return;
  const next = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", next);
}

export function ConsultationModal() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [preferredType, setPreferredType] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<Element | null>(null);
  const openRef = useRef(false);
  const ignoreNextPopRef = useRef(false);
  const titleId = useId();
  const errorId = useId();

  const resetVisualState = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    setSending(false);
    unlockBody();
  }, []);

  /** Close without touching history (route change, bfcache restore, in-modal link). */
  const dismiss = useCallback(() => {
    resetVisualState();
    clearModalHash();
  }, [resetVisualState]);

  /** Close from X / Escape / scrim — sync with the history entry we pushed on open. */
  const onClose = useCallback(() => {
    if (!openRef.current) {
      unlockBody();
      return;
    }
    resetVisualState();
    const state = window.history.state as HistoryState;
    if (state?.aolConsultation) {
      ignoreNextPopRef.current = true;
      window.history.back();
    } else {
      clearModalHash();
    }
    if (triggerRef.current instanceof HTMLElement) {
      const el = triggerRef.current;
      requestAnimationFrame(() => el.focus());
    }
  }, [resetVisualState]);

  const onOpen = useCallback(() => {
    if (openRef.current) return;
    triggerRef.current = document.activeElement;
    setError(null);
    setFieldErrors({});
    setSending(false);
    openRef.current = true;
    setOpen(true);
    lockBody();
    if (window.location.hash !== MODAL_HASH) {
      window.history.pushState({ aolConsultation: true }, "", MODAL_HASH);
    }
  }, []);

  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const type = (event as CustomEvent<{ consultationType?: string }>).detail?.consultationType;
      setPreferredType(type ?? "");
      onOpen();
    };
    window.addEventListener(OPEN_CONSULTATION_EVENT, handleOpenEvent);
    return () => window.removeEventListener(OPEN_CONSULTATION_EVENT, handleOpenEvent);
  }, [onOpen]);

  useEffect(() => {
    const onPopState = () => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }
      if (openRef.current) {
        resetVisualState();
        clearModalHash();
      }
    };
    const onPageShow = () => {
      // Back-forward cache can restore a locked body + stuck overlay.
      ignoreNextPopRef.current = false;
      resetVisualState();
      if (window.location.hash === MODAL_HASH) clearModalHash();
    };
    const onPageHide = () => unlockBody();

    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      unlockBody();
    };
  }, [resetVisualState]);

  // If the user navigates to another page while the modal is open, drop it cleanly.
  const pathRef = useRef(pathname);
  useEffect(() => {
    if (pathRef.current !== pathname) {
      pathRef.current = pathname;
      if (openRef.current) dismiss();
    }
  }, [pathname, dismiss]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const focusables = cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([tabindex="-1"]), select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    lockBody();
    const focusTimer = window.setTimeout(() => {
      cardRef.current
        ?.querySelector<HTMLElement>('input:not([tabindex="-1"]), select, textarea, button.modal__close')
        ?.focus();
    }, 0);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name) next.name = "Full name is required.";
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!String(data.get("phone") ?? "").trim()) next.phone = "Contact number is required.";
    if (!String(data.get("service") ?? "").trim()) next.service = "Area of assistance is required.";
    if (!String(data.get("message") ?? "").trim()) next.message = "Tell us about your enquiry.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    const form = e.currentTarget;
    if (!validate(form)) {
      setError("Please correct the highlighted fields and try again.");
      return;
    }

    setSending(true);
    const data = new FormData(form);
    data.set("form-name", NETLIFY_FORM_NAME);
    data.set("marketing_consent", "no");

    const body = new URLSearchParams();
    data.forEach((value, key) => {
      if (typeof value === "string") body.append(key, value);
    });

    try {
      let officeCheckoutUrl = "";
      let paymentSetupUnavailable = false;
      if (preferredType === "office") {
        try {
          const paymentResponse = await fetch("/.netlify/functions/paystack-office-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              phone: String(data.get("phone") ?? ""),
              business: String(data.get("business") ?? ""),
              service: String(data.get("service") ?? ""),
            }),
          });
          const payment = await paymentResponse.json().catch(() => null);
          if (!paymentResponse.ok || !payment?.authorizationUrl) paymentSetupUnavailable = true;
          else officeCheckoutUrl = String(payment.authorizationUrl);
        } catch {
          paymentSetupUnavailable = true;
        }
      }

      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Netlify Forms POST failed: ${res.status}`);
      dismiss();
      if (officeCheckoutUrl) {
        window.location.assign(officeCheckoutUrl);
        return;
      }
      window.location.assign(paymentSetupUnavailable ? "/thank-you/?payment=pending" : "/thank-you/");
    } catch {
      setError(
        "Something went wrong sending your request. Please try again, call us, or message us on WhatsApp."
      );
      setSending(false);
    }
  };

  return (
    <div className={`modal ${open ? "open" : ""}`} aria-hidden={!open} inert={!open || undefined}>
      <div className="modal__scrim" onClick={onClose} />
      <div
        ref={cardRef}
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={20} />
        </button>

        {/* Keep form mounted so open/close stays instant and never shows an empty overlay. */}
        <div className="modal__layout">
          <aside className="modal__rail">
            <div className="modal__head">
              <Eyebrow>ENQUIRY FORM</Eyebrow>
              <h2 id={titleId} className="modal__title">Tell Us What Your Business Needs.</h2>
              <p>Provide your contact details and a brief description of the assistance you are seeking. This information will help our team understand the nature of your enquiry and determine the appropriate next steps.</p>
            </div>
            <div className="modal__contact" aria-label="AOL Accountants contact options">
              <a href={PHONE_HREF}>
                <Icon name="phone" size={18} />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Icon name="message-circle" size={18} />
                <span>WhatsApp</span>
              </a>
            </div>
          </aside>

          <div className="modal__body">
            <form
              className="modal__form"
              name={NETLIFY_FORM_NAME}
              method="POST"
              {...NETLIFY_FORM_ATTRS}
              onSubmit={submit}
              noValidate
            >
              <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
              <p className="netlify-honeypot" aria-hidden="true">
                <label>
                  Do not fill this out if you are human
                  <input type="text" name={NETLIFY_HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <section className="form-section" aria-labelledby="details-heading">
                <div className="form-section__heading">
                  <span className="form-section__icon" aria-hidden="true"><Icon name="user" size={20} /></span>
                  <h3 id="details-heading">Your Details</h3>
                </div>
                <div className="form-section__grid form-section__grid--two">
                  <Field label="Full Name" htmlFor="cm-name" required error={fieldErrors.name}>
                    <div className="fld">
                      <Icon name="user" size={18} />
                      <input id="cm-name" name="name" type="text" autoComplete="name" required aria-invalid={fieldErrors.name ? true : undefined} />
                    </div>
                  </Field>
                  <Field label="Email Address" htmlFor="cm-email" required error={fieldErrors.email}>
                    <div className="fld">
                      <Icon name="mail" size={18} />
                      <input id="cm-email" name="email" type="email" autoComplete="email" required aria-invalid={fieldErrors.email ? true : undefined} />
                    </div>
                  </Field>
                  <Field label="Contact Number" htmlFor="cm-phone" required error={fieldErrors.phone}>
                    <div className="fld">
                      <Icon name="phone" size={18} />
                      <input id="cm-phone" name="phone" required aria-invalid={fieldErrors.phone ? true : undefined} type="tel" autoComplete="tel" />
                    </div>
                  </Field>
                  <Field label="Business / Organisation Name (if applicable)" htmlFor="cm-biz">
                    <div className="fld">
                      <Icon name="building-2" size={18} />
                      <input id="cm-biz" name="business" type="text" autoComplete="organization" />
                    </div>
                  </Field>
                </div>
              </section>

              <section className="form-section" aria-labelledby="enquiry-heading">
                <div className="form-section__heading">
                  <span className="form-section__icon" aria-hidden="true"><Icon name="messages-square" size={20} /></span>
                  <h3 id="enquiry-heading">Your Enquiry</h3>
                </div>
                <div className="form-section__grid">
                  <Field label="Area of Assistance" htmlFor="cm-svc" required error={fieldErrors.service}>
                    <div className="fld fld--select">
                      <select id="cm-svc" name="service" required aria-invalid={fieldErrors.service ? true : undefined} defaultValue="">
                        <option value="">Area of Assistance</option>
                        {CM_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Icon className="chev" name="chevron-down" size={18} />
                    </div>
                  </Field>
                  <Field label="Preferred Consultation Type" htmlFor="cm-type-online">
                    <div className="consultation-choices" role="radiogroup" aria-label="Preferred Consultation Type">
                      <label className={`consultation-choice ${preferredType === "online" ? "is-selected" : ""}`}>
                        <input id="cm-type-online" type="radio" name="consultation_type" value="online" checked={preferredType === "online"} onChange={event => setPreferredType(event.target.value)} />
                        <span className="consultation-choice__icon" aria-hidden="true"><Icon name="messages-square" size={21} /></span>
                        <span className="consultation-choice__copy"><strong>Free Online Consultation</strong><span>Consultation Fee: Free</span></span>
                        <span className="consultation-choice__indicator" aria-hidden="true" />
                      </label>
                      <label className={`consultation-choice ${preferredType === "office" ? "is-selected" : ""}`}>
                        <input id="cm-type-office" type="radio" name="consultation_type" value="office" checked={preferredType === "office"} onChange={event => setPreferredType(event.target.value)} />
                        <span className="consultation-choice__icon" aria-hidden="true"><Icon name="building-2" size={21} /></span>
                        <span className="consultation-choice__copy"><strong>Office Consultation</strong><span>Consultation Fee: R300</span></span>
                        <span className="consultation-choice__indicator" aria-hidden="true" />
                      </label>
                    </div>
                    <p className="consultation-payment-note">
                      Office consultations require full payment before confirmation. The R300 fee is non-refundable. One rescheduling request is permitted when at least 24 hours&apos; notice is provided.
                    </p>
                  </Field>
                  <Field label="Tell Us About Your Enquiry" htmlFor="cm-msg" required error={fieldErrors.message}>
                    <textarea className="fld-textarea" id="cm-msg" name="message" required aria-invalid={fieldErrors.message ? true : undefined} rows={5}></textarea>
                  </Field>
                </div>
              </section>

              <input type="hidden" name="marketing_consent" value="no" />
              {error ? <div id={errorId} role="alert" aria-live="assertive"><p className="modal__form-error">{error}</p></div> : null}

              <div className="modal__submit">
                <Button type="submit" block size="lg" iconRight="arrow-right" disabled={sending} aria-busy={sending}>
                  {sending ? "Sending…" : "Submit Enquiry"}
                </Button>
                <p>Fields marked with an asterisk () are required.*</p>
              </div>

              <section className="modal__notice" aria-labelledby="before-submit-heading">
                <div className="modal__notice-heading">
                  <Icon name="shield-check" size={22} />
                  <h3 id="before-submit-heading">BEFORE YOU SUBMIT</h3>
                </div>
                <p>Please provide a brief explanation of your enquiry so that we can understand the nature of the assistance you require.</p>
                <p>For your security, do not include passwords, banking credentials, identity document numbers or other highly sensitive information in the enquiry form. Where supporting documentation is required, appropriate arrangements can be discussed separately.</p>
                <p><strong>Submitting an enquiry does not constitute acceptance of a professional engagement. Any proposed services, applicable fees and engagement arrangements will be communicated separately.</strong></p>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
