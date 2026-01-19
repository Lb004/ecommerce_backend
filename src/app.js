import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import { connectDB } from "./config/database.js";
import { initializePassport } from "./config/passport.js";

dotenv.config();

const app = express();

app.use(express.json());

initializePassport();
app.use(passport.initialize());

app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

connectDB();

app.listen(8080, () => {
  console.log("🚀 Servidor activo en puerto 8080");
});
