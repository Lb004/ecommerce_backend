import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  thumbnail: {
    type: String
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default: true
  },
  owner: {
    type: String,
    default: "admin"
  }
}, {
  timestamps: true
});

export const ProductModel = mongoose.model("Products", productSchema);