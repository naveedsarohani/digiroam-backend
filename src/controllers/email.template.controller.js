import emailService from "../services/email.template.service.js";
import validateMongooseObjectId from "../utils/database/validate.mongoose.object.id.js";
import filterRequestBody from "../utils/helpers/filter.request.body.js";

const index = async (req, res) => {
    try {
        const data = await emailService.retrieveAll(req.body.page ?? {});
        return res.response(200, "All email templates retrieved successfully", data);
    } catch (error) {
        return res.response(500, "Failed to retrieve email templates", { error: error.message });
    }
};

const show = async (req, res) => {
    try {
        const { emailTemplateId } = req.params;
        validateMongooseObjectId(emailTemplateId);

        const emailTemplate = await emailService.retrieveOne({ _id: emailTemplateId });

        return res.response(200, "Email template retrieved successfully", { emailTemplate });
    } catch (error) {
        return res.response(500, "Failed to retrieve email template", { error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const data = filterRequestBody(req.body, ["eventName", "subject", "body"]);

        if (req.files?.length) {
            data.attachments = req.files.map(({ filename }) => filename);
        }

        const existingTemplate = await emailService.retrieveOne({ eventName: data.eventName });
        if (existingTemplate) {
            const emailTemplate = await emailService.update(existingTemplate._id, data);
            return res.response(200, "Email template updated successfully", { emailTemplate });
        }

        const emailTemplate = await emailService.create(data);
        return res.response(201, "Email template created successfully", { emailTemplate });
    } catch (error) {
        return res.response(400, "Failed to create email template", { error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { emailTemplateId } = req.params;
        validateMongooseObjectId(emailTemplateId);

        const data = filterRequestBody(req.body, ["subject", "body"]);
        if (req.files?.length) {
            data.attachments = req.files.map(({ filename }) => filename);
        }

        const emailTemplate = await emailService.update(emailTemplateId, data);
        return res.response(200, "Email template updated successfully", { emailTemplate });
    } catch (error) {
        return res.response(400, "Failed to update email template", { error: error.message });
    }
};

const del = async (req, res) => {
    try {
        const { emailTemplateId } = req.params;
        validateMongooseObjectId(emailTemplateId);

        await emailService.delete(emailTemplateId);
        return res.response(200, "Email template deleted successfully");
    } catch (error) {
        return res.response(500, "Failed to delete email template", { error: error.message });
    }
};

export default { index, show, create, update, delete: del };
