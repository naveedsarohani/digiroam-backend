import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
  
    dialingCode: {
        type: String,
        required: true,
    
    },
    currency: {
        type: String,
        required: true,
        trim: true,
    },
});

export const Country = mongoose.model('Country', countrySchema);
