import { businessConfig } from "./config.js";

const appRoot = document.querySelector("[data-app-root]");
let scrollRevealObserver;

if (appRoot) {
  document.documentElement.lang = businessConfig.defaultLanguage;
  document.querySelectorAll("[data-brand-name]").forEach((brandName) => {
    brandName.textContent = businessConfig.brandDisplayName;
  });

  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");

  if (navToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
    const mobileNavigation = window.matchMedia("(max-width: 899px)");

    const setNavigationOpen = (isOpen) => {
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Tutup navigasi" : "Buka navigasi");
      siteNav.classList.toggle("is-open", isOpen);
    };

    navToggle.addEventListener("click", () => {
      setNavigationOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        setNavigationOpen(false);
        if (mobileNavigation.matches) {
          navToggle.focus();
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNavigationOpen(false);
        navToggle.focus();
      }
    });

    mobileNavigation.addEventListener("change", (event) => {
      if (!event.matches) {
        setNavigationOpen(false);
      }
    });
  }

  initializeScrollReveal();
  initializeHeroScrollAtmosphere();
  initializeScrollParallax();
  initializeQuoteTicker();

  const currentYear = document.querySelector("[data-current-year]");
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll("[data-footer-brand]").forEach((brandName) => {
    brandName.textContent = businessConfig.brandDisplayName;
  });
}


function initializeScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");
  if (revealElements.length === 0) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("has-scroll-reveal");
  if (!scrollRevealObserver) {
    scrollRevealObserver = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
  }

  revealElements.forEach((element) => {
    if (element.hasAttribute("data-stagger")) {
      const index = Number(element.dataset.stagger);
      const delay = Math.min(Number.isFinite(index) ? index : 0, 6) * 90;
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    }
    scrollRevealObserver.observe(element);
  });
}

function initializeHeroScrollAtmosphere() {
  const hero = document.querySelector(".hero");
  if (!(hero instanceof HTMLElement)) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const artwork = hero.querySelector(".hero__artwork");
  let animationFrame = 0;
  let heroDocumentTop = 0;
  let heroHeight = 0;
  let viewportHeight = 0;

  const measureHero = () => {
    heroDocumentTop = hero.getBoundingClientRect().top + window.scrollY;
    heroHeight = hero.offsetHeight;
    viewportHeight = window.innerHeight;
  };

  const updateAtmosphere = () => {
    animationFrame = 0;

    const scrollRange = Math.max(heroHeight * 1.05, viewportHeight * 0.95);
    const progress = Math.min(
      1,
      Math.max(0, (window.scrollY - heroDocumentTop) / scrollRange),
    );
    const motionScale = reducedMotion.matches ? 0.4 : 1;

    hero.style.setProperty("--hero-effects-opacity", String(1 - progress));
    hero.style.setProperty("--hero-glow-opacity", String(1 - progress * 0.78));
    hero.style.setProperty("--hero-effects-rise", `${progress * -20 * motionScale}px`);
    hero.style.setProperty("--hero-effects-scale", String(1 - progress * 0.08));

    if (artwork instanceof HTMLImageElement) {
      const compactLayout = window.innerWidth <= 899;
      const parallaxDistance = (compactLayout ? 88 : Math.min(176, viewportHeight * 0.2)) * motionScale;
      const scaleIncrease = (compactLayout ? 0.12 : 0.2) * motionScale;
      artwork.style.setProperty("--hero-artwork-parallax-y", `${progress * parallaxDistance}px`);
      artwork.style.setProperty("--hero-artwork-parallax-scale", String(1 + progress * scaleIncrease));
    }
  };

  const scheduleUpdate = () => {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateAtmosphere);
    }
  };

  const measureAndUpdate = () => {
    measureHero();
    scheduleUpdate();
  };

  const startTracking = () => {
    measureHero();
    updateAtmosphere();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measureAndUpdate, { passive: true });
    window.addEventListener("pageshow", measureAndUpdate);
  };

  startTracking();

  reducedMotion.addEventListener("change", measureAndUpdate);
}

function initializeQuoteTicker() {
  const items = [...document.querySelectorAll(".quote-strip__item")];
  if (items.length < 2) return;

  let activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;
  window.setInterval(() => {
    items[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % items.length;
    items[activeIndex].classList.add("is-active");
  }, 4200);
}

function initializeScrollParallax() {
  const elements = [...document.querySelectorAll("[data-scroll-parallax]")];
  if (elements.length === 0) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationFrame = 0;

  const updateElement = (element) => {
    const bounds = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const factor = Number(element.dataset.scrollParallax);
    const parallaxFactor = Number.isFinite(factor) ? factor : 0.08;
    const centerOffset = viewportHeight * 0.5 - (bounds.top + bounds.height * 0.5);
    const motionScale = reducedMotion.matches ? 0.4 : 1;
    const translateY = Math.max(-48, Math.min(48, centerOffset * parallaxFactor)) * motionScale;
    const fadeIn = Math.max(0, Math.min(1, (viewportHeight - bounds.top) / (viewportHeight * 0.35)));
    const fadeOut = Math.max(0, Math.min(1, (bounds.bottom + viewportHeight * 0.2) / (viewportHeight * 0.4)));

    element.style.setProperty("--scroll-parallax-y", `${translateY.toFixed(2)}px`);
    element.style.setProperty("--scroll-parallax-opacity", String(Math.min(fadeIn, fadeOut)));
  };

  const updateActiveElements = () => {
    animationFrame = 0;
    elements.forEach(updateElement);
  };

  const scheduleUpdate = () => {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateActiveElements);
    }
  };

  const startTracking = () => {
    updateActiveElements();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
  };

  startTracking();
  reducedMotion.addEventListener("change", scheduleUpdate);
}