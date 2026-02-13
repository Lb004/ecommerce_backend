import { TicketModel } from "../models/ticket.model.js";

export class TicketDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  async findById(id) {
    return await TicketModel.findById(id).populate("products.product");
  }

  async findByCode(code) {
    return await TicketModel.findOne({ code }).populate("products.product");
  }

  async findByPurchaser(email) {
    return await TicketModel.find({ purchaser: email }).populate("products.product");
  }

  async findAll(filter = {}, options = {}) {
    const { limit = 10, skip = 0, sort = { purchase_datetime: -1 } } = options;
    return await TicketModel.find(filter)
      .populate("products.product")
      .limit(limit)
      .skip(skip)
      .sort(sort);
  }

  async update(id, ticketData) {
    return await TicketModel.findByIdAndUpdate(id, ticketData, { new: true });
  }

  async count(filter = {}) {
    return await TicketModel.countDocuments(filter);
  }
}