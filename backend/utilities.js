const jwt = require('jsonwebtoken');


function authenticateToken(req,res,next){
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if(!token)
        return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        //invalid token
        if(err)
            res.sendStatus(404);
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
};