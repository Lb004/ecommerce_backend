import { CartModel } from "../../models/cart.model.js";

export class CartsDao {
  create(data) {
    return CartModel.create(data);
  }

  findById(id) {
    return CartModel.findById(id).populate("products.product");
  }

  save(cart) {
    return cart.save();
  }
}
