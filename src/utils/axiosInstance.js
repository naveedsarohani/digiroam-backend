import axios from "axios";
import { ACCESS_CODE, ESIM_BASE_URL } from "../config/env.js";

const axiosInstance = axios.create({
    baseURL: ESIM_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        config.headers['RT-AccessCode'] = ACCESS_CODE;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;