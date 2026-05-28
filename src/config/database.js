const sql = require('mssql');
var getConnection = require('../config/db');

async function executeMultipleSelectQuery(queries) {
    try {
        const db = await getConnection();

        // Split multiple queries by semicolon
        const queryList = queries
            .split(';')
            .map(query => query.trim())
            .filter(query => query.length > 0);

        const results = [];

        for (let query of queryList) {
            // Execute query
            const result = await db.request().query(query);

            const resultData = result.recordset || [];
            const sch = [];

            // Extract column metadata
            if (result.recordset && result.recordset.columns) {
                Object.values(result.recordset.columns).forEach((col, index) => {
                    sch.push({
                        index: index,
                        name: col.name,
                        type: getColType(col.type)
                    });
                });
            }

            results.push({
                data: resultData,
                schema: sch
            });
        }

        return results;

    } catch (err) {
        throw err;
    }
}
async function executeDmlQuery( qry, op) { 
  const pool = await getConnection(); // Get the connection pool
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin(); // Start the transaction

    const request = new sql.Request(transaction);

    // Execute the query
    const result = await request.query(qry);

    await transaction.commit(); // Commit the transaction
    return result.recordset; // Return the result of the query

  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of error
    throw error; // Rethrow the error to propagate it
  }
}
// Add 'params' as a second argument (defaults to an empty array)
// async function executeInsertQuery(queries, params = []) {
//     try {
//         const db = await getConnection();

//         const queryList = queries
//             .split(';')
//             .map(query => query.trim())
//             .filter(query => query.length > 0);

//         const results = [];

//         for (let query of queryList) {
//             // Create a fresh request for each query
//             const request = db.request();

//             // If parameters were passed, bind them dynamically
//             // SQL Server expects named parameters like @param0, @param1, etc.
//             if (params && params.length > 0) {
//                 params.forEach((val, index) => {
//                     request.input(`param${index}`, val);
//                 });
//             }

//             // Execute query
//             const result = await request.query(query);

//             const resultData = result.recordset || [];
//             const sch = [];

//             // Extract column metadata
//             if (result.recordset && result.recordset.columns) {
//                 Object.values(result.recordset.columns).forEach((col, index) => {
//                     sch.push({
//                         index: index,
//                         name: col.name,
//                         type: getColType(col.type)
//                     });
//                 });
//             }

//             results.push({
//                 data: resultData,
//                 schema: sch
//             });
//         }

//         return results;

//     } catch (err) {
//         throw err;
//     }
// }
function getColType(type) {
    switch (type) {
        case sql.DateTime:
            return "DateTime";
        case sql.Date:
            return "DateTime";
        case sql.Time:
            return "Time";
        case sql.Int:
            return "Int";
        case sql.BigInt:
            return "BigInt";
        case sql.SmallInt:
            return "SmallInt";
        case sql.Decimal:
            return "Decimal";
        case sql.Char:
        case sql.VarChar:
        case sql.NVarChar:
            return "String";
        default:
            return "String";
    }
}

module.exports = { executeMultipleSelectQuery, executeDmlQuery };