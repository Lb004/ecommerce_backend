import { TicketDAO } from "../dao/ticket.dao.js";
import { TicketDTO } from "../dto/ticket.dto.js";

export class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }

  async create(ticketData) {
    const ticket = await this.dao.create(ticketData);
    return new TicketDTO(ticket);
  }

  async findById(id) {
    const ticket = await this.dao.findById(id);
    return ticket ? new TicketDTO(ticket) : null;
  }

  async findByCode(code) {
    const ticket = await this.dao.findByCode(code);
    return ticket ? new TicketDTO(ticket) : null;
  }

  async findByPurchaser(email) {
    const tickets = await this.dao.findByPurchaser(email);
    return tickets.map(ticket => new TicketDTO(ticket));
  }

  async findAll(filter = {}, options = {}) {
    const tickets = await this.dao.findAll(filter, options);
    return tickets.map(ticket => new TicketDTO(ticket));
  }

  async update(id, ticketData) {
    const ticket = await this.dao.update(id, ticketData);
    return ticket ? new TicketDTO(ticket) : null;
  }

  async count(filter = {}) {
    return await this.dao.count(filter);
  }
}