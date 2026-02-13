import { Router } from "express";
import passport from "passport";
import { PurchaseService } from "../services/purchase.service.js";
import { isAdmin } from "../middlewares/authorization.js";

const router = Router();
const purchaseService = new PurchaseService();

// 💳 REALIZAR COMPRA (Solo usuarios)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Verificar que el usuario tenga rol "user"
      if (req.user.role !== "user") {
        return res.status(403).json({
          error: "Solo los usuarios pueden realizar compras"
        });
      }

      const result = await purchaseService.processPurchase(
        req.user._id,
        req.user.email
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error al procesar compra:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// 🎫 OBTENER TICKET POR CÓDIGO
router.get(
  "/ticket/:code",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const ticket = await purchaseService.getTicketByCode(req.params.code);

      // Verificar que el ticket pertenezca al usuario o sea admin
      if (ticket.purchaser !== req.user.email && req.user.role !== "admin") {
        return res.status(403).json({
          error: "No tienes permiso para ver este ticket"
        });
      }

      res.json({ ticket });
    } catch (error) {
      console.error("Error al obtener ticket:", error);
      res.status(404).json({
        error: error.message
      });
    }
  }
);

// 📋 OBTENER MIS TICKETS (Usuario)
router.get(
  "/my-tickets",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const tickets = await purchaseService.getUserTickets(req.user.email);

      res.json({
        tickets,
        count: tickets.length
      });
    } catch (error) {
      console.error("Error al obtener tickets:", error);
      res.status(500).json({
        error: "Error al obtener tickets"
      });
    }
  }
);

// 📊 OBTENER TODOS LOS TICKETS (Solo Admin)
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const { limit = 10, page = 1, status } = req.query;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit)
      };

      const tickets = await purchaseService.getAllTickets(filter, options);
      const total = await purchaseService.ticketRepository.count(filter);

      res.json({
        tickets,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error("Error al obtener tickets:", error);
      res.status(500).json({
        error: "Error al obtener tickets"
      });
    }
  }
);

export default router;