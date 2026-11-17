// Motion helpers. CSS owns the look (styles.css, "Motion"); these only time things and toggle classes.
// Durations are CSS custom properties so the Tuner can change them live.

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
export const motionOff = () => reduce.matches;

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Reads a duration custom property ("200ms") from :root. Zero under reduced motion.
export function ms(name, fallback) {
  if (motionOff()) return 0;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

// FLIP: slide elements from their old position to their new one.
export function flip(els, before) {
  if (motionOff()) return;
  const dur = ms("--rec-slide", 320);
  els.forEach((el) => {
    const old = before.get(el.dataset.id);
    if (!old) return;
    const now = el.getBoundingClientRect();
    const dx = old.left - now.left;
    if (!dx) return;
    el.style.transition = "none";
    el.style.transform = `translateX(${dx}px)`;
    void el.offsetWidth;
    el.style.transition = `transform ${dur}ms var(--ease-out)`;
    el.style.transform = "";
    const clear = () => { el.style.transition = ""; el.removeEventListener("transitionend", clear); };
    el.addEventListener("transitionend", clear);
  });
}
