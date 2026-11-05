# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# NAWASENA COFFEE WEBSITE

**Project:** Nawasena Coffee  
**Developer / Agency:** TemanWeb  
**Version:** 1.2  
**Status:** Product Specification  
**Date:** 6 November 2026

---

# 1. PROJECT OVERVIEW

Nawasena Coffee merupakan website branding, company profile, dan marketing untuk sebuah coffee shop dengan konsep casual modern.

Website bertujuan memperkenalkan identitas bisnis, menampilkan menu, membangun kepercayaan pengunjung, mempromosikan aktivitas coffee shop, serta mempermudah pelanggan melakukan pemesanan dan reservasi.

Desain mengambil inspirasi dari referensi visual yang diberikan dengan karakteristik:

- Dark modern coffee aesthetic.
- Elegant espresso and brown color palette.
- Classic editorial serif typography.
- Cinematic coffee photography.
- Dynamic hero composition.
- Interactive storytelling.
- Modern responsive layout.
- Smooth and subtle animations.

Website harus terlihat high-end secara visual tetapi tetap mempertahankan karakter casual dan ramah.

# 2. PROJECT OBJECTIVES

1. Membangun identitas digital Nawasena Coffee.
2. Memperkenalkan produk dan menu unggulan.
3. Menampilkan cerita dan filosofi brand.
4. Mempromosikan event dan promo.
5. Mempermudah pelanggan menghubungi bisnis.
6. Menyediakan fasilitas reservasi meja melalui WhatsApp.
7. Menampilkan lokasi dan informasi operasional.
8. Meningkatkan kepercayaan melalui testimoni dan social proof.
9. Menghasilkan website profesional untuk portofolio TemanWeb.

# 3. TARGET AUDIENCE

- Anak muda dan mahasiswa.
- Pekerja dan profesional.
- Pengunjung coffee shop.
- Pelanggan yang mencari tempat nongkrong.
- Pengguna Instagram.
- Pengunjung lokal dan wisatawan.

Mobile merupakan prioritas utama karena website diperkirakan banyak diakses melalui smartphone.

# 4. BRAND IDENTITY & DESIGN SYSTEM

## 4.1 Design Direction

**Dark Modern Coffee — Casual Luxury**

Menggabungkan suasana coffee shop casual dengan presentasi visual premium.

Referensi visual menjadi panduan atmosfer dan komposisi, bukan untuk menyalin desain, brand, atau aset milik pihak lain.

## 4.2 Color Palette

| Token | HEX | Usage |
|---|---|---|
| Espresso Black | #171311 | Main background |
| Dark Brown | #261B16 | Navigation |
| Coffee Brown | #35251D | Cards |
| Caramel | #C58A52 | Accent |
| Warm Cream | #F3E5D2 | Primary text |
| Muted Beige | #B9A797 | Secondary text |
| Border Brown | #594437 | Borders |

## 4.3 Typography

Heading:
- Playfair Display.

Body:
- DM Sans.

Alternative:
- Cormorant Garamond.
- Inter.

## 4.4 Visual Principles

- Dark background.
- Warm amber lighting.
- High-quality coffee photography.
- Layered visual composition.
- Large editorial typography.
- Rounded UI components.
- Subtle animations.
- Consistent spacing.
- High readability.

# 5. WEBSITE INFORMATION ARCHITECTURE

Website menggunakan single-page landing page dengan section berikut:

1. Navigation Header.
2. Hero Section.
3. Brand Highlights.
4. About / Our Story.
5. Coffee Philosophy / Interactive Story.
6. Digital Menu.
7. Event & Promotion.
8. Gallery & Moodboard.
9. Customer Testimonials.
10. Location & Opening Hours.
11. Table Reservation.
12. Contact & Social Media.
13. Footer.

# 6. CORE FUNCTIONAL REQUIREMENTS

## 6.1 Navigation Header

Komponen:
- Nawasena Coffee logo / wordmark.
- Home.
- About.
- Menu.
- Gallery.
- Events.
- Contact.
- Order Now CTA.

Requirements:
- Sticky navigation.
- Smooth scrolling.
- Responsive mobile navigation.
- Hamburger menu.
- Active section indication.
- Optional language switcher.

## 6.2 Hero Section — Dynamic Visual Experience

Hero menjadi elemen visual paling menonjol pada website.

Content:
- Main headline.
- Supporting description.
- Primary CTA.
- Secondary CTA.
- Large coffee photography.
- Decorative coffee elements.

Contoh headline:

"GOOD COFFEE. GOOD MOMENTS."

