import {
  createImagePreview,
  formatError,
  getSupabaseClient,
  removeImage,
  requireAdmin,
  showMessage,
  uploadImage,
} from "./admin-core.js";

const tables = {
  menu_items: {
    title: "Menu",
    singular: "menu",
    folder: "menu",
    fields: [
      { key: "name", label: "Nama menu", required: true, maxLength: 120 },
      {
        key: "category",
        label: "Kategori",
        type: "select",
        options: ["Espresso Based", "Manual Brew", "Non-Coffee", "Pastry", "Main Course"],
      },
      { key: "description", label: "Deskripsi", type: "textarea", maxLength: 2000 },
      { key: "price", label: "Harga (Rupiah)", type: "number", min: 0, step: 1, required: true },
      { key: "is_available", label: "Tersedia", type: "checkbox", default: true },
      { key: "is_published", label: "Tampilkan di website", type: "checkbox" },
      { key: "image_path", label: "Foto menu", type: "file" },
    ],
    label: (row) => row.name,
    detail: (row) => `${row.category} · Rp ${Number(row.price).toLocaleString("id-ID")}`,
  },
  gallery_items: {
    title: "Galeri",
    singular: "foto galeri",
    folder: "gallery",
    fields: [
      { key: "caption", label: "Deskripsi singkat", type: "textarea", maxLength: 300 },
      { key: "alt_text", label: "Teks alternatif gambar", maxLength: 300 },
      { key: "is_published", label: "Tampilkan di website", type: "checkbox" },
      { key: "image_path", label: "Pilih foto", type: "file", required: true },
    ],
    label: (row) => row.caption || row.alt_text || "Foto galeri",
    detail: (row) => row.is_published ? "Tampil di website" : "Draft",
  },
};

const message = document.querySelector("[data-dashboard-message]");
const content = document.querySelector("[data-dashboard-content]");
const sidebar = document.querySelector("[data-sidebar]");
const menuToggle = document.querySelector("[data-menu-toggle]");
let client;
let currentTable = "menu_items";
let currentRows = [];
let editingId = null;

try {
  client = await getSupabaseClient();
  const user = await requireAdmin(client);
  if (!user) {
    throw new Error("Sesi login admin tidak ditemukan.");
  }
  document.querySelector("[data-admin-email]").textContent = user.email || "";
  bindNavigation();
  await renderTable(currentTable);
} catch (error) {
  showMessage(message, formatError(error));
  content.innerHTML = "";
}

document.querySelector("[data-logout]").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    window.location.replace("/admin/login");
  } catch (error) {
    showMessage(message, formatError(error));
    button.disabled = false;
  }
});

menuToggle.addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("is-open")));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    setSidebarOpen(false);
    menuToggle.focus();
  }
});
window.matchMedia("(min-width: 761px)").addEventListener("change", () => setSidebarOpen(false));
setSidebarOpen(false);

function setSidebarOpen(open) {
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  sidebar.classList.toggle("is-open", isMobile && open);
  sidebar.inert = isMobile && !open;
  menuToggle.setAttribute("aria-expanded", String(isMobile && open));
}

function bindNavigation() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      setSidebarOpen(false);
      currentTable = button.dataset.view;
      editingId = null;
      await renderTable(currentTable);
    });
  });
}

async function renderTable(tableName) {
  const config = tables[tableName];
  if (!config) return;
  message.hidden = true;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === tableName);
  });
  content.innerHTML = `
    <div class="admin-heading">
      <div><p>KELOLA KONTEN</p><h1>${escapeHtml(config.title)}</h1></div>
      <button class="admin-button admin-button--primary" type="button" data-create>Tambah ${escapeHtml(config.singular)}</button>
    </div>
    <div class="admin-resource">
      <section class="admin-panel">
        <h2>Daftar ${escapeHtml(config.title.toLowerCase())}</h2>
        <div class="admin-records" data-records><p class="admin-empty">Memuat data...</p></div>
      </section>
      <section class="admin-panel">
        <h2 data-form-title>Tambah ${escapeHtml(config.singular)}</h2>
        <form class="admin-resource-form" data-record-form></form>
      </section>
    </div>`;

  try {
    const { data, error } = await client.from(tableName).select("*").order("display_order").limit(200);
    if (error) throw error;
    currentRows = data || [];
    renderRows(config);
    buildForm(config);
  } catch (error) {
    showMessage(message, formatError(error));
    return;
  }

  content.querySelector("[data-create]").addEventListener("click", () => {
    editingId = null;
    document.querySelector("[data-form-title]").textContent = `Tambah ${config.singular}`;
    buildForm(config);
  });
  content.querySelector("[data-record-form]").addEventListener("submit", saveRecord);
  content.querySelector("[data-records]").addEventListener("click", handleRecordAction);
}

function renderRows(config) {
  const records = content.querySelector("[data-records]");
  if (!currentRows.length) {
    records.innerHTML = `<p class="admin-empty">Belum ada data. Pilih “Tambah ${escapeHtml(config.singular)}” untuk mulai.</p>`;
    return;
  }

  records.innerHTML = currentRows.map((row) => `
    <article class="admin-record">
      <div>
        ${row.image_path
          ? `<img class="admin-record__image" src="${escapeHtml(createImagePreview(client, row.image_path))}" alt="">`
          : ""}
        <div class="admin-record__title">${escapeHtml(config.label(row))}</div>
        <span class="admin-record__meta">${escapeHtml(config.detail(row))}</span>
      </div>
      <div class="admin-record__actions">
        <button class="admin-button admin-button--quiet" type="button" data-edit="${escapeHtml(row.id)}">Edit</button>
        <button class="admin-button admin-button--danger" type="button" data-delete="${escapeHtml(row.id)}">Hapus</button>
      </div>
    </article>`).join("");
}

