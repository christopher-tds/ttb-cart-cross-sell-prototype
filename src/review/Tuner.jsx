import { useEffect, useState } from "react";
import { TUNE_KEY, applyTune } from "./config.js";

// Motion tuner for the new rec refresh (and the sheet slide, which starts at the PDP's 250ms).
// Defaults are the CSS values; Reset returns to them. Copy CSS hands the approved values over.
const dur = (v, label, value, stops) => ({
  id: v, label, value, stops,
  show: (x) => `${x}ms`,
  vars: (x) => ({ [v]: x + "ms" }),
});
const STEPS = [0, 100, 150, 200, 250, 300, 350, 400, 500, 600];

const GROUPS = [
  { name: "Rec refresh after an add", rows: [
    dur("--rec-exit", "Card out", 200, STEPS), dur("--rec-slide", "Row slides", 300, STEPS), dur("--rec-enter", "Next card in", 300, STEPS),
  ] },
  { name: "Size sheet", rows: [dur("--sheet-slide", "Slide", 250, STEPS)] },
];
const ROWS = GROUPS.flatMap((g) => g.rows);
const DEFAULTS = Object.fromEntries(ROWS.map((r) => [r.id, r.value]));
const STATE_KEY = TUNE_KEY + "-state";
const OPEN_KEY = TUNE_KEY + "-open";

function load() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STATE_KEY) || "null"); } catch (e) { /* storage blocked */ }
  const v = { ...DEFAULTS, ...(saved || {}) };
  for (const r of ROWS) if (!r.stops.includes(v[r.id])) v[r.id] = r.value;
  return v;
}

export default function Tuner() {
  const [values, setValues] = useState(load);
  const [open, setOpen] = useState(() => { try { return localStorage.getItem(OPEN_KEY) === "1"; } catch (e) { return false; } });
  const [copied, setCopied] = useState(false);

  // Write only the changed controls as CSS variables, so Reset leaves the CSS defaults in charge.
  useEffect(() => {
    const vars = {};
    for (const r of ROWS) if (values[r.id] !== r.value) Object.assign(vars, r.vars(values[r.id]));
    try {
      // Only values that differ from the defaults are kept, so a new default reaches everyone.
      localStorage.setItem(STATE_KEY, JSON.stringify(Object.fromEntries(Object.entries(values).filter(([k, x]) => x !== DEFAULTS[k]))));
      localStorage.setItem(TUNE_KEY, JSON.stringify(vars));
    } catch (e) { /* storage blocked */ }
    applyTune();
    // Storage events don't fire in the page that wrote the value, so nudge the device frame.
    document.querySelector(".vp-stage iframe")?.contentWindow?.dispatchEvent(new StorageEvent("storage", { key: TUNE_KEY }));
  }, [values]);
  useEffect(() => { try { localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch (e) { /* storage blocked */ } }, [open]);

  const copy = () => {
    const lines = GROUPS.flatMap((g) => g.rows.flatMap((r) =>
      Object.entries(r.vars(values[r.id])).map(([k, x]) => `${k}: ${x}; /* ${g.name}, ${r.label} */`)));
    navigator.clipboard?.writeText(lines.join("\n")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); });
  };

  return (
    <section className="tuner" aria-label="Motion tuner">
      <button type="button" className="tuner__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Motion</button>
      <div className="tuner__body" hidden={!open}>
        {GROUPS.map((g) => (
          <div key={g.name}>
            <p className="tuner__group">{g.name}</p>
            {g.rows.map((r) => (
              <label key={r.id} className="tuner__row">
                <span>{r.label}</span>
                <input type="range" min={0} max={r.stops.length - 1} step={1}
                  value={Math.max(0, r.stops.indexOf(values[r.id]))}
                  onChange={(e) => setValues((p) => ({ ...p, [r.id]: r.stops[+e.target.value] }))} />
                <output>{r.show(values[r.id])}</output>
              </label>
            ))}
          </div>
        ))}
        <div className="tuner__actions">
          <button type="button" onClick={() => setValues({ ...DEFAULTS })}>Reset</button>
          <button type="button" onClick={copy}>{copied ? "Copied" : "Copy CSS"}</button>
        </div>
      </div>
    </section>
  );
}
