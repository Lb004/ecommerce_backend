import { Router } from "express";
import passport from "passport";
import { AuthService } from "../services/auth.service.js";
import { UserDTO } from "../dto/user.dto.js";

const router = Router();
const authService = new AuthService();

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password son requeridos"
      });
    }

    const { token, user } = await authService.login(email, password);

    res.json({
      message: "Login correcto",
      token,
      user: new UserDTO(user)
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(401).json({
      error: error.message
    });
  }
});

// 👤 OBTENER USUARIO ACTUAL (Ruta protegida con DTO)
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      // Retornar solo datos no sensibles usando DTO
      const userDTO = new UserDTO(req.user);
      
      res.json({
        user: userDTO
      });
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      res.status(500).json({
        error: "Error al obtener información del usuario"
      });
    }
  }
);

// 📧 SOLICITAR RECUPERACIÓN DE CONTRASEÑA
router.post("/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "El email es requerido"
      });
    }

    const result = await authService.requestPasswordReset(email);

    res.json(result);
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);
    res.status(500).json({
      error: "Error al procesar la solicitud"
    });
  }
});

// 🔑 RESTABLECER CONTRASEÑA
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        error: "La nueva contraseña es requerida"
      });
    }

    const result = await authService.resetPassword(token, newPassword);

    res.json(result);
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(400).json({
      error: error.message
    });
  }
});

export default router;