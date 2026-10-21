# 📋 CN-CW: Project Status, Checklist & Development Roadmap

Dokumen ini adalah **acuan utama perkembangan proyek CN-CW** (*Calculated Number & Complete Word*). Dokumen ini merangkum apa saja yang **sudah selesai dan stabil**, apa saja yang **masih kurang atau belum optimal**, serta **daftar periksa (checklist)** terperinci untuk kolaborasi tim pengembang ke depan.

---

## 📌 Ringkasan Status Proyek Saat Ini

- **Nama Proyek**: CN-CW (Calculated Number & Complete Word)
- **Target Pengguna**: Anak Usia Dini (PAUD / TK usia 3–6 tahun)
- **Teknologi Utama**: React 19, TypeScript 6, Vite 8, Tailwind CSS v4, React Router v7
- **Status Build**: ✅ Lulus Produksi (`npm run build`) tanpa error/warning
- **Status Pengujian**: ✅ Lulus Unit Test (`npm test`) 100% (Generator & Mesin Adaptif)
- **Deployment**: Static SPA siap deploy ke Vercel (`vercel.json` sudah terkonfigurasi)

---

## ✅ BAGIAN 1: Fitur yang Sudah Ada & Berjalan Stabil (Done)

### 1. Fondasi & Tampilan Antarmuka (UI/UX)
- [x] **Routing Halaman**:
  - `/` → Beranda utama dengan kartu pilihan game.
  - `/counting` → Game Hitung Angka (CN).
  - `/sentences` → Game Lengkapi Kata (CW).
- [x] **Desain Responsif Multi-Layar (Smooth Scaling)**:
  - Layar HP / Smartphone (`< 640px`): Tombol sentuh jempol nyaman, tanpa overflow scroll.
  - Layar Laptop (`768px – 1024px`): Layout seimbang dengan hover effect interaktif.
  - Layar Monitor Desktop (`1080p FHD`): Kartu game proporsional dan teks jelas.
  - Layar TV Gede (`2K / 4K / ≥ 1536px`): Tombol ekstra besar (`py-10`), font raksasa (`text-6xl`), dan objek berukuran jumbo (`text-9xl`) agar nyaman dilihat dari jarak jauh.
- [x] **Identitas & Branding Netral**:
  - Judul bersih: **CN-CW** (*Calculated Number and Complete Word*).
  - Emoji netral & universal: 🔢 (*Hitung Angka*) dan 📖 (*Lengkapi Kata*).

### 2. Game 1: CN — Hitung Angka
- [x] **Pembangkit Soal Prosedural (`countingGenerator.ts`)**:
  - Pool 10 objek netral ramah anak (Apel, Pisang, Jeruk, Anggur, Stroberi, Semangka, Mangga, Nanas, Bintang, Bola).
  - Mode Pemula: rentang angka 1–5 objek.
  - Mode Lanjutan: rentang angka 1–10 objek.
- [x] **Pencegahan Soal Duplikat**:
  - Objek soal sebelumnya dicegah muncul berturut-turut (*anti-immediate repetition*).
  - Tiga pilihan jawaban selalu unik (*distinct*).
  - Posisi jawaban diacak merata menggunakan algoritma *Fisher-Yates Shuffle*.

### 3. Game 2: CW — Lengkapi Kata
- [x] **Bank Soal Terkurasi (`sentenceBank.ts`)**:
  - 20 soal kalimat rumpang bahasa Indonesia tanpa kalimat rusak.
  - Terbagi menjadi 3 tingkat kesulitan:
    - *Tingkat 1 (Vocabulary)*: 7 soal kata benda konkret (pisang, air, burung, dsb).
    - *Tingkat 2 (Action)*: 6 soal kata kerja keseharian (makan, memasak, tidur, dsb).
    - *Tingkat 3 (Context)*: 7 soal pemahaman konteks (payung saat hujan, dsb).
- [x] **Penyaringan Sesuai Tingkat Kesulitan**:
  - Soal difilter berdasarkan batas kesulitan aktif (`maxDifficulty`).
  - Soal sebelumnya dicegah muncul berturut-turut berdasarkan ID soal.

### 4. Gameplay & Proteksi Jawaban Anak (Sistem 3 Percobaan)
- [x] **Mekanisme Coba Lagi Tanpa Bocor**:
  - Percobaan 1 & 2: Jawaban benar **TIDAK** dibocorkan. Tombol yang salah saja yang dinonaktifkan (warna merah pudar).
  - Anak didorong menghitung/berpikir ulang pada pilihan yang tersisa.
