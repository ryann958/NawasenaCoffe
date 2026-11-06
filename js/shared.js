import { businessConfig } from "./config.js";
import { getOptionalSupabaseClient } from "./services/supabase-client.js";

let scrollRevealObserver;

export function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");
  if (revealElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("has-scroll-reveal");
  if (!scrollRevealObserver) {
    scrollRevealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
  }

  revealElements.forEach((el) => {
    if (el.hasAttribute("data-stagger")) {
      const index = Number(el.dataset.stagger);
      const delay = Math.min(Number.isFinite(index) ? index : 0, 6) * 90;
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    }
    scrollRevealObserver.observe(el);
  });
}

export function initScrollParallax() {
  const elements = [...document.querySelectorAll("[data-scroll-parallax]")];
  if (elements.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationFrame = 0;

  const updateElement = (el) => {
    const bounds = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const factor = Number(el.dataset.scrollParallax);
    const parallaxFactor = Number.isFinite(factor) ? factor : 0.08;
    const centerOffset = vh * 0.5 - (bounds.top + bounds.height * 0.5);
    const motionScale = reducedMotion.matches ? 0.4 : 1;
    const translateY = Math.max(-48, Math.min(48, centerOffset * parallaxFactor)) * motionScale;
    const fadeIn = Math.max(0, Math.min(1, (vh - bounds.top) / (vh * 0.35)));
    const fadeOut = Math.max(0, Math.min(1, (bounds.bottom + vh * 0.2) / (vh * 0.4)));
    el.style.setProperty("--scroll-parallax-y", `${translateY.toFixed(2)}px`);
    el.style.setProperty("--scroll-parallax-opacity", String(Math.min(fadeIn, fadeOut)));
  };

  const update = () => {
    animationFrame = 0;
    elements.forEach(updateElement);
  };

  const schedule = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reducedMotion.addEventListener("change", schedule);
}

export function renderBusinessDetails() {
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

export function renderSocialLinks() {
  document.querySelectorAll("[data-social-link]").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    const destination = getSocialDestination(link.dataset.socialLink);
    if (!destination) return;
    link.href = destination;
    if (link.dataset.socialLink !== "email") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.hidden = false;
    link.parentElement?.querySelector("[data-social-placeholder]")?.setAttribute("hidden", "");
  });
}

export function getSocialDestination(platform, message = "Halo Nawasena Coffee.") {
  if (platform === "whatsapp") {
    const number = businessConfig.whatsappNumber;
    const normalizedNumber = typeof number === "string" ? number.replace(/\D/g, "") : "";
    return normalizedNumber
      ? `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`
      : null;
  }
  if (platform === "email") {
    const addr = businessConfig.emailAddress;
    return typeof addr === "string" && addr.trim() ? `mailto:${addr.trim()}` : null;
  }
  const url = platform === "instagram"
    ? businessConfig.instagramUrl
    : platform === "facebook"
      ? businessConfig.facebookUrl
      : null;
  return typeof url === "string" && /^https:\/\/\S+$/i.test(url.trim()) ? url.trim() : null;
}

export async function fetchPublishedRows(client, table, orderColumn) {
  const { data, error } = await client
    .from(table)
    .select("*")
    .eq("is_published", true)
    .order(orderColumn, { ascending: true })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export function getPublicImageUrl(client, imagePath) {
  if (!imagePath) return null;
  return client.storage.from("nawasena-content").getPublicUrl(imagePath).data.publicUrl;
}

export { getOptionalSupabaseClient };

function isHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
