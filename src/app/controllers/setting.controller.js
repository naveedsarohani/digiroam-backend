import settingService from "../services/setting.service.js";

const read = async (req, res) => {
    try {
        const settings = await settingService.retrieve();
        return res.response(200, "The setting document", { settings });
    } catch (error) {
        res.response(500, "Internal server error", { error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { pricePercentage } = req.body;
        const settings = await settingService.update({ pricePercentage });

        return res.response(200, "Setting has been changed", { settings });
    } catch (error) {
        res.response(500, "Internal server error", { error: error.message });
    }
};

export default { read, update };

