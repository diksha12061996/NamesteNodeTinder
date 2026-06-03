const express = require('express');
const AuthRouter = express.Router();
const dB = require('../config/database');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../config/middlewares/auth');

AuthRouter.post("/SignUp", async function (req, res) {
    try {
        const { Name, Email, Age, Gender, Password } = req.body;

        validateSignUpData(req);

        const PasswordHash = await bcrypt.hash(Password, 10)
        console.log(PasswordHash)
        let qry = `INSERT INTO users(Name, Email, Age, Gender,Password) VALUES ( '${Name}' ,'${Email}', ${Age}, '${Gender}','${PasswordHash}')`;
        //let values = [UserId.trim(), Name.trim(), Email.trim().toLowerCase(), parsedAge, Gender];

        const rds = await dB.executeDmlQuery(qry, { withTrans: true })
        return res.send("User save successfully");

    } catch (err) {
        console.error("Database error:", err);
        res.status(400).send("Error: " + err.message);
    }
});
AuthRouter.post('/Login', async function (req, res) {
    try {
        const { Email, Password } = req.body;
        let qry = `select * from users where Email='${Email}';`
        const dbPassword = await dB.executeMultipleSelectQuery(qry);
        if (dbPassword[0].data.length != 1) {
            res.status(400).send("Please enter a valid email")
        }
        const isPasswordValid = await bcrypt.compare(Password, dbPassword[0].data[0].Password)
        if (isPasswordValid) {
            let token = await jwt.sign({ Email }, 'Deeksha@1234', { expiresIn: '7d' });
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send("Login successfully..")
        }
        else {
            res.status(400).send("Password is incorrect.")
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

AuthRouter.post('/logout', async function (req, res) {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
        })
        res.send("Logout successfully");
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

});

module.exports = AuthRouter;