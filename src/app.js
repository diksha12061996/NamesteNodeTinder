const express = require('express');
// const executeMultipleSelectQuery = require('./config/database')
const app = express();
require('dotenv').config();
const dB = require('./config/database');
const validator = require('validator');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());


app.get("/users", function (req, res) {
  let qry = `select * from users;`
  return dB.executeMultipleSelectQuery(qry).then(async function (rds) {
    res.send(rds)
  }).catch(function (err) {
    res.status(500).send(err);
  });
})

app.post("/SignUp", async function (req, res) {
  try {
    const { UserId, Name, Email, Age, Gender, Password } = req.body;

    validateSignUpData(req);

    const PasswordHash = await bcrypt.hash(Password, 10)
    console.log(PasswordHash)
    let qry = `INSERT INTO users( Name, Email, Age, Gender,Password) VALUES ( '${Name}' ,'${Email}', ${Age}, '${Gender}','${PasswordHash}')`;
    //let values = [UserId.trim(), Name.trim(), Email.trim().toLowerCase(), parsedAge, Gender];

    const rds = await dB.executeDmlQuery(qry, { withTrans: true })
    return res.send("User save successfully");

  } catch (err) {
    console.error("Database error:", err);
    res.status(400).send("Error: " + err.message);
  }
});

app.post('/Login', async function (req, res) {
  try {
    const { Email, Password } = req.body;
    let qry = `select * from users where Email='${Email}';`
    const dbPassword = await dB.executeMultipleSelectQuery(qry);
    if (dbPassword[0].data.length != 1) {
      res.status(400).send("Please enter a valid email")
    }
    const isPasswordValid = await bcrypt.compare(Password, dbPassword[0].data[0].Password)
    console.log(isPasswordValid)
    if (isPasswordValid) {
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
});

