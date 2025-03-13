import axios from "axios";
import { esim } from "../../config/env.js";

const axiosInstance = axios.create({
    baseURL: esim.baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers['RT-AccessCode'] = esim.accessCode;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;