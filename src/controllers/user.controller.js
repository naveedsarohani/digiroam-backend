import { ApiError } from "../utils/ApiError.js";
import User from "../app/models/user.model.js"
import { ApiResponse } from "../utils/ApiResonse.js";
import { generateAndSaveOtp } from "../utils/generateOtp.js";
import { configDotenv } from "dotenv";
import { transporter } from "../utils/sendMail.js";
import { TWILIO_ID, TWILIO_TOKEN, TWILIO_WHATSAPP_NUMBER, SENDER_EMAIL } from "../config/env.js";
import OtpVerification from "../app/models/otp.verification.model.js";
import Twilio from "twilio";
import emailOnEvent from "../utils/helpers/email.on.event.js";

configDotenv();

const twilio_client = Twilio(TWILIO_ID, TWILIO_TOKEN);

const otps = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendWhatsAppOtp = async (req, res, next) => {
  const { phone } = req.body;
  const otp = generateOTP();
  otps[phone] = otp;

  try {
    await twilio_client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
      body: `Your verification code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent via WhatsApp." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP.", error });
  }
};

const CreateUserAndSendOtp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const exits = await User.findOne({ email });

    if (exits) {
      return next(new ApiError(400, "This User Already Exits"));
    }

    const otp = await generateAndSaveOtp(email);

    //send otp to user
    const mailOptions = {
      from: `"RoamDigi" <${SENDER_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
    };

    const mailSend = await transporter.sendMail(mailOptions);

    const user = await User.create({
      name,
      email,
      password,
      accountType: 1,
      userRole: 1,
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { email: user.email },
          "successfully created user and send mail"
        )
      );
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  const { otp, email } = req.body;

  try {
    const findOtp = await OtpVerification.findOne({ email });

    if (!findOtp) {
      return next(new ApiError(404, "Otp not found for this email address"));
    }

    if (findOtp.otp !== otp) {
      return next(new ApiError(400, "Otp is incorrect"));
    }

    if (new Date() > findOtp.expiresAt) {
      return next(new ApiError(400, "Otp has expired"));
    }

    const updateUser = await User.findOne({ email }).select("-password");
    updateUser.verified = true;
    await updateUser.save();

    const accessToken = await updateUser.generateAccessToken();

    const options = {
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { user: updateUser, accessToken: accessToken },
          "Successfully done verification"
        )
      );
  } catch (e) {
    next(e);
  }
};

// const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return next(new ApiError(400, "Email or password is incorrect"));
//     }

//     // dev-only override for selected emails
//     const devEmails = [
//       "devikayenduri1921@gmail.com",
//       "devikasasikumard2001@gmail.com",
//       "94veenavjn@gmail.com",
//       "mh6288499@gmail.com",
//       "manhuss.560@gmail.com"
//     ];

//     const isDevEmail = devEmails.includes(email);
//     const isCorrectPassword = await user.isPasswordCorrect(password);

//     if (isDevEmail) {
//       if (password !== "Saif@786" && !isCorrectPassword) {
//         return next(new ApiError(400, "Email or password is incorrect"));
//       }
//     } else {
//       if (!isCorrectPassword) {
//         return next(new ApiError(400, "Email or password is incorrect"));
//       }
//     }

//     if (!isDevEmail && !user.verified) {
//       const otp = await generateAndSaveOtp(email);
//       const mailOptions = {
//         from: `"RoamDigi" <${SENDER_EMAIL}>`,
//         to: email,
//         subject: "Your OTP Code",
//         text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
//       };
//       await transporter.sendMail(mailOptions);
//       return res.status(403).json({
//         success: false,
//         message: "you are not verified user",
//         data: { email, verified: false },
//       });
//     }

//     const logginedUser = await User.findOne({ email }).select("-password");
//     const accessToken = await logginedUser.generateAccessToken();

//     // login alert email
//     emailOnEvent.newLogin(logginedUser);

//     res.status(200).cookie("accessToken", accessToken, {
//       path: "/", httpOnly: true, sameSite: "None", secure: true,
//     }).json(new ApiResponse(200, { user: logginedUser, accessToken: accessToken }, "Sucessfully logged in"));

//   } catch (error) {
//     next(error);
//   }
// };

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "countryID",
          foreignField: "_id",
          as: "countryId",
        },
      },
      {
        $addFields: {
          countryId: { $arrayElemAt: ["$countryId", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          address: 1,
          countryId: 1,
          accountType: 1,
          userRole: 1,
          createdAt: 1,
          updatedAt: 1,
          verified: 1,
          isSocialUser: 1,
          address: 1,
          countryID: "$countryId._id",
        },
      },
    ]);

    if (!user) {
      return next(new ApiError(400, "Error occur while fetching user profile"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, { user: user[0] }, "Successfully User Profile")
      );
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  const { name, email, phoneNumber, address, countryID } = req.body;

  try {
    const findUser = await User.findOne({ email: req.user.email });

    findUser.name = name || findUser.name;
    findUser.email = email || findUser.email;
    findUser.phoneNumber = phoneNumber || findUser.phoneNumber;
    findUser.address = address || findUser.address;
    findUser.countryID = countryID || findUser.countryID;
    findUser.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully User Profile Updated"));
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  const user = req?.user;

  try {
    if (!user) {
      return next(new ApiError(400, "unauthorized request"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, { user }, "successfully verify token"));
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const options = {
    path: "/",
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "logged out"));
};

const changeCurrentPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
      return next(new ApiError(400, "Invalid old password"));
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    await emailOnEvent.passwordChange(user);
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    next(error);
  }
};

const forgotPasswordRequest = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError(404, "User with this email not found"));
    }
    const otp = await generateAndSaveOtp(email);

    const mailOptions = {
      from: `"RoamDigi" <${SENDER_EMAIL}>`,
      to: email,
      subject: "Password reset request",
      text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
    };

    const mailSend = await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Password reset mail has been sent on your mail id"
        )
      );
  } catch (error) {
    next(error);
  }
};

const forgotPasswordOtpVerification = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const otpVerification = await OtpVerification.findOne({ email });

    if (!otpVerification) {
      return next(new ApiError(409, "Opt not found with this email"));
    }
    //check expires time verification
    let expirationDate = new Date(otpVerification.expiresAt);

    if (new Date() > expirationDate) {
      return next(new ApiError(409, "Otp expired"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError(489, "User not found with this email "));
    }

    if (otpVerification.otp !== otp) {
      return next(new ApiError(409, "Invalid otp verification"));
    }

    //generate hashedPassword
    const { hashedPassword } = user.generateHashedPassword();

    user.password = hashedPassword.slice(10, 18);
    await user.save();

    const mailOptions = {
      from: `"RoamDigi" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your password reset Successfully",
      text: `Your new password is ${hashedPassword.slice(10, 18)}`,
    };

    const mailSend = await transporter.sendMail(mailOptions);

    await emailOnEvent.passwordChange(user);
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Your Password successfully Sent to Email")
      );
  } catch (error) {
    next(error);
  }
};

const assignRole = async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new ApiError(400, "User not found"));
    }
    user.userRole = role;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Role changed for the user"));
  } catch (error) {
    next(error);
  }
};

export {
  // login,
  CreateUserAndSendOtp,
  getMyProfile,
  updateMyProfile,
  verifyToken,
  logout,
  verifyOtp,
  changeCurrentPassword,
  assignRole,
  forgotPasswordRequest,
  forgotPasswordOtpVerification,
  sendWhatsAppOtp
};
