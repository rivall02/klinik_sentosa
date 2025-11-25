# Website Klinik Sentosa

Selamat datang di repositori resmi Website Klinik Sentosa. Proyek ini adalah aplikasi web modern yang dibangun untuk mengelola berbagai aspek operasional klinik, mulai dari manajemen pasien, antrian, hingga pelaporan.

## ✨ Fitur Utama

Aplikasi ini dirancang dengan arsitektur berbasis peran (*role-based*) untuk memenuhi kebutuhan setiap pengguna:

- **👨‍⚕️ Admin:**
  - **Manajemen Data Pasien:** Mengelola informasi dan rekam medis pasien.
  - **Verifikasi Pasien:** Memvalidasi data pasien baru yang terdaftar.
  - **Manajemen Antrian:** Mengatur dan memonitor alur antrian pasien secara *real-time*.
  - **Laporan & Analitik:** Menghasilkan laporan operasional untuk evaluasi.

- **🩺 Dokter:**
  - **Dashboard Konsultasi:** Mengakses jadwal dan melakukan sesi konsultasi dengan pasien.
  - **Manajemen Jadwal:** Mengatur ketersediaan jadwal praktik.
  - **Antrian Pasien:** Melihat daftar antrian pasien yang akan dikonsultasi.

- **💊 Apoteker:**
  - **Manajemen Obat:** Mengelola stok dan informasi obat.
  - **Pengambilan & Pembayaran Obat:** Memproses resep dan transaksi pembayaran dari pasien.
  - **Dasbor Farmasi:** Memantau aktivitas dan kebutuhan farmasi.

- **👑 Owner:**
  - **Dasbor Utama:** Memberikan ringkasan analitik dan metrik kunci klinik.
  - **Manajemen Staf:** Mengelola data dan peran staf.
  - **Laporan Keuangan & Operasional:** Mengakses laporan mendalam untuk pengambilan keputusan strategis.
  - **Pengaturan Klinik:** Mengonfigurasi parameter operasional.

- **🔐 Otentikasi & Antrian Pasien:**
  - **Pendaftaran & Login:** Sistem pendaftaran dan login yang aman untuk semua pengguna.
  - **Sistem Antrian:** Pasien dapat mendaftar dan mendapatkan nomor antrian secara online.

## 🚀 Teknologi yang Digunakan