- [x] **Bantuan Otomatis (Revealed di Percobaan ke-3)**:
  - Jika anak gagal 3 kali berturut-turut pada soal yang sama, sistem secara hangat mengungkap jawaban yang benar (highlight hijau + penjelasan ramah).
  - Muncul tombol *"Soal Berikutnya →"* agar anak tidak pernah terjebak (*stuck*).
- [x] **Sistem Skor Positif**:
  - Skor hanya bertambah jika dijawab benar.
  - Tidak ada pengurangan poin / penalti / nyawa habis untuk jawaban salah.

### 5. Mesin Kesulitan Adaptif Tersembunyi (Invisible Engine)
- [x] **Pelacakan Performa Sesi (`performanceTracker.ts`)**:
  - Mencatat keberhasilan pada percobaan pertama, penggunaan petunjuk (*hint*), dan penyelesaian soal.
- [x] **Evaluasi Otomatis (`adaptiveDifficulty.ts`)**:
  - Promosi naik level jika minimal 7 dari 8 soal dijawab benar pada percobaan pertama tanpa petunjuk.
  - Demosi turun ke soal lebih mudah jika hanya 4 atau kurang dari 8 soal yang benar.
  - Cooldown 8 soal untuk mencegah naik-turun level yang terlalu cepat (*anti-oscillation*).
  - Performa Game Angka dan Game Kata terpisah 100%.

---

## ⏳ BAGIAN 2: Hal yang Belum Optimal & Roadmap Checklist (Backlog)

Daftar di bawah ini adalah aspek yang **masih menjadi kekurangan** dan perlu diselesaikan untuk pengembangan tahap berikutnya:

### 🔴 Prioritas 1: Pedagogi & Aksesibilitas Khusus Anak Usia Dini
*Kebutuhan paling mendesak karena target anak usia 3–5 tahun belum lancar membaca.*

- [ ] **1.1 Integrasi Suara Pembaca Soal (Text-to-Speech / TTS)**
  - *Masalah*: Anak PAUD belum bisa membaca kalimat panjang di game Lengkapi Kata.
  - *Rencana*: Gunakan Web Speech API bawaan browser (`window.speechSynthesis`) suara Bahasa Indonesia (`id-ID`).
  - *Checklist*:
    - [ ] Tombol speaker mini (🔊) di samping kalimat soal.
    - [ ] Opsi tombol untuk membacakan pilihan kata saat disentuh.
    - [ ] Bebas biaya & tanpa dependensi eksternal (100% native platform).

- [ ] **1.2 Efek Suara Ceria Sintetis (Sound Effects / SFX)**
  - *Masalah*: Respon benar/salah saat ini hanya visual teks, anak balita merespons jauh lebih baik terhadap rangsangan audio.
  - *Rencana*: Buat synthesizer suara menggunakan Web Audio API native browser (~15 baris kode vanilla JS, tanpa file mp3).
  - *Checklist*:
    - [ ] Suara merdu ceria (*Ting! ✨*) saat jawaban benar.
    - [ ] Nada lembut bersahabat (*Oops/Pop*) saat pilihan belum tepat.
    - [ ] Nada selebrasi saat berhasil menyelesaikan 3 percobaan.
    - [ ] Tombol toggle Mute/Unmute audio di sudut layar.

- [ ] **1.3 Interaktivitas Sentuh Buah (Tap-to-Count)**
  - *Masalah*: Saat menghitung 7–10 buah di layar, anak balita sering lupa mana yang sudah dihitung karena gambar buah pasif.
  - *Rencana*: Setiap buah bisa di-tap satu per satu oleh jari anak.
  - *Checklist*:
    - [ ] Animasi membal (*bounce*) saat buah disentuh.
    - [ ] Menampilkan angka urutan kecil (1, 2, 3...) di atas buah yang sudah disentuh untuk melatih konsep *one-to-one correspondence*.

---

### 🟡 Prioritas 2: Arsitektur Data & Persistensi Sesi

- [ ] **2.1 Persistensi State Sesi (`localStorage`)**
  - *Masalah*: Jika anak tidak sengaja menekan refresh / swipe back browser di HP, skor dan level adaptif kembali ke nol.
  - *Rencana*: Sinkronkan skor dan data performa adaptif ke `localStorage`.
  - *Checklist*:
    - [ ] Simpan skor harian anak agar tidak hilang saat reload halaman.
    - [ ] Simpan preferensi tingkat kesulitan terakhir yang dicapai anak.
    - [ ] Tombol "Ulang" tetap dapat mereset state kapan saja jika ingin memulai dari awal.

