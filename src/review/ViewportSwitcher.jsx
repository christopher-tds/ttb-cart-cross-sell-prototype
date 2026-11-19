import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Desktop shows the page as is; Tablet and Mobile load the same page in a frame at true device size
// (never scaled), so the real 800 / 1000 breakpoints apply. The frame carries the current URL settings.
// Tablet is 800 wide, TB's sm-md breakpoint (TB-6), as the Figma frames will be. Mobile is 360, the smallest mobile width.
const DEVICES = {
  desktop: { label: "Desktop" },
  tablet: { label: "Tablet", w: 800, h: 1180 },
  mobile: { label: "Mobile 360", w: 360, h: 800 }, // smallest mobile width (2026-11-19, replaces 320); 360 × 800 is the common small Android
  phone: { label: "393", w: 393, h: 852 }, // typical-phone check (iPhone 16)
};
const KEY = "ttb-cart-viewport";

function frameSrc() {
  const p = new URLSearchParams(location.search);
  p.set("embed", "1");
  return `${location.pathname}?${p}`;
}

function initial() {
  let v = "desktop";
  try { v = localStorage.getItem(KEY) || "desktop"; } catch (e) { /* storage blocked */ }
  return DEVICES[v] ? v : "desktop";
}

export default function ViewportSwitcher() {
  const [current, setCurrent] = useState(initial);
  const [left, setLeft] = useState(0);
  const stage = useRef(null);
  const d = DEVICES[current];

  useEffect(() => {
    try { localStorage.setItem(KEY, current); } catch (e) { /* storage blocked */ }
    document.documentElement.classList.toggle("vp-framed", !!d.w);
  }, [current, d.w]);

  // Center on whole pixels: a half-pixel offset lets a 1px sliver of the canvas show at the edges.
  useLayoutEffect(() => {
    if (!d.w) return;
    const place = () => setLeft(Math.max(0, Math.floor((stage.current.clientWidth - 48 - d.w) / 2)));
    place();
    addEventListener("resize", place);
    return () => removeEventListener("resize", place);
  }, [d.w]);

  return (
    <>
      <div className="vp-panel" role="group" aria-label="Preview viewport">
        {Object.entries(DEVICES).map(([key, dev]) => (
          <button key={key} type="button" aria-pressed={key === current} onClick={() => setCurrent(key)}
            title={dev.w ? `${dev.w} × ${dev.h}` : "Full window"}>{dev.label}</button>
        ))}
      </div>
      {createPortal(
        <div className="vp-stage" ref={stage} hidden={!d.w}>
          {d.w && (
            <>
              <div className="vp-device" style={{ marginLeft: left }}>
                <iframe title="Prototype at device size" src={frameSrc()}
                  style={{ width: d.w, height: d.h }} />
              </div>
              <p className="vp-size" style={{ marginLeft: left }}>{d.label} · {d.w} × {d.h}</p>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
