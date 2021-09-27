const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded          // setting a property of the request object with decoded string. It will be used to be validated against the valid user details
        // so userData contains contact_no and userid  packed in JWT created in user login route.
        next()
    }
    catch(error)
    {
        return res.json({
            message: "Authentication Failed!",
	    status:401
        })
    }
}
