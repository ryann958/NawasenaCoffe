import {
  createImagePreview,
  formatError,
  getSupabaseClient,
  removeImage,
  requireAdmin,
  showMessage,
  uploadImage,
} from "./admin-core.js";

const message = document.querySelector("[data-dashboard-message]");
const content = document.querySelector("[data-dashboard-content]");
const adminEmail = document.querySelector("[data-admin-email]");
const sidebar = document.querySelector("[data-sidebar]");
const views = {
  menu_items: {
    title: "Menu",
    table: "menu_items",
    singular: "menu",
    imageFolder: "menu",
    fields: [
      { key: "name", label: "Nama menu", required: true, maxLength: 120 },
      { key: "category", label: "Kategori", type: "select", options: ["Espresso Based", "Manual Brew", "Non-Coffee", "Pastry", "Main Course"] },
      { key: "description", label: "Deskripsi", type: "textarea", maxLength: 2000 },
      { key: "price", label: "Harga (IDR)", type: "number", min: 0, step: "0.01", required: true },
      { key: "display_order", label: "Urutan tampil", type: "number", step: 1, default: 0 },
      { key: "is_available", label: "Tersedia untuk dipesan", type: "checkbox", default: true },
      { key: "is_published", label: "Tampilkan di website", type: "checkbox" },
      { key: "image_path", label: "Gambar menu", type: "file" },
    ],
    label: (row) => row.name,
    meta: (row) => `${row.category} · Rp ${Number(row.price).toLocaleString("id-ID")}`,
  },
  gallery_items: {
    title: "Galeri",
    table: "gallery_items",
    singular: "gambar galeri",
    imageFolder: "gallery",
    fields: [
      { key: "alt_text", label: "Teks alternatif", maxLength: 300 },
      { key: "category", label: "Kategori", default: "Atmosphere", maxLength: 80 },
      { key: "caption", label: "Keterangan", type: "textarea", maxLength: 300 },
      { key: "display_order", label: "Urutan tampil", type: "number", step: 1, default: 0 },
      { key: "is_published", label: "Tampilkan di website", type: "checkbox" },
      { key: "image_path", label: "Gambar (bisa pilih beberapa saat menambah)", type: "file", multiple: true, required: true },
    ],
    label: (row) => row.caption || row.alt_text || "Gambar galeri",
    meta: (row) => `${row.category} · urutan ${row.display_order}`,
  },
  promotions_events: {
    title: "Promo & Event",
    table: "promotions_events",
    singular: "promo/event",
    imageFolder: "promotions",
    fields: [
      { key: "kind", label: "Jenis konten", type: "select", options: ["promotion", "event"], optionLabels: ["Promosi", "Event"] },
      { key: "title", label: "Judul", required: true, maxLength: 160 },
      { key: "description", label: "Deskripsi", type: "textarea", maxLength: 3000 },
      { key: "starts_at", label: "Tanggal & waktu mulai", type: "datetime-local" },
      { key: "ends_at", label: "Tanggal & waktu selesai", type: "datetime-local" },
      { key: "start_time", label: "Jam mulai", type: "time" },
      { key: "end_time", label: "Jam selesai", type: "time" },
      { key: "cta_label", label: "Label tombol", maxLength: 80 },
      { key: "cta_url", label: "URL tombol", type: "url", maxLength: 2000 },
      { key: "display_order", label: "Urutan tampil", type: "number", step: 1, default: 0 },
      { key: "is_active", label: "Status aktif", type: "checkbox" },
      { key: "is_published", label: "Tampilkan di website", type: "checkbox" },
      { key: "image_path", label: "Gambar banner", type: "file" },
    ],
    label: (row) => row.title,
    meta: (row) => `${row.kind === "event" ? "Event" : "Promosi"} · ${row.is_active ? "Aktif" : "Tidak aktif"}`,
  },
  testimonials: {
    title: "Testimoni",
    table: "testimonials",
    singular: "testimoni",
    imageFolder: "testimonials",
    fields: [
      { key: "customer_name", label: "Nama pelanggan", required: true, maxLength: 120 },
      { key: "review", label: "Ulasan", type: "textarea", required: true, maxLength: 3000 },
      { key: "rating", label: "Rating (opsional)", type: "number", min: 1, max: 5, step: 1 },
      { key: "source", label: "Sumber ulasan", maxLength: 160 },
      { key: "review_date", label: "Tanggal ulasan", type: "date" },
      { key: "display_order", label: "Urutan tampil", type: "number", step: 1, default: 0 },
      { key: "is_published", label: "Tampilkan di website", type: "checkbox" },
      { key: "image_path", label: "Gambar (opsional)", type: "file" },
    ],
    label: (row) => row.customer_name,
    meta: (row) => `${row.rating ? `${row.rating}/5 · ` : ""}${row.source || "Tanpa sumber"}`,
  },
  store_settings: {
    title: "Informasi Toko",
    table: "store_settings",
    singleton: true,
    singular: "informasi toko",
    fields: [
      { key: "store_name", label: "Nama toko", maxLength: 160 },
      { key: "description", label: "Deskripsi", type: "textarea", maxLength: 3000 },
      { key: "address", label: "Alamat", type: "textarea", maxLength: 1000 },
      { key: "whatsapp_number", label: "Nomor WhatsApp (format internasional)", maxLength: 40 },
      { key: "email", label: "Email", type: "email", maxLength: 254 },
      { key: "opening_hours", label: "Jam operasional", type: "textarea", maxLength: 2000 },
      { key: "map_url", label: "Google Maps URL", type: "url", maxLength: 2000 },
      { key: "instagram_url", label: "Instagram URL", type: "url", maxLength: 2000 },
      { key: "facebook_url", label: "Facebook URL", type: "url", maxLength: 2000 },
      { key: "gofood_url", label: "GoFood URL", type: "url", maxLength: 2000 },
      { key: "grabfood_url", label: "GrabFood URL", type: "url", maxLength: 2000 },
      { key: "is_published", label: "Publikasikan informasi toko", type: "checkbox" },
    ],
    label: (row) => row.store_name || "Informasi toko",
    meta: () => "Data kontak dan operasional",
  },
  website_settings: {
    title: "Konten Website",
    table: "website_settings",
    singleton: true,
    singular: "pengaturan website",
    fields: [
      { key: "hero_eyebrow", label: "Hero: eyebrow", maxLength: 160 },
      { key: "hero_title", label: "Hero: judul", type: "textarea", maxLength: 240 },
      { key: "hero_description", label: "Hero: deskripsi", type: "textarea", maxLength: 1000 },
      { key: "about_title", label: "About: judul", maxLength: 240 },
      { key: "about_description", label: "About: deskripsi", type: "textarea", maxLength: 3000 },
      { key: "coffee_philosophy", label: "Filosofi kopi", type: "textarea", maxLength: 5000 },
      { key: "footer_description", label: "Deskripsi footer", type: "textarea", maxLength: 1000 },
      { key: "seo_title", label: "SEO: judul", maxLength: 160 },
      { key: "seo_description", label: "SEO: deskripsi", type: "textarea", maxLength: 320 },
      { key: "is_published", label: "Publikasikan konten website", type: "checkbox" },
    ],
    label: () => "Pengaturan konten",
    meta: () => "Hero, About, filosofi, footer, dan SEO",
  },
};

