import mongoose from "mongoose";

import ESimPlan from "../models/esim.plan.model.js";

const index = async (req, res) => {
    try {
        const AllESimPlan = await ESimPlan.aggregate([
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "countryId",
                },
            }, { $addFields: { countryId: { $arrayElemAt: ["$countryId", 0] } } },
        ]);

        return res.response(200, "All eSim plans retrived", { AllESimPlan });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const countryESimPlans = async (req, res) => {
    try {
        let { countryId } = req.params;

        const AllESimPlan = await ESimPlan.aggregate([
            { $match: { countryId: new mongoose.Schema.Types.ObjectId(countryId) } },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "countryId",
                },
            },
            { $addFields: { countryId: { $arrayElemAt: ["$countryId", 0] } } }
        ]);

        return res.response(200, "All eSim plans retrived", { AllESimPlan });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { planName, dataLimit, voiceMinutes, messageLimits, validity, price, description, countryId } = req.body;

        if (await ESimPlan.findOne({ planName, countryId })) {
            return res.response(400, "ESim Plan already exists with this name and country");
        }

        const eSimPlan = await ESimPlan.create({
            planName, dataLimit, voiceMinutes, messageLimits, validity, price, description, countryId
        });

        if (!eSimPlan) throw new Error("Failed to create ESim Plan");

        return res.response(201, "Successfully eSimPlan created", { eSimPlan });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const update = async (req, res) => {
    const { dataLimit, voiceMinutes, messageLimits, validity, price, description } = req.body;;

    try {
        const eSimPlan = await ESimPlan.findOne({ _id: req.params.id });
        if (!eSimPlan) return res.response(404, "eSim Plan not found");

        eSimPlan.dataLimit = dataLimit;
        eSimPlan.voiceMinutes = voiceMinutes;
        eSimPlan.messageLimits = messageLimits;
        eSimPlan.validity = validity;
        eSimPlan.price = price;
        eSimPlan.description = description;
        await eSimPlan.save();

        return res.response(200, "eSim Plan updated successfully");
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

export default { index, countryESimPlans, create, update };
