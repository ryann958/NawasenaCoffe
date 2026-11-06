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

  const currentYear = document.querySelector("[data-current-year]");
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll("[data-footer-brand]").forEach((brandName) => {
    brandName.textContent = businessConfig.brandDisplayName;
  });
}

function renderMenu(container, items) {
  if (items.length === 0) {
    return;
  }

  container.replaceChildren();
  container.id = "menu-items";
  const formatter = new Intl.NumberFormat(businessConfig.defaultLanguage, {
    style: "currency",
    currency: businessConfig.currency,
    maximumFractionDigits: 0,
  });

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "menu-card reveal";
    card.dataset.stagger = String(index);

    const visual = document.createElement("div");
    visual.className = "menu-card__visual";
    visual.setAttribute("aria-hidden", "true");

    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = "";
      image.width = 640;
      image.height = 800;
      image.loading = "lazy";
      image.decoding = "async";
      visual.append(image);
    } else {
      visual.classList.add("menu-card__visual--placeholder");
    }

    const body = document.createElement("div");
    body.className = "menu-card__body";
    const category = document.createElement("p");
    category.className = "menu-card__category";
    category.textContent = item.category;
    const title = document.createElement("h3");
    title.className = "menu-card__title";
    title.textContent = item.name;
    const description = document.createElement("p");
    description.className = "menu-card__description";
    description.textContent = item.description;
    const footer = document.createElement("div");
    footer.className = "menu-card__footer";
    const price = document.createElement("span");
    price.className = "menu-card__price";
    price.textContent = Number.isFinite(item.price) ? formatter.format(item.price) : "";

    footer.append(price);
    if (!item.available) {
      const availability = document.createElement("span");
      availability.className = "menu-card__availability";
      availability.textContent = "Unavailable";
      footer.append(availability);
    }

    body.append(category, title, description, footer);
    if (item.available) {
      const orderUrl = getSocialDestination(
        "whatsapp",
        `Halo Nawasena Coffee, saya ingin memesan:\n\nMenu: ${item.name}\nJumlah: \n\nMohon info ketersediaannya. Terima kasih.`,
      );

      if (orderUrl) {
        const orderLink = document.createElement("a");
        orderLink.className = "menu-card__order";
        orderLink.href = orderUrl;
        orderLink.target = "_blank";
        orderLink.rel = "noopener noreferrer";
        orderLink.setAttribute("aria-label", `Order ${item.name} via WhatsApp`);
        orderLink.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M20.2 11.7a8.1 8.1 0 0 1-12 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20.2 11.7Z" />
            <path d="M9 8.2c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4v.4c0 .3-.1.5-.4.7-.5.3-1.2.5-1.9.4-1.1-.2-2.4-.9-3.6-2.1-1.2-1.2-1.9-2.5-2.1-3.6-.1-.7.1-1.4.4-1.9Z" />
          </svg>
          <span>Order Now</span>
          <svg class="link-arrow-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M4 10h11m-4-4 4 4-4 4" />
          </svg>`;
        body.append(orderLink);
      }
    }

    card.append(visual, body);
    container.append(card);
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuMore = menuToggle?.parentElement;
  const hasMoreItems = items.length > 6;
  container.classList.toggle("menu-grid--collapsed", hasMoreItems);
  if (menuToggle instanceof HTMLButtonElement) {
    menuToggle.hidden = !hasMoreItems;
    if (menuMore instanceof HTMLElement) {
      menuMore.hidden = !hasMoreItems;
    }
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Lihat semua menu";
  }
}

function renderGallery(container, items) {
  if (items.length === 0) {
    return;
  }

  container.replaceChildren();
  const orderedItems = [...items]
    .sort((first, second) => first.displayOrder - second.displayOrder)
    .map((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-card reveal";
      figure.dataset.stagger = String(index);

      const image = document.createElement("img");
      image.src = item.imagePath;
      image.alt = item.altText;
      image.width = 720;
      image.height = 900;
      image.loading = "lazy";
      image.decoding = "async";

      const caption = document.createElement("figcaption");
      caption.className = "gallery-card__caption";
      caption.textContent = item.caption;
      figure.append(image, caption);
      return figure;
    });

  const track = document.createElement("div");
  track.className = "gallery-track";
  track.id = "gallery-track";
  track.style.setProperty("--gallery-duration", `${Math.max(orderedItems.length * 6, 18)}s`);
  if (orderedItems.length < 2) {
    track.classList.add("gallery-track--static");
  }

  const copies = orderedItems.length > 1 ? 2 : 1;
  for (let copy = 0; copy < copies; copy += 1) {
    const group = document.createElement("div");
    group.className = "gallery-track__group";
    group.setAttribute("role", "list");
    if (copy > 0) {
      group.setAttribute("aria-hidden", "true");
    }

    orderedItems.forEach((item) => {
      const card = copy === 0 ? item : item.cloneNode(true);
      card.removeAttribute("data-stagger");
      if (copy > 0) {
        card.classList.remove("reveal", "is-visible");
      }
      card.setAttribute("role", "listitem");
      group.append(card);
    });
    track.append(group);
  }

  container.append(track);
  const motionToggle = document.querySelector("[data-gallery-motion-toggle]");
  if (motionToggle instanceof HTMLButtonElement) {
    motionToggle.hidden = orderedItems.length < 2;
  }
}

function initializeGalleryMotion() {
  const viewport = document.querySelector("[data-gallery-grid]");
  const toggle = document.querySelector("[data-gallery-motion-toggle]");
  if (!(viewport instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setMotionEnabled = (enabled) => {
    viewport.dataset.motionEnabled = String(enabled);
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.textContent = enabled ? "Jeda gerak galeri" : "Gerakkan galeri";
  };

  setMotionEnabled(!reducedMotion.matches);
  toggle.addEventListener("click", () => {
    setMotionEnabled(viewport.dataset.motionEnabled !== "true");
  });
  reducedMotion.addEventListener("change", (event) => {
    setMotionEnabled(!event.matches);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      viewport.classList.toggle("is-in-view", entry.isIntersecting);
    });
    observer.observe(viewport);
  } else {
    viewport.classList.add("is-in-view");
  }
}

function renderBusinessDetails() {
  const address = document.querySelector("[data-business-address]");
  if (address && businessConfig.address) {
    address.textContent = businessConfig.address;
  }

  const openingHours = document.querySelector("[data-opening-hours]");
  if (openingHours && businessConfig.openingHours) {
    if (Array.isArray(businessConfig.openingHours)) {
      openingHours.textContent = businessConfig.openingHours.join(" · ");
    } else if (typeof businessConfig.openingHours === "string") {
      openingHours.textContent = businessConfig.openingHours;
    } else {
      openingHours.textContent = Object.entries(businessConfig.openingHours)
        .map(([day, hours]) => `${day}: ${hours}`)
        .join(" · ");
    }
  }

  const mapLink = document.querySelector("[data-map-link]");
  const mapUrl = isHttpUrl(businessConfig.googleMapsUrl)
    ? businessConfig.googleMapsUrl.trim()
    : businessConfig.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessConfig.address)}`
      : null;

  if (mapLink instanceof HTMLAnchorElement && mapUrl) {
    mapLink.href = mapUrl;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.hidden = false;
  }
}

function isHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function renderSocialLinks() {
  document.querySelectorAll("[data-social-link]").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const destination = getSocialDestination(link.dataset.socialLink);
    if (!destination) {
      return;
    }

    link.href = destination;
    if (link.dataset.socialLink !== "email") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.hidden = false;
    link.parentElement?.querySelector("[data-social-placeholder]")?.setAttribute("hidden", "");
  });
}

