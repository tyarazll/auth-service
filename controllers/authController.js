const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function saveAuditLog(
    username,
    event,
    ip
){

    const sql = `
        INSERT INTO audit_logs
        (
            username,
            event,
            ip_address
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    `;

    db.query(
        sql,
        [
            username,
            event,
            ip
        ],
        (err) => {

            if(err){

                console.log(
                    "AUDIT LOG ERROR:",
                    err
                );

            }

        }
    );

}

// ======================
// REGISTER USER
// ======================
exports.registerUser = async (req, res) => {

const { username, password } = req.body;

if (!username || !password) {
    return res.status(400).json({
        error: 'Username dan password wajib diisi'
    });
}

try {

    const checkUser =
        "SELECT * FROM users WHERE username = ?";

    db.query(checkUser, [username], async (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
                error: 'Username sudah digunakan'
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 12);

        const sql =
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

        db.query(
            sql,
            [username, hashedPassword, 'user'],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                return res.status(201).json({
                    message: 'Registrasi berhasil'
                });
            }
        );

    });

} catch (error) {

    return res.status(500).json({
        error: 'Server error'
    });

}

};

// ======================
// LOGIN USER
// ======================
exports.loginUser = (req, res) => {

const { username, password } = req.body;

if (!username || !password) {
    return res.status(400).json({
        error: 'Username dan password wajib diisi'
    });
}

const sql =
    "SELECT * FROM users WHERE username = ?";

db.query(sql, [username], async (err, result) => {

    if (err) {
        return res.status(500).json({
            error: err.message
        });
    }

    if (result.length === 0) {
        saveAuditLog(
            username,
    'LOGIN_FAILED',
    req.ip
);
        return res.status(401).json({
            error: 'Username atau password salah'
        });
    }

    const user = result[0];

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        saveAuditLog(
    username,
    'LOGIN_FAILED',
    req.ip
);
        return res.status(401).json({
            error: 'Username atau password salah'
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false
    });

    saveAuditLog(
    user.username,
    'LOGIN_SUCCESS',
    req.ip
);

    return res.status(200).json({
        message: 'Login berhasil',
        token,
        role: user.role
    });

});

};

// ======================
// GET ALL USERS
// ======================
exports.getUsers = (req, res) => {

const sql =
    "SELECT id, username, role FROM users";

db.query(sql, (err, result) => {

    if (err) {
        return res.status(500).json({
            error: err.message
        });
    }

    res.json(result);

});

};

// ======================
// DASHBOARD STATISTICS
// ======================
exports.getDashboardStats = (req, res) => {

    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, userResult) => {

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }

            db.query(
                "SELECT COUNT(*) AS totalAdmins FROM users WHERE role='admin'",
                (err, adminResult) => {

                    if(err){
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    db.query(
                        "SELECT COUNT(*) AS totalLogs FROM audit_logs",
                        (err, logResult) => {

                            if(err){
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            res.json({
                                totalUsers: userResult[0].totalUsers,
                                totalAdmins: adminResult[0].totalAdmins,
                                totalLogs: logResult[0].totalLogs
                            });

                        }
                    );

                }
            );

        }
    );

};

exports.getAuditLogs = (req, res) => {

    const sql = `
        SELECT *
        FROM audit_logs
        ORDER BY id DESC
    `;

    db.query(
        sql,
        (err, result) => {

            if(err){

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json(result);

        }
    );

};

// ======================
// VERIFY SESSION
// ======================
exports.verifySession = (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    });

};