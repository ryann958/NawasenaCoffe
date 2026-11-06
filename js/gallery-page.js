import { initPage } from "./page.js";
import { initScrollReveal, initScrollParallax, fetchPublishedRows, getPublicImageUrl, getOptionalSupabaseClient } from "./shared.js";
import { galleryItems } from "./gallery-data.js";

initPage();

const galleryGrid = document.querySelector("[data-gallery-grid]");
if (galleryGrid) {
  renderGallery(galleryGrid, galleryItems);
}
initGalleryMotion();
void loadGalleryContent();
initScrollReveal();
initScrollParallax();

async function loadGalleryContent() {
  try {
    const client = await getOptionalSupabaseClient();
    if (!client) return;
    const rows = await fetchPublishedRows(client, "gallery_items", "display_order");
    if (rows.length > 0) {
      renderGallery(galleryGrid, rows.map((item) => ({
        imagePath: getPublicImageUrl(client, item.image_path),
        altText: item.alt_text,
        category: item.category,
        caption: item.caption,
        displayOrder: item.display_order,
      })));
      initScrollReveal();
    }
  } catch (error) {
    console.error("Gallery konten tidak dapat dimuat:", error);
  }
}

function renderGallery(container, items) {
  if (items.length === 0) return;

  container.replaceChildren();
  const orderedItems = [...items]
    .sort((a, b) => a.displayOrder - b.displayOrder)
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
  if (orderedItems.length < 2) track.classList.add("gallery-track--static");

  const copies = orderedItems.length > 1 ? 2 : 1;
  for (let copy = 0; copy < copies; copy += 1) {
    const group = document.createElement("div");
    group.className = "gallery-track__group";
    group.setAttribute("role", "list");
    if (copy > 0) group.setAttribute("aria-hidden", "true");

    orderedItems.forEach((item) => {
      const card = copy === 0 ? item : item.cloneNode(true);
      card.removeAttribute("data-stagger");
      if (copy > 0) card.classList.remove("reveal", "is-visible");
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

function initGalleryMotion() {
  const viewport = document.querySelector("[data-gallery-grid]");
  const toggle = document.querySelector("[data-gallery-motion-toggle]");
  if (!(viewport instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) return;

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
  reducedMotion.addEventListener("change", (e) => setMotionEnabled(!e.matches));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      viewport.classList.toggle("is-in-view", entry.isIntersecting);
    });
    observer.observe(viewport);
  } else {
    viewport.classList.add("is-in-view");
  }
}
