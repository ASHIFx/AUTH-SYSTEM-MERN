import express from "express";
import morgan from "morgan";
import authRouter from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js"
import cors from 'cors';
import config from "./config/config.js";

const app = express();

app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true 
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500).json({ message: err.message })
});


export default app;