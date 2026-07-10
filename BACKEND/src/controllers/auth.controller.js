import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import {sendEmail} from "../services/email.services.js"
import { genOTP,getOtpHtml } from "../utils/util.js";
import otpModel from "../models/otp.model.js";

export async function register(req,res){
    const {username, email, password} = req.body;
    if(!username||!email||!password){
        return res.status(409).json({message:"all field are required"});
    }

    const isAlreadyExist = await userModel.findOne({
        $or:[{username},{email}]
    })
    
    if(isAlreadyExist){
        return res.status(409).json({message:"Username or email already exist"});
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const otp = genOTP();
    const html = getOtpHtml(otp);

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await otpModel.create({
        user: user._id,
        email,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })

    await sendEmail(email,"OTP verification", `Your OTP code is ${otp}`, html)

    res.status(201).json({
        message:`user registered successfully, OTP ${otp} sent to ${email}`,
        user:{
            username: user.username,
            email: user.email,
            verified:user.verified
        }

    })

}

export async function login(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"Invalid email"
        })
    }
    if (!user.verified) {
        return res.status(401).json({ message: "please verify your email first" })
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const isPasswordCorrect = hashedPassword==user.password;

    if(!isPasswordCorrect){
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id,
    },config.JWT_SECRET,{
        expiresIn:"10d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');

    const session = await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    },config.JWT_SECRET,{
        expiresIn:"10m"
    })

    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        secure: true,
        sameSite:"none",
        maxAge:10*24*60*60*1000
    })

    res.status(200).json({
        message:"Logged in successfully",
        user:{
            username: user.username,
            email: user.email
        },
        accessToken
    })
}

export async function getme(req, res){
    
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"token not found"
        })
    }
    const decoded = jwt.verify(token,config.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({
        message:"user found",
        user:{
            username:user.username,
            email:user.email
        }
    })
}

export async function refreshToken(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){ 
        return res.status(401).json({
            message:"refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke:false
    })

    if(!session){
        return res.status(401).json({
            message:"invalid refresh token"
        })
    }

    const accessToken = jwt.sign({
        id:decoded.id,
        sessionId:session._id
    }, config.JWT_SECRET,{
        expiresIn:"10m"
    })

    const newRefreshToken = jwt.sign({
        id:decoded.id
    },config.JWT_SECRET,{
        expiresIn:"10d"
    })

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshTokenHash=newRefreshTokenHash
    await session.save();


    
    res.cookie("refreshToken", newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:10*24*60*60*1000
    })
    res.status(200).json({
        message:"access token refreshed successfully",
        accessToken
    })
}

export async function logout(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message:"refresh token not found"
        }
    )}

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke:false
    })

    if(!session){
        return res.status(400).json({
            message:"invalid refresh token"
        })
    }

    session.revoke = true;
    await session.save();

    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"logged out successfully"
    })
}

export async function verifyOtp(req, res){
    const {email,otp} = req.body;

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const otpDoc = await otpModel.findOne({
        email,
        otpHash,
        expiresAt: { $gt: new Date() }
    })

    if(!otpDoc){
        return res.status(401).json({
            message:"otp invalid"
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user,{
        verified:true
    },{ new: true })

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    const accessToken = jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"10m"
    })

    const refreshToken = jwt.sign({
        id:user._id,  
    },config.JWT_SECRET,{
        expiresIn:"10d"
    })

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    })
    

    res.cookie("refreshToken", refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:10*24*60*60*1000
    })

    return res.status(200).json({
        message:"Email verified successfully",
        user:{
            username:user.username,
            email:user.email,
            verified:user.verified,
        },accessToken
    })
}

export async function resendOtp(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (user.verified) {
        return res.status(400).json({ message: "User already verified" })
    }

    await otpModel.deleteMany({ email });

    const otp = genOTP()
    const html = getOtpHtml(otp)
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    await otpModel.create({
        email,
        user: user._id,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })

    await sendEmail(email, "Your OTP", `Your OTP is ${otp}`, html)

    res.status(200).json({ message: `OTP ${otp} resent successfully`})
}

export async function googleCallback(req, res) {
    const user = req.user

    const refreshToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "10d" }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign(
        { userId: user._id, sessionId: session._id },
        config.JWT_SECRET,
        { expiresIn: "10m" }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 10 * 24 * 60 * 60 * 1000
    })

    res.redirect(`${config.CLIENT_URL}/oauth-success?token=${accessToken}`)
    
}

export async function forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!user.verified) {
        return res.status(400).json({ message: "Please verify your email first" });
    }

    await otpModel.deleteMany({ email });

    const otp = genOTP();
    const html = getOtpHtml(otp);
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await otpModel.create({
        user: user._id,
        email,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`, html);

    res.status(200).json({ message: `OTP sent to ${email}` });
}

export async function verifyForgotOtp(req, res) {
    const { email, otp } = req.body;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpDoc = await otpModel.findOne({
        email,
        otpHash,
        expiresAt: { $gt: new Date() }
    });
    if (!otpDoc) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    res.status(200).json({ message: "OTP verified" });
}

export async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const otpDoc = await otpModel.findOne({
        email,
        otpHash,
        expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

    await userModel.findByIdAndUpdate(otpDoc.user, {
        password: hashedPassword
    });

    await otpModel.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
}