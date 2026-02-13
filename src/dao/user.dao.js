import { UserModel } from "../models/user.model.js";

export class UserDAO {
  async create(userData) {
    return await UserModel.create(userData);
  }

  async findById(id) {
    return await UserModel.findById(id).populate("cart");
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email }).populate("cart");
  }

  async findAll() {
    return await UserModel.find().populate("cart");
  }

  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  async findByResetToken(token) {
    return await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  }

  async setResetToken(userId, token, expires) {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      },
      { new: true }
    );
  }

  async clearResetToken(userId) {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
      },
      { new: true }
    );
  }
}