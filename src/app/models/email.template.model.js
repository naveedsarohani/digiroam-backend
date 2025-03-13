import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            enum: [
                "ON_PURCHASE",
                "ON_CANCEL",
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