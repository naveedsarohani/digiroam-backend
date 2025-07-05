import Buynow from "../models/buynow.model.js";

const upsert = async (req, res) => {
    try {
        const { productId: packageCode, productPrice: price, productQuantity: count } = req.body;

        const buynow = await Buynow.findOneAndUpdate(
            { userId: req.user._id }, { packageCode, price, count }, { upsert: true, setDefaultsOnInsert: true }
        );

        return res.response(201, "OK", { buynow });
    } catch (error) {
        return res.response(400, "Failed to set buy now item", { error: error.message });
    }
}

const clear = async (req, res) => {
    try {
        await Buynow.findOneAndDelete({ userId: req.user._id });
        return res.response(201, "Cleared");
    } catch (error) {
        return res.response(400, "Failed to clear buy now item", { error: error.message });
    }
};

export default { upsert, clear }