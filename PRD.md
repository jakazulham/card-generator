# Product Requirement Document (PRD)
## CetakKartu.com - Platform Digital Card Generator

| Dokumen | Product Requirement Document (PRD) |
|---|---|
| **Nama Proyek** | CetakKartu.com (Fokus Awal: Kartu NISN) |
| **Versi** | 2.0.0 |
| **Tanggal Pembaruan** | 16 Juni 2026 |
| **Penulis** | Antigravity AI |
| **Status** | Aktif / Production Ready |

---

## 1. Pendahuluan & Latar Belakang
CetakKartu.com adalah sebuah platform aplikasi berbasis web modern yang memungkinkan pengguna (guru, staf administrasi sekolah, orang tua, atau siswa) untuk memasukkan data identitas secara instan dan menghasilkan dokumen digital berupa kartu identitas berkualitas tinggi. Pada fase awal (Versi 2.0.0), fokus utama platform adalah **Generator Kartu NISN**. Platform ini dirancang menggunakan arsitektur web modern bergaya perangkat lunak *Software as a Service* (SaaS) yang cepat, gratis, dan mengedepankan keamanan privasi pengguna melalui pemrosesan data sisi klien (*Client-Side Processing*).

---

## 2. Tujuan & Target Pengguna

### 2.1 Tujuan Proyek
* **Platform Terpadu**: Menjadi platform sentral (*landing page*) yang menawarkan berbagai layanan pembuatan kartu digital (NISN, BPJS, Kartu Pelajar, NUPTK, dll).
* **Keamanan Privasi (Client-Side)**: Tidak ada data yang dikirim ke server. Pemrosesan teks, QR Code, dan PDF 100% dilakukan secara lokal di browser.
* **Estetika SaaS Modern**: Menyajikan antarmuka pengguna (UI) kelas premium menyerupai produk *startup* global (seperti Stripe atau Vercel) dengan elemen *glassmorphism*, gradasi warna dinamis, dan efek 3D.
* **Fleksibilitas Format Ekspor**: Mendukung pengunduhan berkas dalam format PDF siap cetak serta gambar PNG berkualitas tinggi.

### 2.2 Target Pengguna
1. **Staf Administrasi Sekolah / Operator**: Membutuhkan alat pembuat kartu berstandar untuk keperluan sekolah.
2. **Siswa & Wali Murid**: Memerlukan alat praktis mandiri tanpa butuh keahlian instalasi *software* desain.

---

## 3. Arsitektur & Navigasi Aplikasi

Aplikasi dibangun sebagai **Single-Page Application (SPA)** menggunakan React Router (v7) dengan pembagian rute halaman sebagai berikut:
1. **`/` (Beranda / Landing Page)**: Menampilkan *Hero Section* dengan mockup 3D CSS kartu, keunggulan layanan, cara kerja 3 langkah, *grid* layanan yang tersedia/segera hadir, FAQ, dan statistik.
2. **`/nisn` (Generator Kartu NISN)**: Aplikasi inti tempat *form* input data, validasi, pratinjau (*live preview*), dan tombol unduh (PDF/PNG) berada.
3. **`/about` (Tentang Kami)**: Halaman informasi visi misi platform dan penjelasan teknologi keamanan data.
4. **`/contact` (Kontak)**: Halaman dukungan teknis dengan integrasi tombol WhatsApp interaktif dan rute *mailto* Email.
5. **`/disclaimer` (Penafian)**: Dokumen legal *Terms of Service* dan peringatan independensi platform.

---

## 4. Fitur Inti & Spesifikasi

### 4.1 Modul Generator Kartu (Card Engine)
* **Validasi Input**: Nomor NISN diwajibkan berupa angka (numerik) dan presisi 10 digit.
* **Live Preview**: Visualisasi kartu depan dan belakang berubah seketika (*real-time*) saat teks diketik pada formulir.
* **Pembangkit QR Code**: Membuat QR Code otomatis di kartu sisi belakang berdasarkan Nomor NISN.
* **Mekanisme *Export* (Unduh)**: Menggabungkan HTML/DOM menggunakan `html2canvas` dan mengemasnya ke dalam file ukuran ID standar ISO 7810 (`85.6mm x 53.98mm`) menggunakan `jsPDF`.
* **Sistem Notifikasi Eror (Retry Mechanism)**: Jika fungsi ekspor grafis gagal akibat masalah kanvas atau memori, sistem akan menampilkan notifikasi *error* dan menyarankan pengguna untuk mencoba kembali.

### 4.2 Desain Visual & UI/UX Responsif
* **Sistem Tema**: Diatur secara global di `index.css` menggunakan variabel CSS (*CSS Variables*) dengan dominasi warna *primary* biru dan latar belakang putih (*clean white*).
* **Navigasi Global**: 
  * Header/Navbar dibuat lengket (*sticky*) dengan efek *backdrop-filter blur*.
  * Terdapat menu navigasi interaktif (*dropdown*) untuk "Buat Kartu ▾".
  * Menu hamburger (*mobile menu*) terintegrasi secara fungsional untuk tampilan layar di bawah 768px.
* **Footer Modular**: Tersusun rapi menyamping di layar desktop (grid 3 kolom) dan otomatis menyusut vertikal di layar ponsel.
* **Grafis Estetik (SVG Silhouette)**: Halaman statis (seperti *About* dan *Disclaimer*) menggunakan grafik siluet SVG 3D sebagai penambah estetika (*visual appeal*).

---

## 5. Tumpukan Teknologi (Tech Stack)

* **Inti**: React 18, Vite (sebagai *bundler* & *development server*).
* **Routing**: `react-router-dom` v7.
* **Pengolahan Visual**: `html2canvas` (merender elemen DOM ke dalam bitmap).
* **Penyusunan Dokumen**: `jspdf` (menyusun bitmap ke format `.pdf` siap cetak).
* **QR Code**: `qrcode.react` (Pembangkit SVG/Canvas QR).
* **Gaya (Styling)**: Vanilla CSS3 murni terpusat di `index.css` (tanpa *framework* Tailwind demi menghindari pembengkakan paket *bundle* CSS).

---

## 6. Rencana Pengembangan Lanjutan (Roadmap ke Depan)

Dokumen ini diharapkan menjadi acuan untuk pembaruan (*update*) berkala. Area pengembangan potensial di masa mendatang:
1. **Pemisahan Modul Generator (Refactoring)**: Jika layanan tambahan (BPJS, NUPTK) sudah diaktifkan, logika di `NisnGenerator.jsx` harus dipisahkan ke fungsi *helper* abstrak untuk merender PDF agar dapat digunakan ulang (*reusable*) oleh generator jenis kartu lain.
2. **Optimasi Bundling (Lazy Loading)**: Menerapkan `React.lazy()` pada komponen halaman yang lebih berat (seperti pustaka jsPDF) untuk meminimalkan *chunk size* awal aplikasi.
3. **Penambahan Dark Mode**: Menyempurnakan sakelar *Dark Theme/Light Theme* (mengubah kumpulan variabel akar `--bg-primary`, `--text-primary`) yang dapat diaktifkan oleh pengguna secara manual di Navbar.
4. **Sistem Blog Sederhana**: Mengganti rute `#` pada menu navigasi **Blog** menjadi halaman berbasis MDX atau integrasi *Headless CMS* untuk menyajikan artikel edukasi dan optimasi SEO (Search Engine Optimization).
