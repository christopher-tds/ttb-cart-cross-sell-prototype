import { useState } from "react";
import { PRODUCTS, img } from "../data/products.js";

// Context only: a simplified tie PDP (Grosgrain Solid Burgundy) so the drawer opens over a real-looking page.
// Not part of the design under review. Adding here opens the drawer, the way the live site does.
export default function PdpBackdrop({ onAdd }) {
  const p = PRODUCTS["tie-1861-0054"];
  const [size, setSize] = useState("Modern");
  return (
    <main id="main" className="pdp">
      <p className="pdp__crumbs"><a href="#">Home</a> / <a href="#">Ties</a></p>
      <div className="pdp__grid">
        <div className="pdp__media"><img src={img(p.image, 1000)} alt="Grosgrain Solid Burgundy Tie, rolled" /></div>
        <div className="pdp__buy">
          <h1 className="pdp__title">{p.name}</h1>
          <p className="pdp__price">$28</p>
          <p className="pdp__desc">Featured in deep wine red, this handmade tie features a classic solid design crafted from 100% grosgrain silk.</p>
          <p className="pdp__label">Size: <b>{size}</b></p>
          <div className="pdp__sizes">
            {p.option.values.map((v) => (
              <button key={v.label} type="button" aria-pressed={v.label === size} onClick={() => setSize(v.label)}>{v.label}</button>
            ))}
          </div>
          <button type="button" className="btn-primary pdp__add" onClick={() => onAdd(size)}>
            <span>Add to cart</span> <span aria-hidden="true">-</span> <span>$28</span>
          </button>
        </div>
      </div>
    </main>
  );
}
