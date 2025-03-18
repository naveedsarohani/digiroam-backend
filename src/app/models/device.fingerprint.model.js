import mongoose from "mongoose";

const DeviceFingerprintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fingerprint: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        browser: {
            type: String,
            required: true
        },
        os: {
            type: String,
            required: true
        },
        deviceName: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        loginTime: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        },
        lastUsed: {
            type: Date,
            default: Date.now
        }
    }
);

const DeviceFingerprint = mongoose.model('DeviceFingerprint', DeviceFingerprintSchema);
export default DeviceFingerprint;