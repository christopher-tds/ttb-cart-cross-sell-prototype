import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import PdpBackdrop from "./components/PdpBackdrop.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ReviewBar from "./review/ReviewBar.jsx";
import { showReviewBar } from "./review/config.js";
import { START_CART, FULL_CART } from "./data/products.js";
import { product, recIds } from "./catalog.js";
import { readSettings, writeSettings } from "./settings.js";
import { delay, ms } from "./motion.js";

// Line keys are unique IDs rather than a counter, so a hot reload can't hand out a key that's already in the cart.
const newId = () => crypto.randomUUID();
const withKeys = (lines) => lines.map((l) => ({ ...l, key: newId() }));

// Variant decisions (2026-11-19): arrows move 3 cards per click, and the recs + footer stay pinned while only the
// cart lines scroll. Control stays live v3: 1 card per click, the whole drawer scrolls.
export default function App() {
  const [settings, setSettings] = useState(readSettings);
  const [cart, setCart] = useState(() => withKeys(START_CART));
  const [open, setOpen] = useState(settings.drawer);
  const [sheetId, setSheetId] = useState(null);
  const [newKey, setNewKey] = useState(null);
  const [message, setMessage] = useState("");
  const trigger = useRef(null);
  const failed = useRef(false);
  const refocus = useRef(false);

  // A dismissed sheet hands focus back to the card that opened it, once the cart is no longer inert.
  useEffect(() => {
    if (sheetId || !refocus.current) return;
    refocus.current = false;
    trigger.current?.focus({ preventScroll: true });
  }, [sheetId]);

  const { arm, flags } = settings;
  const getProduct = useCallback((id) => product(id, flags), [flags]);
  const recs = useMemo(() => recIds(arm, cart, flags), [arm, cart, flags]);
  const count = cart.reduce((s, l) => s + l.qty, 0);

  const announce = (text) => { setMessage(""); setTimeout(() => setMessage(text), 50); };

  // New lines go on top, as live. The same product and size adds to that line's quantity instead.
  const addLine = (id, size, qty = 1) => {
    const key = newId();
    setCart((c) => {
      const hit = c.find((l) => l.id === id && l.size === size);
      if (hit) { setNewKey(hit.key); return c.map((l) => (l === hit ? { ...l, qty: l.qty + qty } : l)); }
      setNewKey(key);
      return [{ id, size, qty, key }, ...c];
    });
    const p = getProduct(id);
    announce(`${p.name}${size ? `, size ${size},` : ""} added to cart`);
  };

  // The card that was clicked leaves the row, so focus moves to the card that takes its place.
  const focusRowAfter = async (index) => {
    await delay(ms("--rec-exit", 220) + 60);
    const buttons = [...document.querySelectorAll(".recs [data-rec-add]")].filter((b) => !b.closest(".is-leaving"));
    (buttons[Math.min(index, buttons.length - 1)] || document.querySelector(".btn-checkout"))?.focus({ preventScroll: true });
  };
  const rowIndex = (id) => recs.indexOf(id);

  const quickAdd = (id) => { const i = rowIndex(id); addLine(id, null); focusRowAfter(i); };
  const openSheet = (id, el) => { trigger.current = el; setSheetId(id); };
  const sheetClosed = (result) => {
    setSheetId(null);
    if (!result) { refocus.current = true; return; }
    const i = rowIndex(result.id);
    addLine(result.id, result.size, result.qty);
    focusRowAfter(i);
  };
  const failNext = () => {
    if (!flags.has("addError") || failed.current) return false;
    failed.current = true; // fails once per page load, so the retry goes through
    return true;
  };

  const update = (next) => { const s = { ...settings, ...next }; writeSettings(s); setSettings(s); };
  const reset = (lines = START_CART) => { setCart(withKeys(lines)); setSheetId(null); setNewKey(null); failed.current = false; setOpen(true); };

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div inert={open || undefined}>
        <SiteHeader count={count} onBag={() => setOpen(true)} />
        <PdpBackdrop onAdd={(size) => { addLine("tie-1861-0054", size); setOpen(true); }} />
      </div>
      <CartDrawer open={open} arm={arm} step={arm === "control" ? 1 : 3} layout={arm === "control" ? "scroll" : "pinned"} cart={cart} recs={recs} getProduct={getProduct} newKey={newKey}
        onClose={() => { setOpen(false); setSheetId(null); }}
        onQty={(key, d) => setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: Math.max(1, l.qty + d) } : l)))}
        onRemove={(key) => setCart((c) => c.filter((l) => l.key !== key))}
        onQuickAdd={quickAdd} sheetId={sheetId} onOpenSheet={openSheet} onSheetClosed={sheetClosed} failNext={failNext} />
      <div className="sr-only" aria-live="polite">{message}</div>
      {showReviewBar && <ReviewBar settings={settings} onChange={update} onReset={() => reset()} onFill={() => reset(FULL_CART)} />}
    </>
  );
}
