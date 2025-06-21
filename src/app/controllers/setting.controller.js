import settingService from "../services/setting.service.js";

const read = async (req, res) => {
    try {
        const settings = await settingService.retrieve();
        return res.response(200, "The setting document", { settings });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { pricePercentage, minTopupRange, service, contact } = req.body;
        const currentSettings = await settingService.retrieve();

        let updatedData = {};

        // default price percentage and minimum topup range
        if (!currentSettings) {
            updatedData.pricePercentage = 1
            updatedData.minTopupRange = 5
        }

        // update pricePercentage only if provided
        if (pricePercentage !== undefined) {
            updatedData.pricePercentage = pricePercentage;
        }

        // update minTopupRange only if provided
        if (minTopupRange !== undefined) {
            updatedData.minTopupRange = minTopupRange;
        }

        // update or add serviceLinks only if service is provided
        if (service) {
            const serviceLinks = currentSettings.serviceLinks.some(s => s._id.equals(service?._id))
                ? currentSettings.serviceLinks.map(s => s._id.equals(service._id) ? service : s)
                : [...currentSettings.serviceLinks, service];

            updatedData.serviceLinks = serviceLinks;
        }

        // update or add contactList only if contact is provided
        if (contact) {
            const contactList = currentSettings.contactList.some(c => c._id.equals(contact?._id))
                ? currentSettings.contactList.map(c => c._id.equals(contact._id) ? contact : c)
                : [...currentSettings.contactList, contact];

            updatedData.contactList = contactList;
        }

        // at least one field is updated
        if (Object.keys(updatedData).length === 0) {
            return res.response(400, "No valid fields provided for update");
        }

        // service method to update the document
        const settings = await settingService.update(updatedData);
        if (!settings) throw new Error("Failed to save the changes");

        return res.response(200, "Changes have been saved", { settings });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

export default { read, update };
