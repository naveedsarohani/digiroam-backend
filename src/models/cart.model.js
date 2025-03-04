import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },

    items: [
        {
            productId: { type: String, required: true,  },
            productName: { type: String, required: true },
            productPrice: { type: Number, required: true, default:0 },
            productQuantity: { type: Number, required: true, default: 1 },
        },


    ],
    totalPrice: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})


export const Cart = mongoose.model('Cart', cartSchema)