import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { CartsService } from "../services/carts.service.js";

const router = Router();
const cartsService = new CartsService();

router.post("/:cid/product/:pid", passport.authenticate("current", { session: false }), authorizeRoles("user"), async (req, res) => {
  try {
    const cart = await cartsService.addProductToCart(req.params.cid, req.params.pid);
    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:cid/purchase", passport.authenticate("current", { session: false }), authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const response = await cartsService.purchase(req.params.cid, req.user.email);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
