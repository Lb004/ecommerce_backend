import { Router } from "express";
import passport from "passport";
import { CartService } from "../services/cart.service.js";

const router = Router();
const cartService = new CartService();

// 🛒 OBTENER CARRITO DEL USUARIO (Usuario autenticado)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cart = await cartService.getCartByUser(req.user._id);
      res.json({ cart });
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(404).json({
        error: error.message
      });
    }
  }
);

// ➕ AGREGAR PRODUCTO AL CARRITO (Solo usuarios)
router.post(
  "/products/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Verificar que el usuario tenga rol "user"
      if (req.user.role !== "user") {
        return res.status(403).json({
          error: "Solo los usuarios pueden agregar productos al carrito"
        });
      }

      const { productId } = req.params;
      const { quantity = 1 } = req.body;

      const cart = await cartService.addProductToCart(
        req.user._id,
        productId,
        quantity
      );

      res.json({
        message: "Producto agregado al carrito",
        cart
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// 🗑️ ELIMINAR PRODUCTO DEL CARRITO
router.delete(
  "/products/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cart = await cartService.removeProductFromCart(
        req.user._id,
        req.params.productId
      );

      res.json({
        message: "Producto eliminado del carrito",
        cart
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// ✏️ ACTUALIZAR CANTIDAD DE PRODUCTO
router.put(
  "/products/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          error: "La cantidad debe ser al menos 1"
        });
      }

      const cart = await cartService.updateProductQuantity(
        req.user._id,
        req.params.productId,
        quantity
      );

      res.json({
        message: "Cantidad actualizada",
        cart
      });
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// 🧹 VACIAR CARRITO
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cart = await cartService.clearCart(req.user._id);

      res.json({
        message: "Carrito vaciado",
        cart
      });
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// 💰 OBTENER TOTAL DEL CARRITO
router.get(
  "/total",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await cartService.getCartTotal(req.user._id);
      res.json(result);
    } catch (error) {
      console.error("Error al calcular total:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

export default router;