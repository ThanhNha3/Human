const jwt = require('jsonwebtoken')
exports.authenticateToken = async (req, res, next) => {
    const authorization = await req.headers.authorization;
    const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "unauthorized",
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token"
            })

        } else {
            req.user = decoded;
            next();
        }
    });
}
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
}