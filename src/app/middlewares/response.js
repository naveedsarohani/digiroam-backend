// middleware to register response method into response object
const response = (_, res, next) => {
    res.response = (code, message, data = null) => {
        const responseData = { success: code < 400, message };

        if (data && typeof data === "object") {
            Object.assign(responseData, data);
        }

        return res.status(code).json(responseData);
    };

    next();
};

export default response;
