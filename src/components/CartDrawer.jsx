import { useEffect, useRef } from "react";
import Icon from "../icons.jsx";
import RecsRow from "./RecsRow.jsx";
import SizeSheet from "./SizeSheet.jsx";
import { img, FREE_SHIPPING } from "../data/products.js";
import { money, money2 } from "../settings.js";

// Live v3 drawer, measured on thetiebar.com 2026-11-17:
// 420px wide from 800 up, 340px below (53px of page shows at 393). Sticky header (Belizio 18 "Your Cart",
// 40px gray close), free-shipping box with a leaf progress bar, line items, then "Complete The Look" just
// above the sticky footer (subtotal, 52px "Checkout now", "Continue shopping"). Copy is kept as live,
// title case included.
export default function CartDrawer({ open, arm, step, cart, recs, getProduct, onClose, onQty, onRemove, onQuickAdd,
  sheetId, onOpenSheet, onSheetClosed, failNext, newKey }) {
  const subtotal = cart.reduce((s, l) => s + getProduct(l.id).price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const closeBtn = useRef(null);
  const body = useRef(null);

  useEffect(() => { if (open) closeBtn.current?.focus({ preventScroll: true }); }, [open]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open && !sheetId) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, sheetId, onClose]);

  const left = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <div className={`drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="drawer__scrim" onClick={onClose} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Your Cart">
        <div className="drawer__scroll" ref={body} inert={!!sheetId || undefined}>
          <header className="drawer__head">
            <h3 className="drawer__title">Your Cart</h3>
            <button type="button" className="drawer__close" aria-label="Close" ref={closeBtn} onClick={onClose}><Icon name="x" /></button>
          </header>

          <div className="ship">
            <div className="ship__box">
              <p className="ship__msg">
                <Icon name="truck" className="ship__icon" />
                {left > 0
                  ? <span>You're only {money(Math.ceil(left))} from <b>free shipping</b>!</span>
                  : <span>You've earned <b>free shipping</b>!</span>}
              </p>
              <div className="ship__bar"><i style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }} /></div>
            </div>
          </div>

          <ul className="lines" aria-label="Items in your cart">
            {cart.map((l) => {
              const p = getProduct(l.id);
              return (
                <li key={l.key} className={`line${l.key === newKey ? " is-new" : ""}`}>
                  <img className="line__img" src={img(p.image, 160)} alt="" width="62" height="62" />
                  <div className="line__info">
                    <p className="line__name">{p.name}</p>
                    <p className="line__meta"><span>Size:</span> {l.size || "One Size"}</p>
                    <div className="line__row">
                      <p className="line__price">{money2(p.price * l.qty)}</p>
                      <button type="button" className="line__trash" aria-label={`Remove ${p.name}`} onClick={() => onRemove(l.key)}><Icon name="trash" /></button>
                      <div className="line__qty" role="group" aria-label={`Quantity, ${p.name}`}>
                        <button type="button" aria-label="Decrease quantity" disabled={l.qty <= 1} onClick={() => onQty(l.key, -1)}><Icon name="minus" /></button>
                        <output>{l.qty}</output>
                        <button type="button" aria-label="Increase quantity" onClick={() => onQty(l.key, 1)}><Icon name="plus" /></button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {!cart.length && <li className="lines__empty">Your cart is empty.</li>}
          </ul>

          <RecsRow ids={recs} arm={arm} step={step} getProduct={getProduct} onQuickAdd={onQuickAdd} onOpen={onOpenSheet} />

          <footer className="drawer__foot">
            <dl className="sub"><dt>Subtotal: <span>({count} {count === 1 ? "Item" : "Items"})</span></dt><dd>{money2(subtotal)}</dd></dl>
            <a className="btn-checkout" href="#" onClick={(e) => e.preventDefault()}>Checkout now</a>
            <a className="link-continue" href="#" onClick={(e) => { e.preventDefault(); onClose(); }}><Icon name="arrow-left" /> Continue Shopping</a>
          </footer>
        </div>

        {sheetId && <SizeSheet key={sheetId} p={getProduct(sheetId)} onClose={onSheetClosed} failNext={failNext} />}
      </aside>
    </div>
  );
}
