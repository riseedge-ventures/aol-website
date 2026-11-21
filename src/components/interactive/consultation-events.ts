// Tiny pub-sub so any "Book a Free Consultation" button (server-rendered
// sections included) can open the single modal without lifting state through
// the whole tree.
export const OPEN_CONSULTATION_EVENT = "aol:open-consultation";

export function openConsultation(consultationType?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_CONSULTATION_EVENT, { detail: { consultationType } }));
}
