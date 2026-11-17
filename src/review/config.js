// Review tools (arm, states, viewport, motion tuner). Not part of the design.
// Set to false to hide them. ?clean hides them for screenshots.
export const REVIEW_TOOLS = true;

const params = new URLSearchParams(location.search);
export const inFrame = window.self !== window.top; // inside the Tablet / Mobile frame
export const clean = params.has("clean");
export const showReviewBar = REVIEW_TOOLS && !inFrame && !clean;

// Motion tuner: the rec refresh is new motion, so its timings are tunable. Values are CSS custom properties
// kept in localStorage; they apply here and, through storage events, in the Tablet / Mobile frames.
export const TUNE_KEY = "ttb-cart-tuner";
const TUNE_VARS = ["--rec-exit", "--rec-slide", "--rec-enter", "--sheet-slide"];
export function applyTune() {
  if (!REVIEW_TOOLS) return;
  let t = null;
  try { t = JSON.parse(localStorage.getItem(TUNE_KEY) || "null"); } catch (e) { /* storage blocked */ }
  const root = document.documentElement;
  for (const k of TUNE_VARS) {
    if (t?.[k] !== undefined) root.style.setProperty(k, t[k]); else root.style.removeProperty(k);
  }
}
window.addEventListener("storage", (e) => { if (e.key === TUNE_KEY) applyTune(); });
applyTune();