function getSocialDestination(platform, message = "Halo Nawasena Coffee.") {
  if (platform === "whatsapp") {
    const number = businessConfig.whatsappNumber;
    const normalizedNumber = typeof number === "string" ? number.replace(/\D/g, "") : "";
    return normalizedNumber
      ? `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`
      : null;
  }

  if (platform === "email") {
    const address = businessConfig.emailAddress;
    return typeof address === "string" && address.trim()
      ? `mailto:${address.trim()}`
      : null;
  }

  const url = platform === "instagram"
    ? businessConfig.instagramUrl
    : platform === "facebook"
      ? businessConfig.facebookUrl
      : null;

  return typeof url === "string" && /^https:\/\/\S+$/i.test(url.trim())
    ? url.trim()
    : null;
}

async function loadPublishedContent() {
  try {
    const client = await getOptionalSupabaseClient();
    if (!client) {
      return;
    }

    const results = await Promise.allSettled([
      fetchPublishedRows(client, "menu_items", "display_order"),
      fetchPublishedRows(client, "gallery_items", "display_order"),
    ]);

    const [menuResult, galleryResult] = results;
    if (menuResult.status === "fulfilled") {
      renderMenu(document.querySelector("[data-menu-grid]"), menuResult.value.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: Number(item.price),
        image: getPublicImageUrl(client, item.image_path),
        available: item.is_available,
      })));
    }
    if (galleryResult.status === "fulfilled") {
      renderGallery(document.querySelector("[data-gallery-grid]"), galleryResult.value.map((item) => ({
        imagePath: getPublicImageUrl(client, item.image_path),
        altText: item.alt_text,
        category: item.category,
        caption: item.caption,
        displayOrder: item.display_order,
      })));
      initializeScrollReveal();
    }

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Konten publik Supabase tidak dapat dimuat:", result.reason);
      }
    }
    initializeScrollReveal();
  } catch (error) {
    console.error("Integrasi konten publik tidak dapat dimuat:", error);
  }
}

async function fetchPublishedRows(client, table, orderColumn) {
  const { data, error } = await client
    .from(table)
    .select("*")
    .eq("is_published", true)
    .order(orderColumn, { ascending: true })
    .limit(100);
  if (error) {
    throw error;
  }
  return data || [];
}

function getPublicImageUrl(client, imagePath) {
  if (!imagePath) return null;
  return client.storage.from("nawasena-content").getPublicUrl(imagePath).data.publicUrl;
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