const jwt = require("jsonwebtoken")
const {JWT_SECRET_ADMIN} = require("../config")

function adminMiddleware(req,res,next){
    const token = req.headers.token;
    try{
        const decoded = jwt.verify(token,JWT_SECRET_ADMIN);
        req.adminId = decoded.id
        next();
    }catch(e){
        res.status(403).json({
            msg:"Invalid Token",
            error: e
        })
    }
}
module.exports = {
    adminMiddleware
}