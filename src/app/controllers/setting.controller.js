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
        const { pricePercentage, service, contact } = req.body;
        const currentSettings = await settingService.retrieve();

        let updatedData = {};

        // default price percentage
        if (!currentSettings) {
            updatedData.pricePercentage = 1
        }

        // update pricePercentage only if provided
        if (pricePercentage !== undefined) {
            updatedData.pricePercentage = pricePercentage;
        }

        // update or add serviceLinks only if service is provided
        if (service) {
            const serviceLinks = currentSettings.serviceLinks.some(s => s.label === service.label)
                ? currentSettings.serviceLinks.map(s => (s.label === service.label ? service : s))
                : [...currentSettings.serviceLinks, service];

            updatedData.serviceLinks = serviceLinks;
        }

        // update or add contactlist only if contact is provided
        if (contact) {
            const contactlist = currentSettings.contactlist.some(c => c.field === contact.field)
                ? currentSettings.contactlist.map(c => (c.field === contact.field ? contact : c))
                : [...currentSettings.contactlist, contact];

            updatedData.contactlist = contactlist;
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
