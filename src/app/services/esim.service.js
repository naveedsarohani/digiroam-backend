import { retrieveProfiles } from "../../utils/helpers/email.on.event.js";
import Esim from "../models/Esim.modal.js";
import Payment from "../models/payment.model.js";

export const create = async (userId, orderNo) => {
    try {
        const esims = await retrieveProfiles({ orderNo });

        return await Promise.all(
            esims.map(esim => Esim.create({ userId, orderNo, ...esim }))
        );
    } catch (error) {
        console.error("eSIM creation failed:", error.message);
        throw error;
    }
};

export const retrieveByUserId = async (userId) => {
    try {
        const payments = await Payment.find({ userId });
        const orderNos = payments.map(p => p.orderNo).filter(Boolean);

        const allEsims = await Promise.all(
            orderNos.map(async (orderNo) => {
                const existing = await Esim.find({ orderNo });
                if (existing.length > 0) return existing;

                return await create(userId, orderNo);
            })
        );

        return allEsims.flat();
    } catch (error) {
        console.error("eSIM retrieval by user failed:", error.message);
        throw error;
    }
};

export const updateByIccid = async (iccid) => {
    try {
        const existingEsim = await Esim.findOne({ iccid });
        if (!existingEsim) throw new Error("eSIM not found in local database");

        const esimList = await retrieveProfiles({ iccid });
        if (!esimList || esimList.length === 0) throw new Error("eSIM not found via external API");

        const updatedData = esimList[0];

        await Esim.updateOne(
            { iccid },
            { $set: updatedData }
        );

        return await Esim.findOne({ iccid });
    } catch (error) {
        console.error("Failed to update eSIM:", error.message);
        throw error;
    }
};

export default { create, retrieveByUserId, updateByIccid };
