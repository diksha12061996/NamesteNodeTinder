const jwt = require('jsonwebtoken');
const dB = require('../database');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        let validateToken = jwt.verify(token, 'Deeksha@1234');
        const { Email } = validateToken;
        let qry = `select * from Users where Email='${Email}';`;
        const UserData = await dB.executeMultipleSelectQuery(qry);
        if (!UserData) {
            throw new Error('User is not Valid');
        }
        req.user = UserData;
        next();
    }
    catch (err) {
        res.status(404).send("Error: " + err.message)
    }
}
module.exports = { userAuth }