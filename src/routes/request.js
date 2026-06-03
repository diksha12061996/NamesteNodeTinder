const express = require('express');
const requestRouter = express.Router();
const dB = require('../config/database');

requestRouter.get("/users", function (req, res) {
  let qry = `select * from users;`
  return dB.executeMultipleSelectQuery(qry).then(async function (rds) {
    res.send(rds)
  }).catch(function (err) {
    res.status(500).send(err);
  });
})

module.exports = requestRouter;