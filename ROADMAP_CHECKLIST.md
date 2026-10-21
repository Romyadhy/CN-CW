# 📋 CN-CW: Project Status, Checklist & Development Roadmap

Dokumen ini adalah **acuan utama perkembangan proyek CN-CW** (_Calculated Number & Complete Word_). Dokumen ini merangkum apa saja yang **sudah selesai dan stabil**, apa saja yang **masih kurang atau belum optimal**, serta **daftar periksa (checklist)** terperinci untuk kolaborasi tim pengembang ke depan.

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
  - Judul bersih: **CN-CW** (_Calculated Number and Complete Word_).
  - Emoji netral & universal: 🔢 (_Hitung Angka_) dan 📖 (_Lengkapi Kata_).

### 2. Game 1: CN — Hitung Angka

- [x] **Pembangkit Soal Prosedural (`countingGenerator.ts`)**:
  - Pool 10 objek netral ramah anak (Apel, Pisang, Jeruk, Anggur, Stroberi, Semangka, Mangga, Nanas, Bintang, Bola).
  - Mode Pemula: rentang angka 1–5 objek.
  - Mode Lanjutan: rentang angka 1–10 objek.
- [x] **Pencegahan Soal Duplikat**:
  - Objek soal sebelumnya dicegah muncul berturut-turut (_anti-immediate repetition_).
  - Tiga pilihan jawaban selalu unik (_distinct_).
  - Posisi jawaban diacak merata menggunakan algoritma _Fisher-Yates Shuffle_.

### 3. Game 2: CW — Lengkapi Kata

- [x] **Bank Soal Terkurasi (`sentenceBank.ts`)**:
  - 20 soal kalimat rumpang bahasa Indonesia tanpa kalimat rusak.
  - Terbagi menjadi 3 tingkat kesulitan:
    - _Tingkat 1 (Vocabulary)_: 7 soal kata benda konkret (pisang, air, burung, dsb).
    - _Tingkat 2 (Action)_: 6 soal kata kerja keseharian (makan, memasak, tidur, dsb).
    - _Tingkat 3 (Context)_: 7 soal pemahaman konteks (payung saat hujan, dsb).
- [x] **Penyaringan Sesuai Tingkat Kesulitan**:
  - Soal difilter berdasarkan batas kesulitan aktif (`maxDifficulty`).
  - Soal sebelumnya dicegah muncul berturut-turut berdasarkan ID soal.

### 4. Gameplay & Proteksi Jawaban Anak (Sistem 3 Percobaan)

- [x] **Mekanisme Coba Lagi Tanpa Bocor**:
  - Percobaan 1 & 2: Jawaban benar **TIDAK** dibocorkan. Tombol yang salah saja yang dinonaktifkan (warna merah pudar).
  - Anak didorong menghitung/berpikir ulang pada pilihan yang tersisa.
- [x] **Bantuan Otomatis (Revealed di Percobaan ke-3)**:
  - Jika anak gagal 3 kali berturut-turut pada soal yang sama, sistem secara hangat mengungkap jawaban yang benar (highlight hijau + penjelasan ramah).
  - Muncul tombol _"Soal Berikutnya →"_ agar anak tidak pernah terjebak (_stuck_).
- [x] **Sistem Skor Positif**:
  - Skor hanya bertambah jika dijawab benar.
  - Tidak ada pengurangan poin / penalti / nyawa habis untuk jawaban salah.

### 5. Mesin Kesulitan Adaptif Tersembunyi (Invisible Engine)

- [x] **Pelacakan Performa Sesi (`performanceTracker.ts`)**:
  - Mencatat keberhasilan pada percobaan pertama, penggunaan petunjuk (_hint_), dan penyelesaian soal.
- [x] **Evaluasi Otomatis (`adaptiveDifficulty.ts`)**:
  - Promosi naik level jika minimal 7 dari 8 soal dijawab benar pada percobaan pertama tanpa petunjuk.
  - Demosi turun ke soal lebih mudah jika hanya 4 atau kurang dari 8 soal yang benar.
  - Cooldown 8 soal untuk mencegah naik-turun level yang terlalu cepat (_anti-oscillation_).
  - Performa Game Angka dan Game Kata terpisah 100%.

---

## ⏳ BAGIAN 2: Hal yang Belum Optimal & Roadmap Checklist (Backlog)

Daftar di bawah ini adalah aspek yang **masih menjadi kekurangan** dan perlu diselesaikan untuk pengembangan tahap berikutnya:

### 🔴 Prioritas 1: Pedagogi & Aksesibilitas Khusus Anak Usia Dini

_Kebutuhan paling mendesak karena target anak usia 3–5 tahun belum lancar membaca._

- [ ] **1.1 Integrasi Suara Pembaca Soal (Text-to-Speech / TTS)**
  - _Masalah_: Anak PAUD belum bisa membaca kalimat panjang di game Lengkapi Kata.
  - _Rencana_: Gunakan Web Speech API bawaan browser (`window.speechSynthesis`) suara Bahasa Indonesia (`id-ID`).
  - _Checklist_:
    - [ ] Tombol speaker mini (🔊) di samping kalimat soal.
    - [ ] Opsi tombol untuk membacakan pilihan kata saat disentuh.
    - [ ] Bebas biaya & tanpa dependensi eksternal (100% native platform).

