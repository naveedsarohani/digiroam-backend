const errorHandler = (err, req, res, next) => {
  const statusCode = typeof err.statusCode === "number" ? err.statusCode
    : typeof err.status === "number" ? err.status
      : 500;

  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
