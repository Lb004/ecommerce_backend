import { Router } from "express";
import passport from "passport";
import { ProductService } from "../services/product.service.js";
import { isAdmin } from "../middlewares/authorization.js";

const router = Router();
const productService = new ProductService();

// 📋 OBTENER TODOS LOS PRODUCTOS (Público)
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, sort } = req.query;
    
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    if (sort) {
      options.sort = sort === "asc" ? { price: 1 } : { price: -1 };
    }

    const products = await productService.getProducts(filter, options);
    const total = await productService.productRepository.count(filter);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      error: "Error al obtener productos"
    });
  }
});

// 🔍 OBTENER PRODUCTO POR ID (Público)
router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(404).json({
      error: error.message
    });
  }
});

// ➕ CREAR PRODUCTO (Solo Admin)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        message: "Producto creado exitosamente",
        product
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// ✏️ ACTUALIZAR PRODUCTO (Solo Admin)
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json({
        message: "Producto actualizado exitosamente",
        product
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// 🗑️ ELIMINAR PRODUCTO (Solo Admin)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const result = await productService.deleteProduct(req.params.id);
      res.json(result);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(404).json({
        error: error.message
      });
    }
  }
);

export default router;