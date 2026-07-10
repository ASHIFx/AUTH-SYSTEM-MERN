import passport from "../config/passport.js"
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const otpLimit = rateLimit({
    windowMs: 15*60*1000,
    max: 5
})

const authRouter = Router();

authRouter.post("/register",authController.register);

authRouter.post("/login",authController.login);

authRouter.get("/get-me",authController.getme);

authRouter.post("/refreshToken", authController.refreshToken);

authRouter.get("/logout",authController.logout);

authRouter.post("/verify-otp",otpLimit, authController.verifyOtp);

authRouter.get("/resend-otp",otpLimit, authController.resendOtp);

authRouter.post("/forgot-password",  otpLimit, authController.forgotPassword);

authRouter.post("/reset-password", authController.resetPassword);

authRouter.post('/verify-forgot-otp', authController.verifyForgotOtp);

authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

authRouter.get("/google/callback",
    passport.authenticate("google", { session: false }),
    authController.googleCallback
)

export default authRouter;