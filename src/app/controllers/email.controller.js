import emailService from "../services/email.template.service.js";
import User from "../models/user.model.js";
import email from "../../utils/helpers/email.js";
import path from "path";
import { retrieveEmailAndPhone, retrieveProfiles } from "../../utils/helpers/email.on.event.js";
import retrieveHtmlTemplate from "../../utils/helpers/retrieve.html.template.js";

const send = async (req, res) => {
    try {
        const { eventName, userEmail, orderNo, iccid } = req.body;
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        const user = await User.findOne({ email: userEmail });
        const template = await emailService.retrieveOne({ eventName });
        if (!template) return res.response(404, "The email template not found", { eventName });

        const emailAttachments = template.attachments?.map(filename => ({
            filename,
            path: path.join(process.cwd(), "public/uploads", filename),
        })) ?? [];

        template.body = template.body
            .replaceAll("{{CUSTOMER_NAME}}", user.name);

        // once there an orderId|iccid
        if (orderNo || iccid) {
            const profiles = (await retrieveProfiles({ orderNo, iccid }) ?? []);

            const emailPromises = profiles.map(async (profile, index) => {
                // replace placeholders in the body
                template.body = template.body
                    .replaceAll("{{PLAN_NAME}}", profile.packageList[0].packageName ?? "N/A")
                    .replaceAll("{{COUNTRY}}", profile.packageList[0].locationCode ?? "N/A")
                    .replaceAll("{{DAYS}}", profile.totalDuration ?? "N/A")
                    .replaceAll("{{DATA_LIMIT}}", (((profile.totalVolume / 1024) / 1024) / 1024) ?? "N/A");

                // replace placeholders in the subject
                template.subject = template.subject
                    .replaceAll("{{ORDER_ID}}", profile.orderNo ?? "N/A")
                    .replaceAll("{{ICCID}}", profile.iccid ?? "N/A");

                // email options
                const emailOptions = {
                    subject: template.subject,
                    html: await retrieveHtmlTemplate('on.discount', {
                        title: template.subject,
                        content: template.body,
                        description: null,
                        email: emailAddress,
                        phone: phoneNumber
                    }),
                    attachments: emailAttachments
                };
                // trigger email;
                return email.send(user.email, emailOptions);
            })

            await Promise.all(emailPromises);
            return res.response(200, `The emails were sent successfully`);
        }

        const emailOptions = {
            subject: template.subject,
            html: await retrieveHtmlTemplate('on.discount', {
                title: template.subject,
                content: template.body,
                description: null,
                email: emailAddress,
                phone: phoneNumber
            }),
            attachments: emailAttachments
        };

        if (!(await email.send(user.email, emailOptions))) {
            return res.response(500, "Failed to send email. Please try again");
        }

        return res.response(200, `The email was sent successfully`);
    } catch (error) {
        res.response(500, "Internal server error", { error: error.message })
    }
};

export default { send };
