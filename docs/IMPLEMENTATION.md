# IMPLEMENTATION GUIDE
## Nawasena Coffee Website

**Project:** Nawasena Coffee  
**Agency:** TemanWeb  
**Document Version:** 1.0  
**Date:** 6 November 2026  
**Reference:** PRD v1.2

---

# 1. Technology Stack

Website dibuat menggunakan teknologi sederhana tanpa framework berat.

| Teknologi | Penggunaan |
|---|---|
| HTML5 | Struktur halaman |
| CSS3 | Styling, layout, responsive |
| JavaScript | Interaksi dan fitur dinamis |
| Google Fonts | Typography |
| Google Maps | Lokasi kedai |
| WhatsApp URL | Reservasi dan pemesanan |

Prinsip utama:
- Mobile-first development.
- Tidak menggunakan backend pada versi pertama.
- Tidak menggunakan database.
- Tidak menggunakan framework jika tidak diperlukan.
- Mengutamakan performa dan kemudahan maintenance.

# 2. Project Structure

Struktur folder yang digunakan:

```text
NawasenaCoffee/
│
├── index.html
├── README.md
│
├── docs/
│   ├── PRD.md
│   └── IMPLEMENTATION.md
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── menu/
│   │   ├── gallery/
│   │   ├── about/
│   │   └── testimonials/
│   │
│   ├── fonts/
│   └── icons/
│
├── css/
│   ├── styles.css
│   ├── responsive.css
│   └── animations.css
│
└── js/
    ├── config.js
    ├── menu-data.js
    ├── event-data.js
    ├── gallery-data.js
    ├── testimonial-data.js
    ├── reservation.js
    ├── translation-data.js
    └── main.js
```

Jangan menggabungkan seluruh kode ke dalam satu file. Setiap file harus memiliki tanggung jawab yang jelas.

# 3. Design System

## 3.1 Color Palette

Gunakan warna berikut sebagai standar desain.

| Variable | Hex | Penggunaan |
|---|---|---|
| Background | #171311 | Background utama |
| Surface | #261B16 | Section alternatif |
| Surface Raised | #35251D | Card dan panel |
| Accent | #C58A52 | Tombol dan highlight |
| Cream | #F3E5D2 | Heading dan teks utama |
| Muted | #B9A797 | Teks sekunder |
| Border | #594437 | Garis pembatas |

Buat seluruh warna sebagai CSS variables agar mudah diubah.

## 3.2 Typography

- Heading: Playfair Display atau Cormorant Garamond.
- Body: DM Sans atau Inter.
- Gunakan heading serif untuk kesan coffee shop yang hangat.
- Gunakan sans-serif untuk informasi dan navigasi.

## 3.3 Visual Direction

Konsep visual: **Dark Modern Coffee — Casual & Warm**.

Karakter desain:
- Dark brown background.
- Warm cream typography.
- Cinematic coffee photography.
- Rounded corners secukupnya.
- Subtle animations.
- Spacious layout.
- Tidak terlalu banyak ornamen.
- Tetap nyaman digunakan di perangkat mobile.

# 4. Development Phases

Pengerjaan dilakukan bertahap. Setiap fase harus diperiksa sebelum melanjutkan ke fase berikutnya.

## Phase 1 — Foundation & Design System

Target:
Membangun fondasi website dan memastikan struktur desain sudah konsisten.

Pekerjaan:
- Membuat struktur dasar HTML.
- Menghubungkan seluruh CSS dan JavaScript.
- Membuat CSS variables.
- Mengatur typography.
- Mengatur global layout.
- Membuat container dan utility classes.
- Menentukan spacing, border radius, dan button styles.
- Menyiapkan responsive foundation.

Output:
- Website memiliki fondasi desain.
- Warna dan typography sudah konsisten.
- Tidak ada error pada console.

## Phase 2 — Navigation & Hero Section

Target:
Membangun tampilan pertama yang dilihat pengunjung.

Pekerjaan:
- Responsive navigation.
- Logo dan nama brand.
- Mobile navigation menu.
- Hero background image.
- Headline dan description.
- CTA Order Now dan Explore Menu.
- Floating coffee beans.
- Coffee splash visual.
- Layered image composition.
- Subtle parallax.
- Text reveal animation.

