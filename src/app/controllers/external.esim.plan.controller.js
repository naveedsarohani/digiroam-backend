import axiosInstance from "../../utils/helpers/axios.instance.js";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup.js";
import modifyPackagePrices from "../../utils/helpers/modify.package.prices.js";
import settingService from "../services/setting.service.js";

const index = async (req, res) => {
    try {
        const packages = await axiosInstance.post("/package/list", { ...req.body });
        if (packages?.data?.success === false) throw new Error(packages.data?.errorMsg);

        const transformData = modifyPackagePrices(packages.data.obj);
        return res.response(200, "Data packages fetched successfully", { data: transformData });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};


const orderEsims = async (req, res) => {
    try {
        const { pricePercentage } = await settingService.retrieve();

        const packages = await axiosInstance.post("/package/list", {});
        if (packages?.data?.success === false) throw new Error(packages.data?.errorMsg);

        const packageInfoList = req.body.packageInfoList.map((order) => {
            const pkg = packages.data.obj.packageList.find((pkg) => pkg.packageCode == order.packageCode);
            return { ...order, price: pkg.price };
        });
        const amount = packageInfoList.reduce((total, { price, count }) => total + (price * count), 0);
        const transactionId = req.body.transactionId;

        const esims = await axiosInstance.post("/esim/order", { transactionId, amount, packageInfoList });
        if (esims?.data?.success === false) throw new Error(esims.data?.errorMsg);

        const data = esims.data.obj;

        const amountWithMarkup = packageInfoList.reduce((total, item) => {
            const basePrice = item.price / 10000;
            const priceWithMarkup = getPriceWithMarkup(basePrice, pricePercentage);
            return total + (priceWithMarkup * 10000) * item.count;
        }, 0);
        return res.response(200, "Order has been placed", { data, amount: amountWithMarkup });
    } catch (error) {
        return res.response(500, error.message);
    }
};

export default { index, orderEsims };