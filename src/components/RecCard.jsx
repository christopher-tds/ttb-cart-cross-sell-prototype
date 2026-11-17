import { forwardRef, useState } from "react";
import Price from "./Price.jsx";
import { img } from "../data/products.js";
import { delay } from "../motion.js";

// v3 card, measured on thetiebar.com 2026-11-17: 116px wide, 1px gray-30 border, 2px radius, 114px square
// photo, Poynter 14/16.8 name clamped to two lines, 12px price, then a 30px outline "Add to cart".
// Quick add works exactly like v3 (Adding… then the card leaves). A sized product's button opens the size
// sheet instead, same as dress shirts and belts in the PDP cross-sell. Its label doesn't change.
const RecCard = forwardRef(function RecCard({ p, onQuickAdd, onOpen, className = "", style }, ref) {
  const [adding, setAdding] = useState(false);

  const click = async (e) => {
    if (p.sized) return onOpen(p.id, e.currentTarget);
    setAdding(true);
    await delay(900); // live v3 shows "Adding…" for about a second
    onQuickAdd(p.id);
  };

  // Sold out (C15): the card stays, the photo dims, one "Sold out" badge, no add to cart.
  const label = p.sized ? `Add to cart: choose a size for ${p.name}` : `Add ${p.name} to cart`;

  return (
    <li ref={ref} className={`rec ${p.soldOut ? "is-sold-out" : ""} ${className}`} style={style} data-id={p.id}>
      <a className="rec__media" href="#" tabIndex={-1} aria-hidden="true" onClick={(e) => e.preventDefault()}>
        <img src={img(p.image, 240)} alt="" width="114" height="114" loading="lazy" />
        {p.soldOut && <span className="rec__badge">Sold out</span>}
      </a>
      <div className="rec__info">
        <a className="rec__name" href="#" onClick={(e) => e.preventDefault()}>{p.name}{p.soldOut && <span className="sr-only">, sold out</span>}</a>
        <Price p={p} className="price rec__price" />
      </div>
      {!p.soldOut && (
        <div className="rec__foot">
          <button type="button" className={`btn-outline${adding ? " is-adding" : ""}`} disabled={adding}
            aria-label={label} aria-haspopup={p.sized ? "dialog" : undefined} onClick={click} data-rec-add>
            {adding ? "Adding…" : "Add to cart"}
          </button>
        </div>
      )}
    </li>
  );
});

export default RecCard;
