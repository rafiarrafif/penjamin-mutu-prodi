# Design System & Screen Blueprint (`penjamin-mutu-prodi`)

Dokumen ini adalah **patokan desain resmi** (*single source of truth*) untuk seluruh antarmuka frontend aplikasi **Penjaminan Mutu Prodi (SIMPATI)** agar tampil konsisten, bersih, dan sangat mirip dengan mockup referensi (19 layar).

> Gunakan dokumen ini bersama [`FRONTEND_IMPLEMENTATION_PLAN.md`](./FRONTEND_IMPLEMENTATION_PLAN.md) (kontrak API, role, dan validasi) serta [`design-reference.html`](./design-reference.html) (preview visual interaktif yang bisa dibuka langsung di browser).

---

## 1. Karakter Visual & Prinsip Desain

1. **Academic Institutional Clarity**: Estetika sistem penjaminan mutu akademik yang tenang, terstruktur, dan berorientasi data/dokumen—bukan dashboard neon atau SaaS yang terlalu ramai.
2. **Cool Ice-Blue Canvas + Crisp White Surfaces**: Latar belakang halaman menggunakan biru es sangat lembut (`#F5FAFE`), sedangkan sidebar, topbar, tabel, dan kartu menggunakan putih murni (`#FFFFFF`) dengan garis tepi tipis `1px solid #E4E7EC`.
3. **Dual-Blue Brand Hierarchy**:
   - **Deep Cerulean (`#005C7C`)**: Khusus elemen *brand impact* pada Landing Page (tombol CTA hero, perisai ilustrasi, aksen logo).
   - **Calm Action Cerulean (`#4E9AC7`)**: Warna tombol aksi utama di dalam aplikasi (*Simpan*, *Masuk*, *Kirim*, *Tambah Data*, *Submit Review*).
4. **Quiet Chrome, Strong Content**: Navigasi aktif di sidebar tidak memakai warna mencolok, melainkan pill abu-abu netral (`#E8E9EC`) dengan teks gelap (`#111827`) agar fokus mata tetap tertuju pada tabel dan form kerja.
5. **High-Contrast Dark Anchor**: Nomor halaman pagination aktif (`1`), progres bar utama (`24,0%`), dan heading penting menggunakan `#18181B` untuk jangkar visual yang tegas.
6. **Soft Semantic Banners**:
   - Catatan/aturan/konteks memakai kotak abu-abu lembut (`#ECEEEF`), **bukan** kuning/biru terang yang mengganggu.
   - Pesan error inline memakai latar rose pastel (`#FEE8EA`) dengan teks merah tua (`#B42318`).

---

## 2. Design Tokens (Color, Typography, Radius, Elevation)

Semua token berikut sudah disiapkan di [`frontend/src/styles/design-tokens.css`](./frontend/src/styles/design-tokens.css).

### 2.1 Color Palette

| Token CSS | Hex | Penggunaan |
| --- | --- | --- |
| `--bg-canvas` | `#F5FAFE` | Latar belakang utama aplikasi, login, dan hero landing |
| `--bg-surface` | `#FFFFFF` | Kartu, tabel, sidebar, topbar, modal, input |
| `--bg-surface-tinted` | `#EDF6FD` | Kartu ringkasan user/role di sidebar, feature card di landing |
| `--bg-subtle` | `#ECEEEF` | Banner info/aturan, header tabel (`#EAECEF`), pill netral |
| `--bg-nav-active` | `#E8E9EC` | Item menu sidebar yang sedang aktif |
| `--bg-danger-soft` | `#FEE8EA` | Banner error inline pada form & login |
| `--border-default` | `#E4E7EC` | Border kartu, tabel, sidebar, topbar, input |
| `--border-strong` | `#D0D5DD` | Border tombol sekunder, input hover/focus |
| `--border-danger-soft` | `#F5C2C7` | Border banner error inline |
| `--text-primary` | `#18181B` | Judul halaman, KPI angka besar, heading tabel, pagination aktif |
| `--text-secondary` | `#3F3F46` | Isi sel tabel, label form, teks sidebar |
| `--text-muted` | `#667085` | Subjudul halaman, breadcrumb, helper text, footer |
| `--text-subtle` | `#98A2B3` | Placeholder input, label micro uppercase |
| `--brand-deep` | `#005C7C` | CTA hero landing, perisai/crest logo, link landing |
| `--brand-deep-hover` | `#004B65` | Hover state tombol CTA hero |
| `--brand-action` | `#4E9AC7` | Tombol aksi utama aplikasi (`Masuk`, `Simpan`, `Submit`, `Tambah`) |
| `--brand-action-hover` | `#3D88B5` | Hover state tombol aksi utama aplikasi |
| `--text-danger` | `#B42318` | Teks error inline & status `reject` |
| `--bg-success-soft` | `#ECFDF3` | Badge status `accept` / `verified` |
| `--text-success` | `#067647` | Teks badge `accept` / `verified` |
| `--bg-warning-soft` | `#FFFAEB` | Badge status `hold` / `revision` |
| `--text-warning` | `#B54708` | Teks badge `hold` / `revision` |

