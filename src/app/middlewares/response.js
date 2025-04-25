// middleware to register response method into response object
const response = (_, res, next) => {
    res.response = (code, message, data = null) => {
        const safeCode = typeof code === "number" ? code : 500;
      
        const responseData = { success: safeCode < 400, message };
      
        if (data && typeof data === "object") {
          Object.assign(responseData, data);
        }
      
        return res.status(safeCode).json(responseData);
      };      

    next();
};

export default response;
