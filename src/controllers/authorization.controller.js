import { User } from "../models/user.model.js";

const index = async (req, res) => {
    try {
        const admins = await User.find({ accountType: 2 });
        return res.response(200, "All admin accounts have been retrieved", { admins });
    } catch (error) {
        return res.response(500, "Failed to retrieve admin accounts", { error: error.message });
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.response(400, "Email is already in use.");

        const admin = await User.create({ name, email, password, accountType: 2, userRole: 2 });
        return res.response(201, "A new admin account has been registered successfully.", { admin });
    } catch (error) {
        console.error("Register Error:", error);
        return res.response(400, "Failed to register an admin account", { error: error.message });
    }
}
const del = async (req, res) => {
    try {
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) return res.response(404, "User not found");

        const admin = await User.findByIdAndDelete(req.params.id);
        return res.response(200, "User account deleted successfully.", { admin });
    } catch (error) {
        return res.response(400, "Failed to delete user account", { error: error.message });
    }
}

export default { admin: { index, register, delete: del } }