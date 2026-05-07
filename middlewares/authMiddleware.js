const jwt = require('jsonwebtoken');

// Middleware 1: Verifikasi kelengkapan dan keabsahan JWT
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Ambil token dari HttpOnly cookie

    if (!token) {
        return res.status(403).json({ error: "Akses ditolak, Anda belum login!" });
    }

    try {
        // Dekripsi token menggunakan secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan payload user ke request untuk dipakai selanjutnya
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token tidak valid atau sudah kedaluwarsa!" });
    }
};

// Middleware 2: ROLE-BASED ACCESS CONTROL (RBAC)
exports.checkRole = (requiredRole) => {
    return (req, res, next) => {
        // Cek apakah role pengguna di token cocok dengan role yang diizinkan masuk
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Akses terlarang. Halaman ini khusus ${requiredRole}.` });
        }
        next(); // Lanjut ke proses berikutnya jika diizinkan
    };
};