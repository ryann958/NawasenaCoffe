# Setup Admin Nawasena Coffee

Admin hanya untuk login, mengelola menu/harga, dan mengunggah foto galeri. Tidak
memerlukan Vercel Environment Variables atau Vercel Functions.

## Setup satu kali

1. Buat proyek gratis di [Supabase](https://supabase.com/dashboard).
2. Di **SQL Editor**, jalankan isi
   `supabase/migrations/202611060001_admin_dashboard.sql`.
3. Di **Authentication → Users**, buat user admin dengan email dan password Anda.
   Pendaftaran publik tidak diperlukan.
4. Salin **User UID** akun tersebut. Di SQL Editor jalankan:

   ```sql
   insert into public.admin_members (user_id) values ('TEMPEL_USER_UID_DI_SINI');
   ```
5. Di Supabase **Project Settings → API Keys**, salin **Project URL** dan
   **Publishable key**. Isi kedua nilai itu di `js/supabase-config.js`:

   ```js
   export const supabaseConfig = Object.freeze({
     url: "https://PROJECT_REF.supabase.co",
     publishableKey: "sb_publishable_...",
   });
   ```
6. Commit dan push perubahan `js/supabase-config.js` ke GitHub. Vercel akan deploy
   otomatis seperti perubahan website biasa.
7. Login di `https://nawasenacoffe.vercel.app/admin/login`.

Publishable key memang boleh berada di frontend. Jangan pernah gunakan `service_role`
atau secret key. Akses tulis dilindungi login admin, RLS, dan Storage policies.

## Pemakaian

- **Menu & Harga:** isi nama, kategori, deskripsi, harga, foto opsional, lalu centang
  “Tampilkan di website” bila siap dipublikasikan.
- **Galeri:** pilih foto, tulis deskripsi bila perlu, lalu centang publikasi.
- Format gambar: JPG, PNG, WebP, atau AVIF; maksimal 5 MB.
- Foto di bucket publik dapat dilihat pengunjung website; jangan unggah gambar pribadi.

Data menu dan galeri yang dipublikasikan otomatis muncul pada section website yang
sudah tersedia. Website tetap berjalan dengan konten placeholder jika Supabase belum
dikonfigurasi.

> Migrasi ditujukan untuk proyek Supabase baru yang masih kosong. Jalankan hanya sekali.
