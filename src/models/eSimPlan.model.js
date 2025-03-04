import mongoose from "mongoose";

const eSimPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,    
    },
    dataLimit: {
      type: String,
      required: true,
    },
    voiceMinutes: {
      type: Number,
      required: true,
    },
    messageLimits: {
      type: Number,
      required: true,
    },
    validity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  }
); 

export const ESimPlan = mongoose.model("ESimPlan", eSimPlanSchema);
