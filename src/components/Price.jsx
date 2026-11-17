import { money } from "../settings.js";

// Sale: compare-at struck through in gray-70, sale price in helper red (same as the PDP cross-sell).
export default function Price({ p, withOff = false, className = "price" }) {
  if (!p.compareAt) return <p className={className}>{money(p.price)}</p>;
  return (
    <p className={className}>
      <s><span className="sr-only">Regular price: </span>{money(p.compareAt)}</s>
      <span className="price__sale"><span className="sr-only">Sale price: </span>{money(p.price)}</span>
      {withOff && p.percentOff ? <span className="price__off">{p.percentOff}% off</span> : null}
    </p>
  );
}
