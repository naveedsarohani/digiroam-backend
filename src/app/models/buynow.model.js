import mongoose from "mongoose";

const BuynowSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        packageCode: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        count: {
            type: Number,
            required: true,
            default: 1
        },
    },
    {
        timestamps: true,
    }
);

const Buynow = mongoose.model('Buynow', BuynowSchema);
export default Buynow;