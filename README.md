# CryptGen Class Management Platform

Aplikasi manajemen kelas modern untuk CryptGen.

## Fitur

- Manajemen pengumuman
- Penjadwalan kelas
- Pelacakan keuangan
- Informasi anggota kelas
- Informasi kontak

## Cara Men-deploy ke Vercel

### Metode 1: Deployment via GitHub

1. Pastikan Anda memiliki akun Vercel (https://vercel.com)
2. Push kode Anda ke repository GitHub
3. Login ke dashboard Vercel
4. Klik "Add New" dan pilih "Project" 
5. Import repositori GitHub Anda
6. Gunakan pengaturan berikut:
   - Framework Preset: Other
   - Build Command: `node vercel-build.js`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. Klik "Deploy"

### Metode 2: Deployment via CLI

1. Pastikan Anda memiliki akun Vercel (https://vercel.com)
2. Install Vercel CLI dengan menjalankan `npm install -g vercel`
3. Login ke Vercel dengan menjalankan `vercel login`
4. Dari direktori root proyek, jalankan `vercel` untuk men-deploy
5. Ikuti petunjuk untuk mengkonfigurasi proyek Anda
   - Pilih "No" saat ditanya apakah ingin mengubah konfigurasi
   - Vercel akan menggunakan file `vercel.json` yang sudah ada

### Jika Mengalami Error "Not Found"

Jika mengalami error "Not Found" setelah deployment:

1. Periksa pengaturan proyek di dashboard Vercel
2. Pastikan Build Command: `node vercel-build.js`
3. Pastikan Output Directory: `dist`
4. Coba hapus deployment dan mulai ulang

Atau bisa juga deploy ulang dengan perintah:
```
vercel --prod
```

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