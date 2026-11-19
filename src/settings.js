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
    flags: new Set(flags),
  };
}

export function writeSettings({ arm, flags }) {
  const url = new URL(location.href);
  url.searchParams.set("arm", arm);
  url.searchParams.delete("step");
  url.searchParams.delete("layout");
  if (flags.size) url.searchParams.set("states", [...flags].join(",")); else url.searchParams.delete("states");
  history.replaceState(null, "", url);
}

export const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
export const money2 = (n) => "$" + n.toFixed(2); // line items and subtotal show cents, as live
