const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rute Publik (Siapa saja bisa akses)
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Rute Terlindungi (Hanya user yang sudah login yang bisa akses)
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
    res.json({ message: `Selamat datang, ${req.user.username}!`, userData: req.user });
});

// Rute Sangat Terlindungi (RBAC: Hanya ADMIN yang boleh akses)
router.get('/admin-dashboard', authMiddleware.verifyToken, authMiddleware.checkRole('admin'), (req, res) => {
    res.json({ message: "Akses Diberikan. Selamat datang di Panel Administrator." });
});

module.exports = router;