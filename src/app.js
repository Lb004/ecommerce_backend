import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import purchaseRouter from "./routes/purchase.router.js";
import { connectDB } from "./config/database.js";
import { initializePassport } from "./config/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/purchase", purchaseRouter);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "🛒 E-Commerce API - Entrega Final",
    version: "2.0.0",
    endpoints: {
      users: "/api/users",
      sessions: "/api/sessions",
      products: "/api/products",
      carts: "/api/carts",
      purchase: "/api/purchase"
    }
  });
});

// Conectar a la base de datos
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

export default app;