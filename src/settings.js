// Review settings live in the URL, so a link (and the Tablet / Mobile frames) opens the same view.
// None of this is design; it switches the test arm and forces edge-case states for review and Figma.

export const FLAGS = {
  allSoldOut: { label: "All sizes sold out", note: "Sweater" },
  sale: { label: "Sale price", note: "Navy grenadine tie" },
  addError: { label: "Add fails once", note: "Sheet error" },
  noRecs: { label: "No recommendations", note: "Row hides" },
};

export function readSettings() {
  const p = new URLSearchParams(location.search);
  const flags = (p.get("states") || "").split(",").filter((f) => f in FLAGS);
  return {
    arm: p.get("arm") === "control" ? "control" : "variant",
    drawer: p.get("drawer") !== "0",
    step: p.get("step") === "1" ? 1 : 3,
    layout: p.get("layout") === "scroll" ? "scroll" : "pinned", // variant only: "pinned" scrolls the lines, keeps recs + footer fixed (2026-11-18 test) // cards per arrow click in the variant; 3 preferred (2026-11-17). Live step not measured
    flags: new Set(flags),
  };
}

export function writeSettings({ arm, flags, step, layout }) {
  const url = new URL(location.href);
  url.searchParams.set("arm", arm);
  url.searchParams.set("step", step);
  url.searchParams.set("layout", layout);
  if (flags.size) url.searchParams.set("states", [...flags].join(",")); else url.searchParams.delete("states");
  history.replaceState(null, "", url);
}

export const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
export const money2 = (n) => "$" + n.toFixed(2); // line items and subtotal show cents, as live
