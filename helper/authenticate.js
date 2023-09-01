var jwt = require('jsonwebtoken');

module.exports = {
    createJwt: (userData)=>{
        var token = jwt.sign({ userId: userData.userId  }, process.env.JWT_PRIVATE_KEY);
        return token
    },
    verifyJwt: (req,res,next)=>{
        const token = req.headers.authorization?.replace('Bearer ','')
        try{
            const verifiedUser = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            req.user = verifiedUser
            next()
        }
        catch{
            res.status(500).json({status: false, message: 'jwt token not verified'})
        }        
    }
}