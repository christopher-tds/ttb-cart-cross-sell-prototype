# Tie Bar · Cart cross-sell v4 prototype

A coded prototype of Cart Cross-Sell v4 (Asana task 1215926433505137). Sized products (ties, tie bars, belts, polos and sweaters) join the cart's "Complete The Look" row. Their "Add to cart" opens a size sheet inside the drawer. It's built from `tds-prototype-starter`, shows design intent only and isn't meant to port to Hydrogen.

**Live:** https://christopher-tds.github.io/ttb-cart-cross-sell-prototype/ (GitHub Pages; a push to `main` rebuilds it through `.github/workflows/pages.yml`). The licensed fonts aren't in the repo, so the live page uses the Roboto fallbacks.

```bash
npm install     # or reuse node_modules
npm run dev     # http://localhost:5198
```

## Review controls (top left, desktop only)

| Control | What it does |
|---|---|
| Control / Variant | The 50/50 test arms. Control is v3 as it works on the live site today; Variant is v4 |
| Arrow step | Decided 2026-11-19: the variant's arrows move 3 cards per click, stopping at cards 1, 4, 7 and the row's end, the same going back. Control stays at 1 (live step not measured) |
| Pinned recs | Decided 2026-11-19: in the variant only the cart lines scroll; the header, shipping bar, "Complete The Look" and footer stay put, with the recs' top rule as the only edge. Under 720px tall the whole drawer scrolls, as live. Control scrolls the whole drawer, as live |
| States | Forces edge cases: every size sold out (sweater), sale price (navy grenadine tie), the add failing once, no recommendations. Reset cart, or "4 items" for a cart that scrolls |
| Desktop / Tablet / Mobile 360 / 393 | Frames at true size: 800 × 1180, 360 × 800 (the smallest mobile width) and 393 × 852 (phone check) |
| Motion | Timings for the rec refresh and the sheet slide, with Copy CSS to hand them over |

Settings live in the URL (`?arm=control&states=sale,addError`). `?clean` hides the bar; `?drawer=0` starts with the cart closed.

## Decisions (design, 2026-11-17)

| Decision | Detail |
|---|---|
| Pattern B, the size sheet | Chosen over an inline card swap after the wireframe review |
| Reuse the PDP cross-sell sheet as is | Summary card, size dropdown ("Select", no default), quantity, "Select size" → "Add to cart - $58" |
| 360 is the smallest mobile width | Decided 2026-11-19 (replaces 320). The live 340 drawer fits with 20px of page showing, so nothing changes below 393: same drawer, cards and sheet |
| Mobile matches the PDP | No grabber or close button; the header is visually hidden. A tap on the dimmed area or Esc closes it |
| Heading aligned with the arrows | "Complete The Look" is centered on the < > arrows (cap height within 0.5px). Live v3 sits the arrows 7px lower; the control arm keeps that |
| 800 and up: docked in the drawer | Same panel at the bottom of the drawer, with the PDP header (title + close), instead of the PDP's centered modal |

## Figma

