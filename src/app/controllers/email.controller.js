import emailService from "../services/email.template.service.js";
import { User } from "../../models/user.model.js";
import email from "../../utils/helpers/email.js";
import path from "path";

const send = async (req, res) => {
    try {
        const { eventName, userEmail } = req.body;

        const user = await User.findOne({ email: userEmail });
        const template = await emailService.retrieveOne({ eventName });

        const emailAttachments = template.attachments?.map(filename => ({
            filename,
            path: path.join(process.cwd(), "public/uploads", filename),
        })) ?? [];

        template.body = template.body
            .replace(/{Customer_Name}/g, user.name ?? "Dear Customer");

        const emailOptions = {
            subject: template.subject,
            html: template.body,
            attachments: emailAttachments
        };

        if (!(await email.send(user.email, emailOptions))) {
            res.response(500, "Failed to send email. Please try again");
        }

        res.response(200, `The email was sent successfully`);
    } catch (error) {
        res.response(500, "internal server error", { error: error.message })
    }
};

export default { send };
