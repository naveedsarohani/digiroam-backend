import mongoose from "mongoose";

const FavouritePlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plans: {
            type: [
                {
                    packageCode: {
                        type: String,
                        required: true,
                    },
                    slug: {
                        type: String,
                        required: true,
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const FavouritePlan = mongoose.model("FavouritePlan", FavouritePlanSchema);
export default FavouritePlan;
