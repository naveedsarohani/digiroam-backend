import mongoose from "mongoose";
import { ESimPlan } from "../models/eSimPlan.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";

const createESimPlan = async (req, res, next) => {
  const {
    planName,
    dataLimit,
    voiceMinutes,
    messageLimits,
    validity,
    price,
    description,
    countryId,
  } = req.body;

  try {
    const eSimPlanExists = await ESimPlan.findOne({ planName, countryId });
    if (eSimPlanExists) {
      return next(
        new ApiError(
          400,
          "ESim Plan already exists with this name and country."
        )
      );
    }
    const newESimPlan = await ESimPlan.create({
      planName,
      dataLimit,
      voiceMinutes,
      messageLimits,
      validity,
      price,
      description,
      countryId,
    });

    if (!newESimPlan) {
      return next(new ApiError(500, "Failed to create ESim Plan."));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { newESimPlan }, "Successfully eSimPlan created")
      );
  } catch (error) {
    next(500, "internal server error: " + error.message);
  }
};

const getAllESimPlan = async (req, res, next) => {
  try {
    const AllESimPlan = await ESimPlan.aggregate([
      {
        $lookup: {
          from: "countries",
          localField: "countryId",
          foreignField: "_id",
          as: "countryId",
        },
      },
      {
        $addFields: {
          countryId: { $arrayElemAt: ["$countryId", 0] },
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { AllESimPlan },
          "successfully get all e sim plans"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getAllESimPlanByCountryId = async (req, res, next) => {
  let { countryId } = req.params;
  countryId = new mongoose.Schema.Types.ObjectId(countryId);
  try {
    const AllESimPlan = await ESimPlan.aggregate([
      {
        $match: { countryId },
      },
      {
        $lookup: {
          from: "countries",
          localField: "countryId",
          foreignField: "_id",
          as: "countryId",
        },
      },
      {
        $addFields: {
          countryId: { $arrayElemAt: ["$countryId", 0] },
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { AllESimPlan },
          "successfully get all e sim plans"
        )
      );
  } catch (error) {
    next(error);
  }
};
const updateESimPlanById = async (req, res, next) => {
  const {
    dataLimit,
    voiceMinutes,
    messageLimits,
    validity,
    price,
    description,
  } = req.body;

  const { id } = req.params;
  try {
    const eSimPlan = await ESimPlan.findOne({ _id: id });
    if (!eSimPlan) {
      return next(new ApiError(404, "ESim Plan not found."));
    }

    eSimPlan.dataLimit = dataLimit;
    eSimPlan.voiceMinutes = voiceMinutes;
    eSimPlan.messageLimits = messageLimits;
    eSimPlan.validity = validity;
    eSimPlan.price = price;
    eSimPlan.description = description;
    await eSimPlan.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "ESim Plan updated successfully"));
  } catch (error) {
    next(error);
  }
};

export {
  createESimPlan,
  getAllESimPlan,
  getAllESimPlanByCountryId,
  updateESimPlanById,
};
