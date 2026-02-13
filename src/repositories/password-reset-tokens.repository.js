import { PasswordResetTokensDao } from "../dao/mongo/password-reset-tokens.dao.js";

export class PasswordResetTokensRepository {
  constructor(dao = new PasswordResetTokensDao()) {
    this.dao = dao;
  }

  create(data) { return this.dao.create(data); }
  findValidByToken(token) { return this.dao.findValidByToken(token); }
  invalidateByUser(userId) { return this.dao.invalidateByUser(userId); }
  markUsed(tokenId) { return this.dao.markUsed(tokenId); }
}
