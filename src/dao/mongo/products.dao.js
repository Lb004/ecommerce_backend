import { ProductModel } from "../../models/product.model.js";

export class ProductsDao {
  create(data) {
    return ProductModel.create(data);
  }

  findAll() {
    return ProductModel.find();
  }

  findById(id) {
    return ProductModel.findById(id);
  }

  update(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}
