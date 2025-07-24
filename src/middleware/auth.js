const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error();

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};

module.exports = auth;




const verifyToken = (req,res,next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization 
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ") [1];

        if (!token) {
            return res
            .status(401)
            .json({ message: "No token  authorization denied."});
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            console.log(" The decoded user is :", req.user);
            next();
        } catch (err) {
            res.status(400).json({message: "Token is not valid"});
        }
    } else {
        return res
            .status(401)
            .json({ message: "No token  authorization denied."});
    }
}
function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
}

module.exports = verifyToken;
