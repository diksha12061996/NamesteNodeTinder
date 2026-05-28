const sql = require('mssql');

//const activePools = new Map();


// const getConnection = async () => {
//     let pool;
//     console.log(`Building dynamic pool for user on: ${process.env.DB_NAME}`);
//     pool = new sql.ConnectionPool({
//         server: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         options: {
//             encrypt: false,
//             trustServerCertificate: true
//         },
//         pool: {
//             max: 10,
//             min: 0,
//             idleTimeoutMillis: 30000
//         }
//     });
//     if (!pool.connected) {
//         if (!pool.connecting) {
//             try {
//                 await pool.connect();
//             } catch (err) {
//                 // Cleanup broken dynamic pool if connection fails
//                 // activePools.delete(poolKey);
//                 throw err;
//             }
//         } else {
//             // wait until connecting finishes
//             while (pool.connecting) {
//                 await new Promise(r => setTimeout(r, 50));
//             }
//         }
//     }

//     return pool;
// };
let poolPromise = null;

const getConnection = async () => {
    try {
        if (!poolPromise) {
            console.log(`Creating SQL pool for DB: ${process.env.DB_NAME}`);
            const pool = new sql.ConnectionPool({
                server: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                options: {
                    encrypt: false,
                    trustServerCertificate: true
                },
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000
                }
            });
            pool.on('error', err => {
                console.error('SQL Pool Error:', err);
                poolPromise = null;
            });
            poolPromise = pool.connect();
        }
        return await poolPromise;

    } catch (err) {
        poolPromise = null;
        throw err;
    }
};

module.exports = getConnection;
