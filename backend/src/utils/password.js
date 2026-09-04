import bcrypt from "bcrypt"

const SALT_ROUNDS=10

const hashPassword = async(password)=>{
    return await bcrypt.hash(password,SALT_ROUNDS)
}

const comparePassword = async(password,hashPassword)=>{
    return await bcrypt.compare(password,hashPassword)
}

export {
    hashPassword,
    comparePassword,
};