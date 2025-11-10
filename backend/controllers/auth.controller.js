import User from "../model/user.model.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"15m",
    });
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: "7d",
    })
    return {accessToken, refreshToken}
}

const storeRefreshToken = async (userId, refreshToken) => {
    await User.findByIdAndUpdate(
        userId,
        {$push : {refreshTokens : {token: refreshToken}}},
    )
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken } = generateToken(user._id)
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken)
            console.log(user, accessToken, refreshToken)

            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
            })
        }else{
            res.status(400).json({mesage:"Invalid email or password", error})
        }
    } catch (error) {
        console.log("Error in login controller", error.message)
    }
}

export const signup = async (req, res) => {

    const {name, email, password} = req.body;
    try {
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: "User Already Exists"});
        }
        const user = await User.create({name, email, password});

        const {accessToken, refreshToken} = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken)

        res.status(201).json({
            _id:user._id,
            name: user.name,
            email:user.email,
        })

    } catch (error) {   
        console.log("Error in signup controller");
        return res.status(500).json({message: error.message})
    }
}

export const logout =  async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = decoded.userId
            await User.findByIdAndUpdate(
                userId,
                {$pull : { refreshTokens: {token: refreshToken}}}
            )
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.status(200).json({ message:"Logged out Successfully"})
    } catch (error) {
        console.log("Error in logout controller")
        return res.status(500).json({message:error.message})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({messge:"No refresh token provided"})
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId)
        if(!user){
            return res.status(401).json({message: "user not found"})
        }

        const storedToken = user.refreshTokens.includes(refreshToken);
        if(!storedToken){
            return res.status(401).json({message: "Invalid refresh token"})
        }

        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});
        res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })

        res.json({message: 'Token refreshed successfully'})
    } catch (error) {
        console.log("Error in refresh token controllelr")
        res.status(500).json({mesage: "server error", error: error.message}, accessToken)
    }
}

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};