Supporting copy:

"A little place to enjoy good coffee, share stories, and create memorable moments."

Visual effects:
- Floating coffee beans.
- Coffee splash visual.
- Layered image composition.
- Subtle parallax scrolling.
- Smooth entrance animation.
- Text reveal animation.

Technical requirements:
- Gunakan CSS animation untuk efek sederhana.
- Gunakan JavaScript hanya jika diperlukan.
- Hindari animasi yang membebani CPU.
- Gunakan transform dan opacity untuk animasi.
- Hormati prefers-reduced-motion.
- Jangan menghalangi interaksi pengguna.

Visual effects tidak boleh mengorbankan kecepatan website.

## 6.3 Brand Highlights

Menampilkan keunggulan atau karakter coffee shop.

Contoh:
- Quality Coffee.
- Cozy Atmosphere.
- Made With Passion.
- Great Moments.

Semua klaim harus berdasarkan informasi yang dikonfirmasi pemilik bisnis.

## 6.4 About Us — Brand Storytelling

Menjelaskan identitas Nawasena Coffee.

Content:
- Brand introduction.
- Coffee shop concept.
- Brand philosophy.
- Coffee experience.
- Interior and atmosphere photography.

Layout:
- Editorial layout.
- Combination of photography and typography.
- Asymmetric composition.
- Subtle reveal animation.

## 6.5 Interactive Coffee Philosophy

Section khusus untuk menceritakan proses dan filosofi kopi.

Contoh topik:
- Coffee bean origins.
- Coffee selection.
- Roasting process.
- Barista craftsmanship.
- Brewing techniques.

Visual presentation:
- Scroll-based storytelling.
- Image transitions.
- Interactive content blocks.
- Subtle motion effects.

Contoh highlight yang dapat digunakan apabila sesuai fakta:
- Direct Trade Origins.
- Q-Grader Baristas.
- Selected Coffee Beans.

Jangan menggunakan klaim tersebut sebelum dikonfirmasi pemilik coffee shop.

## 6.6 Digital Menu System

Digital menu merupakan salah satu fitur utama website.

Kategori:

1. Espresso Based.
2. Manual Brew.
3. Non-Coffee.
4. Pastry.
5. Main Course.

Setiap produk memiliki:
- Product name.
- Product image.
- Description.
- Price.
- Category.

Functional requirements:
- Category filter tabs.
- Dynamic menu rendering.
- Responsive product cards.
- Smooth category switching.
- Centralized menu data.
- Easy product updates.

Harga dan detail produk harus berasal dari pemilik bisnis.

## 6.7 Event & Promotion Showcase

Section untuk menampilkan aktivitas coffee shop.

Contoh:
- Live Music.
- Art Exhibition.
- Community Gathering.
- Watch Party.
- Monthly Promotion.
- Seasonal Menu.

Setiap event dapat memiliki:
- Event title.
- Event image.
- Description.
- Event date.
- Event time.
- CTA.
- Optional registration link.

Event yang sudah selesai tidak boleh ditampilkan sebagai event mendatang.

Promo harus memiliki informasi periode berlaku.

## 6.8 Gallery & Moodboard

Gallery menampilkan visual coffee shop.

Content:
- Coffee photography.
- Interior.
- Lifestyle.
- Barista activities.
- Customer atmosphere.
- Events.

Layout:
- Responsive grid.
- Optional masonry layout.
- Consistent image treatment.

Interactive features:
- Image hover effects.
- Click-to-expand.
- Lightbox.
- Previous / next navigation.
- Close button.
- Keyboard escape support.
- Mobile swipe support jika memungkinkan.

Gunakan gambar WebP atau AVIF yang telah dioptimalkan.

## 6.9 Customer Testimonials & Press Mention

Section untuk membangun kepercayaan pelanggan.

Customer testimonials:
- Customer review.
- Customer name atau display name yang disetujui.
- Review text.
- Optional rating.
- Optional source link.

Press mention:
- Media name.
- Publication logo jika memiliki izin.
- Article title.
- External article link.

Contoh referensi visual:
"Featured In"

Persyaratan:
- Hanya menggunakan ulasan asli.
- Tidak boleh membuat testimoni palsu.
- Tidak boleh mengklaim pernah diliput media tanpa bukti.
- Logo media hanya digunakan dengan memperhatikan hak penggunaan.

Jika belum memiliki testimoni atau press mention, section dapat disembunyikan sampai kontennya tersedia.

## 6.10 Location & Opening Hours

