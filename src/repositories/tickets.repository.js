import { TicketsDao } from "../dao/mongo/tickets.dao.js";

export class TicketsRepository {
  constructor(dao = new TicketsDao()) {
    this.dao = dao;
  }

  create(data) { return this.dao.create(data); }
}
