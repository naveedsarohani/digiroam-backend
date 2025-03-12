import mongoose from "mongoose";

// function to validate mongoose ObjectId
const validateMongooseObjectId = (value) => {
    if (!mongoose.isValidObjectId(value)) {
        throw new Error(`The mongoose objectId is invalid`);
    }
}

export default validateMongooseObjectId;