[TTB Design System › "Cart / Cross-Sell v4"](https://www.figma.com/design/ZTcjdmCwmWRjVy5OMtV7xg/?node-id=3587-12), built 2026-11-17 from this prototype:
- **01 · Components:** rec card (Default, Adding, Sold out, Sale), line item, header, shipping bar, rec-row heading (v4 and v3), footer, and the size sheet (Mobile and Docked × 5 states)
- **02–04 · Screens:** 1440, 800 and 393 (360 frames to come), each in three states (Cart, Size sheet, Added). 05 and 06 are still at 393
- **05 · Edge states**
- **06 · Control vs variant**

Text is in Roboto placeholders bound to "Cart Cross-Sell v4 / Font (swap)"; alias those to the Typography font variables to get Poynter and Belizio.

## Sources

| What | Source |
|---|---|
| Drawer, line items, rec cards, copy | thetiebar.com cart drawer, measured at 1440, 800 and 393 on 2026-11-17 (`review-shots/00-live-v3-393.jpg`). Drawer 420px wide (340px below 800), cards 116px at a 128px pitch |
| v3 add behavior | Live: the button reads "Adding…" on gray for about a second, then the card leaves and the next rec joins the end of the row |
| Size sheet | `../ttb-cross-sell` (PDP cross-sell), `sheetHTML` and sheet styles, values unchanged |
| Products, prices, sizes, size guides, photos | thetiebar.com product pages, 2026-11-17 (`src/data/products.js`) |
| Tokens and breakpoints | `tds-design-governance` `tb.md` (TB-5, TB-6) |
| Header | `../tb-shirting-lp-prototype` (measured 2026-11-08) |

## Open decisions for dev

1. **Variant and stock data:** does the Tagalys rec response include each product's sizes and their stock, or does each sized card need a second request? That decides whether the sheet can open instantly.
2. **Where v3 lives:** the cart drawer and rec row code location isn't named anywhere yet.
3. **Docked sheet at 800 and up:** the intent is a panel inside the drawer (it dims only the drawer, and the cart behind it is inert). Whether that's one shared component with the PDP sheet is the dev's call.
4. **Heading alignment in the test:** the alignment fix is only in the variant, so it's one more visual difference between the arms. It's small, but The PM may want it in both arms or held until after the test.
5. **Error message style:** it matches the established design system error message, the Input Field error on the TTB DS Form page (131:1301): Poynter Regular 12/14 in `helper/red`, 4px below its element. The intent is to reuse the existing style, not add a new one. It sits under the button row because the add failed, not the size field.
6. **Focus after adding:** the intent is that focus moves to the card that takes the added card's place, and a polite live region announces "[name], size [size], added to cart".

## Placeholders and things to confirm

| Item | Status |
|---|---|
| Stock | Not live. Sold out Belt "Large" and Hunter Green tie "Traditional" are prototype states |
| Rec order (Variant) | Stand-in for Tagalys after the recommendation rule change |
| "You've earned free shipping!" | Copy for crossing $99 isn't confirmed; it's needed for merch or copy |
| Error copy | "That size couldn't be added. Try again." Draft. Styled as the DS Input Field error: Poynter 12/14 helper-red, 4px under the button row |
| Free-shipping box border | Live reads as a warmer light gray; the prototype uses `gray-30`, not measured |
| The PDP behind the drawer | Context only, simplified |

## Governance (core + `tb.md`)

These exceptions match live v3 and are kept as is for the test: Poynter and Belizio instead of Libre Franklin (TB-1); uppercase buttons and title-case copy ("Complete The Look", "Your Cart") (C2); the 18px drawer padding (C1); 28px rec arrows (C10). The one change from live: the drawer close icon uses `gray-60` instead of the live `gray-50`, which is about 2.4:1 on its `gray-30` circle (3.4:1 now).

## What was checked (2026-11-17, built-in browser, 1440 / 800 / 393)

- The flows run end to end in both arms:
  - Quick add: Adding…, the card leaves, focus moves to the next card.
  - Sized add: the sheet opens with focus inside it, then Select size, Add to cart - $58, Adding…, Added; the sheet closes, the line appears on top, the shipping bar updates and the rec leaves.
- **Sold-out size:** the option is disabled. All sizes sold out shows the card with a badge and no add button. The sale price shows in the card and the sheet. The error appears and the retry succeeds.
- **Keyboard:** Esc closes the sheet and returns focus to the card that opened it. Tab stays inside the sheet. The cart is inert while the sheet is open.
- **Contrast (computed):** every text pair is 4.6:1 or higher.
- **Spelling and icons:** no British spellings; icons are Phosphor Regular only.
- **Not checked:** reduced motion at runtime (CSS and JS both switch motion off, but it wasn't emulated), and a real iPhone. Motion timings were also not reviewed live, because the browser pane was hidden during testing, which pauses transitions.
