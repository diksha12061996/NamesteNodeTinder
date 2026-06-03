const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../config/middlewares/auth')


profileRouter.get('/Profile', userAuth, async (req, res) => {
  try {
    const User = req.user;
    res.send(User);
  }
  catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;