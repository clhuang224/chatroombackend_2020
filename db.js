require("dotenv").config();

const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env["DB_HOST"],
    user: process.env["DB_USERNAME"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_DATABASE"]
});

let db = {
    pool: pool,
    connection: null
};

// 一直維持連線狀態
pool.getConnection((err, connection) => {
    if (err) throw err;
    db.connection = connection;
});

module.exports = db;