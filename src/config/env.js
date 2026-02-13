import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 8080),
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  gmailUser: process.env.GMAIL_USER,
  gmailPass: process.env.GMAIL_PASS,
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 8080}`
};