Catatan:
Gunakan CSS transform dan opacity untuk animasi. Hindari animasi berat yang mengganggu performa.

Output:
Hero section tampil menarik dan responsif.

## Phase 3 — Brand Story & Coffee Philosophy

Target:
Membangun identitas dan cerita brand.

Pekerjaan:
- About section.
- Coffee philosophy.
- Origin story.
- Roasting process.
- Brewing process.
- Barista craftsmanship.
- Supporting images.

Catatan:
Jangan membuat klaim tentang asal biji kopi, sertifikasi, atau keahlian barista tanpa konfirmasi pemilik kedai.

Output:
Pengunjung dapat memahami karakter dan cerita Nawasena Coffee.

## Phase 4 — Digital Menu

Target:
Membangun menu digital yang mudah digunakan.

Kategori:
- Espresso Based.
- Manual Brew.
- Non-Coffee.
- Pastry.
- Main Course.

Pekerjaan:
- Membuat data menu terpisah di `menu-data.js`.
- Menampilkan menu dalam bentuk card.
- Menambahkan gambar, nama, deskripsi, dan harga.
- Membuat category filter.
- Menambahkan hover interaction.
- Membuat layout responsive.

Output:
Menu dapat ditampilkan dan difilter tanpa menulis ulang struktur HTML.

## Phase 5 — Events & Promotions

Target:
Menampilkan informasi kegiatan dan promosi kedai.

Pekerjaan:
- Membuat data event.
- Membuat data promotion.
- Event card.
- Promotion card.
- Tanggal dan informasi kegiatan.
- CTA untuk informasi lebih lanjut.

Output:
Pemilik dapat memperbarui konten melalui file data JavaScript.

## Phase 6 — Gallery & Lightbox

Target:
Menampilkan suasana kedai melalui fotografi.

Pekerjaan:
- Responsive image grid atau masonry.
- Image hover effect.
- Lightbox.
- Tombol next dan previous.
- Close button.
- Keyboard Escape.
- Mobile interaction.

Output:
Galeri dapat dibuka dalam tampilan lebih besar tanpa meninggalkan halaman.

## Phase 7 — Testimonials & Press

Target:
Meningkatkan kepercayaan pengunjung.

Pekerjaan:
- Membuat testimonial card.
- Menampilkan nama dan ulasan pelanggan.
- Menambahkan media mention jika tersedia.
- Menyembunyikan bagian yang belum memiliki konten valid.

Catatan:
Jangan membuat testimoni atau logo media fiktif.

## Phase 8 — Location & Reservation

Target:
Mempermudah pengunjung menemukan kedai dan melakukan reservasi.

Pekerjaan:
- Location section.
- Google Maps embed.
- Opening hours.
- Address information.
- Reservation form.
- Form validation.
- WhatsApp message generator.

Data reservasi:
- Nama.
- Nomor WhatsApp.
- Tanggal.
- Waktu.
- Jumlah tamu.
- Pilihan tempat duduk.
- Permintaan khusus.

Reservasi dikirim melalui WhatsApp dan dikonfirmasi secara manual oleh pihak kedai.

Tidak ada sistem booking otomatis atau pengecekan meja secara real-time pada versi pertama.

## Phase 9 — Contact, Social & Footer

Target:
Melengkapi informasi kontak dan navigasi website.

Pekerjaan:
- WhatsApp CTA.
- Instagram link.
- Social media links.
- Order CTA.
- Contact information.
- Footer navigation.
- Copyright.

Semua informasi kontak harus berasal dari pemilik kedai.

## Phase 10 — Responsive, SEO & Optimization

Target:
Memastikan website siap digunakan secara publik.

Pekerjaan:
- Mobile testing.
- Tablet testing.
- Desktop testing.
- Image compression.
- WebP/AVIF support.
- Lazy loading.
- SEO title dan description.
- Open Graph metadata.
- Semantic HTML.
- Accessibility checks.
- Reduced motion support.
- Console error checks.
- Lighthouse testing.

