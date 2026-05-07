const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Simulasi database sementara menggunakan array
const usersDB = []; 

// Fungsi Registrasi User Baru
exports.registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validasi Input Dasar
        if (!username || !password) {
            return res.status(400).json({ error: "Username dan password wajib diisi." });
        }

        // Cek apakah username sudah ada
        const existingUser = usersDB.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: "Username sudah terdaftar." });
        }

        // 2. HASHING PASSWORD DENGAN BCRYPT (COST FACTOR 12)
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Simpan data user dengan password yang sudah di-hash
        const newUser = { 
            id: Date.now(), 
            username, 
            password: hashedPassword, 
            role: role || 'user' // Default role adalah 'user'
        };
        usersDB.push(newUser);

        res.status(201).json({ message: "Registrasi aman berhasil!", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan saat registrasi." });
    }
};

// Fungsi Login User
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Cari user di database simulasi
        const user = usersDB.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: "Kredensial tidak valid." }); // Pesan error generik
        }

        // Cek kecocokan password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Kredensial tidak valid." }); // Pesan error generik
        }

        // 3. BUAT JWT & SIMPAN DI HTTPONLY COOKIE
        const payload = { id: user.id, username: user.username, role: user.role };
        
        // Token kedaluwarsa dalam 15 menit
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); 

        // Set HttpOnly Cookie agar aman dari serangan XSS dan CSRF
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // True jika di HTTPS
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 menit
        });

        res.json({ message: "Login sukses, token diamankan di dalam cookie!" });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan saat login." });
    }
};