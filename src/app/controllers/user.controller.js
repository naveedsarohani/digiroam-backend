import validateMongooseObjectId from "../../utils/database/validate.mongoose.object.id.js";
import userService from "../services/user.service.js";
import paymentService from "../services/payment.service.js";
import emailOnEvent, { retrieveProfiles } from "../../utils/helpers/email.on.event.js";
import filterRequestBody from "../../utils/helpers/filter.request.body.js";
import User from "../models/user.model.js";

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

const myProfile = async (req, res) => {
    try {
        const user = await User.aggregate([
            { $match: { _id: req.user._id, } },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryID",
                    foreignField: "_id",
                    as: "countryId",
                }
            },
            { $addFields: { countryId: { $arrayElemAt: ["$countryId", 0] } } },
            {
                $project: {
                    _id: 1, name: 1, email: 1, phoneNumber: 1, address: 1, countryId: 1, accountType: 1,
                    userRole: 1, createdAt: 1, updatedAt: 1, verified: 1, isSocialUser: 1, address: 1,
                    countryID: "$countryId._id",
                },
            },
        ]);

        if (!user) return res.response(404, "The user account not found");
        return res.response(200, "user account retrieved successfully", { data: { user: user[0] } });
    } catch (error) {
        return res.response(500, "Failed to retrieve user profile details", { error: error.message });
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

const update = async (req, res) => {
    try {
        const data = filterRequestBody(req.body, ["name", "email", "phoneNumber", "address", "countryID"]);
        await userService.update(req.user._id, data);

        return res.response(200, "User account updated successfully");
    } catch (error) {
        return res.response(400, "Failed to update user account", { error: error.message });
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user?._id);

        const isPasswordValid = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordValid) return res.response(400, "Old password is incorrect");

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        await emailOnEvent.passwordChange(user);
        return res.response(200, "Password updated successfully");
    } catch (error) {
        return res.response(400, "Failed to update password", { error: error.message });
    }
};

const del = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findOne({ email: req.user.email }).select("+password");
        if (!user) return res.response(400, "Account not found.");

        if (!(await user.isPasswordCorrect(password))) {
            return res.response(400, "Password did not match");
        }

        await userService.delete(user._id);
        return res.response(200, "Your account has been deactivated");
    } catch (error) {
        return res.response(400, "Failed to deactivate user account", { error: error.message });
    }
};

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

const assignRole = async (req, res, next) => {
    try {
        const { userId } = req.params; const { role } = req.body;

        const user = await User.findOne({ _id: userId });

        if (!user) return res.response(404, "User not found");
        user.userRole = role;
        await user.save({ validateBeforeSave: false });

        return res.response(200, "User role updated successfully");
    } catch (error) {
        return res.response(400, "Failed to update user role", { error: error.message });
    }
};

// const del = async (req, res) => {
//     try {
//         const { password } = req.body;

//         const user = await User.findOne({ _id: userId });

//         if (!user) return res.response(404, "User not found");
//         user.userRole = role;
//         await user.save({ validateBeforeSave: false });

//         return res.response(200, "User role updated successfully");
//     } catch (error) {
//         return res.response(400, "Failed to update user role", { error: error.message });
//     }
// };

export default { index, show, myProfile, create, update, updatePassword, delete: del, esims, assignRole }