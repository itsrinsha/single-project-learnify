import jwt from "jsonwebtoken";
import {env} from "../config/env.config.js"


const generateToken=(userId)=>{
    return jwt.sign({id:userId},env.JWT_SECRET,{
        expiresIn:"7d"
    })
}
export default generateToken;