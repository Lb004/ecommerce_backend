import { ProductsDao } from "../dao/mongo/products.dao.js";

export class ProductsRepository {
  constructor(dao = new ProductsDao()) {
    this.dao = dao;
  }

  create(data) { return this.dao.create(data); }
  findAll() { return this.dao.findAll(); }
  findById(id) { return this.dao.findById(id); }
  update(id, data) { return this.dao.update(id, data); }
  delete(id) { return this.dao.delete(id); }
}
