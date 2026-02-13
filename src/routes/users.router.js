import { Router } from "express";
import { AuthService } from "../services/auth.service.js";

const router = Router();
const authService = new AuthService();

// 📝 REGISTRAR NUEVO USUARIO
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validaciones de campos requeridos
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        error: "Todos los campos son requeridos (first_name, last_name, email, password)"
      });
    }

    // Validar edad si se proporciona
    if (age && (age < 0 || age > 150)) {
      return res.status(400).json({
        error: "Edad inválida"
      });
    }

    const newUser = await authService.register({
      first_name,
      last_name,
      email,
      age,
      password
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: newUser
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(400).json({
      error: error.message
    });
  }
});

export default router;