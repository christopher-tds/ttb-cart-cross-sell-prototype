// Live thetiebar.com header, from tb-shirting-lp-prototype (measured 2026-11-08; nav and copy rechecked
// 2026-11-17). 1440: 38px announcement + 66px row, logo left. Below 1000: 36 + 64, logo centered, menu and
// search left. Icons are Phosphor Regular (C16). The bag opens the cart drawer and shows the count.
const NAV = ["New", "Ties", "Bow Ties", "Dress Shirts", "Polos & Sweaters", "Suits & Jackets", "Accessories", "Wedding"];
const icon = (name, size = 24) => <img src={`assets/icons/${name}.svg`} alt="" width={size} height={size} />;

export default function SiteHeader({ count, onBag }) {
  return (
    <header className="site-header">
      <div className="announce"><a href="#">Our Holiday Gift Guide <span className="announce__cta">Shop Now</span></a></div>
      <nav className="nav" aria-label="Main">
        <div className="nav__start">
          <button className="icon-btn" type="button" aria-label="Open menu">{icon("list", 28)}</button>
          <button className="icon-btn" type="button" aria-label="Search">{icon("search", 28)}</button>
        </div>
        <a className="logo" href="#" aria-label="The Tie Bar home"><img src="assets/tie-bar-logo.svg" alt="" /></a>
        <ul className="nav__list">
          {NAV.map((label) => <li key={label}><a href="#" aria-current={label === "Ties" ? "page" : undefined}>{label}</a></li>)}
        </ul>
        <div className="nav__end">
          <a className="nav__text" href="#">Support</a>
          <button className="icon-btn nav__wide" type="button" aria-label="Search">{icon("search")}</button>
          <a className="icon-btn nav__wide" href="#" aria-label="Account">{icon("account")}</a>
          <button className="icon-btn bag" type="button" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} onClick={onBag}>
            {icon("cart", 28)}
            <span className="bag__count" aria-hidden="true">{count}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
