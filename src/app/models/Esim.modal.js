import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
    {
        packageName: String,
        packageCode: String,
        slug: String,
        duration: Number,
        volume: Number,
        locationCode: String,
        createTime: Date,
    },
    { _id: false }
);

const EsimSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderNo: {
            type: String,
            required: true,
            index: true
        },
        iccid: {
            type: String,
            required: true,
            unique: true
        },
        transactionId: String,
        esimTranNo: String,
        imsi: String,

        smsStatus: Number,
        msisdn: String,
        ac: String,
        qrCodeUrl: String,
        shortUrl: String,
        smdpStatus: String,
        eid: String,
        activeType: Number,
        dataType: Number,
        activateTime: Date,
        installationTime: Date,
        expiredTime: Date,
        totalVolume: Number,
        totalDuration: Number,
        durationUnit: String,
        orderUsage: Number,
        esimStatus: String,
        pin: String,
        puk: String,
        apn: String,
        ipExport: String,
        supportTopUpType: Number,
        fupPolicy: String,
        packageList: [PackageSchema]
    },
    {
        timestamps: true
    }
);

const Esim = mongoose.model("Esim", EsimSchema);
export default Esim;