Content:
- Full address.
- Google Maps embed.
- Get Directions.
- Opening hours.
- Open and closed days.

Requirements:
- Interactive Google Maps.
- External directions link.
- Responsive layout.
- Map fallback link.
- Lazy loading untuk map embed jika memungkinkan.

Lokasi harus berasal dari pemilik bisnis.

## 6.11 Table Reservation System

Fitur reservasi meja melalui website.

Form fields:

1. Customer name.
2. WhatsApp number.
3. Reservation date.
4. Reservation time.
5. Number of guests.
6. Seating area.

Seating options:
- Indoor.
- Outdoor.
- No preference.

Additional field:
- Special request.

Submission flow:

1. Pengunjung mengisi form reservasi.
2. Website melakukan validasi input.
3. Website membuat pesan reservasi otomatis.
4. Pengunjung diarahkan ke WhatsApp admin.
5. Admin menerima detail reservasi.
6. Admin mengonfirmasi ketersediaan meja secara manual.

Persyaratan:
- Date picker tidak mengizinkan tanggal lampau.
- Input jumlah orang harus valid.
- Semua field penting harus divalidasi.
- Pesan WhatsApp menggunakan URL encoding.
- Nomor admin disimpan dalam konfigurasi terpusat.

Important limitation:

Versi pertama tidak menyediakan real-time table availability, automatic booking confirmation, atau reservation dashboard.

Reservasi baru dianggap terkonfirmasi setelah mendapatkan persetujuan admin.

## 6.12 Direct WhatsApp Integration

Sediakan beberapa CTA:

- Order via WhatsApp.
- Reserve a Table.
- Event & Collaboration Inquiry.

Setiap CTA menggunakan pesan otomatis sesuai tujuan.

Nomor WhatsApp harus dapat diubah melalui konfigurasi.

## 6.13 Social Media & Delivery Integration

Instagram:
- Official profile link.
- Gallery preview.
- Follow Us CTA.

Delivery:
- GoFood.
- GrabFood.

Persyaratan:
- Gunakan merchant URL resmi.
- Jangan tampilkan platform yang belum digunakan bisnis.
- Link harus dapat diubah melalui konfigurasi.

Instagram API tidak diwajibkan untuk versi pertama.

## 6.14 Multi-Language Support (Optional)

Bahasa yang direncanakan:
- Bahasa Indonesia.
- English.

Requirements:
- Language switcher.
- Centralized translation data.
- Semua teks utama dapat diterjemahkan.
- Menu, CTA, dan informasi bisnis konsisten.
- Preferensi bahasa dapat dipertahankan selama sesi pengguna.

Status: Optional feature, dapat dikerjakan setelah fitur utama selesai.

## 6.15 Footer

Content:
- Brand logo.
- Short description.
- Navigation.
- Instagram.
- WhatsApp.
- Address.
- Copyright.

# 7. NON-FUNCTIONAL REQUIREMENTS

## 7.1 Performance

- Optimasi gambar.
- Gunakan WebP atau AVIF.
- Lazy loading.
- Minimal JavaScript dependencies.
- Hindari animasi berat.
- Gunakan font loading yang efisien.
- Hindari layout shift.
- Google Maps dimuat secara efisien.

Target Lighthouse awal:
- Performance: 85+.
- Accessibility: 90+.
- Best Practices: 90+.
- SEO: 90+.

Target tersebut merupakan sasaran pengujian, bukan jaminan hasil.

## 7.2 Responsive Design

Mobile: 360px–639px.  
Tablet: 640px–1023px.  
Desktop: 1024px ke atas.

Mobile requirements:
- Mobile-first layout.
- Responsive typography.
- Touch-friendly navigation.
- Easy-to-read menu.
- Accessible CTA.
- Optimized image dimensions.
- No horizontal overflow.
- Smooth interactions.

## 7.3 Accessibility

- Semantic HTML.
- Alt text.
- Keyboard navigation.
- Visible focus states.
- Sufficient contrast.
- Reduced motion support.
- Accessible form labels.
- Accessible lightbox controls.

## 7.4 SEO

- Page title.
- Meta description.
- Open Graph metadata.
- Semantic heading hierarchy.
- Image alt text.
- Local business structured data jika informasi resmi tersedia.

# 8. TECHNICAL REQUIREMENTS

Recommended stack:
- HTML5.
- CSS3.
- JavaScript.
- Google Fonts.

Tidak memerlukan backend untuk versi pertama.

Integrasi utama:
- WhatsApp URL.
- Google Maps.
- Instagram.
- GoFood.
- GrabFood.

