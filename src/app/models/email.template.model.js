import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            enum: ["ON_SEND_OTP", "ON_LOGIN", "ON_PASSWORD_CHANGE", "ON_PURCHASE", "ON_CANCEL", "ON_USAGE_80", "ON_1D_VALIDITY", "ON_EXPIRED", "ON_DISCOUNT", "ON_ACTIVATION_REMINDER"],
        },
        subject: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        attachments: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const EmailTemplate = mongoose.model('EmailTemplate', EmailSchema);
export default EmailTemplate;