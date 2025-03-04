import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  transactionId: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate transactions are stored
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "USD", // Default currency if not provided
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "COMPLETED", "FAILED","CANCELLED","DELETED"], // Possible statuses
    default: "COMPLETED",
  },
  payer: {
    name: {
      givenName: { type: String },
      surname: { type: String },
    },
    emailAddress: { type: String },
    payerId: { type: String },
    address: {
      countryCode: { type: String },
    },
  },
  packageInfoList: [
    {
      packageCode: { type: String, required: true },
      count: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  orderNo: {
    type: String, // eSIM Order Number
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
