import axiosInstance from "../../utils/helpers/axios.instance.js";
import modifyPackagePrices from "../../utils/helpers/modify.package.prices.js";

const index = async (req, res, next) => {
    try {
        const packages = await axiosInstance.post("/package/list", { ...req.body });
        if (packages?.data?.success === false) throw new Error(packages.data?.errorMsg);

        const transformData = modifyPackagePrices(packages.data.obj);
        return res.responss(200, "Data packages fetched successfully", { data: transformData });
    } catch (error) {
        next(error);
    }
};

export default { index };