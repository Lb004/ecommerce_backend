import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { ProductsService } from "../services/products.service.js";

const router = Router();
const productsService = new ProductsService();

router.get("/", async (_req, res) => {
  const products = await productsService.findAll();
  res.json({ products });
});

router.post("/", passport.authenticate("current", { session: false }), authorizeRoles("admin"), async (req, res) => {
  const product = await productsService.create(req.body);
  res.status(201).json({ product });
});

router.put("/:pid", passport.authenticate("current", { session: false }), authorizeRoles("admin"), async (req, res) => {
  const updated = await productsService.update(req.params.pid, req.body);
  res.json({ product: updated });
});

router.delete("/:pid", passport.authenticate("current", { session: false }), authorizeRoles("admin"), async (req, res) => {
  await productsService.delete(req.params.pid);
  res.json({ message: "Producto eliminado" });
});

export default router;
