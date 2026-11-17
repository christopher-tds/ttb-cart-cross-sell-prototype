import { useState } from "react";
import ViewportSwitcher from "./ViewportSwitcher.jsx";
import Tuner from "./Tuner.jsx";
import { FLAGS } from "../settings.js";

// Review tools, not design: test arm, forced edge-case states, viewport, motion tuner, reset.
// Hidden inside the device frames and on ?clean.
export default function ReviewBar({ settings, onChange, onReset }) {
  const [statesOpen, setStatesOpen] = useState(false);
  const { arm, flags } = settings;
  const toggle = (f) => {
    const next = new Set(flags);
    next.has(f) ? next.delete(f) : next.add(f);
    onChange({ flags: next });
  };
  return (
    <div className="review-bar">
      <div className="vp-panel" role="group" aria-label="Test arm">
        <button type="button" aria-pressed={arm === "control"} onClick={() => onChange({ arm: "control" })} title="v3 as live today">Control</button>
        <button type="button" aria-pressed={arm === "variant"} onClick={() => onChange({ arm: "variant" })} title="v4 with the size sheet">Variant</button>
      </div>
      <div className="vp-panel" role="group" aria-label="Cards per arrow click">
        <button type="button" aria-pressed={settings.step === 1} onClick={() => onChange({ step: 1 })} title="Variant arrows move one card">Step 1</button>
        <button type="button" aria-pressed={settings.step === 3} onClick={() => onChange({ step: 3 })} title="Variant arrows move three cards">Step 3</button>
      </div>
      <section className="tuner">
        <button type="button" className="tuner__toggle" aria-expanded={statesOpen} onClick={() => setStatesOpen((o) => !o)}>
          States{flags.size ? ` · ${flags.size}` : ""}
        </button>
        <div className="tuner__body" hidden={!statesOpen}>
          <p className="tuner__group">Force a state</p>
          {Object.entries(FLAGS).map(([k, f]) => (
            <label key={k} className="tuner__check">
              <input type="checkbox" checked={flags.has(k)} onChange={() => toggle(k)} />
              <span>{f.label}</span><em>{f.note}</em>
            </label>
          ))}
          <p className="tuner__hint">Always on: Belt “Large” and Hunter Green tie “Traditional” are sold out.</p>
          <div className="tuner__actions"><button type="button" onClick={onReset}>Reset cart</button></div>
        </div>
      </section>
      <ViewportSwitcher />
      <Tuner />
    </div>
  );
}
