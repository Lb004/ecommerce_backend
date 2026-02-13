import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purchaser: {
    type: String,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products"
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ["completed", "partial"],
    default: "completed"
  }
}, {
  timestamps: true
});

export const TicketModel = mongoose.model("Tickets", ticketSchema);