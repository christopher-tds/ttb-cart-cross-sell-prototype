// Product snapshot from thetiebar.com, read 2026-11-17 (the Hydrogen store has no public products.json).
// Names, prices, option values, size guidelines and photos are live. Stock is NOT live: the PDP markup
// doesn't expose it, so every "soldOut" below is a prototype state, flagged `demo: true`.
// Photos load from Shopify's CDN at the width asked for.

const CDN = "https://cdn.shopify.com/s/files/1/0505/7019/9217/";
export const img = (path, width = 300) => `${CDN}${path}?width=${width}`;

// option: { name, values: [{ label, guide?, soldOut?, demo? }] } — one dimension only (task scope).
// `guide` is the live size guide, kept as reference; the sheet doesn't show it (cut 2026-11-17 for PDP parity).
// No option means quick add, exactly as v3 works today.
export const PRODUCTS = {
  // ---- In the cart: the single-tie order this test targets ----
  "tie-1861-0054": {
    name: "Grosgrain Solid Burgundy Tie", type: "Tie", price: 28,
    image: "files/PDP_tie-1861-0054_main_93b8a797-427b-451b-8b80-a54959c02223.jpg",
    option: { name: "Size", values: [
      { label: "Super Skinny", guide: "2 in. wide x 58 in. long" },
      { label: "Skinny", guide: "2.5 in. wide x 58 in. long" },
      { label: "Boys", guide: "2.75 in. wide x 48 in. long" },
      { label: "Modern", guide: "3 in. wide x 58 in. long" },
      { label: "Traditional", guide: "3.25 in. wide x 58 in. long" },
      { label: "Traditional - XL", guide: "3.25 in. wide x 63 in. long" },
    ] },
  },

  // ---- Newly eligible: one option dimension ----
  "tie-5934-0251": {
    name: "Solid Grenadine Navy Tie", type: "Tie", price: 58,
    image: "files/PDP_Q225_tie-5934-0251_main.jpg",
    option: { name: "Size", values: [
      { label: "Skinny", guide: "2.5 in. wide x 58 in. long" },
      { label: "Modern", guide: "3 in. wide x 58 in. long" },
      { label: "Traditional", guide: "3.25 in. wide x 58 in. long" },
      { label: "Unlined", guide: "Modern width, lighter and softer drape" },
    ] },
  },
  "tie-5934-0185": {
    name: "Solid Grenadine Hunter Green Tie", type: "Tie", price: 58,
    image: "files/PDP_Q225_tie-5934-0185_main.jpg",
    option: { name: "Size", values: [
      { label: "Skinny", guide: "2.5 in. wide x 58 in. long" },
      { label: "Modern", guide: "3 in. wide x 58 in. long" },
      { label: "Traditional", guide: "3.25 in. wide x 58 in. long", soldOut: true, demo: true },
      { label: "Unlined", guide: "Modern width, lighter and softer drape" },
    ] },
  },
  "blt-5572-0079": {
    name: "Classic Leather Chocolate Brown Belt", type: "Belt", price: 38,
    image: "files/PDP_Q124_blt-5572-0079_main.jpg",
    option: { name: "Size", values: [
      { label: "Small", guide: "40 in. long, not including buckle" },
      { label: "Medium", guide: "43 in. long, not including buckle" },
      { label: "Large", guide: "46 in. long, not including buckle", soldOut: true, demo: true },
    ] },
  },
  "tbr-0542-0002": {
    name: "Brushed Straight Silver Tie Bar", type: "Tie bar", price: 15,
    image: "products/C778.jpg",
    option: { name: "Size", values: [
      { label: "Narrow", guide: "1 in." },
      { label: "Modern", guide: "1.5 in." },
      { label: "Classic", guide: "2 in." },
    ] },
  },
  "pol-6052-0634": {
    name: "Heritage Tipped Chive Polo", type: "Polo", price: 58,
    image: "files/PDP_Q425_pol-6052-0634_main_8171dcd2-c19e-494a-99c1-dd8877e3e0b4.jpg",
    option: { name: "Size", values: ["XS", "S", "M", "L", "XL"].map((label) => ({ label })) },
  },
  "swt-6169-0592": {
    name: "The Backroom Navy Quarter Zip Sweater", type: "Sweater", price: 108,
    image: "files/PDP_Q426_swt-6169-0592_main.jpg",
    option: { name: "Size", values: ["XS", "S", "M", "L", "XL"].map((label) => ({ label })) },
  },

  // ---- Quick add (no variant), the v3 recs ----
  "pcs-3647-0054": { name: "Solid Twill Burgundy Pocket Square", type: "Pocket square", price: 14, image: "products/pcs-3647-0054.jpg" },
  "sck-3679-0185": { name: "Speckled Hunter Green Dress Socks", type: "Socks", price: 14, image: "files/PDP_sck-3679-0185_main.jpg" },
  "cfl-3977-0162": { name: "Textured Sweep Gold Cufflinks", type: "Cufflinks", price: 25, image: "files/PDP_cfl-3977-0162_main.jpg" },
  "pcs-3647-0003": { name: "Solid Twill White Pocket Square", type: "Pocket square", price: 14, image: "products/pcs-3647-0003.jpg" },
  "sck-5366-0054": { name: "Solid Pique Burgundy Dress Socks", type: "Socks", price: 14, image: "files/SCK-5366-0054.jpg" },
};

// Recommendation order. Control = what v3 showed for this tie on 2026-11-17 (quick add only).
// Variant = the recommendation rule change lets one-option products in; the order here is a stand-in for Tagalys.
export const RECS = {
  control: ["pcs-3647-0054", "sck-3679-0185", "cfl-3977-0162", "pcs-3647-0003", "sck-5366-0054"],
  variant: ["tie-5934-0251", "pcs-3647-0054", "blt-5572-0079", "tbr-0542-0002", "sck-3679-0185", "tie-5934-0185", "cfl-3977-0162", "pol-6052-0634", "swt-6169-0592", "pcs-3647-0003"],
};

export const START_CART = [{ id: "tie-1861-0054", size: "Modern", qty: 1 }];

// Live: "You're only $71 from free shipping!" with $28 in the cart.
export const FREE_SHIPPING = 99;