- **Framework Utama:** [React](https://react.dev/) dengan [Vite](https://vitejs.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](httpsg://ui.shadcn.com/)
- **Backend & Database:** [Supabase](https://supabase.io/)
- **Manajemen State:** Komponen & *Hooks* React
- **Routing:** [React Router](https://reactrouter.com/)

## 🛠️ Panduan Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### **1. Prasyarat**

Pastikan Anda telah menginstal perangkat lunak berikut:
- [Node.js](https://nodejs.org/en) (versi 18.x atau lebih tinggi)
- [Bun](https://bun.sh/) (opsional, sebagai alternatif `npm`)

### **2. Kloning Repositori**

```bash
git clone https://github.com/nama-pengguna-anda/klinik-sentosa.git
cd klinik-sentosa
```

### **3. Instalasi Dependensi**

Anda bisa menggunakan `npm` atau `bun` untuk menginstal semua dependensi yang dibutuhkan.

```bash
# Menggunakan npm
npm install

# Atau menggunakan bun
bun install
```

### **4. Konfigurasi Lingkungan**

Proyek ini memerlukan koneksi ke Supabase. Kunci API Supabase Anda **tidak boleh disimpan langsung di kode**. Gunakan *environment variables* untuk mengamankannya.

Salin file `.env.example` menjadi `.env.local` dan **isikan kredensial Supabase Anda di sana**:

```
VITE_SUPABASE_URL="URL_SUPABASE_ANDA"
VITE_SUPABASE_ANON_KEY="KUNCI_ANON_SUPABASE_ANDA"
```

**Penting:** Pastikan file `.env.local` Anda tidak dikomit ke repositori git. File `.gitignore` sudah dikonfigurasi untuk ini.

Anda bisa mendapatkan kredensial ini dari dasbor proyek Supabase Anda.

### **5. Menjalankan Server Pengembangan**

Setelah instalasi dan konfigurasi selesai, jalankan server pengembangan lokal.

```bash
# Menggunakan npm
npm run dev

# Atau menggunakan bun
bun run dev
```

Buka browser Anda dan akses [http://localhost:5173](http://localhost:5173) untuk melihat aplikasi berjalan.

## 🔑 Akses Login Akun Staff (Untuk Development)

Anda dapat menggunakan akun bawaan berikut untuk masuk dan menguji fungsionalitas berdasarkan peran:

- **Owner**
  - **Email:** `owner@gmail.com`
  - **Password:** `owner123`

- **Admin**
  - **Email:** `admin@gmail.com`
  - **Password:** `admin123`

- **Dokter**
  - **Email:** `dokter@gmail.com`
  - **Password:** `dokter123`

- **Apoteker**
  - **Email:** `apoteker@gmail.com`
  - **Password:** `apoteker123`

## 📁 Struktur Folder

Berikut adalah gambaran umum struktur folder proyek ini:

```
klinik-sentosa/
├── src/
│   ├── assets/         # Aset statis seperti gambar dan ikon
│   ├── components/     # Komponen UI yang dapat digunakan kembali
│   ├── hooks/          # Custom hooks untuk logika bersama
│   ├── lib/            # Konfigurasi library (termasuk Supabase client)
│   ├── pages/          # Komponen utama untuk setiap halaman/rute
│   └── ...
├── public/             # File publik yang tidak diproses oleh Vite
├── vite.config.ts    # Konfigurasi Vite
└── ...
```

## ⚠️ Catatan Arsitektur dan Area Peningkatan

Setelah tinjauan kode mendalam, teridentifikasi beberapa area kritis dan peluang peningkatan dalam arsitektur proyek ini. Penting untuk dicatat bahwa aplikasi ini fungsional, namun mengatasi poin-poin ini akan meningkatkan stabilitas, keamanan, performa, dan pemeliharaan jangka panjang.

### 1. Inkonsistensi Penamaan Status
Berbagai string status digunakan di seluruh basis kode dan database (contoh: 'menunggu', 'sedang menunggu', 'sedang_konsultasi'). Inkonsistensi ini telah menjadi sumber *bug* dan kebingungan.
*   **Rekomendasi:** Definisikan satu set *konstanta* atau *enum* TypeScript untuk semua status aplikasi dan pastikan semua bagian kode menggunakan definisi terpusat ini.

### 2. Kunci API Supabase Ter-hardcode
Kunci Supabase URL dan `anon` ditemukan ter-hardcode langsung di `src/lib/supabaseClient.ts`. Ini merupakan risiko keamanan dan praktik yang buruk untuk manajemen konfigurasi lingkungan.
*   **Rekomendasi:** Pindahkan kunci-kunci ini sepenuhnya ke *environment variables* (file `.env`). Pastikan file `.env` tidak pernah dikomit ke repositori publik.

### 3. Pengambilan Data Manual (Anti-Pattern)
Meskipun proyek telah menginstal dan mengkonfigurasi `@tanstack/react-query` (*QueryClientProvider* terlihat di `src/App.tsx`), sebagian besar atau seluruh pengambilan data masih dilakukan secara manual menggunakan `useEffect` dan `useState`.
*   **Rekomendasi:** Manfaatkan `useQuery` dan `useMutation` dari `@tanstack/react-query` untuk semua operasi pengambilan data. Ini akan secara drastis menyederhanakan manajemen *state* (loading, error), menyediakan *caching* otomatis, *refetching*, dan optimisasi performa lainnya.

### 4. Komponen Monolitik
Beberapa komponen, seperti `src/pages/admin/PatientData.tsx`, teridentifikasi sangat besar, menggabungkan logika pengambilan data, manajemen *state*, dan rendering UI yang kompleks.
*   **Rekomendasi:** Pecah komponen-komponen besar ini menjadi komponen yang lebih kecil dan lebih fokus (contoh: komponen untuk tabel, komponen untuk formulir, komponen untuk dialog) untuk meningkatkan keterbacaan dan pemeliharaan.

---

Terima kasih telah berkontribusi dan menggunakan aplikasi Klinik Sentosa!