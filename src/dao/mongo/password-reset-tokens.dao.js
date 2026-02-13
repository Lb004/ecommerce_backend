import { PasswordResetTokenModel } from "../../models/password-reset-token.model.js";

export class PasswordResetTokensDao {
  create(data) {
    return PasswordResetTokenModel.create(data);
  }

  findValidByToken(token) {
    return PasswordResetTokenModel.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });
  }

  invalidateByUser(userId) {
    return PasswordResetTokenModel.updateMany({ userId, used: false }, { used: true });
  }

  markUsed(tokenId) {
    return PasswordResetTokenModel.findByIdAndUpdate(tokenId, { used: true });
  }
}
