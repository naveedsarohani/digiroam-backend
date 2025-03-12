const filterRequestBody = (body, allowedFields) => {
    return Object.fromEntries(
        Object.entries(body).filter(([field, value]) => value && allowedFields.includes(field))
    );
};

export default filterRequestBody;
