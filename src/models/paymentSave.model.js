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
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "USD",
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED", "DELETED"],
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
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