### 2.2 Typography

- **Primary Font**: `'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
- **Monospace Font**: `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace` (untuk kode dokumen, slug, ID, tipe file)
- **Tabular Numbers**: Wajib aktif (`font-variant-numeric: tabular-nums`) pada KPI angka, persentase (`24,0%`), skor (`85,00`), tanggal, dan tabel.

| Role | Size / Line-Height | Weight | Tracking | Contoh Penggunaan |
| --- | --- | --- | --- | --- |
| Display Hero | `40px` / `1.12` | `700` | `-0.025em` | `"Mutu terjaga. Bukti tertata."` |
| Page Title (`H1`) | `22px` / `1.28` | `700` | `-0.015em` | Judul setiap halaman app shell |
| KPI Large | `28px` / `1.15` | `700` | `-0.02em` | Angka KPI utama (`24,0%`, `85,00`) |
| KPI Card | `20px` / `1.2` | `700` | `-0.01em` | Angka ringkas pada kartu 3–6 kolom |
| Card Title (`H2`) | `15px` / `1.4` | `600` | `-0.01em` | Judul panel kanan, judul tabel/form |
| Body Default | `13.5px` / `1.5` | `400` | `0` | Paragraf, sel tabel, helper copy |
| Label / Nav | `13px` / `1.4` | `500` | `0` | Item sidebar, label input, tombol |
| Table Head / Micro | `11.5px` / `1.3` | `600` | `0.02em` | Header tabel, eyebrow section |

### 2.3 Spacing, Radius & Elevation

- **Layout Radius**:
  - Card / Panel / Table container: `8px` (`rounded-lg`)
  - Input / Select / Button / Sidebar item: `6px` (`rounded-md`)
  - Status Pill / Tag: `9999px` (`rounded-full`) atau `4px` (`rounded`) untuk badge kode/tabel
- **Elevation**:
  - Hampir semua kartu di workspace bersifat **flat** (`box-shadow: none`, mengandalkan `1px solid #E4E7EC`).
  - Pengecualian hanya **Login Card** (`0 8px 24px -8px rgba(15, 23, 42, 0.08)`) dan **Dropdown/Dialog** (`0 12px 32px -8px rgba(15, 23, 42, 0.12)`).
- **Spacing Scale**:
  - Sidebar width: `248px` (desktop), drawer slide-over di mobile (`< 1024px`)
  - Topbar height: `52px`
  - Main content padding: `20px 28px` (desktop), `16px` (mobile), max-width `1360px`
  - Gap antar kartu/section: `16px` (`gap-4`)
  - Padding dalam kartu standar: `16px 20px`

---

## 3. Tiga Master Layout Shell

### Shell A — Public Landing Page (Referensi: Tile 19)
1. **Topbar Publik** (`56px`, latar `#FFFFFF`, border bawah `#E4E7EC`):
   - Kiri: Logo crest + wordmark aplikasi (`SIMPATI` + sub-caption `Penjaminan Mutu Prodi`).
   - Kanan: 3–4 link teks ringan (`Beranda`, `Panduan`, `Masuk` sebagai link/tombol ringan).
