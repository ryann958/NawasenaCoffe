# Nawasena Coffee

Static website built with HTML, CSS, and vanilla JavaScript ES modules. The current
page includes the hero, brand story, menu, gallery, contact, and footer sections.
Menu and gallery content, as well as business contact details, stay empty until
verified information and approved assets are provided.

## Local development

ES modules require the page to be served over HTTP rather than opened directly
with `file://`. From the project root, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. This serves static files only; the project has
no application backend or build step.

## Admin dashboard deployment

The admin dashboard is hosted with the site on Vercel and uses Supabase for
authentication, data, and image storage. See [docs/ADMIN-SETUP.md](docs/ADMIN-SETUP.md)
for Supabase setup, required Vercel environment variables, and secure admin provisioning.
Do not commit `.env` files or Supabase service-role keys.