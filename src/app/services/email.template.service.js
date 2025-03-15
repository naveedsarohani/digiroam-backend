import validateMongooseObjectId from "../../utils/database/validate.mongoose.object.id.js";
import constructSearchQuery from "../../utils/database/construct.search.query.js";
import EmailTemplate from "../models/email.template.model.js";
import pagination from "../../utils/database/pagination.js";
import file from "../middlewares/file.js";

const retrieveAll = async ({ query = {}, current = 1, size = 10, sort = {} }) => {
    try {
        const searchQuery = constructSearchQuery(query, true);
        return await pagination(EmailTemplate, { query: searchQuery, current, size, sort });
    } catch (error) {
        throw new Error("Failed to retrieve email templates. Please try again.");
    }
};

const retrieveOne = async (query) => {
    try {
        if (!query || typeof query !== "object") throw new Error("Invalid query parameters");
        return await EmailTemplate.findOne(query).lean();
    } catch (error) {
        throw new Error(`Error retrieving email template: ${error.message}`);
    }
};

const create = async (data) => {
    try {
        if (!data || typeof data !== "object") throw new Error("Invalid email template data");
        return await EmailTemplate.create(data);
    } catch (error) {
        throw new Error(`Error creating email template: ${error.message}`);
    }
};

const update = async (id, data) => {
    try {
        validateMongooseObjectId(id);

        const template = await EmailTemplate.findByIdAndUpdate(id, data, { new: false });
        if (!template) throw new Error("Failed to update email template");

        if (data.attachments && template.attachments?.length) {
            await Promise.all(template.attachments.map(file.delete));
        }

        return await retrieveOne({ _id: template._id });
    } catch (error) {
        throw new Error(`Error updating email template: ${error.message}`);
    }
};

const del = async (id) => {
    try {
        validateMongooseObjectId(id);

        const template = await EmailTemplate.findByIdAndDelete(id);
        if (!template) throw new Error("Failed to delete email template");

        if (template.attachments?.length) {
            await Promise.all(template.attachments.map(file.delete));
        }

        return template;
    } catch (error) {
        throw new Error(`Error deleting email template: ${error.message}`);
    }
};


export default { retrieveAll, retrieveOne, create, update, delete: del };