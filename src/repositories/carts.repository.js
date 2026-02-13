import { CartsDao } from "../dao/mongo/carts.dao.js";

export class CartsRepository {
  constructor(dao = new CartsDao()) {
    this.dao = dao;
  }

  create(data) { return this.dao.create(data); }
  findById(id) { return this.dao.findById(id); }
  save(cart) { return this.dao.save(cart); }
}
