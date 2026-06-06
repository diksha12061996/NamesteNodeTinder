const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../config/middlewares/auth');
const dB = require('../config/database');

userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let conReqQry = `
            select c.*,f.Name FromUser,t.Name tUser from ConnectionRequest c
            join Users f on c.FromUserId=f.UserId
            join Users t on c.ToUserId=t.UserId where ToUserId='${req.user[0].data[0].UserId}' and Status='Interested';`;
        const ConnectionRequest = await dB.executeMultipleSelectQuery(conReqQry);
        res.send(ConnectionRequest);
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let conReqQry = `
            select c.*,f.Name FromUser,t.Name tUser from ConnectionRequest c
            join Users f on c.FromUserId=f.UserId
            join Users t on c.ToUserId=t.UserId where (ToUserId='${req.user[0].data[0].UserId}' or FromUserId='${req.user[0].data[0].UserId}') and Status='Interested';`;
        console.log(conReqQry)
        const ConnectionRequest = await dB.executeMultipleSelectQuery(conReqQry);
        res.send(ConnectionRequest);
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        let conReqQry = `
            select * from Users u
            where u.UserId !=${req.user[0].data[0].UserId} and UserId not in(select ToUserId from ConnectionRequest where FromUserId=${req.user[0].data[0].UserId});`;
        console.log(conReqQry)
        const ConnectionRequest = await dB.executeMultipleSelectQuery(conReqQry);
        res.send(ConnectionRequest);
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})


module.exports = userRouter;