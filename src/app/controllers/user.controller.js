import validateMongooseObjectId from "../../utils/database/validate.mongoose.object.id.js";
import userService from "../services/user.service.js";
import paymentService from "../services/payment.service.js";
import { retrieveProfiles } from "../../utils/helpers/email.on.event.js";

const index = async (req, res) => {
    try {
        const users = await userService.retrieveAll({ size: 1000, query: { accountType: 1, userRole: 1 } });
        return res.response(200, "All user accounts have been retrieved", { users });
    } catch (error) {
        return res.response(500, "Failed to retrieve user accounts", { error: error.message });
    }
}

const show = async (req, res) => {
    try {
        const { userId } = req.params;
        validateMongooseObjectId(userId);

        const user = await userService.retrieveOne({ _id: userId });
        if (!user) return res.response(404, "The user account not found");

        return res.response(200, "user account retrieved successfully", { user });
    } catch (error) {
        return res.response(500, "Failed to retrieve user account", { error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (await userService.retrieveOne({ email })) {
            return res.response(400, "Email is already in use.");
        }

        const user = await userService.create({
            name, email, password, accountType: 2, userRole: 2, verified: true
        });

        return res.response(201, "A new user was created successfully", { user });
    } catch (error) {
        return res.response(400, "Failed to create an user account", { error: error.message });
    }
}

const del = async (req, res) => {
    try {
        const user = await userService.delete(req.params.userId)
        return res.response(200, "User account deleted successfully.", { user });
    } catch (error) {
        return res.response(400, "Failed to delete user account", { error: error.message });
    }
}

const esims = async (req, res) => {
    try {
        const { orderNo } = req.query;

        if (orderNo) {
            const esims = await retrieveProfiles({ orderNo });
            return res.response(200, "All user purchased eSims", { esims });
        }

        const payments = await paymentService.retrieveMany({ userId: req.user._id });
        const orderNos = payments.map(payment => payment.orderNo);

        const esims = await Promise.allSettled(orderNos.map(orderNo => retrieveProfiles({ orderNo })))
            .then(results => results
                .filter(result => result.status === "fulfilled")
                .flatMap(result => result.value)
            );

        return res.response(200, "All user purchased eSims", { esims });
    } catch (error) {
        return res.response(400, "Failed to retrieve user eSims", { error: error.message });
    }
};

export default { index, show, create, delete: del, esims }