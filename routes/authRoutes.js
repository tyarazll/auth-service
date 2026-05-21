const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Pembuatan aturan pembatasan laju (Rate Limiting) dengan Security JSON Logging
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Jendela waktu: 15 menit
    max: 5, // Maksimal 5 kali percobaan login dari 1 IP sebelum diblokir
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        // MEKANISME ALERT: Mencetak format log JSON terstruktur ke terminal
        const securityLog = {
            timestamp: new Date().toISOString(),
            level: "WARN",
            event: "LOGIN_FAILED",
            userId: req.body.username || "unknown", // Mencatat username yang dicoba
            ip: req.ip,
            userAgent: req.get('User-Agent') || "unknown", // Mencatat perangkat/browser penyerang
            details: "Terlalu banyak upaya login gagal (Brute Force Anomaly)"
        };
        
        console.warn("\n=== [SECURITY ALERT DETECTED] ===");
        console.warn(JSON.stringify(securityLog, null, 2)); // Log JSON ini akan muncul di terminal VS Code
        console.warn("=================================\n");

        // Respon yang dikirimkan ke sisi client/browser
        res.status(429).json({ error: "Terlalu banyak upaya login. Silakan coba lagi setelah 15 menit." });
    }
});

// Rute Publik (Siapa saja bisa akses)
router.post('/register', authController.registerUser);

// Proteksi endpoint login dengan loginLimiter (Memicu Log & Alert)
router.post('/login', loginLimiter, authController.loginUser);

// Rute Terlindungi (Hanya user yang sudah login yang bisa akses)
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
    res.json({ message: `Selamat datang, ${req.user.username}!`, userData: req.user });
});

// Rute Sangat Terlindungi (RBAC: Hanya ADMIN yang boleh akses)
router.get('/admin-dashboard', authMiddleware.verifyToken, authMiddleware.checkRole('admin'), (req, res) => {
    res.json({ message: "Akses Diberikan. Selamat datang di Panel Administrator." });
});

module.exports = router;