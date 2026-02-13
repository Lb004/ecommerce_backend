import { ProductsRepository } from "../repositories/products.repository.js";

const productsRepository = new ProductsRepository();

export class ProductsService {
  create(data) { return productsRepository.create(data); }
  findAll() { return productsRepository.findAll(); }
  update(id, data) { return productsRepository.update(id, data); }
  delete(id) { return productsRepository.delete(id); }
}
