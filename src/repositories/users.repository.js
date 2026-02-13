import { UsersDao } from "../dao/mongo/users.dao.js";

export class UsersRepository {
  constructor(dao = new UsersDao()) {
    this.dao = dao;
  }

  createUser(data) {
    return this.dao.create(data);
  }

  getByEmail(email) {
    return this.dao.findByEmail(email);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  updatePassword(userId, password) {
    return this.dao.updatePassword(userId, password);
  }

  attachCart(userId, cartId) {
    return this.dao.attachCart(userId, cartId);
  }
}
