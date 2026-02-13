import { UserDAO } from "../dao/user.dao.js";
import { UserDTO } from "../dto/user.dto.js";

export class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  async create(userData) {
    const user = await this.dao.create(userData);
    return new UserDTO(user);
  }

  async findById(id) {
    const user = await this.dao.findById(id);
    return user ? new UserDTO(user) : null;
  }

  async findByEmail(email) {
    const user = await this.dao.findByEmail(email);
    return user;
  }

  async findAll() {
    const users = await this.dao.findAll();
    return users.map(user => new UserDTO(user));
  }

  async update(id, userData) {
    const user = await this.dao.update(id, userData);
    return user ? new UserDTO(user) : null;
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async findByResetToken(token) {
    return await this.dao.findByResetToken(token);
  }

  async setResetToken(userId, token, expires) {
    return await this.dao.setResetToken(userId, token, expires);
  }

  async clearResetToken(userId) {
    return await this.dao.clearResetToken(userId);
  }
}