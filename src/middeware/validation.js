const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: String(error.details[0].message).replace(/\"/g, ""),
      });
    }
    next();
  };
};

export { validate };
