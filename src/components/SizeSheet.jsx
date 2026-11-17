import { useEffect, useRef, useState } from "react";
import Price from "./Price.jsx";
import Icon from "../icons.jsx";
import { img } from "../data/products.js";
import { money } from "../settings.js";
import { delay, ms } from "../motion.js";

// The PDP cross-sell options sheet (../ttb-cross-sell, sheetHTML / openSheet / closeSheet), ported as is:
// summary card, one size select with a "Select" prompt and no default, quantity, and a CTA that reads
// "Select size" until a size is picked, then "Add to cart - $58".
// Changes for the cart:
// - It opens inside the drawer, not over the page. Below 800 it's a bottom sheet across the drawer, with
//   the PDP's mobile treatment (no grabber, head visually hidden, scrim tap or Esc to close). From 800 up
//   it docks to the bottom of the drawer and shows the PDP head (title + close), instead of the PDP's
//   centered desktop modal. Decided 2026-11-17.
// - Sold-out sizes are disabled options: "Large - Sold out".
// - Adding shows "Adding…" like v3, then the PDP's "Added", then the sheet closes and the drawer updates.
export default function SizeSheet({ p, onClose, onAdd, failNext }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [phase, setPhase] = useState("idle"); // idle | adding | added | error
  const panel = useRef(null);
  const closing = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    panel.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(raf);
  }, []);

  const close = async (result) => {
    if (closing.current) return;
    closing.current = true;
    setOpen(false);
    await delay(ms("--sheet-slide", 250) + 10);
    onClose(result);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); close(); }
      if (e.key === "Tab") trap(e, panel.current);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }); // re-binds each render so close() sees current state

  const picked = p.option.values.find((v) => v.label === size);
  const total = Math.round(p.price * qty * 100) / 100;

  const add = async () => {
    if (!picked || phase === "adding" || phase === "added") return;
    setPhase("adding");
    await delay(700);
    if (failNext()) { setPhase("error"); return; }
    setPhase("added");
    await delay(700); // the PDP holds "Added" for 700ms before closing
    close({ id: p.id, size, qty });
  };

  const cta = phase === "adding" ? <span>Adding…</span>
    : phase === "added" ? <><Icon name="check" /> <span>Added</span></>
    : !picked ? <span>Select size</span>
    : <><span>Add to cart</span> <span aria-hidden="true">-</span> <span>{money(total)}</span></>;

  return (
    <div className={`sheet${open ? " is-open" : ""}`}>
      <div className="sheet__scrim" onClick={() => close()} />
      <div className="sheet__panel" ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet__head">
          <h2 className="sheet__title" id="sheet-title">Complete The Look</h2>
          <button className="sheet__close" type="button" aria-label="Close" onClick={() => close()}><Icon name="x" /></button>
        </div>
        <div className="sheet__body">
          <a className="sum" href="#" onClick={(e) => e.preventDefault()}>
            <div className="sum__media"><img src={img(p.image, 200)} alt="" width="80" height="80" /></div>
            <div className="sum__info">
              <p className="sum__name">{p.name}</p>
              <Price p={p} withOff />
            </div>
          </a>

          <div className="fld">
            <label className="fld__label" htmlFor="sheet-size">{p.option.name}</label>
            <div className="select">
              <select id="sheet-size" required value={size} disabled={phase === "adding" || phase === "added"}
                onChange={(e) => { setSize(e.target.value); if (phase === "error") setPhase("idle"); }}>
                <option value="" disabled>Select</option>
                {p.option.values.map((v) => (
                  <option key={v.label} value={v.label} disabled={v.soldOut}>{v.soldOut ? `${v.label} - Sold out` : v.label}</option>
                ))}
              </select>
              <span className="select__caret"><Icon name="caret-down" /></span>
            </div>
          </div>

          <div className="buy-group">
          <div className="buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}><Icon name="minus" /></button>
              <output aria-live="polite" aria-label="Quantity">{qty}</output>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}><Icon name="plus" /></button>
            </div>
            <button type="button" className={`btn-primary is-${phase}`} disabled={!picked} aria-disabled={phase === "adding"} onClick={add}>{cta}</button>
          </div>
          {phase === "error" && (
            <p className="sheet__error" role="alert">That size couldn't be added. Try again.</p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

function trap(e, root) {
  if (!root) return;
  const f = [...root.querySelectorAll("a[href], button:not([disabled]), select:not([disabled]), [tabindex='-1']")]
    .filter((el) => el.offsetParent !== null || el === root);
  const items = f.filter((el) => el !== root);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
