const jwt = require('jsonwebtoken');

// Verifikasi apakah pengguna punya JWT yang valid
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Ambil token dari cookie
    if (!token) {
        return res.status(403).json({ error: "Akses ditolak, Anda belum login!" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan data pengguna ke request
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token tidak valid atau kedaluwarsa!" });
    }
};

// 4. ROLE-BASED ACCESS CONTROL (Tugas Laporan!)
exports.checkRole = (requiredRole) => {
    return (req, res, next) => {
        // Cek apakah role pengguna cocok dengan role yang disyaratkan
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Akses ditolak, Anda bukan ${requiredRole}!` });
        }
        next(); // Lanjut ke proses berikutnya
    };
};