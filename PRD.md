# Product Requirements Document (PRD)

## CetakKartu.com — Platform Cetak Kartu Identitas Digital

**Versi:** 2.0.0
**Tanggal:** 29 Juni 2026
**Repositori:** `jakazulham/card-generator`
**URL Produksi:** `https://cetakkartu.com`

---

## 1. Ringkasan Produk

CetakKartu.com adalah platform web modern (SPA) untuk membuat dan mencetak kartu identitas digital secara instan, gratis, dan profesional. Pengguna dapat memilih template kartu (NISN, BPJS, dan lainnya), mengisi data, melihat pratinjau langsung, dan mengunduh hasil dalam format PNG atau PDF siap cetak.

**Value Proposition:**
- 100% gratis — tanpa biaya tersembunyi
- Privasi terjamin — semua pemrosesan dilakukan di browser (client-side)
- Desain premium — template profesional siap pakai
- Cepat & instan — hasil dalam hitungan detik

---

## 2. Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| react-router-dom | 7 | Client-side routing |
| html2canvas | 1.4 | HTML to image capture |
| jsPDF | 2.5 | PDF generation |
| qrcode.react | 3.1 | QR Code generation |
| CSS3 | - | Styling (CSS variables, no Tailwind) |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Express | 4.21 | HTTP server & API |
| better-sqlite3 | 11.7 | Database (SQLite) |
| bcryptjs | 2.4 | Password hashing |
| jsonwebtoken | 9.0 | JWT authentication |
| multer | 1.4 | File upload handling |
| slugify | 1.6 | URL slug generation |

### Deployment
| Teknologi | Fungsi |
|-----------|--------|
| Docker | Containerization |
| Nginx | Web server & reverse proxy |
| Supervisord | Process manager (nginx + Node.js) |
| Coolify | Self-hosted deployment platform |

---

## 3. Arsitektur

```
Browser (React SPA)
  │
  ├── Client-side: Card Generation (html2canvas, jsPDF, QR Code)
  │
  └── API Request (/api/*)
       │
       ▼
  Nginx (port 80)
  ├── /api/* → proxy_pass 127.0.0.1:3001
  ├── /sitemap.xml → proxy_pass 127.0.0.1:3001
  ├── /uploads/* → proxy_pass 127.0.0.1:3001
  └── /* → SPA try_files /index.html
       │
       ▼
  Express API (port 3001)
  ├── Public Routes: /api/health, /api/posts, /api/categories
  ├── Auth Routes: /api/auth/login, /api/auth/me
  ├── Admin Routes: /api/admin/posts, /api/admin/categories
  └── Upload Route: /api/upload
       │
       ▼
  SQLite Database (/app/data/blog.db)
```

**Single-container deployment:** Frontend (Nginx + React build) + Backend (Express) berjalan dalam satu container via Supervisord.

---

## 4. Routes & Halaman

### Public Routes

| Path | Halaman | Deskripsi |
|------|---------|-----------|
| `/` | Home | Landing page: hero, template showcase, cara kerja, fitur, FAQ, CTA |
| `/buat-kartu` | Card Selector | Grid template kartu (6 jenis) dengan preview thumbnail |
| `/nisn` | Generator NISN | Form data siswa + 3 template + QR Code + export PNG/PDF |
| `/bpjs` | Generator BPJS | Form data peserta + 6 field + export PNG/PDF |
| `/about` | Tentang Kami | Misi, teknologi, privasi, link verifikasi |
| `/contact` | Kontak | WhatsApp + Email + jam operasional |
| `/disclaimer` | Disclaimer | Ketentuan layanan & batasan tanggung jawab |
| `/blog` | Blog Listing | Hero, kategori tabs, grid artikel, sidebar, pagination |
| `/blog/kategori/:slug` | Blog Kategori | Blog listing difilter per kategori |
| `/blog/:slug` | Artikel | Single post dengan SEO lengkap + related posts |

### Admin Routes (`/jaka`)

| Path | Halaman | Auth |
|------|---------|------|
| `/jaka/login` | Login Admin | Tidak |
| `/jaka` | Dashboard | JWT |
| `/jaka/posts/new` | Tulis Artikel Baru | JWT |
| `/jaka/posts/edit/:id` | Edit Artikel | JWT |
| `/jaka/categories` | Kelola Kategori | JWT |

