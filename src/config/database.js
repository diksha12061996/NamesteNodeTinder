const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'win32.exe',
    server: 'localhost',
    database: 'NamesteNode',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    // Optimization: Pool management settings
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const connectDB = async () => {
    try {
        // Connect globally so that subsequent require('mssql') calls use this pool
        const pool = await sql.connect(config);
        console.log("🚀 Server successfully connected to the database.");
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        throw err; // Re-throw so app.js can catch it and halt startup
    }
};

module.exports = connectDB;