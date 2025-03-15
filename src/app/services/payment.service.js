import validateMongooseObjectId from "../../utils/database/validate.mongoose.object.id.js";
import constructSearchQuery from "../../utils/database/construct.search.query.js";
import pagination from "../../utils/database/pagination.js";
import Payment from "../models/payment.model.js";
import populateOptions from "../../utils/constants/populate.options.js";

const retrieveAll = async ({ query = {}, current = 1, size = 10, sort = {} }) => {
    try {
        const searchQuery = constructSearchQuery(query, true);
        return await pagination(Payment, { query: searchQuery, current, size, sort });
    } catch (error) {
        throw new Error("Failed to retrieve payments. Please try again.");
    }
};

const retrieveMany = async (query) => {
    try {
        if (!query || typeof query !== "object") throw new Error("Invalid query parameters");

        return await Payment.find(query).populate(populateOptions.payment).lean();
    } catch (error) {
        throw new Error(`Error retrieving payment: ${error.message}`);
    }
};

const retrieveOne = async (query) => {
    try {
        if (!query || typeof query !== "object") throw new Error("Invalid query parameters");

        return await Payment.findOne(query).populate(populateOptions.payment).lean();
    } catch (error) {
        throw new Error(`Error retrieving payment: ${error.message}`);
    }
};

const create = async (data) => {
    try {
        if (!data || typeof data !== "object") throw new Error("Invalid payment data");
        return await Payment.create(data);
    } catch (error) {
        throw new Error(`Error creating payment: ${error.message}`);
    }
};

const update = async (id, data) => {
    try {
        validateMongooseObjectId(id);

        const payment = await Payment.findByIdAndUpdate(id, data, { new: true });
        if (!payment) throw new Error("Failed to update payment");

        return payment;
    } catch (error) {
        throw new Error(`Error updating payment: ${error.message}`);
    }
};

const del = async (id) => {
    try {
        validateMongooseObjectId(id);

        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) throw new Error("Failed to delete payment");

        return payment;
    } catch (error) {
        throw new Error(`Error deleting payment: ${error.message}`);
    }
};


export default { retrieveAll, retrieveMany, retrieveOne, create, update, delete: del };