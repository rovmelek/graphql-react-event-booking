const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization'); // Authorization: Bearer <token asdasjllksd....>
    if (!authHeader) {
        console.log('No header');
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Bearer <token asdasjllksd....>
    if (!token || token === '') {
        console.log('No token');
        req.isAuth = false;
        return next()
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
    }
    catch (err) {
        console.log('Cannot decode');
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        console.log('Failed to verify token');
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}