# 5. Centralized Configuration

File `config.js` digunakan untuk menyimpan informasi bisnis yang sering berubah.

Contoh data yang perlu dikonfigurasi:
- Nama kedai.
- Nomor WhatsApp.
- Instagram URL.
- Alamat.
- Google Maps URL.
- Opening hours.
- Order URL.

Jangan menyebarkan nomor WhatsApp atau alamat bisnis secara manual di banyak file.

# 6. JavaScript Architecture

Setiap file JavaScript memiliki tanggung jawab berikut:

| File | Tanggung Jawab |
|---|---|
| config.js | Informasi bisnis |
| menu-data.js | Data menu |
| event-data.js | Data event dan promosi |
| gallery-data.js | Data galeri |
| testimonial-data.js | Data testimoni |
| reservation.js | Validasi dan reservasi |
| translation-data.js | Teks multibahasa |
| main.js | Navigasi dan interaksi utama |

Hindari penggunaan global variables yang tidak diperlukan.

# 7. Performance Guidelines

Target teknis:
- Mobile-first.
- Gambar dioptimalkan.
- Gunakan lazy loading untuk gambar di luar viewport.
- Gunakan `width` dan `height` pada gambar.
- Hindari library besar yang tidak diperlukan.
- Hindari animasi layout yang berat.
- Gunakan `prefers-reduced-motion`.
- Prioritaskan loading hero image.
- Hindari autoplay video.

Lighthouse dijadikan alat evaluasi dengan target aspiratif minimal 90 untuk Performance, Accessibility, Best Practices, dan SEO. Hasil aktual bergantung pada hosting, perangkat, dan konten.

# 8. Content Management

Seluruh konten bisnis harus mudah diperbarui.

Contoh:
- Mengubah harga menu cukup melalui `menu-data.js`.
- Mengubah nomor WhatsApp melalui `config.js`.
- Mengubah galeri melalui `gallery-data.js`.
- Menambahkan event melalui `event-data.js`.

Versi pertama tidak membutuhkan dashboard admin.

# 9. Testing Checklist

Sebelum deployment, pastikan:

- [ ] Semua navigasi berfungsi.
- [ ] Semua CTA memiliki tujuan yang benar.
- [ ] Mobile menu dapat dibuka dan ditutup.
- [ ] Menu filter berfungsi.
- [ ] Gallery lightbox berfungsi.
- [ ] Reservation form tervalidasi.
- [ ] Pesan WhatsApp terbentuk dengan benar.
- [ ] Google Maps menampilkan lokasi yang benar.
- [ ] Tidak ada tautan kosong.
- [ ] Tidak ada gambar rusak.
- [ ] Tidak ada error JavaScript.
- [ ] Tampilan mobile tidak mengalami horizontal overflow.
- [ ] Informasi bisnis sudah dikonfirmasi pemilik.
- [ ] Konten placeholder sudah diganti atau disembunyikan.

# 10. Deployment

Website dapat di-deploy menggunakan hosting static.

Pilihan:
- GitHub Pages.
- Netlify.
- Vercel.

Sebelum publikasi:
1. Pastikan seluruh informasi bisnis benar.
2. Pastikan semua gambar memiliki izin penggunaan.
3. Pastikan nomor WhatsApp aktif.
4. Pastikan domain dan hosting siap.
5. Uji website pada perangkat mobile.
6. Periksa seluruh tautan dan CTA.

---

# DEVELOPMENT RULES

1. Kerjakan satu fase pada satu waktu.
2. Jangan melanjutkan sebelum fase sebelumnya selesai dan diuji.
3. Jangan mengubah struktur proyek tanpa alasan teknis.
4. Jangan menambahkan fitur di luar PRD tanpa persetujuan.
5. Jangan menggunakan data bisnis fiktif sebagai informasi nyata.
6. Prioritaskan performa, responsivitas, dan kemudahan maintenance.
7. Setiap perubahan harus menjaga fungsi yang sudah selesai.
8. Gunakan kode yang bersih, modular, dan mudah dipahami.

**END OF IMPLEMENTATION GUIDE**