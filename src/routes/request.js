const express = require('express');
const requestRouter = express.Router();
const dB = require('../config/database');
const { userAuth } = require('../config/middlewares/auth')

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const FromUserId = req.user[0].data[0].UserId;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["Interested", "Ignore"];
    if (FromUserId == toUserId)
      return res.status(400).json({ message: "Can not send connection request to yourself" })
    if (!allowedStatus.includes(status))
      return res.status(400).json({ message: "Invalid status type: " + status });
    let validToUser = `select * from Users where UserId= ${toUserId};`;
    const toUserValid = await dB.executeMultipleSelectQuery(validToUser);
    // console.log(toUserValid[0].data.length)
    if (toUserValid[0].data.length == 0)
      return res.status(400).json({ message: "User not found.. " });
    let findQry = `select * from ConnectionRequest where FromUserId=${FromUserId} and ToUserId = ${toUserId};`;
    const checkValid = await dB.executeMultipleSelectQuery(findQry);
    if (checkValid[0].data.length > 0)
      return res.status(400).json({ message: "Duplicate data entry.. " });
    let qry = `INSERT INTO ConnectionRequest(FromUserId, ToUserId, Status)
         VALUES ( '${FromUserId}' ,'${toUserId}', '${status}')`;
    const rds = await dB.executeDmlQuery(qry, { withTrans: true })
    console.log(req.user[0].data[0].Name)
    console.log(toUserValid[0])
    res.json({
      message: req.user[0].data[0].Name + " is " + status + " in " + toUserValid[0].data[0].Name
    })
  }
  catch (err) {
    res.status(400).send("Error: " + err.message)
  }
})

requestRouter.post('/request/review/:status/:RequestId', userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const requestId = req.params.RequestId;
    const loggedInUser = req.user;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status))
      return res.status(400).json({ message: "status not allowed!!" })
    let conReqQry = `select  * from ConnectionRequest where Id='${requestId}' and ToUserId='${req.user[0].data[0].UserId}' and Status='Interested' ;`;
    console.log(conReqQry)
    const ConnectionRequest = await dB.executeMultipleSelectQuery(conReqQry);
    if (ConnectionRequest[0].data.length == 0)
      return res.status(400).json({ message: "connection request not found" })

    let updateStatusQry = `update ConnectionRequest set Status='${status}' where Id='${requestId}' and ToUserId='${req.user[0].data[0].UserId}';`;
    console.log(updateStatusQry)
    const updateStatus = await dB.executeMultipleSelectQuery(updateStatusQry);
    res.json({ message: "Data updated successfully..." })
  }
  catch (err) {
    res.status(400).send("Error: " + err.message);
  }
})

module.exports = requestRouter;