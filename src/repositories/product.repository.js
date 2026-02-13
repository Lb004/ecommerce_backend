import { ProductDAO } from "../dao/product.dao.js";
import { ProductDTO } from "../dto/product.dto.js";

export class ProductRepository {
  constructor() {
    this.dao = new ProductDAO();
  }

  async create(productData) {
    const product = await this.dao.create(productData);
    return new ProductDTO(product);
  }

  async findById(id) {
    const product = await this.dao.findById(id);
    return product ? new ProductDTO(product) : null;
  }

  async findByCode(code) {
    const product = await this.dao.findByCode(code);
    return product ? new ProductDTO(product) : null;
  }

  async findAll(filter = {}, options = {}) {
    const products = await this.dao.findAll(filter, options);
    return products.map(product => new ProductDTO(product));
  }

  async update(id, productData) {
    const product = await this.dao.update(id, productData);
    return product ? new ProductDTO(product) : null;
  }

  async delete(id) {
    const product = await this.dao.delete(id);
    return product ? new ProductDTO(product) : null;
  }

  async updateStock(id, quantity) {
    const product = await this.dao.updateStock(id, quantity);
    return product ? new ProductDTO(product) : null;
  }

  async count(filter = {}) {
    return await this.dao.count(filter);
  }
}