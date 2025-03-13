import axios from "axios";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";

import { dataPackagesResponse } from "../middeware/transformation/responseTransformation.js";
import { ACCESS_CODE, GET_DATA_PACKAGES_URL } from "../config/env.js";

const getDataPackagesList = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;
    console.log("This is req.body " + req.body)
    const dataPackages = await axios.post(
      GET_DATA_PACKAGES_URL,
      body,
      {
        headers,
      }
    );
    console.log(dataPackages)
    if (dataPackages.data?.success === false) {
      const errCode = dataPackages.data.errorCode;
      const errMessage = dataPackages.data.errorMsg;
      return next(new ApiError(404, `The Error message is ${errMessage} and error code is ${errCode}`));
    }

    const transformData = dataPackagesResponse(dataPackages.data.obj);

    res
      .status(200)
      .json(
        new ApiResponse(200, transformData, "Successfully fetched Packages")
      );
  } catch (error) {
    next(error);
  }
};

export { getDataPackagesList };
