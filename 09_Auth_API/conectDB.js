const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(client => {
        console.log('Connected to database');
        client.release(); // Звільнення клієнта
    })
    .catch(error => {
        console.error('Database connection error:', error);
    });

module.exports = pool;