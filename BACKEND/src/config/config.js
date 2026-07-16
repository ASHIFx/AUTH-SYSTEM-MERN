import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("Mongo URI is missing or not defined");
}
if(!process.env.PORT){
    throw new Error("PORT is missing or not defined");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT Secret key is missing or not defined");
}


const config = {
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL,
    CLIENT_URL:process.env.CLIENT_URL,
    EMAIL_USER:process.env.EMAIL_USER,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
}

export default config;