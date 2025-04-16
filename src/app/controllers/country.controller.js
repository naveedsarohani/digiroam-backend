import Country from "../models/country.model.js";

const index = async (req, res) => {
    try {
        const countries = await Country.find();
        return res.response(200, "Successfully fetched countries", { countries });
    } catch (error) {
        return res.response(500, "Failed to fetch countries", { error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { countryName, dialingCode, currency } = req.body;

        if (await Country.findOne({ countryName })) {
            return res.response(400, "Country already exists");
        }

        const country = await Country.create({ countryName, dialingCode, currency });
        if (!country) throw new Error("Failed to create country");

        return res.response(200, "The country record has been created", { country })
    } catch (error) {
        return res.response(500, "Failed to creating country record", { error: error.message });
    }
};

export default { index, create };
