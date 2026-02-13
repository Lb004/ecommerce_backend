import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";

export class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async getCartByUser(userId) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  async addProductToCart(userId, productId, quantity = 1) {
    // Verificar que el producto existe y tiene stock
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    // Obtener carrito del usuario
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // Agregar producto al carrito
    const updatedCart = await this.cartRepository.addProduct(cart._id, productId, quantity);
    return updatedCart;
  }

  async removeProductFromCart(userId, productId) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const updatedCart = await this.cartRepository.removeProduct(cart._id, productId);
    return updatedCart;
  }

  async updateProductQuantity(userId, productId, quantity) {
    if (quantity < 1) {
      throw new Error("La cantidad debe ser al menos 1");
    }

    // Verificar stock
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const updatedCart = await this.cartRepository.updateProductQuantity(
      cart._id,
      productId,
      quantity
    );
    return updatedCart;
  }

  async clearCart(userId) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const clearedCart = await this.cartRepository.clearCart(cart._id);
    return clearedCart;
  }

  async getCartTotal(userId) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    let total = 0;
    for (const item of cart.products) {
      if (item.product && item.product.price) {
        total += item.product.price * item.quantity;
      }
    }

    return {
      cart,
      total,
      itemCount: cart.products.length
    };
  }
}