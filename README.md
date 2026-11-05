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

## Admin dashboard

The simple admin dashboard lets an authorized user manage menu items and gallery photos.
It uses Supabase Auth, Database, and Storage directly from the browser; it does not need
Vercel environment variables or serverless functions. See
[docs/ADMIN-SETUP.md](docs/ADMIN-SETUP.md) for the one-time setup. Never put a Supabase
service-role or secret key in frontend code.