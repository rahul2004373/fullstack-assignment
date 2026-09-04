import {verifyToken} from "../utils/jwt.js"

const authMiddleware = async(req,res,next)=>{

    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({
            success: false,
            message: "Authorization header is required"
        })
    }

    const [scheme, token] = authHeader.split(" ")

    if(scheme !== "Bearer" || !token){
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format"
        })
    }

    try{

        const decoded = await verifyToken(token)

        req.user = decoded

        next()

    }catch(error){

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })

    }

}

export default authMiddleware