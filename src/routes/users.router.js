import { Router } from "express";
import { UsersService } from "../services/users.service.js";

const router = Router();
const usersService = new UsersService();

router.post("/", async (req, res) => {
  try {
    const user = await usersService.registerUser(req.body);
    const { password, ...response } = user.toObject();

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: response
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
