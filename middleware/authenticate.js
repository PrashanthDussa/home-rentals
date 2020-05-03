const jwt = require('jsonwebtoken');

var authenticate = (req,res,next)=>{
    if(typeof window!=="undefined")
    {
        var token = localStorage.token;
        var decoded = jwt.verify(token,"dussa");

        req.user = decoded;
        next();
    }
}


module.exports = {authenticate};