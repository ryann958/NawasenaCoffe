import { businessConfig } from "./config.js";

const BRAND_SVG = `<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
  <path d="M25.2 5.9c-7.5.1-15 6.7-16.5 15-1.2 6.9 2.4 12.7 8.6 13.8 7.5 1.3 15.9-5.6 17.3-14.3 1-6.4-2.8-12-9.4-14.5Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M26.8 11.6c-3.1 3.3-6.2 8.2-8.6 13.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/>
</svg>`;

const NAV_LINKS = [
  { href: "./index.html", label: "Home", key: "home" },
  { href: "./about.html", label: "About", key: "about" },
  { href: "./menu.html", label: "Menu", key: "menu" },
  { href: "./gallery.html", label: "Gallery", key: "gallery" },
  { href: "./contact.html", label: "Contact", key: "contact" },
];

const ARROW_ICON = `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h11m-4-4 4 4-4 4"/></svg>`;

function currentPageKey() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/" || path.endsWith("/index.html")) return "home";
  return path.replace(/^\//, "").replace(/\.html$/, "").split("/")[0];
}

function buildHeader(pageKey) {
  const navLinks = NAV_LINKS.map(({ href, label, key }) => {
    const isActive = key === pageKey;
    return `<a class="site-nav__link${isActive ? " is-active" : ""}" href="${href}"${isActive ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("\n          ");

  return `<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="./index.html" aria-label="Nawasena Coffee, beranda">
      ${BRAND_SVG}
      <span class="brand__name"></span>
    </a>

    <button
      class="nav-toggle"
      type="button"
      aria-label="Buka navigasi"
      aria-controls="primary-navigation"
      aria-expanded="false"
      data-nav-toggle
    >
      <span class="nav-toggle__line"></span>
      <span class="nav-toggle__line"></span>
      <span class="nav-toggle__line"></span>
    </button>

    <nav class="site-nav" id="primary-navigation" aria-label="Navigasi utama" data-site-nav>
          ${navLinks}
    </nav>

    <a class="header-cta" href="./contact.html">
      <span>Contact Us</span>
      ${ARROW_ICON}
    </a>
  </div>
</header>`;
}

function buildFooter() {
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <a class="brand site-footer__brand" href="./index.html" aria-label="Nawasena Coffee, kembali ke atas">
      ${BRAND_SVG}
      <span class="brand__name"></span>
    </a>
    <nav class="site-footer__nav" aria-label="Navigasi footer">
      <a href="./about.html">Our Story</a>
      <a href="./menu.html">Menu</a>
      <a href="./gallery.html">Gallery</a>
      <a href="./contact.html">Contact</a>
    </nav>
    <p class="site-footer__copyright">
      © <span data-current-year></span> Nawasena Coffee
    </p>
  </div>
</footer>`;
}

export function initPage() {
  const pageKey = currentPageKey();

  // Inject header
  const headerPlaceholder = document.querySelector("[data-header-placeholder]");
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = buildHeader(pageKey);
  }

  // Inject footer
  const footerPlaceholder = document.querySelector("[data-footer-placeholder]");
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = buildFooter();
  }

  // Brand names
  document.querySelectorAll(".brand__name").forEach((el) => {
    el.textContent = businessConfig.brandDisplayName;
  });

  // Current year
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Mobile nav toggle
  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");
  if (navToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
    const mobileQuery = window.matchMedia("(max-width: 899px)");

    const setOpen = (isOpen) => {
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Tutup navigasi" : "Buka navigasi");
      siteNav.classList.toggle("is-open", isOpen);
    };

    navToggle.addEventListener("click", () => {
      setOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        setOpen(false);
        if (mobileQuery.matches) navToggle.focus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        navToggle.focus();
      }
    });

    mobileQuery.addEventListener("change", (e) => { if (!e.matches) setOpen(false); });
  }
}
