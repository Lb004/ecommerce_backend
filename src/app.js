import express from "express";
import passport from "passport";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { connectDB } from "./config/database.js";
import { initializePassport } from "./config/passport.js";
import { env } from "./config/env.js";

const app = express();
app.use(express.json());

initializePassport();
app.use(passport.initialize());

app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

connectDB();

app.listen(env.port, () => {
  console.log(`🚀 Servidor activo en puerto ${env.port}`);
});
