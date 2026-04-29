const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Simulasi database sementara
const usersDB = []; 

exports.registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username dan password wajib diisi." });
        }

        // 2. HASHING PASSWORD DENGAN COST 12 (Tugas Laporan!)
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Simpan data user dengan password yang sudah di-hash
        const newUser = { 
            id: Date.now(), 
            username, 
            password: hashedPassword, 
            role: role || 'user' 
        };
        usersDB.push(newUser);

        res.status(201).json({ message: "Registrasi aman berhasil!", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan server." });
    }
}; // <--- Tadi tanda penutup ini terlewat!

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Cari user (karena ini simulasi, kita cari di array)
        const user = usersDB.find(u => u.username === username);
        if (!user) return res.status(401).json({ error: "Kredensial tidak valid" });

        // Cek kecocokan password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Kredensial tidak valid" });

        // 3. BUAT JWT & SIMPAN DI HTTPONLY COOKIE (Tugas Laporan!)
        const payload = { id: user.id, username: user.username, role: user.role };
        
        // Token kedaluwarsa dalam 15 menit sesuai slide
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); 

        // Set HttpOnly Cookie agar aman dari XSS
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Aktifkan secure flag di HTTPS
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 menit
        });

        res.json({ message: "Login sukses, token disimpan di cookie!" });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan server." });
    }
};