import { ProductRepository } from "../repositories/product.repository.js";

export class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(productData) {
    const { title, description, price, code, stock, category, thumbnail } = productData;

    // Validaciones
    if (!title || !description || !price || !code || !stock || !category) {
      throw new Error("Todos los campos son requeridos");
    }

    if (price < 0) {
      throw new Error("El precio no puede ser negativo");
    }

    if (stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    // Verificar que el código no exista
    const existingProduct = await this.productRepository.findByCode(code);
    if (existingProduct) {
      throw new Error("Ya existe un producto con ese código");
    }

    // Crear producto
    const product = await this.productRepository.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status: true
    });

    return product;
  }

  async getProducts(filter = {}, options = {}) {
    return await this.productRepository.findAll(filter, options);
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async updateProduct(id, productData) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // Si se actualiza el código, verificar que no exista
    if (productData.code && productData.code !== product.code) {
      const existingProduct = await this.productRepository.findByCode(productData.code);
      if (existingProduct) {
        throw new Error("Ya existe un producto con ese código");
      }
    }

    const updatedProduct = await this.productRepository.update(id, productData);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    await this.productRepository.delete(id);
    return { success: true, message: "Producto eliminado" };
  }

  async updateStock(id, quantity) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const updatedProduct = await this.productRepository.updateStock(id, quantity);
    return updatedProduct;
  }

  async checkStock(productId, quantity) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return { available: false, message: "Producto no encontrado" };
    }

    if (product.stock < quantity) {
      return {
        available: false,
        message: `Stock insuficiente. Disponible: ${product.stock}`,
        availableStock: product.stock
      };
    }

    return { available: true, product };
  }
}