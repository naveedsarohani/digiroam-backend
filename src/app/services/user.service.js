import validateMongooseObjectId from "../../utils/database/validate.mongoose.object.id.js";
import constructSearchQuery from "../../utils/database/construct.search.query.js";
import pagination from "../../utils/database/pagination.js";
import { User } from "../../models/user.model.js";

const retrieveAll = async ({ query = {}, current = 1, size = 10, sort = {} }) => {
    try {
        const searchQuery = constructSearchQuery(query, true);
        return await pagination(User, { query: searchQuery, current, size, sort }, { select: ["-password"] });
    } catch (error) {
        throw new Error("Failed to retrieve Users. Please try again.");
    }
};

const retrieveOne = async (query) => {
    try {
        if (!query || typeof query !== "object") throw new Error("Invalid query parameters");

        return await User.findOne(query).select("-password -__v").lean();
    } catch (error) {
        throw new Error(`Error retrieving User: ${error.message}`);
    }
};

const create = async (data) => {
    try {
        if (!data || typeof data !== "object") throw new Error("Invalid User data");
        return await User.create(data);
    } catch (error) {
        throw new Error(`Error creating User: ${error.message}`);
    }
};

const update = async (id, data) => {
    try {
        validateMongooseObjectId(id);

        const user = await User.findByIdAndUpdate(id, data, { new: true }).select("-password -__v");
        if (!user) throw new Error("Failed to update User");

        return user;
    } catch (error) {
        throw new Error(`Error updating User: ${error.message}`);
    }
};

const del = async (id) => {
    try {
        validateMongooseObjectId(id);

        const user = await User.findByIdAndDelete(id).select();
        if (!user) throw new Error("User account not found");

        return user;
    } catch (error) {
        throw new Error(`Error deleting User: ${error.message}`);
    }
};


export default { retrieveAll, retrieveOne, create, update, delete: del };