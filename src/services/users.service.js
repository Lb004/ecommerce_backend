import { UsersRepository } from "../repositories/users.repository.js";
import { CartsRepository } from "../repositories/carts.repository.js";
import { createHash } from "../utils/hash.js";

const usersRepository = new UsersRepository();
const cartsRepository = new CartsRepository();

export class UsersService {
  async registerUser(payload) {
    const { first_name, last_name, email, age, password, role } = payload;

    if (!first_name || !last_name || !email || !password) {
      throw new Error("Todos los campos son requeridos (first_name, last_name, email, password)");
    }

    const exists = await usersRepository.getByEmail(email);
    if (exists) throw new Error("El email ya está registrado");

    const user = await usersRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      role,
      password: createHash(password)
    });

    const cart = await cartsRepository.create({ user: user._id, products: [] });
    await usersRepository.attachCart(user._id, cart._id);

    return usersRepository.getById(user._id);
  }
}
