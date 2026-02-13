import { Router } from "express";
import passport from "passport";
import { SessionsService } from "../services/sessions.service.js";
import { CurrentUserDto } from "../dto/current-user.dto.js";

const router = Router();
const sessionsService = new SessionsService();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son requeridos" });
    }

    const token = await sessionsService.login(email, password);
    return res.json({ message: "Login correcto", token });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
  const dto = new CurrentUserDto(req.user);
  res.json({ user: dto });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  await sessionsService.createPasswordRecovery(email);
  res.json({ message: "Si el email existe, enviamos un enlace de recuperación" });
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await sessionsService.resetPassword(token, newPassword);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
