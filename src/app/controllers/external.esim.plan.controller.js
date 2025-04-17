import axiosInstance from "../../utils/helpers/axios.instance.js";
import modifyPackagePrices from "../../utils/helpers/modify.package.prices.js";

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

export default { index };