- [ ] **2.2 Perluasan Bank Soal Kata (Target 50–100 Soal)**
  - *Masalah*: Saat ini baru ada 20 soal (6–7 soal per tingkat), cepat terasa berulang setelah 10 menit bermain.
  - *Rencana*: Tambah bank soal kurasi bertema kurikulum PAUD Indonesia.
  - *Checklist*:
    - [ ] Tambahkan kategori: Anggota Tubuh (mata, hidung, telinga, kaki).
    - [ ] Tambahkan kategori: Warna & Bentuk (merah, biru, bulat, segitiga).
    - [ ] Tambahkan kategori: Hewan & Suaranya (sapi, ayam, kambing).
    - [ ] Tambahkan kategori: Tata Krama & Aktivitas Dasar (terima kasih, tolong, maaf).

- [ ] **2.3 Anti-Repetisi Penuh (Mekanisme Deck Shuffle / Kocok Kartu)**
  - *Masalah*: Anti-repetisi saat ini hanya mengingat 1 soal terakhir (`lastId`), pola `A -> B -> A -> B` masih bisa terjadi.
  - *Rencana*: Implementasikan algoritma pengocokan kartu (semua soal dalam pool harus habis dimainkan sebelum diacak kembali).
  - *Checklist*:
    - [ ] Ganti penyaringan `lastId` dengan array sisa kartu (`deck`).
    - [ ] Reset dan kocok ulang deck hanya ketika semua soal pada tingkat tersebut sudah selesai dijawab.

---

### 🟢 Prioritas 3: Tuning Mesin Adaptif & Representasi Simbol

- [ ] **3.1 Penyesuaian Jendela Evaluasi untuk Balita (Rentang 4 Soal)**
  - *Masalah*: Balita cepat bosan jika harus menjawab 16 soal (8 window + 8 cooldown) hanya untuk melihat rentang angka bertambah.
  - *Rencana*: Perkecil ukuran jendela evaluasi adaptif menjadi 4 soal.
  - *Checklist*:
    - [ ] Ubah `windowSize` menjadi 4 soal.
    - [ ] Ubah promosi: 4 dari 4 benar pada kesempatan pertama -> naik tingkat.
    - [ ] Ubah demosi: 2 atau lebih gagal -> turun ke rentang lebih mudah.

- [ ] **3.2 Representasi Visual Angka (Dots / Titik Dadu)**
  - *Masalah*: Anak usia 3–4 tahun terkadang belum hafal bentuk simbol angka `4`, meski bisa menghitung 4 apel.
  - *Rencana*: Tambahkan titik bantuan (*dot count*) di bawah angka pada tombol jawaban pemula.
  - *Checklist*:
    - [ ] Tampilkan titik kecil sejumlah angka di dalam tombol jawaban (misal tombol angka `3` memiliki 3 titik di bawahnya).

---

### 🔵 Prioritas 4: Detail Kecil & Kenyamanan Penggunaan (Polishing)

- [ ] **4.1 Layar Apresiasi / Selebrasi Penutup Sesi**
  - *Masalah*: Saat anak klik tombol "← Beranda", sesi langsung terputus tanpa ada penutup yang memotivasi.
  - *Rencana*: Tambahkan modal pop-up selebrasi saat anak ingin mengakhiri sesi bermain.
  - *Checklist*:
    - [ ] Menampilkan jumlah bintang yang berhasil dikumpulkan hari ini.
    - [ ] Animasi konfeti sederhana (CSS/Canvas).
    - [ ] Tombol kembali ke beranda atau lanjut bermain.

- [ ] **4.2 Proteksi Sentuhan Layar HP (Anti Double-Tap Zoom)**
  - *Masalah*: Ketukan cepat jari anak di layar HP/Tablet dapat memicu zoom default browser yang merusak tata letak.
  - *Checklist*:
    - [ ] Tambahkan CSS utility `touch-action: manipulation;` pada tombol jawaban dan container utama.

---

dan lain lainnya lah, nanti kita liat

---

## 🛠️ Panduan Pengembangan untuk Tim

### Menjalankan Proyek Lokal
```bash
# 1. Jalankan development server
npm run dev

# 2. Jalankan seluruh pengujian unit logika & mesin
npm test

# 3. Validasi pengecekan tipe data TypeScript
npx tsc -b

# 4. Bangun bundel produksi
npm run build
```

### Prinsip Utama Pengembangan (Pedoman Tim):
1. **Prinsip Ponytail (Lazy Senior Dev / YAGNI)**: Jangan gunakan dependensi eksternal jika API native browser (Web Speech API, Web Audio API, `localStorage`) sudah bisa menyelesaikannya dengan baik tanpa bloatware.
2. **Pedagogi Usia Dini Diutamakan**: Tidak boleh ada sistem nyawa, tidak boleh ada penalti pengurangan poin, dan tidak boleh ada pesan kegagalan yang mematahkan semangat anak.
3. **Kerahasiaan Jawaban**: Jangan pernah mengekspos jawaban yang benar sebelum batas percobaan habis.
