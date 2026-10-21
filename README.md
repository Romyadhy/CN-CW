# CNCW Little Learners 🌿

Sebuah website edukasi permainan mini anak usia dini (PAUD/TK usia 3–6 tahun) dalam Bahasa Indonesia.

## Fitur Utama

1. **Kebun Angka (`/counting`)**: Menghitung objek buah-buahan di kebun (1–5 untuk pemula, adaptif hingga 1–10) dan memilih angka yang benar dari 3 pilihan.
2. **Kebun Kalimat (`/sentences`)**: Melengkapi kalimat rumpang bahasa Indonesia dengan memilih kata yang paling tepat dari 3 pilihan.
3. **Sistem Adaptif Tersembunyi (Invisible Adaptive Difficulty)**:
   - Kesulitan bertambah atau berkurang secara otomatis berdasarkan performa 8 soal terakhir tanpa menampilkan label level kepada anak.
   - Performa Kebun Angka dan Kebun Kalimat terpisah sepenuhnya.
4. **Desain Ramah Anak**: Tombol sentuh besar, warna cerah bertema kebun buah, respons positif dan kesempatan mengulang tanpa penalti.

---

## Persyaratan Sistem

- Node.js (v18 ke atas)
- npm

## Cara Menjalankan

### 1. Instal Dependensi
```bash
npm install
```

### 2. Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser di alamat lokal yang tertera (biasanya `http://localhost:5173`).

### 3. Menjalankan Tes
```bash
npm test
```
Menjalankan tes validasi logika generator angka, generator kalimat, dan mesin kesulitan adaptif.

### 4. Build untuk Produksi
```bash
npm run build
```
File hasil build akan berada di direktori `dist/`.

---

## Panduan Deployment ke Vercel

Aplikasi ini adalah Single Page Application (SPA) statis yang siap di-deploy ke Vercel tanpa backend:

1. Push repository ini ke GitHub / GitLab.
2. Buka dashboard [Vercel](https://vercel.com) dan impor repository ini.
3. Konfigurasi build otomatis:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Untuk routing client-side (agar URL seperti `/counting` dapat diakses langsung tanpa 404), tambahkan file `vercel.json` dengan konfigurasi rewrite jika diperlukan:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
5. Klik **Deploy**.
