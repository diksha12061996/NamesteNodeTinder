const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../config/middlewares/auth')
const { validateEditProfileData } = require('../utils/validation')
const dB = require('../config/database')

profileRouter.get('/Profile', userAuth, async (req, res) => {
  try {
    const User = req.user;
    res.send(User);
  }
  catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    const { Name, Age, Gender, Email } = loggedInUser[0].data[0];
    let qry = `update Users set Name ='${Name}' , Age =${Age} , Gender ='${Gender}' where Email ='${Email}'`;
    console.log(qry);
    const rds = await dB.executeDmlQuery(qry, { withTrans: true })

    res.json({
      message: `${loggedInUser[0].data[0].Name}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;