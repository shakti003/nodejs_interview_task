const jwt = require("jsonwebtoken");
const userData = require("../models/userSchema");

const auth = async(req,res,next) =>{
    try {
        const token = req.cookies.jwt
        const verifyUser = await jwt.verify(token, process.env.SECRETE_KEY)
        

        const user = await userData.findOne({_id : verifyUser._id});
        //console.log(user);

        req.token = token
        req.user = user
        next();
        
    } catch (error) {
        res.send(error)
    }
    
}

module.exports = auth;


