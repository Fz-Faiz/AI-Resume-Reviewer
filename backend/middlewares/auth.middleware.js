import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        

        if(!authorization || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "Unauthorized - No Token Provided"})
        }
        const token = authHeader.split(" ")[1];
        try{
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded.id).select("-password")

            if(!user) {
                return res.status(401).json({message: "User not found"})
            }

            req.user = user;
            next();

        }catch(error){
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({message:"Unauthorized - Access token expired"})
            }
        }
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message)
        return res.status(401).json({message : "Unauthorized - Invalid access token"})
    }
}