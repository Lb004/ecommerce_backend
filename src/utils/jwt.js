import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (user) => jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role
  },
  env.jwtSecret,
  { expiresIn: "1h" }
);
