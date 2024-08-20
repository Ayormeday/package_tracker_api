import dotenv from "dotenv";
dotenv.config({});

const MONGODB_URI_ENV = process.env.MONGODB_URI_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export {
    MONGODB_URI_ENV,
    JWT_SECRET,
    FRONTEND_URL,
}
