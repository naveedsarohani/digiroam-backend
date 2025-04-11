import { dataPackagesResponse } from "../../middeware/transformation/responseTransformation.js";
import axiosInstance from "../../utils/helpers/axios.instance.js";
import favouritePlanService from "../services/favourite.plan.service.js";

const index = async (req, res) => {
    try {
        const response = await axiosInstance.post("package/list");

        if (response.data?.success === false) {
            return res.response(
                response.data.errorCode ?? 500,
                response.data.errorMsg ?? "Something went wrong"
            );
        }

        const priceSettled = dataPackagesResponse(response.data.obj);
        const favouritePlans = await favouritePlanService.retrieve(req.user._id);

        if (!favouritePlans) {
            return res.response(200, "Your favourite plan list", { plans: [] });
        }

        const userFavouritePlanList = [];

        for (const plan of priceSettled.packageList) {
            for (const fav of favouritePlans.plans) {
                if (
                    plan.packageCode === fav.packageCode &&
                    plan.slug === fav.slug
                ) {
                    userFavouritePlanList.push(plan);
                    break;
                }
            }
        }

        return res.response(200, "All your favourite plans", { plans: userFavouritePlanList });
    } catch (error) {
        return res.response(500, "Error retrieving favourite plans", {
            error: error.message,
        });
    }
};

const upsert = async (req, res) => {
    try {
        const { packageCode, slug } = req.body;

        let favouritePlans = await favouritePlanService.retrieve(req.user._id);

        if (!favouritePlans) {
            favouritePlans = { plans: [{ packageCode, slug }] };
        } else {
            const isAlreadyAdded = favouritePlans.plans.some(
                plan => plan.packageCode === packageCode && plan.slug === slug
            );

            if (!isAlreadyAdded) {
                favouritePlans.plans.push({ packageCode, slug });
            }
        }

        const updated = await favouritePlanService.update(req.user._id, favouritePlans);
        if (!updated) throw new Error("Failed to add plan to favourites");

        return res.response(200, "Plan added to your favourite plans list");
    } catch (error) {
        return res.response(500, "Internal server error", {
            error: error.message,
        });
    }
};

const remove = async (req, res) => {
    try {
        const { packageCode } = req.params;

        const favouritePlans = await favouritePlanService.retrieve(req.user._id);
        if (!favouritePlans) {
            return res.response(404, "No favourite plans found for user");
        }

        const filteredPlans = favouritePlans.plans.filter(
            plan => plan.packageCode !== packageCode
        );

        const updated = await favouritePlanService.update(req.user._id, {
            plans: filteredPlans,
        });

        if (!updated) throw new Error("Failed to remove the plan");

        return res.response(200, "Plan removed from your favourite list");

    } catch (error) {
        return res.response(500, "Internal server error", {
            error: error.message,
        });
    }
};

export default { index, upsert, remove };
