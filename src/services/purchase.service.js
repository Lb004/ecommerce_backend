import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { EmailService } from "../utils/email.js";
import { generateUniqueCode } from "../utils/generateCode.js";

export class PurchaseService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.ticketRepository = new TicketRepository();
    this.emailService = new EmailService();
  }

  async processPurchase(userId, userEmail) {
    // Obtener carrito del usuario
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart || cart.products.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const productsProcessed = [];
    const productsNotProcessed = [];
    let totalAmount = 0;

    // Procesar cada producto del carrito
    for (const item of cart.products) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      // Verificar stock
      if (product.stock >= requestedQuantity) {
        // Hay stock suficiente
        productsProcessed.push({
          product: product._id,
          quantity: requestedQuantity,
          price: product.price
        });

        totalAmount += product.price * requestedQuantity;

        // Reducir stock
        await this.productRepository.updateStock(product._id, -requestedQuantity);
      } else {
        // Stock insuficiente
        productsNotProcessed.push({
          product: product._id,
          title: product.title,
          requestedQuantity,
          availableStock: product.stock
        });
      }
    }

    // Si no se pudo procesar ningún producto
    if (productsProcessed.length === 0) {
      throw new Error("No se pudo procesar ningún producto. Stock insuficiente.");
    }

    // Crear ticket
    const ticketCode = generateUniqueCode("TICKET-");
    const ticketStatus = productsNotProcessed.length > 0 ? "partial" : "completed";

    const ticket = await this.ticketRepository.create({
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: productsProcessed,
      status: ticketStatus
    });

    // Actualizar carrito: eliminar productos procesados
    for (const processedProduct of productsProcessed) {
      await this.cartRepository.removeProduct(cart._id, processedProduct.product);
    }

    // Enviar email de confirmación
    await this.emailService.sendPurchaseConfirmation(userEmail, ticket);

    return {
      success: true,
      ticket,
      productsProcessed: productsProcessed.length,
      productsNotProcessed,
      message: ticketStatus === "completed" 
        ? "Compra completada exitosamente" 
        : "Compra parcialmente completada. Algunos productos no tenían stock suficiente."
    };
  }

  async getTicketByCode(code) {
    const ticket = await this.ticketRepository.findByCode(code);
    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }
    return ticket;
  }

  async getUserTickets(email) {
    const tickets = await this.ticketRepository.findByPurchaser(email);
    return tickets;
  }

  async getAllTickets(filter = {}, options = {}) {
    return await this.ticketRepository.findAll(filter, options);
  }
}