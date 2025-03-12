const pagination = async (model, { query = {}, current = 1, size = 10, sort = {} }) => {
    try {
        current = Math.max(1, parseInt(current, 10) ?? 1);
        size = Math.max(1, parseInt(size, 10) ?? 10);

        const [documentsCount, data] = await Promise.all([
            model.countDocuments(query),
            model.find(query)
                .sort(sort)
                .skip((current - 1) * size)
                .limit(size)
                .lean()
        ]);

        return {
            [model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1) + "s"]: data,
            pagination: {
                currentPage: current,
                totalPages: Math.ceil(documentsCount / size),
                pageSize: size,
                current: data.length,
                total: documentsCount,
            }
        };
    } catch (error) {
        console.error("Pagination Error:", error.message);
        throw new Error("Failed to paginate data. Please try again.");
    }
};

export default pagination;