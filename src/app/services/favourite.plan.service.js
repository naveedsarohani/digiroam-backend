import FavouritePlan from "../models/favourite.plan.model.js";

const retrieve = async (userId) => {
    try {
        return await FavouritePlan.findOne({ userId });
    } catch (error) {
        throw error;
    }
};

const update = async (userId, data) => {
    try {
        return await FavouritePlan.findOneAndUpdate(
            { userId }, data, { new: true, upsert: true }
        );
    } catch (error) {
        throw error;
    }
};

export default { retrieve, update };
