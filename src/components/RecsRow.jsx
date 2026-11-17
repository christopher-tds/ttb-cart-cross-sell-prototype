import { useEffect, useLayoutEffect, useRef, useState } from "react";
import RecCard from "./RecCard.jsx";
import Icon from "../icons.jsx";
import { flip, ms, motionOff } from "../motion.js";

// "Complete The Look" row, as live v3: Belizio 18 heading, 28px gray-20 arrows, a 12px-gap row of 116px
// cards that scrolls sideways with the last card cut off (C14). After an add, the added card fades out,
// the rest slide left and the next rec fades in at the end (v3 drops the card and appends one, with no motion).
// v4 change: the heading is centered on the arrows. Live v3 sets the arrows 7px below the heading, and the
// control arm keeps that offset.
export default function RecsRow({ ids, arm, step: perClick = 3, getProduct, onQuickAdd, onOpen }) {
  const [list, setList] = useState(() => ids.map((id) => ({ id })));
  const refs = useRef(new Map());
  const before = useRef(null);
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const key = ids.join(",");
  useEffect(() => {
    const shown = list.map((x) => x.id);
    const gone = shown.filter((id) => !ids.includes(id));
    const settle = () => {
      before.current = new Map([...refs.current].map(([id, el]) => [id, el.getBoundingClientRect()]));
      setList(ids.map((id) => ({ id, entering: !shown.includes(id) })));
    };
    if (!gone.length) return settle();
    setList((l) => l.map((x) => (gone.includes(x.id) ? { ...x, leaving: true } : x)));
    const t = setTimeout(settle, ms("--rec-exit", 220));
    return () => clearTimeout(t);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (!before.current) return;
    flip([...refs.current.values()], before.current);
    before.current = null;
  }, [list]);

  const measure = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
  };
  useEffect(measure, [list]);

  // Arrows jump a set number of cards (one card + gap = 128px) and land on a card's left edge, so from the
  // first card a right click lands on the 4th when perClick is 3. Control stays at 1 (live step not measured).
  const step = (dir) => {
    const el = track.current;
    if (!el) return;
    // Stops are every perClick cards (1, 4, 7…) plus the row's end, the same going back as forward.
    const page = el.scrollLeft / 128 / perClick;
    const target = dir > 0 ? Math.floor(page + 0.001) + 1 : Math.ceil(page - 0.001) - 1;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.max(0, Math.min(max, target * perClick * 128)), behavior: motionOff() ? "auto" : "smooth" });
  };

  if (!list.length) return null;
  return (
    <section className="recs" data-arm={arm} aria-labelledby="recs-title">
      <div className="recs__head">
        <h4 id="recs-title" className="recs__title">Complete The Look</h4>
        <div className="recs__arrows">
          <button type="button" aria-label="Previous recommendations" disabled={edges.start} onClick={() => step(-1)}><Icon name="caret-left" /></button>
          <button type="button" aria-label="Next recommendations" disabled={edges.end} onClick={() => step(1)}><Icon name="caret-right" /></button>
        </div>
      </div>
      <ul className="recs__track" ref={track} onScroll={measure}>
        {list.map(({ id, leaving, entering }) => (
          <RecCard key={id} p={getProduct(id)} onQuickAdd={onQuickAdd} onOpen={onOpen}
            className={leaving ? "is-leaving" : entering ? "is-entering" : ""}
            ref={(el) => (el ? refs.current.set(id, el) : refs.current.delete(id))} />
        ))}
      </ul>
    </section>
  );
}
