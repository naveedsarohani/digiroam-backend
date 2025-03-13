import mongoose from 'mongoose';
import { database } from './env.js';

const connect = async () => {
  try {
    const databaseURL = `${database.uri}:${database.port}/${database.name}`;
    await mongoose.connect(databaseURL);
  } catch (error) {
    throw error;
  }
};

export default { connect };