2. **Hero Section** (latar `#F5FAFE`, padding vertikal `64px–80px`, grid 2 kolom `1.1fr 0.9fr`):
   - Kiri: Eyebrow uppercase (`SISTEM PENJAMINAN MUTU PRODI`), Display Headline 2 baris (`Mutu terjaga.` / `Bukti tertata.`), subjudul ringkas 2 baris (`#667085`), tombol utama `#005C7C` (`Masuk ke Sistem` / `Mulai Sekarang`), dan link sekunder kecil di bawah tombol.
   - Kanan: Ilustrasi geometris flat vektor (kartu checklist dokumen putih + kartu mini grafik batang + perisai biru tua `#005C7C` dengan tanda centang).
3. **Feature Grid Section** (latar `#FFFFFF`, border atas `#E4E7EC`):
   - Header baris: Judul section kiri (`Fitur Utama`) + link kecil kanan.
   - Grid 3 kolom sama lebar (`gap-4`): Kartu latar `#EDF6FD` / `#F4F9FD`, border `#DCEBF7`, radius `8px`, padding `20px`, ikon kotak kecil kiri atas, judul bold `14px`, deskripsi 2 baris `#667085`.
4. **Minimal Footer**: Copyright kiri (`© 2026 SIMPATI — Penjaminan Mutu Prodi`), teks versi/institusi kanan.

### Shell B — Authentication / Login Page (Referensi: Tile 1)
1. **Topbar Minimal**: Logo di kiri, latar `#FFFFFF`, border bawah `#E4E7EC`.
2. **Canvas `#F5FAFE`** mengisi sisa tinggi layar (`min-h-[calc(100vh-104px)]`), grid 2 kolom terpusat (`max-w-[920px]`):
   - Kiri: Headline 2 baris (`24px` bold) + subjudul singkat (`#667085`).
   - Kanan: **Login Card** (`max-w-[380px]`, `#FFFFFF`, border `#E4E7EC`, radius `10px`, shadow lembut, padding `24px`):
     - Judul `Masuk ke Akun` + subjudul kecil.
     - Input fields bertumpuk (`Email` + `Password` dengan toggle show/hide jika login kredensial, atau status informasi akun Google terverifikasi).
     - Baris utilitas: Checkbox kiri (`Ingat saya`) + link kanan.
     - **Rose Error Banner** (`#FEE8EA`, teks `#B42318`) muncul inline di atas tombol jika gagal autentikasi.
     - Tombol `Masuk` (`#4E9AC7`, putih, radius `6px`, rata kanan atau full-width).
     - Divider horizontal dengan label tengah `atau` / `OR`.
     - Tombol full-width **Masuk dengan Google** (`#4E9AC7` atau outline dengan ikon Google sesuai implementasi OAuth backend `POST /accounts/auth/request/google`).
3. **Footer Minimal**: Link bantuan kiri, copyright kanan.

### Shell C — Authenticated Workspace App Shell (Referensi: Tiles 2–18)
Digunakan di seluruh halaman internal (`/dashboard`, `/profile`, `/admin/*`, `/director/*`, `/submissions/*`, `/scoring/*`, `/logs`):
1. **Left Sidebar (`248px`, `#FFFFFF`, border kanan `#E4E7EC`)**:
   - **Brand Header** (`52px`): Ikon + nama sistem & sub-label prodi.
   - **Context / User Summary Card** (opsional seperti Tile 2–3): Kotak `#EDF6FD`, border `#D7EAF8`, radius `8px`, padding `10px 12px`, menampilkan nama akun, email singkat, dan role badge.
   - **Grouped Navigation**:
     - Label grup uppercase `10.5px` (`UTAMA`, `MANAJEMEN`, `PENILAIAN`, `SISTEM`) warna `#98A2B3`.
     - Item nav (`height: 34px`, `padding: 0 10px`, `rounded-md`, `13px`, ikon `16px` di kiri).
     - State aktif: `background: #E8E9EC; color: #18181B; font-weight: 600;` (tanpa aksen biru mencolok).
   - **Sidebar Bottom Info**: Garis pemisah `#E4E7EC` + info role aktif & tombol keluar/sesi.
