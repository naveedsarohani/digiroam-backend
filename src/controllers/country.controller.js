import { Country } from "../models/country.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";

const create = async (req, res, next) => {
  const { countryName, dialingCode, currency } = req.body;

  if ([countryName, dialingCode, currency].some((item) => item.trim() == "")) {
    return next(new ApiError(400, "All fields are require"));
  }

  try {
    const exitsCountry = await Country.findOne({ countryName });

    if (exitsCountry) {
      return next(new ApiError(400, "Country already exists"));
    }

    const country = await Country.create({
      countryName,
      dialingCode,
      currency,
    });

    if (!country) {
      return next(new ApiError(500, "Failed to create Country"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, { country }, "Successfully Created Country"));
  } catch (error) {
    next(error);
  }
};

const getCountries = async (req, res, next) => {
  try {
    const countries = await Country.find({});
    if (!countries) {
      return next(new ApiError(404, "Countries not found"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, { countries }, "Successfully fetched Countries")
      );
  } catch (error) {
    next(error);
  }
};

export { create, getCountries };
