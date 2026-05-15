const sql = require('mssql');


const config = {
    user: 'sa',
    password: 'win32.exe',
    server: 'localhost',
    database: 'NamesteNode',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}
const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log("server connected to the database.")
        await sql.close();
    }
    catch (err) {
        console.error('Database connection failed')
    }
}

module.exports = connectDB;