function buildForm(config, row = {}) {
  const form = content.querySelector("[data-record-form]");
  if (!form) return;
  form.innerHTML = config.fields.map((field) => renderField(field, row[field.key])).join("");
  form.insertAdjacentHTML("beforeend", `
    <div class="admin-preview-list" data-preview-list hidden></div>
    <div class="admin-form-actions">
      <button class="admin-button admin-button--primary" type="submit" data-save>Simpan</button>
      ${editingId ? '<button class="admin-button admin-button--quiet" type="button" data-cancel>Batal</button>' : ""}
    </div>`);

  form.querySelector("[data-cancel]")?.addEventListener("click", () => {
    editingId = null;
    document.querySelector("[data-form-title]").textContent = `Tambah ${config.singular}`;
    buildForm(config);
  });

  form.querySelector('input[type="file"]')?.addEventListener("change", (event) => {
    const previews = form.querySelector("[data-preview-list]");
    previews.replaceChildren();
    for (const file of event.currentTarget.files) {
      const image = document.createElement("img");
      image.className = "admin-preview";
      image.alt = `Pratinjau ${file.name}`;
      image.src = URL.createObjectURL(file);
      previews.append(image);
    }
    previews.hidden = previews.childElementCount === 0;
  });
}

function renderField(field, value) {
  const id = `field-${field.key}`;
  if (field.type === "checkbox") {
    return `<label class="admin-field admin-field--check" for="${id}">
      <input id="${id}" name="${field.key}" type="checkbox" ${(value ?? field.default ?? false) ? "checked" : ""}>
      <span>${escapeHtml(field.label)}</span>
    </label>`;
  }
  if (field.type === "file") {
    return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
      <input id="${id}" name="${field.key}" type="file" accept="image/jpeg,image/png,image/webp,image/avif" ${field.required && !editingId ? "required" : ""}>
    </label>`;
  }
  if (field.type === "textarea") {
    return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
      <textarea id="${id}" name="${field.key}" maxlength="${field.maxLength || 2000}" ${field.required ? "required" : ""}>${escapeHtml(value || "")}</textarea>
    </label>`;
  }
  if (field.type === "select") {
    return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
      <select id="${id}" name="${field.key}">${field.options.map((option) => `<option ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>
    </label>`;
  }
  return `<label class="admin-field" for="${id}"><span>${escapeHtml(field.label)}</span>
    <input id="${id}" name="${field.key}" type="${field.type || "text"}" value="${escapeHtml(value ?? field.default ?? "")}" ${field.required ? "required" : ""} ${field.min !== undefined ? `min="${field.min}"` : ""} ${field.step ? `step="${field.step}"` : ""} maxlength="${field.maxLength || ""}">
  </label>`;
}

async function saveRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("[data-save]");
  button.disabled = true;
  message.hidden = true;
  const config = tables[currentTable];
  const existing = currentRows.find((row) => row.id === editingId);
  const values = {};

  try {
    for (const field of config.fields) {
      if (field.type === "file") continue;
      if (field.type === "checkbox") {
        values[field.key] = form.elements[field.key].checked;
      } else {
        const value = new FormData(form).get(field.key)?.toString().trim() || "";
        values[field.key] = field.type === "number" ? Number(value) : value;
      }
    }

    const id = editingId || crypto.randomUUID();
    const file = form.querySelector('input[type="file"]').files[0];
    let uploadedPath = null;
    if (file) {
      uploadedPath = await uploadImage(client, file, config.folder, id);
      values.image_path = uploadedPath;
    } else if (config.folder === "gallery" && !existing?.image_path) {
      throw new Error("Pilih foto galeri sebelum menyimpan.");
    }
    if (currentTable === "gallery_items") values.display_order ??= currentRows.length;
    values.id = id;

    const query = editingId
      ? client.from(currentTable).update(values).eq("id", editingId)
      : client.from(currentTable).insert(values);
    const { error } = await query;
    if (error) {
      if (uploadedPath) await removeImage(client, uploadedPath);
      throw error;
    }
    if (uploadedPath && existing?.image_path) await removeImage(client, existing.image_path);
    editingId = null;
    await renderTable(currentTable);
    showMessage(message, "Berhasil disimpan.", "success");
  } catch (error) {
    showMessage(message, formatError(error));
    button.disabled = false;
  }
}

async function handleRecordAction(event) {
  const edit = event.target.closest("[data-edit]");
  const remove = event.target.closest("[data-delete]");
  if (edit) {
    editingId = edit.dataset.edit;
    const row = currentRows.find((item) => item.id === editingId);
    const config = tables[currentTable];
    document.querySelector("[data-form-title]").textContent = `Edit ${config.singular}`;
    buildForm(config, row);
    if (row.image_path) {
      const url = await createImagePreview(client, row.image_path);
      const image = document.createElement("img");
      image.className = "admin-preview";
      image.alt = "Foto tersimpan";
      image.src = url;
      const previews = content.querySelector("[data-preview-list]");
      previews.append(image);
      previews.hidden = false;
    }
    return;
  }

  if (!remove) return;
  const row = currentRows.find((item) => item.id === remove.dataset.delete);
  const config = tables[currentTable];
  if (!row || !window.confirm(`Hapus "${config.label(row)}"?`)) return;
  remove.disabled = true;
  try {
    const { error } = await client.from(currentTable).delete().eq("id", row.id);
    if (error) throw error;
    if (row.image_path) await removeImage(client, row.image_path);
    await renderTable(currentTable);
    showMessage(message, "Data berhasil dihapus.", "success");
  } catch (error) {
    showMessage(message, formatError(error));
    remove.disabled = false;
  }
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
