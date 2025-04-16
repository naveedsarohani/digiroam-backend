import { createTransport } from "nodemailer";
import { mail } from "../../config/env.js";
import retrieveHtmlTemplate from "./retrieve.html.template.js";

const createTransporter = () => {
    return createTransport({
        host: mail.host,
        port: mail.port,
        secure: false,
        auth: {
            user: mail.user,
            pass: mail.pass,
        },
    });
};

const transporter = createTransporter();

const send = async (email, options) => {
    const mailOptions = {
        from: `"RoamDigi" ${mail.user}`,
        to: email,
        subject: options.subject ?? "RoamDigi - Your travel Partner",
        attachments: options.attachments ?? []
    };

    if (options?.template) {
        mailOptions.html = await retrieveHtmlTemplate(options.template, options);
    } else if (options?.html) {
        mailOptions.html = options.html;
    } else {
        mailOptions.text = options?.text ?? "";
    }

    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

export default { send };