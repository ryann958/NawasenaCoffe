# Setup Admin Nawasena Coffee

Dokumen ini mencakup deployment admin di Vercel dan koneksi ke proyek Supabase.
Dashboard memerlukan proyek Supabase yang aktif; saat ini kredensial proyek belum tersedia.

## 1. Siapkan Supabase

1. Buat proyek Supabase dan simpan URL proyek serta publishable key (atau anon key).
   Jangan gunakan `service_role` key di Vercel maupun browser.
2. Jalankan `supabase/migrations/202611060001_admin_dashboard.sql` satu kali melalui
   Supabase SQL Editor atau alat migrasi tepercaya.
3. Aktifkan provider Email di Authentication. Nonaktifkan sign-up publik dan gunakan
   undangan/pembuatan user melalui Supabase Dashboard untuk membuat akun admin.
4. Tambahkan URL website dan URL login admin ke daftar Redirect URLs Auth, misalnya
   `https://domain-website/admin/login` dan URL development yang digunakan.
5. Setelah user Auth dibuat, ambil UUID user tersebut dan jalankan melalui SQL Editor:

   ```sql
   insert into public.admin_members (user_id, is_active)
   values ('UUID_USER_ADMIN', true);
   ```

   Ganti `UUID_USER_ADMIN` dengan UUID dari Supabase Auth. Akun tidak memperoleh hak
   admin hanya karena berhasil login; UUID harus tercatat aktif di `admin_members`.

## 2. Konfigurasi Vercel

Impor project ini ke Vercel sebagai static website dengan Vercel Functions. Tidak ada
langkah build frontend atau dependensi proyek yang perlu dipasang. Atur environment
variables berikut untuk setiap environment yang digunakan:

| Variable | Nilai |
|---|---|
| `SUPABASE_URL` | Project URL Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase; gunakan `SUPABASE_ANON_KEY` untuk key anon legacy |

`api/config.js` mengekspos URL dan public key tersebut untuk dipakai browser. Key
tersebut bukan secret; keamanan akses data tetap bergantung pada RLS. Jangan menaruh
service-role key pada environment yang dikirim ke browser.

Deploy ulang setelah mengatur environment variables. `vercel.json` menangani rewrite
route `/admin`, `/admin/login`, dan `/admin/dashboard`. Route tersebut bukan batas
keamanan bagi file HTML statis: proteksi data dan operasi tetap diterapkan oleh Supabase
Auth, pemeriksaan membership, RLS, dan Storage policies.

## 3. Fitur yang tersedia

- Login dan logout email/password melalui Supabase Auth; tidak ada halaman pendaftaran.
- Dashboard ringkasan aktivitas dan jumlah konten.
- CRUD menu, galeri, promo/event, dan testimoni.
- Form informasi toko serta konten website.
- Upload gambar JPG, PNG, WebP, dan AVIF hingga 5 MB ke bucket privat
  `nawasena-content`, dengan pratinjau bertanda tangan.
- Status publikasi, urutan konten, dan availability menu.
- Menu dan galeri yang dipublikasikan, informasi toko/kontak, serta konten Hero/About,
  footer, dan SEO dimuat di website publik melalui Supabase dengan filter publikasi.

Data yang belum diberikan pemilik bisnis tetap kosong/draft; dashboard tidak membuat
nomor kontak, alamat, jam buka, event, maupun testimoni fiktif.

## 4. Batasan dan verifikasi

- Admin memerlukan akses jaringan ke Supabase serta pemuatan Supabase JS v2 dari esm.sh.
- Endpoint config dan halaman admin tidak dapat diuji dengan file server statis saja.
  Pengujian Auth, RLS, database, upload, Storage policies, dan redirect callback harus
  dilakukan setelah proyek Supabase dan deployment Vercel disiapkan.
- Section publik promo/event dan testimoni belum ada pada halaman saat ini. Data dapat
  dikelola di dashboard, tetapi tidak akan ditampilkan di publik sampai section-nya
  dibangun dan disetujui.
- Supabase free-tier dapat menghapus proyek yang tidak aktif. Pastikan project aktif
  sebelum menggunakan dashboard pada situs produksi.
