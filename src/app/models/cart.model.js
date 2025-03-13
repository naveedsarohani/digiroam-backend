import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0
        },

        // items info
        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                productName: {
                    type: String,
                    required: true
                },
                productPrice: {
                    type: Number,
                    required: true,
                    default: 0
                },
                productQuantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;