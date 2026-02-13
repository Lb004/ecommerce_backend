import { TicketModel } from "../../models/ticket.model.js";

export class TicketsDao {
  create(data) {
    return TicketModel.create(data);
  }
}