2. **Sticky Topbar (`52px`, `#FFFFFF`, border bawah `#E4E7EC`)**:
   - Kiri: Hamburger (mobile) + Breadcrumb tipis (`Dashboard / Manajemen Akun`).
   - Kanan: Indikator status/role, nama pengguna + avatar bulat kecil (`28px`), tombol `Keluar`.
3. **Main Content Canvas (`#F5FAFE`, padding `20px 28px`)**:
   Urutan vertikal standar di setiap halaman:
   1. **Back Link** (opsional di halaman sub/detail): `← Kembali ke ...` (`12.5px`, `#667085`).
   2. **Page Header**:
      - Kiri: `H1` (`22px` bold `#18181B`) + deskripsi 1 baris (`13px` `#667085`).
      - Kanan: Tombol aksi utama `#4E9AC7` (`+ Tambah ...` / `Ekspor`) atau badge status.
   3. **Sub-header Utility Row**: Label section kiri + teks metadata/periode/total kanan.
   4. **Context / Rule Banner** (opsional): Kotak `#ECEEEF`, radius `6px`, padding `10px 14px`, menampilkan judul tebal singkat + penjelasan aturan/catatan.
   5. **Body Grid** (pilih salah satu pola di Bagian 4).
   6. **Footer**: Teks kecil `#98A2B3` kiri & kanan.

---

## 4. Pola Konten & Spesifikasi Komponen

### Pola 1: Split Workspace (`1fr` Utama + `340px` Panel Kanan)
*Referensi: Tiles 2, 3, 4, 5, 7, 8, 10, 12, 14*
- **Kolom Kiri (`minmax(0, 1fr)`)**:
  - Bisa berisi 1 kartu besar atau tumpukan kartu (`gap: 16px`):
    - **Search & Filter Toolbar** + **Data Table** + **Pagination** + **Bottom Summary/Rule Card** (Tiles 3, 4, 5, 7).
    - **Form Utama** dengan field bertumpuk + inline rose error banner + tombol aksi (Tile 2).
    - **Detail Info Card** + **File Dropzone / Document Preview Box** + **History Table** (Tiles 10, 12, 14).
- **Kolom Kanan (`340px`, sticky pada desktop)**:
  - **Inspector / Quick-Form Card** (`#FFFFFF`, border `#E4E7EC`, radius `8px`, padding `18px`):
    - Judul `14.5px` semibold + subjudul kecil.
    - Input/Select/Textarea bertumpuk (`gap: 12px`).
    - Radio group atau checkbox list untuk status/opsi (Tiles 3, 4, 12).
    - **Note Box (`#ECEEEF`)** sebelum tombol submit untuk penjelasan dampak aksi.
    - Action bar: Tombol `#4E9AC7` (`Simpan` / `Submit` / `Update`) + tombol teks/ghost (`Batal` / `Reset`).
  - Dapat disertai kartu tambahan di bawahnya: **Checklist / Metadata Card** atau **Formula / Reference Mini-Table** (Tile 8, 14).

### Pola 2: Full-Width KPI + Filter + Data Table
*Referensi: Tiles 6, 9, 11, 13, 15, 16, 17, 18*
1. **KPI Strip** (opsional di atas toolbar):
   - **3–4 Kartu Sejajar** (`grid-cols-2 lg:grid-cols-4`, gap `12px`): putih, border `#E4E7EC`, radius `8px`, padding `14px 16px`, label atas `12px #667085`, angka `20px–22px` bold `#18181B` (`tabular-nums`), caption kecil di bawah.
   - **6 Kartu Mini Sejajar** (Tile 15): label status/kategori di atas + angka bold di bawah.
   - **Progress + Breakdown Row** (Tiles 15 & 16): Kartu kiri menampilkan angka persentase besar (`24,0%` atau `85,00`) + progress bar `#18181B` di atas track `#E4E7EC`; kartu kanan menampilkan ringkasan atau mini-tabel skor.