let client;
let currentUser;
let activeView = "overview";
let editingId = null;
let currentRows = [];

try {
  client = await getSupabaseClient();
  currentUser = await requireAdmin(client);
  if (currentUser) {
    adminEmail.textContent = currentUser.email || "";
    bindNavigation();
    await renderView("overview");
  }
} catch (error) {
  showMessage(message, `Dashboard gagal dimuat: ${formatError(error)}`);
  content.innerHTML = "";
}

document.querySelector("[data-logout]").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const { error } = await client.auth.signOut();
    if (error) {
      throw error;
    }
    window.location.replace("/admin/login");
  } catch (error) {
    showMessage(message, formatError(error));
    button.disabled = false;
  }
});

document.querySelector("[data-menu-toggle]").addEventListener("click", (event) => {
  setSidebarOpen(!sidebar.classList.contains("is-open"));
});

const mobileSidebar = window.matchMedia("(max-width: 760px)");
mobileSidebar.addEventListener("change", () => setSidebarOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    setSidebarOpen(false);
    document.querySelector("[data-menu-toggle]").focus();
  }
});
setSidebarOpen(false);

function setSidebarOpen(isOpen) {
  const shouldOpen = mobileSidebar.matches && isOpen;
  sidebar.classList.toggle("is-open", shouldOpen);
  sidebar.inert = mobileSidebar.matches && !shouldOpen;
  document.querySelector("[data-menu-toggle]").setAttribute("aria-expanded", String(shouldOpen));
}

