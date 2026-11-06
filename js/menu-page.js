import { initPage } from "./page.js";
import { initScrollReveal, initScrollParallax, getSocialDestination, fetchPublishedRows, getPublicImageUrl, getOptionalSupabaseClient } from "./shared.js";
import { menuItems } from "./menu-data.js";

initPage();

// Wire up order CTA button to WhatsApp
const orderCta = document.querySelector("[data-order-cta]");
if (orderCta instanceof HTMLAnchorElement) {
  const url = getSocialDestination("whatsapp", "Halo Nawasena Coffee, saya ingin melihat menu yang tersedia.");
  if (url) {
    orderCta.href = url;
    orderCta.target = "_blank";
    orderCta.rel = "noopener noreferrer";
  }
}

const menuGrid = document.querySelector("[data-menu-grid]");
if (menuGrid) {
  renderMenu(menuGrid, menuItems);
}

const menuToggle = document.querySelector("[data-menu-toggle]");
menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isExpanded));
  menuToggle.textContent = isExpanded ? "Tampilkan lebih sedikit" : "Lihat semua menu";
  menuGrid?.classList.toggle("menu-grid--collapsed", !isExpanded);
});

void loadMenuContent();
initScrollReveal();
initScrollParallax();

async function loadMenuContent() {
  try {
    const client = await getOptionalSupabaseClient();
    if (!client) return;
    const rows = await fetchPublishedRows(client, "menu_items", "display_order");
    if (rows.length > 0) {
      renderMenu(menuGrid, rows.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: Number(item.price),
        image: getPublicImageUrl(client, item.image_path),
        available: item.is_available,
      })));
      initScrollReveal();
    }
  } catch (error) {
    console.error("Menu konten tidak dapat dimuat:", error);
  }
}

function renderMenu(container, items) {
  if (items.length === 0) return;

  container.replaceChildren();
  container.id = "menu-items";
  const formatter = new Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
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
        orderLink.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.2 11.7a8.1 8.1 0 0 1-12 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20.2 11.7Z"/><path d="M9 8.2c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4v.4c0 .3-.1.5-.4.7-.5.3-1.2.5-1.9.4-1.1-.2-2.4-.9-3.6-2.1-1.2-1.2-1.9-2.5-2.1-3.6-.1-.7.1-1.4.4-1.9Z"/></svg><span>Order Now</span><svg class="link-arrow-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h11m-4-4 4 4-4 4"/></svg>`;
        body.append(orderLink);
      }
    }

    card.append(visual, body);
    container.append(card);
  });

  const toggle = document.querySelector("[data-menu-toggle]");
  const more = toggle?.parentElement;
  const hasMore = items.length > 6;
  container.classList.toggle("menu-grid--collapsed", hasMore);
  if (toggle instanceof HTMLButtonElement) {
    toggle.hidden = !hasMore;
    if (more instanceof HTMLElement) more.hidden = !hasMore;
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Lihat semua menu";
  }
}
