import { UsersRepository } from "../repositories/users.repository.js";
import { PasswordResetTokensRepository } from "../repositories/password-reset-tokens.repository.js";
import { isValidPassword, createHash } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { createSecureToken } from "../utils/random.js";
import { sendPasswordRecoveryEmail } from "../utils/mailing.js";
import { env } from "../config/env.js";

const usersRepository = new UsersRepository();
const resetTokensRepository = new PasswordResetTokensRepository();

export class SessionsService {
  async login(email, password) {
    const user = await usersRepository.getByEmail(email);
    if (!user || !isValidPassword(user, password)) {
      throw new Error("Credenciales inválidas");
    }

    return generateToken(user);
  }

  async createPasswordRecovery(email) {
    const user = await usersRepository.getByEmail(email);
    if (!user) return;

    await resetTokensRepository.invalidateByUser(user._id);

    const token = createSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await resetTokensRepository.create({ userId: user._id, token, expiresAt });

    const resetLink = `${env.appBaseUrl}/api/sessions/reset-password?token=${token}`;
    await sendPasswordRecoveryEmail({ to: user.email, resetLink });
  }

  async resetPassword(token, newPassword) {
    const tokenDoc = await resetTokensRepository.findValidByToken(token);
    if (!tokenDoc) throw new Error("Token inválido o expirado");

    const user = await usersRepository.getById(tokenDoc.userId);
    if (!user) throw new Error("Usuario no encontrado");

    if (isValidPassword(user, newPassword)) {
      throw new Error("No podés usar la misma contraseña anterior");
    }

    const hashedPassword = createHash(newPassword);
    await usersRepository.updatePassword(user._id, hashedPassword);
    await resetTokensRepository.markUsed(tokenDoc._id);
  }
}
