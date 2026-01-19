import { Router } from "express";
import passport from "passport";
import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  if (!isValidPassword(user, password)) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const token = generateToken(user);

  res.json({
    message: "Login correcto",
    token
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { password, ...user } = req.user._doc;
    res.json({ user });
  }
);

export default router;
