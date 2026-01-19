import { Router } from "express";
import passport from "passport";
import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen email y password
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email y password son requeridos" 
      });
    }

    // Buscar usuario por email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }

    // Validar contraseña
    if (!isValidPassword(user, password)) {
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }

    // Generar token JWT
    const token = generateToken(user);

    res.json({
      message: "Login correcto",
      token
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      error: "Error al procesar el login" 
    });
  }
});

// 👤 OBTENER USUARIO ACTUAL (Ruta protegida)
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      // Excluir la contraseña de la respuesta
      const { password, ...user } = req.user._doc;
      
      res.json({ 
        user 
      });
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      res.status(500).json({ 
        error: "Error al obtener información del usuario" 
      });
    }
  }
);

export default router;
