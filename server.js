const express = require('express');
const helmet = require('helmet'); // Memanggil helm pelindung
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// 1. MENGAKTIFKAN SECURITY HEADERS (Tugas Laporan!)
app.use(helmet());

// Mengizinkan sistem membaca data format JSON
app.use(express.json());
app.use(cookieParser());

// Jalur tes
app.get('/api/status', (req, res) => {
    res.json({ message: "Server berjalan aman dengan Security Headers!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server nyala dan aman di port ${PORT}`);
});