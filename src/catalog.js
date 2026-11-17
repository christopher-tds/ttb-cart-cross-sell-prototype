import { PRODUCTS, RECS } from "./data/products.js";

// Applies the review flags to the live snapshot. Every change here is a forced state, not live data.
export function product(id, flags) {
  const p = { id, ...PRODUCTS[id] };
  if (flags.has("sale") && id === "tie-5934-0251") Object.assign(p, { compareAt: 58, price: 40.6, percentOff: 30 });
  if (flags.has("allSoldOut") && id === "swt-6169-0592") {
    p.option = { ...p.option, values: p.option.values.map((v) => ({ ...v, soldOut: true, demo: true })) };
  }
  p.sized = !!p.option;
  p.soldOut = p.sized && p.option.values.every((v) => v.soldOut);
  return p;
}

// What the row shows: the arm's pool, minus anything already in the cart (live v3 does the same).
export function recIds(arm, cart, flags) {
  if (flags.has("noRecs")) return [];
  const inCart = new Set(cart.map((l) => l.id));
  return RECS[arm].filter((id) => !inCart.has(id));
}
