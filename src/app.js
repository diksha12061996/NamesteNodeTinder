const express = require('express');
const sql = require('mssql'); 
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(express.json()); 

// 1. Sign Up Route
app.post('/signUp', async (req, res) => {
    // Fallback object optimization using object destructuring/default values
    const userObj = (req.body && req.body.UserName) ? req.body : {
        UserId: Date.now(), // Generate semi-unique ID if fallback triggers
        UserName: "Deeksha Rajput",
        Email: "abc@gmail.com",
        Password: "abc@1234",
        Age: 28,
        Gender: "Female"
    };

    try {
        // Tagged template literals inherently protect against SQL injection
        const result = await sql.query`
            INSERT INTO users (UserId, UserName, Email, [Password], Age, Gender)
            VALUES (
                ${userObj.UserId}, 
                ${userObj.UserName}, 
                ${userObj.Email}, 
                ${userObj.Password}, 
                ${userObj.Age}, 
                ${userObj.Gender}
            )
        `;

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            rowsAffected: result.rowsAffected[0]
        });

    } catch (err) {
        console.error("Database error during signup:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// 2. Delete User Route (Optimized to be dynamic)
// Example request: DELETE http://localhost:3000/deleteUser?id=1
app.delete('/deleteUser', async (req, res) => {
    const userId = req.query.id;

    if (!userId) {
        return res.status(400).json({ success: false, error: "Missing 'id' query parameter." });
    }
  
    try {
        // Dynamic & Secure deletion using Template Literals
        const result = await sql.query`DELETE FROM users WHERE UserId = ${userId};`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            rowsAffected: result.rowsAffected[0]
        });

    } catch (err) {
        console.error("Database error during deletion:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Start server only if DB connection succeeds
const PORT = 3000;
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`💻 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('🛑 Server failed to start due to DB connection issues.');
        process.exit(1);
    });