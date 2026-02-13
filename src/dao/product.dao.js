import { ProductModel } from "../models/product.model.js";

export class ProductDAO {
  async create(productData) {
    return await ProductModel.create(productData);
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async findByCode(code) {
    return await ProductModel.findOne({ code });
  }

  async findAll(filter = {}, options = {}) {
    const { limit = 10, skip = 0, sort = {} } = options;
    return await ProductModel.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort);
  }

  async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  async updateStock(id, quantity) {
    return await ProductModel.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    );
  }

  async count(filter = {}) {
    return await ProductModel.countDocuments(filter);
  }
}