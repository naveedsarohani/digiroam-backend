import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
    {
        pricePercentage: {
            type: Number,
            required: true,
            default: 1,
        },
        minTopupRange: {
            type: Number,
            required: true,
            default: 5
        },
        serviceLinks: {
            type: [{
                label: { type: String, required: true },
                href: { type: String, required: true },
                isHidden: { type: Boolean, default: false }
            }],
            default: []
        },
        contactList: {
            type: [{
                field: { type: String, required: true },
                label: { type: String, required: true },
                href: { type: String, default: null },
                isHidden: { type: Boolean, default: false }
            }],
            default: []
        }
    },
    {
        versionKey: false
    }
);

const Setting = mongoose.model('Setting', SettingSchema);
Setting.on('index', ensureDefaultSetting);

async function ensureDefaultSetting() {
    const count = await Setting.countDocuments();
    if (count === 0) await Setting.create({
        pricePercentage: 1,
        minTopupRange: 5,
        serviceLinks: [],
        contactList: []
    });
}

export default Setting;
