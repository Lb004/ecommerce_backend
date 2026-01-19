import { Router } from "express";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/hash.js";

const router = Router();

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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Formato de email inválido" 
      });
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    // Validar edad si se proporciona
    if (age && (age < 0 || age > 150)) {
      return res.status(400).json({ 
        error: "Edad inválida" 
      });
    }

    // Verificar si el usuario ya existe
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ 
        error: "El email ya está registrado" 
      });
    }

    // Crear nuevo usuario con contraseña encriptada
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    });

    // Excluir la contraseña de la respuesta
    const { password: _, ...userResponse } = newUser._doc;

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: userResponse
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Error de validación", 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: "Error al crear usuario" 
    });
  }
});

export default router;