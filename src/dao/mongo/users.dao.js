import { UserModel } from "../../models/user.model.js";

export class UsersDao {
  create(data) {
    return UserModel.create(data);
  }

  findByEmail(email) {
    return UserModel.findOne({ email });
  }

  findById(id) {
    return UserModel.findById(id).populate("cart");
  }

  updatePassword(userId, hashedPassword) {
    return UserModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  }

  attachCart(userId, cartId) {
    return UserModel.findByIdAndUpdate(userId, { cart: cartId }, { new: true });
  }
}
