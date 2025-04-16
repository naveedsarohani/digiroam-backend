import axios from "axios";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";

import { configDotenv } from "dotenv";
import modifyPackagePrices from "../utils/helpers/modify.package.prices.js";

configDotenv();

const getDataPackages = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;

    const dataPackages = await axios.post(
      process.env.GET_DATA_PACKAGES_URL,
      body,
      {
        headers,
      }
    );

    if (dataPackages.data?.success === false) {
      const errCode = dataPackages.data.errorCode;
      const errMessage = dataPackages.data.errorMsg;
      return next(new ApiError(404, errCode, errMessage));
    }

    const transformData = modifyPackagePrices(dataPackages.data.obj);

    res
      .status(200)
      .json(
        new ApiResponse(200, transformData, "Successfully fetched Packages")
      );
  } catch (error) {
    next(error);
  }
};

const getBalance = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
    };

    const balance = await axios.post(process.env.GET_BALANCE_QUERY_URL, "", {
      headers,
    });

    if (balance.data?.success === false) {
      //   const errCode = balance.data.errorCode;
      const errMessage = balance.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = balance.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully fetched Balance"));
  } catch (error) {
    next(error);
  }
};

const orderProfiles = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;

    const orderProfile = await axios.post(
      process.env.GET_ORDER_PROFILE_URL,
      body,
      {
        headers,
      }
    );

    if (orderProfile.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = orderProfile.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = orderProfile.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully fetched Order Profiles"));
  } catch (error) {
    next(error);
  }
};

const allocatedProfiles = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;

    const allocatedProfiles = await axios.post(
      process.env.GET_ALLOCATED_PROFILE_URL,
      body,
      {
        headers,
      }
    );

    if (allocatedProfiles.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = allocatedProfiles.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = allocatedProfiles.data.obj;
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Successfully fetched Allocated Profiles")
      );
  } catch (error) {
    next(error);
  }
};

const cancelProfile = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;

    const cancelProfile = await axios.post(
      process.env.CANCEL_PROFILE_URL,
      body,
      {
        headers,
      }
    );

    if (cancelProfile.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = cancelProfile.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = cancelProfile.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully cancelled Profile"));
  } catch (error) {
    next(error);
  }
};

const suspendProfile = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;

    const suspendProfile = await axios.post(
      process.env.SUSPEND_PROFILE_URL,
      body,
      {
        headers,
      }
    );

    if (suspendProfile.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = suspendProfile.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = suspendProfile.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully cancelled Profile"));
  } catch (error) {
    next(error);
  }
};

const unsuspendProfile = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };

    const body = req.body;

    const unsuspendProfile = await axios.post(
      process.env.UN_SUSPEND_PROFILE_URL,
      body,
      {
        headers,
      }
    );

    if (unsuspendProfile.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = unsuspendProfile.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = unsuspendProfile.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully cancelled Profile"));
  } catch (error) {
    next(error);
  }
};

const revokeProfile = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };
    const body = req.body;

    const revokeProfile = await axios.post(
      process.env.REVOKE_PROFILE_URL,
      body,
      {
        headers,
      }
    );

    if (revokeProfile.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = revokeProfile.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = revokeProfile.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully cancelled Profile"));
  } catch (error) {
    next(error);
  }
};

const topUp = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };
    const body = req.body;

    const topUp = await axios.post(process.env.TOP_UP_URL, body, {
      headers,
    });

    if (topUp.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = topUp.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = topUp.data.obj;
    res.status(200).json(new ApiResponse(200, data, "Successfully Top-Up"));
  } catch (error) {
    next(error);
  }
};

const sendSms = async (req, res, next) => {
  try {
    const headers = {
      "RT-AccessCode": process.env.ACCESS_CODE,
      "Content-Type": "application/json",
    };
    const body = req.body;

    const sendSms = await axios.post(process.env.SEND_SMS_URL, body, {
      headers,
    });

    if (sendSms.data?.success === false) {
      //   const errCode = dataPackages.data.errorCode;
      const errMessage = sendSms.data.errorMsg;
      return next(new ApiError(404, errMessage));
    }

    const data = sendSms.data.obj;
    res
      .status(200)
      .json(new ApiResponse(200, data, "Message sent successfully"));
  } catch (error) {
    next(error);
  }
};

export {
  getDataPackages,
  orderProfiles,
  allocatedProfiles,
  cancelProfile,
  suspendProfile,
  unsuspendProfile,
  revokeProfile,
  topUp,
  getBalance,
  sendSms,
};
