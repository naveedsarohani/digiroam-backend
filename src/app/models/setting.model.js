import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
    {
        pricePercentage: {
            type: Number,
            required: true
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
    if (count === 0) await Setting.create({ pricePercentage: 10 });
}

export default Setting;
