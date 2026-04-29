const jwt = require("jsonwebtoken");
// ==============================
// AUTHENTICATION MIDDLEWARE
// ==============================

const authMiddleware = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;       // Get the Authorization header
        if(!authHeader) {
            return res.status(401).json({
                message : "Access deniedd. No token provided"
            })
        }
        const token = authHeader.split(" ")[1];            // Extract the token from the header

        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token

        req.user = decoded;          //Attach the decoded user info to the request object
        next();                     // Proceed to the next middleware or route handler
    }
    catch(error) {
        res.status(401).json({
            message: "Invalid or expired Token"
        });
    }
};

module.exports = authMiddleware;