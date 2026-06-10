const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auth_service'
});

db.connect((err) => {
    if(err){
        console.log('Database gagal terkoneksi');
        return;
    }
    console.log('Database berhasil terkoneksi');
});

module.exports = db;