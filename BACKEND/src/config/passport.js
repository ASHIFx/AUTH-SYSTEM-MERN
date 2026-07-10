import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import userModel from "../models/user.model.js"
import config from "./config.js"

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({ email: profile.emails[0].value })

        if (!user) {
            user = await userModel.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                password: "google-oauth",
                verified: true
            })
        }

        return done(null, user)
    } catch (err) {
        return done(err, null)
    }
}))

export default passport