2. **Search & Filter Toolbar**:
   - Baris putih/transparan (`gap: 8px`): Input search (`flex-1`, ikon kaca pembesar di kiri), `1–3` dropdown filter (`height: 34px`, radius `6px`, border `#E4E7EC`, bg `#FFFFFF`).
3. **Data Table Container**:
   - Pembungkus putih (`#FFFFFF`, border `#E4E7EC`, radius `8px`, `overflow: hidden`).
   - Header (`thead`): Latar `#EAECEF`, teks `11.5px` semibold `#475467`, padding `10px 14px`.
   - Rows (`tbody tr`): Border bawah `1px solid #F0F2F5`, hover `#F9FBFD`, padding `11px 14px`, teks `13px`.
   - Kolom aksi di ujung kanan: Tombol outline kecil (`height: 28px`, padding `0 10px`, border `#D0D5DD`, bg `#FFFFFF`, radius `5px`, `12px` medium).
4. **Pagination Bar**:
   - Kiri: `Menampilkan 1–6 dari 18 data` (`12.5px #667085`).
   - Kanan: Tombol `Previous`, kotak nomor aktif (`width: 28px; height: 28px; background: #18181B; color: #FFFFFF; border-radius: 6px`), nomor non-aktif (`#FFFFFF`, border `#E4E7EC`), `Next`.
5. **Bottom Context Cards** (`grid-cols-1 md:grid-cols-2/3`, gap `12px` atau banner `#ECEEEF`):
   - Berisi catatan kebijakan, panduan pengisian, atau ringkasan audit di bawah pagination.

### Spesifikasi Komponen Kunci
- **Input & Select**: `height: 36px`, `padding: 0 12px`, `border: 1px solid #D0D5DD`, `border-radius: 6px`, `background: #FFFFFF`, `font-size: 13px`. Focus ring: `border-color: #4E9AC7; box-shadow: 0 0 0 3px rgba(78, 154, 199, 0.16)`. Disabled/Read-only (seperti field terkunci di Tile 2 & 10): `background: #EAECEF; color: #475467;`.
- **File Dropzone** (Tiles 10, 12): `border: 1.5px dashed #D0D5DD`, `background: #FAFBFD`, `border-radius: 8px`, padding `24px`, ikon upload + judul + keterangan ekstensi & ukuran maksimal + tombol `Pilih File`.
- **Buttons**:
  - `Primary (App)`: `bg: #4E9AC7`, hover `#3D88B5`, teks `#FFFFFF`, `height: 34px`, `padding: 0 14px`, `rounded-md`, `13px` semibold.
  - `Primary (Landing Hero)`: `bg: #005C7C`, hover `#004B65`, teks `#FFFFFF`, `height: 40px`, `padding: 0 20px`, `rounded-md`.
  - `Secondary / Outline`: `bg: #FFFFFF`, `border: 1px solid #D0D5DD`, hover `#F9FAFB`, teks `#344054`.
  - `Ghost / Cancel`: transparan, teks `#667085`, hover `#F2F4F7`.
  - `Danger`: `bg: #D92D20` atau soft `#FEE8EA` dengan teks `#B42318` (untuk konfirmasi hapus).

---

## 5. Pemetaan 19 Layar Referensi ke Aplikasi

