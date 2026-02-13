import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateResetToken = () => {
  return jwt.sign(
    { purpose: "password-reset" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};