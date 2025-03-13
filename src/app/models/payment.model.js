import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderNo: {
            type: String,
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

        // purchasing products info
        packageInfoList: [
            {
                packageCode: {
                    type: String,
                    required: true
                },
                count: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
            },
        ],

        // payment maker info
        payer: {
            name: {
                givenName: {
                    type: String
                },
                surname: {
                    type: String
                },
            },
            emailAddress: {
                type: String
            },
            payerId: {
                type: String
            },
            address: {
                countryCode: {
                    type: String
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;