Data disimpan dalam file konfigurasi terpisah.

Jika project telah menggunakan framework, pertahankan stack yang tersedia.

# 9. PROJECT STRUCTURE REQUIREMENTS

```text
NawasenaCoffee/
│
├── index.html
│
├── docs/
│   └── PRD.md
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── menu/
│   │   ├── gallery/
│   │   ├── about/
│   │   └── events/
│   │
│   └── icons/
│
├── css/
│   ├── styles.css
│   └── responsive.css
│
└── js/
    ├── config.js
    ├── menu-data.js
    ├── event-data.js
    ├── translation-data.js
    └── main.js
```

Struktur ini merupakan target organisasi file dan dapat disesuaikan dengan teknologi yang dipilih.

# 10. CONTENT REQUIREMENTS

Data yang harus dikumpulkan dari pemilik bisnis:

- Brand logo.
- Official brand name.
- Brand story.
- Coffee philosophy.
- Coffee bean information.
- Menu and prices.
- Product photography.
- Interior photography.
- Event information.
- Promotion details.
- Customer reviews.
- Press mentions.
- Address.
- Opening hours.
- WhatsApp number.
- Instagram URL.
- GoFood merchant URL.
- GrabFood merchant URL.

Jangan mengarang informasi bisnis atau menggunakan konten placeholder sebagai fakta.

# 11. ACCEPTANCE CRITERIA

Website dinyatakan memenuhi spesifikasi apabila:

1. Dark modern coffee visual berhasil diterapkan.
2. Hero memiliki visual dinamis yang ringan.
3. Navigation berfungsi.
4. About section tersedia.
5. Coffee philosophy section tersedia.
6. Digital menu memiliki lima kategori.
7. Menu memiliki foto, nama, deskripsi, dan harga.
8. Event dan promo dapat ditampilkan.
9. Gallery mendukung lightbox.
10. Testimonials hanya menggunakan review asli.
11. Press mention hanya menggunakan sumber valid.
12. Google Maps berfungsi.
13. Get Directions berfungsi.
14. WhatsApp CTA berfungsi.
15. Reservation form menghasilkan pesan WhatsApp yang benar.
16. Instagram terhubung.
17. GoFood dan GrabFood dapat digunakan apabila tersedia.
18. Website responsif.
19. Gambar dioptimalkan.
20. Animasi tidak mengganggu performa.
21. Website memenuhi accessibility dasar.
22. SEO metadata tersedia.

# 12. PROJECT SCOPE

## Included — Version 1

- Landing page.
- Dark modern design.
- Dynamic hero.
- Brand storytelling.
- Coffee philosophy.
- Categorized digital menu.
- Event and promotion showcase.
- Gallery with lightbox.
- Customer testimonials.
- Location and Google Maps.
- WhatsApp integration.
- Table reservation through WhatsApp.
- Instagram integration.
- GoFood and GrabFood links.
- Responsive design.
- SEO foundation.

## Optional

- Multi-language support.
- More advanced parallax effects.
- Additional gallery transitions.

## Excluded — Version 1

- Backend.
- Database.
- Customer authentication.
- Admin dashboard.
- Online payment.
- Automatic reservation confirmation.
- Real-time table availability.
- Inventory management.
- Full online ordering system.

# 13. DEVELOPMENT PHASES

**Phase 1 — Foundation**
- Project setup.
- Design tokens.
- Typography.
- Global styling.

**Phase 2 — Main Visual**
- Navigation.
- Dynamic hero.
- Brand highlights.
- About section.
- Coffee philosophy.

**Phase 3 — Product & Content**
- Digital menu.
- Menu categories.
- Event showcase.
- Gallery.
- Lightbox.

**Phase 4 — Business Features**
- Testimonials.
- Location.
- Google Maps.
- Reservation form.
- WhatsApp.
- Social media.
- Delivery links.

**Phase 5 — Enhancement**
- Motion effects.
- Responsive refinement.
- Optional language switcher.
- SEO.
- Performance optimization.

**Phase 6 — Quality Assurance**
- Mobile testing.
- Desktop testing.
- Accessibility.
- Functional testing.
- Performance testing.

**Phase 7 — Deployment**
- Production deployment.
- Domain configuration.
- Final validation.
- Portfolio screenshots.

---

# DOCUMENT CONTROL

Project: Nawasena Coffee  
Developer: TemanWeb  
Document: Product Requirements Document  
Version: 1.2  
Status: Updated Product Specification

This document is the primary reference for the development and implementation of the Nawasena Coffee website.