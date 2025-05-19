import Transaction from "../models/transaction.model.js";

const retrieve = async (userId) => {
    try {
        return await Transaction.findOne({ userId });
    } catch (error) { throw error; }
};

export const create = async (data) => {
    try {
        return await Transaction.create(data);
    } catch (error) { throw error; }
};

export const update = async (query, data) => {
    try {
        return await Transaction.findByIdAndUpdate(query, data, { new: true });
    } catch (error) { throw error; }
};

export default { retrieve, create, update }