import { CartDAO } from "../dao/cart.dao.js";

export class CartRepository {
  constructor() {
    this.dao = new CartDAO();
  }

  async create(cartData) {
    return await this.dao.create(cartData);
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async findByUser(userId) {
    return await this.dao.findByUser(userId);
  }

  async update(id, cartData) {
    return await this.dao.update(id, cartData);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async addProduct(cartId, productId, quantity) {
    return await this.dao.addProduct(cartId, productId, quantity);
  }

  async removeProduct(cartId, productId) {
    return await this.dao.removeProduct(cartId, productId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.dao.updateProductQuantity(cartId, productId, quantity);
  }

  async clearCart(cartId) {
    return await this.dao.clearCart(cartId);
  }
}