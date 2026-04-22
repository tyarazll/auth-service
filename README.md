# Layanan Autentikasi Terpusat (Auth API)

Layanan API *microservice* untuk autentikasi dan otorisasi pengguna. Proyek ini dibangun dengan menerapkan prinsip *Secure Software Development Life Cycle* (S-SDLC).

## Fitur Keamanan Terintegrasi
- **Password Hashing:** Menggunakan algoritma `bcrypt`.
- **Session Management:** Stateless JWT dengan `httpOnly` cookie.
- **SQL Injection Prevention:** Penggunaan ekstensif *Parameterized Queries*.
- **Brute-Force Protection:** *Rate Limiting* berbasis Redis di API Gateway.
- **Fail Securely:** Global Error Handler (tidak membocorkan *stack trace* ke publik).

## Panduan Setup Lokal
1. Lakukan *clone repository* ini ke komputer lokal.
2. Install dependencies menggunakan perintah: `npm install`
3. Gandakan file `.env.example` menjadi `.env`.
   **(PERINGATAN: Jangan pernah melakukan commit pada file `.env` yang berisi kredensial asli!)**
4. Isi variabel di dalam `.env` dengan kredensial database lokal Anda.
5. Jalankan server: `npm run dev`

##  Aturan Kolaborasi Tim
- **Gunakan Branching:** Dilarang melakukan *push* langsung ke cabang `main`. Gunakan format `feature/nama-fitur`.
- **Code Review:** Lakukan *Pull Request* dan pastikan tidak ada *hardcoded credential* sebelum menggabungkan kode.