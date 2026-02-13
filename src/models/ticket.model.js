import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
        quantity: { type: Number, required: true }
      }
    ],
    purchase_datetime: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const TicketModel = mongoose.model("Tickets", ticketSchema);