- [ ] **1.2 Efek Suara Ceria Sintetis (Sound Effects / SFX)**
  - _Masalah_: Respon benar/salah saat ini hanya visual teks, anak balita merespons jauh lebih baik terhadap rangsangan audio.
  - _Rencana_: Buat synthesizer suara menggunakan Web Audio API native browser (~15 baris kode vanilla JS, tanpa file mp3).
  - _Checklist_:
    - [ ] Suara merdu ceria (_Ting! ✨_) saat jawaban benar.
    - [ ] Nada lembut bersahabat (_Oops/Pop_) saat pilihan belum tepat.
    - [ ] Nada selebrasi saat berhasil menyelesaikan 3 percobaan.
    - [ ] Tombol toggle Mute/Unmute audio di sudut layar.

- [ ] **1.3 Interaktivitas Sentuh Buah (Tap-to-Count)**
  - _Masalah_: Saat menghitung 7–10 buah di layar, anak balita sering lupa mana yang sudah dihitung karena gambar buah pasif.
  - _Rencana_: Setiap buah bisa di-tap satu per satu oleh jari anak.
  - _Checklist_:
    - [ ] Animasi membal (_bounce_) saat buah disentuh.
    - [ ] Menampilkan angka urutan kecil (1, 2, 3...) di atas buah yang sudah disentuh untuk melatih konsep _one-to-one correspondence_.

---

### 🟡 Prioritas 2: Arsitektur Data & Persistensi Sesi

- [ ] **2.1 Persistensi State Sesi (`localStorage`)**
  - _Masalah_: Jika anak tidak sengaja menekan refresh / swipe back browser di HP, skor dan level adaptif kembali ke nol.
  - _Rencana_: Sinkronkan skor dan data performa adaptif ke `localStorage`.
  - _Checklist_:
    - [ ] Simpan skor harian anak agar tidak hilang saat reload halaman.
    - [ ] Simpan preferensi tingkat kesulitan terakhir yang dicapai anak.
    - [ ] Tombol "Ulang" tetap dapat mereset state kapan saja jika ingin memulai dari awal.

- [ ] **2.2 Perluasan Bank Soal Kata (Target 50–100 Soal)**
  - _Masalah_: Saat ini baru ada 20 soal (6–7 soal per tingkat), cepat terasa berulang setelah 10 menit bermain.
  - _Rencana_: Tambah bank soal kurasi bertema kurikulum PAUD Indonesia.
  - _Checklist_:
    - [ ] Tambahkan kategori: Anggota Tubuh (mata, hidung, telinga, kaki).
    - [ ] Tambahkan kategori: Warna & Bentuk (merah, biru, bulat, segitiga).
    - [ ] Tambahkan kategori: Hewan & Suaranya (sapi, ayam, kambing).
    - [ ] Tambahkan kategori: Tata Krama & Aktivitas Dasar (terima kasih, tolong, maaf).

- [ ] **2.3 Anti-Repetisi Penuh (Mekanisme Deck Shuffle / Kocok Kartu)**
  - _Masalah_: Anti-repetisi saat ini hanya mengingat 1 soal terakhir (`lastId`), pola `A -> B -> A -> B` masih bisa terjadi.
  - _Rencana_: Implementasikan algoritma pengocokan kartu (semua soal dalam pool harus habis dimainkan sebelum diacak kembali).
  - _Checklist_:
    - [ ] Ganti penyaringan `lastId` dengan array sisa kartu (`deck`).
    - [ ] Reset dan kocok ulang deck hanya ketika semua soal pada tingkat tersebut sudah selesai dijawab.

---

### 🟢 Prioritas 3: Tuning Mesin Adaptif & Representasi Simbol

- [ ] **3.1 Penyesuaian Jendela Evaluasi untuk Balita (Rentang 4 Soal)**
  - _Masalah_: Balita cepat bosan jika harus menjawab 16 soal (8 window + 8 cooldown) hanya untuk melihat rentang angka bertambah.
  - _Rencana_: Perkecil ukuran jendela evaluasi adaptif menjadi 4 soal.
  - _Checklist_:
    - [ ] Ubah `windowSize` menjadi 4 soal.
    - [ ] Ubah promosi: 4 dari 4 benar pada kesempatan pertama -> naik tingkat.
    - [ ] Ubah demosi: 2 atau lebih gagal -> turun ke rentang lebih mudah.

- [ ] **3.2 Representasi Visual Angka (Dots / Titik Dadu)**
  - _Masalah_: Anak usia 3–4 tahun terkadang belum hafal bentuk simbol angka `4`, meski bisa menghitung 4 apel.
  - _Rencana_: Tambahkan titik bantuan (_dot count_) di bawah angka pada tombol jawaban pemula.
  - _Checklist_:
    - [ ] Tampilkan titik kecil sejumlah angka di dalam tombol jawaban (misal tombol angka `3` memiliki 3 titik di bawahnya).

---

### 🔵 Prioritas 4: Detail Kecil & Kenyamanan Penggunaan (Polishing)

- [ ] **4.1 Layar Apresiasi / Selebrasi Penutup Sesi**
  - _Masalah_: Saat anak klik tombol "← Beranda", sesi langsung terputus tanpa ada penutup yang memotivasi.
  - _Rencana_: Tambahkan modal pop-up selebrasi saat anak ingin mengakhiri sesi bermain.
  - _Checklist_:
    - [ ] Menampilkan jumlah bintang yang berhasil dikumpulkan hari ini.
    - [ ] Animasi konfeti sederhana (CSS/Canvas).
    - [ ] Tombol kembali ke beranda atau lanjut bermain.

- [ ] **4.2 Proteksi Sentuhan Layar HP (Anti Double-Tap Zoom)**
  - _Masalah_: Ketukan cepat jari anak di layar HP/Tablet dapat memicu zoom default browser yang merusak tata letak.
  - _Checklist_:
    - [ ] Tambahkan CSS utility `touch-action: manipulation;` pada tombol jawaban dan container utama.

---

dan lain lainnya lah, nanti kita liat nanti
