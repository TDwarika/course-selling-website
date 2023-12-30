const jwt = require('jsonwebtoken');
const SECRET = 'SECr3t';

const authenticateJwt = (req, res, next) => {
    const checkToken = req.headers.authorization;
    if (checkToken) {
        const token = checkToken.split(' ')[1];
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    }
    else {
        res.sendStatus(401);
    }
};

module.exports = {
    SECRET,
    authenticateJwt
}