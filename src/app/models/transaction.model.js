import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "USD"
    },
    type: {
        type: String,
        required: true,
        enum: ["DEPOSIT", "REFUND", "PURCHASE", "WITHDRAWAL"],
        default: "DEPOSIT",
    },
    source: {
        type: String,
        required: true,
        enum: ["STRIPE", "PAYPAL", "WALLET", "REFUND", "WITHDRAWAL"],
        default: "STRIPE",
    },
    madeAt: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;