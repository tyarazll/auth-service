const jwt = require('jsonwebtoken');

// ======================
// VERIFY TOKEN
// ======================
exports.verifyToken = (req, res, next) => {

    const authHeader =
        req.headers.authorization;

    if(
        !authHeader ||
        !authHeader.startsWith('Bearer ')
    ){

        return res.status(403).json({
            error:
            "Akses ditolak, Anda belum login!"
        });

    }

    const token =
        authHeader.split(' ')[1];

    try{

        const decoded =
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user =
        decoded;

        next();

    }
    catch(error){

        return res.status(401).json({
            error:
            "Token tidak valid atau sudah kedaluwarsa!"
        });

    }

};

// ======================
// RBAC
// ======================
exports.checkRole =
(requiredRole) => {

    return (
        req,
        res,
        next
    ) => {

        if(
            !req.user ||
            req.user.role !== requiredRole
        ){

            return res.status(403).json({

                error:
                `Akses terlarang. Halaman ini khusus ${requiredRole}.`

            });

        }

        next();

    };

};