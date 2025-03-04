import mongoose from "mongoose";
import { DB_URL } from "./env.js";
import { DB_NAME } from "../constant.js";

const dbConnection = async function () {
  try {
    const db = await mongoose.connect(`${DB_URL}/${DB_NAME}`);
    console.log(`Connected to database: ${db.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export { dbConnection };
