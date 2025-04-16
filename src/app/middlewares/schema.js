const validator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) return res.response(400, String(error.details[0].message).replace(/\"/g, ""));
        next();
    };
};

export default { validator };
