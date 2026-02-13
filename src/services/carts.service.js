import { CartsRepository } from "../repositories/carts.repository.js";
import { ProductsRepository } from "../repositories/products.repository.js";
import { TicketsRepository } from "../repositories/tickets.repository.js";
import { createTicketCode } from "../utils/random.js";

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const ticketsRepository = new TicketsRepository();

export class CartsService {
  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await cartsRepository.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await productsRepository.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    const existing = cart.products.find((item) => item.product._id.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cartsRepository.save(cart);
    return cartsRepository.findById(cart._id);
  }

  async purchase(cartId, purchaserEmail) {
    const cart = await cartsRepository.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const purchasable = [];
    const notProcessed = [];

    for (const item of cart.products) {
      if (item.product.stock >= item.quantity) {
        item.product.stock -= item.quantity;
        await item.product.save();
        purchasable.push(item);
      } else {
        notProcessed.push(item.product._id);
      }
    }

    let ticket = null;
    if (purchasable.length > 0) {
      const amount = purchasable.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      ticket = await ticketsRepository.create({
        code: createTicketCode(),
        amount,
        purchaser: purchaserEmail,
        products: purchasable.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity
        }))
      });
    }

    cart.products = cart.products.filter((item) =>
      notProcessed.some((id) => id.toString() === item.product._id.toString())
    );
    await cartsRepository.save(cart);

    return { ticket, notProcessedProducts: notProcessed };
  }
}
