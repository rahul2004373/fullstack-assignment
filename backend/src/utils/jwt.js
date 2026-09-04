import jwt from 'jsonwebtoken'

const generateToken = async(user)=>{
    const token =  jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    return token
}

const verifyToken = async(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

export { generateToken,verifyToken }