| Tile | Pola Layar pada Referensi | Komponen Dominan | Target Route / Fitur di Project |
| --- | --- | --- | --- |
| **1** | Login Split Screen | Editorial kiri + White Auth Card + Rose Alert + Primary & Google OAuth | `/login` (`routes/login.tsx`) |
| **2** | Form Profil / Akun + Info Kanan | Locked field (`#EAECEF`) + form bertumpuk + rose banner + kartu info kanan | `/profile` (`routes/profile.tsx`) |
| **3** | Tabel Detail + Inspector Radio Kanan | Tabel 6 baris + pagination `#18181B` + kartu detail bawah + panel kanan radio/note | `/admin/categories` atau Detail Kategori & PIC |
| **4** | Manajemen Daftar + Filter Checklist Kanan | Banner `#ECEEEF` + tabel + pagination + kartu aturan bawah + panel filter/form kanan | `/admin/departments` (Departemen & PIC) |
| **5** | Master + Sub-Tabel Relasi + Form Kanan | Banner `#ECEEEF` + tabel atas + 2 sub-tabel relasi + form kanan | Detail Departemen / PIC Requirements |
| **6** | Manajemen Pengguna Full-Width | Search & filter + tabel 8 kolom + pagination + form create/edit 3 kolom di bawah | `/admin/accounts` (`routes/admin/accounts.tsx`) |
| **7** | Master Role/Periode + Form Kanan | Banner `#ECEEEF` + tabel + kartu kebijakan checkbox bawah + panel form kanan | `/director/provisions` atau Periode & Frekuensi |
| **8** | Konfigurasi Rumus / Scoring Split | Form rumus & variabel kiri + kartu panduan, mini-tabel variabel, status kanan | Modul Scoring Methods & Formula |
| **9** | Dashboard / Daftar Pengajuan | 4 KPI cards + search/filter bar + tabel 6 kolom + pagination + banner bawah | `/dashboard` (`routes/dashboard.tsx`) |
| **10** | Form Pengajuan + Upload Bukti | Kartu metadata terkunci (`#EAECEF`) + form input + dropzone + tabel lampiran + panel kanan | Form Data Entry & Upload Bukti |
| **11** | Antrean Verifikasi | 3 KPI cards + search/filter + tabel dengan tombol aksi outline + pagination + 2 banner bawah | Verifikasi Submissions (`verificator`) |
| **12** | Detail & Review Verifikasi | Banner `#ECEEEF` + info detail + tabel file + box preview dokumen + log riwayat + panel keputusan radio kanan | Detail Review Submission (`verificator`) |
| **13** | Ringkasan Evaluasi / Audit | Banner `#ECEEEF` + 4 KPI cards + toolbar + tabel + pagination + 3 kartu ringkasan bawah | Ringkasan Evaluasi / Scoring Overview |
| **14** | Detail Penilaian Skor | Banner `#ECEEEF` di dalam kartu + info detail + tabel input variabel skor + kartu hasil skor kanan (`85,00`, `4,00`) | Input & Kalkulasi Scoring Result |
| **15** | Dashboard Ketercapaian Mutu | Toolbar + KPI Progress Bar (`24,0%`) + 6 kartu metrik status + tabel + pagination + banner | Dashboard Ketercapaian Prodi (`director`) |
| **16** | Rekap Skor Kinerja | Toolbar + kartu skor besar (`85,00`) + mini-tabel bobot kanan + tabel rincian + 2 banner bawah | Rekap Hasil Penilaian (`director`) |
| **17** | Daftar Log / Notifikasi | Filter bar + tabel riwayat 4 kolom + pagination + banner catatan | Log Aktivitas / Notifikasi (`logs`) |
| **18** | Audit Trail + Diff Detail | Search/filter + tabel change logs + panel detail perubahan (*Before / After*) di bawah | Audit Trail (`change_logs`) |
| **19** | Landing Page Publik | Topbar + Hero `#F5FAFE` (`Mutu terjaga. Bukti tertata.`) + SVG Ilustrasi + 3 Feature Cards | `/` (`routes/index.tsx` jika publik) |

---

## 6. Aturan Kepatuhan Implementasi

1. **Jangan membuat data palsu di produksi**: Sesuai `FRONTEND_IMPLEMENTATION_PLAN.md`, sebelum endpoint `GET` backend tersedia, tampilkan empty state atau ringkasan akun aktif tanpa metrik dummy.
2. **Responsif & Aksesibilitas**:
   - Sidebar otomatis menjadi drawer slide-over pada layar `< 1024px`.
   - Tabel dibungkus container `overflow-x-auto` agar tidak memicu horizontal overflow di viewport kecil.
   - Error validasi backend (`errors[]`) selalu dipetakan ke bawah field terkait selain toast/rose banner, tidak hanya mengandalkan warna.