---

## 5. Fitur Utama

### 5.1 Generator Kartu NISN
- 3 template premium (Classic Blue, Mint Green, Slate/Gold)
- QR Code otomatis berbasis NISN (10 digit numerik)
- Form: Nama, NISN, Tempat Lahir, Tanggal Lahir, Jenis Kelamin
- Validasi NISN (harus 10 digit angka)
- Pratinjau 3D flip real-time
- Export PNG (depan + belakang terpisah)
- Export PDF (2 halaman, ISO 7810 ID-1)
- Error notification dengan retry
- SEO content + FAQ (7 questions)
- Client-side processing (data tidak diunggah)

### 5.2 Generator Kartu BPJS
- 1 template BPJS Kesehatan
- Form: Nomor Kartu (11-13 digit), Nama, NIK (16 digit), Alamat (textarea), Tanggal Lahir, Faskes
- Validasi nomor kartu & NIK
- Pratinjau 3D flip real-time
- Export PNG & PDF
- SEO content + FAQ (4 questions)
- Section "Cara Kerja" (3 langkah)

### 5.3 Template Showcase
- Grid 2 kolom menampilkan 6 jenis kartu
- Preview thumbnail asli (stacked untuk multi-template)
- Kartu tersedia: NISN, BPJS (dapat diklik)
- Kartu mendatang: Pelajar, NUPTK, KIP/PIP, NRG (overlay "Segera Hadir")
- Tombol CTA "Lihat Semua Template"

### 5.4 Blog System
- Artikel dengan konten HTML (rich text)
- Kategori & tags
- Featured image
- SEO: OG tags, Twitter Cards, JSON-LD Article + BreadcrumbList, canonical URL
- Social share (WhatsApp, Facebook, X, copy link)
- Related posts
- Previous/Next navigation
- Pagination dengan ellipsis
- Skeleton loading state
- Sitemap dinamis (`/sitemap.xml`) — otomatis update untuk semua post & kategori

### 5.5 Admin Panel
- JWT Authentication (24h expiry)
- Dashboard dengan filter status (All/Published/Draft/Scheduled) + search
- Rich text editor (contentEditable) dengan toolbar:
  - Bold, Italic, Underline
  - Heading 2, Heading 3, Paragraph
  - Ordered List, Unordered List, Blockquote
  - Insert Link, Upload Image
- Auto-slug dari judul
- Scheduled publishing
- Upload featured image
- Manajemen kategori (CRUD)
- Delete confirmation modal
- Protected routes dengan redirect

### 5.6 Navigasi & Layout
- Desktop: Sticky header (Beranda, Kontak, Blog, tombol CTA "Buat Kartu")
- Mobile: Slide-in panel dari kanan (320px) dengan animasi
- Hamburger button animasi 3 garis → X
- Footer 3 kolom: Brand, Produk, Perusahaan
- Dark/Light mode toggle

### 5.7 SEO
- Setiap halaman punya title & meta description unik
- Open Graph tags (og:title, og:description, og:image, og:type, og:url)
- Twitter Card tags
- JSON-LD structured data (Article, BreadcrumbList)
- Canonical URL
- Dynamic sitemap.xml (semua static pages + blog posts + categories)
- robots.txt dengan sitemap reference

---

## 6. Database Schema (SQLite)

### Tabel: `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INTEGER PK | Auto increment |
| username | TEXT UNIQUE | Username login |
| password_hash | TEXT | Bcrypt hash |
| display_name | TEXT | Nama tampilan |
| created_at | DATETIME | Timestamp |

### Tabel: `categories`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INTEGER PK | Auto increment |
| name | TEXT | Nama kategori |
| slug | TEXT UNIQUE | URL slug |
| description | TEXT | Deskripsi |
| created_at | DATETIME | Timestamp |

### Tabel: `posts`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INTEGER PK | Auto increment |
| title | TEXT | Judul artikel |
| slug | TEXT UNIQUE | URL slug |
| content | TEXT | Konten HTML |
| excerpt | TEXT | Ringkasan |
| featured_image | TEXT | Path gambar |
| category_id | INTEGER FK | Referensi categories(id) |
| tags | TEXT | JSON array string |
| status | TEXT | 'draft', 'published', 'scheduled' |
| published_at | DATETIME | Waktu publish |
| created_at | DATETIME | Timestamp |
| updated_at | DATETIME | Timestamp |

