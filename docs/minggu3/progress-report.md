# Progress Report Minggu 3

## Status
Pengujian keamanan awal telah dilakukan menggunakan SAST/SCA, DAST, dan manual testing.

## Yang Sudah Selesai
- npm audit menunjukkan 0 vulnerabilities.
- Manual testing autentikasi, otorisasi, session management, input validation, password policy, dan rate limiting.
- Vulnerability report minimal 5 temuan.
- Perbaikan role manipulation, input validation, RBAC, JWT cookie, dan rate limiter.

## Hambatan
- HttpOnly cookie membuat token tidak tampil di frontend, namun ini merupakan desain keamanan yang benar.
- Pengujian OWASP ZAP membutuhkan server localhost tetap berjalan selama proses scanning.
- Data user masih temporary storage sehingga akun hilang ketika server restart.

## Rencana Minggu 4
- Menambahkan dokumentasi final.
- Melakukan hardening tambahan.
- Menambahkan audit log atau database permanen apabila diperlukan.