const bcrypt = require('bcrypt');

const usersDB = []; // Simulasi database sementara

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
};