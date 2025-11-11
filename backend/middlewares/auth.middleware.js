import jwt from "jsonwebtoken";
import User from "../model/user.model.js";


export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.accessToken

        if(!token) return res.status(401).json({message:" Unauthorized - No Token Provided"});

        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        if(!decoded) return res.status(401).json({message:" Unauthorized - Invalid Provided"});

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        req.user = user
        next()


    } catch (error) {
        console.log("Error in protectRoute middlware: ", error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}