function bindNavigation() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      setSidebarOpen(false);
      await renderView(button.dataset.view);
    });
  });
}

async function renderView(viewName) {
  try {
    await renderViewContent(viewName);
  } catch (error) {
    showMessage(message, formatError(error));
    content.innerHTML = "";
  }
}

async function renderViewContent(viewName) {
  activeView = viewName;
  editingId = null;
  message.hidden = true;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });

  if (viewName === "overview") {
    await renderOverview();
    return;
  }
  const config = views[viewName];
  if (!config) {
    throw new Error("Halaman dashboard tidak ditemukan.");
  }

  content.innerHTML = `
    <div class="admin-heading">
      <div><p>CONTENT MANAGEMENT</p><h1>${escapeHtml(config.title)}</h1></div>
      ${config.singleton ? "" : '<button class="admin-button admin-button--primary" type="button" data-create>Tambah baru</button>'}
    </div>
    <div class="admin-resource">
      <section class="admin-panel" aria-label="Daftar konten">
        <h2>Konten tersimpan</h2>
        <div class="admin-records" data-records><p class="admin-empty">Memuat data...</p></div>
      </section>
      <section class="admin-panel" aria-label="Formulir konten">
        <h2 data-form-title>${config.singleton ? "Edit informasi" : "Tambah konten"}</h2>
        <form class="admin-resource-form" data-resource-form></form>
      </section>
    </div>`;

  await loadRows();
  buildForm();
  if (config.singleton && currentRows.length) {
    editingId = currentRows[0].id;
    fillForm(currentRows[0]);
  }

  content.querySelector("[data-resource-form]").addEventListener("submit", saveRecord);
  content.querySelector("[data-create]")?.addEventListener("click", () => {
    editingId = null;
    buildForm();
    document.querySelector("[data-form-title]").textContent = `Tambah ${config.singular}`;
    content.querySelector("[data-resource-form]").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  content.querySelector("[data-records]").addEventListener("click", handleRecordAction);
}

async function loadRows() {
  const config = views[activeView];
  const { data, error } = await client
    .from(config.table)
    .select("*")
    .order(config.singleton ? "updated_at" : "display_order", { ascending: true })
    .limit(200);
  if (error) {
    throw error;
  }
  currentRows = data || [];
  renderRows(config);
}

async function renderRows(config) {
  const records = content.querySelector("[data-records]");
  if (!currentRows.length) {
    records.innerHTML = `<p class="admin-empty">Belum ada ${escapeHtml(config.singular)}. Data yang dibuat di sini akan tersimpan di Supabase.</p>`;
    return;
  }

  records.innerHTML = currentRows.map((row) => {
    const state = "is_published" in row ? (row.is_published ? "Dipublikasikan" : "Draft") : "";
    return `<article class="admin-record">
      <div>
        <div class="admin-record__title">${escapeHtml(config.label(row))}</div>
        <span class="admin-record__meta">${escapeHtml(config.meta(row))}</span>
      </div>
      <div class="admin-record__actions">
        ${state ? `<span class="admin-record__status">${state}</span>` : ""}
        ${config.imageFolder && row.image_path ? `<button class="admin-button admin-button--quiet" type="button" data-preview="${escapeHtml(row.id)}">Pratinjau</button>` : ""}
        ${config.singleton ? "" : `<button class="admin-button admin-button--quiet" type="button" data-edit="${escapeHtml(row.id)}">Edit</button><button class="admin-button admin-button--danger" type="button" data-delete="${escapeHtml(row.id)}">Hapus</button>`}
      </div>
    </article>`;
  }).join("");
}

function buildForm(row = {}) {
  const config = views[activeView];
  const form = content.querySelector("[data-resource-form]");
  revokeBlobPreviews(form);
  form.innerHTML = config.fields.map((field) => renderField(field, row[field.key])).join("");
  form.insertAdjacentHTML("beforeend", `
    ${config.imageFolder ? '<div class="admin-preview-list" data-image-previews hidden></div>' : ""}
    <div class="admin-form-actions">
      <button class="admin-button admin-button--primary" type="submit" data-save> ${editingId || config.singleton ? "Simpan perubahan" : "Simpan"} </button>
      ${editingId && !config.singleton ? '<button class="admin-button admin-button--quiet" type="button" data-cancel>Batal</button>' : ""}
    </div>`);
  form.querySelector("[data-cancel]")?.addEventListener("click", () => {
    editingId = null;
    document.querySelector("[data-form-title]").textContent = `Tambah ${config.singular}`;
    buildForm();
  });

  const fileInput = form.querySelector('input[type="file"]');
  fileInput?.addEventListener("change", () => {
    const previews = form.querySelector("[data-image-previews]");
    revokeBlobPreviews(previews);
    previews?.replaceChildren();
    const files = Array.from(fileInput.files || []);
    files.forEach((file) => {
      const image = document.createElement("img");
      image.className = "admin-preview";
      image.alt = `Pratinjau: ${file.name}`;
      image.src = URL.createObjectURL(file);
      previews?.append(image);
    });
    if (previews) {
      previews.hidden = files.length === 0;
    }
  });
}

function renderField(field, value) {
  const id = `field-${field.key}`;
  if (field.type === "checkbox") {
    const checked = value ?? field.default ?? false;
    return `<label class="admin-field admin-field--check" for="${id}">
      <input id="${id}" name="${field.key}" type="checkbox" ${checked ? "checked" : ""}>
      <span>${escapeHtml(field.label)}</span>
    </label>`;
  }
  if (field.type === "file") {
    return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
      <input id="${id}" name="${field.key}" type="file" accept="image/jpeg,image/png,image/webp,image/avif" ${field.multiple ? "multiple" : ""} ${field.required && !editingId ? "required" : ""}>
    </label>`;
  }
  if (field.type === "textarea") {
    return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
      <textarea id="${id}" name="${field.key}" ${field.required ? "required" : ""} ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}>${escapeHtml(value ?? field.default ?? "")}</textarea>
    </label>`;
  }
  if (field.type === "select") {
    const options = field.options.map((option, index) => {
      const optionLabel = field.optionLabels?.[index] || option;
      return `<option value="${escapeHtml(option)}" ${value === option ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`;
    }).join("");
    return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span><select id="${id}" name="${field.key}" required>${options}</select></label>`;
  }
  const inputValue = field.type === "datetime-local" && value
    ? new Date(value).toISOString().slice(0, 16)
    : value ?? field.default ?? "";
  const type = field.type || "text";
  return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
    <input id="${id}" name="${field.key}" type="${type}" value="${escapeHtml(inputValue)}" ${field.required ? "required" : ""} ${field.min !== undefined ? `min="${field.min}"` : ""} ${field.max !== undefined ? `max="${field.max}"` : ""} ${field.step ? `step="${field.step}"` : ""} ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}>
  </label>`;
}

function fillForm(row) {
  const config = views[activeView];
  const viewName = activeView;
  document.querySelector("[data-form-title]").textContent = `Edit ${config.singular}`;
  buildForm(row);
  if (config.imageFolder && row.image_path) {
    createImagePreview(client, row.image_path).then((url) => {
      if (activeView !== viewName || editingId !== row.id) return;
      const previews = content.querySelector("[data-image-previews]");
      if (previews) {
        const image = document.createElement("img");
        image.className = "admin-preview";
        image.alt = "Gambar tersimpan";
        image.src = url;
        previews.append(image);
        previews.hidden = false;
      }
    }).catch((error) => showMessage(message, `Gambar tidak dapat dimuat: ${formatError(error)}`));
  }
}

function revokeBlobPreviews(container) {
  container?.querySelectorAll('img[src^="blob:"]').forEach((image) => {
    URL.revokeObjectURL(image.src);
  });
}

async function saveRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("[data-save]");
  button.disabled = true;
  message.hidden = true;
  const config = views[activeView];
  const formData = new FormData(form);
  const existing = currentRows.find((row) => row.id === editingId);
  let cleanupWarning = "";

  try {
    const values = {};
    for (const field of config.fields) {
      if (field.type === "file") continue;
      if (field.type === "checkbox") {
        values[field.key] = form.elements[field.key].checked;
      } else {
        const raw = String(formData.get(field.key) ?? "").trim();
        if (["price", "display_order", "rating"].includes(field.key)) {
          values[field.key] = raw === ""
            ? (field.key === "display_order" ? (field.default ?? 0) : null)
            : Number(raw);
        } else if (field.key === "starts_at" || field.key === "ends_at") {
          values[field.key] = raw ? new Date(raw).toISOString() : null;
        } else {
          values[field.key] = [
            "rating",
            "review_date",
            "starts_at",
            "ends_at",
            "start_time",
            "end_time",
            "cta_url",
          ].includes(field.key) ? (raw || null) : raw;
        }
      }
    }

    validateLinks(values, config.fields);
    if (config.singleton) {
      values.id = true;
      const { error } = await client.from(config.table).upsert(values, { onConflict: "id" });
      if (error) throw error;
      await renderView(activeView);
      showMessage(message, "Informasi berhasil disimpan.", "success");
      return;
    }

    const id = editingId || crypto.randomUUID();
    const fileInput = form.querySelector('input[type="file"]');
    const files = Array.from(fileInput?.files || []);
    const previousImage = existing?.image_path || null;
    if (files.length > 1 && activeView !== "gallery_items") {
      throw new Error("Pilih satu gambar untuk konten ini.");
    }

    if (activeView === "gallery_items" && files.length > 1 && !editingId) {
      const uploaded = [];
      const insertedIds = [];
      try {
        for (const [index, file] of files.entries()) {
          const itemId = crypto.randomUUID();
          const imagePath = await uploadImage(client, file, config.imageFolder, itemId);
          uploaded.push(imagePath);
          const row = {
            ...values,
            id: itemId,
            image_path: imagePath,
            alt_text: values.alt_text || file.name.replace(/\.[^.]+$/, ""),
            display_order: Number(values.display_order || 0) + index,
          };
          const { error } = await client.from(config.table).insert(row);
          if (error) throw error;
          insertedIds.push(itemId);
        }
      } catch (error) {
        const rollback = await Promise.allSettled([
          insertedIds.length
            ? client.from(config.table).delete().in("id", insertedIds)
            : Promise.resolve({ error: null }),
          ...uploaded.map((path) => removeImage(client, path)),
        ]);
        const rollbackFailure = rollback.find((result) =>
          result.status === "rejected" || result.value?.error);
        if (rollbackFailure) {
          throw new Error(`${formatError(error)} Sebagian pembersihan gagal; periksa data galeri dan Storage.`);
        }
        throw error;
      }
    } else {
      const file = files[0];
      let newImage = null;
      if (file) {
        newImage = await uploadImage(client, file, config.imageFolder, id);
        values.image_path = newImage;
      } else if (config.imageFolder && activeView === "gallery_items" && !existing?.image_path) {
        throw new Error("Pilih gambar sebelum menyimpan item galeri.");
      }
      values.id = id;

      const operation = editingId
        ? client.from(config.table).update(values).eq("id", editingId)
        : client.from(config.table).insert(values);
      const { error } = await operation;
      if (error) {
        if (newImage) {
          try {
            await removeImage(client, newImage);
          } catch (cleanupError) {
            throw new Error(`${formatError(error)} File gambar baru tidak dapat dibersihkan: ${formatError(cleanupError)}`);
          }
        }
        throw error;
      }
      if (newImage && previousImage) {
        try {
          await removeImage(client, previousImage);
        } catch (error) {
          cleanupWarning = `Perubahan tersimpan, tetapi gambar lama gagal dihapus: ${formatError(error)}`;
        }
      }
    }

    await renderView(activeView);
    showMessage(
      message,
      cleanupWarning || `${config.title} berhasil disimpan.`,
      cleanupWarning ? "error" : "success",
    );
  } catch (error) {
    showMessage(message, formatError(error));
  } finally {
    button.disabled = false;
  }
}

function validateLinks(values, fields) {
  for (const field of fields) {
    if (field.type !== "url" || !values[field.key]) continue;
    let url;
    try {
      url = new URL(values[field.key]);
    } catch {
      throw new Error(`${field.label}: masukkan URL yang valid.`);
    }
    if (url.protocol !== "https:") {
      throw new Error(`${field.label}: gunakan URL HTTPS.`);
    }
  }
}

async function handleRecordAction(event) {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  const previewButton = event.target.closest("[data-preview]");
  const config = views[activeView];

  if (editButton) {
    editingId = editButton.dataset.edit;
    const row = currentRows.find((item) => item.id === editingId);
    if (row) fillForm(row);
    return;
  }
  if (previewButton) {
    const row = currentRows.find((item) => item.id === previewButton.dataset.preview);
    if (row?.image_path) {
      const previewWindow = window.open("about:blank", "_blank");
      if (!previewWindow) {
        showMessage(message, "Izinkan pop-up untuk membuka pratinjau gambar.");
        return;
      }
      previewWindow.opener = null;
      try {
        const url = await createImagePreview(client, row.image_path);
        previewWindow.location.href = url;
      } catch (error) {
        previewWindow.close();
        showMessage(message, formatError(error));
      }
    }
    return;
  }
  if (!deleteButton) return;

  const row = currentRows.find((item) => item.id === deleteButton.dataset.delete);
  if (!row || !window.confirm(`Hapus "${config.label(row)}"? Tindakan ini tidak dapat dibatalkan.`)) return;
  deleteButton.disabled = true;
  try {
    const { error } = await client.from(config.table).delete().eq("id", row.id);
    if (error) throw error;
    if (row.image_path) {
      try {
        await removeImage(client, row.image_path);
      } catch (error) {
        showMessage(message, `${config.singular} sudah dihapus, tetapi file gambarnya gagal dihapus: ${formatError(error)}`);
        await renderView(activeView);
        showMessage(message, `${config.singular} sudah dihapus, tetapi file gambarnya gagal dihapus: ${formatError(error)}`);
        return;
      }
    }
    await renderView(activeView);
    showMessage(message, `${config.singular} berhasil dihapus.`, "success");
  } catch (error) {
    showMessage(message, formatError(error));
    deleteButton.disabled = false;
  }
}

async function renderOverview() {
  content.innerHTML = `
    <div class="admin-heading"><div><p>NAWASENA COFFEE</p><h1>Ringkasan</h1></div></div>
    <div class="admin-stats" data-stats><div class="admin-stat">Memuat data…</div></div>
    <div class="admin-overview-grid">
      <section class="admin-panel"><h2>Aktivitas terbaru</h2><ul class="admin-activity" data-activity><li>Memuat aktivitas…</li></ul></section>
      <section class="admin-panel"><h2>Akses cepat</h2><div class="admin-quick-actions">
        <button class="admin-button admin-button--quiet" type="button" data-quick="menu_items">Kelola menu</button>
        <button class="admin-button admin-button--quiet" type="button" data-quick="gallery_items">Kelola galeri</button>
        <button class="admin-button admin-button--quiet" type="button" data-quick="store_settings">Ubah informasi toko</button>
      </div></section>
    </div>`;

  const countQueries = Object.entries(views)
    .filter(([, config]) => !config.singleton)
    .map(async ([name, config]) => {
      const { count, error } = await client.from(config.table).select("id", { count: "exact", head: true });
      if (error) throw error;
      return [name, count || 0];
    });
  const activityQuery = client
    .from("content_activity")
    .select("action, entity_type, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const [counts, activityResult] = await Promise.all([Promise.all(countQueries), activityQuery]);
  if (activityResult.error) throw activityResult.error;
  const countMap = Object.fromEntries(counts);
  content.querySelector("[data-stats]").innerHTML = [
    ["Menu", countMap.menu_items],
    ["Galeri", countMap.gallery_items],
    ["Promo & event", countMap.promotions_events],
    ["Testimoni", countMap.testimonials],
  ].map(([label, count]) => `<article class="admin-stat"><span class="admin-stat__label">${label}</span><strong class="admin-stat__value">${count}</strong></article>`).join("");

  const activity = activityResult.data || [];
  content.querySelector("[data-activity]").innerHTML = activity.length
    ? activity.map((item) => `<li><strong>${escapeHtml(item.summary)}</strong><span>${new Date(item.created_at).toLocaleString("id-ID")}</span></li>`).join("")
    : "<li><span>Belum ada aktivitas tercatat.</span></li>";
  content.querySelectorAll("[data-quick]").forEach((button) => {
    button.addEventListener("click", () => renderView(button.dataset.quick));
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}
