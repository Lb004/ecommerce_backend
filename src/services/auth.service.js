import { UserRepository } from "../repositories/user.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken, generateResetToken } from "../utils/jwt.js";
import { EmailService } from "../utils/email.js";
import crypto from "crypto";

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
    this.emailService = new EmailService();
  }

  async register(userData) {
    const { first_name, last_name, email, age, password } = userData;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Formato de email inválido");
    }

    // Validar contraseña
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Crear carrito para el nuevo usuario
    const cart = await this.cartRepository.create({ user: null, products: [] });

    // Crear usuario con contraseña hasheada
    const newUser = await this.userRepository.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cart._id
    });

    // Actualizar el carrito con el ID del usuario
    await this.cartRepository.update(cart._id, { user: newUser.id });

    return newUser;
  }

  async login(email, password) {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Validar contraseña
    if (!isValidPassword(user, password)) {
      throw new Error("Credenciales inválidas");
    }

    // Generar token JWT
    const token = generateToken(user);

    return { token, user };
  }

  async requestPasswordReset(email) {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { 
        success: true, 
        message: "Si el email existe, recibirás un correo con instrucciones" 
      };
    }

    // Generar token de recuperación único
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hora

    // Guardar token en la base de datos
    await this.userRepository.setResetToken(user._id, resetToken, resetTokenExpires);

    // Enviar email con el link de recuperación
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: "Si el email existe, recibirás un correo con instrucciones"
    };
  }

  async resetPassword(token, newPassword) {
    // Buscar usuario por token válido
    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new Error("Token inválido o expirado");
    }

    // Validar que la nueva contraseña sea diferente a la anterior
    if (isValidPassword(user, newPassword)) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    // Validar longitud de la nueva contraseña
    if (newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Actualizar contraseña
    const hashedPassword = createHash(newPassword);
    await this.userRepository.update(user._id, { password: hashedPassword });

    // Limpiar token de recuperación
    await this.userRepository.clearResetToken(user._id);

    return {
      success: true,
      message: "Contraseña restablecida exitosamente"
    };
  }
}