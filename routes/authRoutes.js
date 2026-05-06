const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Pembuatan aturan pembatasan laju (Rate Limiting) untuk memitigasi Brute Force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Jendela waktu: 15 menit
    max: 5, // Maksimal 5 kali percobaan login dari 1 IP
    message: { error: "Terlalu banyak upaya login. Silakan coba lagi setelah 15 menit." }
});

// Rute Publik (Siapa saja bisa akses)
router.post('/register', authController.registerUser);

// Proteksi endpoint login dengan loginLimiter
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