# CryptGen Class Management Platform

Aplikasi manajemen kelas modern untuk CryptGen.

## Fitur

- Manajemen pengumuman
- Penjadwalan kelas
- Pelacakan keuangan
- Informasi anggota kelas
- Informasi kontak

## Cara Men-deploy ke Vercel

1. Pastikan Anda memiliki akun Vercel (https://vercel.com)
2. Install Vercel CLI dengan menjalankan `npm install -g vercel`
3. Login ke Vercel dengan menjalankan `vercel login`
4. Dari direktori root proyek, jalankan `vercel` untuk men-deploy
5. Ikuti petunjuk untuk mengkonfigurasi proyek Anda
   - Pilih "No" saat ditanya apakah ingin mengubah konfigurasi
   - Vercel akan menggunakan file `vercel.json` yang sudah ada

## Variabel Lingkungan Penting

Pastikan untuk menambahkan variabel lingkungan berikut di dashboard Vercel:

- `NODE_ENV`: set ke `production`

## Catatan Penting untuk Deployment

- Aplikasi menggunakan penyimpanan data dalam memori secara default, yang akan hilang saat server di-restart. Untuk produksi, sebaiknya konfigurasikan database persisten.
- Pastikan semua aset statis dimuat dengan benar setelah deployment.

## Pengembangan Lokal

1. Install dependensi dengan `npm install`
2. Jalankan aplikasi dengan `npm run dev`
3. Buka `http://localhost:3000` di browser Anda