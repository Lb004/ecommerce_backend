import { CartModel } from "../models/cart.model.js";

export class CartDAO {
  async create(cartData) {
    return await CartModel.create(cartData);
  }

  async findById(id) {
    return await CartModel.findById(id).populate("products.product");
  }

  async findByUser(userId) {
    return await CartModel.findOne({ user: userId }).populate("products.product");
  }

  async update(id, cartData) {
    return await CartModel.findByIdAndUpdate(id, cartData, { new: true }).populate("products.product");
  }

  async delete(id) {
    return await CartModel.findByIdAndDelete(id);
  }

  async addProduct(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    
    if (!cart) {
      return null;
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await this.findById(cartId);
  }

  async removeProduct(cartId, productId) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate("products.product");
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await CartModel.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    ).populate("products.product");
  }

  async clearCart(cartId) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      { $set: { products: [] } },
      { new: true }
    );
  }
}