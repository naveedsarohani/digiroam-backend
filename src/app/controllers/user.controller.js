import validateMongooseObjectId from "../../utils/database/validate.mongoose.object.id.js";
import userService from "../services/user.service.js";

const index = async (req, res) => {
    try {
        const users = await userService.retrieveAll(req.body.page ?? { size: 1000, query: { accountType: 1 } });
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

export default { index, show, create, delete: del }