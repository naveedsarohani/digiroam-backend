import Setting from "../models/setting.model.js";

const retrieve = async () => {
    try {
        return await Setting.findOne().select("-_id");
    } catch (error) { throw error; }
};

export const update = async (data) => {
    try {
        return await Setting.findOneAndUpdate({}, data, { new: true, upsert: true }).select("-_id");
    } catch (error) { throw error; }
};

export default { retrieve, update }