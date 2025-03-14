import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            enum: [
                "ON_PURCHASE",
                "ON_CANCEL",
                "ON_ONE_DAY_LEFT",
                "ON_USED_80",
                "ON_OFF_20",
                "ON_OFF_50",
                "ON_OFF_80",
                "ON_TOP_UP",
                "ON_EXPIRED",
                "ON_PASSWORD_CHANGE",
                "ON_LOGIN",
                "ON_DISCOUNT"
            ],
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