---

## 7. API Endpoints

### Public API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | Daftar kategori + post_count |
| GET | `/api/posts` | Daftar post published (paginated, ?page=&limit=&category=) |
| GET | `/api/posts/:slug` | Single post + related + prev/next |
| GET | `/sitemap.xml` | Dynamic XML sitemap |

### Auth API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login (username, password) → JWT token |
| GET | `/api/auth/me` | Verifikasi token → user info |

### Admin API (JWT Protected)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/posts` | Daftar semua post (?page=&limit=&status=&search=) |
| GET | `/api/admin/posts/:id` | Detail post by ID |
| POST | `/api/admin/posts` | Buat post baru |
| PUT | `/api/admin/posts/:id` | Update post |
| DELETE | `/api/admin/posts/:id` | Hapus post |
| GET | `/api/admin/categories` | Daftar kategori |
| POST | `/api/admin/categories` | Buat kategori |
| PUT | `/api/admin/categories/:id` | Update kategori |
| DELETE | `/api/admin/categories/:id` | Hapus kategori |
| POST | `/api/upload` | Upload gambar (jpeg/png/gif/webp, max 5MB) |

---

## 8. Environment Variables

| Variable | Required | Default | Deskripsi |
|----------|----------|---------|-----------|
| `PORT` | No | `80` | Port web |
| `JWT_SECRET` | **Yes** | - | Secret key untuk JWT (random string panjang) |
| `ADMIN_USERNAME` | No | `admin` | Username login dashboard |
| `ADMIN_PASSWORD` | **Yes** | - | Password login dashboard |
| `DB_PATH` | No | `/app/data/blog.db` | Path file SQLite |

---

## 9. Deployment

### Docker (Single Container)
```bash
docker build -t cetakkartu .
docker run -d -p 80:80 \
  -e JWT_SECRET=random-string \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=secure-password \
  -v cetakkartu-data:/app/data \
  -v cetakkartu-uploads:/app/uploads \
  cetakkartu
```

### Docker Compose
```bash
docker compose up -d
```

### Coolify
1. New Service → Docker Compose
2. Pilih repository `jakazulham/card-generator`
3. Isi environment variables (JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD)
4. Deploy

**PENTING:** Gunakan Docker Compose (bukan Dockerfile) agar volume `cetakkartu-data` dan `cetakkartu-uploads` terpasang otomatis. Data artikel dan upload gambar akan persisten meskipun container di-redeploy.

---

## 10. Backup & Maintenance

### File yang perlu di-backup:
- `/app/data/blog.db` — Database (artikel, kategori, user)
- `/app/uploads/` — Gambar featured image & upload

### Cara backup:
```bash
# Copy dari container
docker cp <container>:/app/data/blog.db ./backup-$(date +%Y%m%d).db
docker cp <container>:/app/uploads ./backup-uploads-$(date +%Y%m%d)

# Atau dari Docker volume
docker run --rm -v cetakkartu-data:/data -v $(pwd):/backup alpine \
  cp /data/blog.db /backup/
```

---

## 11. Fitur Mendatang (Roadmap)

- [ ] Kartu Pelajar — template identitas sekolah
- [ ] Kartu NUPTK — guru & tenaga pendidik
- [ ] Kartu KIP/PIP — bantuan pendidikan
- [ ] Kartu NRG — registrasi guru
- [ ] Export/Import database di admin panel
- [ ] Multi-user admin dengan role
- [ ] Statistik pengunjung blog

---

## 12. Changelog

### v2.0.0 (Juni 2026)
- Blog system dengan admin panel (CRUD posts & categories)
- Generator kartu BPJS
- Template showcase page (`/buat-kartu`)
- Mobile navigation redesign (slide-in panel)
- Dynamic sitemap.xml
- SEO optimization (title, description, OG, Twitter Cards, JSON-LD)
- Single-container Docker deployment
- Dark mode support
- Upload dengan original filename (spaces → dashes)
- UI improvements (footer logo, home template cards)

### v1.0.0 (Juni 2026)
- Generator kartu NISN dengan 3 template
- QR Code generation
- PNG & PDF export
- 3D card flip preview
- Landing page
- About, Contact, Disclaimer pages
- Responsive design
