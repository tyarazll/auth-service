const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. MENGAKTIFKAN SECURITY HEADERS (Mitigasi XSS & Clickjacking)
app.use(helmet());

// Middleware untuk membaca JSON dan Cookie
app.use(express.json());
app.use(cookieParser());

// Routing Utama
app.use('/api/auth', authRoutes);

// Jalur tes status server
app.get('/api/status', (req, res) => {
    res.json({ message: "Server berjalan aman dengan Security Headers!" });
});

// Penanganan Error Global (Fail Securely)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log di server saja
    res.status(500).json({ error: "Terjadi kesalahan server internal." }); // Pesan generik ke user
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Auth menyala dan aman di port ${PORT}`);
});